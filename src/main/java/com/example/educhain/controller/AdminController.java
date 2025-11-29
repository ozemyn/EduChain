package com.example.educhain.controller;

import com.example.educhain.config.LoggingAspect;
import com.example.educhain.dto.*;
import com.example.educhain.service.AdminService;
import com.example.educhain.util.JwtUtil;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** 管理员控制器 提供管理员专用的功能接口，包括用户管理、内容审核、系统配置等 所有接口都需要ADMIN角色权限，操作会记录到管理员日志中 */
@RestController
@RequestMapping("/admin")
@Tag(name = "管理员接口", description = "管理员功能相关接口")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  @Autowired private AdminService adminService;

  @Autowired private JwtUtil jwtUtil;

  // ========== 用户管理 ==========

  /**
   * 获取用户列表接口 管理员查询用户列表，支持关键词搜索和状态筛选
   *
   * @param keyword 搜索关键词（可选），支持用户名、邮箱等字段
   * @param status 用户状态筛选（可选），0=禁用，1=启用
   * @param page 页码，从0开始
   * @param size 每页大小
   * @return 用户列表（分页）
   */
  @GetMapping("/users")
  @Operation(summary = "获取用户列表", description = "分页获取用户列表，支持关键词搜索和状态筛选")
  @LoggingAspect.OperationLog(operation = "查询用户列表", description = "管理员查询用户列表")
  public ResponseEntity<Result<Page<UserDTO>>> getUsers(
      @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword,
      @Parameter(description = "用户状态") @RequestParam(required = false) Integer status,
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<UserDTO> users = adminService.getAllUsers(keyword, status, pageable);
    return ResponseEntity.ok(Result.success(users));
  }

  /**
   * 禁用用户接口 管理员禁用指定用户账户，需要提供禁用原因
   *
   * @param userId 要禁用的用户ID
   * @param reason 禁用原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 禁用成功响应
   */
  @PutMapping("/users/{userId}/disable")
  @Operation(summary = "禁用用户", description = "禁用指定用户账户")
  @LoggingAspect.OperationLog(operation = "禁用用户", description = "管理员禁用用户账户")
  public ResponseEntity<Result<Void>> disableUser(
      @Parameter(description = "用户ID") @PathVariable Long userId,
      @Parameter(description = "禁用原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token); // 需要实现获取用户ID的方法
    String ipAddress = getClientIpAddress(request);

    adminService.disableUser(adminId, adminUsername, userId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 启用用户接口 管理员启用指定用户账户，需要提供启用原因
   *
   * @param userId 要启用的用户ID
   * @param reason 启用原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 启用成功响应
   */
  @PutMapping("/users/{userId}/enable")
  @Operation(summary = "启用用户", description = "启用指定用户账户")
  @LoggingAspect.OperationLog(operation = "启用用户", description = "管理员启用用户账户")
  public ResponseEntity<Result<Void>> enableUser(
      @Parameter(description = "用户ID") @PathVariable Long userId,
      @Parameter(description = "启用原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.enableUser(adminId, adminUsername, userId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 重置用户密码接口（管理员权限） 管理员重置指定用户的登录密码，需要提供新密码
   *
   * @param userId 要重置密码的用户ID
   * @param newPassword 新密码
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 重置成功响应
   */
  @PutMapping("/users/{userId}/reset-password")
  @Operation(summary = "重置用户密码", description = "重置指定用户的密码")
  @LoggingAspect.OperationLog(operation = "重置用户密码", description = "管理员重置用户密码")
  public ResponseEntity<Result<Void>> resetUserPassword(
      @Parameter(description = "用户ID") @PathVariable Long userId,
      @Parameter(description = "新密码") @RequestParam String newPassword,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.resetUserPassword(adminId, adminUsername, userId, newPassword, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 删除用户接口（管理员权限） 管理员软删除指定用户账户，需要提供删除原因
   *
   * @param userId 要删除的用户ID
   * @param reason 删除原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 删除成功响应
   */
  @DeleteMapping("/users/{userId}")
  @Operation(summary = "删除用户", description = "软删除指定用户")
  @LoggingAspect.OperationLog(operation = "删除用户", description = "管理员删除用户")
  public ResponseEntity<Result<Void>> deleteUser(
      @Parameter(description = "用户ID") @PathVariable Long userId,
      @Parameter(description = "删除原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.deleteUser(adminId, adminUsername, userId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  // ========== 内容管理 ==========

  /**
   * 获取待审核内容接口（管理员权限） 分页获取系统中所有待审核的知识内容列表
   *
   * @param page 页码，从0开始
   * @param size 每页大小
   * @return 待审核的知识内容列表（分页）
   */
  @GetMapping("/knowledge-items/pending")
  @Operation(summary = "获取待审核内容", description = "分页获取待审核的知识内容")
  @LoggingAspect.OperationLog(operation = "查询待审核内容", description = "管理员查询待审核内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> getPendingKnowledgeItems(
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<KnowledgeItemDTO> items = adminService.getPendingKnowledgeItems(pageable);
    return ResponseEntity.ok(Result.success(items));
  }

  /**
   * 审核通过内容接口（管理员权限） 管理员审核通过指定的知识内容，使其在平台上可见
   *
   * @param knowledgeId 要审核通过的知识内容ID
   * @param reason 审核意见，可选
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 审核成功响应
   */
  @PutMapping("/knowledge-items/{knowledgeId}/approve")
  @Operation(summary = "审核通过内容", description = "审核通过指定的知识内容")
  @LoggingAspect.OperationLog(operation = "审核通过内容", description = "管理员审核通过知识内容")
  public ResponseEntity<Result<Void>> approveKnowledgeItem(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "审核意见") @RequestParam(required = false) String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.approveKnowledgeItem(adminId, adminUsername, knowledgeId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 审核拒绝内容接口（管理员权限） 管理员审核拒绝指定的知识内容，需要提供拒绝原因
   *
   * @param knowledgeId 要拒绝的知识内容ID
   * @param reason 拒绝原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 拒绝成功响应
   */
  @PutMapping("/knowledge-items/{knowledgeId}/reject")
  @Operation(summary = "审核拒绝内容", description = "审核拒绝指定的知识内容")
  @LoggingAspect.OperationLog(operation = "审核拒绝内容", description = "管理员审核拒绝知识内容")
  public ResponseEntity<Result<Void>> rejectKnowledgeItem(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "拒绝原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.rejectKnowledgeItem(adminId, adminUsername, knowledgeId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 删除知识内容接口（管理员权限） 管理员删除指定的知识内容，需要提供删除原因
   *
   * @param knowledgeId 要删除的知识内容ID
   * @param reason 删除原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 删除成功响应
   */
  @DeleteMapping("/knowledge-items/{knowledgeId}")
  @Operation(summary = "删除知识内容", description = "删除指定的知识内容")
  @LoggingAspect.OperationLog(operation = "删除知识内容", description = "管理员删除知识内容")
  public ResponseEntity<Result<Void>> deleteKnowledgeItem(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "删除原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.deleteKnowledgeItem(adminId, adminUsername, knowledgeId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 批量删除知识内容接口（管理员权限） 管理员批量删除多个知识内容，需要提供删除原因
   *
   * @param knowledgeIds 要删除的知识内容ID列表
   * @param reason 删除原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 删除成功响应
   */
  @DeleteMapping("/knowledge-items/batch")
  @Operation(summary = "批量删除知识内容", description = "批量删除指定的知识内容")
  @LoggingAspect.OperationLog(operation = "批量删除知识内容", description = "管理员批量删除知识内容")
  public ResponseEntity<Result<Void>> batchDeleteKnowledgeItems(
      @Parameter(description = "知识内容ID列表") @RequestBody List<Long> knowledgeIds,
      @Parameter(description = "删除原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.batchDeleteKnowledgeItems(adminId, adminUsername, knowledgeIds, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  // ========== 评论管理 ==========

  /**
   * 获取待审核评论接口（管理员权限） 分页获取系统中所有待审核的评论列表
   *
   * @param page 页码，从0开始
   * @param size 每页大小
   * @return 待审核的评论列表（分页）
   */
  @GetMapping("/comments/pending")
  @Operation(summary = "获取待审核评论", description = "分页获取待审核的评论")
  @LoggingAspect.OperationLog(operation = "查询待审核评论", description = "管理员查询待审核评论")
  public ResponseEntity<Result<Page<CommentDTO>>> getPendingComments(
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<CommentDTO> comments = adminService.getPendingComments(pageable);
    return ResponseEntity.ok(Result.success(comments));
  }

  /**
   * 审核通过评论接口（管理员权限） 管理员审核通过指定的评论，使其在平台上可见
   *
   * @param commentId 要审核通过的评论ID
   * @param reason 审核意见，可选
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 审核成功响应
   */
  @PutMapping("/comments/{commentId}/approve")
  @Operation(summary = "审核通过评论", description = "审核通过指定的评论")
  @LoggingAspect.OperationLog(operation = "审核通过评论", description = "管理员审核通过评论")
  public ResponseEntity<Result<Void>> approveComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId,
      @Parameter(description = "审核意见") @RequestParam(required = false) String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.approveComment(adminId, adminUsername, commentId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 审核拒绝评论接口（管理员权限） 管理员审核拒绝指定的评论，需要提供拒绝原因
   *
   * @param commentId 要拒绝的评论ID
   * @param reason 拒绝原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 拒绝成功响应
   */
  @PutMapping("/comments/{commentId}/reject")
  @Operation(summary = "审核拒绝评论", description = "审核拒绝指定的评论")
  @LoggingAspect.OperationLog(operation = "审核拒绝评论", description = "管理员审核拒绝评论")
  public ResponseEntity<Result<Void>> rejectComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId,
      @Parameter(description = "拒绝原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.rejectComment(adminId, adminUsername, commentId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 删除评论接口（管理员权限） 管理员删除指定的评论，需要提供删除原因
   *
   * @param commentId 要删除的评论ID
   * @param reason 删除原因
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 删除成功响应
   */
  @DeleteMapping("/comments/{commentId}")
  @Operation(summary = "删除评论", description = "删除指定的评论")
  @LoggingAspect.OperationLog(operation = "删除评论", description = "管理员删除评论")
  public ResponseEntity<Result<Void>> deleteComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId,
      @Parameter(description = "删除原因") @RequestParam String reason,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.deleteComment(adminId, adminUsername, commentId, reason, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  // ========== 系统监控 ==========

  /**
   * 获取系统统计接口（管理员权限） 返回系统整体的统计数据，包括用户数、内容数、评论数、访问量等
   *
   * @return 系统统计数据
   */
  @GetMapping("/statistics/system")
  @Operation(summary = "获取系统统计", description = "获取系统整体统计信息")
  @LoggingAspect.OperationLog(operation = "查询系统统计", description = "管理员查询系统统计信息")
  public ResponseEntity<Result<Map<String, Object>>> getSystemStatistics() {
    Map<String, Object> statistics = adminService.getSystemStatistics();
    return ResponseEntity.ok(Result.success(statistics));
  }

  /**
   * 获取用户统计接口（管理员权限） 返回指定时间范围内的用户统计数据，包括新增用户、活跃用户等
   *
   * @param startTime 统计开始时间
   * @param endTime 统计结束时间
   * @return 用户统计数据
   */
  @GetMapping("/statistics/users")
  @Operation(summary = "获取用户统计", description = "获取指定时间范围内的用户统计信息")
  @LoggingAspect.OperationLog(operation = "查询用户统计", description = "管理员查询用户统计信息")
  public ResponseEntity<Result<Map<String, Object>>> getUserStatistics(
      @Parameter(description = "开始时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime startTime,
      @Parameter(description = "结束时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime endTime) {

    Map<String, Object> statistics = adminService.getUserStatistics(startTime, endTime);
    return ResponseEntity.ok(Result.success(statistics));
  }

  /**
   * 获取内容统计接口（管理员权限） 返回指定时间范围内的内容统计数据，包括新增内容、审核通过数等
   *
   * @param startTime 统计开始时间
   * @param endTime 统计结束时间
   * @return 内容统计数据
   */
  @GetMapping("/statistics/content")
  @Operation(summary = "获取内容统计", description = "获取指定时间范围内的内容统计信息")
  @LoggingAspect.OperationLog(operation = "查询内容统计", description = "管理员查询内容统计信息")
  public ResponseEntity<Result<Map<String, Object>>> getContentStatistics(
      @Parameter(description = "开始时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime startTime,
      @Parameter(description = "结束时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime endTime) {

    Map<String, Object> statistics = adminService.getContentStatistics(startTime, endTime);
    return ResponseEntity.ok(Result.success(statistics));
  }

  /**
   * 获取性能指标接口（管理员权限） 返回系统性能监控指标，包括响应时间、吞吐量、错误率等
   *
   * @return 性能指标数据
   */
  @GetMapping("/monitoring/performance")
  @Operation(summary = "获取性能指标", description = "获取系统性能监控指标")
  @LoggingAspect.OperationLog(operation = "查询性能指标", description = "管理员查询系统性能指标")
  public ResponseEntity<Result<Map<String, Object>>> getPerformanceMetrics() {
    Map<String, Object> metrics = adminService.getPerformanceMetrics();
    return ResponseEntity.ok(Result.success(metrics));
  }

  /**
   * 获取系统健康状态接口（管理员权限） 返回系统健康检查结果，包括数据库连接、缓存状态、服务可用性等
   *
   * @return 系统健康状态数据
   */
  @GetMapping("/monitoring/health")
  @Operation(summary = "获取系统健康状态", description = "获取系统健康检查结果")
  @LoggingAspect.OperationLog(operation = "查询系统健康状态", description = "管理员查询系统健康状态")
  public ResponseEntity<Result<Map<String, Object>>> getSystemHealth() {
    Map<String, Object> health = adminService.getSystemHealth();
    return ResponseEntity.ok(Result.success(health));
  }

  // ========== 系统维护 ==========

  /**
   * 清理过期数据接口（管理员权限） 清理指定天数之前的过期数据，如日志、临时文件等
   *
   * @param daysToKeep 保留天数，默认30天
   * @return 清理成功响应
   */
  @PostMapping("/maintenance/cleanup")
  @Operation(summary = "清理过期数据", description = "清理指定天数之前的过期数据")
  @LoggingAspect.OperationLog(operation = "清理过期数据", description = "管理员清理过期数据")
  public ResponseEntity<Result<Void>> cleanupExpiredData(
      @Parameter(description = "保留天数") @RequestParam(defaultValue = "30") int daysToKeep) {

    adminService.cleanupExpiredData(daysToKeep);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 重建搜索索引接口（管理员权限） 重建系统的全文搜索索引，用于优化搜索性能
   *
   * @return 重建成功响应
   */
  @PostMapping("/maintenance/rebuild-index")
  @Operation(summary = "重建搜索索引", description = "重建系统搜索索引")
  @LoggingAspect.OperationLog(operation = "重建搜索索引", description = "管理员重建搜索索引")
  public ResponseEntity<Result<Void>> rebuildSearchIndex() {
    adminService.rebuildSearchIndex();
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 系统备份接口（管理员权限） 执行系统数据备份操作，备份数据库和重要文件
   *
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 备份成功响应
   */
  @PostMapping("/maintenance/backup")
  @Operation(summary = "系统备份", description = "执行系统数据备份")
  @LoggingAspect.OperationLog(operation = "系统备份", description = "管理员执行系统备份")
  public ResponseEntity<Result<Void>> backupSystem(HttpServletRequest request) {
    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.backupSystem(adminId, adminUsername, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  /**
   * 发送系统通知接口（管理员权限） 管理员向指定用户列表发送系统通知消息
   *
   * @param title 通知标题
   * @param content 通知内容
   * @param targetUserIds 目标用户ID列表
   * @param request HTTP请求对象，用于获取管理员信息和IP地址
   * @return 发送成功响应
   */
  @PostMapping("/notifications/system")
  @Operation(summary = "发送系统通知", description = "向指定用户发送系统通知")
  @LoggingAspect.OperationLog(operation = "发送系统通知", description = "管理员发送系统通知")
  public ResponseEntity<Result<Void>> sendSystemNotification(
      @Parameter(description = "通知标题") @RequestParam String title,
      @Parameter(description = "通知内容") @RequestParam String content,
      @Parameter(description = "目标用户ID列表") @RequestBody List<Long> targetUserIds,
      HttpServletRequest request) {

    String token = extractToken(request);
    String adminUsername = jwtUtil.getUsernameFromToken(token);
    Long adminId = getUserIdFromToken(token);
    String ipAddress = getClientIpAddress(request);

    adminService.sendSystemNotification(
        adminId, adminUsername, title, content, targetUserIds, ipAddress);
    return ResponseEntity.ok(Result.success());
  }

  // ========== 数据导出 ==========

  /**
   * 导出用户数据接口（管理员权限） 导出符合条件的用户数据，支持关键词搜索和状态筛选
   *
   * @param keyword 搜索关键词，可选
   * @param status 用户状态筛选，可选
   * @return 用户数据列表
   */
  @GetMapping("/export/users")
  @Operation(summary = "导出用户数据", description = "导出用户数据到Excel")
  @LoggingAspect.OperationLog(operation = "导出用户数据", description = "管理员导出用户数据")
  public ResponseEntity<Result<List<UserDTO>>> exportUsers(
      @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword,
      @Parameter(description = "用户状态") @RequestParam(required = false) Integer status) {

    List<UserDTO> users = adminService.exportUsers(keyword, status);
    return ResponseEntity.ok(Result.success(users));
  }

  /**
   * 导出知识内容数据接口（管理员权限） 导出指定时间范围内的知识内容数据
   *
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @return 知识内容数据列表
   */
  @GetMapping("/export/knowledge-items")
  @Operation(summary = "导出知识内容数据", description = "导出指定时间范围内的知识内容数据")
  @LoggingAspect.OperationLog(operation = "导出知识内容数据", description = "管理员导出知识内容数据")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> exportKnowledgeItems(
      @Parameter(description = "开始时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime startTime,
      @Parameter(description = "结束时间")
          @RequestParam
          @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
          LocalDateTime endTime) {

    List<KnowledgeItemDTO> items = adminService.exportKnowledgeItems(startTime, endTime);
    return ResponseEntity.ok(Result.success(items));
  }

  // ========== 辅助方法 ==========

  private String extractToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }

  private Long getUserIdFromToken(String token) {
    // 这里需要实现从JWT令牌中获取用户ID的逻辑
    // 暂时返回null，实际应该从JWT中解析用户ID
    return null;
  }

  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null
        && !xForwardedFor.isEmpty()
        && !"unknown".equalsIgnoreCase(xForwardedFor)) {
      return xForwardedFor.split(",")[0].trim();
    }

    String xRealIp = request.getHeader("X-Real-IP");
    if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
      return xRealIp;
    }

    return request.getRemoteAddr();
  }
}
