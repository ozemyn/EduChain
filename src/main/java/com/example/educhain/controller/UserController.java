package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.UserService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/** 用户控制器 提供用户信息查询、更新、密码修改、用户搜索等用户管理相关的API接口 所有接口都需要用户认证 */
@RestController
@RequestMapping("/users")
@Tag(name = "用户管理", description = "用户信息管理相关接口")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired private UserService userService;

  /**
   * 获取当前登录用户信息接口 返回当前认证用户的详细信息，包括基本信息、角色、状态等
   *
   * @return 当前用户的详细信息
   */
  @GetMapping("/me")
  @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的详细信息")
  public ResponseEntity<Result<UserDTO>> getCurrentUser() {
    try {
      Long userId = getCurrentUserId();
      UserDTO user = userService.getUserById(userId);
      return ResponseEntity.ok(Result.success("获取成功", user));
    } catch (Exception e) {
      Long userId = null;
      try {
        userId = getCurrentUserId();
      } catch (Exception ignored) {
        // 忽略获取用户ID的异常
      }
      logger.error("获取当前用户信息失败: userId={}, error={}", userId, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * 更新当前用户信息接口 更新当前登录用户的个人信息，如姓名、头像、学校、简介等
   *
   * @param request 更新请求，包含要更新的字段
   * @return 更新后的用户信息
   */
  @PutMapping("/me")
  @Operation(summary = "更新用户信息", description = "更新当前登录用户的个人信息")
  public ResponseEntity<Result<UserDTO>> updateProfile(
      @Valid @RequestBody UpdateProfileRequest request) {
    Long userId = getCurrentUserId();
    UserDTO user = userService.updateProfile(userId, request);
    return ResponseEntity.ok(Result.success("更新成功", user));
  }

  /**
   * 修改密码接口 修改当前用户的登录密码，需要验证当前密码和新密码强度
   *
   * @param request 修改密码请求，包含当前密码、新密码和确认密码
   * @return 修改成功响应
   */
  @PutMapping("/me/password")
  @Operation(summary = "修改密码", description = "修改当前用户的登录密码")
  public ResponseEntity<Result<Void>> changePassword(
      @Valid @RequestBody ChangePasswordRequest request) {
    Long userId = getCurrentUserId();
    userService.changePassword(userId, request);
    return ResponseEntity.ok(Result.success("密码修改成功", null));
  }

  /**
   * 获取当前用户统计信息接口 返回当前用户的统计数据，如点赞数、收藏数、发布数等
   *
   * @return 用户统计信息
   */
  @GetMapping("/me/stats")
  @Operation(summary = "获取用户统计", description = "获取当前用户的统计信息")
  public ResponseEntity<Result<UserStatsDTO>> getCurrentUserStats() {
    Long userId = getCurrentUserId();
    UserStatsDTO stats = userService.getUserStats(userId);
    return ResponseEntity.ok(Result.success("获取成功", stats));
  }

  /** 根据ID获取用户信息 */
  @GetMapping("/{userId}")
  @Operation(summary = "获取用户信息", description = "根据用户ID获取用户信息")
  public ResponseEntity<Result<UserDTO>> getUserById(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    UserDTO user = userService.getUserById(userId);
    return ResponseEntity.ok(Result.success("获取成功", user));
  }

  /** 根据用户名获取用户信息 */
  @GetMapping("/username/{username}")
  @Operation(summary = "根据用户名获取用户", description = "根据用户名获取用户信息")
  public ResponseEntity<Result<UserDTO>> getUserByUsername(
      @Parameter(description = "用户名") @PathVariable String username) {
    UserDTO user = userService.getUserByUsername(username);
    return ResponseEntity.ok(Result.success("获取成功", user));
  }

  /** 获取用户统计信息 */
  @GetMapping("/{userId}/stats")
  @Operation(summary = "获取指定用户统计", description = "获取指定用户的统计信息")
  public ResponseEntity<Result<UserStatsDTO>> getUserStats(
      @Parameter(description = "用户ID") @PathVariable Long userId) {
    UserStatsDTO stats = userService.getUserStats(userId);
    return ResponseEntity.ok(Result.success("获取成功", stats));
  }

  /** 搜索用户 */
  @GetMapping("/search")
  @Operation(summary = "搜索用户", description = "根据关键词搜索用户")
  public ResponseEntity<Result<Page<UserDTO>>> searchUsers(
      @Parameter(description = "搜索关键词") @RequestParam String keyword,
      @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
      @Parameter(description = "排序字段") @RequestParam(defaultValue = "createdAt") String sortBy,
      @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<UserDTO> users = userService.searchUsers(keyword, pageable);
    return ResponseEntity.ok(Result.success("搜索成功", users));
  }

  /** 获取所有用户（管理员权限） */
  @GetMapping
  @Operation(summary = "获取所有用户", description = "分页获取所有用户信息（管理员权限）")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Page<UserDTO>>> getAllUsers(
      @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
      @Parameter(description = "排序字段") @RequestParam(defaultValue = "createdAt") String sortBy,
      @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<UserDTO> users = userService.getAllUsers(pageable);
    return ResponseEntity.ok(Result.success("获取成功", users));
  }

  /** 根据角色获取用户（管理员权限） */
  @GetMapping("/role/{role}")
  @Operation(summary = "根据角色获取用户", description = "根据用户角色分页获取用户（管理员权限）")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Page<UserDTO>>> getUsersByRole(
      @Parameter(description = "用户角色") @PathVariable String role,
      @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
      @Parameter(description = "排序字段") @RequestParam(defaultValue = "createdAt") String sortBy,
      @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<UserDTO> users = userService.getUsersByRole(role, pageable);
    return ResponseEntity.ok(Result.success("获取成功", users));
  }

  /** 更新用户状态（管理员权限） */
  @PutMapping("/{userId}/status")
  @Operation(summary = "更新用户状态", description = "启用或禁用用户账户（管理员权限）")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> updateUserStatus(
      @Parameter(description = "用户ID") @PathVariable Long userId,
      @RequestBody UpdateUserStatusRequest request) {

    userService.updateUserStatus(userId, request.getStatus());
    String message = request.getStatus() == 1 ? "用户已启用" : "用户已禁用";
    return ResponseEntity.ok(Result.success(message, null));
  }

  /** 获取当前用户ID的辅助方法 */
  private Long getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    logger.debug(
        "当前认证信息: {}", authentication != null ? authentication.getClass().getSimpleName() : "null");
    logger.debug(
        "认证主体: {}",
        authentication != null ? authentication.getPrincipal().getClass().getSimpleName() : "null");

    if (authentication != null
        && authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
      CustomUserDetailsService.CustomUserPrincipal userPrincipal =
          (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
      logger.debug("获取到用户ID: {}", userPrincipal.getId());
      return userPrincipal.getId();
    }
    logger.error("无法获取当前用户信息 - 认证失败");
    throw new RuntimeException("无法获取当前用户信息");
  }

  /** 更新用户状态请求DTO */
  public static class UpdateUserStatusRequest {
    private Integer status;

    public Integer getStatus() {
      return status;
    }

    public void setStatus(Integer status) {
      this.status = status;
    }
  }
}
