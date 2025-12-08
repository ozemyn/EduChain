package com.example.educhain.controller;

import com.example.educhain.dto.UserDTO;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.UserFollowService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 用户关注控制器 提供用户关注、取消关注、获取关注列表、粉丝列表等功能 */
@RestController
@RequestMapping("/users")
@Tag(name = "用户关注管理", description = "用户关注相关接口")
public class UserFollowController {

  @Autowired private UserFollowService userFollowService;

  /**
   * 关注用户接口 当前用户关注指定用户
   *
   * @param request 关注请求，包含要关注的用户ID
   * @param principal 当前登录用户信息
   * @return 关注成功响应
   */
  @PostMapping("/follow")
  @Operation(summary = "关注用户", description = "当前用户关注指定用户")
  public ResponseEntity<Result<Map<String, Boolean>>> followUser(
      @Valid @RequestBody Map<String, Long> request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Long userId = request.get("userId");
    if (userId == null) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "用户ID不能为空"));
    }

    userFollowService.followUser(principal.getId(), userId);
    return ResponseEntity.ok(Result.success("关注成功", Map.of("success", true)));
  }

  /**
   * 取消关注接口 当前用户取消关注指定用户
   *
   * @param request 取消关注请求，包含要取消关注的用户ID
   * @param principal 当前登录用户信息
   * @return 取消关注成功响应
   */
  @DeleteMapping("/follow")
  @Operation(summary = "取消关注", description = "当前用户取消关注指定用户")
  public ResponseEntity<Result<Map<String, Boolean>>> unfollowUser(
      @Valid @RequestBody Map<String, Long> request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Long userId = request.get("userId");
    if (userId == null) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "用户ID不能为空"));
    }

    userFollowService.unfollowUser(principal.getId(), userId);
    return ResponseEntity.ok(Result.success("取消关注成功", Map.of("success", true)));
  }

  /**
   * 获取关注列表接口 获取指定用户的关注列表
   *
   * @param userId 用户ID，可选，默认为当前用户
   * @param pageable 分页参数
   * @return 关注列表（分页）
   */
  @GetMapping("/following")
  @Operation(summary = "获取关注列表", description = "获取用户的关注列表")
  public ResponseEntity<Result<Page<UserFollowService.FollowDTO>>> getFollowing(
      @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
      @PageableDefault(size = 20) Pageable pageable,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Long targetUserId = userId != null ? userId : principal.getId();
    Page<UserFollowService.FollowDTO> following =
        userFollowService.getFollowing(targetUserId, pageable);

    return ResponseEntity.ok(Result.success(following));
  }

  /**
   * 获取粉丝列表接口 获取指定用户的粉丝列表
   *
   * @param userId 用户ID，可选，默认为当前用户
   * @param pageable 分页参数
   * @return 粉丝列表（分页）
   */
  @GetMapping("/followers")
  @Operation(summary = "获取粉丝列表", description = "获取用户的粉丝列表")
  public ResponseEntity<Result<Page<UserFollowService.FollowDTO>>> getFollowers(
      @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
      @PageableDefault(size = 20) Pageable pageable,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Long targetUserId = userId != null ? userId : principal.getId();
    Page<UserFollowService.FollowDTO> followers =
        userFollowService.getFollowers(targetUserId, pageable);

    return ResponseEntity.ok(Result.success(followers));
  }

  /**
   * 检查关注状态接口 检查当前用户是否关注了指定用户
   *
   * @param id 要检查的用户ID
   * @param principal 当前登录用户信息
   * @return 关注状态
   */
  @GetMapping("/follow/status/{id}")
  @Operation(summary = "检查关注状态", description = "检查当前用户是否关注了指定用户")
  public ResponseEntity<Result<Map<String, Boolean>>> getFollowStatus(
      @Parameter(description = "用户ID") @PathVariable Long id,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    boolean isFollowing = userFollowService.isFollowing(principal.getId(), id);
    return ResponseEntity.ok(Result.success(Map.of("following", isFollowing)));
  }

  /**
   * 获取关注统计接口 获取指定用户的关注和粉丝统计信息
   *
   * @param userId 用户ID，可选，默认为当前用户
   * @param principal 当前登录用户信息
   * @return 关注统计信息
   */
  @GetMapping("/follow/stats")
  @Operation(summary = "获取关注统计", description = "获取用户的关注和粉丝统计信息")
  public ResponseEntity<Result<UserFollowService.FollowStatsDTO>> getFollowStats(
      @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Long targetUserId = userId != null ? userId : principal.getId();
    UserFollowService.FollowStatsDTO stats = userFollowService.getFollowStats(targetUserId);

    return ResponseEntity.ok(Result.success(stats));
  }

  /**
   * 获取互相关注列表接口 获取与当前用户互相关注的用户列表
   *
   * @param pageable 分页参数
   * @param principal 当前登录用户信息
   * @return 互相关注的用户列表（分页）
   */
  @GetMapping("/mutual-follows")
  @Operation(summary = "获取互相关注列表", description = "获取与当前用户互相关注的用户列表")
  public ResponseEntity<Result<Page<UserDTO>>> getMutualFollows(
      @PageableDefault(size = 20) Pageable pageable,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Page<UserDTO> mutualFollows = userFollowService.getMutualFollows(principal.getId(), pageable);
    return ResponseEntity.ok(Result.success(mutualFollows));
  }
}
