package com.example.educhain.controller;

import com.example.educhain.dto.LoginRequest;
import com.example.educhain.dto.LoginResponse;
import com.example.educhain.dto.RegisterRequest;
import com.example.educhain.dto.UserDTO;
import com.example.educhain.service.UserService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "认证管理", description = "用户注册、登录、登出等认证相关接口")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "创建新用户账户")
    public ResponseEntity<Result<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = userService.register(request);
        return ResponseEntity.ok(Result.success("注册成功", user));
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录获取访问令牌")
    public ResponseEntity<Result<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(Result.success("登录成功", response));
    }

    /**
     * 刷新访问令牌
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌")
    public ResponseEntity<Result<String>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Result.error("INVALID_REQUEST", "刷新令牌不能为空"));
        }
        
        String newAccessToken = userService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(Result.success("令牌刷新成功", newAccessToken));
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出，使令牌失效")
    public ResponseEntity<Result<Void>> logout(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        if (userId == null) {
            return ResponseEntity.badRequest()
                .body(Result.error("INVALID_REQUEST", "用户ID不能为空"));
        }
        
        userService.logout(userId);
        return ResponseEntity.ok(Result.success("登出成功", null));
    }

    /**
     * 检查用户名是否可用
     */
    @GetMapping("/check-username")
    @Operation(summary = "检查用户名", description = "检查用户名是否已被使用")
    public ResponseEntity<Result<Boolean>> checkUsername(@RequestParam String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Result.error("INVALID_REQUEST", "用户名不能为空"));
        }
        
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(Result.success(exists ? "用户名已存在" : "用户名可用", !exists));
    }

    /**
     * 检查邮箱是否可用
     */
    @GetMapping("/check-email")
    @Operation(summary = "检查邮箱", description = "检查邮箱是否已被使用")
    public ResponseEntity<Result<Boolean>> checkEmail(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Result.error("INVALID_REQUEST", "邮箱不能为空"));
        }
        
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(Result.success(exists ? "邮箱已存在" : "邮箱可用", !exists));
    }

    /**
     * 获取活跃用户数量（公开接口）
     */
    @GetMapping("/stats/active-users")
    @Operation(summary = "活跃用户数", description = "获取平台活跃用户数量")
    public ResponseEntity<Result<Long>> getActiveUserCount() {
        long count = userService.getActiveUserCount();
        return ResponseEntity.ok(Result.success("获取成功", count));
    }
}