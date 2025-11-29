package com.example.educhain.service.impl;

import com.example.educhain.entity.UserInteraction;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.UserInteractionRepository;
import com.example.educhain.service.UserInteractionService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 用户互动服务实现类 */
@Service
@Transactional
public class UserInteractionServiceImpl implements UserInteractionService {

  private static final Logger logger = LoggerFactory.getLogger(UserInteractionServiceImpl.class);

  @Autowired private UserInteractionRepository userInteractionRepository;

  @Override
  public void like(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      throw new BusinessException("USER_OR_KNOWLEDGE_NULL", "用户ID或知识内容ID不能为空");
    }

    // 检查是否已经点赞
    if (hasLiked(userId, knowledgeId)) {
      throw new BusinessException("ALREADY_LIKED", "您已经点赞过该内容");
    }

    try {
      UserInteraction interaction =
          new UserInteraction(knowledgeId, userId, UserInteraction.InteractionType.LIKE);
      userInteractionRepository.save(interaction);
      logger.info("用户 {} 点赞了知识内容 {}", userId, knowledgeId);
    } catch (Exception e) {
      logger.error("点赞失败: userId={}, knowledgeId={}", userId, knowledgeId, e);
      throw new BusinessException("LIKE_FAILED", "点赞失败，请稍后重试");
    }
  }

  @Override
  public void unlike(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      throw new BusinessException("USER_OR_KNOWLEDGE_NULL", "用户ID或知识内容ID不能为空");
    }

    // 检查是否已经点赞
    if (!hasLiked(userId, knowledgeId)) {
      throw new BusinessException("NOT_LIKED", "您还未点赞该内容");
    }

    try {
      userInteractionRepository.deleteByUserIdAndKnowledgeIdAndInteractionType(
          userId, knowledgeId, UserInteraction.InteractionType.LIKE);
      logger.info("用户 {} 取消点赞了知识内容 {}", userId, knowledgeId);
    } catch (Exception e) {
      logger.error("取消点赞失败: userId={}, knowledgeId={}", userId, knowledgeId, e);
      throw new BusinessException("UNLIKE_FAILED", "取消点赞失败，请稍后重试");
    }
  }

  @Override
  public void favorite(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      throw new BusinessException("USER_OR_KNOWLEDGE_NULL", "用户ID或知识内容ID不能为空");
    }

    // 检查是否已经收藏
    if (hasFavorited(userId, knowledgeId)) {
      throw new BusinessException("ALREADY_FAVORITED", "您已经收藏过该内容");
    }

    try {
      UserInteraction interaction =
          new UserInteraction(knowledgeId, userId, UserInteraction.InteractionType.FAVORITE);
      userInteractionRepository.save(interaction);
      logger.info("用户 {} 收藏了知识内容 {}", userId, knowledgeId);
    } catch (Exception e) {
      logger.error("收藏失败: userId={}, knowledgeId={}", userId, knowledgeId, e);
      throw new BusinessException("FAVORITE_FAILED", "收藏失败，请稍后重试");
    }
  }

  @Override
  public void unfavorite(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      throw new BusinessException("USER_OR_KNOWLEDGE_NULL", "用户ID或知识内容ID不能为空");
    }

    // 检查是否已经收藏
    if (!hasFavorited(userId, knowledgeId)) {
      throw new BusinessException("NOT_FAVORITED", "您还未收藏该内容");
    }

    try {
      userInteractionRepository.deleteByUserIdAndKnowledgeIdAndInteractionType(
          userId, knowledgeId, UserInteraction.InteractionType.FAVORITE);
      logger.info("用户 {} 取消收藏了知识内容 {}", userId, knowledgeId);
    } catch (Exception e) {
      logger.error("取消收藏失败: userId={}, knowledgeId={}", userId, knowledgeId, e);
      throw new BusinessException("UNFAVORITE_FAILED", "取消收藏失败，请稍后重试");
    }
  }

  @Override
  public void recordView(Long userId, Long knowledgeId, String ipAddress) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }

    try {
      // IP去重：检查同一IP在1小时内是否已经浏览过
      LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
      if (ipAddress != null
          && userInteractionRepository
              .existsByKnowledgeIdAndIpAddressAndInteractionTypeAndCreatedAtAfter(
                  knowledgeId, ipAddress, UserInteraction.InteractionType.VIEW, oneHourAgo)) {
        return; // 已经记录过，不重复记录
      }

      UserInteraction interaction =
          new UserInteraction(knowledgeId, userId, UserInteraction.InteractionType.VIEW, ipAddress);
      userInteractionRepository.save(interaction);
      logger.debug("记录浏览行为: userId={}, knowledgeId={}, ip={}", userId, knowledgeId, ipAddress);
    } catch (Exception e) {
      logger.error("记录浏览行为失败: userId={}, knowledgeId={}, ip={}", userId, knowledgeId, ipAddress, e);
      // 浏览记录失败不抛出异常，不影响用户体验
    }
  }

  @Override
  @Transactional(readOnly = true)
  public boolean hasLiked(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      return false;
    }
    return userInteractionRepository.existsByUserIdAndKnowledgeIdAndInteractionType(
        userId, knowledgeId, UserInteraction.InteractionType.LIKE);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean hasFavorited(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      return false;
    }
    return userInteractionRepository.existsByUserIdAndKnowledgeIdAndInteractionType(
        userId, knowledgeId, UserInteraction.InteractionType.FAVORITE);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Long> getInteractionStats(Long knowledgeId) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }

    Map<String, Long> stats = new HashMap<>();
    stats.put(
        "likes",
        userInteractionRepository.countByKnowledgeIdAndInteractionType(
            knowledgeId, UserInteraction.InteractionType.LIKE));
    stats.put(
        "favorites",
        userInteractionRepository.countByKnowledgeIdAndInteractionType(
            knowledgeId, UserInteraction.InteractionType.FAVORITE));
    stats.put(
        "views",
        userInteractionRepository.countByKnowledgeIdAndInteractionType(
            knowledgeId, UserInteraction.InteractionType.VIEW));
    stats.put("total", userInteractionRepository.countByKnowledgeId(knowledgeId));

    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserInteraction> getUserInteractions(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return userInteractionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserInteraction> getUserInteractionsByType(
      Long userId, UserInteraction.InteractionType type, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    if (type == null) {
      throw new BusinessException("INTERACTION_TYPE_NULL", "互动类型不能为空");
    }
    return userInteractionRepository.findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
        userId, type, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserInteraction> getKnowledgeInteractions(Long knowledgeId, Pageable pageable) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return userInteractionRepository.findByKnowledgeIdOrderByCreatedAtDesc(knowledgeId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserInteraction> getUserFavorites(Long userId, Pageable pageable) {
    return getUserInteractionsByType(userId, UserInteraction.InteractionType.FAVORITE, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserInteraction> getUserLikes(Long userId, Pageable pageable) {
    return getUserInteractionsByType(userId, UserInteraction.InteractionType.LIKE, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getPopularKnowledgeItems(LocalDateTime startTime, int limit) {
    if (startTime == null) {
      startTime = LocalDateTime.now().minusDays(7); // 默认最近7天
    }

    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results =
        userInteractionRepository.findPopularKnowledgeItems(startTime, pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> item = new HashMap<>();
              item.put("knowledgeId", result[0]);
              item.put("interactionCount", result[1]);
              return item;
            })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getActiveUsers(LocalDateTime startTime, int limit) {
    if (startTime == null) {
      startTime = LocalDateTime.now().minusDays(7); // 默认最近7天
    }

    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results = userInteractionRepository.findActiveUsers(startTime, pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> user = new HashMap<>();
              user.put("userId", result[0]);
              user.put("interactionCount", result[1]);
              return user;
            })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public long getUserInteractionCount(Long userId) {
    if (userId == null) {
      return 0;
    }
    return userInteractionRepository.countByUserId(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public long getKnowledgeInteractionCount(Long knowledgeId) {
    if (knowledgeId == null) {
      return 0;
    }
    return userInteractionRepository.countByKnowledgeId(knowledgeId);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Long, Map<String, Long>> getBatchInteractionStats(List<Long> knowledgeIds) {
    if (knowledgeIds == null || knowledgeIds.isEmpty()) {
      return new HashMap<>();
    }

    Map<Long, Map<String, Long>> batchStats = new HashMap<>();
    for (Long knowledgeId : knowledgeIds) {
      batchStats.put(knowledgeId, getInteractionStats(knowledgeId));
    }
    return batchStats;
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserInteraction> getRecentUserInteractions(Long userId, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return userInteractionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserInteraction> getRecentKnowledgeInteractions(Long knowledgeId, int limit) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return userInteractionRepository.findTop10ByKnowledgeIdOrderByCreatedAtDesc(knowledgeId);
  }
}
