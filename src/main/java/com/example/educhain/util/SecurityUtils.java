package com.example.educhain.util;

import com.example.educhain.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** 安全工具类 - 统一处理用户认证相关操作 */
public class SecurityUtils {

  /**
   * 从 Authentication 对象获取用户ID
   *
   * @param authentication Spring Security 认证对象
   * @return 用户ID，如果未认证或无法获取则返回 null
   */
  public static Long getUserId(Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
        CustomUserDetailsService.CustomUserPrincipal userPrincipal =
            (CustomUserDetailsService.CustomUserPrincipal) principal;
        return userPrincipal.getId();
      }
    }
    return null;
  }

  /**
   * 从 SecurityContext 获取当前用户ID
   *
   * @return 用户ID，如果未认证或无法获取则返回 null
   */
  public static Long getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return getUserId(authentication);
  }

  /**
   * 从 SecurityContext 获取当前用户ID，如果未认证则抛出异常
   *
   * @return 用户ID
   * @throws RuntimeException 如果未认证或无法获取用户ID
   */
  public static Long getCurrentUserIdOrThrow() {
    Long userId = getCurrentUserId();
    if (userId == null) {
      throw new RuntimeException("无法获取当前用户信息 - 认证失败");
    }
    return userId;
  }

  /**
   * 从 Authentication 对象获取用户ID，如果未认证则抛出异常
   *
   * @param authentication Spring Security 认证对象
   * @return 用户ID
   * @throws RuntimeException 如果未认证或无法获取用户ID
   */
  public static Long getUserIdOrThrow(Authentication authentication) {
    Long userId = getUserId(authentication);
    if (userId == null) {
      throw new RuntimeException("无法获取当前用户信息 - 认证失败");
    }
    return userId;
  }

  /**
   * 获取当前认证的 CustomUserPrincipal
   *
   * @return CustomUserPrincipal，如果未认证则返回 null
   */
  public static CustomUserDetailsService.CustomUserPrincipal getCurrentUserPrincipal() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
        return (CustomUserDetailsService.CustomUserPrincipal) principal;
      }
    }
    return null;
  }

  /**
   * 检查当前用户是否已认证
   *
   * @return true 如果已认证，否则返回 false
   */
  public static boolean isAuthenticated() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null && authentication.isAuthenticated();
  }
}
