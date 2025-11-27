package com.example.educhain.repository;

import com.example.educhain.entity.KnowledgeItem;
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
 * 知识内容数据访问层
 */
@Repository
public interface KnowledgeItemRepository extends JpaRepository<KnowledgeItem, Long> {

    /**
     * 根据状态查找知识内容
     */
    List<KnowledgeItem> findByStatus(Integer status);

    /**
     * 根据上传者ID查找知识内容
     */
    Page<KnowledgeItem> findByUploaderIdAndStatus(Long uploaderId, Integer status, Pageable pageable);

    /**
     * 根据分类ID查找知识内容
     */
    Page<KnowledgeItem> findByCategoryIdAndStatus(Long categoryId, Integer status, Pageable pageable);

    /**
     * 根据内容类型查找知识内容
     */
    Page<KnowledgeItem> findByTypeAndStatus(KnowledgeItem.ContentType type, Integer status, Pageable pageable);

    /**
     * 根据标题模糊查询
     */
    Page<KnowledgeItem> findByTitleContainingIgnoreCaseAndStatus(String title, Integer status, Pageable pageable);

    /**
     * 根据标签查找知识内容
     */
    @Query("SELECT k FROM KnowledgeItem k WHERE k.tags LIKE %:tag% AND k.status = :status")
    Page<KnowledgeItem> findByTagsContainingAndStatus(@Param("tag") String tag, @Param("status") Integer status, Pageable pageable);

    /**
     * 全文搜索 - 在标题、内容、标签中搜索
     */
    @Query("SELECT k FROM KnowledgeItem k WHERE " +
           "(k.title LIKE %:keyword% OR k.content LIKE %:keyword% OR k.tags LIKE %:keyword%) " +
           "AND k.status = :status")
    Page<KnowledgeItem> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") Integer status, Pageable pageable);

    /**
     * 根据时间范围查找知识内容
     */
    Page<KnowledgeItem> findByCreatedAtBetweenAndStatus(LocalDateTime startTime, LocalDateTime endTime, Integer status, Pageable pageable);

    /**
     * 查找热门内容 - 根据创建时间排序
     */
    @Query("SELECT k FROM KnowledgeItem k WHERE k.status = :status ORDER BY k.createdAt DESC")
    Page<KnowledgeItem> findPopularContent(@Param("status") Integer status, Pageable pageable);

    /**
     * 根据多个条件查询
     */
    @Query("SELECT k FROM KnowledgeItem k WHERE " +
           "(:categoryId IS NULL OR k.categoryId = :categoryId) AND " +
           "(:type IS NULL OR k.type = :type) AND " +
           "(:uploaderId IS NULL OR k.uploaderId = :uploaderId) AND " +
           "(:keyword IS NULL OR k.title LIKE %:keyword% OR k.content LIKE %:keyword% OR k.tags LIKE %:keyword%) AND " +
           "k.status = :status")
    Page<KnowledgeItem> findByMultipleConditions(
            @Param("categoryId") Long categoryId,
            @Param("type") KnowledgeItem.ContentType type,
            @Param("uploaderId") Long uploaderId,
            @Param("keyword") String keyword,
            @Param("status") Integer status,
            Pageable pageable);

    /**
     * 统计分类下的内容数量
     */
    @Query("SELECT COUNT(k) FROM KnowledgeItem k WHERE k.categoryId = :categoryId AND k.status = :status")
    Long countByCategoryIdAndStatus(@Param("categoryId") Long categoryId, @Param("status") Integer status);

    /**
     * 统计用户的内容数量
     */
    @Query("SELECT COUNT(k) FROM KnowledgeItem k WHERE k.uploaderId = :uploaderId AND k.status = :status")
    Long countByUploaderIdAndStatus(@Param("uploaderId") Long uploaderId, @Param("status") Integer status);

    /**
     * 查找用户的最新内容
     */
    @Query("SELECT k FROM KnowledgeItem k WHERE k.uploaderId = :uploaderId AND k.status = :status ORDER BY k.createdAt DESC")
    List<KnowledgeItem> findLatestByUploaderId(@Param("uploaderId") Long uploaderId, @Param("status") Integer status, Pageable pageable);

    /**
     * 根据ID和状态查找
     */
    Optional<KnowledgeItem> findByIdAndStatus(Long id, Integer status);

    /**
     * 批量更新状态
     */
    @Query("UPDATE KnowledgeItem k SET k.status = :newStatus WHERE k.id IN :ids")
    int updateStatusByIds(@Param("ids") List<Long> ids, @Param("newStatus") Integer newStatus);
}