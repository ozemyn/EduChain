package com.example.educhain.service;

import com.example.educhain.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 用户信息DTO
     */
    UserDTO register(RegisterRequest request);

    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 登录响应
     */
    LoginResponse login(LoginRequest request);

    /**
     * 刷新访问令牌
     * 
     * @param refreshToken 刷新令牌
     * @return 新的访问令牌
     */
    String refreshAccessToken(String refreshToken);

    /**
     * 用户登出
     * 
     * @param userId 用户ID
     */
    void logout(Long userId);

    /**
     * 更新用户信息
     * 
     * @param userId 用户ID
     * @param request 更新请求
     * @return 更新后的用户信息
     */
    UserDTO updateProfile(Long userId, UpdateProfileRequest request);

    /**
     * 修改密码
     * 
     * @param userId 用户ID
     * @param request 修改密码请求
     */
    void changePassword(Long userId, ChangePasswordRequest request);

    /**
     * 根据ID获取用户信息
     * 
     * @param userId 用户ID
     * @return 用户信息DTO
     */
    UserDTO getUserById(Long userId);

    /**
     * 根据用户名获取用户信息
     * 
     * @param username 用户名
     * @return 用户信息DTO
     */
    UserDTO getUserByUsername(String username);

    /**
     * 获取用户统计信息
     * 
     * @param userId 用户ID
     * @return 用户统计信息DTO
     */
    UserStatsDTO getUserStats(Long userId);

    /**
     * 搜索用户
     * 
     * @param keyword 搜索关键词
     * @param pageable 分页参数
     * @return 用户列表
     */
    Page<UserDTO> searchUsers(String keyword, Pageable pageable);

    /**
     * 获取所有用户（分页）
     * 
     * @param pageable 分页参数
     * @return 用户列表
     */
    Page<UserDTO> getAllUsers(Pageable pageable);

    /**
     * 根据角色获取用户
     * 
     * @param role 用户角色
     * @param pageable 分页参数
     * @return 用户列表
     */
    Page<UserDTO> getUsersByRole(String role, Pageable pageable);

    /**
     * 启用/禁用用户
     * 
     * @param userId 用户ID
     * @param status 状态（1：启用，0：禁用）
     */
    void updateUserStatus(Long userId, Integer status);

    /**
     * 检查用户名是否存在
     * 
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否存在
     * 
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 获取活跃用户数量
     * 
     * @return 活跃用户数量
     */
    long getActiveUserCount();

    /**
     * 记录用户登录
     * 
     * @param userId 用户ID
     */
    void recordUserLogin(Long userId);
}