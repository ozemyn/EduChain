package com.example.educhain.service.impl;

import com.example.educhain.entity.FileUpload;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.FileUploadRepository;
import com.example.educhain.service.FileUploadService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/** 文件上传服务实现类 */
@Service
public class FileUploadServiceImpl implements FileUploadService {

  private static final Logger logger = LoggerFactory.getLogger(FileUploadServiceImpl.class);

  @Autowired private FileUploadRepository fileUploadRepository;

  @Value("${app.file.upload.path:/uploads}")
  private String uploadPath;

  @Value("${app.file.upload.max-size:10485760}") // 10MB
  private long maxFileSize;

  @Value(
      "${app.file.upload.allowed-types:image/jpeg,image/png,image/gif,video/mp4,application/pdf,text/plain}")
  private String allowedTypes;

  @Value("${server.servlet.context-path:}")
  private String contextPath;

  @Value("${app.file.base-url:http://localhost:8080}")
  private String baseUrl;

  private static final Set<String> ALLOWED_IMAGE_TYPES =
      Set.of("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");

  private static final Set<String> ALLOWED_VIDEO_TYPES =
      Set.of("video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv");

  private static final Set<String> ALLOWED_DOCUMENT_TYPES =
      Set.of(
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          "text/csv");

  /**
   * 上传单个文件 验证文件有效性，生成文件哈希值检查重复，保存文件到存储系统并创建数据库记录 支持相同文件的去重机制
   *
   * @param file 要上传的文件
   * @param uploaderId 上传者ID
   * @param knowledgeId 关联的知识内容ID
   * @param description 文件描述
   * @return 上传成功的文件记录
   * @throws BusinessException 文件验证失败或上传过程出错时抛出
   */
  @Override
  @Transactional
  public FileUpload uploadFile(
      MultipartFile file, Long uploaderId, Long knowledgeId, String description) {
    validateFile(file);

    try {
      // 生成文件哈希值
      String fileHash = generateFileHash(file);

      // 检查是否已存在相同文件
      Optional<FileUpload> existingFile = fileUploadRepository.findByFileHashAndStatus(fileHash, 1);
      if (existingFile.isPresent()) {
        logger.info("File with hash {} already exists, returning existing file", fileHash);
        return existingFile.get();
      }

      // 生成存储文件名
      String storedName = generateStoredFileName(file.getOriginalFilename());

      // 创建存储目录
      String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
      Path uploadDir = Paths.get(uploadPath, datePath);
      Files.createDirectories(uploadDir);

      // 保存文件（使用try-with-resources确保流正确关闭）
      Path filePath = uploadDir.resolve(storedName);
      try (var inputStream = file.getInputStream()) {
        Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
      }

      // 生成文件URL
      String fileUrl = generateFileUrl(datePath, storedName);

      // 创建文件记录
      FileUpload fileUpload =
          new FileUpload(
              file.getOriginalFilename(),
              storedName,
              filePath.toString(),
              fileUrl,
              file.getSize(),
              getFileTypeFromMimeType(file.getContentType()),
              file.getContentType(),
              uploaderId);

      fileUpload.setFileHash(fileHash);
      fileUpload.setKnowledgeId(knowledgeId);
      fileUpload.setDescription(description);

      FileUpload savedFile = fileUploadRepository.save(fileUpload);
      logger.info("File uploaded successfully: {}", savedFile.getOriginalName());

      return savedFile;

    } catch (IOException e) {
      logger.error(
          "文件上传失败: fileName={}, size={}, contentType={}, uploaderId={}, error={}",
          file.getOriginalFilename(),
          file.getSize(),
          file.getContentType(),
          uploaderId,
          e.getMessage(),
          e);
      throw new BusinessException(
          "FILE_UPLOAD_FAILED", String.format("文件上传失败: %s", e.getMessage()));
    } catch (Exception e) {
      logger.error(
          "文件上传失败: fileName={}, size={}, uploaderId={}, error={}",
          file.getOriginalFilename(),
          file.getSize(),
          uploaderId,
          e.getMessage(),
          e);
      throw new BusinessException("FILE_UPLOAD_FAILED", "文件上传失败");
    }
  }

