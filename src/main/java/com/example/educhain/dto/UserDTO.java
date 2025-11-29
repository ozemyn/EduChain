package com.example.educhain.dto;

import com.example.educhain.entity.User;
import java.time.LocalDateTime;

/** 用户信息DTO */
public class UserDTO {

  private Long id;
  private String username;
  private String email;
  private User.UserRole role;
  private String fullName;
  private String avatarUrl;
  private String school;
  private Integer level;
  private String bio;
  private Integer status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // 默认构造函数
  public UserDTO() {}

  // 从User实体创建DTO的构造函数
  public UserDTO(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.email = user.getEmail();
    this.role = user.getRole();
    this.fullName = user.getFullName();
    this.avatarUrl = user.getAvatarUrl();
    this.school = user.getSchool();
    this.level = user.getLevel();
    this.bio = user.getBio();
    this.status = user.getStatus();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();
  }

  // 静态工厂方法
  public static UserDTO fromEntity(User user) {
    return new UserDTO(user);
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public User.UserRole getRole() {
    return role;
  }

  public void setRole(User.UserRole role) {
    this.role = role;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
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

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public String toString() {
    return "UserDTO{"
        + "id="
        + id
        + ", username='"
        + username
        + '\''
        + ", email='"
        + email
        + '\''
        + ", role="
        + role
        + ", fullName='"
        + fullName
        + '\''
        + ", level="
        + level
        + ", status="
        + status
        + '}';
  }
}
