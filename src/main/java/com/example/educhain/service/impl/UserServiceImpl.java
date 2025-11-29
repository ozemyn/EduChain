package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.User;
import com.example.educhain.entity.UserStats;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.exception.ValidationException;
import com.example.educhain.repository.UserRepository;
import com.example.educhain.repository.UserStatsRepository;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.UserService;
import com.example.educhain.util.JwtUtil;
import com.example.educhain.util.PasswordUtil;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/** 用户服务实现类 提供用户注册、登录、信息管理、密码修改等核心功能 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  @Autowired private UserRepository userRepository;

  @Autowired private UserStatsRepository userStatsRepository;

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired private JwtUtil jwtUtil;

  @Autowired private CustomUserDetailsService userDetailsService;

  @Autowired private RedisTemplate<String, String> redisTemplate;

  /**
   * 用户注册 验证用户名和邮箱唯一性，创建新用户账户并初始化用户统计信息 用户默认角色为学习者，状态为启用，等级为1
   *
   * @param request 注册请求，包含用户名、邮箱、密码等信息
   * @return 注册成功后的用户信息DTO
   * @throws BusinessException 用户名或邮箱已存在时抛出
   * @throws ValidationException 密码强度不符合要求时抛出
   */
  @Override
  public UserDTO register(RegisterRequest request) {
    // 验证用户名唯一性
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new BusinessException("USER_EXISTS", "用户名已存在");
    }

    // 验证邮箱唯一性
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new BusinessException("EMAIL_EXISTS", "邮箱已存在");
    }

    // 验证密码强度
    if (!PasswordUtil.isStrongPassword(request.getPassword())) {
      throw new ValidationException("密码强度不够，请包含字母、数字，长度至少8位");
    }

    // 创建用户实体
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPasswordHash(PasswordUtil.encode(request.getPassword()));
    user.setFullName(request.getFullName());
    user.setSchool(request.getSchool());
    user.setBio(request.getBio());
    user.setRole(User.UserRole.LEARNER); // 默认为学习者
    user.setStatus(1); // 默认启用
    user.setLevel(1); // 默认等级1

    // 保存用户
    try {
      User savedUser = userRepository.save(user);

      // 创建用户统计记录
      UserStats userStats = new UserStats(savedUser.getId());
      userStatsRepository.save(userStats);

      return UserDTO.fromEntity(savedUser);
    } catch (Exception e) {
      throw new BusinessException("REGISTER_FAILED", "注册失败: " + e.getMessage());
    }
  }

  /**
   * 用户登录 验证用户凭证，生成JWT访问令牌和刷新令牌，记录登录信息 登录成功后会将token存储到Redis用于黑名单管理
   *
   * @param request 登录请求，包含用户名/邮箱和密码
   * @return 登录响应，包含访问令牌、刷新令牌和用户信息
   * @throws BusinessException 用户名或密码错误、账户被禁用等异常情况
   */
  @Override
  public LoginResponse login(LoginRequest request) {
    try {
      // 认证用户
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  request.getUsernameOrEmail(), request.getPassword()));

      CustomUserDetailsService.CustomUserPrincipal userPrincipal =
          (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();

      User user = userPrincipal.getUser();

      // 检查用户状态
      if (user.getStatus() != 1) {
        throw new BusinessException("USER_DISABLED", "用户账户已被禁用");
      }

      // 生成JWT令牌
      Map<String, Object> claims = new HashMap<>();
      claims.put("userId", user.getId());
      claims.put("role", user.getRole().name());

      String accessToken = jwtUtil.generateToken(userPrincipal, claims);
      String refreshToken = jwtUtil.generateRefreshToken(userPrincipal);

      // 将token存储到Redis用于黑名单管理
      try {
        String tokenKey = "user:tokens:" + user.getId();
        redisTemplate.opsForSet().add(tokenKey, accessToken);
        redisTemplate.opsForSet().add(tokenKey, refreshToken);
        // 设置token集合的过期时间为7天（刷新token的有效期）
        redisTemplate.expire(tokenKey, Duration.ofDays(7));
      } catch (Exception e) {
        // Redis操作失败不影响登录流程
        logger.warn(
            "Redis token存储失败: userId={}, operation=login, error={}",
            user.getId(),
            e.getMessage(),
            e);
      }

      // 记录登录
      recordUserLogin(user.getId());

      // 构建响应
      UserDTO userDTO = UserDTO.fromEntity(user);
      return new LoginResponse(accessToken, refreshToken, 86400L, userDTO);

    } catch (BusinessException e) {
      // 业务异常直接抛出
      throw e;
    } catch (org.springframework.security.authentication.BadCredentialsException e) {
      logger.warn("登录失败: 用户名或密码错误, usernameOrEmail={}", request.getUsernameOrEmail());
      throw new BusinessException("INVALID_CREDENTIALS", "用户名或密码错误");
    } catch (org.springframework.security.authentication.DisabledException e) {
      logger.warn("登录失败: 账户已被禁用, usernameOrEmail={}", request.getUsernameOrEmail());
      throw new BusinessException("USER_DISABLED", "用户账户已被禁用");
    } catch (org.springframework.security.authentication.LockedException e) {
      logger.warn("登录失败: 账户已被锁定, usernameOrEmail={}", request.getUsernameOrEmail());
      throw new BusinessException("USER_LOCKED", "用户账户已被锁定");
    } catch (Exception e) {
      logger.error(
          "登录失败: 未知错误, usernameOrEmail={}, error={}",
          request.getUsernameOrEmail(),
          e.getMessage(),
          e);
      throw new BusinessException("LOGIN_FAILED", "登录失败，请稍后重试");
    }
  }

  /**
   * 刷新访问令牌 使用刷新令牌获取新的访问令牌和刷新令牌，更新Redis中的token信息 验证刷新令牌的有效性，生成新的访问令牌和刷新令牌
   *
   * @param refreshToken 刷新令牌
   * @return 新的登录响应，包含新的访问令牌、刷新令牌和用户信息
   * @throws BusinessException 刷新令牌无效或已过期时抛出
   */
  @Override
  public LoginResponse refreshAccessToken(String refreshToken) {
    try {
      // 验证刷新令牌
      if (!jwtUtil.validateTokenFormat(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
        throw new BusinessException("INVALID_REFRESH_TOKEN", "无效的刷新令牌");
      }

      String username = jwtUtil.getUsernameFromToken(refreshToken);
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);

      if (jwtUtil.validateToken(refreshToken, userDetails)) {
        // 生成新的访问令牌和刷新令牌
        CustomUserDetailsService.CustomUserPrincipal userPrincipal =
            (CustomUserDetailsService.CustomUserPrincipal) userDetails;

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userPrincipal.getId());
        claims.put("role", userPrincipal.getRole().name());

        String newAccessToken = jwtUtil.generateToken(userDetails, claims);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        // 获取用户信息
        User user =
            userRepository
                .findById(userPrincipal.getId())
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        UserDTO userDTO = UserDTO.fromEntity(user);

        // 更新Redis中的token
        try {
          String tokenKey = "user:tokens:" + user.getId();
          redisTemplate.opsForSet().add(tokenKey, newAccessToken);
          redisTemplate.opsForSet().add(tokenKey, newRefreshToken);
          redisTemplate.expire(tokenKey, Duration.ofDays(7));
        } catch (Exception e) {
          logger.warn(
              "Redis token存储失败: userId={}, operation=refreshToken, error={}",
              user.getId(),
              e.getMessage(),
              e);
        }

        return new LoginResponse(newAccessToken, newRefreshToken, 86400L, userDTO);
      } else {
        throw new BusinessException("INVALID_REFRESH_TOKEN", "刷新令牌已过期");
      }
    } catch (BusinessException e) {
      // 业务异常直接抛出
      throw e;
    } catch (Exception e) {
      logger.error(
          "刷新令牌失败: tokenLength={}, error={}",
          refreshToken != null ? refreshToken.length() : 0,
          e.getMessage(),
          e);
      throw new BusinessException("REFRESH_TOKEN_FAILED", "刷新令牌失败");
    }
  }

  /**
   * 用户登出 将用户的所有有效token加入黑名单，清除Redis中的token集合 确保用户的所有活跃会话都被终止
   *
   * @param userId 用户ID
   */
  @Override
  public void logout(Long userId) {
    if (userId == null) {
      return;
    }

    try {
      // 获取当前用户的所有有效token
      String tokenKey = "user:tokens:" + userId;
      Set<String> tokens = redisTemplate.opsForSet().members(tokenKey);

      if (tokens != null && !tokens.isEmpty()) {
        for (String token : tokens) {
          try {
            // 检查token是否还有效
            if (!jwtUtil.isTokenExpired(token)) {
              // 计算token剩余有效期
              long remainingTime = jwtUtil.getTokenRemainingTime(token);
              if (remainingTime > 0) {
                // 将token加入黑名单，设置过期时间为token剩余有效期
                redisTemplate
                    .opsForValue()
                    .set("blacklist:token:" + token, "1", Duration.ofSeconds(remainingTime));
              }
            }
          } catch (Exception e) {
            // 忽略无效token的异常，继续处理其他token
            continue;
          }
        }
        // 清除用户token集合
        redisTemplate.delete(tokenKey);
      }
    } catch (Exception e) {
      // 记录日志但不抛出异常，确保登出操作不会失败
      logger.warn("Redis操作失败，但登出继续进行: {}", e.getMessage(), e);
    }
  }

  /**
   * 更新用户信息 更新用户的姓名、头像、学校、简介等信息 只更新请求中包含的非空字段
   *
   * @param userId 用户ID
   * @param request 更新请求，包含要更新的字段
   * @return 更新后的用户信息DTO
   * @throws BusinessException 用户不存在时抛出
   */
  @Override
  public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
    try {
      User user =
          userRepository
              .findById(userId)
              .orElseThrow(
                  () -> {
                    logger.warn("更新用户信息失败: 用户不存在, userId={}", userId);
                    return new BusinessException("USER_NOT_FOUND", "用户不存在");
                  });

      // 更新用户信息
      boolean hasChanges = false;
      if (StringUtils.hasText(request.getFullName())) {
        user.setFullName(request.getFullName());
        hasChanges = true;
      }
      if (StringUtils.hasText(request.getAvatarUrl())) {
        user.setAvatarUrl(request.getAvatarUrl());
        hasChanges = true;
      }
      if (StringUtils.hasText(request.getSchool())) {
        user.setSchool(request.getSchool());
        hasChanges = true;
      }
      if (StringUtils.hasText(request.getBio())) {
        user.setBio(request.getBio());
        hasChanges = true;
      }

      if (!hasChanges) {
        logger.debug("更新用户信息: 无变更, userId={}", userId);
        return UserDTO.fromEntity(user);
      }

      User updatedUser = userRepository.save(user);
      logger.info(
          "更新用户信息成功: userId={}, fields={}",
          userId,
          StringUtils.hasText(request.getFullName())
              ? "fullName"
              : ""
                  + (StringUtils.hasText(request.getAvatarUrl()) ? ",avatarUrl" : "")
                  + (StringUtils.hasText(request.getSchool()) ? ",school" : "")
                  + (StringUtils.hasText(request.getBio()) ? ",bio" : ""));
      return UserDTO.fromEntity(updatedUser);
    } catch (BusinessException e) {
      throw e;
    } catch (Exception e) {
      logger.error("更新用户信息失败: userId={}, error={}", userId, e.getMessage(), e);
      throw new BusinessException("UPDATE_PROFILE_FAILED", "更新用户信息失败");
    }
  }

  /**
   * 修改密码 验证当前密码、新密码强度，更新用户密码 确保新密码与确认密码一致且符合强度要求
   *
   * @param userId 用户ID
   * @param request 修改密码请求，包含当前密码、新密码和确认密码
   * @throws BusinessException 用户不存在或当前密码错误时抛出
   * @throws ValidationException 新密码和确认密码不一致或密码强度不够时抛出
   */
  @Override
  public void changePassword(Long userId, ChangePasswordRequest request) {
    try {
      User user =
          userRepository
              .findById(userId)
              .orElseThrow(
                  () -> {
                    logger.warn("修改密码失败: 用户不存在, userId={}", userId);
                    return new BusinessException("USER_NOT_FOUND", "用户不存在");
                  });

      // 验证当前密码
      if (!PasswordUtil.matches(request.getCurrentPassword(), user.getPasswordHash())) {
        logger.warn("修改密码失败: 当前密码错误, userId={}", userId);
        throw new BusinessException("INVALID_PASSWORD", "当前密码错误");
      }

      // 验证新密码和确认密码是否一致
      if (!request.isPasswordsMatch()) {
        logger.warn("修改密码失败: 新密码和确认密码不一致, userId={}", userId);
        throw new ValidationException("新密码和确认密码不一致");
      }

      // 验证新密码强度
      if (!PasswordUtil.isStrongPassword(request.getNewPassword())) {
        logger.warn("修改密码失败: 新密码强度不够, userId={}", userId);
        throw new ValidationException("新密码强度不够，请包含字母、数字，长度至少8位");
      }

      // 更新密码
      user.setPasswordHash(PasswordUtil.encode(request.getNewPassword()));
      userRepository.save(user);
      logger.info("修改密码成功: userId={}", userId);
    } catch (BusinessException | ValidationException e) {
      throw e;
    } catch (Exception e) {
      logger.error("修改密码失败: userId={}, error={}", userId, e.getMessage(), e);
      throw new BusinessException("CHANGE_PASSWORD_FAILED", "修改密码失败");
    }
  }

  /**
   * 根据ID获取用户信息 通过用户ID查询用户详细信息
   *
   * @param userId 用户ID
   * @return 用户信息DTO
   * @throws BusinessException 用户不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public UserDTO getUserById(Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    return UserDTO.fromEntity(user);
  }

  /**
   * 根据用户名获取用户信息 通过用户名查询用户详细信息
   *
   * @param username 用户名
   * @return 用户信息DTO
   * @throws BusinessException 用户不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public UserDTO getUserByUsername(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    return UserDTO.fromEntity(user);
  }

  /**
   * 获取用户统计信息 获取用户的点赞数、收藏数、发布数等统计数据 包括登录次数、知识内容数量、积分等信息
   *
   * @param userId 用户ID
   * @return 用户统计信息DTO
   * @throws BusinessException 用户统计信息不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public UserStatsDTO getUserStats(Long userId) {
    UserStats userStats =
        userStatsRepository
            .findByUserId(userId)
            .orElseThrow(() -> new BusinessException("USER_STATS_NOT_FOUND", "用户统计信息不存在"));
    return UserStatsDTO.fromEntity(userStats);
  }

  /**
   * 搜索用户 根据关键词搜索用户，支持用户名、邮箱、姓名等字段的模糊匹配 搜索结果按相关性排序
   *
   * @param keyword 搜索关键词
   * @param pageable 分页参数
   * @return 用户列表（分页）
   */
  @Override
  @Transactional(readOnly = true)
  public Page<UserDTO> searchUsers(String keyword, Pageable pageable) {
    Page<User> users = userRepository.searchByKeyword(keyword, pageable);
    return users.map(UserDTO::fromEntity);
  }

  /**
   * 获取所有用户列表 分页查询系统中的所有用户
   *
   * @param pageable 分页参数
   * @return 用户列表（分页）
   */
  @Override
  @Transactional(readOnly = true)
  public Page<UserDTO> getAllUsers(Pageable pageable) {
    Page<User> users = userRepository.findAll(pageable);
    return users.map(UserDTO::fromEntity);
  }

  /**
   * 根据角色获取用户列表 分页查询指定角色的所有用户
   *
   * @param role 用户角色（如LEARNER、TEACHER、ADMIN等）
   * @param pageable 分页参数
   * @return 用户列表（分页）
   * @throws ValidationException 角色无效时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public Page<UserDTO> getUsersByRole(String role, Pageable pageable) {
    try {
      User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
      Page<User> users = userRepository.findByRole(userRole, pageable);
      return users.map(UserDTO::fromEntity);
    } catch (IllegalArgumentException e) {
      throw new ValidationException("无效的用户角色: " + role);
    }
  }

  /**
   * 更新用户状态 启用或禁用用户账户 状态为0表示禁用，1表示启用
   *
   * @param userId 用户ID
   * @param status 用户状态（0=禁用，1=启用）
   * @throws BusinessException 用户不存在时抛出
   * @throws ValidationException 状态值无效时抛出
   */
  @Override
  public void updateUserStatus(Long userId, Integer status) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

    if (status != 0 && status != 1) {
      throw new ValidationException("无效的用户状态，只能是0（禁用）或1（启用）");
    }

    user.setStatus(status);
    userRepository.save(user);
  }

  /**
   * 检查用户名是否存在 用于注册时验证用户名唯一性
   *
   * @param username 用户名
   * @return 如果用户名存在返回true，否则返回false
   */
  @Override
  @Transactional(readOnly = true)
  public boolean existsByUsername(String username) {
    return userRepository.existsByUsername(username);
  }

  /**
   * 检查邮箱是否存在 用于注册时验证邮箱唯一性
   *
   * @param email 邮箱
   * @return 如果邮箱存在返回true，否则返回false
   */
  @Override
  @Transactional(readOnly = true)
  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  /**
   * 获取活跃用户数量 统计系统中状态为启用的用户数量
   *
   * @return 活跃用户数量
   */
  @Override
  @Transactional(readOnly = true)
  public long getActiveUserCount() {
    return userRepository.countActiveUsers();
  }

  /**
   * 记录用户登录 更新用户统计信息中的登录次数和最后登录时间
   *
   * @param userId 用户ID
   */
  @Override
  public void recordUserLogin(Long userId) {
    UserStats userStats = userStatsRepository.findByUserId(userId).orElse(new UserStats(userId));

    userStats.recordLogin();
    userStatsRepository.save(userStats);
  }
}
