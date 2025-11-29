package com.example.educhain.repository;

import com.example.educhain.entity.Category;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 分类数据访问层 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

  /** 根据名称查找分类 */
  Optional<Category> findByName(String name);

  /** 根据父分类ID查找子分类 */
  List<Category> findByParentIdOrderBySortOrderAsc(Long parentId);

  /** 查找根分类（没有父分类的分类） */
  List<Category> findByParentIdIsNullOrderBySortOrderAsc();

  /** 根据父分类ID查找子分类数量 */
  @Query("SELECT COUNT(c) FROM Category c WHERE c.parentId = :parentId")
  Long countByParentId(@Param("parentId") Long parentId);

  /** 查找所有根分类及其子分类 */
  @Query(
      "SELECT c FROM Category c LEFT JOIN FETCH c.children WHERE c.parentId IS NULL ORDER BY c.sortOrder ASC")
  List<Category> findRootCategoriesWithChildren();

  /** 根据分类ID查找其所有子分类（递归） */
  @Query(
      value =
          "WITH RECURSIVE category_tree AS ("
              + "  SELECT id, name, description, parent_id, sort_order, created_at, 0 as level "
              + "  FROM categories WHERE id = :categoryId "
              + "  UNION ALL "
              + "  SELECT c.id, c.name, c.description, c.parent_id, c.sort_order, c.created_at, ct.level + 1 "
              + "  FROM categories c "
              + "  INNER JOIN category_tree ct ON c.parent_id = ct.id "
              + ") "
              + "SELECT * FROM category_tree ORDER BY level, sort_order",
      nativeQuery = true)
  List<Object[]> findCategoryTreeById(@Param("categoryId") Long categoryId);

  /** 查找分类路径（从根到指定分类） */
  @Query(
      value =
          "WITH RECURSIVE category_path AS ("
              + "  SELECT id, name, description, parent_id, sort_order, created_at, 0 as level "
              + "  FROM categories WHERE id = :categoryId "
              + "  UNION ALL "
              + "  SELECT c.id, c.name, c.description, c.parent_id, c.sort_order, c.created_at, cp.level + 1 "
              + "  FROM categories c "
              + "  INNER JOIN category_path cp ON c.id = cp.parent_id "
              + ") "
              + "SELECT * FROM category_path ORDER BY level DESC",
      nativeQuery = true)
  List<Object[]> findCategoryPathById(@Param("categoryId") Long categoryId);

  /** 检查分类是否有子分类 */
  @Query(
      "SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c WHERE c.parentId = :categoryId")
  boolean hasChildren(@Param("categoryId") Long categoryId);

  /** 检查分类是否有关联的知识内容 */
  @Query(
      "SELECT CASE WHEN COUNT(k) > 0 THEN true ELSE false END FROM KnowledgeItem k WHERE k.categoryId = :categoryId AND k.status = 1")
  boolean hasKnowledgeItems(@Param("categoryId") Long categoryId);

  /** 获取分类下的知识内容数量 */
  @Query("SELECT COUNT(k) FROM KnowledgeItem k WHERE k.categoryId = :categoryId AND k.status = 1")
  Long getKnowledgeItemCount(@Param("categoryId") Long categoryId);

  /** 获取分类及其所有子分类下的知识内容数量 */
  @Query(
      value =
          "WITH RECURSIVE category_tree AS ("
              + "  SELECT id FROM categories WHERE id = :categoryId "
              + "  UNION ALL "
              + "  SELECT c.id FROM categories c "
              + "  INNER JOIN category_tree ct ON c.parent_id = ct.id "
              + ") "
              + "SELECT COUNT(*) FROM knowledge_items k "
              + "WHERE k.category_id IN (SELECT id FROM category_tree) AND k.status = 1",
      nativeQuery = true)
  Long getTotalKnowledgeItemCount(@Param("categoryId") Long categoryId);

  /** 根据名称模糊查询分类 */
  List<Category> findByNameContainingIgnoreCaseOrderBySortOrderAsc(String name);

  /** 获取分类的最大排序号 */
  @Query("SELECT MAX(c.sortOrder) FROM Category c WHERE c.parentId = :parentId")
  Integer getMaxSortOrderByParentId(@Param("parentId") Long parentId);

  /** 获取根分类的最大排序号 */
  @Query("SELECT MAX(c.sortOrder) FROM Category c WHERE c.parentId IS NULL")
  Integer getMaxSortOrderForRootCategories();

  /** 检查分类名称在同级别中是否唯一 */
  @Query(
      "SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c "
          + "WHERE c.name = :name AND c.parentId = :parentId AND c.id != :excludeId")
  boolean existsByNameAndParentIdAndIdNot(
      @Param("name") String name,
      @Param("parentId") Long parentId,
      @Param("excludeId") Long excludeId);

  /** 检查分类名称在根级别中是否唯一 */
  @Query(
      "SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c "
          + "WHERE c.name = :name AND c.parentId IS NULL AND c.id != :excludeId")
  boolean existsByNameAndParentIdIsNullAndIdNot(
      @Param("name") String name, @Param("excludeId") Long excludeId);

  /** 获取分类层级深度 */
  @Query(
      value =
          "WITH RECURSIVE category_depth AS ("
              + "  SELECT id, parent_id, 0 as depth FROM categories WHERE id = :categoryId "
              + "  UNION ALL "
              + "  SELECT c.id, c.parent_id, cd.depth + 1 FROM categories c "
              + "  INNER JOIN category_depth cd ON c.id = cd.parent_id "
              + ") "
              + "SELECT MAX(depth) FROM category_depth",
      nativeQuery = true)
  Integer getCategoryDepth(@Param("categoryId") Long categoryId);

  /** 获取热门分类（按知识内容数量排序） */
  @Query(
      "SELECT c, COUNT(k) as itemCount FROM Category c "
          + "LEFT JOIN KnowledgeItem k ON c.id = k.categoryId AND k.status = 1 "
          + "GROUP BY c.id ORDER BY itemCount DESC")
  List<Object[]> findPopularCategories();

  /** 获取最近使用的分类 */
  @Query(
      "SELECT DISTINCT c FROM Category c "
          + "INNER JOIN KnowledgeItem k ON c.id = k.categoryId "
          + "WHERE k.status = 1 AND k.createdAt >= :since "
          + "ORDER BY k.createdAt DESC")
  List<Category> findRecentlyUsedCategories(@Param("since") java.time.LocalDateTime since);

  /** 获取分类统计信息 */
  @Query(
      "SELECT c.name as categoryName, COUNT(k) as knowledgeCount "
          + "FROM Category c LEFT JOIN KnowledgeItem k ON c.id = k.categoryId AND k.status = 1 "
          + "GROUP BY c.id, c.name ORDER BY knowledgeCount DESC")
  List<Map<String, Object>> getCategoryStats();
}
