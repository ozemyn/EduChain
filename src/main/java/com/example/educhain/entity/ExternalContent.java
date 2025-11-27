package com.example.educhain.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 外部内容实体类
 */
@Entity
@Table(name = "external_contents", indexes = {
    @Index(name = "idx_source_id", columnList = "source_id"),
    @Index(name = "idx_original_url", columnList = "original_url"),
    @Index(name = "idx_content_hash", columnList = "content_hash", unique = true),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_crawled_at", columnList = "crawled_at"),
    @Index(name = "idx_published_at", columnList = "published_at")
})
@EntityListeners(AuditingEntityListener.class)
public class ExternalContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", insertable = false, updatable = false)
    private ExternalSource externalSource;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "author", length = 100)
    private String author;

    @Column(name = "original_url", nullable = false, length = 500)
    private String originalUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "content_hash", nullable = false, unique = true, length = 64)
    private String contentHash; // SHA-256 hash for deduplication

    @Column(name = "language", length = 10)
    private String language = "zh";

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "reading_time")
    private Integer readingTime; // 预估阅读时间（分钟）

    @Column(name = "status", nullable = false)
    private Integer status = 1; // 1: 正常, 0: 隐藏, -1: 删除

    @Column(name = "quality_score")
    private Double qualityScore = 0.0;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "crawled_at", nullable = false)
    private LocalDateTime crawledAt;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 默认构造函数
    public ExternalContent() {
        this.crawledAt = LocalDateTime.now();
    }

    // 构造函数
    public ExternalContent(Long sourceId, String title, String content, String originalUrl) {
        this();
        this.sourceId = sourceId;
        this.title = title;
        this.content = content;
        this.originalUrl = originalUrl;
        this.contentHash = generateContentHash();
    }

    /**
     * 生成内容哈希值
     */
    public String generateContentHash() {
        try {
            String combined = (title != null ? title : "") + 
                             (content != null ? content : "") + 
                             (originalUrl != null ? originalUrl : "");
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(combined.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            String combined = (title != null ? title : "") + 
                             (content != null ? content : "") + 
                             (originalUrl != null ? originalUrl : "");
            return String.valueOf(combined.hashCode());
        }
    }

    /**
     * 计算字数
     */
    public void calculateWordCount() {
        if (content != null) {
            // 简单的中文字数统计
            this.wordCount = content.replaceAll("\\s+", "").length();
        }
    }

    /**
     * 计算预估阅读时间
     */
    public void calculateReadingTime() {
        if (wordCount != null) {
            // 假设中文阅读速度为每分钟300字
            this.readingTime = Math.max(1, (int) Math.ceil(wordCount / 300.0));
        }
    }

    /**
     * 生成摘要
     */
    public void generateSummary() {
        if (content != null && content.length() > 200) {
            this.summary = content.substring(0, 200) + "...";
        } else {
            this.summary = content;
        }
    }

    /**
     * 计算质量分数
     */
    public void calculateQualityScore() {
        double score = 0.0;
        
        // 标题质量 (20%)
        if (title != null && title.length() >= 10 && title.length() <= 100) {
            score += 20;
        }
        
        // 内容长度 (30%)
        if (wordCount != null) {
            if (wordCount >= 500 && wordCount <= 5000) {
                score += 30;
            } else if (wordCount >= 200) {
                score += 15;
            }
        }
        
        // 是否有作者 (10%)
        if (author != null && !author.trim().isEmpty()) {
            score += 10;
        }
        
        // 是否有图片 (10%)
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            score += 10;
        }
        
        // 是否有标签 (10%)
        if (tags != null && !tags.trim().isEmpty()) {
            score += 10;
        }
        
        // 是否有分类 (10%)
        if (category != null && !category.trim().isEmpty()) {
            score += 10;
        }
        
        // 发布时间是否合理 (10%)
        if (publishedAt != null && publishedAt.isAfter(LocalDateTime.now().minusYears(5))) {
            score += 10;
        }
        
        this.qualityScore = score;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public ExternalSource getExternalSource() {
        return externalSource;
    }

    public void setExternalSource(ExternalSource externalSource) {
        this.externalSource = externalSource;
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
        calculateWordCount();
        calculateReadingTime();
        generateSummary();
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContentHash() {
        return contentHash;
    }

    public void setContentHash(String contentHash) {
        this.contentHash = contentHash;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getWordCount() {
        return wordCount;
    }

    public void setWordCount(Integer wordCount) {
        this.wordCount = wordCount;
    }

    public Integer getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(Integer readingTime) {
        this.readingTime = readingTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Double getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDateTime getCrawledAt() {
        return crawledAt;
    }

    public void setCrawledAt(LocalDateTime crawledAt) {
        this.crawledAt = crawledAt;
    }

    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
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
        return "ExternalContent{" +
                "id=" + id +
                ", sourceId=" + sourceId +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", originalUrl='" + originalUrl + '\'' +
                ", wordCount=" + wordCount +
                ", qualityScore=" + qualityScore +
                ", crawledAt=" + crawledAt +
                '}';
    }
}