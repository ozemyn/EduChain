package com.example.educhain.repository;

import com.example.educhain.entity.ExternalSource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 外部数据源Repository接口 */
@Repository
public interface ExternalSourceRepository extends JpaRepository<ExternalSource, Long> {

  /** 根据源URL查找外部数据源 */
  Optional<ExternalSource> findBySourceUrl(String sourceUrl);

  /** 根据状态查找外部数据源 */
  List<ExternalSource> findByStatus(Integer status);

  /** 根据源类型查找外部数据源 */
  List<ExternalSource> findBySourceType(String sourceType);

  /** 根据状态和源类型查找外部数据源 */
  List<ExternalSource> findByStatusAndSourceType(Integer status, String sourceType);

  /** 查找需要抓取的数据源（根据抓取频率） */
  @Query(
      "SELECT es FROM ExternalSource es WHERE es.status = 1 AND "
          + "(es.lastCrawlAt IS NULL OR es.lastCrawlAt < :cutoffTime)")
  List<ExternalSource> findSourcesNeedingCrawl(@Param("cutoffTime") LocalDateTime cutoffTime);

  /** 根据名称模糊查询 */
  Page<ExternalSource> findByNameContainingIgnoreCase(String name, Pageable pageable);

  /** 查找最近抓取成功的数据源 */
  @Query(
      "SELECT es FROM ExternalSource es WHERE es.status = 1 AND es.lastSuccessAt IS NOT NULL "
          + "ORDER BY es.lastSuccessAt DESC")
  Page<ExternalSource> findRecentlySuccessful(Pageable pageable);

  /** 查找抓取失败的数据源 */
  @Query(
      "SELECT es FROM ExternalSource es WHERE es.status = 1 AND es.lastError IS NOT NULL "
          + "ORDER BY es.lastCrawlAt DESC")
  Page<ExternalSource> findFailedSources(Pageable pageable);

  /** 统计各类型数据源数量 */
  @Query(
      "SELECT es.sourceType, COUNT(es) FROM ExternalSource es WHERE es.status = 1 "
          + "GROUP BY es.sourceType")
  List<Object[]> countBySourceType();

  /** 获取成功率最高的数据源 */
  @Query(
      "SELECT es FROM ExternalSource es WHERE es.status = 1 AND es.totalCrawled > 0 "
          + "ORDER BY (es.totalSuccess * 1.0 / es.totalCrawled) DESC")
  Page<ExternalSource> findMostReliableSources(Pageable pageable);

  /** 获取最活跃的数据源（按抓取次数排序） */
  @Query("SELECT es FROM ExternalSource es WHERE es.status = 1 " + "ORDER BY es.totalCrawled DESC")
  Page<ExternalSource> findMostActiveSources(Pageable pageable);

  /** 检查URL是否已存在 */
  boolean existsBySourceUrl(String sourceUrl);

  /** 统计启用的数据源数量 */
  long countByStatus(Integer status);

  /** 查找长时间未抓取的数据源 */
  @Query(
      "SELECT es FROM ExternalSource es WHERE es.status = 1 AND "
          + "(es.lastCrawlAt IS NULL OR es.lastCrawlAt < :cutoffTime)")
  List<ExternalSource> findInactiveSources(@Param("cutoffTime") LocalDateTime cutoffTime);

  /** 获取数据源统计信息 */
  @Query(
      "SELECT "
          + "COUNT(es) as totalSources, "
          + "SUM(es.totalCrawled) as totalCrawled, "
          + "SUM(es.totalSuccess) as totalSuccess, "
          + "SUM(es.totalFailed) as totalFailed "
          + "FROM ExternalSource es WHERE es.status = 1")
  Object[] getSourceStatistics();
}
