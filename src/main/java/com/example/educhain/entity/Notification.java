package com.example.educhain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 通知实体类
 */
@Entity
@Table(name = "notifications", 
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_is_read", columnList = "is_read"),
        @Index(name = "idx_created_at", columnList = "created_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "通知标题不能为空")
    @Size(min = 1, max = 200, message = "通知标题长度必须在1-200个字符之间")
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "通知内容不能为空")
    @Size(min = 1, max = 1000, message = "通知内容长度必须在1-1000个字符之间")
    private String content;

    @Column(name = "related_id")
    private Long relatedId; // 相关的知识内容ID、评论ID等

    @Column(name = "related_user_id")
    private Long relatedUserId; // 相关的用户ID（如点赞者、评论者）

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 通知类型枚举
    public enum NotificationType {
        LIKE("点赞通知"),
        COMMENT("评论通知"),
        REPLY("回复通知"),
        FOLLOW("关注通知"),
        SYSTEM("系统通知");

        private final String description;

        NotificationType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 默认构造函数
    public Notification() {}

    // 构造函数
    public Notification(Long userId, NotificationType type, String title, String content) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.content = content;
    }

    public Notification(Long userId, NotificationType type, String title, String content, 
                       Long relatedId, Long relatedUserId) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.content = content;
        this.relatedId = relatedId;
        this.relatedUserId = relatedUserId;
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

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
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

    public Long getRelatedId() {
        return relatedId;
    }

    public void setRelatedId(Long relatedId) {
        this.relatedId = relatedId;
    }

    public Long getRelatedUserId() {
        return relatedUserId;
    }

    public void setRelatedUserId(Long relatedUserId) {
        this.relatedUserId = relatedUserId;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", userId=" + userId +
                ", type=" + type +
                ", title='" + title + '\'' +
                ", relatedId=" + relatedId +
                ", relatedUserId=" + relatedUserId +
                ", isRead=" + isRead +
                ", createdAt=" + createdAt +
                '}';
    }
}