  /**
   * 批量上传文件 逐个上传文件列表中的每个文件，单个文件上传失败不影响其他文件
   *
   * @param files 要上传的文件列表
   * @param uploaderId 上传者ID
   * @param knowledgeId 关联的知识内容ID
   * @param description 文件描述
   * @return 上传成功的文件记录列表
   */
  @Override
  public List<FileUpload> uploadFiles(
      List<MultipartFile> files, Long uploaderId, Long knowledgeId, String description) {
    List<FileUpload> uploadedFiles = new ArrayList<>();

    for (MultipartFile file : files) {
      try {
        FileUpload uploadedFile = uploadFile(file, uploaderId, knowledgeId, description);
        uploadedFiles.add(uploadedFile);
      } catch (Exception e) {
        logger.error(
            "批量上传文件失败: fileName={}, size={}, uploaderId={}, knowledgeId={}, error={}",
            file.getOriginalFilename(),
            file.getSize(),
            uploaderId,
            knowledgeId,
            e.getMessage(),
            e);
        // 继续上传其他文件，不中断整个过程
      }
    }

    return uploadedFiles;
  }

  /**
   * 根据ID获取文件 查询指定ID的文件记录，只返回状态为正常的文件
   *
   * @param fileId 文件ID
   * @return 文件记录
   * @throws BusinessException 文件不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public FileUpload getFileById(Long fileId) {
    return fileUploadRepository
        .findById(fileId)
        .filter(file -> file.getStatus() == 1)
        .orElseThrow(() -> new BusinessException("FILE_NOT_FOUND", "文件不存在"));
  }

  /**
   * 根据存储名称获取文件 查询指定存储名称的文件记录，只返回状态为正常的文件
   *
   * @param storedName 存储名称
   * @return 文件记录
   * @throws BusinessException 文件不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public FileUpload getFileByStoredName(String storedName) {
    return fileUploadRepository
        .findByStoredNameAndStatus(storedName, 1)
        .orElseThrow(() -> new BusinessException("FILE_NOT_FOUND", "文件不存在"));
  }

  /**
   * 获取文件访问URL 获取指定文件的在线访问URL
   *
   * @param fileId 文件ID
   * @return 文件访问URL
   * @throws BusinessException 文件不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public String getFileAccessUrl(Long fileId) {
    FileUpload file = getFileById(fileId);
    return file.getFileUrl();
  }

  /**
   * 获取文件下载URL 获取指定文件的下载URL
   *
   * @param fileId 文件ID
   * @return 文件下载URL
   * @throws BusinessException 文件不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public String getFileDownloadUrl(Long fileId) {
    FileUpload file = getFileById(fileId);
    return baseUrl + contextPath + "/api/files/" + fileId + "/download";
  }

  /**
   * 删除文件（软删除） 将文件状态设置为已删除，不实际删除物理文件 只有文件上传者可以删除文件
   *
   * @param fileId 文件ID
   * @param operatorId 操作者ID
   * @throws BusinessException 文件不存在或权限不足时抛出
   */
  @Override
  @Transactional
  public void deleteFile(Long fileId, Long operatorId) {
    FileUpload file = getFileById(fileId);

    // 检查权限（只有上传者或管理员可以删除）
    if (!file.getUploaderId().equals(operatorId)) {
      throw new BusinessException("ACCESS_DENIED", "无权限删除此文件");
    }

    file.setStatus(0); // 软删除
    fileUploadRepository.save(file);

    logger.info("File deleted by user {}: {}", operatorId, file.getOriginalName());
  }

  /**
   * 批量删除文件 逐个删除指定ID的文件，单个文件删除失败不影响其他文件
   *
   * @param fileIds 文件ID列表
   * @param operatorId 操作者ID
   */
  @Override
  public void deleteFiles(List<Long> fileIds, Long operatorId) {
    for (Long fileId : fileIds) {
      try {
        deleteFile(fileId, operatorId);
      } catch (Exception e) {
        logger.error("Failed to delete file {}: {}", fileId, e.getMessage());
      }
    }
  }

  /**
   * 物理删除文件 实际删除文件的物理存储和数据库记录
   *
   * @param fileId 文件ID
   * @throws BusinessException 文件不存在或删除过程出错时抛出
   */
  @Override
  @Transactional
  public void physicalDeleteFile(Long fileId) {
    FileUpload file =
        fileUploadRepository
            .findById(fileId)
            .orElseThrow(() -> new BusinessException("FILE_NOT_FOUND", "文件不存在"));

    try {
      // 删除物理文件
      Path filePath = Paths.get(file.getFilePath());
      Files.deleteIfExists(filePath);

      // 删除数据库记录
      fileUploadRepository.delete(file);

      logger.info("File physically deleted: {}", file.getOriginalName());

    } catch (IOException e) {
      logger.error("Failed to physically delete file: {}", file.getOriginalName(), e);
      throw new BusinessException("FILE_DELETE_FAILED", "文件删除失败");
    }
  }

