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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 用户服务实现类
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

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
        User savedUser = userRepository.save(user);

        // 创建用户统计记录
        UserStats userStats = new UserStats(savedUser.getId());
        userStatsRepository.save(userStats);

        return UserDTO.fromEntity(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            // 认证用户
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsernameOrEmail(),
                    request.getPassword()
                )
            );

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
                System.err.println("Redis token存储失败: " + e.getMessage());
            }

            // 记录登录
            recordUserLogin(user.getId());

            // 构建响应
            UserDTO userDTO = UserDTO.fromEntity(user);
            return new LoginResponse(accessToken, refreshToken, 86400L, userDTO);

        } catch (Exception e) {
            throw new BusinessException("LOGIN_FAILED", "用户名或密码错误");
        }
    }

    @Override
    public String refreshAccessToken(String refreshToken) {
        try {
            // 验证刷新令牌
            if (!jwtUtil.validateTokenFormat(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
                throw new BusinessException("INVALID_REFRESH_TOKEN", "无效的刷新令牌");
            }

            String username = jwtUtil.getUsernameFromToken(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(refreshToken, userDetails)) {
                // 生成新的访问令牌
                CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) userDetails;
                
                Map<String, Object> claims = new HashMap<>();
                claims.put("userId", userPrincipal.getId());
                claims.put("role", userPrincipal.getRole().name());
                
                return jwtUtil.generateToken(userDetails, claims);
            } else {
                throw new BusinessException("INVALID_REFRESH_TOKEN", "刷新令牌已过期");
            }
        } catch (Exception e) {
            throw new BusinessException("REFRESH_TOKEN_FAILED", "刷新令牌失败");
        }
    }

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
                                redisTemplate.opsForValue().set(
                                    "blacklist:token:" + token, 
                                    "1", 
                                    Duration.ofSeconds(remainingTime)
                                );
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
            System.err.println("Redis操作失败，但登出继续进行: " + e.getMessage());
        }
    }

    @Override
    public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 更新用户信息
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        if (StringUtils.hasText(request.getAvatarUrl())) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (StringUtils.hasText(request.getSchool())) {
            user.setSchool(request.getSchool());
        }
        if (StringUtils.hasText(request.getBio())) {
            user.setBio(request.getBio());
        }

        User updatedUser = userRepository.save(user);
        return UserDTO.fromEntity(updatedUser);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 验证当前密码
        if (!PasswordUtil.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("INVALID_PASSWORD", "当前密码错误");
        }

        // 验证新密码和确认密码是否一致
        if (!request.isPasswordsMatch()) {
            throw new ValidationException("新密码和确认密码不一致");
        }

        // 验证新密码强度
        if (!PasswordUtil.isStrongPassword(request.getNewPassword())) {
            throw new ValidationException("新密码强度不够，请包含字母、数字，长度至少8位");
        }

        // 更新密码
        user.setPasswordHash(PasswordUtil.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(Long userId) {
        UserStats userStats = userStatsRepository.findByUserId(userId)
            .orElseThrow(() -> new BusinessException("USER_STATS_NOT_FOUND", "用户统计信息不存在"));
        return UserStatsDTO.fromEntity(userStats);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(String keyword, Pageable pageable) {
        Page<User> users = userRepository.searchByKeyword(keyword, pageable);
        return users.map(UserDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserDTO::fromEntity);
    }

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

    @Override
    public void updateUserStatus(Long userId, Integer status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        if (status != 0 && status != 1) {
            throw new ValidationException("无效的用户状态，只能是0（禁用）或1（启用）");
        }

        user.setStatus(status);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public long getActiveUserCount() {
        return userRepository.countActiveUsers();
    }

    @Override
    public void recordUserLogin(Long userId) {
        UserStats userStats = userStatsRepository.findByUserId(userId)
            .orElse(new UserStats(userId));
        
        userStats.recordLogin();
        userStatsRepository.save(userStats);
    }
}