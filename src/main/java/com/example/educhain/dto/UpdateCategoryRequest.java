package com.example.educhain.dto;

import jakarta.validation.constraints.Size;

/**
 * 更新分类请求DTO
 */
public class UpdateCategoryRequest {

    @Size(min = 1, max = 100, message = "分类名称长度必须在1-100个字符之间")
    private String name;

    private String description;

    private Long parentId;

    private Integer sortOrder;

    // 默认构造函数
    public UpdateCategoryRequest() {}

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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    @Override
    public String toString() {
        return "UpdateCategoryRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", parentId=" + parentId +
                ", sortOrder=" + sortOrder +
                '}';
    }
}