package com.example.educhain.repository;

import com.example.educhain.entity.ExternalContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 外部内容Repository接口
 */
@Repository
public interface ExternalContentRepository extends JpaRepository<ExternalContent, Long> {

    /**
     * 根据内容哈希查找内容（用于去重）
     */
    Optional<ExternalContent> findByContentHash(String contentHash);

    /**
     * 根据原始URL查找内容
     */
    Optional<ExternalContent> findByOriginalUrl(String originalUrl);

    /**
     * 根据数据源ID查找内容
     */
    Page<ExternalContent> findBySourceIdAndStatus(Long sourceId, Integer status, Pageable pageable);

    /**
     * 根据状态查找内容
     */
    Page<ExternalContent> findByStatus(Integer status, Pageable pageable);

    /**
     * 根据分类查找内容
     */
    Page<ExternalContent> findByCategoryAndStatus(String category, Integer status, Pageable pageable);

    /**
     * 根据作者查找内容
     */
    Page<ExternalContent> findByAuthorAndStatus(String author, Integer status, Pageable pageable);

    /**
     * 根据语言查找内容
     */
    Page<ExternalContent> findByLanguageAndStatus(String language, Integer status, Pageable pageable);

    /**
     * 全文搜索外部内容
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status AND " +
           "(ec.title LIKE %:keyword% OR ec.content LIKE %:keyword% OR ec.tags LIKE %:keyword%)")
    Page<ExternalContent> searchByKeyword(@Param("keyword") String keyword, 
                                        @Param("status") Integer status, 
                                        Pageable pageable);

    /**
     * 根据质量分数范围查找内容
     */
    Page<ExternalContent> findByQualityScoreBetweenAndStatus(Double minScore, Double maxScore, 
                                                           Integer status, Pageable pageable);

    /**
     * 查找高质量内容
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status AND ec.qualityScore >= :minScore " +
           "ORDER BY ec.qualityScore DESC")
    Page<ExternalContent> findHighQualityContent(@Param("minScore") Double minScore, 
                                               @Param("status") Integer status, 
                                               Pageable pageable);

    /**
     * 查找最新抓取的内容
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status " +
           "ORDER BY ec.crawledAt DESC")
    Page<ExternalContent> findLatestContent(@Param("status") Integer status, Pageable pageable);

    /**
     * 查找最近发布的内容
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status AND ec.publishedAt IS NOT NULL " +
           "ORDER BY ec.publishedAt DESC")
    Page<ExternalContent> findRecentlyPublished(@Param("status") Integer status, Pageable pageable);

    /**
     * 根据时间范围查找内容
     */
    Page<ExternalContent> findByCrawledAtBetweenAndStatus(LocalDateTime startTime, LocalDateTime endTime, 
                                                        Integer status, Pageable pageable);

    /**
     * 统计各数据源的内容数量
     */
    @Query("SELECT ec.sourceId, COUNT(ec) FROM ExternalContent ec WHERE ec.status = :status " +
           "GROUP BY ec.sourceId")
    List<Object[]> countBySourceId(@Param("status") Integer status);

    /**
     * 统计各分类的内容数量
     */
    @Query("SELECT ec.category, COUNT(ec) FROM ExternalContent ec WHERE ec.status = :status " +
           "GROUP BY ec.category")
    List<Object[]> countByCategory(@Param("status") Integer status);

    /**
     * 统计各语言的内容数量
     */
    @Query("SELECT ec.language, COUNT(ec) FROM ExternalContent ec WHERE ec.status = :status " +
           "GROUP BY ec.language")
    List<Object[]> countByLanguage(@Param("status") Integer status);

    /**
     * 检查内容哈希是否已存在
     */
    boolean existsByContentHash(String contentHash);

    /**
     * 检查原始URL是否已存在
     */
    boolean existsByOriginalUrl(String originalUrl);

    /**
     * 统计数据源的内容数量
     */
    long countBySourceIdAndStatus(Long sourceId, Integer status);

    /**
     * 获取平均质量分数
     */
    @Query("SELECT AVG(ec.qualityScore) FROM ExternalContent ec WHERE ec.status = :status")
    Double getAverageQualityScore(@Param("status") Integer status);

    /**
     * 获取总字数
     */
    @Query("SELECT SUM(ec.wordCount) FROM ExternalContent ec WHERE ec.status = :status")
    Long getTotalWordCount(@Param("status") Integer status);

    /**
     * 查找需要更新的内容（基于原始发布时间）
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status AND " +
           "ec.lastUpdatedAt IS NULL OR ec.lastUpdatedAt < :cutoffTime")
    List<ExternalContent> findContentNeedingUpdate(@Param("status") Integer status, 
                                                  @Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * 查找重复内容（相同标题和作者）
     */
    @Query("SELECT ec FROM ExternalContent ec WHERE ec.status = :status AND " +
           "EXISTS (SELECT ec2 FROM ExternalContent ec2 WHERE ec2.id != ec.id AND " +
           "ec2.title = ec.title AND ec2.author = ec.author AND ec2.status = :status)")
    List<ExternalContent> findDuplicateContent(@Param("status") Integer status);

    /**
     * 获取内容统计信息
     */
    @Query("SELECT " +
           "COUNT(ec) as totalContent, " +
           "AVG(ec.qualityScore) as avgQualityScore, " +
           "SUM(ec.wordCount) as totalWords, " +
           "AVG(ec.readingTime) as avgReadingTime " +
           "FROM ExternalContent ec WHERE ec.status = :status")
    Object[] getContentStatistics(@Param("status") Integer status);

    /**
     * MySQL FULLTEXT 全文搜索
     */
    @Query(value = "SELECT * FROM external_contents WHERE " +
                   "MATCH(title, content, tags) AGAINST(:keyword IN NATURAL LANGUAGE MODE) " +
                   "AND status = :status " +
                   "ORDER BY crawled_at DESC",
           nativeQuery = true)
    Page<ExternalContent> fullTextSearch(@Param("keyword") String keyword, 
                                       @Param("status") Integer status, 
                                       Pageable pageable);
}