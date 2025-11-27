package com.example.educhain.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 成就系统概览DTO
 */
public class AchievementSummaryDTO {

    private Long userId;
    private String username;
    
    // 成就统计
    private Long totalAchievements;
    private Long completedAchievements;
    private Long pendingAchievements;
    private Integer totalPoints;
    private Integer currentLevel;
    
    // 进度信息
    private Double overallProgress;
    private List<UserAchievementDTO> recentAchievements;
    private List<UserAchievementDTO> nearCompletionAchievements;
    private List<UserAchievementDTO> upgradableAchievements;
    
    // 排行榜信息
    private Integer globalRank;
    private Map<String, Integer> typeRanks;
    
    // 统计信息
    private Map<String, Long> achievementsByType;
    private LocalDateTime lastAchievementDate;
    private String nextMilestone;
    
    // 默认构造函数
    public AchievementSummaryDTO() {}

    public AchievementSummaryDTO(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getTotalAchievements() {
        return totalAchievements;
    }

    public void setTotalAchievements(Long totalAchievements) {
        this.totalAchievements = totalAchievements;
    }

    public Long getCompletedAchievements() {
        return completedAchievements;
    }

    public void setCompletedAchievements(Long completedAchievements) {
        this.completedAchievements = completedAchievements;
    }

    public Long getPendingAchievements() {
        return pendingAchievements;
    }

    public void setPendingAchievements(Long pendingAchievements) {
        this.pendingAchievements = pendingAchievements;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(Double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public List<UserAchievementDTO> getRecentAchievements() {
        return recentAchievements;
    }

    public void setRecentAchievements(List<UserAchievementDTO> recentAchievements) {
        this.recentAchievements = recentAchievements;
    }

    public List<UserAchievementDTO> getNearCompletionAchievements() {
        return nearCompletionAchievements;
    }

    public void setNearCompletionAchievements(List<UserAchievementDTO> nearCompletionAchievements) {
        this.nearCompletionAchievements = nearCompletionAchievements;
    }

    public List<UserAchievementDTO> getUpgradableAchievements() {
        return upgradableAchievements;
    }

    public void setUpgradableAchievements(List<UserAchievementDTO> upgradableAchievements) {
        this.upgradableAchievements = upgradableAchievements;
    }

    public Integer getGlobalRank() {
        return globalRank;
    }

    public void setGlobalRank(Integer globalRank) {
        this.globalRank = globalRank;
    }

    public Map<String, Integer> getTypeRanks() {
        return typeRanks;
    }

    public void setTypeRanks(Map<String, Integer> typeRanks) {
        this.typeRanks = typeRanks;
    }

    public Map<String, Long> getAchievementsByType() {
        return achievementsByType;
    }

    public void setAchievementsByType(Map<String, Long> achievementsByType) {
        this.achievementsByType = achievementsByType;
    }

    public LocalDateTime getLastAchievementDate() {
        return lastAchievementDate;
    }

    public void setLastAchievementDate(LocalDateTime lastAchievementDate) {
        this.lastAchievementDate = lastAchievementDate;
    }

    public String getNextMilestone() {
        return nextMilestone;
    }

    public void setNextMilestone(String nextMilestone) {
        this.nextMilestone = nextMilestone;
    }

    @Override
    public String toString() {
        return "AchievementSummaryDTO{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", totalAchievements=" + totalAchievements +
                ", completedAchievements=" + completedAchievements +
                ", totalPoints=" + totalPoints +
                ", currentLevel=" + currentLevel +
                ", overallProgress=" + overallProgress +
                ", globalRank=" + globalRank +
                '}';
    }
}