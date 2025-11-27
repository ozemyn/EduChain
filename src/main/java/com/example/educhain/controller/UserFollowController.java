package com.example.educhain.controller;

import com.example.educhain.entity.UserFollow;
import com.example.educhain.service.UserFollowService;
import com.example.educhain.util.JwtUtil;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 用户关注控制器
 */
@RestController
@RequestMapping("/api/follows")
@Tag(name = "用户关注管理", description = "用户关注相关接口")
public class UserFollowController {

    private static final Logger logger = LoggerFactory.getLogger(UserFollowController.class);

    @Autowired
    private UserFollowService userFollowService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 关注用户
     */
    @PostMapping("/{followingId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "关注用户", description = "当前用户关注指定用户")
    public ResponseEntity<Result<Void>> followUser(
            @Parameter(description = "被关注用户ID") @PathVariable Long followingId,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            userFollowService.followUser(followerId, followingId);
            return ResponseEntity.ok(Result.<Void>success("关注成功", null));
        } catch (Exception e) {
            logger.error("关注用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("FOLLOW_USER_FAILED", e.getMessage()));
        }
    }

    /**
     * 取消关注用户
     */
    @DeleteMapping("/{followingId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "取消关注用户", description = "当前用户取消关注指定用户")
    public ResponseEntity<Result<Void>> unfollowUser(
            @Parameter(description = "被关注用户ID") @PathVariable Long followingId,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            userFollowService.unfollowUser(followerId, followingId);
            return ResponseEntity.ok(Result.<Void>success("取消关注成功", null));
        } catch (Exception e) {
            logger.error("取消关注用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("UNFOLLOW_USER_FAILED", e.getMessage()));
        }
    }

    /**
     * 检查是否关注用户
     */
    @GetMapping("/status/{followingId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "检查关注状态", description = "检查当前用户是否关注指定用户")
    public ResponseEntity<Result<Map<String, Boolean>>> checkFollowStatus(
            @Parameter(description = "被关注用户ID") @PathVariable Long followingId,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            boolean isFollowing = userFollowService.isFollowing(followerId, followingId);
            Map<String, Boolean> status = Map.of("isFollowing", isFollowing);
            return ResponseEntity.ok(Result.success(status));
        } catch (Exception e) {
            logger.error("检查关注状态失败", e);
            return ResponseEntity.badRequest().body(Result.error("CHECK_FOLLOW_STATUS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的关注列表
     */
    @GetMapping("/following")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取关注列表", description = "获取当前用户的关注列表")
    public ResponseEntity<Result<Page<UserFollow>>> getFollowingList(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<UserFollow> followingList = userFollowService.getFollowingList(followerId, pageable);
            return ResponseEntity.ok(Result.success(followingList));
        } catch (Exception e) {
            logger.error("获取关注列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_FOLLOWING_LIST_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的粉丝列表
     */
    @GetMapping("/followers")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取粉丝列表", description = "获取当前用户的粉丝列表")
    public ResponseEntity<Result<Page<UserFollow>>> getFollowersList(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long followingId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<UserFollow> followersList = userFollowService.getFollowersList(followingId, pageable);
            return ResponseEntity.ok(Result.success(followersList));
        } catch (Exception e) {
            logger.error("获取粉丝列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_FOLLOWERS_LIST_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取指定用户的关注列表
     */
    @GetMapping("/user/{userId}/following")
    @Operation(summary = "获取用户关注列表", description = "获取指定用户的关注列表")
    public ResponseEntity<Result<Page<UserFollow>>> getUserFollowingList(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserFollow> followingList = userFollowService.getFollowingList(userId, pageable);
            return ResponseEntity.ok(Result.success(followingList));
        } catch (Exception e) {
            logger.error("获取用户关注列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_FOLLOWING_LIST_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取指定用户的粉丝列表
     */
    @GetMapping("/user/{userId}/followers")
    @Operation(summary = "获取用户粉丝列表", description = "获取指定用户的粉丝列表")
    public ResponseEntity<Result<Page<UserFollow>>> getUserFollowersList(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserFollow> followersList = userFollowService.getFollowersList(userId, pageable);
            return ResponseEntity.ok(Result.success(followersList));
        } catch (Exception e) {
            logger.error("获取用户粉丝列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_FOLLOWERS_LIST_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取关注统计
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取关注统计", description = "获取当前用户的关注统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getFollowStats(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Map<String, Long> stats = userFollowService.getFollowStats(userId);
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取关注统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_FOLLOW_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取指定用户的关注统计
     */
    @GetMapping("/user/{userId}/stats")
    @Operation(summary = "获取用户关注统计", description = "获取指定用户的关注统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getUserFollowStats(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        try {
            Map<String, Long> stats = userFollowService.getFollowStats(userId);
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取用户关注统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_FOLLOW_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取互相关注的用户
     */
    @GetMapping("/mutual")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取互相关注用户", description = "获取与当前用户互相关注的用户列表")
    public ResponseEntity<Result<List<UserFollow>>> getMutualFollows(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            List<UserFollow> mutualFollows = userFollowService.getMutualFollows(userId);
            return ResponseEntity.ok(Result.success(mutualFollows));
        } catch (Exception e) {
            logger.error("获取互相关注用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_MUTUAL_FOLLOWS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取推荐关注用户
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取推荐关注用户", description = "获取推荐关注的用户列表")
    public ResponseEntity<Result<List<Long>>> getRecommendedUsers(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            List<Long> recommendedUsers = userFollowService.getRecommendedUsers(userId, limit);
            return ResponseEntity.ok(Result.success(recommendedUsers));
        } catch (Exception e) {
            logger.error("获取推荐关注用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_RECOMMENDED_USERS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取最近关注的用户
     */
    @GetMapping("/recent/following")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取最近关注用户", description = "获取当前用户最近关注的用户")
    public ResponseEntity<Result<List<UserFollow>>> getRecentFollowing(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            List<UserFollow> recentFollowing = userFollowService.getRecentFollowing(followerId, limit);
            return ResponseEntity.ok(Result.success(recentFollowing));
        } catch (Exception e) {
            logger.error("获取最近关注用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_RECENT_FOLLOWING_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取最近的粉丝
     */
    @GetMapping("/recent/followers")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取最近粉丝", description = "获取当前用户最近的粉丝")
    public ResponseEntity<Result<List<UserFollow>>> getRecentFollowers(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest request) {
        try {
            Long followingId = jwtUtil.getUserIdFromRequest(request);
            List<UserFollow> recentFollowers = userFollowService.getRecentFollowers(followingId, limit);
            return ResponseEntity.ok(Result.success(recentFollowers));
        } catch (Exception e) {
            logger.error("获取最近粉丝失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_RECENT_FOLLOWERS_FAILED", e.getMessage()));
        }
    }

    /**
     * 批量检查关注关系
     */
    @PostMapping("/batch-check")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "批量检查关注关系", description = "批量检查当前用户对指定用户列表的关注关系")
    public ResponseEntity<Result<Map<Long, Boolean>>> batchCheckFollowing(
            @Parameter(description = "用户ID列表") @RequestBody List<Long> followingIds,
            HttpServletRequest request) {
        try {
            Long followerId = jwtUtil.getUserIdFromRequest(request);
            Map<Long, Boolean> results = userFollowService.batchCheckFollowing(followerId, followingIds);
            return ResponseEntity.ok(Result.success(results));
        } catch (Exception e) {
            logger.error("批量检查关注关系失败", e);
            return ResponseEntity.badRequest().body(Result.error("BATCH_CHECK_FOLLOWING_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取关注动态
     */
    @GetMapping("/activities")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取关注动态", description = "获取关注用户的最新动态")
    public ResponseEntity<Result<List<Map<String, Object>>>> getFollowingActivities(
            @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            LocalDateTime since = LocalDateTime.now().minusDays(days);
            List<Map<String, Object>> activities = userFollowService.getFollowingActivities(userId, since, limit);
            return ResponseEntity.ok(Result.success(activities));
        } catch (Exception e) {
            logger.error("获取关注动态失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_FOLLOWING_ACTIVITIES_FAILED", e.getMessage()));
        }
    }

    // 系统统计接口

    /**
     * 获取热门用户
     */
    @GetMapping("/popular-users")
    @Operation(summary = "获取热门用户", description = "获取按粉丝数排序的热门用户")
    public ResponseEntity<Result<List<Map<String, Object>>>> getPopularUsers(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> popularUsers = userFollowService.getPopularUsers(limit);
            return ResponseEntity.ok(Result.success(popularUsers));
        } catch (Exception e) {
            logger.error("获取热门用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_POPULAR_USERS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取活跃关注者
     */
    @GetMapping("/active-followers")
    @Operation(summary = "获取活跃关注者", description = "获取按关注数排序的活跃关注者")
    public ResponseEntity<Result<List<Map<String, Object>>>> getActiveFollowers(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> activeFollowers = userFollowService.getActiveFollowers(limit);
            return ResponseEntity.ok(Result.success(activeFollowers));
        } catch (Exception e) {
            logger.error("获取活跃关注者失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_ACTIVE_FOLLOWERS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取最近关注活动
     */
    @GetMapping("/recent-activities")
    @Operation(summary = "获取最近关注活动", description = "获取系统最近的关注活动")
    public ResponseEntity<Result<List<UserFollow>>> getRecentFollowActivities(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<UserFollow> recentActivities = userFollowService.getRecentFollowActivities(limit);
            return ResponseEntity.ok(Result.success(recentActivities));
        } catch (Exception e) {
            logger.error("获取最近关注活动失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_RECENT_FOLLOW_ACTIVITIES_FAILED", e.getMessage()));
        }
    }

    // 管理员接口

    /**
     * 获取系统关注统计
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取系统关注统计", description = "管理员获取系统关注统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getSystemFollowStats() {
        try {
            Map<String, Long> stats = userFollowService.getSystemFollowStats();
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取系统关注统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_SYSTEM_FOLLOW_STATS_FAILED", e.getMessage()));
        }
    }
}