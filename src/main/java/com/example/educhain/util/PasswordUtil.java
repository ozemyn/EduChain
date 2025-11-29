package com.example.educhain.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** 密码加密工具类 */
@Component
public class PasswordUtil {

  private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  /**
   * 加密密码
   *
   * @param rawPassword 原始密码
   * @return 加密后的密码
   */
  public static String encode(String rawPassword) {
    if (rawPassword == null || rawPassword.trim().isEmpty()) {
      throw new IllegalArgumentException("密码不能为空");
    }
    return passwordEncoder.encode(rawPassword);
  }

  /**
   * 验证密码
   *
   * @param rawPassword 原始密码
   * @param encodedPassword 加密后的密码
   * @return 是否匹配
   */
  public static boolean matches(String rawPassword, String encodedPassword) {
    if (rawPassword == null || encodedPassword == null) {
      return false;
    }
    return passwordEncoder.matches(rawPassword, encodedPassword);
  }

  /**
   * 检查密码强度
   *
   * @param password 密码
   * @return 是否符合强度要求
   */
  public static boolean isStrongPassword(String password) {
    if (password == null || password.length() < 8) {
      return false;
    }

    // 检查是否包含数字
    boolean hasDigit = password.chars().anyMatch(Character::isDigit);
    // 检查是否包含字母
    boolean hasLetter = password.chars().anyMatch(Character::isLetter);
    // 检查是否包含特殊字符
    boolean hasSpecial = password.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch));

    return hasDigit && hasLetter && (hasSpecial || password.length() >= 12);
  }

  /**
   * 生成随机密码
   *
   * @param length 密码长度
   * @return 随机密码
   */
  public static String generateRandomPassword(int length) {
    if (length < 8) {
      throw new IllegalArgumentException("密码长度不能少于8位");
    }

    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    StringBuilder password = new StringBuilder();

    for (int i = 0; i < length; i++) {
      int index = (int) (Math.random() * chars.length());
      password.append(chars.charAt(index));
    }

    return password.toString();
  }

  /**
   * 获取密码强度描述
   *
   * @param password 密码
   * @return 强度描述
   */
  public static String getPasswordStrengthDescription(String password) {
    if (password == null || password.length() < 6) {
      return "弱";
    }

    int score = 0;

    // 长度评分
    if (password.length() >= 8) score++;
    if (password.length() >= 12) score++;

    // 字符类型评分
    if (password.chars().anyMatch(Character::isDigit)) score++;
    if (password.chars().anyMatch(Character::isLowerCase)) score++;
    if (password.chars().anyMatch(Character::isUpperCase)) score++;
    if (password.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch))) score++;

    if (score <= 2) return "弱";
    if (score <= 4) return "中";
    return "强";
  }
}
