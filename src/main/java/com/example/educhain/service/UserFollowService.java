package com.example.educhain.service;

import com.example.educhain.entity.UserFollow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 用户关注服务接口
 */
public interface UserFollowService {

    /**
     * 关注用户
     */
    void followUser(Long followerId, Long followingId);

    /**
     * 取消关注用户
     */
    void unfollowUser(Long followerId, Long followingId);

    /**
     * 检查是否已关注
     */
    boolean isFollowing(Long followerId, Long followingId);

    /**
     * 获取用户的关注列表
     */
    Page<UserFollow> getFollowingList(Long followerId, Pageable pageable);

    /**
     * 获取用户的粉丝列表
     */
    Page<UserFollow> getFollowersList(Long followingId, Pageable pageable);

    /**
     * 统计用户关注的人数
     */
    long getFollowingCount(Long followerId);

    /**
     * 统计用户的粉丝数
     */
    long getFollowersCount(Long followingId);

    /**
     * 获取用户最近关注的人
     */
    List<UserFollow> getRecentFollowing(Long followerId, int limit);

    /**
     * 获取用户最近的粉丝
     */
    List<UserFollow> getRecentFollowers(Long followingId, int limit);

    /**
     * 获取互相关注的用户
     */
    List<UserFollow> getMutualFollows(Long userId);

    /**
     * 获取用户关注的人的ID列表
     */
    List<Long> getFollowingIds(Long followerId);

    /**
     * 获取用户粉丝的ID列表
     */
    List<Long> getFollowerIds(Long followingId);

    /**
     * 获取热门用户（按粉丝数排序）
     */
    List<Map<String, Object>> getPopularUsers(int limit);

    /**
     * 获取最活跃的关注者（按关注数排序）
     */
    List<Map<String, Object>> getActiveFollowers(int limit);

    /**
     * 获取关注关系统计
     */
    Map<String, Long> getFollowStats(Long userId);

    /**
     * 获取系统关注统计
     */
    Map<String, Long> getSystemFollowStats();

    /**
     * 获取最近的关注活动
     */
    List<UserFollow> getRecentFollowActivities(int limit);

    /**
     * 批量检查关注关系
     */
    Map<Long, Boolean> batchCheckFollowing(Long followerId, List<Long> followingIds);

    /**
     * 获取用户可能感兴趣的人（推荐关注）
     */
    List<Long> getRecommendedUsers(Long userId, int limit);

    /**
     * 获取关注动态（被关注用户的新内容）
     */
    List<Map<String, Object>> getFollowingActivities(Long userId, LocalDateTime since, int limit);

    /**
     * 通知关注者用户发布了新内容
     */
    void notifyFollowersOfNewContent(Long userId, Long knowledgeId);

    /**
     * 检查用户是否可以关注目标用户
     */
    boolean canFollow(Long followerId, Long followingId);

    /**
     * 获取关注关系详情
     */
    UserFollow getFollowRelation(Long followerId, Long followingId);
}