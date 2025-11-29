package com.example.educhain.service;

import com.example.educhain.entity.UserInteraction;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 用户互动服务接口 */
public interface UserInteractionService {

  /** 点赞知识内容 */
  void like(Long userId, Long knowledgeId);

  /** 取消点赞 */
  void unlike(Long userId, Long knowledgeId);

  /** 收藏知识内容 */
  void favorite(Long userId, Long knowledgeId);

  /** 取消收藏 */
  void unfavorite(Long userId, Long knowledgeId);

  /** 记录浏览行为（IP去重） */
  void recordView(Long userId, Long knowledgeId, String ipAddress);

  /** 检查用户是否已点赞 */
  boolean hasLiked(Long userId, Long knowledgeId);

  /** 检查用户是否已收藏 */
  boolean hasFavorited(Long userId, Long knowledgeId);

  /** 获取知识内容的互动统计 */
  Map<String, Long> getInteractionStats(Long knowledgeId);

  /** 获取用户的互动记录 */
  Page<UserInteraction> getUserInteractions(Long userId, Pageable pageable);

  /** 获取用户特定类型的互动记录 */
  Page<UserInteraction> getUserInteractionsByType(
      Long userId, UserInteraction.InteractionType type, Pageable pageable);

  /** 获取知识内容的互动记录 */
  Page<UserInteraction> getKnowledgeInteractions(Long knowledgeId, Pageable pageable);

  /** 获取用户的收藏列表 */
  Page<UserInteraction> getUserFavorites(Long userId, Pageable pageable);

  /** 获取用户的点赞列表 */
  Page<UserInteraction> getUserLikes(Long userId, Pageable pageable);

  /** 获取热门知识内容 */
  List<Map<String, Object>> getPopularKnowledgeItems(LocalDateTime startTime, int limit);

  /** 获取活跃用户 */
  List<Map<String, Object>> getActiveUsers(LocalDateTime startTime, int limit);

  /** 统计用户的总互动数量 */
  long getUserInteractionCount(Long userId);

  /** 统计知识内容的总互动数量 */
  long getKnowledgeInteractionCount(Long knowledgeId);

  /** 批量获取知识内容的互动统计 */
  Map<Long, Map<String, Long>> getBatchInteractionStats(List<Long> knowledgeIds);

  /** 获取用户最近的互动记录 */
  List<UserInteraction> getRecentUserInteractions(Long userId, int limit);

  /** 获取知识内容最近的互动记录 */
  List<UserInteraction> getRecentKnowledgeInteractions(Long knowledgeId, int limit);
}
