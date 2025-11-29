package com.example.educhain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 文件上传实体类 */
@Entity
@Table(
    name = "file_uploads",
    indexes = {
      @Index(name = "idx_uploader_id", columnList = "uploader_id"),
      @Index(name = "idx_file_type", columnList = "file_type"),
      @Index(name = "idx_status", columnList = "status"),
      @Index(name = "idx_created_at", columnList = "created_at"),
      @Index(name = "idx_file_hash", columnList = "file_hash")
    })
@EntityListeners(AuditingEntityListener.class)
public class FileUpload {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "original_name", nullable = false, length = 255)
  @NotBlank(message = "原始文件名不能为空")
  @Size(max = 255, message = "文件名长度不能超过255个字符")
  private String originalName;

  @Column(name = "stored_name", nullable = false, length = 255)
  @NotBlank(message = "存储文件名不能为空")
  private String storedName;

  @Column(name = "file_path", nullable = false, length = 500)
  @NotBlank(message = "文件路径不能为空")
  private String filePath;

  @Column(name = "file_url", nullable = false, length = 500)
  @NotBlank(message = "文件URL不能为空")
  private String fileUrl;

  @Column(name = "file_size", nullable = false)
  private Long fileSize;

  @Column(name = "file_type", nullable = false, length = 100)
  @NotBlank(message = "文件类型不能为空")
  private String fileType;

  @Column(name = "mime_type", length = 100)
  private String mimeType;

  @Column(name = "file_hash", length = 64)
  private String fileHash; // MD5 或 SHA256 哈希值，用于去重

  @Column(name = "uploader_id", nullable = false)
  private Long uploaderId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "uploader_id", insertable = false, updatable = false)
  private User uploader;

  @Column(name = "knowledge_id")
  private Long knowledgeId; // 关联的知识内容ID，可为空

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "knowledge_id", insertable = false, updatable = false)
  private KnowledgeItem knowledgeItem;

  @Column(name = "download_count", nullable = false)
  private Long downloadCount = 0L;

  @Column(name = "last_accessed_at")
  private LocalDateTime lastAccessedAt;

  @Column(nullable = false)
  private Integer status = 1; // 1: 正常, 0: 删除, 2: 待审核

  @Column(length = 500)
  private String description;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // 文件类型枚举
  public enum FileType {
    IMAGE("image", "图片"),
    VIDEO("video", "视频"),
    AUDIO("audio", "音频"),
    DOCUMENT("document", "文档"),
    ARCHIVE("archive", "压缩包"),
    OTHER("other", "其他");

    private final String code;
    private final String description;

    FileType(String code, String description) {
      this.code = code;
      this.description = description;
    }

    public String getCode() {
      return code;
    }

    public String getDescription() {
      return description;
    }

    public static FileType fromMimeType(String mimeType) {
      if (mimeType == null) return OTHER;

      if (mimeType.startsWith("image/")) return IMAGE;
      if (mimeType.startsWith("video/")) return VIDEO;
      if (mimeType.startsWith("audio/")) return AUDIO;
      if (mimeType.startsWith("application/pdf")
          || mimeType.startsWith("application/msword")
          || mimeType.startsWith("application/vnd.openxmlformats-officedocument")
          || mimeType.startsWith("text/")) return DOCUMENT;
      if (mimeType.startsWith("application/zip")
          || mimeType.startsWith("application/x-rar")
          || mimeType.startsWith("application/x-7z")) return ARCHIVE;

      return OTHER;
    }
  }

  // 默认构造函数
  public FileUpload() {}

  // 构造函数
  public FileUpload(
      String originalName,
      String storedName,
      String filePath,
      String fileUrl,
      Long fileSize,
      String fileType,
      String mimeType,
      Long uploaderId) {
    this.originalName = originalName;
    this.storedName = storedName;
    this.filePath = filePath;
    this.fileUrl = fileUrl;
    this.fileSize = fileSize;
    this.fileType = fileType;
    this.mimeType = mimeType;
    this.uploaderId = uploaderId;
  }

  /** 增加下载次数 */
  public void incrementDownloadCount() {
    this.downloadCount++;
    this.lastAccessedAt = LocalDateTime.now();
  }

  /** 检查文件是否为图片 */
  public boolean isImage() {
    return mimeType != null && mimeType.startsWith("image/");
  }

  /** 检查文件是否为视频 */
  public boolean isVideo() {
    return mimeType != null && mimeType.startsWith("video/");
  }

  /** 检查文件是否为文档 */
  public boolean isDocument() {
    return mimeType != null
        && (mimeType.startsWith("application/pdf")
            || mimeType.startsWith("application/msword")
            || mimeType.startsWith("application/vnd.openxmlformats-officedocument")
            || mimeType.startsWith("text/"));
  }

  /** 获取文件大小的可读格式 */
  public String getReadableFileSize() {
    if (fileSize == null) return "0 B";

    long size = fileSize;
    String[] units = {"B", "KB", "MB", "GB", "TB"};
    int unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return size + " " + units[unitIndex];
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getOriginalName() {
    return originalName;
  }

  public void setOriginalName(String originalName) {
    this.originalName = originalName;
  }

  public String getStoredName() {
    return storedName;
  }

  public void setStoredName(String storedName) {
    this.storedName = storedName;
  }

  public String getFilePath() {
    return filePath;
  }

  public void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  public String getFileUrl() {
    return fileUrl;
  }

  public void setFileUrl(String fileUrl) {
    this.fileUrl = fileUrl;
  }

  public Long getFileSize() {
    return fileSize;
  }

  public void setFileSize(Long fileSize) {
    this.fileSize = fileSize;
  }

  public String getFileType() {
    return fileType;
  }

  public void setFileType(String fileType) {
    this.fileType = fileType;
  }

  public String getMimeType() {
    return mimeType;
  }

  public void setMimeType(String mimeType) {
    this.mimeType = mimeType;
  }

  public String getFileHash() {
    return fileHash;
  }

  public void setFileHash(String fileHash) {
    this.fileHash = fileHash;
  }

  public Long getUploaderId() {
    return uploaderId;
  }

  public void setUploaderId(Long uploaderId) {
    this.uploaderId = uploaderId;
  }

  public User getUploader() {
    return uploader;
  }

  public void setUploader(User uploader) {
    this.uploader = uploader;
  }

  public Long getKnowledgeId() {
    return knowledgeId;
  }

  public void setKnowledgeId(Long knowledgeId) {
    this.knowledgeId = knowledgeId;
  }

  public KnowledgeItem getKnowledgeItem() {
    return knowledgeItem;
  }

  public void setKnowledgeItem(KnowledgeItem knowledgeItem) {
    this.knowledgeItem = knowledgeItem;
  }

  public Long getDownloadCount() {
    return downloadCount;
  }

  public void setDownloadCount(Long downloadCount) {
    this.downloadCount = downloadCount;
  }

  public LocalDateTime getLastAccessedAt() {
    return lastAccessedAt;
  }

  public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
    this.lastAccessedAt = lastAccessedAt;
  }

  public Integer getStatus() {
    return status;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public String toString() {
    return "FileUpload{"
        + "id="
        + id
        + ", originalName='"
        + originalName
        + '\''
        + ", storedName='"
        + storedName
        + '\''
        + ", fileSize="
        + fileSize
        + ", fileType='"
        + fileType
        + '\''
        + ", uploaderId="
        + uploaderId
        + ", knowledgeId="
        + knowledgeId
        + ", status="
        + status
        + ", createdAt="
        + createdAt
        + '}';
  }
}
