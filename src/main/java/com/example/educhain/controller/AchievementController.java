package com.example.educhain.controller;

import com.example.educhain.dto.AchievementSummaryDTO;
import com.example.educhain.dto.UserAchievementDTO;
import com.example.educhain.entity.UserAchievement;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.UserAchievementService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

/** 成就管理控制器 */
@RestController
@RequestMapping("/achievements")
@Tag(name = "成就管理", description = "用户成就系统相关接口")
public class AchievementController {

  private static final Logger logger = LoggerFactory.getLogger(AchievementController.class);

  @Autowired private UserAchievementService userAchievementService;

  // ==================== 用户成就管理 ====================

  /**
   * 初始化用户成就系统接口 为当前登录用户初始化所有可用的成就记录，包括各种成就类型的初始状态
   *
   * @param authentication 当前用户的认证信息
   * @return 初始化成功响应
   */
  @PostMapping("/initialize")
  @Operation(summary = "初始化用户成就系统")
  @PreAuthorize("isAuthenticated()")
  public Result<Void> initializeUserAchievements(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    userAchievementService.initializeUserAchievements(userId);
    return Result.success();
  }

  /**
   * 获取当前用户成就概览接口 返回当前登录用户的成就汇总信息，包括总成就数、已完成数、总积分、用户等级等
   *
   * @param authentication 当前用户的认证信息
   * @return 成就概览信息，包含统计数据和汇总信息
   */
  @GetMapping("/summary")
  @Operation(summary = "获取当前用户成就概览")
  @PreAuthorize("isAuthenticated()")
  public Result<AchievementSummaryDTO> getUserAchievementSummary(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    AchievementSummaryDTO summary = userAchievementService.getUserAchievementSummary(userId);
    return Result.success(summary);
  }

  /**
   * 获取指定用户成就概览接口 根据用户ID获取指定用户的成就汇总信息，包括总成就数、已完成数、总积分、用户等级等
   *
   * @param userId 目标用户的ID
   * @return 成就概览信息，包含统计数据和汇总信息
   */
  @GetMapping("/summary/{userId}")
  @Operation(summary = "获取指定用户成就概览")
  public Result<AchievementSummaryDTO> getUserAchievementSummary(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    AchievementSummaryDTO summary = userAchievementService.getUserAchievementSummary(userId);
    return Result.success(summary);
  }

  /**
   * 获取当前用户所有成就接口 返回当前登录用户的所有成就记录，包括已完成和未完成的成就
   *
   * @param authentication 当前用户的认证信息
   * @return 用户的所有成就列表
   */
  @GetMapping("/my")
  @Operation(summary = "获取当前用户所有成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyAchievements(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements = userAchievementService.getUserAchievements(userId);
    return Result.success(achievements);
  }

  /**
   * 获取指定用户所有成就接口 根据用户ID获取指定用户的所有成就记录，包括已完成和未完成的成就
   *
   * @param userId 目标用户的ID
   * @return 用户的所有成就列表
   */
  @GetMapping("/user/{userId}")
  @Operation(summary = "获取指定用户所有成就")
  public Result<List<UserAchievementDTO>> getUserAchievements(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    List<UserAchievementDTO> achievements = userAchievementService.getUserAchievements(userId);
    return Result.success(achievements);
  }

  /**
   * 获取当前用户已完成的成就接口 返回当前登录用户所有已完成的成就记录，包括成就详情、完成时间、奖励积分等
   *
   * @param authentication 当前用户的认证信息
   * @return 已完成的成就列表
   */
  @GetMapping("/my/completed")
  @Operation(summary = "获取当前用户已完成的成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyCompletedAchievements(
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements =
        userAchievementService.getUserCompletedAchievements(userId);
    return Result.success(achievements);
  }

  /**
   * 获取当前用户未完成的成就接口 返回当前登录用户所有未完成的成就记录，包括当前进度、完成条件、剩余任务等
   *
   * @param authentication 当前用户的认证信息
   * @return 未完成的成就列表
   */
  @GetMapping("/my/pending")
  @Operation(summary = "获取当前用户未完成的成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyPendingAchievements(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements =
        userAchievementService.getUserPendingAchievements(userId);
    return Result.success(achievements);
  }

  /**
   * 获取当前用户最近获得的成就接口 返回当前登录用户最近获得的成就记录，按获得时间倒序排列
   *
   * @param limit 返回的成就数量限制，默认为10
   * @param authentication 当前用户的认证信息
   * @return 最近获得的成就列表
   */
  @GetMapping("/my/recent")
  @Operation(summary = "获取当前用户最近获得的成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyRecentAchievements(
      @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit,
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements =
        userAchievementService.getUserRecentAchievements(userId, limit);
    return Result.success(achievements);
  }

