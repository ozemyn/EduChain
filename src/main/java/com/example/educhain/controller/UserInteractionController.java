package com.example.educhain.controller;

import com.example.educhain.entity.UserInteraction;
import com.example.educhain.service.UserInteractionService;
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
 * 用户互动控制器
 */
@RestController
@RequestMapping("/api/interactions")
@Tag(name = "用户互动管理", description = "用户互动相关接口")
public class UserInteractionController {

    private static final Logger logger = LoggerFactory.getLogger(UserInteractionController.class);

    @Autowired
    private UserInteractionService userInteractionService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 点赞知识内容
     */
    @PostMapping("/like/{knowledgeId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "点赞知识内容", description = "用户点赞指定的知识内容")
    public ResponseEntity<Result<Void>> likeKnowledge(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            userInteractionService.like(userId, knowledgeId);
            return ResponseEntity.ok(Result.<Void>success("点赞成功", null));
        } catch (Exception e) {
            logger.error("点赞失败", e);
            return ResponseEntity.badRequest().body(Result.error("LIKE_FAILED", e.getMessage()));
        }
    }

    /**
     * 取消点赞
     */
    @DeleteMapping("/like/{knowledgeId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "取消点赞", description = "用户取消对指定知识内容的点赞")
    public ResponseEntity<Result<Void>> unlikeKnowledge(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            userInteractionService.unlike(userId, knowledgeId);
            return ResponseEntity.ok(Result.<Void>success("取消点赞成功", null));
        } catch (Exception e) {
            logger.error("取消点赞失败", e);
            return ResponseEntity.badRequest().body(Result.error("UNLIKE_FAILED", e.getMessage()));
        }
    }

    /**
     * 收藏知识内容
     */
    @PostMapping("/favorite/{knowledgeId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "收藏知识内容", description = "用户收藏指定的知识内容")
    public ResponseEntity<Result<Void>> favoriteKnowledge(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            userInteractionService.favorite(userId, knowledgeId);
            return ResponseEntity.ok(Result.<Void>success("收藏成功", null));
        } catch (Exception e) {
            logger.error("收藏失败", e);
            return ResponseEntity.badRequest().body(Result.error("FAVORITE_FAILED", e.getMessage()));
        }
    }

    /**
     * 取消收藏
     */
    @DeleteMapping("/favorite/{knowledgeId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "取消收藏", description = "用户取消对指定知识内容的收藏")
    public ResponseEntity<Result<Void>> unfavoriteKnowledge(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            userInteractionService.unfavorite(userId, knowledgeId);
            return ResponseEntity.ok(Result.<Void>success("取消收藏成功", null));
        } catch (Exception e) {
            logger.error("取消收藏失败", e);
            return ResponseEntity.badRequest().body(Result.error("UNFAVORITE_FAILED", e.getMessage()));
        }
    }

    /**
     * 记录浏览行为
     */
    @PostMapping("/view/{knowledgeId}")
    @Operation(summary = "记录浏览行为", description = "记录用户浏览知识内容的行为")
    public ResponseEntity<Result<Void>> recordView(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = null;
            try {
                userId = jwtUtil.getUserIdFromRequest(request);
            } catch (Exception e) {
                // 未登录用户也可以浏览，userId为null
            }
            
            String ipAddress = getClientIpAddress(request);
            userInteractionService.recordView(userId, knowledgeId, ipAddress);
            return ResponseEntity.ok(Result.<Void>success("浏览记录成功", null));
        } catch (Exception e) {
            logger.error("记录浏览行为失败", e);
            return ResponseEntity.ok(Result.<Void>success("浏览记录失败，但不影响浏览", null));
        }
    }

    /**
     * 检查用户互动状态
     */
    @GetMapping("/status/{knowledgeId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "检查用户互动状态", description = "检查用户对指定知识内容的互动状态")
    public ResponseEntity<Result<Map<String, Boolean>>> getInteractionStatus(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Map<String, Boolean> status = Map.of(
                    "hasLiked", userInteractionService.hasLiked(userId, knowledgeId),
                    "hasFavorited", userInteractionService.hasFavorited(userId, knowledgeId)
            );
            return ResponseEntity.ok(Result.success(status));
        } catch (Exception e) {
            logger.error("获取互动状态失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_STATUS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取知识内容的互动统计
     */
    @GetMapping("/stats/{knowledgeId}")
    @Operation(summary = "获取知识内容互动统计", description = "获取指定知识内容的互动统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getInteractionStats(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
        try {
            Map<String, Long> stats = userInteractionService.getInteractionStats(knowledgeId);
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取互动统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的互动记录
     */
    @GetMapping("/user")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取用户互动记录", description = "获取当前用户的互动记录")
    public ResponseEntity<Result<Page<UserInteraction>>> getUserInteractions(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<UserInteraction> interactions = userInteractionService.getUserInteractions(userId, pageable);
            return ResponseEntity.ok(Result.success(interactions));
        } catch (Exception e) {
            logger.error("获取用户互动记录失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_INTERACTIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的收藏列表
     */
    @GetMapping("/favorites")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取用户收藏列表", description = "获取当前用户的收藏列表")
    public ResponseEntity<Result<Page<UserInteraction>>> getUserFavorites(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<UserInteraction> favorites = userInteractionService.getUserFavorites(userId, pageable);
            return ResponseEntity.ok(Result.success(favorites));
        } catch (Exception e) {
            logger.error("获取用户收藏列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_FAVORITES_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的点赞列表
     */
    @GetMapping("/likes")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取用户点赞列表", description = "获取当前用户的点赞列表")
    public ResponseEntity<Result<Page<UserInteraction>>> getUserLikes(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<UserInteraction> likes = userInteractionService.getUserLikes(userId, pageable);
            return ResponseEntity.ok(Result.success(likes));
        } catch (Exception e) {
            logger.error("获取用户点赞列表失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_LIKES_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取热门知识内容
     */
    @GetMapping("/popular")
    @Operation(summary = "获取热门知识内容", description = "获取基于互动数据的热门知识内容")
    public ResponseEntity<Result<List<Map<String, Object>>>> getPopularKnowledgeItems(
            @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            LocalDateTime startTime = LocalDateTime.now().minusDays(days);
            List<Map<String, Object>> popular = userInteractionService.getPopularKnowledgeItems(startTime, limit);
            return ResponseEntity.ok(Result.success(popular));
        } catch (Exception e) {
            logger.error("获取热门知识内容失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_POPULAR_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取活跃用户
     */
    @GetMapping("/active-users")
    @Operation(summary = "获取活跃用户", description = "获取基于互动数据的活跃用户")
    public ResponseEntity<Result<List<Map<String, Object>>>> getActiveUsers(
            @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            LocalDateTime startTime = LocalDateTime.now().minusDays(days);
            List<Map<String, Object>> activeUsers = userInteractionService.getActiveUsers(startTime, limit);
            return ResponseEntity.ok(Result.success(activeUsers));
        } catch (Exception e) {
            logger.error("获取活跃用户失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_ACTIVE_USERS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}