package com.example.educhain.service;

import com.example.educhain.dto.CategoryDTO;
import com.example.educhain.dto.CategoryTreeDTO;
import com.example.educhain.dto.CreateCategoryRequest;
import com.example.educhain.dto.UpdateCategoryRequest;
import com.example.educhain.entity.Category;

import java.util.List;

/**
 * 分类管理服务接口
 */
public interface CategoryService {

    /**
     * 创建分类
     */
    CategoryDTO create(CreateCategoryRequest request);

    /**
     * 更新分类
     */
    CategoryDTO update(Long id, UpdateCategoryRequest request);

    /**
     * 删除分类
     */
    void delete(Long id);

    /**
     * 根据ID获取分类
     */
    CategoryDTO findById(Long id);

    /**
     * 获取所有分类
     */
    List<CategoryDTO> findAll();

    /**
     * 获取根分类列表
     */
    List<CategoryDTO> findRootCategories();

    /**
     * 获取指定分类的子分类
     */
    List<CategoryDTO> findChildren(Long parentId);

    /**
     * 获取分类树结构
     */
    List<CategoryTreeDTO> getCategoryTree();

    /**
     * 获取指定分类的子树
     */
    CategoryTreeDTO getCategorySubTree(Long categoryId);

    /**
     * 获取分类路径（面包屑导航）
     */
    List<CategoryDTO> getCategoryPath(Long categoryId);

    /**
     * 移动分类到新的父分类下
     */
    void moveCategory(Long categoryId, Long newParentId);

    /**
     * 调整分类排序
     */
    void updateSortOrder(Long categoryId, Integer newSortOrder);

    /**
     * 批量调整分类排序
     */
    void batchUpdateSortOrder(List<CategorySortRequest> requests);

    /**
     * 搜索分类
     */
    List<CategoryDTO> searchCategories(String keyword);

    /**
     * 获取热门分类
     */
    List<CategoryStatsDTO> getPopularCategories(int limit);

    /**
     * 获取最近使用的分类
     */
    List<CategoryDTO> getRecentlyUsedCategories(int limit);

    /**
     * 获取分类统计信息
     */
    CategoryStatsDTO getCategoryStats(Long categoryId);

    /**
     * 获取所有分类的统计信息
     */
    List<CategoryStatsDTO> getAllCategoryStats();

    /**
     * 检查分类是否可以删除
     */
    boolean canDelete(Long categoryId);

    /**
     * 检查分类名称是否唯一
     */
    boolean isNameUnique(String name, Long parentId, Long excludeId);

    /**
     * 验证分类层级深度
     */
    boolean isValidDepth(Long parentId);

    /**
     * 获取分类的层级深度
     */
    int getCategoryDepth(Long categoryId);

    /**
     * 分类排序请求
     */
    class CategorySortRequest {
        private Long categoryId;
        private Integer sortOrder;

        public CategorySortRequest() {}

        public CategorySortRequest(Long categoryId, Integer sortOrder) {
            this.categoryId = categoryId;
            this.sortOrder = sortOrder;
        }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public Integer getSortOrder() { return sortOrder; }
        public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    }

    /**
     * 分类统计信息
     */
    class CategoryStatsDTO {
        private Long categoryId;
        private String categoryName;
        private Long knowledgeItemCount;
        private Long totalKnowledgeItemCount; // 包含子分类
        private Integer childrenCount;
        private Integer depth;

        public CategoryStatsDTO() {}

        public CategoryStatsDTO(Long categoryId, String categoryName, Long knowledgeItemCount,
                               Long totalKnowledgeItemCount, Integer childrenCount, Integer depth) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.knowledgeItemCount = knowledgeItemCount;
            this.totalKnowledgeItemCount = totalKnowledgeItemCount;
            this.childrenCount = childrenCount;
            this.depth = depth;
        }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public Long getKnowledgeItemCount() { return knowledgeItemCount; }
        public void setKnowledgeItemCount(Long knowledgeItemCount) { this.knowledgeItemCount = knowledgeItemCount; }

        public Long getTotalKnowledgeItemCount() { return totalKnowledgeItemCount; }
        public void setTotalKnowledgeItemCount(Long totalKnowledgeItemCount) { this.totalKnowledgeItemCount = totalKnowledgeItemCount; }

        public Integer getChildrenCount() { return childrenCount; }
        public void setChildrenCount(Integer childrenCount) { this.childrenCount = childrenCount; }

        public Integer getDepth() { return depth; }
        public void setDepth(Integer depth) { this.depth = depth; }
    }
}