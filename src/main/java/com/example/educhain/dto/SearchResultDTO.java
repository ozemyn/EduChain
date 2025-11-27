package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeItem;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 搜索结果DTO
 */
public class SearchResultDTO {

    private Long id;
    private String title;
    private String content;
    private String contentSummary; // 内容摘要
    private KnowledgeItem.ContentType type;
    private List<String> mediaUrls;
    private String linkUrl;
    private Long uploaderId;
    private String uploaderName;
    private String uploaderAvatar;
    private Long categoryId;
    private String categoryName;
    private String tags;
    private Long viewCount;
    private Long likeCount;
    private Long favoriteCount;
    private Long commentCount;
    private Double qualityScore;
    private String highlightedTitle; // 高亮标题
    private String highlightedContent; // 高亮内容
    private String highlightedTags; // 高亮标签
    private Double relevanceScore; // 相关性分数
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 默认构造函数
    public SearchResultDTO() {}

    // 构造函数
    public SearchResultDTO(Long id, String title, String content, KnowledgeItem.ContentType type,
                          Long uploaderId, String uploaderName, Long categoryId, String categoryName,
                          String tags, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.type = type;
        this.uploaderId = uploaderId;
        this.uploaderName = uploaderName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.tags = tags;
        this.createdAt = createdAt;
        
        // 生成内容摘要
        if (content != null && content.length() > 200) {
            this.contentSummary = content.substring(0, 200) + "...";
        } else {
            this.contentSummary = content;
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

    public String getContentSummary() {
        return contentSummary;
    }

    public void setContentSummary(String contentSummary) {
        this.contentSummary = contentSummary;
    }

    public KnowledgeItem.ContentType getType() {
        return type;
    }

    public void setType(KnowledgeItem.ContentType type) {
        this.type = type;
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

    public String getUploaderName() {
        return uploaderName;
    }

    public void setUploaderName(String uploaderName) {
        this.uploaderName = uploaderName;
    }

    public String getUploaderAvatar() {
        return uploaderAvatar;
    }

    public void setUploaderAvatar(String uploaderAvatar) {
        this.uploaderAvatar = uploaderAvatar;
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

    public String getHighlightedTitle() {
        return highlightedTitle;
    }

    public void setHighlightedTitle(String highlightedTitle) {
        this.highlightedTitle = highlightedTitle;
    }

    public String getHighlightedContent() {
        return highlightedContent;
    }

    public void setHighlightedContent(String highlightedContent) {
        this.highlightedContent = highlightedContent;
    }

    public String getHighlightedTags() {
        return highlightedTags;
    }

    public void setHighlightedTags(String highlightedTags) {
        this.highlightedTags = highlightedTags;
    }

    public Double getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(Double relevanceScore) {
        this.relevanceScore = relevanceScore;
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
        return "SearchResultDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", uploaderName='" + uploaderName + '\'' +
                ", categoryName='" + categoryName + '\'' +
                ", qualityScore=" + qualityScore +
                ", relevanceScore=" + relevanceScore +
                ", createdAt=" + createdAt +
                '}';
    }
}