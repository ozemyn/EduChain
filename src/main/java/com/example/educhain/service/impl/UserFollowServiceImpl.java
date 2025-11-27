package com.example.educhain.service.impl;

import com.example.educhain.entity.UserFollow;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.UserFollowRepository;
import com.example.educhain.repository.UserRepository;
import com.example.educhain.service.NotificationService;
import com.example.educhain.service.UserFollowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户关注服务实现类
 */
@Service
@Transactional
public class UserFollowServiceImpl implements UserFollowService {

    private static final Logger logger = LoggerFactory.getLogger(UserFollowServiceImpl.class);

    @Autowired
    private UserFollowRepository userFollowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

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

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(Long followerId, Long followingId) {
        if (followerId == null || followingId == null) {
            return false;
        }
        return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserFollow> getFollowingList(Long followerId, Pageable pageable) {
        if (followerId == null) {
            throw new BusinessException("FOLLOWER_ID_NULL", "关注者ID不能为空");
        }
        return userFollowRepository.findByFollowerIdOrderByCreatedAtDesc(followerId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserFollow> getFollowersList(Long followingId, Pageable pageable) {
        if (followingId == null) {
            throw new BusinessException("FOLLOWING_ID_NULL", "被关注者ID不能为空");
        }
        return userFollowRepository.findByFollowingIdOrderByCreatedAtDesc(followingId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowingCount(Long followerId) {
        if (followerId == null) {
            return 0;
        }
        return userFollowRepository.countByFollowerId(followerId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowersCount(Long followingId) {
        if (followingId == null) {
            return 0;
        }
        return userFollowRepository.countByFollowingId(followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserFollow> getRecentFollowing(Long followerId, int limit) {
        if (followerId == null) {
            throw new BusinessException("FOLLOWER_ID_NULL", "关注者ID不能为空");
        }
        return userFollowRepository.findTop10ByFollowerIdOrderByCreatedAtDesc(followerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserFollow> getRecentFollowers(Long followingId, int limit) {
        if (followingId == null) {
            throw new BusinessException("FOLLOWING_ID_NULL", "被关注者ID不能为空");
        }
        return userFollowRepository.findTop10ByFollowingIdOrderByCreatedAtDesc(followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserFollow> getMutualFollows(Long userId) {
        if (userId == null) {
            throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
        }
        return userFollowRepository.findMutualFollows(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getFollowingIds(Long followerId) {
        if (followerId == null) {
            throw new BusinessException("FOLLOWER_ID_NULL", "关注者ID不能为空");
        }
        return userFollowRepository.findFollowingIdsByFollowerId(followerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getFollowerIds(Long followingId) {
        if (followingId == null) {
            throw new BusinessException("FOLLOWING_ID_NULL", "被关注者ID不能为空");
        }
        return userFollowRepository.findFollowerIdsByFollowingId(followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPopularUsers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = userFollowRepository.findPopularUsers(pageable);
        
        return results.stream().map(result -> {
            Map<String, Object> user = new HashMap<>();
            user.put("userId", result[0]);
            user.put("followerCount", result[1]);
            return user;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getActiveFollowers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = userFollowRepository.findActiveFollowers(pageable);
        
        return results.stream().map(result -> {
            Map<String, Object> follower = new HashMap<>();
            follower.put("userId", result[0]);
            follower.put("followingCount", result[1]);
            return follower;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getFollowStats(Long userId) {
        if (userId == null) {
            throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
        }

        Map<String, Long> stats = new HashMap<>();
        stats.put("following", getFollowingCount(userId));
        stats.put("followers", getFollowersCount(userId));
        stats.put("mutualFollows", (long) getMutualFollows(userId).size());
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getSystemFollowStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalFollowRelations", userFollowRepository.count());
        
        // 可以添加更多系统级统计
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        stats.put("newFollowsThisWeek", (long) userFollowRepository.findByCreatedAtBetween(
                oneWeekAgo, LocalDateTime.now()).size());
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserFollow> getRecentFollowActivities(int limit) {
        return userFollowRepository.findTop20ByOrderByCreatedAtDesc();
    }

    @Override
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

    @Override
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

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFollowingActivities(Long userId, LocalDateTime since, int limit) {
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

    @Override
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
                    notificationService.createSystemNotification(followerId, 
                            "关注的用户发布了新内容", 
                            "您关注的用户发布了新的知识内容");
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

    @Override
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
        return userRepository.existsById(followerId) && 
               userRepository.existsById(followingId) &&
               !isFollowing(followerId, followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserFollow getFollowRelation(Long followerId, Long followingId) {
        if (followerId == null || followingId == null) {
            throw new BusinessException("INVALID_PARAMS", "关注者ID和被关注者ID不能为空");
        }
        
        return userFollowRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new BusinessException("FOLLOW_RELATION_NOT_FOUND", "关注关系不存在"));
    }
}