package com.example.educhain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 搜索索引实体类 用于存储搜索相关的索引信息，提高搜索性能 */
@Entity
@Table(
    name = "search_indexes",
    indexes = {
      @Index(name = "idx_knowledge_id", columnList = "knowledge_id"),
      @Index(name = "idx_category_id", columnList = "category_id"),
      @Index(name = "idx_tags", columnList = "tags"),
      @Index(name = "idx_updated_at", columnList = "updated_at")
    })
@EntityListeners(AuditingEntityListener.class)
public class SearchIndex {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "knowledge_id", nullable = false, unique = true)
  private Long knowledgeId;

  @Column(name = "search_text", columnDefinition = "TEXT")
  private String searchText; // 合并的搜索文本（标题+内容+标签）

  @Column(name = "title", length = 200)
  private String title;

  @Column(name = "content_summary", length = 500)
  private String contentSummary; // 内容摘要

  @Column(name = "category_id")
  private Long categoryId;

  @Column(name = "category_name", length = 100)
  private String categoryName;

  @Column(name = "tags", length = 500)
  private String tags;

  @Column(name = "uploader_id")
  private Long uploaderId;

  @Column(name = "uploader_name", length = 50)
  private String uploaderName;

  @Enumerated(EnumType.STRING)
  @Column(name = "content_type", length = 20)
  private KnowledgeItem.ContentType contentType;

  @Column(name = "view_count", nullable = false)
  private Long viewCount = 0L;

  @Column(name = "like_count", nullable = false)
  private Long likeCount = 0L;

  @Column(name = "favorite_count", nullable = false)
  private Long favoriteCount = 0L;

  @Column(name = "comment_count", nullable = false)
  private Long commentCount = 0L;

  @Column(name = "quality_score", nullable = false)
  private Double qualityScore = 0.0; // 质量评分

  @Column(name = "status", nullable = false)
  private Integer status = 1; // 1: 正常, 0: 删除

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // 默认构造函数
  public SearchIndex() {}

  // 构造函数
  public SearchIndex(
      Long knowledgeId,
      String title,
      String content,
      String tags,
      Long categoryId,
      String categoryName,
      Long uploaderId,
      String uploaderName,
      KnowledgeItem.ContentType contentType) {
    this.knowledgeId = knowledgeId;
    this.title = title;
    this.tags = tags;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.uploaderId = uploaderId;
    this.uploaderName = uploaderName;
    this.contentType = contentType;

    // 生成内容摘要
    if (content != null && content.length() > 500) {
      this.contentSummary = content.substring(0, 500) + "...";
    } else {
      this.contentSummary = content;
    }

    // 生成搜索文本
    this.searchText = buildSearchText(title, content, tags, categoryName, uploaderName);
  }

  /** 构建搜索文本 */
  private String buildSearchText(
      String title, String content, String tags, String categoryName, String uploaderName) {
    StringBuilder sb = new StringBuilder();
    if (title != null) sb.append(title).append(" ");
    if (content != null) sb.append(content).append(" ");
    if (tags != null) sb.append(tags).append(" ");
    if (categoryName != null) sb.append(categoryName).append(" ");
    if (uploaderName != null) sb.append(uploaderName).append(" ");
    return sb.toString().trim();
  }

  /** 更新统计数据 */
  public void updateStats(Long viewCount, Long likeCount, Long favoriteCount, Long commentCount) {
    this.viewCount = viewCount != null ? viewCount : 0L;
    this.likeCount = likeCount != null ? likeCount : 0L;
    this.favoriteCount = favoriteCount != null ? favoriteCount : 0L;
    this.commentCount = commentCount != null ? commentCount : 0L;

    // 计算质量评分
    this.qualityScore = calculateQualityScore();
  }

  /** 计算质量评分 */
  private Double calculateQualityScore() {
    // 基于多项指标计算质量分数
    double score = 0.0;

    // 浏览量权重 (30%)
    score += Math.log(viewCount + 1) * 0.3;

    // 点赞数权重 (25%)
    score += Math.log(likeCount + 1) * 0.25;

    // 收藏数权重 (25%)
    score += Math.log(favoriteCount + 1) * 0.25;

    // 评论数权重 (20%)
    score += Math.log(commentCount + 1) * 0.2;

    return Math.round(score * 100.0) / 100.0;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getKnowledgeId() {
    return knowledgeId;
  }

  public void setKnowledgeId(Long knowledgeId) {
    this.knowledgeId = knowledgeId;
  }

  public String getSearchText() {
    return searchText;
  }

  public void setSearchText(String searchText) {
    this.searchText = searchText;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContentSummary() {
    return contentSummary;
  }

  public void setContentSummary(String contentSummary) {
    this.contentSummary = contentSummary;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public String getTags() {
    return tags;
  }

  public void setTags(String tags) {
    this.tags = tags;
  }

  public Long getUploaderId() {
    return uploaderId;
  }

  public void setUploaderId(Long uploaderId) {
    this.uploaderId = uploaderId;
  }

  public String getUploaderName() {
    return uploaderName;
  }

  public void setUploaderName(String uploaderName) {
    this.uploaderName = uploaderName;
  }

  public KnowledgeItem.ContentType getContentType() {
    return contentType;
  }

  public void setContentType(KnowledgeItem.ContentType contentType) {
    this.contentType = contentType;
  }

  public Long getViewCount() {
    return viewCount;
  }

  public void setViewCount(Long viewCount) {
    this.viewCount = viewCount;
  }

  public Long getLikeCount() {
    return likeCount;
  }

  public void setLikeCount(Long likeCount) {
    this.likeCount = likeCount;
  }

  public Long getFavoriteCount() {
    return favoriteCount;
  }

  public void setFavoriteCount(Long favoriteCount) {
    this.favoriteCount = favoriteCount;
  }

  public Long getCommentCount() {
    return commentCount;
  }

  public void setCommentCount(Long commentCount) {
    this.commentCount = commentCount;
  }

  public Double getQualityScore() {
    return qualityScore;
  }

  public void setQualityScore(Double qualityScore) {
    this.qualityScore = qualityScore;
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
    return "SearchIndex{"
        + "id="
        + id
        + ", knowledgeId="
        + knowledgeId
        + ", title='"
        + title
        + '\''
        + ", categoryName='"
        + categoryName
        + '\''
        + ", uploaderName='"
        + uploaderName
        + '\''
        + ", contentType="
        + contentType
        + ", qualityScore="
        + qualityScore
        + ", status="
        + status
        + '}';
  }
}
