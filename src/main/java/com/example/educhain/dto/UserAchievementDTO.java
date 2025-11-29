package com.example.educhain.dto;

import com.example.educhain.entity.UserAchievement;
import java.time.LocalDateTime;

/** 用户成就DTO */
public class UserAchievementDTO {

  private Long id;
  private Long userId;
  private String username;
  private UserAchievement.AchievementType achievementType;
  private String achievementName;
  private String achievementDescription;
  private String achievementIcon;
  private Integer pointsAwarded;
  private Integer level;
  private Integer progressCurrent;
  private Integer progressTarget;
  private Boolean isCompleted;
  private LocalDateTime achievedAt;
  private String metadata;
  private Double completionPercentage;
  private Boolean canLevelUp;
  private Integer maxLevel;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // 默认构造函数
  public UserAchievementDTO() {}

  // 从UserAchievement实体创建DTO的构造函数
  public UserAchievementDTO(UserAchievement userAchievement) {
    this.id = userAchievement.getId();
    this.userId = userAchievement.getUserId();
    if (userAchievement.getUser() != null) {
      this.username = userAchievement.getUser().getUsername();
    }
    this.achievementType = userAchievement.getAchievementType();
    this.achievementName = userAchievement.getAchievementName();
    this.achievementDescription = userAchievement.getAchievementDescription();
    this.achievementIcon = userAchievement.getAchievementIcon();
    this.pointsAwarded = userAchievement.getPointsAwarded();
    this.level = userAchievement.getLevel();
    this.progressCurrent = userAchievement.getProgressCurrent();
    this.progressTarget = userAchievement.getProgressTarget();
    this.isCompleted = userAchievement.getIsCompleted();
    this.achievedAt = userAchievement.getAchievedAt();
    this.metadata = userAchievement.getMetadata();
    this.completionPercentage = userAchievement.getCompletionPercentage();
    this.canLevelUp = userAchievement.canLevelUp();
    this.maxLevel = userAchievement.getMaxLevel();
    this.createdAt = userAchievement.getCreatedAt();
    this.updatedAt = userAchievement.getUpdatedAt();
  }

  // 静态工厂方法
  public static UserAchievementDTO fromEntity(UserAchievement userAchievement) {
    return new UserAchievementDTO(userAchievement);
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

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public UserAchievement.AchievementType getAchievementType() {
    return achievementType;
  }

  public void setAchievementType(UserAchievement.AchievementType achievementType) {
    this.achievementType = achievementType;
  }

  public String getAchievementName() {
    return achievementName;
  }

  public void setAchievementName(String achievementName) {
    this.achievementName = achievementName;
  }

  public String getAchievementDescription() {
    return achievementDescription;
  }

  public void setAchievementDescription(String achievementDescription) {
    this.achievementDescription = achievementDescription;
  }

  public String getAchievementIcon() {
    return achievementIcon;
  }

  public void setAchievementIcon(String achievementIcon) {
    this.achievementIcon = achievementIcon;
  }

  public Integer getPointsAwarded() {
    return pointsAwarded;
  }

  public void setPointsAwarded(Integer pointsAwarded) {
    this.pointsAwarded = pointsAwarded;
  }

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public Integer getProgressCurrent() {
    return progressCurrent;
  }

  public void setProgressCurrent(Integer progressCurrent) {
    this.progressCurrent = progressCurrent;
  }

  public Integer getProgressTarget() {
    return progressTarget;
  }

  public void setProgressTarget(Integer progressTarget) {
    this.progressTarget = progressTarget;
  }

  public Boolean getIsCompleted() {
    return isCompleted;
  }

  public void setIsCompleted(Boolean isCompleted) {
    this.isCompleted = isCompleted;
  }

  public LocalDateTime getAchievedAt() {
    return achievedAt;
  }

  public void setAchievedAt(LocalDateTime achievedAt) {
    this.achievedAt = achievedAt;
  }

  public String getMetadata() {
    return metadata;
  }

  public void setMetadata(String metadata) {
    this.metadata = metadata;
  }

  public Double getCompletionPercentage() {
    return completionPercentage;
  }

  public void setCompletionPercentage(Double completionPercentage) {
    this.completionPercentage = completionPercentage;
  }

  public Boolean getCanLevelUp() {
    return canLevelUp;
  }

  public void setCanLevelUp(Boolean canLevelUp) {
    this.canLevelUp = canLevelUp;
  }

  public Integer getMaxLevel() {
    return maxLevel;
  }

  public void setMaxLevel(Integer maxLevel) {
    this.maxLevel = maxLevel;
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
    return "UserAchievementDTO{"
        + "id="
        + id
        + ", userId="
        + userId
        + ", achievementType="
        + achievementType
        + ", achievementName='"
        + achievementName
        + '\''
        + ", level="
        + level
        + ", progressCurrent="
        + progressCurrent
        + ", progressTarget="
        + progressTarget
        + ", isCompleted="
        + isCompleted
        + ", completionPercentage="
        + completionPercentage
        + '}';
  }
}
