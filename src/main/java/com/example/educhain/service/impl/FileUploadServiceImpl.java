package com.example.educhain.service.impl;

import com.example.educhain.entity.FileUpload;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.FileUploadRepository;
import com.example.educhain.service.FileUploadService;
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

import java.io.File;
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

/**
 * 文件上传服务实现类
 */
@Service
@Transactional
public class FileUploadServiceImpl implements FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadServiceImpl.class);

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Value("${app.file.upload.path:/uploads}")
    private String uploadPath;

    @Value("${app.file.upload.max-size:10485760}") // 10MB
    private long maxFileSize;

    @Value("${app.file.upload.allowed-types:image/jpeg,image/png,image/gif,video/mp4,application/pdf,text/plain}")
    private String allowedTypes;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Value("${app.file.base-url:http://localhost:8080}")
    private String baseUrl;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv"
    );

    private static final Set<String> ALLOWED_DOCUMENT_TYPES = Set.of(
            "application/pdf", "application/msword", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain", "text/csv"
    );

    @Override
    public FileUpload uploadFile(MultipartFile file, Long uploaderId, Long knowledgeId, String description) {
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
            
            // 保存文件
            Path filePath = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 生成文件URL
            String fileUrl = generateFileUrl(datePath, storedName);
            
            // 创建文件记录
            FileUpload fileUpload = new FileUpload(
                    file.getOriginalFilename(),
                    storedName,
                    filePath.toString(),
                    fileUrl,
                    file.getSize(),
                    getFileTypeFromMimeType(file.getContentType()),
                    file.getContentType(),
                    uploaderId
            );
            
            fileUpload.setFileHash(fileHash);
            fileUpload.setKnowledgeId(knowledgeId);
            fileUpload.setDescription(description);
            
            FileUpload savedFile = fileUploadRepository.save(fileUpload);
            logger.info("File uploaded successfully: {}", savedFile.getOriginalName());
            
            return savedFile;
            
        } catch (IOException e) {
            logger.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            throw new BusinessException("FILE_UPLOAD_FAILED", "文件上传失败");
        }
    }

    @Override
    public List<FileUpload> uploadFiles(List<MultipartFile> files, Long uploaderId, Long knowledgeId, String description) {
        List<FileUpload> uploadedFiles = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                FileUpload uploadedFile = uploadFile(file, uploaderId, knowledgeId, description);
                uploadedFiles.add(uploadedFile);
            } catch (Exception e) {
                logger.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                // 继续上传其他文件，不中断整个过程
            }
        }
        
        return uploadedFiles;
    }

    @Override
    @Transactional(readOnly = true)
    public FileUpload getFileById(Long fileId) {
        return fileUploadRepository.findById(fileId)
                .filter(file -> file.getStatus() == 1)
                .orElseThrow(() -> new BusinessException("FILE_NOT_FOUND", "文件不存在"));
    }

    @Override
    @Transactional(readOnly = true)
    public FileUpload getFileByStoredName(String storedName) {
        return fileUploadRepository.findByStoredNameAndStatus(storedName, 1)
                .orElseThrow(() -> new BusinessException("FILE_NOT_FOUND", "文件不存在"));
    }

    @Override
    @Transactional(readOnly = true)
    public String getFileAccessUrl(Long fileId) {
        FileUpload file = getFileById(fileId);
        return file.getFileUrl();
    }

    @Override
    @Transactional(readOnly = true)
    public String getFileDownloadUrl(Long fileId) {
        FileUpload file = getFileById(fileId);
        return baseUrl + contextPath + "/api/files/" + fileId + "/download";
    }

    @Override
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

    @Override
    public void physicalDeleteFile(Long fileId) {
        FileUpload file = fileUploadRepository.findById(fileId)
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

    @Override
    @Transactional(readOnly = true)
    public Page<FileUpload> getUserFiles(Long uploaderId, Pageable pageable) {
        return fileUploadRepository.findByUploaderIdAndStatus(uploaderId, 1, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileUpload> getKnowledgeFiles(Long knowledgeId) {
        return fileUploadRepository.findByKnowledgeIdAndStatus(knowledgeId, 1);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FileUpload> getFilesByType(String fileType, Pageable pageable) {
        return fileUploadRepository.findByFileTypeAndStatus(fileType, 1, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FileUpload> searchFiles(String keyword, Pageable pageable) {
        return fileUploadRepository.findByOriginalNameContainingIgnoreCaseAndStatus(keyword, 1, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FileUpload> getPopularFiles(Pageable pageable) {
        return fileUploadRepository.findPopularFiles(1, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FileUpload> getRecentFiles(Pageable pageable) {
        return fileUploadRepository.findRecentUploads(1, pageable);
    }

    @Override
    public void incrementDownloadCount(Long fileId) {
        fileUploadRepository.incrementDownloadCount(fileId, LocalDateTime.now());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean fileExists(String fileHash) {
        return fileUploadRepository.findByFileHashAndStatus(fileHash, 1).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public FileUploadStats getFileStats() {
        Long totalFiles = fileUploadRepository.getTotalFileCount(1);
        Long totalSize = fileUploadRepository.getTotalFileSize(1);
        Long totalDownloads = fileUploadRepository.getTotalDownloadCount(1);
        
        // 获取各类型文件统计
        List<Object[]> typeStats = fileUploadRepository.countByFileTypeAndStatus(1);
        Map<String, Long> typeCountMap = typeStats.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));
        
        return new FileUploadStats(
                totalFiles != null ? totalFiles : 0L,
                totalSize != null ? totalSize : 0L,
                totalDownloads != null ? totalDownloads : 0L,
                typeCountMap.getOrDefault("image", 0L),
                typeCountMap.getOrDefault("video", 0L),
                typeCountMap.getOrDefault("document", 0L),
                typeCountMap.getOrDefault("other", 0L)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserFileStats getUserFileStats(Long uploaderId) {
        Long fileCount = fileUploadRepository.countByUploaderIdAndStatus(uploaderId, 1);
        Long totalSize = fileUploadRepository.sumFileSizeByUploaderIdAndStatus(uploaderId, 1);
        
        String readableSize = formatFileSize(totalSize != null ? totalSize : 0L);
        
        return new UserFileStats(
                fileCount != null ? fileCount : 0L,
                totalSize != null ? totalSize : 0L,
                readableSize
        );
    }

    @Override
    public int cleanupOrphanFiles(int daysThreshold) {
        LocalDateTime before = LocalDateTime.now().minusDays(daysThreshold);
        return fileUploadRepository.deleteOrphanFilesBefore(before);
    }

    @Override
    public int cleanupDuplicateFiles() {
        List<Object[]> duplicates = fileUploadRepository.findDuplicateFiles(1);
        int cleanedCount = 0;
        
        for (Object[] duplicate : duplicates) {
            String fileHash = (String) duplicate[0];
            List<FileUpload> duplicateFiles = fileUploadRepository.findByFileHashAndStatusOrderByCreatedAtAsc(fileHash, 1);
            
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

    @Override
    public boolean isValidFileType(String mimeType) {
        if (mimeType == null) return false;
        
        Set<String> allowedTypesSet = Arrays.stream(allowedTypes.split(","))
                .map(String::trim)
                .collect(Collectors.toSet());
        
        return allowedTypesSet.contains(mimeType) ||
               ALLOWED_IMAGE_TYPES.contains(mimeType) ||
               ALLOWED_VIDEO_TYPES.contains(mimeType) ||
               ALLOWED_DOCUMENT_TYPES.contains(mimeType);
    }

    @Override
    public boolean isValidFileSize(long fileSize) {
        return fileSize > 0 && fileSize <= maxFileSize;
    }

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