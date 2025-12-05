package com.example.educhain.repository;

import com.example.educhain.entity.Tag;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 标签数据访问层 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

  /** 根据名称查找标签 */
  Optional<Tag> findByName(String name);

  /** 根据名称和状态查找标签 */
  Optional<Tag> findByNameAndStatus(String name, Integer status);

  /** 根据状态查找标签 */
  List<Tag> findByStatus(Integer status);

  /** 根据状态查找标签（分页） */
  List<Tag> findByStatus(Integer status, Pageable pageable);

  /** 根据分类查找标签 */
  List<Tag> findByCategoryAndStatus(String category, Integer status);

  /** 根据创建者查找标签 */
  Page<Tag> findByCreatorIdAndStatus(Long creatorId, Integer status, Pageable pageable);

  /** 模糊搜索标签名称 */
  Page<Tag> findByNameContainingIgnoreCaseAndStatus(String name, Integer status, Pageable pageable);

  /** 查找热门标签 - 按使用次数排序 */
  @Query("SELECT t FROM Tag t WHERE t.status = :status ORDER BY t.usageCount DESC")
  Page<Tag> findPopularTags(@Param("status") Integer status, Pageable pageable);

  /** 查找最近使用的标签 */
  @Query(
      "SELECT t FROM Tag t WHERE t.status = :status AND t.lastUsedAt >= :since ORDER BY t.lastUsedAt DESC")
  Page<Tag> findRecentlyUsedTags(
      @Param("status") Integer status, @Param("since") LocalDateTime since, Pageable pageable);

  /** 查找使用次数在指定范围内的标签 */
  @Query(
      "SELECT t FROM Tag t WHERE t.status = :status AND t.usageCount BETWEEN :minCount AND :maxCount ORDER BY t.usageCount DESC")
  Page<Tag> findByUsageCountRange(
      @Param("status") Integer status,
      @Param("minCount") Long minCount,
      @Param("maxCount") Long maxCount,
      Pageable pageable);

  /** 获取所有标签分类 */
  @Query(
      "SELECT DISTINCT t.category FROM Tag t WHERE t.status = :status AND t.category IS NOT NULL")
  List<String> findAllCategories(@Param("status") Integer status);

  /** 统计各分类下的标签数量 */
  @Query("SELECT t.category, COUNT(t) FROM Tag t WHERE t.status = :status GROUP BY t.category")
  List<Object[]> countTagsByCategory(@Param("status") Integer status);

  /** 查找未使用的标签（使用次数为0） */
  @Query("SELECT t FROM Tag t WHERE t.status = :status AND t.usageCount = 0")
  Page<Tag> findUnusedTags(@Param("status") Integer status, Pageable pageable);

  /** 查找长时间未使用的标签 */
  @Query(
      "SELECT t FROM Tag t WHERE t.status = :status AND (t.lastUsedAt IS NULL OR t.lastUsedAt < :before)")
  Page<Tag> findInactiveTags(
      @Param("status") Integer status, @Param("before") LocalDateTime before, Pageable pageable);

  /** 增加标签使用次数 */
  @Modifying
  @Query(
      "UPDATE Tag t SET t.usageCount = t.usageCount + 1, t.lastUsedAt = :now WHERE t.id = :tagId")
  int incrementUsageCount(@Param("tagId") Long tagId, @Param("now") LocalDateTime now);

  /** 减少标签使用次数 */
  @Modifying
  @Query("UPDATE Tag t SET t.usageCount = GREATEST(t.usageCount - 1, 0) WHERE t.id = :tagId")
  int decrementUsageCount(@Param("tagId") Long tagId);

  /** 批量增加标签使用次数 */
  @Modifying
  @Query(
      "UPDATE Tag t SET t.usageCount = t.usageCount + 1, t.lastUsedAt = :now WHERE t.name IN :tagNames")
  int incrementUsageCountByNames(
      @Param("tagNames") List<String> tagNames, @Param("now") LocalDateTime now);

  /** 批量减少标签使用次数 */
  @Modifying
  @Query("UPDATE Tag t SET t.usageCount = GREATEST(t.usageCount - 1, 0) WHERE t.name IN :tagNames")
  int decrementUsageCountByNames(@Param("tagNames") List<String> tagNames);

  /** 根据名称列表查找标签 */
  List<Tag> findByNameInAndStatus(List<String> names, Integer status);

  /** 获取标签使用统计 */
  @Query("SELECT SUM(t.usageCount) FROM Tag t WHERE t.status = :status")
  Long getTotalUsageCount(@Param("status") Integer status);

  /** 获取平均使用次数 */
  @Query("SELECT AVG(t.usageCount) FROM Tag t WHERE t.status = :status")
  Double getAverageUsageCount(@Param("status") Integer status);

  /** 查找建议的标签（基于名称相似度） */
  @Query(
      "SELECT t FROM Tag t WHERE t.status = :status AND t.name LIKE %:keyword% ORDER BY t.usageCount DESC")
  List<Tag> findSuggestedTags(
      @Param("keyword") String keyword, @Param("status") Integer status, Pageable pageable);

  /** 清理未使用的标签 */
  @Modifying
  @Query("DELETE FROM Tag t WHERE t.usageCount = 0 AND t.createdAt < :before")
  int cleanupUnusedTags(@Param("before") LocalDateTime before);

  /** 获取标签使用统计 */
  @Query(
      "SELECT t.name as tagName, t.usageCount as usageCount "
          + "FROM Tag t WHERE t.status = 1 ORDER BY t.usageCount DESC")
  List<Map<String, Object>> getTagUsageStats();
}
