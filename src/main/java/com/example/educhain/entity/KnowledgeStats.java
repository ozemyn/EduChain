package com.example.educhain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 知识内容统计实体类 */
@Entity
@Table(
    name = "knowledge_stats",
    indexes = {
      @Index(name = "idx_knowledge_id", columnList = "knowledge_id", unique = true),
      @Index(name = "idx_view_count", columnList = "view_count"),
      @Index(name = "idx_like_count", columnList = "like_count"),
      @Index(name = "idx_favorite_count", columnList = "favorite_count"),
      @Index(name = "idx_comment_count", columnList = "comment_count")
    })
@EntityListeners(AuditingEntityListener.class)
public class KnowledgeStats {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "knowledge_id", nullable = false, unique = true)
  private Long knowledgeId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "knowledge_id", insertable = false, updatable = false)
  private KnowledgeItem knowledgeItem;

  @Column(name = "view_count", nullable = false)
  private Long viewCount = 0L;

  @Column(name = "like_count", nullable = false)
  private Long likeCount = 0L;

  @Column(name = "favorite_count", nullable = false)
  private Long favoriteCount = 0L;

  @Column(name = "comment_count", nullable = false)
  private Long commentCount = 0L;

  @Column(name = "share_count", nullable = false)
  private Long shareCount = 0L;

  @Column(name = "quality_score")
  private Double qualityScore = 0.0;

  @Column(name = "last_view_at")
  private LocalDateTime lastViewAt;

  @Column(name = "last_interaction_at")
  private LocalDateTime lastInteractionAt;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // 默认构造函数
  public KnowledgeStats() {}

  // 构造函数
  public KnowledgeStats(Long knowledgeId) {
    this.knowledgeId = knowledgeId;
  }

  /** 增加浏览量 */
  public void incrementViewCount() {
    this.viewCount++;
    this.lastViewAt = LocalDateTime.now();
  }

  /** 增加点赞数 */
  public void incrementLikeCount() {
    this.likeCount++;
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 减少点赞数 */
  public void decrementLikeCount() {
    if (this.likeCount > 0) {
      this.likeCount--;
    }
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 增加收藏数 */
  public void incrementFavoriteCount() {
    this.favoriteCount++;
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 减少收藏数 */
  public void decrementFavoriteCount() {
    if (this.favoriteCount > 0) {
      this.favoriteCount--;
    }
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 增加评论数 */
  public void incrementCommentCount() {
    this.commentCount++;
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 减少评论数 */
  public void decrementCommentCount() {
    if (this.commentCount > 0) {
      this.commentCount--;
    }
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 增加分享数 */
  public void incrementShareCount() {
    this.shareCount++;
    this.lastInteractionAt = LocalDateTime.now();
  }

  /** 计算质量分数 基于浏览量、点赞数、收藏数、评论数等指标 */
  public void calculateQualityScore() {
    // 简单的质量分数计算公式
    // 可以根据业务需求调整权重
    double score =
        (likeCount * 3.0 + favoriteCount * 5.0 + commentCount * 2.0 + shareCount * 4.0)
            / Math.max(viewCount, 1.0)
            * 100;
    this.qualityScore = Math.min(score, 100.0); // 最高100分
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

  public KnowledgeItem getKnowledgeItem() {
    return knowledgeItem;
  }

  public void setKnowledgeItem(KnowledgeItem knowledgeItem) {
    this.knowledgeItem = knowledgeItem;
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

  public Long getShareCount() {
    return shareCount;
  }

  public void setShareCount(Long shareCount) {
    this.shareCount = shareCount;
  }

  public Double getQualityScore() {
    return qualityScore;
  }

  public void setQualityScore(Double qualityScore) {
    this.qualityScore = qualityScore;
  }

  public LocalDateTime getLastViewAt() {
    return lastViewAt;
  }

  public void setLastViewAt(LocalDateTime lastViewAt) {
    this.lastViewAt = lastViewAt;
  }

  public LocalDateTime getLastInteractionAt() {
    return lastInteractionAt;
  }

  public void setLastInteractionAt(LocalDateTime lastInteractionAt) {
    this.lastInteractionAt = lastInteractionAt;
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
    return "KnowledgeStats{"
        + "id="
        + id
        + ", knowledgeId="
        + knowledgeId
        + ", viewCount="
        + viewCount
        + ", likeCount="
        + likeCount
        + ", favoriteCount="
        + favoriteCount
        + ", commentCount="
        + commentCount
        + ", shareCount="
        + shareCount
        + ", qualityScore="
        + qualityScore
        + ", createdAt="
        + createdAt
        + '}';
  }
}