  /**
   * 获取当前用户接近完成的成就接口 返回当前登录用户接近完成但尚未完成的成就，帮助用户了解即将可以获得的成就
   *
   * @param authentication 当前用户的认证信息
   * @return 接近完成的成就列表
   */
  @GetMapping("/my/near-completion")
  @Operation(summary = "获取当前用户接近完成的成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyNearCompletionAchievements(
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements =
        userAchievementService.getUserNearCompletionAchievements(userId);
    return Result.success(achievements);
  }

  /**
   * 获取当前用户可升级的成就接口 返回当前登录用户可以升级的成就列表，这些成就已达到升级条件但尚未升级
   *
   * @param authentication 当前用户的认证信息
   * @return 可升级的成就列表
   */
  @GetMapping("/my/upgradable")
  @Operation(summary = "获取当前用户可升级的成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> getMyUpgradableAchievements(
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> achievements =
        userAchievementService.getUserUpgradableAchievements(userId);
    return Result.success(achievements);
  }

  // ==================== 成就操作 ====================

  /**
   * 检查并更新当前用户成就接口 检查当前登录用户的成就进度，自动更新符合条件的成就状态，并返回新获得的成就列表
   *
   * @param authentication 当前用户的认证信息
   * @return 新获得的成就列表
   */
  @PostMapping("/check")
  @Operation(summary = "检查并更新当前用户成就")
  @PreAuthorize("isAuthenticated()")
  public Result<List<UserAchievementDTO>> checkAndUpdateAchievements(
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    List<UserAchievementDTO> newAchievements =
        userAchievementService.checkAndUpdateAchievements(userId);
    return Result.success(newAchievements);
  }

  /**
   * 手动触发成就检查接口 手动触发指定事件的成就检查，用于测试或特殊场景下的成就更新
   *
   * @param eventType 事件类型，如"CREATE_KNOWLEDGE"、"LIKE"、"COMMENT"等
   * @param eventData 事件相关的数据，可选参数
   * @param authentication 当前用户的认证信息
   * @return 操作成功响应
   */
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

  /**
   * 升级成就接口 将指定类型的成就升级到下一级别，如果满足升级条件则执行升级操作
   *
   * @param achievementType 要升级的成就类型
   * @param authentication 当前用户的认证信息
   * @return 升级后的成就信息
   */
  @PostMapping("/level-up")
  @Operation(summary = "升级成就")
  @PreAuthorize("isAuthenticated()")
  public Result<UserAchievementDTO> levelUpAchievement(
      @Parameter(description = "成就类型") @RequestParam
          UserAchievement.AchievementType achievementType,
      Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    UserAchievementDTO achievement =
        userAchievementService.levelUpAchievement(userId, achievementType);
    return Result.success(achievement);
  }

  /**
   * 重置用户成就接口（管理员权限） 管理员可以将指定用户的指定成就重置为初始状态，清除所有进度和完成记录
   *
   * @param userId 要重置成就的用户ID
   * @param achievementType 要重置的成就类型
   * @return 操作成功响应
   */
  @PostMapping("/reset")
  @Operation(summary = "重置成就")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> resetAchievement(
      @Parameter(description = "用户ID") @RequestParam Long userId,
      @Parameter(description = "成就类型") @RequestParam
          UserAchievement.AchievementType achievementType) {
    userAchievementService.resetAchievement(userId, achievementType);
    return Result.success();
  }

  /**
   * 创建自定义成就接口（管理员权限） 管理员可以为指定用户创建自定义成就，用于特殊奖励或活动
   *
   * @param userId 要授予成就的用户ID
   * @param name 成就名称
   * @param description 成就描述
   * @param points 奖励的积分数量
   * @return 创建的自定义成就信息
   */
  @PostMapping("/custom")
  @Operation(summary = "创建自定义成就")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<UserAchievementDTO> createCustomAchievement(
      @Parameter(description = "用户ID") @RequestParam Long userId,
      @Parameter(description = "成就名称") @RequestParam String name,
      @Parameter(description = "成就描述") @RequestParam String description,
      @Parameter(description = "奖励积分") @RequestParam Integer points) {
    UserAchievementDTO achievement =
        userAchievementService.createCustomAchievement(userId, name, description, points);
    return Result.success(achievement);
  }

