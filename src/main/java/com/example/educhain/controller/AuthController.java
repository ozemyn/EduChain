package com.example.educhain.controller;

import com.example.educhain.annotation.RateLimit;
import com.example.educhain.dto.LoginRequest;
import com.example.educhain.dto.LoginResponse;
import com.example.educhain.dto.RegisterRequest;
import com.example.educhain.dto.UserDTO;
import com.example.educhain.enums.RateLimitType;
import com.example.educhain.service.UserService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** 认证控制器 提供用户注册、登录、登出、令牌刷新等认证相关的API接口 所有接口都包含限流保护，防止恶意请求 */
@RestController
@RequestMapping("/auth")
@Tag(name = "认证管理", description = "用户注册、登录、登出等认证相关接口")
public class AuthController {

  @Autowired private UserService userService;

  /**
   * 用户注册接口 创建新用户账户，验证用户名和邮箱唯一性，初始化用户统计信息
   *
   * @param request 注册请求，包含用户名、邮箱、密码等必填信息
   * @return 注册成功后的用户信息
   */
  @PostMapping("/register")
  @Operation(summary = "用户注册", description = "创建新用户账户")
  @RateLimit(
      key = "auth:register",
      limit = 5,
      timeWindow = 60,
      type = RateLimitType.IP,
      algorithm = "sliding_window",
      message = "注册请求过于频繁，请稍后再试")
  public ResponseEntity<Result<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
    UserDTO user = userService.register(request);
    return ResponseEntity.ok(Result.success("注册成功", user));
  }

  /**
   * 用户登录接口 验证用户凭证，生成JWT访问令牌和刷新令牌
   *
   * @param request 登录请求，包含用户名/邮箱和密码
   * @return 登录响应，包含访问令牌、刷新令牌和用户信息
   */
  @PostMapping("/login")
  @Operation(summary = "用户登录", description = "用户登录获取访问令牌")
  @RateLimit(
      key = "auth:login",
      limit = 10,
      timeWindow = 60,
      type = RateLimitType.IP,
      algorithm = "sliding_window",
      message = "登录请求过于频繁，请稍后再试")
  public ResponseEntity<Result<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
    LoginResponse response = userService.login(request);
    return ResponseEntity.ok(Result.success("登录成功", response));
  }

  /**
   * 刷新访问令牌接口 使用刷新令牌获取新的访问令牌和刷新令牌，延长用户会话时间
   *
   * @param request 包含refreshToken的请求体
   * @return 新的登录响应，包含新的访问令牌、刷新令牌和用户信息
   */
  @PostMapping("/refresh")
  @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌和刷新令牌")
  @RateLimit(
      key = "auth:refresh",
      limit = 20,
      timeWindow = 60,
      type = RateLimitType.USER,
      algorithm = "token_bucket",
      message = "刷新令牌请求过于频繁")
  public ResponseEntity<Result<LoginResponse>> refreshToken(
      @RequestBody Map<String, String> request) {
    String refreshToken = request.get("refreshToken");
    if (refreshToken == null || refreshToken.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "刷新令牌不能为空"));
    }

    LoginResponse response = userService.refreshAccessToken(refreshToken);
    return ResponseEntity.ok(Result.success("令牌刷新成功", response));
  }

  /**
   * 用户登出接口 使当前用户的所有有效令牌失效，清除Redis中的token信息
   *
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 登出成功响应
   */
  @PostMapping("/logout")
  @Operation(summary = "用户登出", description = "用户登出，使令牌失效")
  public ResponseEntity<Result<Void>> logout(@RequestBody Map<String, Long> request) {
    Long userId = request.get("userId");
    if (userId == null) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "用户ID不能为空"));
    }

    userService.logout(userId);
    return ResponseEntity.ok(Result.success("登出成功", null));
  }

  /**
   * 检查用户名是否可用接口 验证指定的用户名是否已被其他用户使用，用于注册时的实时验证
   *
   * @param username 要检查的用户名
   * @return 用户名是否可用（true表示可用，false表示已被使用）
   */
  @GetMapping("/check-username")
  @Operation(summary = "检查用户名", description = "检查用户名是否已被使用")
  public ResponseEntity<Result<Boolean>> checkUsername(@RequestParam String username) {
    if (username == null || username.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "用户名不能为空"));
    }

    boolean exists = userService.existsByUsername(username);
    return ResponseEntity.ok(Result.success(exists ? "用户名已存在" : "用户名可用", !exists));
  }

  /**
   * 检查邮箱是否可用接口 验证指定的邮箱地址是否已被其他用户使用，用于注册时的实时验证
   *
   * @param email 要检查的邮箱地址
   * @return 邮箱是否可用（true表示可用，false表示已被使用）
   */
  @GetMapping("/check-email")
  @Operation(summary = "检查邮箱", description = "检查邮箱是否已被使用")
  public ResponseEntity<Result<Boolean>> checkEmail(@RequestParam String email) {
    if (email == null || email.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Result.error("INVALID_REQUEST", "邮箱不能为空"));
    }

    boolean exists = userService.existsByEmail(email);
    return ResponseEntity.ok(Result.success(exists ? "邮箱已存在" : "邮箱可用", !exists));
  }

  /**
   * 获取活跃用户数量接口（公开接口） 返回平台当前活跃用户的总数，用于展示平台规模
   *
   * @return 活跃用户数量
   */
  @GetMapping("/stats/active-users")
  @Operation(summary = "活跃用户数", description = "获取平台活跃用户数量")
  public ResponseEntity<Result<Long>> getActiveUserCount() {
    long count = userService.getActiveUserCount();
    return ResponseEntity.ok(Result.success("获取成功", count));
  }
}
