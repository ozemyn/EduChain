package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeItem;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 知识内容DTO
 */
public class KnowledgeItemDTO {

    private Long id;
    private String title;
    private String content;
    private KnowledgeItem.ContentType type;
    private List<String> mediaUrls;
    private String linkUrl;
    private Long uploaderId;
    private String uploaderName;
    private String uploaderAvatar;
    private Long categoryId;
    private String categoryName;
    private String tags;
    private List<String> tagList;
    private Integer status;
    private String statusText;
    
    // 统计信息
    private Long viewCount;
    private Long likeCount;
    private Long favoriteCount;
    private Long commentCount;
    private Long shareCount;
    private Double qualityScore;
    
    // 用户互动状态
    private Boolean isLiked;
    private Boolean isFavorited;
    private Boolean isFollowingAuthor;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 默认构造函数
    public KnowledgeItemDTO() {}

    // 构造函数
    public KnowledgeItemDTO(Long id, String title, String content, KnowledgeItem.ContentType type,
                           Long uploaderId, String uploaderName, Long categoryId, String categoryName,
                           String tags, Integer status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.type = type;
        this.uploaderId = uploaderId;
        this.uploaderName = uploaderName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.tags = tags;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public List<String> getTagList() {
        return tagList;
    }

    public void setTagList(List<String> tagList) {
        this.tagList = tagList;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
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

    public Boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }

    public Boolean getIsFavorited() {
        return isFavorited;
    }

    public void setIsFavorited(Boolean isFavorited) {
        this.isFavorited = isFavorited;
    }

    public Boolean getIsFollowingAuthor() {
        return isFollowingAuthor;
    }

    public void setIsFollowingAuthor(Boolean isFollowingAuthor) {
        this.isFollowingAuthor = isFollowingAuthor;
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
        return "KnowledgeItemDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", uploaderId=" + uploaderId +
                ", uploaderName='" + uploaderName + '\'' +
                ", categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", status=" + status +
                ", viewCount=" + viewCount +
                ", likeCount=" + likeCount +
                ", createdAt=" + createdAt +
                '}';
    }
}