package com.example.educhain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 知识内容实体类
 */
@Entity
@Table(name = "knowledge_items", indexes = {
    @Index(name = "idx_title", columnList = "title"),
    @Index(name = "idx_uploader_id", columnList = "uploader_id"),
    @Index(name = "idx_category_id", columnList = "category_id"),
    @Index(name = "idx_type", columnList = "type"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class KnowledgeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "标题不能为空")
    @Size(min = 1, max = 200, message = "标题长度必须在1-200个字符之间")
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentType type = ContentType.TEXT;

    @Column(name = "media_urls", columnDefinition = "JSON")
    private String mediaUrlsJson;

    @Transient
    private List<String> mediaUrls = new ArrayList<>();

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "uploader_id", nullable = false)
    private Long uploaderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", insertable = false, updatable = false)
    @JsonIgnore
    private User uploader;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;

    @Column(length = 500)
    private String tags;

    @Column(nullable = false)
    private Integer status = 1; // 1: 正常, 0: 删除, 2: 草稿

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 内容类型枚举
    public enum ContentType {
        TEXT("文本"),
        IMAGE("图片"),
        VIDEO("视频"),
        DOCUMENT("文档"),
        LINK("链接"),
        MIXED("混合");

        private final String description;

        ContentType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 默认构造函数
    public KnowledgeItem() {}

    // 构造函数
    public KnowledgeItem(String title, String content, ContentType type, Long uploaderId, Long categoryId) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.uploaderId = uploaderId;
        this.categoryId = categoryId;
    }

    // JSON 处理方法
    @PostLoad
    @PostPersist
    @PostUpdate
    private void deserializeMediaUrls() {
        if (mediaUrlsJson != null && !mediaUrlsJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.mediaUrls = mapper.readValue(mediaUrlsJson, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                this.mediaUrls = new ArrayList<>();
            }
        } else {
            this.mediaUrls = new ArrayList<>();
        }
    }

    @PrePersist
    @PreUpdate
    private void serializeMediaUrls() {
        if (mediaUrls != null && !mediaUrls.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.mediaUrlsJson = mapper.writeValueAsString(mediaUrls);
            } catch (JsonProcessingException e) {
                this.mediaUrlsJson = "[]";
            }
        } else {
            this.mediaUrlsJson = "[]";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ContentType getType() {
        return type;
    }

    public void setType(ContentType type) {
        this.type = type;
    }

    public String getMediaUrlsJson() {
        return mediaUrlsJson;
    }

    public void setMediaUrlsJson(String mediaUrlsJson) {
        this.mediaUrlsJson = mediaUrlsJson;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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
        return "KnowledgeItem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", uploaderId=" + uploaderId +
                ", categoryId=" + categoryId +
                ", tags='" + tags + '\'' +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}