package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** 创建知识内容请求DTO */
public class CreateKnowledgeRequest {

  @NotBlank(message = "标题不能为空")
  @Size(min = 1, max = 200, message = "标题长度必须在1-200个字符之间")
  private String title;

  private String content;

  @NotNull(message = "内容类型不能为空")
  private KnowledgeItem.ContentType type;

  private List<String> mediaUrls;

  private String linkUrl;

  @NotNull(message = "分类不能为空")
  private Long categoryId;

  private String tags;

  private List<String> tagList;

  private String description;

  private Integer status = 1; // 默认为正常状态

  // 默认构造函数
  public CreateKnowledgeRequest() {}

  // 构造函数
  public CreateKnowledgeRequest(
      String title, String content, KnowledgeItem.ContentType type, Long categoryId) {
    this.title = title;
    this.content = content;
    this.type = type;
    this.categoryId = categoryId;
  }

  // Getters and Setters
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

  public KnowledgeItem.ContentType getType() {
    return type;
  }

  public void setType(KnowledgeItem.ContentType type) {
    this.type = type;
  }

  public List<String> getMediaUrls() {
    return mediaUrls;
  }

  public void setMediaUrls(List<String> mediaUrls) {
    this.mediaUrls = mediaUrls;
  }

  public String getLinkUrl() {
    return linkUrl;
  }

  public void setLinkUrl(String linkUrl) {
    this.linkUrl = linkUrl;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getTags() {
    return tags;
  }

  public void setTags(String tags) {
    this.tags = tags;
  }

  public List<String> getTagList() {
    return tagList;
  }

  public void setTagList(List<String> tagList) {
    this.tagList = tagList;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getStatus() {
    return status;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }

  @Override
  public String toString() {
    return "CreateKnowledgeRequest{"
        + "title='"
        + title
        + '\''
        + ", type="
        + type
        + ", categoryId="
        + categoryId
        + ", tags='"
        + tags
        + '\''
        + ", status="
        + status
        + '}';
  }
}