  /**
   * 删除用户成就接口（管理员权限） 管理员可以删除指定用户的指定成就记录
   *
   * @param userId 要删除成就的用户ID
   * @param achievementType 要删除的成就类型
   * @return 操作成功响应
   */
  @DeleteMapping("/delete")
  @Operation(summary = "删除用户成就")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> deleteUserAchievement(
      @Parameter(description = "用户ID") @RequestParam Long userId,
      @Parameter(description = "成就类型") @RequestParam
          UserAchievement.AchievementType achievementType) {
    userAchievementService.deleteUserAchievement(userId, achievementType);
    return Result.success();
  }

  // ==================== 排行榜和统计 ====================

  /**
   * 获取成就排行榜接口 返回全站用户的成就排行榜，按总积分或成就数量排序，支持分页查询
   *
   * @param pageable 分页参数，包含页码和每页大小
   * @return 成就排行榜数据，包含用户信息和排名
   */
  @GetMapping("/leaderboard")
  @Operation(summary = "获取成就排行榜")
  public Result<Page<Map<String, Object>>> getAchievementLeaderboard(
      @PageableDefault(size = 50) Pageable pageable) {
    Page<Map<String, Object>> leaderboard =
        userAchievementService.getAchievementLeaderboard(pageable);
    return Result.success(leaderboard);
  }

  /**
   * 获取特定类型成就排行榜接口 返回指定成就类型的排行榜，按该类型成就的完成情况或等级排序
   *
   * @param achievementType 成就类型
   * @param pageable 分页参数，包含页码和每页大小
   * @return 特定类型成就的排行榜数据
   */
  @GetMapping("/leaderboard/{achievementType}")
  @Operation(summary = "获取特定类型成就排行榜")
  public Result<Page<Map<String, Object>>> getAchievementTypeLeaderboard(
      @Parameter(description = "成就类型") @PathVariable
          UserAchievement.AchievementType achievementType,
      @PageableDefault(size = 50) Pageable pageable) {
    Page<Map<String, Object>> leaderboard =
        userAchievementService.getAchievementTypeLeaderboard(achievementType, pageable);
    return Result.success(leaderboard);
  }

  /**
   * 获取成就统计信息接口（管理员权限） 返回系统的成就统计数据，包括各类型成就的完成率、用户分布、积分统计等
   *
   * @return 成就统计数据
   */
  @GetMapping("/statistics")
  @Operation(summary = "获取成就统计信息")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Map<String, Object>> getAchievementStatistics() {
    Map<String, Object> statistics = userAchievementService.getAchievementStatistics();
    return Result.success(statistics);
  }

  /**
   * 获取最受欢迎的成就接口 返回完成人数最多的成就列表，用于展示热门成就
   *
   * @param limit 返回的成就数量限制，默认为10
   * @return 最受欢迎的成就列表
   */
  @GetMapping("/popular")
  @Operation(summary = "获取最受欢迎的成就")
  public Result<List<Map<String, Object>>> getMostPopularAchievements(
      @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
    List<Map<String, Object>> popular = userAchievementService.getMostPopularAchievements(limit);
    return Result.success(popular);
  }

  /**
   * 获取最稀有的成就接口 返回完成人数最少的成就列表，用于展示稀有成就
   *
   * @param limit 返回的成就数量限制，默认为10
   * @return 最稀有的成就列表
   */
  @GetMapping("/rarest")
  @Operation(summary = "获取最稀有的成就")
  public Result<List<Map<String, Object>>> getRarestAchievements(
      @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
    List<Map<String, Object>> rarest = userAchievementService.getRarestAchievements(limit);
    return Result.success(rarest);
  }

  // ==================== 用户等级和积分 ====================

  /**
   * 获取当前用户等级接口 返回当前登录用户的等级，等级根据总积分计算
   *
   * @param authentication 当前用户的认证信息
   * @return 用户等级（整数）
   */
  @GetMapping("/my/level")
  @Operation(summary = "获取当前用户等级")
  @PreAuthorize("isAuthenticated()")
  public Result<Integer> getMyLevel(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    Integer level = userAchievementService.calculateUserLevel(userId);
    return Result.success(level);
  }

  /**
   * 获取当前用户总积分接口 返回当前登录用户通过完成成就获得的总积分
   *
   * @param authentication 当前用户的认证信息
   * @return 用户总积分
   */
  @GetMapping("/my/points")
  @Operation(summary = "获取当前用户总积分")
  @PreAuthorize("isAuthenticated()")
  public Result<Integer> getMyTotalPoints(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    Integer points = userAchievementService.getUserTotalPoints(userId);
    return Result.success(points);
  }

