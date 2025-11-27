package com.example.educhain.repository;

import com.example.educhain.entity.UserInteraction;
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
 * 用户互动Repository接口
 */
@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    /**
     * 查找用户对特定知识内容的特定类型互动
     */
    Optional<UserInteraction> findByUserIdAndKnowledgeIdAndInteractionType(
            Long userId, Long knowledgeId, UserInteraction.InteractionType interactionType);

    /**
     * 检查用户是否已经对知识内容进行了特定类型的互动
     */
    boolean existsByUserIdAndKnowledgeIdAndInteractionType(
            Long userId, Long knowledgeId, UserInteraction.InteractionType interactionType);

    /**
     * 统计知识内容的特定类型互动数量
     */
    long countByKnowledgeIdAndInteractionType(Long knowledgeId, UserInteraction.InteractionType interactionType);

    /**
     * 获取用户的所有互动记录
     */
    Page<UserInteraction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * 获取用户特定类型的互动记录
     */
    Page<UserInteraction> findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
            Long userId, UserInteraction.InteractionType interactionType, Pageable pageable);

    /**
     * 获取知识内容的所有互动记录
     */
    Page<UserInteraction> findByKnowledgeIdOrderByCreatedAtDesc(Long knowledgeId, Pageable pageable);

    /**
     * 获取知识内容特定类型的互动记录
     */
    Page<UserInteraction> findByKnowledgeIdAndInteractionTypeOrderByCreatedAtDesc(
            Long knowledgeId, UserInteraction.InteractionType interactionType, Pageable pageable);

    /**
     * 统计用户的总互动数量
     */
    long countByUserId(Long userId);

    /**
     * 统计用户特定类型的互动数量
     */
    long countByUserIdAndInteractionType(Long userId, UserInteraction.InteractionType interactionType);

    /**
     * 统计知识内容的总互动数量
     */
    long countByKnowledgeId(Long knowledgeId);

    /**
     * 获取用户最近的互动记录
     */
    List<UserInteraction> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 获取知识内容最近的互动记录
     */
    List<UserInteraction> findTop10ByKnowledgeIdOrderByCreatedAtDesc(Long knowledgeId);

    /**
     * 查找指定时间范围内的互动记录
     */
    List<UserInteraction> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 查找用户在指定时间范围内的互动记录
     */
    List<UserInteraction> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 查找知识内容在指定时间范围内的互动记录
     */
    List<UserInteraction> findByKnowledgeIdAndCreatedAtBetween(Long knowledgeId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 删除用户对特定知识内容的特定类型互动
     */
    void deleteByUserIdAndKnowledgeIdAndInteractionType(
            Long userId, Long knowledgeId, UserInteraction.InteractionType interactionType);

    /**
     * 获取热门知识内容（按互动数量排序）
     */
    @Query("SELECT ui.knowledgeId, COUNT(ui) as interactionCount " +
           "FROM UserInteraction ui " +
           "WHERE ui.createdAt >= :startTime " +
           "GROUP BY ui.knowledgeId " +
           "ORDER BY interactionCount DESC")
    List<Object[]> findPopularKnowledgeItems(@Param("startTime") LocalDateTime startTime, Pageable pageable);

    /**
     * 获取活跃用户（按互动数量排序）
     */
    @Query("SELECT ui.userId, COUNT(ui) as interactionCount " +
           "FROM UserInteraction ui " +
           "WHERE ui.createdAt >= :startTime " +
           "GROUP BY ui.userId " +
           "ORDER BY interactionCount DESC")
    List<Object[]> findActiveUsers(@Param("startTime") LocalDateTime startTime, Pageable pageable);

    /**
     * 检查用户是否在指定时间内已经浏览过该内容（IP去重）
     */
    boolean existsByKnowledgeIdAndIpAddressAndInteractionTypeAndCreatedAtAfter(
            Long knowledgeId, String ipAddress, UserInteraction.InteractionType interactionType, LocalDateTime time);
}