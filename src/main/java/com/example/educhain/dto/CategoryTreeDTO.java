package com.example.educhain.dto;

import java.util.List;

/**
 * 分类树DTO
 */
public class CategoryTreeDTO {

    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private Integer sortOrder;
    private Long knowledgeItemCount;
    private Long totalKnowledgeItemCount;
    private Integer depth;
    private List<CategoryTreeDTO> children;
    private boolean expanded; // 是否展开
    private boolean leaf; // 是否为叶子节点

    // 默认构造函数
    public CategoryTreeDTO() {}

    // 构造函数
    public CategoryTreeDTO(Long id, String name, String description, Long parentId, Integer sortOrder) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parentId = parentId;
        this.sortOrder = sortOrder;
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

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }

    public List<CategoryTreeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryTreeDTO> children) {
        this.children = children;
        this.leaf = (children == null || children.isEmpty());
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    public boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    @Override
    public String toString() {
        return "CategoryTreeDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", parentId=" + parentId +
                ", sortOrder=" + sortOrder +
                ", knowledgeItemCount=" + knowledgeItemCount +
                ", depth=" + depth +
                ", leaf=" + leaf +
                '}';
    }
}