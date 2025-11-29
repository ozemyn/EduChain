package com.example.educhain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

/** 分类DTO */
public class CategoryDTO {

  private Long id;
  private String name;
  private String description;
  private Long parentId;
  private String parentName;
  private Integer sortOrder;
  private Long knowledgeItemCount;
  private Long totalKnowledgeItemCount; // 包含子分类的总数
  private Integer childrenCount;
  private Integer depth;
  private List<CategoryDTO> children;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createdAt;

  // 默认构造函数
  public CategoryDTO() {}

  // 构造函数
  public CategoryDTO(
      Long id,
      String name,
      String description,
      Long parentId,
      Integer sortOrder,
      LocalDateTime createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.parentId = parentId;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
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

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public String getParentName() {
    return parentName;
  }

  public void setParentName(String parentName) {
    this.parentName = parentName;
  }

  public Integer getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(Integer sortOrder) {
    this.sortOrder = sortOrder;
  }

  public Long getKnowledgeItemCount() {
    return knowledgeItemCount;
  }

  public void setKnowledgeItemCount(Long knowledgeItemCount) {
    this.knowledgeItemCount = knowledgeItemCount;
  }

  public Long getTotalKnowledgeItemCount() {
    return totalKnowledgeItemCount;
  }

  public void setTotalKnowledgeItemCount(Long totalKnowledgeItemCount) {
    this.totalKnowledgeItemCount = totalKnowledgeItemCount;
  }

  public Integer getChildrenCount() {
    return childrenCount;
  }

  public void setChildrenCount(Integer childrenCount) {
    this.childrenCount = childrenCount;
  }

  public Integer getDepth() {
    return depth;
  }

  public void setDepth(Integer depth) {
    this.depth = depth;
  }

  public List<CategoryDTO> getChildren() {
    return children;
  }

  public void setChildren(List<CategoryDTO> children) {
    this.children = children;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public String toString() {
    return "CategoryDTO{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", description='"
        + description
        + '\''
        + ", parentId="
        + parentId
        + ", sortOrder="
        + sortOrder
        + ", knowledgeItemCount="
        + knowledgeItemCount
        + ", childrenCount="
        + childrenCount
        + ", createdAt="
        + createdAt
        + '}';
  }
}
