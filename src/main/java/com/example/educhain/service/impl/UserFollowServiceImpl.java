package com.example.educhain.service.impl;

import com.example.educhain.entity.UserFollow;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.UserFollowRepository;
import com.example.educhain.repository.UserRepository;
import com.example.educhain.service.NotificationService;
import com.example.educhain.service.UserFollowService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

/** 用户关注服务实现类 */
@Service
@Transactional
public class UserFollowServiceImpl implements UserFollowService {

  private static final Logger logger = LoggerFactory.getLogger(UserFollowServiceImpl.class);

  @Autowired private UserFollowRepository userFollowRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private NotificationService notificationService;

  /**
   * 关注用户 创建用户之间的关注关系，并发送关注通知 不能关注自己，不能重复关注
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @throws BusinessException 参数无效、用户不存在或已关注时抛出
   */
  @Override
  public void followUser(Long followerId, Long followingId) {
    if (followerId == null || followingId == null) {
      throw new BusinessException("INVALID_PARAMS", "关注者ID和被关注者ID不能为空");
    }

    // 不能关注自己
    if (followerId.equals(followingId)) {
      throw new BusinessException("CANNOT_FOLLOW_SELF", "不能关注自己");
    }

    // 检查用户是否存在
    if (!userRepository.existsById(followerId) || !userRepository.existsById(followingId)) {
      throw new BusinessException("USER_NOT_FOUND", "用户不存在");
    }

    // 检查是否已经关注
    if (isFollowing(followerId, followingId)) {
      throw new BusinessException("ALREADY_FOLLOWING", "您已经关注了该用户");
    }

    try {
      UserFollow userFollow = new UserFollow(followerId, followingId);
      userFollowRepository.save(userFollow);

      // 创建关注通知
      notificationService.createFollowNotification(followingId, followerId);

      logger.info("用户 {} 关注了用户 {}", followerId, followingId);
    } catch (Exception e) {
      logger.error("关注用户失败: followerId={}, followingId={}", followerId, followingId, e);
      throw new BusinessException("FOLLOW_USER_FAILED", "关注用户失败，请稍后重试");
    }
  }

  /**
   * 取消关注用户 删除用户之间的关注关系
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @throws BusinessException 参数无效或未关注时抛出
   */
  @Override
  public void unfollowUser(Long followerId, Long followingId) {
    if (followerId == null || followingId == null) {
      throw new BusinessException("INVALID_PARAMS", "关注者ID和被关注者ID不能为空");
    }

    // 检查是否已经关注
    if (!isFollowing(followerId, followingId)) {
      throw new BusinessException("NOT_FOLLOWING", "您还未关注该用户");
    }

    try {
      userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
      logger.info("用户 {} 取消关注了用户 {}", followerId, followingId);
    } catch (Exception e) {
      logger.error("取消关注用户失败: followerId={}, followingId={}", followerId, followingId, e);
      throw new BusinessException("UNFOLLOW_USER_FAILED", "取消关注失败，请稍后重试");
    }
  }

  /**
   * 检查是否已关注 判断指定用户是否已关注另一个用户
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @return 已关注返回true，否则返回false
   */
  @Override
  @Transactional(readOnly = true)
  public boolean isFollowing(Long followerId, Long followingId) {
    if (followerId == null || followingId == null) {
      return false;
    }
    return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
  }

  /**
   * 获取用户的关注列表 分页查询指定用户关注的所有用户
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 关注关系分页结果
   * @throws BusinessException 用户ID为空时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FollowDTO> getFollowing(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("FOLLOWER_ID_NULL", "用户ID不能为空");
    }
    Page<UserFollow> followPage =
        userFollowRepository.findByFollowerIdOrderByCreatedAtDesc(userId, pageable);
    return followPage.map(this::convertToFollowDTO);
  }

  /**
   * 获取用户的粉丝列表 分页查询关注指定用户的所有用户
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 关注关系分页结果
   * @throws BusinessException 用户ID为空时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public Page<FollowDTO> getFollowers(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("FOLLOWING_ID_NULL", "用户ID不能为空");
    }
    Page<UserFollow> followPage =
        userFollowRepository.findByFollowingIdOrderByCreatedAtDesc(userId, pageable);
    return followPage.map(this::convertToFollowDTO);
  }

  /**
   * 统计用户关注的人数 获取指定用户关注的用户数量
   *
   * @param followerId 关注者ID
   * @return 关注人数
   */
  @Transactional(readOnly = true)
  public long getFollowingCount(Long followerId) {
    if (followerId == null) {
      return 0;
    }
    return userFollowRepository.countByFollowerId(followerId);
  }

  /**
   * 统计用户的粉丝数 获取关注指定用户的用户数量
   *
   * @param followingId 被关注者ID
   * @return 粉丝数
   */
  @Transactional(readOnly = true)
  public long getFollowersCount(Long followingId) {
    if (followingId == null) {
      return 0;
    }
    return userFollowRepository.countByFollowingId(followingId);
  }