  /**
   * 获取指定用户等级接口 根据用户ID返回指定用户的等级，等级根据总积分计算
   *
   * @param userId 目标用户的ID
   * @return 用户等级（整数）
   */
  @GetMapping("/user/{userId}/level")
  @Operation(summary = "获取指定用户等级")
  public Result<Integer> getUserLevel(@Parameter(description = "用户ID") @PathVariable Long userId) {
    Integer level = userAchievementService.calculateUserLevel(userId);
    return Result.success(level);
  }

  /**
   * 获取指定用户总积分接口 根据用户ID返回指定用户通过完成成就获得的总积分
   *
   * @param userId 目标用户的ID
   * @return 用户总积分
   */
  @GetMapping("/user/{userId}/points")
  @Operation(summary = "获取指定用户总积分")
  public Result<Integer> getUserTotalPoints(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    Integer points = userAchievementService.getUserTotalPoints(userId);
    return Result.success(points);
  }

  // ==================== 进度报告 ====================

  /**
   * 获取当前用户成就进度报告接口 返回当前登录用户的详细成就进度报告，包括各类成就的完成情况、进度百分比等
   *
   * @param authentication 当前用户的认证信息
   * @return 成就进度报告数据
   */
  @GetMapping("/my/progress")
  @Operation(summary = "获取当前用户成就进度报告")
  @PreAuthorize("isAuthenticated()")
  public Result<Map<String, Object>> getMyAchievementProgressReport(Authentication authentication) {
    Long userId = getCurrentUserId(authentication);
    Map<String, Object> report = userAchievementService.getAchievementProgressReport(userId);
    return Result.success(report);
  }

  /**
   * 获取指定用户成就进度报告接口 根据用户ID返回指定用户的详细成就进度报告，包括各类成就的完成情况、进度百分比等
   *
   * @param userId 目标用户的ID
   * @return 成就进度报告数据
   */
  @GetMapping("/user/{userId}/progress")
  @Operation(summary = "获取指定用户成就进度报告")
  public Result<Map<String, Object>> getUserAchievementProgressReport(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    Map<String, Object> report = userAchievementService.getAchievementProgressReport(userId);
    return Result.success(report);
  }

  // ==================== 数据导出 ====================

  /**
   * 导出当前用户成就数据接口 将当前登录用户的成就数据导出为指定格式的文件，支持CSV、JSON、PDF格式
   *
   * @param format 导出格式，可选值：csv、json、pdf，默认为csv
   * @param authentication 当前用户的认证信息
   * @return 文件下载响应，包含导出的文件数据
   */
  @GetMapping("/my/export")
  @Operation(summary = "导出当前用户成就数据")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<byte[]> exportMyAchievements(
      @Parameter(description = "导出格式: csv, json, pdf") @RequestParam(defaultValue = "csv")
          String format,
      Authentication authentication) {

    Long userId = getCurrentUserId(authentication);
    byte[] data = userAchievementService.exportUserAchievements(userId, format);

    String filename = "achievements_" + userId + "_" + System.currentTimeMillis();
    String contentType =
        switch (format.toLowerCase()) {
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

  /**
   * 批量处理成就检查接口（管理员权限） 批量检查所有用户的成就进度并更新状态，通常用于定时任务或手动触发
   *
   * @return 操作成功响应
   */
  @PostMapping("/batch-process")
  @Operation(summary = "批量处理成就检查")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> batchProcessAchievements() {
    userAchievementService.batchProcessAchievements();
    return Result.success();
  }

  /**
   * 清理过期成就数据接口（管理员权限） 清理系统中过期的成就数据，如临时成就、活动成就等
   *
   * @return 操作成功响应
   */
  @PostMapping("/cleanup")
  @Operation(summary = "清理过期成就数据")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> cleanupExpiredAchievements() {
    userAchievementService.cleanupExpiredAchievements();
    return Result.success();
  }

  /** 获取当前用户ID */
  private Long getCurrentUserId(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      logger.error("无法获取当前用户ID - 认证信息为空或未认证");
      throw new RuntimeException("无法获取当前用户信息 - 认证失败");
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
      CustomUserDetailsService.CustomUserPrincipal userPrincipal =
          (CustomUserDetailsService.CustomUserPrincipal) principal;
      logger.debug("获取到用户ID: {}", userPrincipal.getId());
      return userPrincipal.getId();
    }

    logger.error(
        "无法获取当前用户ID - 认证主体类型不正确: {}",
        principal != null ? principal.getClass().getSimpleName() : "null");
    throw new RuntimeException("无法获取当前用户信息 - 认证主体类型不正确");
  }
}
