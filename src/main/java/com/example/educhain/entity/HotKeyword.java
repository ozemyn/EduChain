package com.example.educhain.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 热门关键词实体类
 * 用于存储搜索关键词的统计信息
 */
@Entity
@Table(name = "hot_keywords", indexes = {
    @Index(name = "idx_keyword", columnList = "keyword"),
    @Index(name = "idx_search_count", columnList = "search_count"),
    @Index(name = "idx_last_searched", columnList = "last_searched_at"),
    @Index(name = "idx_trend_score", columnList = "trend_score")
})
@EntityListeners(AuditingEntityListener.class)
public class HotKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "keyword", nullable = false, unique = true, length = 100)
    private String keyword;

    @Column(name = "search_count", nullable = false)
    private Long searchCount = 0L;

    @Column(name = "result_count", nullable = false)
    private Long resultCount = 0L; // 搜索结果数量

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L; // 点击次数

    @Column(name = "trend_score", nullable = false)
    private Double trendScore = 0.0; // 趋势分数

    @Column(name = "daily_count", nullable = false)
    private Long dailyCount = 0L; // 今日搜索次数

    @Column(name = "weekly_count", nullable = false)
    private Long weeklyCount = 0L; // 本周搜索次数

    @Column(name = "monthly_count", nullable = false)
    private Long monthlyCount = 0L; // 本月搜索次数

    @Column(name = "last_searched_at")
    private LocalDateTime lastSearchedAt;

    @Column(name = "category_id")
    private Long categoryId; // 关联的主要分类

    @Column(name = "category_name", length = 100)
    private String categoryName;

    @Column(name = "status", nullable = false)
    private Integer status = 1; // 1: 正常, 0: 禁用

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 默认构造函数
    public HotKeyword() {}

    // 构造函数
    public HotKeyword(String keyword) {
        this.keyword = keyword;
        this.lastSearchedAt = LocalDateTime.now();
    }

    /**
     * 增加搜索次数
     */
    public void incrementSearchCount(Long resultCount) {
        this.searchCount++;
        this.dailyCount++;
        this.weeklyCount++;
        this.monthlyCount++;
        this.resultCount = resultCount != null ? resultCount : 0L;
        this.lastSearchedAt = LocalDateTime.now();
        
        // 重新计算趋势分数
        calculateTrendScore();
    }

    /**
     * 增加点击次数
     */
    public void incrementClickCount() {
        this.clickCount++;
        calculateTrendScore();
    }

    /**
     * 计算趋势分数
     * 基于搜索频率、时间衰减、点击率等因素
     */
    private void calculateTrendScore() {
        double score = 0.0;
        
        // 基础分数：搜索次数
        score += Math.log(searchCount + 1) * 10;
        
        // 时间衰减：最近搜索的权重更高
        if (lastSearchedAt != null) {
            long hoursAgo = java.time.Duration.between(lastSearchedAt, LocalDateTime.now()).toHours();
            double timeDecay = Math.exp(-hoursAgo / 168.0); // 一周衰减到 1/e
            score *= (0.5 + 0.5 * timeDecay);
        }
        
        // 点击率加成
        if (searchCount > 0) {
            double clickRate = (double) clickCount / searchCount;
            score *= (1 + clickRate);
        }
        
        // 结果数量影响（有结果的关键词分数更高）
        if (resultCount > 0) {
            score *= 1.2;
        } else {
            score *= 0.8;
        }
        
        this.trendScore = Math.round(score * 100.0) / 100.0;
    }

    /**
     * 重置日统计
     */
    public void resetDailyCount() {
        this.dailyCount = 0L;
    }

    /**
     * 重置周统计
     */
    public void resetWeeklyCount() {
        this.weeklyCount = 0L;
    }

    /**
     * 重置月统计
     */
    public void resetMonthlyCount() {
        this.monthlyCount = 0L;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getSearchCount() {
        return searchCount;
    }

    public void setSearchCount(Long searchCount) {
        this.searchCount = searchCount;
    }

    public Long getResultCount() {
        return resultCount;
    }

    public void setResultCount(Long resultCount) {
        this.resultCount = resultCount;
    }

    public Long getClickCount() {
        return clickCount;
    }

    public void setClickCount(Long clickCount) {
        this.clickCount = clickCount;
    }

    public Double getTrendScore() {
        return trendScore;
    }

    public void setTrendScore(Double trendScore) {
        this.trendScore = trendScore;
    }

    public Long getDailyCount() {
        return dailyCount;
    }

    public void setDailyCount(Long dailyCount) {
        this.dailyCount = dailyCount;
    }

    public Long getWeeklyCount() {
        return weeklyCount;
    }

    public void setWeeklyCount(Long weeklyCount) {
        this.weeklyCount = weeklyCount;
    }

    public Long getMonthlyCount() {
        return monthlyCount;
    }

    public void setMonthlyCount(Long monthlyCount) {
        this.monthlyCount = monthlyCount;
    }

    public LocalDateTime getLastSearchedAt() {
        return lastSearchedAt;
    }

    public void setLastSearchedAt(LocalDateTime lastSearchedAt) {
        this.lastSearchedAt = lastSearchedAt;
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
        return "HotKeyword{" +
                "id=" + id +
                ", keyword='" + keyword + '\'' +
                ", searchCount=" + searchCount +
                ", resultCount=" + resultCount +
                ", clickCount=" + clickCount +
                ", trendScore=" + trendScore +
                ", lastSearchedAt=" + lastSearchedAt +
                ", status=" + status +
                '}';
    }
}