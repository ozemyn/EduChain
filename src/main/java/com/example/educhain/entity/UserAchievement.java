package com.example.educhain.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 用户成就实体类
 */
@Entity
@Table(name = "user_achievements", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_achievement_type", columnList = "achievement_type"),
    @Index(name = "idx_achieved_at", columnList = "achieved_at"),
    @Index(name = "idx_user_achievement", columnList = "user_id, achievement_type", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "achievement_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AchievementType achievementType;

    @Column(name = "achievement_name", nullable = false, length = 100)
    private String achievementName;

    @Column(name = "achievement_description", columnDefinition = "TEXT")
    private String achievementDescription;

    @Column(name = "achievement_icon", length = 200)
    private String achievementIcon;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded = 0;

    @Column(name = "level", nullable = false)
    private Integer level = 1; // 成就等级

    @Column(name = "progress_current", nullable = false)
    private Integer progressCurrent = 0; // 当前进度

    @Column(name = "progress_target", nullable = false)
    private Integer progressTarget = 1; // 目标进度

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false;

    @Column(name = "achieved_at")
    private LocalDateTime achievedAt;

    @Column(name = "metadata", columnDefinition = "JSON")
    private String metadata; // 额外的成就数据

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 成就类型枚举
     */
    public enum AchievementType {
        KNOWLEDGE_CREATOR("知识创作者"),
        KNOWLEDGE_SHARER("知识分享者"),
        ACTIVE_LEARNER("活跃学习者"),
        SOCIAL_BUTTERFLY("社交达人"),
        QUALITY_CONTRIBUTOR("优质贡献者"),
        MILESTONE_ACHIEVER("里程碑达成者"),
        SPECIAL_EVENT("特殊事件"),
        SYSTEM_BADGE("系统徽章");

        private final String displayName;

        AchievementType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // 默认构造函数
    public UserAchievement() {}

    // 构造函数
    public UserAchievement(Long userId, AchievementType achievementType, String achievementName) {
        this.userId = userId;
        this.achievementType = achievementType;
        this.achievementName = achievementName;
    }

    /**
     * 更新进度
     */
    public void updateProgress(Integer progress) {
        this.progressCurrent = Math.max(0, progress);
        
        if (this.progressCurrent >= this.progressTarget && !this.isCompleted) {
            completeAchievement();
        }
    }

    /**
     * 增加进度
     */
    public void incrementProgress(Integer increment) {
        updateProgress(this.progressCurrent + increment);
    }

    /**
     * 完成成就
     */
    public void completeAchievement() {
        this.isCompleted = true;
        this.achievedAt = LocalDateTime.now();
        this.progressCurrent = this.progressTarget;
    }

    /**
     * 重置成就
     */
    public void resetAchievement() {
        this.isCompleted = false;
        this.achievedAt = null;
        this.progressCurrent = 0;
    }

    /**
     * 获取完成百分比
     */
    public double getCompletionPercentage() {
        if (progressTarget == 0) {
            return 0.0;
        }
        return Math.min(100.0, (double) progressCurrent / progressTarget * 100);
    }

    /**
     * 是否可以升级
     */
    public boolean canLevelUp() {
        return isCompleted && level < getMaxLevel();
    }

    /**
     * 升级成就
     */
    public void levelUp() {
        if (canLevelUp()) {
            this.level++;
            this.isCompleted = false;
            this.achievedAt = null;
            this.progressCurrent = 0;
            this.progressTarget = calculateNextLevelTarget();
        }
    }

    /**
     * 获取最大等级
     */
    public int getMaxLevel() {
        return switch (achievementType) {
            case KNOWLEDGE_CREATOR, KNOWLEDGE_SHARER -> 10;
            case ACTIVE_LEARNER, SOCIAL_BUTTERFLY -> 5;
            case QUALITY_CONTRIBUTOR -> 8;
            case MILESTONE_ACHIEVER -> 20;
            default -> 3;
        };
    }

    /**
     * 计算下一等级目标
     */
    private int calculateNextLevelTarget() {
        return switch (achievementType) {
            case KNOWLEDGE_CREATOR -> level * 10; // 每级需要创建更多知识
            case KNOWLEDGE_SHARER -> level * 5;   // 每级需要分享更多
            case ACTIVE_LEARNER -> level * 20;    // 每级需要更多活跃度
            case SOCIAL_BUTTERFLY -> level * 15; // 每级需要更多社交互动
            case QUALITY_CONTRIBUTOR -> level * 3; // 每级需要更多高质量内容
            default -> level * 5;
        };
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AchievementType getAchievementType() {
        return achievementType;
    }

    public void setAchievementType(AchievementType achievementType) {
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
        return "UserAchievement{" +
                "id=" + id +
                ", userId=" + userId +
                ", achievementType=" + achievementType +
                ", achievementName='" + achievementName + '\'' +
                ", level=" + level +
                ", progressCurrent=" + progressCurrent +
                ", progressTarget=" + progressTarget +
                ", isCompleted=" + isCompleted +
                ", achievedAt=" + achievedAt +
                '}';
    }
}