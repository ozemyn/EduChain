package com.example.educhain.repository;

import com.example.educhain.entity.KnowledgeItem;
import com.example.educhain.entity.SearchIndex;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 搜索索引数据访问层
 */
@Repository
public interface SearchIndexRepository extends JpaRepository<SearchIndex, Long> {

    /**
     * 根据知识内容ID查找搜索索引
     */
    Optional<SearchIndex> findByKnowledgeId(Long knowledgeId);

    /**
     * 根据知识内容ID和状态查找搜索索引
     */
    Optional<SearchIndex> findByKnowledgeIdAndStatus(Long knowledgeId, Integer status);

    /**
     * 全文搜索 - 使用MySQL FULLTEXT索引
     */
    @Query(value = "SELECT * FROM search_indexes WHERE " +
                   "MATCH(search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE) " +
                   "AND status = :status " +
                   "ORDER BY quality_score DESC, updated_at DESC",
           nativeQuery = true)
    Page<SearchIndex> fullTextSearch(@Param("keyword") String keyword, 
                                   @Param("status") Integer status, 
                                   Pageable pageable);

    /**
     * 全文搜索 - 布尔模式，支持更复杂的搜索语法
     */
    @Query(value = "SELECT * FROM search_indexes WHERE " +
                   "MATCH(search_text) AGAINST(:keyword IN BOOLEAN MODE) " +
                   "AND status = :status " +
                   "ORDER BY quality_score DESC, updated_at DESC",
           nativeQuery = true)
    Page<SearchIndex> fullTextSearchBoolean(@Param("keyword") String keyword, 
                                          @Param("status") Integer status, 
                                          Pageable pageable);

    /**
     * 模糊搜索 - 在标题、内容摘要、标签中搜索
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "(s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    Page<SearchIndex> fuzzySearch(@Param("keyword") String keyword, 
                                @Param("status") Integer status, 
                                Pageable pageable);

    /**
     * 按分类搜索
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "s.categoryId = :categoryId AND " +
           "(s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    Page<SearchIndex> searchByCategory(@Param("categoryId") Long categoryId,
                                     @Param("keyword") String keyword,
                                     @Param("status") Integer status,
                                     Pageable pageable);

    /**
     * 按内容类型搜索
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "s.contentType = :contentType AND " +
           "(s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    Page<SearchIndex> searchByContentType(@Param("contentType") KnowledgeItem.ContentType contentType,
                                        @Param("keyword") String keyword,
                                        @Param("status") Integer status,
                                        Pageable pageable);

    /**
     * 按上传者搜索
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "s.uploaderId = :uploaderId AND " +
           "(s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    Page<SearchIndex> searchByUploader(@Param("uploaderId") Long uploaderId,
                                     @Param("keyword") String keyword,
                                     @Param("status") Integer status,
                                     Pageable pageable);

    /**
     * 多条件搜索
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "(:categoryId IS NULL OR s.categoryId = :categoryId) AND " +
           "(:contentType IS NULL OR s.contentType = :contentType) AND " +
           "(:uploaderId IS NULL OR s.uploaderId = :uploaderId) AND " +
           "(:keyword IS NULL OR s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    Page<SearchIndex> advancedSearch(@Param("categoryId") Long categoryId,
                                   @Param("contentType") KnowledgeItem.ContentType contentType,
                                   @Param("uploaderId") Long uploaderId,
                                   @Param("keyword") String keyword,
                                   @Param("status") Integer status,
                                   Pageable pageable);

    /**
     * 获取热门内容 - 按质量评分排序
     */
    @Query("SELECT s FROM SearchIndex s WHERE s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.viewCount DESC, s.updatedAt DESC")
    Page<SearchIndex> findPopularContent(@Param("status") Integer status, Pageable pageable);

    /**
     * 获取最新内容
     */
    @Query("SELECT s FROM SearchIndex s WHERE s.status = :status " +
           "ORDER BY s.createdAt DESC")
    Page<SearchIndex> findLatestContent(@Param("status") Integer status, Pageable pageable);

