package com.example.educhain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 标签实体类
 */
@Entity
@Table(name = "tags", indexes = {
    @Index(name = "idx_name", columnList = "name", unique = true),
    @Index(name = "idx_usage_count", columnList = "usage_count"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    @NotBlank(message = "标签名称不能为空")
    @Size(min = 1, max = 50, message = "标签名称长度必须在1-50个字符之间")
    private String name;

    @Column(length = 200)
    private String description;

    @Column(name = "usage_count", nullable = false)
    private Long usageCount = 0L;

    @Column(length = 50)
    private String category; // 标签分类，如：技术、学科、难度等

    @Column(length = 20)
    private String color; // 标签颜色，用于前端显示

    @Column(nullable = false)
    private Integer status = 1; // 1: 正常, 0: 禁用

    @Column(name = "creator_id")
    private Long creatorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", insertable = false, updatable = false)
    private User creator;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 默认构造函数
    public Tag() {}

    // 构造函数
    public Tag(String name, String description, String category) {
        this.name = name;
        this.description = description;
        this.category = category;
    }

    public Tag(String name, String description, String category, Long creatorId) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.creatorId = creatorId;
    }

    /**
     * 增加使用次数
     */
    public void incrementUsageCount() {
        this.usageCount++;
        this.lastUsedAt = LocalDateTime.now();
    }

    /**
     * 减少使用次数
     */
    public void decrementUsageCount() {
        if (this.usageCount > 0) {
            this.usageCount--;
        }
    }

    /**
     * 检查标签是否活跃（最近使用过）
     */
    public boolean isActive(int daysThreshold) {
        if (lastUsedAt == null) {
            return false;
        }
        return lastUsedAt.isAfter(LocalDateTime.now().minusDays(daysThreshold));
    }

    /**
     * 检查标签是否热门
     */
    public boolean isPopular(long usageThreshold) {
        return this.usageCount >= usageThreshold;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(Long usageCount) {
        this.usageCount = usageCount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(LocalDateTime lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return name != null ? name.equals(tag.name) : tag.name == null;
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Tag{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", usageCount=" + usageCount +
                ", category='" + category + '\'' +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}