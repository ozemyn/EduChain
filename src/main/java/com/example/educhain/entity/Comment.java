package com.example.educhain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 评论实体类 */
@Entity
@Table(
    name = "comments",
    indexes = {
      @Index(name = "idx_knowledge_id", columnList = "knowledge_id"),
      @Index(name = "idx_user_id", columnList = "user_id"),
      @Index(name = "idx_parent_id", columnList = "parent_id"),
      @Index(name = "idx_status", columnList = "status"),
      @Index(name = "idx_created_at", columnList = "created_at")
    })
@EntityListeners(AuditingEntityListener.class)
public class Comment {

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

  @Column(name = "parent_id")
  private Long parentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id", insertable = false, updatable = false)
  private Comment parent;

  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Comment> replies = new ArrayList<>();

  @Column(nullable = false, columnDefinition = "TEXT")
  @NotBlank(message = "评论内容不能为空")
  @Size(min = 1, max = 1000, message = "评论内容长度必须在1-1000个字符之间")
  private String content;

  @Column(nullable = false)
  private Integer status = 1; // 1: 正常, 0: 删除, 2: 待审核

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  // 默认构造函数
  public Comment() {}

  // 构造函数
  public Comment(Long knowledgeId, Long userId, String content) {
    this.knowledgeId = knowledgeId;
    this.userId = userId;
    this.content = content;
  }

  public Comment(Long knowledgeId, Long userId, String content, Long parentId) {
    this.knowledgeId = knowledgeId;
    this.userId = userId;
    this.content = content;
    this.parentId = parentId;
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

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Comment getParent() {
    return parent;
  }

  public void setParent(Comment parent) {
    this.parent = parent;
  }

  public List<Comment> getReplies() {
    return replies;
  }

  public void setReplies(List<Comment> replies) {
    this.replies = replies;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
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

  @Override
  public String toString() {
    return "Comment{"
        + "id="
        + id
        + ", knowledgeId="
        + knowledgeId
        + ", userId="
        + userId
        + ", parentId="
        + parentId
        + ", content='"
        + content
        + '\''
        + ", status="
        + status
        + ", createdAt="
        + createdAt
        + '}';
  }
}