  /**
   * 获取用户上传的文件 分页查询指定用户上传的所有文件
   *
   * @param uploaderId 上传者ID
   * @param pageable 分页参数
   * @return 文件记录分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FileUpload> getUserFiles(Long uploaderId, Pageable pageable) {
    return fileUploadRepository.findByUploaderIdAndStatus(uploaderId, 1, pageable);
  }

  /**
   * 获取知识内容关联的文件 查询与指定知识内容关联的所有文件
   *
   * @param knowledgeId 知识内容ID
   * @return 文件记录列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<FileUpload> getKnowledgeFiles(Long knowledgeId) {
    return fileUploadRepository.findByKnowledgeIdAndStatus(knowledgeId, 1);
  }

  /**
   * 根据文件类型获取文件 分页查询指定类型的文件
   *
   * @param fileType 文件类型（image、video、document等）
   * @param pageable 分页参数
   * @return 文件记录分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FileUpload> getFilesByType(String fileType, Pageable pageable) {
    return fileUploadRepository.findByFileTypeAndStatus(fileType, 1, pageable);
  }

  /**
   * 搜索文件 根据关键词模糊匹配文件原始名称
   *
   * @param keyword 搜索关键词
   * @param pageable 分页参数
   * @return 文件记录分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FileUpload> searchFiles(String keyword, Pageable pageable) {
    return fileUploadRepository.findByOriginalNameContainingIgnoreCaseAndStatus(
        keyword, 1, pageable);
  }

  /**
   * 获取热门文件 根据下载次数排序获取热门文件
   *
   * @param pageable 分页参数
   * @return 热门文件记录分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FileUpload> getPopularFiles(Pageable pageable) {
    return fileUploadRepository.findPopularFiles(1, pageable);
  }

  /**
   * 获取最近上传的文件 按上传时间倒序获取最近上传的文件
   *
   * @param pageable 分页参数
   * @return 最近上传的文件记录分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FileUpload> getRecentFiles(Pageable pageable) {
    return fileUploadRepository.findRecentUploads(1, pageable);
  }

  /**
   * 增加文件下载次数 更新文件记录中的下载次数和最后下载时间
   *
   * @param fileId 文件ID
   */
  @Override
  @Transactional
  public void incrementDownloadCount(Long fileId) {
    fileUploadRepository.incrementDownloadCount(fileId, LocalDateTime.now());
  }

  /**
   * 检查文件是否存在 根据文件哈希值检查相同文件是否已存在
   *
   * @param fileHash 文件哈希值
   * @return 文件存在返回true，否则返回false
   */
  @Override
  @Transactional(readOnly = true)
  public boolean fileExists(String fileHash) {
    return fileUploadRepository.findByFileHashAndStatus(fileHash, 1).isPresent();
  }

  /**
   * 获取文件统计信息 包括总文件数、总大小、总下载次数以及各类型文件统计
   *
   * @return 文件统计信息
   */
  @Override
  @Transactional(readOnly = true)
  public FileUploadStats getFileStats() {
    Long totalFiles = fileUploadRepository.getTotalFileCount(1);
    Long totalSize = fileUploadRepository.getTotalFileSize(1);
    Long totalDownloads = fileUploadRepository.getTotalDownloadCount(1);

    // 获取各类型文件统计
    List<Object[]> typeStats = fileUploadRepository.countByFileTypeAndStatus(1);
    Map<String, Long> typeCountMap =
        typeStats.stream().collect(Collectors.toMap(row -> (String) row[0], row -> (Long) row[1]));

    return new FileUploadStats(
        totalFiles != null ? totalFiles : 0L,
        totalSize != null ? totalSize : 0L,
        totalDownloads != null ? totalDownloads : 0L,
        typeCountMap.getOrDefault("image", 0L),
        typeCountMap.getOrDefault("video", 0L),
        typeCountMap.getOrDefault("document", 0L),
        typeCountMap.getOrDefault("other", 0L));
  }

  /**
   * 获取用户文件统计信息 包括用户上传的文件数、总大小等信息
   *
   * @param uploaderId 上传者ID
   * @return 用户文件统计信息
   */
  @Override
  @Transactional(readOnly = true)
  public UserFileStats getUserFileStats(Long uploaderId) {
    Long fileCount = fileUploadRepository.countByUploaderIdAndStatus(uploaderId, 1);
    Long totalSize = fileUploadRepository.sumFileSizeByUploaderIdAndStatus(uploaderId, 1);

    String readableSize = formatFileSize(totalSize != null ? totalSize : 0L);

    return new UserFileStats(
        fileCount != null ? fileCount : 0L, totalSize != null ? totalSize : 0L, readableSize);
  }

