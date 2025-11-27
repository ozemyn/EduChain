package com.example.educhain.dto;

import java.time.LocalDateTime;

/**
 * 平台整体统计信息DTO
 */
public class PlatformStatsDTO {

    // 用户统计
    private Long totalUsers;
    private Long activeUsers;
    private Long newUsersToday;
    private Double averageUserScore;

    // 知识内容统计
    private Long totalKnowledge;
    private Long newKnowledgeToday;
    private Long totalViews;
    private Long totalLikes;
    private Long totalFavorites;
    private Long totalComments;
    private Long totalShares;

    // 互动统计
    private Long totalInteractions;
    private Long interactionsToday;
    private Double averageQualityScore;

    // 分类统计
    private Long totalCategories;
    private Long totalTags;

    // 系统统计
    private LocalDateTime lastUpdated;
    private String reportPeriod;

    // 默认构造函数
    public PlatformStatsDTO() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Long getNewUsersToday() {
        return newUsersToday;
    }

    public void setNewUsersToday(Long newUsersToday) {
        this.newUsersToday = newUsersToday;
    }

    public Double getAverageUserScore() {
        return averageUserScore;
    }

    public void setAverageUserScore(Double averageUserScore) {
        this.averageUserScore = averageUserScore;
    }

    public Long getTotalKnowledge() {
        return totalKnowledge;
    }

    public void setTotalKnowledge(Long totalKnowledge) {
        this.totalKnowledge = totalKnowledge;
    }

    public Long getNewKnowledgeToday() {
        return newKnowledgeToday;
    }

    public void setNewKnowledgeToday(Long newKnowledgeToday) {
        this.newKnowledgeToday = newKnowledgeToday;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public Long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(Long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }

    public Long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(Long totalComments) {
        this.totalComments = totalComments;
    }

    public Long getTotalShares() {
        return totalShares;
    }

    public void setTotalShares(Long totalShares) {
        this.totalShares = totalShares;
    }

    public Long getTotalInteractions() {
        return totalInteractions;
    }

    public void setTotalInteractions(Long totalInteractions) {
        this.totalInteractions = totalInteractions;
    }

    public Long getInteractionsToday() {
        return interactionsToday;
    }

    public void setInteractionsToday(Long interactionsToday) {
        this.interactionsToday = interactionsToday;
    }

    public Double getAverageQualityScore() {
        return averageQualityScore;
    }

    public void setAverageQualityScore(Double averageQualityScore) {
        this.averageQualityScore = averageQualityScore;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Long getTotalTags() {
        return totalTags;
    }

    public void setTotalTags(Long totalTags) {
        this.totalTags = totalTags;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getReportPeriod() {
        return reportPeriod;
    }

    public void setReportPeriod(String reportPeriod) {
        this.reportPeriod = reportPeriod;
    }

    @Override
    public String toString() {
        return "PlatformStatsDTO{" +
                "totalUsers=" + totalUsers +
                ", totalKnowledge=" + totalKnowledge +
                ", totalViews=" + totalViews +
                ", totalLikes=" + totalLikes +
                ", totalInteractions=" + totalInteractions +
                ", averageQualityScore=" + averageQualityScore +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}