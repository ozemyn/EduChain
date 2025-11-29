package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.Category;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.CategoryRepository;
import com.example.educhain.service.CategoryService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 分类管理服务实现类 提供分类的创建、更新、删除、查询等完整功能 支持分类树结构、层级深度控制、排序管理、路径查询等高级功能 使用缓存优化分类查询性能 */
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

  private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
  private static final int MAX_CATEGORY_DEPTH = 5; // 最大分类层级深度

  @Autowired private CategoryRepository categoryRepository;

  /**
   * 创建新的分类 验证分类名称唯一性，检查层级深度，创建新的分类记录 如果未指定排序号，则自动分配下一个可用的排序号
   *
   * @param request 创建请求，包含分类名称、描述、父分类ID等信息
   * @return 创建成功的分类DTO
   * @throws BusinessException 分类名称已存在、父分类不存在或层级深度超过限制时抛出
   */
  @Override
  public CategoryDTO create(CreateCategoryRequest request) {
    validateCreateRequest(request);

    // 检查名称唯一性
    if (!isNameUnique(request.getName(), request.getParentId(), null)) {
      logger.warn(
          "创建分类失败: 分类名称已存在, name={}, parentId={}", request.getName(), request.getParentId());
      throw new BusinessException(
          "CATEGORY_NAME_EXISTS", String.format("分类名称'%s'在同级别下已存在", request.getName()));
    }

    // 验证父分类存在性和层级深度
    if (request.getParentId() != null) {
      if (!categoryRepository.existsById(request.getParentId())) {
        logger.warn(
            "创建分类失败: 父分类不存在, parentId={}, name={}", request.getParentId(), request.getName());
        throw new BusinessException(
            "PARENT_CATEGORY_NOT_FOUND", String.format("父分类(ID:%d)不存在", request.getParentId()));
      }

      if (!isValidDepth(request.getParentId())) {
        logger.warn(
            "创建分类失败: 分类层级深度超过限制, parentId={}, name={}", request.getParentId(), request.getName());
        throw new BusinessException(
            "CATEGORY_DEPTH_EXCEEDED", String.format("分类层级深度超过限制(最大%d层)", MAX_CATEGORY_DEPTH));
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

  /**
   * 更新现有分类信息 支持更新分类名称、描述、父分类和排序号 在更新前会验证名称唯一性和父分类的有效性 更新成功后会清除相关缓存
   *
   * @param id 分类ID
   * @param request 更新请求，包含要更新的字段
   * @return 更新后的分类DTO
   * @throws BusinessException 分类不存在、名称冲突或其他验证失败时抛出
   */
  @Override
  @CacheEvict(
      value = {"categories", "categoryTree"},
      key = "#id")
  public CategoryDTO update(Long id, UpdateCategoryRequest request) {
    try {
      Category category =
          categoryRepository
              .findById(id)
              .orElseThrow(
                  () -> {
                    logger.warn("更新分类失败: 分类不存在, categoryId={}", id);
                    return new BusinessException(
                        "CATEGORY_NOT_FOUND", String.format("分类(ID:%d)不存在", id));
                  });

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
      if (request.getDescription() != null
          && !request.getDescription().equals(category.getDescription())) {
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
      if (request.getSortOrder() != null
          && !request.getSortOrder().equals(category.getSortOrder())) {
        category.setSortOrder(request.getSortOrder());
        hasChanges = true;
      }

      if (hasChanges) {
        Category updatedCategory = categoryRepository.save(category);
        logger.info(
            "Category updated: {} (ID: {})", updatedCategory.getName(), updatedCategory.getId());
      }

      return convertToDTO(category);
    } catch (BusinessException e) {
      throw e;
    } catch (Exception e) {
      logger.error("更新分类失败: categoryId={}, error={}", id, e.getMessage(), e);
      throw new BusinessException("UPDATE_CATEGORY_FAILED", "更新分类失败");
    }
  }

  /**
   * 删除指定分类 删除前会检查分类是否可以删除（无子分类且无关联的知识内容） 删除成功后会清除所有相关缓存
   *
   * @param id 要删除的分类ID
   * @throws BusinessException 分类不存在或无法删除时抛出
   */
  @Override
  @CacheEvict(
      value = {"categories", "categoryTree"},
      key = "#id",
      allEntries = true)
  public void delete(Long id) {
    Category category =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));

    if (!canDelete(id)) {
      throw new BusinessException("CATEGORY_CANNOT_DELETE", "分类不能删除，存在子分类或关联的知识内容");
    }

    categoryRepository.delete(category);

    logger.info("Category deleted: {} (ID: {})", category.getName(), category.getId());
  }

  /**
   * 根据ID查找分类 使用缓存优化查询性能 如果分类不存在则抛出异常
   *
   * @param id 分类ID
   * @return 分类DTO
   * @throws BusinessException 分类不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  @Cacheable(value = "categories", key = "#id")
  public CategoryDTO findById(Long id) {
    Category category =
        categoryRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));

    return convertToDTO(category);
  }

  /**
   * 查询所有分类 返回系统中所有的分类信息
   *
   * @return 所有分类的DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> findAll() {
    List<Category> categories = categoryRepository.findAll();
    return categories.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 查询所有根分类（没有父分类的分类） 按照排序号升序排列
   *
   * @return 根分类的DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> findRootCategories() {
    List<Category> rootCategories = categoryRepository.findByParentIdIsNullOrderBySortOrderAsc();
    return rootCategories.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 查询指定父分类下的所有子分类 按照排序号升序排列
   *
   * @param parentId 父分类ID
   * @return 子分类的DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> findChildren(Long parentId) {
    List<Category> children = categoryRepository.findByParentIdOrderBySortOrderAsc(parentId);
    return children.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 获取完整的分类树结构 递归构建从根分类开始的完整分类树
   *
   * @return 分类树DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryTreeDTO> getCategoryTree() {
    List<Category> rootCategories = categoryRepository.findByParentIdIsNullOrderBySortOrderAsc();
    return rootCategories.stream().map(this::buildCategoryTree).collect(Collectors.toList());
  }

  /**
   * 获取指定分类的子树结构 以指定分类为根节点，递归构建其子树
   *
   * @param categoryId 分类ID
   * @return 分类子树DTO
   * @throws BusinessException 分类不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public CategoryTreeDTO getCategorySubTree(Long categoryId) {
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));

    return buildCategoryTree(category);
  }

  /**
   * 获取分类的路径信息（面包屑导航） 从根分类到指定分类的完整路径
   *
   * @param categoryId 分类ID
   * @return 分类路径的DTO列表
   * @throws BusinessException 分类不存在时抛出
   */
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

  /**
   * 移动分类到新的父分类下 支持将分类移动到根级别或其它父分类下 移动后会自动分配新的排序号
   *
   * @param categoryId 要移动的分类ID
   * @param newParentId 新的父分类ID，null表示移动到根级别
   * @throws BusinessException 分类不存在或移动操作无效时抛出
   */
  @Override
  public void moveCategory(Long categoryId, Long newParentId) {
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));

    validateParentChange(categoryId, newParentId);

    category.setParentId(newParentId);
    category.setSortOrder(getNextSortOrder(newParentId));

    categoryRepository.save(category);

    logger.info(
        "Category moved: {} (ID: {}) to parent: {}", category.getName(), categoryId, newParentId);
  }

  /**
   * 更新分类的排序号 直接修改指定分类的排序位置
   *
   * @param categoryId 分类ID
   * @param newSortOrder 新的排序号
   * @throws BusinessException 分类不存在时抛出
   */
  @Override
  public void updateSortOrder(Long categoryId, Integer newSortOrder) {
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));

    category.setSortOrder(newSortOrder);
    categoryRepository.save(category);

    logger.info(
        "Category sort order updated: {} (ID: {}) to {}",
        category.getName(),
        categoryId,
        newSortOrder);
  }

  /**
   * 批量更新多个分类的排序号 逐一更新每个分类的排序号，单个更新失败不影响其它更新
   *
   * @param requests 排序更新请求列表
   */
  @Override
  public void batchUpdateSortOrder(List<CategorySortRequest> requests) {
    for (CategorySortRequest request : requests) {
      try {
        updateSortOrder(request.getCategoryId(), request.getSortOrder());
      } catch (Exception e) {
        logger.error(
            "Failed to update sort order for category {}: {}",
            request.getCategoryId(),
            e.getMessage());
      }
    }
  }

  /**
   * 搜索分类 根据关键字模糊匹配分类名称
   *
   * @param keyword 搜索关键字
   * @return 匹配的分类DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> searchCategories(String keyword) {
    List<Category> categories =
        categoryRepository.findByNameContainingIgnoreCaseOrderBySortOrderAsc(keyword);
    return categories.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 获取热门分类 根据关联的知识内容数量排序，返回最受欢迎的分类
   *
   * @param limit 返回结果数量限制
   * @return 热门分类统计信息列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryStatsDTO> getPopularCategories(int limit) {
    List<Object[]> results = categoryRepository.findPopularCategories();

    return results.stream()
        .limit(limit)
        .map(
            row -> {
              Category category = (Category) row[0];
              Long itemCount = (Long) row[1];

              return new CategoryStatsDTO(
                  category.getId(),
                  category.getName(),
                  itemCount,
                  categoryRepository.getTotalKnowledgeItemCount(category.getId()),
                  categoryRepository.countByParentId(category.getId()).intValue(),
                  getCategoryDepth(category.getId()));
            })
        .collect(Collectors.toList());
  }

  /**
   * 获取最近使用的分类 返回最近30天内被使用过的分类
   *
   * @param limit 返回结果数量限制
   * @return 最近使用的分类DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> getRecentlyUsedCategories(int limit) {
    LocalDateTime since = LocalDateTime.now().minusDays(30); // 最近30天
    List<Category> categories = categoryRepository.findRecentlyUsedCategories(since);

    return categories.stream().limit(limit).map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 获取指定分类的统计信息 包括知识内容数量、子分类数量、层级深度等信息
   *
   * @param categoryId 分类ID
   * @return 分类统计信息DTO
   * @throws BusinessException 分类不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public CategoryStatsDTO getCategoryStats(Long categoryId) {
    Category category =
        categoryRepository
            .findById(categoryId)
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
        depth);
  }

  /**
   * 获取所有分类的统计信息 返回系统中所有分类的详细统计信息
   *
   * @return 所有分类的统计信息DTO列表
   */
  @Override
  @Transactional(readOnly = true)
  public List<CategoryStatsDTO> getAllCategoryStats() {
    List<Category> categories = categoryRepository.findAll();

    return categories.stream()
        .map(category -> getCategoryStats(category.getId()))
        .collect(Collectors.toList());
  }

  /**
   * 检查分类是否可以删除 当分类没有子分类且没有关联的知识内容时才可以删除
   *
   * @param categoryId 分类ID
   * @return 可以删除返回true，否则返回false
   */
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

  /**
   * 检查分类名称在同级分类中是否唯一 用于创建和更新分类时的名称验证
   *
   * @param name 分类名称
   * @param parentId 父分类ID，null表示根分类
   * @param excludeId 排除的分类ID（用于更新时排除自身）
   * @return 名称唯一返回true，否则返回false
   */
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

  /**
   * 验证分类层级深度是否有效 检查指定父分类下的新分类是否会超过最大层级限制
   *
   * @param parentId 父分类ID
   * @return 层级深度有效返回true，否则返回false
   */
  @Override
  @Transactional(readOnly = true)
  public boolean isValidDepth(Long parentId) {
    if (parentId == null) {
      return true; // 根分类
    }

    Integer depth = categoryRepository.getCategoryDepth(parentId);
    return depth == null || depth < MAX_CATEGORY_DEPTH;
  }

  /**
   * 获取分类的层级深度 从根分类开始计算，根分类深度为0
   *
   * @param categoryId 分类ID
   * @return 分类的层级深度
   */
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
    treeDTO.setTotalKnowledgeItemCount(
        categoryRepository.getTotalKnowledgeItemCount(category.getId()));
    treeDTO.setDepth(getCategoryDepth(category.getId()));

    // 递归构建子分类树
    List<Category> children =
        categoryRepository.findByParentIdOrderBySortOrderAsc(category.getId());
    if (!children.isEmpty()) {
      List<CategoryTreeDTO> childrenDTOs =
          children.stream().map(this::buildCategoryTree).collect(Collectors.toList());
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
      categoryRepository
          .findById(category.getParentId())
          .ifPresent(
              parent -> {
                dto.setParentName(parent.getName());
              });
    }

    return dto;
  }
}
