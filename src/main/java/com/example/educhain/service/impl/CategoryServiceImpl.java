package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.Category;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.CategoryRepository;
import com.example.educhain.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 分类管理服务实现类
 */
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
    private static final int MAX_CATEGORY_DEPTH = 5; // 最大分类层级深度

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public CategoryDTO create(CreateCategoryRequest request) {
        validateCreateRequest(request);
        
        // 检查名称唯一性
        if (!isNameUnique(request.getName(), request.getParentId(), null)) {
            throw new BusinessException("CATEGORY_NAME_EXISTS", "分类名称已存在");
        }
        
        // 验证父分类存在性和层级深度
        if (request.getParentId() != null) {
            if (!categoryRepository.existsById(request.getParentId())) {
                throw new BusinessException("PARENT_CATEGORY_NOT_FOUND", "父分类不存在");
            }
            
            if (!isValidDepth(request.getParentId())) {
                throw new BusinessException("CATEGORY_DEPTH_EXCEEDED", "分类层级深度超过限制");
            }
        }
        
        // 设置排序号
        Integer sortOrder = request.getSortOrder();
        if (sortOrder == null) {
            sortOrder = getNextSortOrder(request.getParentId());
        }
        
        // 创建分类
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setSortOrder(sortOrder);
        
        Category savedCategory = categoryRepository.save(category);
        
        logger.info("Category created: {} (ID: {})", savedCategory.getName(), savedCategory.getId());
        
        return convertToDTO(savedCategory);
    }

    @Override
    @CacheEvict(value = {"categories", "categoryTree"}, key = "#id")
    public CategoryDTO update(Long id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        boolean hasChanges = false;
        
        // 更新名称
        if (request.getName() != null && !request.getName().equals(category.getName())) {
            if (!isNameUnique(request.getName(), category.getParentId(), id)) {
                throw new BusinessException("CATEGORY_NAME_EXISTS", "分类名称已存在");
            }
            category.setName(request.getName());
            hasChanges = true;
        }
        
        // 更新描述
        if (request.getDescription() != null && !request.getDescription().equals(category.getDescription())) {
            category.setDescription(request.getDescription());
            hasChanges = true;
        }
        
        // 更新父分类
        if (request.getParentId() != null && !request.getParentId().equals(category.getParentId())) {
            validateParentChange(id, request.getParentId());
            category.setParentId(request.getParentId());
            hasChanges = true;
        }
        
        // 更新排序号
        if (request.getSortOrder() != null && !request.getSortOrder().equals(category.getSortOrder())) {
            category.setSortOrder(request.getSortOrder());
            hasChanges = true;
        }
        
        if (hasChanges) {
            Category updatedCategory = categoryRepository.save(category);
            logger.info("Category updated: {} (ID: {})", updatedCategory.getName(), updatedCategory.getId());
        }
        
        return convertToDTO(category);
    }

    @Override
    @CacheEvict(value = {"categories", "categoryTree"}, key = "#id", allEntries = true)
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        if (!canDelete(id)) {
            throw new BusinessException("CATEGORY_CANNOT_DELETE", "分类不能删除，存在子分类或关联的知识内容");
        }
        
        categoryRepository.delete(category);
        
        logger.info("Category deleted: {} (ID: {})", category.getName(), category.getId());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categories", key = "#id")
    public CategoryDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        return convertToDTO(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> findRootCategories() {
        List<Category> rootCategories = categoryRepository.findByParentIdIsNullOrderBySortOrderAsc();
        return rootCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> findChildren(Long parentId) {
        List<Category> children = categoryRepository.findByParentIdOrderBySortOrderAsc(parentId);
        return children.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryTreeDTO> getCategoryTree() {
        List<Category> rootCategories = categoryRepository.findByParentIdIsNullOrderBySortOrderAsc();
        return rootCategories.stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryTreeDTO getCategorySubTree(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        return buildCategoryTree(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoryPath(Long categoryId) {
        // 使用递归查询一次性获取所有父分类，避免N+1查询
        List<Object[]> categoryPathData = categoryRepository.findCategoryPathById(categoryId);
        
        if (categoryPathData.isEmpty()) {
            throw new BusinessException("CATEGORY_NOT_FOUND", "分类不存在");
        }
        
        // 将查询结果转换为CategoryDTO列表
        List<CategoryDTO> path = new ArrayList<>();
        for (Object[] row : categoryPathData) {
            CategoryDTO dto = new CategoryDTO();
            dto.setId(((Number) row[0]).longValue());
            dto.setName((String) row[1]);
            dto.setDescription((String) row[2]);
            dto.setParentId(row[3] != null ? ((Number) row[3]).longValue() : null);
            dto.setSortOrder(row[4] != null ? ((Number) row[4]).intValue() : 0);
            path.add(dto);
        }
        
        return path;
    }

    @Override
    public void moveCategory(Long categoryId, Long newParentId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        validateParentChange(categoryId, newParentId);
        
        category.setParentId(newParentId);
        category.setSortOrder(getNextSortOrder(newParentId));
        
        categoryRepository.save(category);
        
        logger.info("Category moved: {} (ID: {}) to parent: {}", category.getName(), categoryId, newParentId);
    }

    @Override
    public void updateSortOrder(Long categoryId, Integer newSortOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        category.setSortOrder(newSortOrder);
        categoryRepository.save(category);
        
        logger.info("Category sort order updated: {} (ID: {}) to {}", category.getName(), categoryId, newSortOrder);
    }

    @Override
    public void batchUpdateSortOrder(List<CategorySortRequest> requests) {
        for (CategorySortRequest request : requests) {
            try {
                updateSortOrder(request.getCategoryId(), request.getSortOrder());
            } catch (Exception e) {
                logger.error("Failed to update sort order for category {}: {}", request.getCategoryId(), e.getMessage());
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> searchCategories(String keyword) {
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCaseOrderBySortOrderAsc(keyword);
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryStatsDTO> getPopularCategories(int limit) {
        List<Object[]> results = categoryRepository.findPopularCategories();
        
        return results.stream()
                .limit(limit)
                .map(row -> {
                    Category category = (Category) row[0];
                    Long itemCount = (Long) row[1];
                    
                    return new CategoryStatsDTO(
                            category.getId(),
                            category.getName(),
                            itemCount,
                            categoryRepository.getTotalKnowledgeItemCount(category.getId()),
                            categoryRepository.countByParentId(category.getId()).intValue(),
                            getCategoryDepth(category.getId())
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getRecentlyUsedCategories(int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(30); // 最近30天
        List<Category> categories = categoryRepository.findRecentlyUsedCategories(since);
        
        return categories.stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryStatsDTO getCategoryStats(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
        
        Long knowledgeItemCount = categoryRepository.getKnowledgeItemCount(categoryId);
        Long totalKnowledgeItemCount = categoryRepository.getTotalKnowledgeItemCount(categoryId);
        Integer childrenCount = categoryRepository.countByParentId(categoryId).intValue();
        Integer depth = getCategoryDepth(categoryId);
        
        return new CategoryStatsDTO(
                categoryId,
                category.getName(),
                knowledgeItemCount,
                totalKnowledgeItemCount,
                childrenCount,
                depth
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryStatsDTO> getAllCategoryStats() {
        List<Category> categories = categoryRepository.findAll();
        
        return categories.stream()
                .map(category -> getCategoryStats(category.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canDelete(Long categoryId) {
        // 检查是否有子分类
        if (categoryRepository.hasChildren(categoryId)) {
            return false;
        }
        
        // 检查是否有关联的知识内容
        if (categoryRepository.hasKnowledgeItems(categoryId)) {
            return false;
        }
        
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isNameUnique(String name, Long parentId, Long excludeId) {
        if (excludeId == null) {
            excludeId = -1L; // 使用一个不存在的ID
        }
        
        if (parentId == null) {
            return !categoryRepository.existsByNameAndParentIdIsNullAndIdNot(name, excludeId);
        } else {
            return !categoryRepository.existsByNameAndParentIdAndIdNot(name, parentId, excludeId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isValidDepth(Long parentId) {
        if (parentId == null) {
            return true; // 根分类
        }
        
        Integer depth = categoryRepository.getCategoryDepth(parentId);
        return depth == null || depth < MAX_CATEGORY_DEPTH;
    }

    @Override
    @Transactional(readOnly = true)
    public int getCategoryDepth(Long categoryId) {
        Integer depth = categoryRepository.getCategoryDepth(categoryId);
        return depth != null ? depth : 0;
    }

    // 私有辅助方法
    private void validateCreateRequest(CreateCategoryRequest request) {
        if (request == null) {
            throw new BusinessException("INVALID_REQUEST", "请求参数不能为空");
        }
        
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BusinessException("CATEGORY_NAME_REQUIRED", "分类名称不能为空");
        }
    }

    private void validateParentChange(Long categoryId, Long newParentId) {
        if (newParentId == null) {
            return; // 移动到根级别
        }
        
        // 检查新父分类是否存在
        if (!categoryRepository.existsById(newParentId)) {
            throw new BusinessException("PARENT_CATEGORY_NOT_FOUND", "父分类不存在");
        }
        
        // 检查是否会形成循环引用
        if (wouldCreateCycle(categoryId, newParentId)) {
            throw new BusinessException("CATEGORY_CYCLE_DETECTED", "不能将分类移动到其子分类下");
        }
        
        // 检查层级深度
        if (!isValidDepth(newParentId)) {
            throw new BusinessException("CATEGORY_DEPTH_EXCEEDED", "分类层级深度超过限制");
        }
    }

    private boolean wouldCreateCycle(Long categoryId, Long newParentId) {
        Long currentParentId = newParentId;
        
        while (currentParentId != null) {
            if (currentParentId.equals(categoryId)) {
                return true; // 发现循环
            }
            
            Category parent = categoryRepository.findById(currentParentId).orElse(null);
            currentParentId = parent != null ? parent.getParentId() : null;
        }
        
        return false;
    }

    private Integer getNextSortOrder(Long parentId) {
        Integer maxSortOrder;
        
        if (parentId == null) {
            maxSortOrder = categoryRepository.getMaxSortOrderForRootCategories();
        } else {
            maxSortOrder = categoryRepository.getMaxSortOrderByParentId(parentId);
        }
        
        return maxSortOrder != null ? maxSortOrder + 1 : 1;
    }

    private CategoryTreeDTO buildCategoryTree(Category category) {
        CategoryTreeDTO treeDTO = new CategoryTreeDTO();
        treeDTO.setId(category.getId());
        treeDTO.setName(category.getName());
        treeDTO.setDescription(category.getDescription());
        treeDTO.setParentId(category.getParentId());
        treeDTO.setSortOrder(category.getSortOrder());
        treeDTO.setKnowledgeItemCount(categoryRepository.getKnowledgeItemCount(category.getId()));
        treeDTO.setTotalKnowledgeItemCount(categoryRepository.getTotalKnowledgeItemCount(category.getId()));
        treeDTO.setDepth(getCategoryDepth(category.getId()));
        
        // 递归构建子分类树
        List<Category> children = categoryRepository.findByParentIdOrderBySortOrderAsc(category.getId());
        if (!children.isEmpty()) {
            List<CategoryTreeDTO> childrenDTOs = children.stream()
                    .map(this::buildCategoryTree)
                    .collect(Collectors.toList());
            treeDTO.setChildren(childrenDTOs);
            treeDTO.setLeaf(false);
        } else {
            treeDTO.setLeaf(true);
        }
        
        return treeDTO;
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setParentId(category.getParentId());
        dto.setSortOrder(category.getSortOrder());
        dto.setCreatedAt(category.getCreatedAt());
        
        // 设置统计信息
        dto.setKnowledgeItemCount(categoryRepository.getKnowledgeItemCount(category.getId()));
        dto.setTotalKnowledgeItemCount(categoryRepository.getTotalKnowledgeItemCount(category.getId()));
        dto.setChildrenCount(categoryRepository.countByParentId(category.getId()).intValue());
        dto.setDepth(getCategoryDepth(category.getId()));
        
        // 设置父分类名称
        if (category.getParentId() != null) {
            categoryRepository.findById(category.getParentId()).ifPresent(parent -> {
                dto.setParentName(parent.getName());
            });
        }
        
        return dto;
    }
}