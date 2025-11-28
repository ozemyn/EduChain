package com.example.educhain.controller;

import com.example.educhain.dto.AchievementSummaryDTO;
import com.example.educhain.dto.UserAchievementDTO;
import com.example.educhain.entity.UserAchievement;
import com.example.educhain.service.UserAchievementService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 成就管理控制器
 */
@RestController
@RequestMapping("/achievements")
@Tag(name = "成就管理", description = "用户成就系统相关接口")
public class AchievementController {

    @Autowired
    private UserAchievementService userAchievementService;

    // ==================== 用户成就管理 ====================

    @PostMapping("/initialize")
    @Operation(summary = "初始化用户成就系统")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> initializeUserAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        userAchievementService.initializeUserAchievements(userId);
        return Result.success();
    }

    @GetMapping("/summary")
    @Operation(summary = "获取当前用户成就概览")
    @PreAuthorize("isAuthenticated()")
    public Result<AchievementSummaryDTO> getUserAchievementSummary(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        AchievementSummaryDTO summary = userAchievementService.getUserAchievementSummary(userId);
        return Result.success(summary);
    }

    @GetMapping("/summary/{userId}")
    @Operation(summary = "获取指定用户成就概览")
    public Result<AchievementSummaryDTO> getUserAchievementSummary(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        AchievementSummaryDTO summary = userAchievementService.getUserAchievementSummary(userId);
        return Result.success(summary);
    }

    @GetMapping("/my")
    @Operation(summary = "获取当前用户所有成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserAchievements(userId);
        return Result.success(achievements);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "获取指定用户所有成就")
    public Result<List<UserAchievementDTO>> getUserAchievements(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        List<UserAchievementDTO> achievements = userAchievementService.getUserAchievements(userId);
        return Result.success(achievements);
    }

    @GetMapping("/my/completed")
    @Operation(summary = "获取当前用户已完成的成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyCompletedAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserCompletedAchievements(userId);
        return Result.success(achievements);
    }

    @GetMapping("/my/pending")
    @Operation(summary = "获取当前用户未完成的成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyPendingAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserPendingAchievements(userId);
        return Result.success(achievements);
    }

    @GetMapping("/my/recent")
    @Operation(summary = "获取当前用户最近获得的成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyRecentAchievements(
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserRecentAchievements(userId, limit);
        return Result.success(achievements);
    }

    @GetMapping("/my/near-completion")
    @Operation(summary = "获取当前用户接近完成的成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyNearCompletionAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserNearCompletionAchievements(userId);
        return Result.success(achievements);
    }

    @GetMapping("/my/upgradable")
    @Operation(summary = "获取当前用户可升级的成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> getMyUpgradableAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> achievements = userAchievementService.getUserUpgradableAchievements(userId);
        return Result.success(achievements);
    }

    // ==================== 成就操作 ====================

    @PostMapping("/check")
    @Operation(summary = "检查并更新当前用户成就")
    @PreAuthorize("isAuthenticated()")
    public Result<List<UserAchievementDTO>> checkAndUpdateAchievements(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<UserAchievementDTO> newAchievements = userAchievementService.checkAndUpdateAchievements(userId);
        return Result.success(newAchievements);
    }

    @PostMapping("/trigger")
    @Operation(summary = "手动触发成就检查")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> triggerAchievementCheck(
            @Parameter(description = "事件类型") @RequestParam String eventType,
            @Parameter(description = "事件数据") @RequestBody(required = false) Map<String, Object> eventData,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        if (eventData == null) {
            eventData = new HashMap<>();
        }
        userAchievementService.triggerAchievementCheck(userId, eventType, eventData);
        return Result.success();
    }

    @PostMapping("/level-up")
    @Operation(summary = "升级成就")
    @PreAuthorize("isAuthenticated()")
    public Result<UserAchievementDTO> levelUpAchievement(
            @Parameter(description = "成就类型") @RequestParam UserAchievement.AchievementType achievementType,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        UserAchievementDTO achievement = userAchievementService.levelUpAchievement(userId, achievementType);
        return Result.success(achievement);
    }

    @PostMapping("/reset")
    @Operation(summary = "重置成就")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> resetAchievement(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "成就类型") @RequestParam UserAchievement.AchievementType achievementType) {
        userAchievementService.resetAchievement(userId, achievementType);
        return Result.success();
    }

    @PostMapping("/custom")
    @Operation(summary = "创建自定义成就")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<UserAchievementDTO> createCustomAchievement(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "成就名称") @RequestParam String name,
            @Parameter(description = "成就描述") @RequestParam String description,
            @Parameter(description = "奖励积分") @RequestParam Integer points) {
        UserAchievementDTO achievement = userAchievementService.createCustomAchievement(userId, name, description, points);
        return Result.success(achievement);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除用户成就")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteUserAchievement(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "成就类型") @RequestParam UserAchievement.AchievementType achievementType) {
        userAchievementService.deleteUserAchievement(userId, achievementType);
        return Result.success();
    }

    // ==================== 排行榜和统计 ====================

    @GetMapping("/leaderboard")
    @Operation(summary = "获取成就排行榜")
    public Result<Page<Map<String, Object>>> getAchievementLeaderboard(
            @PageableDefault(size = 50) Pageable pageable) {
        Page<Map<String, Object>> leaderboard = userAchievementService.getAchievementLeaderboard(pageable);
        return Result.success(leaderboard);
    }

    @GetMapping("/leaderboard/{achievementType}")
    @Operation(summary = "获取特定类型成就排行榜")
    public Result<Page<Map<String, Object>>> getAchievementTypeLeaderboard(
            @Parameter(description = "成就类型") @PathVariable UserAchievement.AchievementType achievementType,
            @PageableDefault(size = 50) Pageable pageable) {
        Page<Map<String, Object>> leaderboard = userAchievementService.getAchievementTypeLeaderboard(achievementType, pageable);
        return Result.success(leaderboard);
    }

    @GetMapping("/statistics")
    @Operation(summary = "获取成就统计信息")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Map<String, Object>> getAchievementStatistics() {
        Map<String, Object> statistics = userAchievementService.getAchievementStatistics();
        return Result.success(statistics);
    }

    @GetMapping("/popular")
    @Operation(summary = "获取最受欢迎的成就")
    public Result<List<Map<String, Object>>> getMostPopularAchievements(
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> popular = userAchievementService.getMostPopularAchievements(limit);
        return Result.success(popular);
    }

    @GetMapping("/rarest")
    @Operation(summary = "获取最稀有的成就")
    public Result<List<Map<String, Object>>> getRarestAchievements(
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> rarest = userAchievementService.getRarestAchievements(limit);
        return Result.success(rarest);
    }

    // ==================== 用户等级和积分 ====================

    @GetMapping("/my/level")
    @Operation(summary = "获取当前用户等级")
    @PreAuthorize("isAuthenticated()")
    public Result<Integer> getMyLevel(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Integer level = userAchievementService.calculateUserLevel(userId);
        return Result.success(level);
    }

    @GetMapping("/my/points")
    @Operation(summary = "获取当前用户总积分")
    @PreAuthorize("isAuthenticated()")
    public Result<Integer> getMyTotalPoints(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Integer points = userAchievementService.getUserTotalPoints(userId);
        return Result.success(points);
    }

    @GetMapping("/user/{userId}/level")
    @Operation(summary = "获取指定用户等级")
    public Result<Integer> getUserLevel(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        Integer level = userAchievementService.calculateUserLevel(userId);
        return Result.success(level);
    }

    @GetMapping("/user/{userId}/points")
    @Operation(summary = "获取指定用户总积分")
    public Result<Integer> getUserTotalPoints(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        Integer points = userAchievementService.getUserTotalPoints(userId);
        return Result.success(points);
    }

    // ==================== 进度报告 ====================

    @GetMapping("/my/progress")
    @Operation(summary = "获取当前用户成就进度报告")
    @PreAuthorize("isAuthenticated()")
    public Result<Map<String, Object>> getMyAchievementProgressReport(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Map<String, Object> report = userAchievementService.getAchievementProgressReport(userId);
        return Result.success(report);
    }

    @GetMapping("/user/{userId}/progress")
    @Operation(summary = "获取指定用户成就进度报告")
    public Result<Map<String, Object>> getUserAchievementProgressReport(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        Map<String, Object> report = userAchievementService.getAchievementProgressReport(userId);
        return Result.success(report);
    }

    // ==================== 数据导出 ====================

    @GetMapping("/my/export")
    @Operation(summary = "导出当前用户成就数据")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> exportMyAchievements(
            @Parameter(description = "导出格式: csv, json, pdf") @RequestParam(defaultValue = "csv") String format,
            Authentication authentication) {
        
        Long userId = getCurrentUserId(authentication);
        byte[] data = userAchievementService.exportUserAchievements(userId, format);
        
        String filename = "achievements_" + userId + "_" + System.currentTimeMillis();
        String contentType = switch (format.toLowerCase()) {
            case "json" -> "application/json";
            case "pdf" -> "application/pdf";
            default -> "text/csv";
        };
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + "." + format)
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }

    // ==================== 管理员功能 ====================

    @PostMapping("/batch-process")
    @Operation(summary = "批量处理成就检查")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> batchProcessAchievements() {
        userAchievementService.batchProcessAchievements();
        return Result.success();
    }

    @PostMapping("/cleanup")
    @Operation(summary = "清理过期成就数据")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> cleanupExpiredAchievements() {
        userAchievementService.cleanupExpiredAchievements();
        return Result.success();
    }

    /**
     * 获取当前用户ID
     */
    private Long getCurrentUserId(Authentication authentication) {
        // 这里需要根据实际的认证实现来获取用户ID
        // 假设用户名就是用户ID（实际项目中需要根据用户名查询用户ID）
        return Long.parseLong(authentication.getName());
    }
}