  /**
   * 清理孤立文件 删除超过指定天数且未关联到任何知识内容的文件
   *
   * @param daysThreshold 天数阈值
   * @return 清理的文件数量
   */
  @Override
  @Transactional
  public int cleanupOrphanFiles(int daysThreshold) {
    LocalDateTime before = LocalDateTime.now().minusDays(daysThreshold);
    return fileUploadRepository.deleteOrphanFilesBefore(before);
  }

  /**
   * 清理重复文件 保留最早的文件记录，将其他重复文件标记为已删除
   *
   * @return 清理的重复文件数量
   */
  @Override
  @Transactional
  public int cleanupDuplicateFiles() {
    List<Object[]> duplicates = fileUploadRepository.findDuplicateFiles(1);
    int cleanedCount = 0;

    for (Object[] duplicate : duplicates) {
      String fileHash = (String) duplicate[0];
      List<FileUpload> duplicateFiles =
          fileUploadRepository.findByFileHashAndStatusOrderByCreatedAtAsc(fileHash, 1);

      // 保留最早的文件，删除其他重复文件
      for (int i = 1; i < duplicateFiles.size(); i++) {
        FileUpload fileToDelete = duplicateFiles.get(i);
        fileToDelete.setStatus(0);
        fileUploadRepository.save(fileToDelete);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * 验证文件类型是否有效 检查文件MIME类型是否在允许的类型列表中
   *
   * @param mimeType 文件MIME类型
   * @return 类型有效返回true，否则返回false
   */
  @Override
  public boolean isValidFileType(String mimeType) {
    if (mimeType == null) return false;

    Set<String> allowedTypesSet =
        Arrays.stream(allowedTypes.split(",")).map(String::trim).collect(Collectors.toSet());

    return allowedTypesSet.contains(mimeType)
        || ALLOWED_IMAGE_TYPES.contains(mimeType)
        || ALLOWED_VIDEO_TYPES.contains(mimeType)
        || ALLOWED_DOCUMENT_TYPES.contains(mimeType);
  }

  /**
   * 验证文件大小是否有效 检查文件大小是否在允许的范围内
   *
   * @param fileSize 文件大小
   * @return 大小有效返回true，否则返回false
   */
  @Override
  public boolean isValidFileSize(long fileSize) {
    return fileSize > 0 && fileSize <= maxFileSize;
  }

  /**
   * 生成文件哈希值 使用MD5算法生成文件内容的哈希值，用于文件去重
   *
   * @param file 文件
   * @return 文件哈希值
   */
  @Override
  public String generateFileHash(MultipartFile file) {
    try {
      MessageDigest md = MessageDigest.getInstance("MD5");
      byte[] hashBytes = md.digest(file.getBytes());

      StringBuilder sb = new StringBuilder();
      for (byte b : hashBytes) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();

    } catch (NoSuchAlgorithmException | IOException e) {
      logger.error("Failed to generate file hash", e);
      return UUID.randomUUID().toString().replace("-", "");
    }
  }

  private void validateFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BusinessException("FILE_EMPTY", "文件不能为空");
    }

    if (!isValidFileSize(file.getSize())) {
      throw new BusinessException("FILE_SIZE_EXCEEDED", "文件大小超过限制");
    }

    if (!isValidFileType(file.getContentType())) {
      throw new BusinessException("FILE_TYPE_NOT_ALLOWED", "不支持的文件类型");
    }
  }

  private String generateStoredFileName(String originalFilename) {
    String extension = StringUtils.getFilenameExtension(originalFilename);
    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
    String randomStr = UUID.randomUUID().toString().substring(0, 8);

    return timestamp + "_" + randomStr + (extension != null ? "." + extension : "");
  }

  private String generateFileUrl(String datePath, String storedName) {
    return baseUrl + contextPath + "/uploads/" + datePath + "/" + storedName;
  }

  private String getFileTypeFromMimeType(String mimeType) {
    if (mimeType == null) return "other";

    if (ALLOWED_IMAGE_TYPES.contains(mimeType)) return "image";
    if (ALLOWED_VIDEO_TYPES.contains(mimeType)) return "video";
    if (ALLOWED_DOCUMENT_TYPES.contains(mimeType)) return "document";

    return "other";
  }

  private String formatFileSize(long size) {
    if (size <= 0) return "0 B";

    String[] units = {"B", "KB", "MB", "GB", "TB"};
    int unitIndex = 0;
    double fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return String.format("%.1f %s", fileSize, units[unitIndex]);
  }
}
