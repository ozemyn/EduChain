package com.example.educhain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 用户互动实体类 (点赞、收藏、浏览等)
 */
@Entity
@Table(name = "user_interactions", 
    indexes = {
        @Index(name = "idx_knowledge_id", columnList = "knowledge_id"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_interaction_type", columnList = "interaction_type"),
        @Index(name = "idx_created_at", columnList = "created_at")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_knowledge_interaction", 
                         columnNames = {"user_id", "knowledge_id", "interaction_type"})
    }
)
@EntityListeners(AuditingEntityListener.class)
public class UserInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "knowledge_id", nullable = false)
    private Long knowledgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knowledge_id", insertable = false, updatable = false)
    @JsonIgnore
    private KnowledgeItem knowledgeItem;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "interaction_type", nullable = false, length = 20)
    private InteractionType interactionType;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 互动类型枚举
    public enum InteractionType {
        LIKE("点赞"),
        FAVORITE("收藏"),
        VIEW("浏览");

        private final String description;

        InteractionType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 默认构造函数
    public UserInteraction() {}

    // 构造函数
    public UserInteraction(Long knowledgeId, Long userId, InteractionType interactionType) {
        this.knowledgeId = knowledgeId;
        this.userId = userId;
        this.interactionType = interactionType;
    }

    public UserInteraction(Long knowledgeId, Long userId, InteractionType interactionType, String ipAddress) {
        this.knowledgeId = knowledgeId;
        this.userId = userId;
        this.interactionType = interactionType;
        this.ipAddress = ipAddress;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKnowledgeId() {
        return knowledgeId;
    }

    public void setKnowledgeId(Long knowledgeId) {
        this.knowledgeId = knowledgeId;
    }

    public KnowledgeItem getKnowledgeItem() {
        return knowledgeItem;
    }

    public void setKnowledgeItem(KnowledgeItem knowledgeItem) {
        this.knowledgeItem = knowledgeItem;
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

    public InteractionType getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(InteractionType interactionType) {
        this.interactionType = interactionType;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "UserInteraction{" +
                "id=" + id +
                ", knowledgeId=" + knowledgeId +
                ", userId=" + userId +
                ", interactionType=" + interactionType +
                ", ipAddress='" + ipAddress + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}