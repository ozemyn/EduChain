package com.example.educhain.repository;

import com.example.educhain.entity.HotKeyword;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 热门关键词数据访问层 */
@Repository
public interface HotKeywordRepository extends JpaRepository<HotKeyword, Long> {

  /** 根据关键词查找 */
  Optional<HotKeyword> findByKeyword(String keyword);

  /** 根据关键词和状态查找 */
  Optional<HotKeyword> findByKeywordAndStatus(String keyword, Integer status);

  /** 获取热门关键词 - 按搜索次数排序 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE h.status = :status "
          + "ORDER BY h.searchCount DESC, h.trendScore DESC")
  List<HotKeyword> findHotKeywordsBySearchCount(@Param("status") Integer status, Pageable pageable);

  /** 获取热门关键词 - 按趋势分数排序 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE h.status = :status "
          + "ORDER BY h.trendScore DESC, h.searchCount DESC")
  List<HotKeyword> findHotKeywordsByTrendScore(@Param("status") Integer status, Pageable pageable);

  /** 获取今日热门关键词 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE h.dailyCount > 0 AND h.status = :status "
          + "ORDER BY h.dailyCount DESC, h.trendScore DESC")
  List<HotKeyword> findTodayHotKeywords(@Param("status") Integer status, Pageable pageable);

  /** 获取本周热门关键词 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE h.weeklyCount > 0 AND h.status = :status "
          + "ORDER BY h.weeklyCount DESC, h.trendScore DESC")
  List<HotKeyword> findWeeklyHotKeywords(@Param("status") Integer status, Pageable pageable);

  /** 获取本月热门关键词 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE h.monthlyCount > 0 AND h.status = :status "
          + "ORDER BY h.monthlyCount DESC, h.trendScore DESC")
  List<HotKeyword> findMonthlyHotKeywords(@Param("status") Integer status, Pageable pageable);

  /** 搜索关键词建议 - 模糊匹配 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "h.keyword LIKE %:prefix% AND h.status = :status "
          + "ORDER BY h.searchCount DESC, h.trendScore DESC")
  List<HotKeyword> findKeywordSuggestions(
      @Param("prefix") String prefix, @Param("status") Integer status, Pageable pageable);

  /** 获取相关关键词 - 基于分类 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "h.categoryId = :categoryId AND h.status = :status "
          + "ORDER BY h.searchCount DESC, h.trendScore DESC")
  List<HotKeyword> findRelatedKeywordsByCategory(
      @Param("categoryId") Long categoryId, @Param("status") Integer status, Pageable pageable);

  /** 获取最近搜索的关键词 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "h.lastSearchedAt >= :since AND h.status = :status "
          + "ORDER BY h.lastSearchedAt DESC, h.searchCount DESC")
  List<HotKeyword> findRecentKeywords(
      @Param("since") LocalDateTime since, @Param("status") Integer status, Pageable pageable);

  /** 获取上升趋势关键词 - 最近搜索频率高的 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "h.dailyCount > h.searchCount * 0.1 AND "
          + // 今日搜索占总搜索的10%以上
          "h.lastSearchedAt >= :since AND h.status = :status "
          + "ORDER BY (h.dailyCount * 1.0 / h.searchCount) DESC, h.trendScore DESC")
  List<HotKeyword> findTrendingKeywords(
      @Param("since") LocalDateTime since, @Param("status") Integer status, Pageable pageable);

  /** 统计关键词总数 */
  @Query("SELECT COUNT(h) FROM HotKeyword h WHERE h.status = :status")
  Long countByStatus(@Param("status") Integer status);

  /** 统计今日搜索总次数 */
  @Query("SELECT SUM(h.dailyCount) FROM HotKeyword h WHERE h.status = :status")
  Long sumDailySearchCount(@Param("status") Integer status);

  /** 统计本周搜索总次数 */
  @Query("SELECT SUM(h.weeklyCount) FROM HotKeyword h WHERE h.status = :status")
  Long sumWeeklySearchCount(@Param("status") Integer status);

  /** 统计本月搜索总次数 */
  @Query("SELECT SUM(h.monthlyCount) FROM HotKeyword h WHERE h.status = :status")
  Long sumMonthlySearchCount(@Param("status") Integer status);

  /** 批量重置日统计 */
  @Modifying
  @Query("UPDATE HotKeyword h SET h.dailyCount = 0 WHERE h.status = :status")
  int resetDailyCount(@Param("status") Integer status);

  /** 批量重置周统计 */
  @Modifying
  @Query("UPDATE HotKeyword h SET h.weeklyCount = 0 WHERE h.status = :status")
  int resetWeeklyCount(@Param("status") Integer status);

  /** 批量重置月统计 */
  @Modifying
  @Query("UPDATE HotKeyword h SET h.monthlyCount = 0 WHERE h.status = :status")
  int resetMonthlyCount(@Param("status") Integer status);

  /** 删除低频关键词 - 清理数据 */
  @Modifying
  @Query(
      "UPDATE HotKeyword h SET h.status = 0 WHERE "
          + "h.searchCount < :minSearchCount AND "
          + "h.lastSearchedAt < :beforeTime AND "
          + "h.status = 1")
  int cleanupLowFrequencyKeywords(
      @Param("minSearchCount") Long minSearchCount, @Param("beforeTime") LocalDateTime beforeTime);

  /** 更新关键词分类信息 */
  @Modifying
  @Query(
      "UPDATE HotKeyword h SET "
          + "h.categoryId = :categoryId, "
          + "h.categoryName = :categoryName "
          + "WHERE h.keyword = :keyword")
  int updateCategoryInfo(
      @Param("keyword") String keyword,
      @Param("categoryId") Long categoryId,
      @Param("categoryName") String categoryName);

  /** 获取无分类的关键词 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "h.categoryId IS NULL AND h.searchCount >= :minSearchCount AND h.status = :status "
          + "ORDER BY h.searchCount DESC")
  List<HotKeyword> findUncategorizedKeywords(
      @Param("minSearchCount") Long minSearchCount,
      @Param("status") Integer status,
      Pageable pageable);

  /** 分页查询所有关键词 */
  Page<HotKeyword> findByStatusOrderBySearchCountDesc(Integer status, Pageable pageable);

  /** 按关键词长度查询 - 用于分析用户搜索习惯 */
  @Query(
      "SELECT h FROM HotKeyword h WHERE "
          + "LENGTH(h.keyword) BETWEEN :minLength AND :maxLength AND h.status = :status "
          + "ORDER BY h.searchCount DESC")
  List<HotKeyword> findByKeywordLength(
      @Param("minLength") Integer minLength,
      @Param("maxLength") Integer maxLength,
      @Param("status") Integer status,
      Pageable pageable);
}
