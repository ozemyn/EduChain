package com.example.educhain.dto;

import com.example.educhain.entity.KnowledgeItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/** 搜索请求DTO */
public class SearchRequest {

  @NotBlank(message = "搜索关键词不能为空")
  @Size(min = 1, max = 100, message = "搜索关键词长度必须在1-100个字符之间")
  private String keyword;

  private Long categoryId; // 分类筛选

  private KnowledgeItem.ContentType contentType; // 内容类型筛选

  private Long uploaderId; // 上传者筛选

  private LocalDateTime startTime; // 时间范围筛选 - 开始时间

  private LocalDateTime endTime; // 时间范围筛选 - 结束时间

  private String sortBy = "relevance"; // 排序方式: relevance, time, popularity, quality

  private String sortOrder = "desc"; // 排序顺序: asc, desc

  private Integer page = 0; // 页码

  private Integer size = 20; // 每页大小

  private Boolean useFullText = true; // 是否使用全文搜索

  private Boolean highlightKeyword = true; // 是否高亮关键词

  // 默认构造函数
  public SearchRequest() {}

  // 构造函数
  public SearchRequest(String keyword) {
    this.keyword = keyword;
  }

  public SearchRequest(String keyword, Long categoryId, KnowledgeItem.ContentType contentType) {
    this.keyword = keyword;
    this.categoryId = categoryId;
    this.contentType = contentType;
  }

  // Getters and Setters
  public String getKeyword() {
    return keyword;
  }

  public void setKeyword(String keyword) {
    this.keyword = keyword;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public KnowledgeItem.ContentType getContentType() {
    return contentType;
  }

  public void setContentType(KnowledgeItem.ContentType contentType) {
    this.contentType = contentType;
  }

  public Long getUploaderId() {
    return uploaderId;
  }

  public void setUploaderId(Long uploaderId) {
    this.uploaderId = uploaderId;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }

  public LocalDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }

  public String getSortBy() {
    return sortBy;
  }

  public void setSortBy(String sortBy) {
    this.sortBy = sortBy;
  }

  public String getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(String sortOrder) {
    this.sortOrder = sortOrder;
  }

  public Integer getPage() {
    return page;
  }

  public void setPage(Integer page) {
    this.page = page;
  }

  public Integer getSize() {
    return size;
  }

  public void setSize(Integer size) {
    this.size = size;
  }

  public Boolean getUseFullText() {
    return useFullText;
  }

  public void setUseFullText(Boolean useFullText) {
    this.useFullText = useFullText;
  }

  public Boolean getHighlightKeyword() {
    return highlightKeyword;
  }

  public void setHighlightKeyword(Boolean highlightKeyword) {
    this.highlightKeyword = highlightKeyword;
  }

  @Override
  public String toString() {
    return "SearchRequest{"
        + "keyword='"
        + keyword
        + '\''
        + ", categoryId="
        + categoryId
        + ", contentType="
        + contentType
        + ", uploaderId="
        + uploaderId
        + ", sortBy='"
        + sortBy
        + '\''
        + ", sortOrder='"
        + sortOrder
        + '\''
        + ", page="
        + page
        + ", size="
        + size
        + '}';
  }
}
