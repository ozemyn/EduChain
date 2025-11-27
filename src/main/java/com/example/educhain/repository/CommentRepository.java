package com.example.educhain.repository;

import com.example.educhain.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论Repository接口
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 获取知识内容的所有顶级评论（非回复）
     */
    Page<Comment> findByKnowledgeIdAndParentIdIsNullAndStatusOrderByCreatedAtDesc(
            Long knowledgeId, Integer status, Pageable pageable);

    /**
     * 获取知识内容的所有评论（包括回复）
     */
    Page<Comment> findByKnowledgeIdAndStatusOrderByCreatedAtDesc(
            Long knowledgeId, Integer status, Pageable pageable);

    /**
     * 获取评论的所有回复
     */
    List<Comment> findByParentIdAndStatusOrderByCreatedAtAsc(Long parentId, Integer status);

    /**
     * 获取用户的所有评论
     */
    Page<Comment> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Integer status, Pageable pageable);

    /**
     * 统计知识内容的评论数量
     */
    long countByKnowledgeIdAndStatus(Long knowledgeId, Integer status);

    /**
     * 统计评论的回复数量
     */
    long countByParentIdAndStatus(Long parentId, Integer status);

    /**
     * 统计用户的评论数量
     */
    long countByUserIdAndStatus(Long userId, Integer status);

    /**
     * 获取用户最近的评论
     */
    List<Comment> findTop10ByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Integer status);

    /**
     * 获取知识内容最近的评论
     */
    List<Comment> findTop10ByKnowledgeIdAndStatusOrderByCreatedAtDesc(Long knowledgeId, Integer status);

    /**
     * 查找指定时间范围内的评论
     */
    List<Comment> findByCreatedAtBetweenAndStatus(LocalDateTime startTime, LocalDateTime endTime, Integer status);

    /**
     * 查找用户在指定时间范围内的评论
     */
    List<Comment> findByUserIdAndCreatedAtBetweenAndStatus(
            Long userId, LocalDateTime startTime, LocalDateTime endTime, Integer status);

    /**
     * 查找知识内容在指定时间范围内的评论
     */
    List<Comment> findByKnowledgeIdAndCreatedAtBetweenAndStatus(
            Long knowledgeId, LocalDateTime startTime, LocalDateTime endTime, Integer status);

    /**
     * 获取待审核的评论
     */
    Page<Comment> findByStatusOrderByCreatedAtDesc(Integer status, Pageable pageable);

    /**
     * 获取热门评论（按回复数量排序）
     */
    @Query("SELECT c, COUNT(r) as replyCount " +
           "FROM Comment c LEFT JOIN Comment r ON r.parentId = c.id " +
           "WHERE c.knowledgeId = :knowledgeId AND c.parentId IS NULL AND c.status = :status " +
           "GROUP BY c.id " +
           "ORDER BY replyCount DESC, c.createdAt DESC")
    List<Object[]> findPopularCommentsByKnowledgeId(@Param("knowledgeId") Long knowledgeId, 
                                                    @Param("status") Integer status, 
                                                    Pageable pageable);

    /**
     * 获取评论树结构（包含所有层级的回复）
     */
    @Query("SELECT c FROM Comment c WHERE c.knowledgeId = :knowledgeId AND c.status = :status ORDER BY c.createdAt ASC")
    List<Comment> findCommentTreeByKnowledgeId(@Param("knowledgeId") Long knowledgeId, @Param("status") Integer status);

    /**
     * 检查评论是否存在且状态正常
     */
    boolean existsByIdAndStatus(Long id, Integer status);

    /**
     * 获取用户在特定知识内容下的评论
     */
    List<Comment> findByUserIdAndKnowledgeIdAndStatusOrderByCreatedAtDesc(
            Long userId, Long knowledgeId, Integer status);

    /**
     * 统计系统总评论数
     */
    long countByStatus(Integer status);

    /**
     * 获取最活跃的评论者
     */
    @Query("SELECT c.userId, COUNT(c) as commentCount " +
           "FROM Comment c " +
           "WHERE c.status = :status AND c.createdAt >= :startTime " +
           "GROUP BY c.userId " +
           "ORDER BY commentCount DESC")
    List<Object[]> findActiveCommenters(@Param("status") Integer status, 
                                       @Param("startTime") LocalDateTime startTime, 
                                       Pageable pageable);
}