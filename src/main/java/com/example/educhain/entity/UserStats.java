package com.example.educhain.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 用户统计实体类
 */
@Entity
@Table(name = "user_stats", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_total_score", columnList = "total_score")
})
@EntityListeners(AuditingEntityListener.class)
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "knowledge_count", nullable = false)
    private Integer knowledgeCount = 0;

    @Column(name = "like_count", nullable = false)
    private Integer likeCount = 0;

    @Column(name = "favorite_count", nullable = false)
    private Integer favoriteCount = 0;

    @Column(name = "comment_count", nullable = false)
    private Integer commentCount = 0;

    @Column(name = "follower_count", nullable = false)
    private Integer followerCount = 0;

    @Column(name = "following_count", nullable = false)
    private Integer followingCount = 0;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "achievement_count", nullable = false)
    private Integer achievementCount = 0;

    @Column(name = "login_count", nullable = false)
    private Integer loginCount = 0;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 默认构造函数
    public UserStats() {}

    // 构造函数
    public UserStats(Long userId) {
        this.userId = userId;
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

    /**
     * 增加知识内容数量
     */
    public void incrementKnowledgeCount() {
        this.knowledgeCount++;
    }

    /**
     * 减少知识内容数量
     */
    public void decrementKnowledgeCount() {
        if (this.knowledgeCount > 0) {
            this.knowledgeCount--;
        }
    }

    /**
     * 增加点赞数量
     */
    public void incrementLikeCount() {
        this.likeCount++;
    }

    /**
     * 减少点赞数量
     */
    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    /**
     * 增加收藏数量
     */
    public void incrementFavoriteCount() {
        this.favoriteCount++;
    }

    /**
     * 减少收藏数量
     */
    public void decrementFavoriteCount() {
        if (this.favoriteCount > 0) {
            this.favoriteCount--;
        }
    }

    /**
     * 增加评论数量
     */
    public void incrementCommentCount() {
        this.commentCount++;
    }

    /**
     * 减少评论数量
     */
    public void decrementCommentCount() {
        if (this.commentCount > 0) {
            this.commentCount--;
        }
    }

    /**
     * 增加关注者数量
     */
    public void incrementFollowerCount() {
        this.followerCount++;
    }

    /**
     * 减少关注者数量
     */
    public void decrementFollowerCount() {
        if (this.followerCount > 0) {
            this.followerCount--;
        }
    }

    /**
     * 增加关注数量
     */
    public void incrementFollowingCount() {
        this.followingCount++;
    }

    /**
     * 减少关注数量
     */
    public void decrementFollowingCount() {
        if (this.followingCount > 0) {
            this.followingCount--;
        }
    }

    /**
     * 增加浏览量
     */
    public void incrementViewCount() {
        this.viewCount++;
    }

    /**
     * 增加积分
     */
    public void addScore(Integer score) {
        this.totalScore += score;
    }

    /**
     * 记录登录
     */
    public void recordLogin() {
        this.loginCount++;
        this.lastLoginAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "UserStats{" +
                "id=" + id +
                ", userId=" + userId +
                ", knowledgeCount=" + knowledgeCount +
                ", likeCount=" + likeCount +
                ", favoriteCount=" + favoriteCount +
                ", followerCount=" + followerCount +
                ", totalScore=" + totalScore +
                ", loginCount=" + loginCount +
                '}';
    }
}