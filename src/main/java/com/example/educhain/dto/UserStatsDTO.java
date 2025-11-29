package com.example.educhain.dto;

import com.example.educhain.entity.UserStats;
import java.time.LocalDateTime;

/** 用户统计信息DTO */
public class UserStatsDTO {

  private Long id;
  private Long userId;
  private Integer knowledgeCount;
  private Integer likeCount;
  private Integer favoriteCount;
  private Integer commentCount;
  private Integer followerCount;
  private Integer followingCount;
  private Long viewCount;
  private Integer totalScore;
  private Integer achievementCount;
  private Integer loginCount;
  private LocalDateTime lastLoginAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // 默认构造函数
  public UserStatsDTO() {}

  // 从UserStats实体创建DTO的构造函数
  public UserStatsDTO(UserStats userStats) {
    this.id = userStats.getId();
    this.userId = userStats.getUserId();
    this.knowledgeCount = userStats.getKnowledgeCount();
    this.likeCount = userStats.getLikeCount();
    this.favoriteCount = userStats.getFavoriteCount();
    this.commentCount = userStats.getCommentCount();
    this.followerCount = userStats.getFollowerCount();
    this.followingCount = userStats.getFollowingCount();
    this.viewCount = userStats.getViewCount();
    this.totalScore = userStats.getTotalScore();
    this.achievementCount = userStats.getAchievementCount();
    this.loginCount = userStats.getLoginCount();
    this.lastLoginAt = userStats.getLastLoginAt();
    this.createdAt = userStats.getCreatedAt();
    this.updatedAt = userStats.getUpdatedAt();
  }

  // 静态工厂方法
  public static UserStatsDTO fromEntity(UserStats userStats) {
    return new UserStatsDTO(userStats);
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Integer getKnowledgeCount() {
    return knowledgeCount;
  }

  public void setKnowledgeCount(Integer knowledgeCount) {
    this.knowledgeCount = knowledgeCount;
  }

  public Integer getLikeCount() {
    return likeCount;
  }

  public void setLikeCount(Integer likeCount) {
    this.likeCount = likeCount;
  }

  public Integer getFavoriteCount() {
    return favoriteCount;
  }

  public void setFavoriteCount(Integer favoriteCount) {
    this.favoriteCount = favoriteCount;
  }

  public Integer getCommentCount() {
    return commentCount;
  }

  public void setCommentCount(Integer commentCount) {
    this.commentCount = commentCount;
  }

  public Integer getFollowerCount() {
    return followerCount;
  }

  public void setFollowerCount(Integer followerCount) {
    this.followerCount = followerCount;
  }

  public Integer getFollowingCount() {
    return followingCount;
  }

  public void setFollowingCount(Integer followingCount) {
    this.followingCount = followingCount;
  }

  public Long getViewCount() {
    return viewCount;
  }

  public void setViewCount(Long viewCount) {
    this.viewCount = viewCount;
  }

  public Integer getTotalScore() {
    return totalScore;
  }

  public void setTotalScore(Integer totalScore) {
    this.totalScore = totalScore;
  }

  public Integer getAchievementCount() {
    return achievementCount;
  }

  public void setAchievementCount(Integer achievementCount) {
    this.achievementCount = achievementCount;
  }

  public Integer getLoginCount() {
    return loginCount;
  }

  public void setLoginCount(Integer loginCount) {
    this.loginCount = loginCount;
  }

  public LocalDateTime getLastLoginAt() {
    return lastLoginAt;
  }

  public void setLastLoginAt(LocalDateTime lastLoginAt) {
    this.lastLoginAt = lastLoginAt;
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
    return "UserStatsDTO{"
        + "id="
        + id
        + ", userId="
        + userId
        + ", knowledgeCount="
        + knowledgeCount
        + ", likeCount="
        + likeCount
        + ", favoriteCount="
        + favoriteCount
        + ", followerCount="
        + followerCount
        + ", totalScore="
        + totalScore
        + ", loginCount="
        + loginCount
        + '}';
  }
}
