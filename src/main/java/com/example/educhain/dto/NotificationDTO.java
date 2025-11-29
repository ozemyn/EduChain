package com.example.educhain.dto;

import com.example.educhain.entity.Notification;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/** 通知DTO */
public class NotificationDTO {

  private Long id;
  private Long userId;
  private Notification.NotificationType type;
  private String title;
  private String content;
  private Long relatedId;
  private Long relatedUserId;
  private String relatedUsername;
  private Boolean isRead;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createdAt;

  // 默认构造函数
  public NotificationDTO() {}

  // 构造函数
  public NotificationDTO(
      Long id,
      Long userId,
      Notification.NotificationType type,
      String title,
      String content,
      Boolean isRead,
      LocalDateTime createdAt) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.content = content;
    this.isRead = isRead;
    this.createdAt = createdAt;
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

  public Notification.NotificationType getType() {
    return type;
  }

  public void setType(Notification.NotificationType type) {
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

  public String getRelatedUsername() {
    return relatedUsername;
  }

  public void setRelatedUsername(String relatedUsername) {
    this.relatedUsername = relatedUsername;
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
}
