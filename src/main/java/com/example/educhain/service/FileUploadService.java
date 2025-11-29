package com.example.educhain.service;

import com.example.educhain.entity.FileUpload;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/** 文件上传服务接口 */
public interface FileUploadService {

  /** 上传单个文件 */
  FileUpload uploadFile(MultipartFile file, Long uploaderId, Long knowledgeId, String description);

  /** 上传多个文件 */
  List<FileUpload> uploadFiles(
      List<MultipartFile> files, Long uploaderId, Long knowledgeId, String description);

  /** 根据ID获取文件信息 */
  FileUpload getFileById(Long fileId);

  /** 根据存储名称获取文件信息 */
  FileUpload getFileByStoredName(String storedName);

  /** 获取文件的访问URL */
  String getFileAccessUrl(Long fileId);

  /** 获取文件的下载URL */
  String getFileDownloadUrl(Long fileId);

  /** 删除文件（软删除） */
  void deleteFile(Long fileId, Long operatorId);

  /** 批量删除文件 */
  void deleteFiles(List<Long> fileIds, Long operatorId);

  /** 物理删除文件 */
  void physicalDeleteFile(Long fileId);

  /** 获取用户上传的文件列表 */
  Page<FileUpload> getUserFiles(Long uploaderId, Pageable pageable);

  /** 获取知识内容关联的文件列表 */
  List<FileUpload> getKnowledgeFiles(Long knowledgeId);

  /** 根据文件类型获取文件列表 */
  Page<FileUpload> getFilesByType(String fileType, Pageable pageable);

  /** 搜索文件 */
  Page<FileUpload> searchFiles(String keyword, Pageable pageable);

  /** 获取热门文件 */
  Page<FileUpload> getPopularFiles(Pageable pageable);

  /** 获取最近上传的文件 */
  Page<FileUpload> getRecentFiles(Pageable pageable);

  /** 增加文件下载次数 */
  void incrementDownloadCount(Long fileId);

  /** 检查文件是否存在 */
  boolean fileExists(String fileHash);

  /** 获取文件统计信息 */
  FileUploadStats getFileStats();

  /** 获取用户文件统计信息 */
  UserFileStats getUserFileStats(Long uploaderId);

  /** 清理孤儿文件 */
  int cleanupOrphanFiles(int daysThreshold);

  /** 清理重复文件 */
  int cleanupDuplicateFiles();

  /** 验证文件类型 */
  boolean isValidFileType(String mimeType);

  /** 验证文件大小 */
  boolean isValidFileSize(long fileSize);

  /** 生成文件哈希值 */
  String generateFileHash(MultipartFile file);

  /** 文件上传统计信息 */
  class FileUploadStats {
    private Long totalFiles;
    private Long totalSize;
    private Long totalDownloads;
    private Long imageCount;
    private Long videoCount;
    private Long documentCount;
    private Long otherCount;

    // Constructors, getters and setters
    public FileUploadStats() {}

    public FileUploadStats(
        Long totalFiles,
        Long totalSize,
        Long totalDownloads,
        Long imageCount,
        Long videoCount,
        Long documentCount,
        Long otherCount) {
      this.totalFiles = totalFiles;
      this.totalSize = totalSize;
      this.totalDownloads = totalDownloads;
      this.imageCount = imageCount;
      this.videoCount = videoCount;
      this.documentCount = documentCount;
      this.otherCount = otherCount;
    }

    public Long getTotalFiles() {
      return totalFiles;
    }

    public void setTotalFiles(Long totalFiles) {
      this.totalFiles = totalFiles;
    }

    public Long getTotalSize() {
      return totalSize;
    }

    public void setTotalSize(Long totalSize) {
      this.totalSize = totalSize;
    }

    public Long getTotalDownloads() {
      return totalDownloads;
    }

    public void setTotalDownloads(Long totalDownloads) {
      this.totalDownloads = totalDownloads;
    }

    public Long getImageCount() {
      return imageCount;
    }

    public void setImageCount(Long imageCount) {
      this.imageCount = imageCount;
    }

    public Long getVideoCount() {
      return videoCount;
    }

    public void setVideoCount(Long videoCount) {
      this.videoCount = videoCount;
    }

    public Long getDocumentCount() {
      return documentCount;
    }

    public void setDocumentCount(Long documentCount) {
      this.documentCount = documentCount;
    }

    public Long getOtherCount() {
      return otherCount;
    }

    public void setOtherCount(Long otherCount) {
      this.otherCount = otherCount;
    }
  }

  /** 用户文件统计信息 */
  class UserFileStats {
    private Long fileCount;
    private Long totalSize;
    private String readableSize;

    public UserFileStats() {}

    public UserFileStats(Long fileCount, Long totalSize, String readableSize) {
      this.fileCount = fileCount;
      this.totalSize = totalSize;
      this.readableSize = readableSize;
    }

    public Long getFileCount() {
      return fileCount;
    }

    public void setFileCount(Long fileCount) {
      this.fileCount = fileCount;
    }

    public Long getTotalSize() {
      return totalSize;
    }

    public void setTotalSize(Long totalSize) {
      this.totalSize = totalSize;
    }

    public String getReadableSize() {
      return readableSize;
    }

    public void setReadableSize(String readableSize) {
      this.readableSize = readableSize;
    }
  }
}
