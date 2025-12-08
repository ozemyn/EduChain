package com.example.educhain.service;

import com.example.educhain.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 用户关注服务接口 */
public interface UserFollowService {

  /**
   * 关注用户
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   */
  void followUser(Long followerId, Long followingId);

  /**
   * 取消关注用户
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   */
  void unfollowUser(Long followerId, Long followingId);

  /**
   * 检查是否关注
   *
   * @param followerId 关注者ID
   * @param followingId 被关注者ID
   * @return 是否关注
   */
  boolean isFollowing(Long followerId, Long followingId);

  /**
   * 获取关注列表
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 关注列表
   */
  Page<FollowDTO> getFollowing(Long userId, Pageable pageable);

  /**
   * 获取粉丝列表
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 粉丝列表
   */
  Page<FollowDTO> getFollowers(Long userId, Pageable pageable);

  /**
   * 获取关注统计
   *
   * @param userId 用户ID
   * @return 关注统计
   */
  FollowStatsDTO getFollowStats(Long userId);

  /**
   * 获取互相关注列表
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 互相关注列表
   */
  Page<UserDTO> getMutualFollows(Long userId, Pageable pageable);

  /** 关注DTO */
  class FollowDTO {
    private Long id;
    private Long followerId;
    private Long followingId;
    private String createdAt;
    private UserDTO follower;
    private UserDTO following;

    // Constructors
    public FollowDTO() {}

    public FollowDTO(Long id, Long followerId, Long followingId, String createdAt) {
      this.id = id;
      this.followerId = followerId;
      this.followingId = followingId;
      this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public Long getFollowerId() {
      return followerId;
    }

    public void setFollowerId(Long followerId) {
      this.followerId = followerId;
    }

    public Long getFollowingId() {
      return followingId;
    }

    public void setFollowingId(Long followingId) {
      this.followingId = followingId;
    }

    public String getCreatedAt() {
      return createdAt;
    }

    public void setCreatedAt(String createdAt) {
      this.createdAt = createdAt;
    }

    public UserDTO getFollower() {
      return follower;
    }

    public void setFollower(UserDTO follower) {
      this.follower = follower;
    }

    public UserDTO getFollowing() {
      return following;
    }

    public void setFollowing(UserDTO following) {
      this.following = following;
    }
  }

  /** 关注统计DTO */
  class FollowStatsDTO {
    private Long userId;
    private Long followingCount;
    private Long followerCount;
    private Boolean isFollowing;

    // Constructors
    public FollowStatsDTO() {}

    public FollowStatsDTO(Long userId, Long followingCount, Long followerCount) {
      this.userId = userId;
      this.followingCount = followingCount;
      this.followerCount = followerCount;
    }

    // Getters and Setters
    public Long getUserId() {
      return userId;
    }

    public void setUserId(Long userId) {
      this.userId = userId;
    }

    public Long getFollowingCount() {
      return followingCount;
    }

    public void setFollowingCount(Long followingCount) {
      this.followingCount = followingCount;
    }

    public Long getFollowerCount() {
      return followerCount;
    }

    public void setFollowerCount(Long followerCount) {
      this.followerCount = followerCount;
    }

    public Boolean getIsFollowing() {
      return isFollowing;
    }

    public void setIsFollowing(Boolean isFollowing) {
      this.isFollowing = isFollowing;
    }
  }
}
