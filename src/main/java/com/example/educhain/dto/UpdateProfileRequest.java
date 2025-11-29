package com.example.educhain.dto;

import jakarta.validation.constraints.Size;

/** 更新用户信息请求DTO */
public class UpdateProfileRequest {

  @Size(max = 100, message = "姓名长度不能超过100个字符")
  private String fullName;

  @Size(max = 500, message = "头像URL长度不能超过500个字符")
  private String avatarUrl;

  @Size(max = 100, message = "学校名称长度不能超过100个字符")
  private String school;

  @Size(max = 500, message = "个人简介长度不能超过500个字符")
  private String bio;

  // 默认构造函数
  public UpdateProfileRequest() {}

  // 构造函数
  public UpdateProfileRequest(String fullName, String avatarUrl, String school, String bio) {
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.school = school;
    this.bio = bio;
  }

  // Getters and Setters
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

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  @Override
  public String toString() {
    return "UpdateProfileRequest{"
        + "fullName='"
        + fullName
        + '\''
        + ", school='"
        + school
        + '\''
        + ", bio='"
        + bio
        + '\''
        + '}';
  }
}
