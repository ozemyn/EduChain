package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeStats;

import java.time.LocalDateTime;

/**
 * 知识内容统计信息DTO
 */
public class KnowledgeStatsDTO {

    private Long id;
    private Long knowledgeId;
    private Long viewCount;
    private Long likeCount;
    private Long favoriteCount;
    private Long commentCount;
    private Long shareCount;
    private Double qualityScore;
    private LocalDateTime lastViewAt;
    private LocalDateTime lastInteractionAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 默认构造函数
    public KnowledgeStatsDTO() {}

    // 从KnowledgeStats实体创建DTO的构造函数
    public KnowledgeStatsDTO(KnowledgeStats knowledgeStats) {
        this.id = knowledgeStats.getId();
        this.knowledgeId = knowledgeStats.getKnowledgeId();
        this.viewCount = knowledgeStats.getViewCount();
        this.likeCount = knowledgeStats.getLikeCount();
        this.favoriteCount = knowledgeStats.getFavoriteCount();
        this.commentCount = knowledgeStats.getCommentCount();
        this.shareCount = knowledgeStats.getShareCount();
        this.qualityScore = knowledgeStats.getQualityScore();
        this.lastViewAt = knowledgeStats.getLastViewAt();
        this.lastInteractionAt = knowledgeStats.getLastInteractionAt();
        this.createdAt = knowledgeStats.getCreatedAt();
        this.updatedAt = knowledgeStats.getUpdatedAt();
    }

    // 静态工厂方法
    public static KnowledgeStatsDTO fromEntity(KnowledgeStats knowledgeStats) {
        return new KnowledgeStatsDTO(knowledgeStats);
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
        return "KnowledgeStatsDTO{" +
                "id=" + id +
                ", knowledgeId=" + knowledgeId +
                ", viewCount=" + viewCount +
                ", likeCount=" + likeCount +
                ", favoriteCount=" + favoriteCount +
                ", commentCount=" + commentCount +
                ", shareCount=" + shareCount +
                ", qualityScore=" + qualityScore +
                ", createdAt=" + createdAt +
                '}';
    }
}