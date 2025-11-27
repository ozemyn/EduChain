package com.example.educhain.repository;

import com.example.educhain.entity.KnowledgeItem;
import com.example.educhain.entity.SearchHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 搜索历史数据访问层
 */
@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    /**
     * 根据用户ID查找搜索历史
     */
    Page<SearchHistory> findByUserIdOrderBySearchTimeDesc(Long userId, Pageable pageable);

    /**
     * 根据用户ID和时间范围查找搜索历史
     */
    List<SearchHistory> findByUserIdAndSearchTimeBetweenOrderBySearchTimeDesc(
            Long userId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 根据关键词查找搜索历史
     */
    List<SearchHistory> findByKeywordOrderBySearchTimeDesc(String keyword, Pageable pageable);

    /**
     * 根据IP地址查找搜索历史
     */
    List<SearchHistory> findByIpAddressOrderBySearchTimeDesc(String ipAddress, Pageable pageable);

    /**
     * 根据会话ID查找搜索历史
     */
    List<SearchHistory> findBySessionIdOrderBySearchTimeDesc(String sessionId);

    /**
     * 统计用户搜索次数
     */
    @Query("SELECT COUNT(s) FROM SearchHistory s WHERE s.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * 统计关键词搜索次数
     */
    @Query("SELECT COUNT(s) FROM SearchHistory s WHERE s.keyword = :keyword")
    Long countByKeyword(@Param("keyword") String keyword);

    /**
     * 统计时间范围内的搜索次数
     */
    @Query("SELECT COUNT(s) FROM SearchHistory s WHERE s.searchTime BETWEEN :startTime AND :endTime")
    Long countBySearchTimeBetween(@Param("startTime") LocalDateTime startTime, 
                                 @Param("endTime") LocalDateTime endTime);

    /**
     * 获取用户最常搜索的关键词
     */
    @Query("SELECT s.keyword, COUNT(s) as searchCount FROM SearchHistory s " +
           "WHERE s.userId = :userId " +
           "GROUP BY s.keyword " +
           "ORDER BY searchCount DESC")
    List<Object[]> findTopKeywordsByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 获取用户最常搜索的分类
     */
    @Query("SELECT s.categoryId, COUNT(s) as searchCount FROM SearchHistory s " +
           "WHERE s.userId = :userId AND s.categoryId IS NOT NULL " +
           "GROUP BY s.categoryId " +
           "ORDER BY searchCount DESC")
    List<Object[]> findTopCategoriesByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 获取热门搜索关键词
     */
    @Query("SELECT s.keyword, COUNT(s) as searchCount FROM SearchHistory s " +
           "WHERE s.searchTime >= :since " +
           "GROUP BY s.keyword " +
           "ORDER BY searchCount DESC")
    List<Object[]> findHotKeywordsSince(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * 获取搜索失败的关键词（结果数为0）
     */
    @Query("SELECT s.keyword, COUNT(s) as searchCount FROM SearchHistory s " +
           "WHERE s.resultCount = 0 AND s.searchTime >= :since " +
           "GROUP BY s.keyword " +
           "ORDER BY searchCount DESC")
    List<Object[]> findFailedSearchKeywordsSince(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * 获取平均搜索响应时间
     */
    @Query("SELECT AVG(s.responseTime) FROM SearchHistory s " +
           "WHERE s.responseTime IS NOT NULL AND s.searchTime >= :since")
    Double getAverageResponseTimeSince(@Param("since") LocalDateTime since);

    /**
     * 获取搜索点击率统计
     */
    @Query("SELECT " +
           "COUNT(s) as totalSearches, " +
           "COUNT(s.clickedResultId) as clickedSearches, " +
           "(COUNT(s.clickedResultId) * 100.0 / COUNT(s)) as clickRate " +
           "FROM SearchHistory s " +
           "WHERE s.searchTime >= :since")
    Object[] getClickRateStatsSince(@Param("since") LocalDateTime since);

    /**
     * 获取用户搜索行为分析
     */
    @Query("SELECT " +
           "COUNT(s) as totalSearches, " +
           "COUNT(DISTINCT s.keyword) as uniqueKeywords, " +
           "COUNT(DISTINCT s.categoryId) as uniqueCategories, " +
           "AVG(s.responseTime) as avgResponseTime, " +
           "COUNT(s.clickedResultId) as totalClicks " +
           "FROM SearchHistory s " +
           "WHERE s.userId = :userId AND s.searchTime >= :since")
    Object[] getUserSearchStatsSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    /**
     * 获取搜索趋势数据
     */
    @Query("SELECT DATE(s.searchTime) as searchDate, COUNT(s) as searchCount " +
           "FROM SearchHistory s " +
           "WHERE s.searchTime BETWEEN :startTime AND :endTime " +
           "GROUP BY DATE(s.searchTime) " +
           "ORDER BY searchDate")
    List<Object[]> getSearchTrendData(@Param("startTime") LocalDateTime startTime, 
                                    @Param("endTime") LocalDateTime endTime);

    /**
     * 获取分类搜索分布
     */
    @Query("SELECT c.name, COUNT(s) as searchCount FROM SearchHistory s " +
           "JOIN Category c ON s.categoryId = c.id " +
           "WHERE s.searchTime >= :since " +
           "GROUP BY c.id, c.name " +
           "ORDER BY searchCount DESC")
    List<Object[]> getCategorySearchDistributionSince(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * 获取内容类型搜索分布
     */
    @Query("SELECT s.contentType, COUNT(s) as searchCount FROM SearchHistory s " +
           "WHERE s.contentType IS NOT NULL AND s.searchTime >= :since " +
           "GROUP BY s.contentType " +
           "ORDER BY searchCount DESC")
    List<Object[]> getContentTypeSearchDistributionSince(@Param("since") LocalDateTime since);

    /**
     * 删除过期的搜索历史
     */
    @Query("DELETE FROM SearchHistory s WHERE s.searchTime < :beforeTime")
    int deleteExpiredHistory(@Param("beforeTime") LocalDateTime beforeTime);

    /**
     * 获取用户最近的搜索历史
     */
    @Query("SELECT s FROM SearchHistory s WHERE s.userId = :userId " +
           "ORDER BY s.searchTime DESC")
    List<SearchHistory> findRecentSearchesByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 获取相似搜索历史
     */
    @Query("SELECT s FROM SearchHistory s WHERE " +
           "s.keyword LIKE %:keyword% AND s.userId != :excludeUserId " +
           "ORDER BY s.searchTime DESC")
    List<SearchHistory> findSimilarSearches(@Param("keyword") String keyword, 
                                          @Param("excludeUserId") Long excludeUserId, 
                                          Pageable pageable);
}