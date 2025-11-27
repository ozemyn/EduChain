package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeItem;

import java.time.LocalDateTime;

/**
 * 知识内容筛选条件DTO
 */
public class KnowledgeFilter {

    private String keyword; // 关键词搜索
    private Long categoryId; // 分类ID
    private KnowledgeItem.ContentType type; // 内容类型
    private Long uploaderId; // 上传者ID
    private String tags; // 标签
    private Integer status; // 状态
    private LocalDateTime startTime; // 开始时间
    private LocalDateTime endTime; // 结束时间
    private String sortBy; // 排序字段：created_at, updated_at, view_count, like_count, quality_score
    private String sortDirection; // 排序方向：asc, desc
    private Long minViewCount; // 最小浏览量
    private Long maxViewCount; // 最大浏览量
    private Long minLikeCount; // 最小点赞数
    private Long maxLikeCount; // 最大点赞数
    private Double minQualityScore; // 最小质量分数
    private Double maxQualityScore; // 最大质量分数

    // 默认构造函数
    public KnowledgeFilter() {
        this.status = 1; // 默认只查询正常状态的内容
        this.sortBy = "created_at";
        this.sortDirection = "desc";
    }

    // 构造函数
    public KnowledgeFilter(String keyword, Long categoryId, KnowledgeItem.ContentType type) {
        this();
        this.keyword = keyword;
        this.categoryId = categoryId;
        this.type = type;
    }

    // Getters and Setters
    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public KnowledgeItem.ContentType getType() {
        return type;
    }

    public void setType(KnowledgeItem.ContentType type) {
        this.type = type;
    }

    public Long getUploaderId() {
        return uploaderId;
    }

    public void setUploaderId(Long uploaderId) {
        this.uploaderId = uploaderId;
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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }

    public Long getMinViewCount() {
        return minViewCount;
    }

    public void setMinViewCount(Long minViewCount) {
        this.minViewCount = minViewCount;
    }

    public Long getMaxViewCount() {
        return maxViewCount;
    }

    public void setMaxViewCount(Long maxViewCount) {
        this.maxViewCount = maxViewCount;
    }

    public Long getMinLikeCount() {
        return minLikeCount;
    }

    public void setMinLikeCount(Long minLikeCount) {
        this.minLikeCount = minLikeCount;
    }

    public Long getMaxLikeCount() {
        return maxLikeCount;
    }

    public void setMaxLikeCount(Long maxLikeCount) {
        this.maxLikeCount = maxLikeCount;
    }

    public Double getMinQualityScore() {
        return minQualityScore;
    }

    public void setMinQualityScore(Double minQualityScore) {
        this.minQualityScore = minQualityScore;
    }

    public Double getMaxQualityScore() {
        return maxQualityScore;
    }

    public void setMaxQualityScore(Double maxQualityScore) {
        this.maxQualityScore = maxQualityScore;
    }

    @Override
    public String toString() {
        return "KnowledgeFilter{" +
                "keyword='" + keyword + '\'' +
                ", categoryId=" + categoryId +
                ", type=" + type +
                ", uploaderId=" + uploaderId +
                ", tags='" + tags + '\'' +
                ", status=" + status +
                ", sortBy='" + sortBy + '\'' +
                ", sortDirection='" + sortDirection + '\'' +
                '}';
    }
}