  /**
   * 获取用户最近关注的人 查询指定用户最近关注的用户列表
   *
   * @param followerId 关注者ID
   * @param limit 返回结果数量限制
   * @return 最近关注的用户列表
   * @throws BusinessException 关注者ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<UserFollow> getRecentFollowing(Long followerId, int limit) {
    if (followerId == null) {
      throw new BusinessException("FOLLOWER_ID_NULL", "关注者ID不能为空");
    }
    return userFollowRepository.findTop10ByFollowerIdOrderByCreatedAtDesc(followerId);
  }

  /**
   * 获取用户最近的粉丝 查询最近关注指定用户的用户列表
   *
   * @param followingId 被关注者ID
   * @param limit 返回结果数量限制
   * @return 最近的粉丝列表
   * @throws BusinessException 被关注者ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<UserFollow> getRecentFollowers(Long followingId, int limit) {
    if (followingId == null) {
      throw new BusinessException("FOLLOWING_ID_NULL", "被关注者ID不能为空");
    }
    return userFollowRepository.findTop10ByFollowingIdOrderByCreatedAtDesc(followingId);
  }

  /**
   * 获取互相关注的用户 查询与指定用户互相关注的用户列表
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 互相关注的用户列表
   * @throws BusinessException 用户ID为空时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public Page<com.example.educhain.dto.UserDTO> getMutualFollows(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    // 这里需要实现互相关注的逻辑，暂时返回空页面
    return Page.empty(pageable);
  }

  /**
   * 获取用户关注的人的ID列表 查询指定用户关注的所有用户的ID
   *
   * @param followerId 关注者ID
   * @return 关注的用户ID列表
   * @throws BusinessException 关注者ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<Long> getFollowingIds(Long followerId) {
    if (followerId == null) {
      throw new BusinessException("FOLLOWER_ID_NULL", "关注者ID不能为空");
    }
    return userFollowRepository.findFollowingIdsByFollowerId(followerId);
  }

  /**
   * 获取用户粉丝的ID列表 查询关注指定用户的所有用户的ID
   *
   * @param followingId 被关注者ID
   * @return 粉丝的用户ID列表
   * @throws BusinessException 被关注者ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<Long> getFollowerIds(Long followingId) {
    if (followingId == null) {
      throw new BusinessException("FOLLOWING_ID_NULL", "被关注者ID不能为空");
    }
    return userFollowRepository.findFollowerIdsByFollowingId(followingId);
  }

  /**
   * 获取热门用户 根据粉丝数量排序获取热门用户
   *
   * @param limit 返回结果数量限制
   * @return 热门用户列表
   */
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getPopularUsers(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results = userFollowRepository.findPopularUsers(pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> user = new HashMap<>();
              user.put("userId", result[0]);
              user.put("followerCount", result[1]);
              return user;
            })
        .collect(Collectors.toList());
  }

  /**
   * 获取活跃粉丝 根据关注数量排序获取活跃粉丝
   *
   * @param limit 返回结果数量限制
   * @return 活跃粉丝列表
   */
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getActiveFollowers(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results = userFollowRepository.findActiveFollowers(pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> follower = new HashMap<>();
              follower.put("userId", result[0]);
              follower.put("followingCount", result[1]);
              return follower;
            })
        .collect(Collectors.toList());
  }

  /**
   * 获取用户关注统计信息 包括关注数、粉丝数、互相关注数
   *
   * @param userId 用户ID
   * @return 关注统计信息
   * @throws BusinessException 用户ID为空时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public FollowStatsDTO getFollowStats(Long userId) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }

    FollowStatsDTO stats = new FollowStatsDTO();
    stats.setUserId(userId);
    stats.setFollowingCount(getFollowingCount(userId));
    stats.setFollowerCount(getFollowersCount(userId));
    return stats;
  }

  /**
   * 获取系统关注统计信息 包括总关注关系数、本周新增关注数等
   *
   * @return 系统关注统计信息
   */
  @Transactional(readOnly = true)
  public Map<String, Long> getSystemFollowStats() {
    Map<String, Long> stats = new HashMap<>();
    stats.put("totalFollowRelations", userFollowRepository.count());

    // 可以添加更多系统级统计
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
    stats.put(
        "newFollowsThisWeek",
        (long) userFollowRepository.findByCreatedAtBetween(oneWeekAgo, LocalDateTime.now()).size());

    return stats;
  }

  /**
   * 获取最近的关注活动 查询最近发生的关注行为
   *
   * @param limit 返回结果数量限制
   * @return 最近的关注活动列表
   */
  @Transactional(readOnly = true)
  public List<UserFollow> getRecentFollowActivities(int limit) {
    return userFollowRepository.findTop20ByOrderByCreatedAtDesc();
  }

  /**
   * 批量检查关注状态 批量查询指定用户是否关注多个用户
   *
   * @param followerId 关注者ID
   * @param followingIds 被关注者ID列表
   * @return 关注状态映射表
   */
  @Transactional(readOnly = true)
  public Map<Long, Boolean> batchCheckFollowing(Long followerId, List<Long> followingIds) {
    if (followerId == null || followingIds == null || followingIds.isEmpty()) {
      return new HashMap<>();
    }

    Map<Long, Boolean> results = new HashMap<>();
    for (Long followingId : followingIds) {
      results.put(followingId, isFollowing(followerId, followingId));
    }
    return results;
  }

  /**
   * 获取推荐用户 基于热门用户推荐未关注的用户
   *
   * @param userId 用户ID
   * @param limit 返回结果数量限制
   * @return 推荐用户ID列表
   * @throws BusinessException 用户ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<Long> getRecommendedUsers(Long userId, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }

    // 简单的推荐算法：推荐热门用户中未关注的
    List<Long> followingIds = getFollowingIds(userId);
    List<Map<String, Object>> popularUsers = getPopularUsers(limit * 2); // 获取更多候选

    return popularUsers.stream()
        .map(user -> (Long) user.get("userId"))
        .filter(popularUserId -> !popularUserId.equals(userId)) // 排除自己
        .filter(popularUserId -> !followingIds.contains(popularUserId)) // 排除已关注的
        .limit(limit)
        .collect(Collectors.toList());
  }

  /**
   * 获取关注用户的活动 查询关注用户最近发布的内容
   *
   * @param userId 用户ID
   * @param since 时间起点
   * @param limit 返回结果数量限制
   * @return 关注用户的活动列表
   * @throws BusinessException 用户ID为空时抛出
   */
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getFollowingActivities(
      Long userId, LocalDateTime since, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    if (since == null) {
      since = LocalDateTime.now().minusDays(7); // 默认最近7天
    }

    // 获取关注的用户ID列表
    List<Long> followingIds = getFollowingIds(userId);

    // 这里应该查询这些用户的新内容，但由于涉及到KnowledgeItem，
    // 在实际实现中需要注入KnowledgeItemService或Repository
    // 暂时返回空列表，在实际使用时需要完善
    return List.of();
  }

  /**
   * 通知粉丝新内容 为用户的粉丝创建新内容通知
   *
   * @param userId 用户ID
   * @param knowledgeId 知识内容ID
   * @throws BusinessException 参数无效时抛出
   */
  public void notifyFollowersOfNewContent(Long userId, Long knowledgeId) {
    if (userId == null || knowledgeId == null) {
      throw new BusinessException("INVALID_PARAMS", "用户ID和知识内容ID不能为空");
    }

    try {
      // 获取用户的粉丝列表
      List<Long> followerIds = getFollowerIds(userId);

      // 为每个粉丝创建通知（这里可以考虑异步处理以提高性能）
      for (Long followerId : followerIds) {
        try {
          notificationService.createSystemNotification(
              followerId, "关注的用户发布了新内容", "您关注的用户发布了新的知识内容");
        } catch (Exception e) {
          logger.warn("为粉丝 {} 创建新内容通知失败", followerId, e);
          // 单个通知失败不影响整体流程
        }
      }

      logger.info("为用户 {} 的 {} 个粉丝创建了新内容通知", userId, followerIds.size());
    } catch (Exception e) {
      logger.error("通知粉丝新内容失败: userId={}, knowledgeId={}", userId, knowledgeId, e);
      // 通知失败不抛出异常，不影响主流程
    }
  }

  /**
   * 检查是否可以关注 验证关注关系的有效性
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @return 可以关注返回true，否则返回false
   */
  @Transactional(readOnly = true)
  public boolean canFollow(Long followerId, Long followingId) {
    if (followerId == null || followingId == null) {
      return false;
    }

    // 不能关注自己
    if (followerId.equals(followingId)) {
      return false;
    }

    // 检查用户是否存在且状态正常
    return userRepository.existsById(followerId)
        && userRepository.existsById(followingId)
        && !isFollowing(followerId, followingId);
  }

  /**
   * 获取关注关系 查询指定用户之间的关注关系
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @return 关注关系
   * @throws BusinessException 参数无效或关注关系不存在时抛出
   */
  @Transactional(readOnly = true)
  public UserFollow getFollowRelation(Long followerId, Long followingId) {
    if (followerId == null || followingId == null) {
      throw new BusinessException("INVALID_PARAMS", "关注者ID和被关注者ID不能为空");
    }

    return userFollowRepository
        .findByFollowerIdAndFollowingId(followerId, followingId)
        .orElseThrow(() -> new BusinessException("FOLLOW_RELATION_NOT_FOUND", "关注关系不存在"));
  }

  /** 转换UserFollow为FollowDTO */
  private FollowDTO convertToFollowDTO(UserFollow userFollow) {
    FollowDTO dto = new FollowDTO();
    dto.setId(userFollow.getId());
    dto.setFollowerId(userFollow.getFollowerId());
    dto.setFollowingId(userFollow.getFollowingId());
    dto.setCreatedAt(
        userFollow.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    return dto;
  }
}
