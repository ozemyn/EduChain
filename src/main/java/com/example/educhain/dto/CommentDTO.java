package com.example.educhain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

/** 评论DTO */
public class CommentDTO {

  private Long id;
  private Long knowledgeId;
  private Long userId;
  private String username;
  private String userAvatar;
  private Long parentId;
  private String content;
  private Integer status;
  private Long replyCount;
  private List<CommentDTO> replies;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createdAt;

  // 默认构造函数
  public CommentDTO() {}

  // 构造函数
  public CommentDTO(
      Long id,
      Long knowledgeId,
      Long userId,
      String username,
      String content,
      LocalDateTime createdAt) {
    this.id = id;
    this.knowledgeId = knowledgeId;
    this.userId = userId;
    this.username = username;
    this.content = content;
    this.createdAt = createdAt;
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

  public String getUserAvatar() {
    return userAvatar;
  }

  public void setUserAvatar(String userAvatar) {
    this.userAvatar = userAvatar;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
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

  public Long getReplyCount() {
    return replyCount;
  }

  public void setReplyCount(Long replyCount) {
    this.replyCount = replyCount;
  }

  public List<CommentDTO> getReplies() {
    return replies;
  }

  public void setReplies(List<CommentDTO> replies) {
    this.replies = replies;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