    /**
     * 按分类获取热门内容
     */
    @Query("SELECT s FROM SearchIndex s WHERE s.categoryId = :categoryId AND s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.viewCount DESC")
    Page<SearchIndex> findPopularContentByCategory(@Param("categoryId") Long categoryId,
                                                 @Param("status") Integer status,
                                                 Pageable pageable);

    /**
     * 获取相似内容 - 基于标签相似度
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "s.knowledgeId != :excludeId AND " +
           "s.tags IS NOT NULL AND " +
           "s.status = :status AND " +
           "EXISTS (SELECT 1 FROM SearchIndex s2 WHERE s2.knowledgeId = :excludeId AND " +
           "        (s.tags LIKE CONCAT('%', SUBSTRING_INDEX(s2.tags, ',', 1), '%') OR " +
           "         s.tags LIKE CONCAT('%', SUBSTRING_INDEX(SUBSTRING_INDEX(s2.tags, ',', 2), ',', -1), '%') OR " +
           "         s.tags LIKE CONCAT('%', SUBSTRING_INDEX(SUBSTRING_INDEX(s2.tags, ',', 3), ',', -1), '%'))) " +
           "ORDER BY s.qualityScore DESC")
    List<SearchIndex> findSimilarContent(@Param("excludeId") Long excludeId,
                                       @Param("status") Integer status,
                                       Pageable pageable);

    /**
     * 获取用户可能感兴趣的内容 - 基于用户历史行为
     */
    @Query("SELECT s FROM SearchIndex s WHERE " +
           "s.categoryId IN :categoryIds AND " +
           "s.uploaderId != :excludeUserId AND " +
           "s.status = :status " +
           "ORDER BY s.qualityScore DESC, s.updatedAt DESC")
    List<SearchIndex> findRecommendedContent(@Param("categoryIds") List<Long> categoryIds,
                                           @Param("excludeUserId") Long excludeUserId,
                                           @Param("status") Integer status,
                                           Pageable pageable);

    /**
     * 统计搜索结果数量
     */
    @Query("SELECT COUNT(s) FROM SearchIndex s WHERE " +
           "(s.title LIKE %:keyword% OR s.contentSummary LIKE %:keyword% OR s.tags LIKE %:keyword%) " +
           "AND s.status = :status")
    Long countSearchResults(@Param("keyword") String keyword, @Param("status") Integer status);

    /**
     * 批量更新统计数据
     */
    @Modifying
    @Query("UPDATE SearchIndex s SET " +
           "s.viewCount = :viewCount, " +
           "s.likeCount = :likeCount, " +
           "s.favoriteCount = :favoriteCount, " +
           "s.commentCount = :commentCount, " +
           "s.qualityScore = :qualityScore " +
           "WHERE s.knowledgeId = :knowledgeId")
    int updateStats(@Param("knowledgeId") Long knowledgeId,
                   @Param("viewCount") Long viewCount,
                   @Param("likeCount") Long likeCount,
                   @Param("favoriteCount") Long favoriteCount,
                   @Param("commentCount") Long commentCount,
                   @Param("qualityScore") Double qualityScore);

    /**
     * 删除搜索索引
     */
    @Modifying
    @Query("UPDATE SearchIndex s SET s.status = 0 WHERE s.knowledgeId = :knowledgeId")
    int deleteByKnowledgeId(@Param("knowledgeId") Long knowledgeId);

    /**
     * 批量删除搜索索引
     */
    @Modifying
    @Query("UPDATE SearchIndex s SET s.status = 0 WHERE s.knowledgeId IN :knowledgeIds")
    int deleteByKnowledgeIds(@Param("knowledgeIds") List<Long> knowledgeIds);

    /**
     * 获取需要更新的索引 - 基于更新时间
     */
    @Query("SELECT s FROM SearchIndex s WHERE s.updatedAt < :beforeTime AND s.status = :status")
    List<SearchIndex> findIndexesToUpdate(@Param("beforeTime") LocalDateTime beforeTime,
                                        @Param("status") Integer status,
                                        Pageable pageable);
}