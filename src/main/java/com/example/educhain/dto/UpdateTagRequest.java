package com.example.educhain.dto;

import jakarta.validation.constraints.Size;

/** 更新标签请求DTO */
public class UpdateTagRequest {

  @Size(min = 1, max = 50, message = "标签名称长度必须在1-50个字符之间")
  private String name;

  private String description;

  private String category;

  private String color;

  private Integer status;

  // 默认构造函数
  public UpdateTagRequest() {}

  // Getters and Setters
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

  @Override
  public String toString() {
    return "UpdateTagRequest{"
        + "name='"
        + name
        + '\''
        + ", description='"
        + description
        + '\''
        + ", category='"
        + category
        + '\''
        + ", color='"
        + color
        + '\''
        + ", status="
        + status
        + '}';
  }
}
