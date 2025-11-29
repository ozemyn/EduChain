package com.example.educhain.dto;

import com.example.educhain.entity.ExternalContent;
import java.time.LocalDateTime;

/** 外部内容DTO */
public class ExternalContentDTO {

  private Long id;
  private Long sourceId;
  private String sourceName;
  private String title;
  private String content;
  private String summary;
  private String author;
  private String originalUrl;
  private String imageUrl;
  private String tags;
  private String category;
  private String contentHash;
  private String language;
  private Integer wordCount;
  private Integer readingTime;
  private Integer status;
  private Double qualityScore;
  private LocalDateTime publishedAt;
  private LocalDateTime crawledAt;
  private LocalDateTime lastUpdatedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // 默认构造函数
  public ExternalContentDTO() {}

  // 从ExternalContent实体创建DTO的构造函数
  public ExternalContentDTO(ExternalContent externalContent) {
    this.id = externalContent.getId();
    this.sourceId = externalContent.getSourceId();
    if (externalContent.getExternalSource() != null) {
      this.sourceName = externalContent.getExternalSource().getName();
    }
    this.title = externalContent.getTitle();
    this.content = externalContent.getContent();
    this.summary = externalContent.getSummary();
    this.author = externalContent.getAuthor();
    this.originalUrl = externalContent.getOriginalUrl();
    this.imageUrl = externalContent.getImageUrl();
    this.tags = externalContent.getTags();
    this.category = externalContent.getCategory();
    this.contentHash = externalContent.getContentHash();
    this.language = externalContent.getLanguage();
    this.wordCount = externalContent.getWordCount();
    this.readingTime = externalContent.getReadingTime();
    this.status = externalContent.getStatus();
    this.qualityScore = externalContent.getQualityScore();
    this.publishedAt = externalContent.getPublishedAt();
    this.crawledAt = externalContent.getCrawledAt();
    this.lastUpdatedAt = externalContent.getLastUpdatedAt();
    this.createdAt = externalContent.getCreatedAt();
    this.updatedAt = externalContent.getUpdatedAt();
  }

  // 静态工厂方法
  public static ExternalContentDTO fromEntity(ExternalContent externalContent) {
    return new ExternalContentDTO(externalContent);
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

  public String getSourceName() {
    return sourceName;
  }

  public void setSourceName(String sourceName) {
    this.sourceName = sourceName;
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
    return "ExternalContentDTO{"
        + "id="
        + id
        + ", sourceId="
        + sourceId
        + ", title='"
        + title
        + '\''
        + ", author='"
        + author
        + '\''
        + ", category='"
        + category
        + '\''
        + ", wordCount="
        + wordCount
        + ", qualityScore="
        + qualityScore
        + ", crawledAt="
        + crawledAt
        + '}';
  }
}
