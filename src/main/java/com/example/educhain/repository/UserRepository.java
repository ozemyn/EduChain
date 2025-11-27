package com.example.educhain.repository;

import com.example.educhain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 用户数据访问接口
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);

    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);

    /**
     * 根据用户名或邮箱查找用户
     */
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 根据状态查找用户
     */
    Page<User> findByStatus(Integer status, Pageable pageable);

    /**
     * 根据角色查找用户
     */
    Page<User> findByRole(User.UserRole role, Pageable pageable);

    /**
     * 根据用户名模糊搜索
     */
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.fullName LIKE %:keyword%")
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 统计活跃用户数量
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 1")
    long countActiveUsers();

    /**
     * 根据等级范围查找用户
     */
    Page<User> findByLevelBetween(Integer minLevel, Integer maxLevel, Pageable pageable);

    /**
     * 统计今日新用户数量
     */
    @Query("SELECT COUNT(u) FROM User u WHERE DATE(u.createdAt) = CURRENT_DATE")
    Long countNewUsersToday();

    /**
     * 获取用户等级分布
     */
    @Query("SELECT u.level as level, COUNT(u) as count FROM User u GROUP BY u.level")
    Map<String, Long> getUserLevelDistribution();

    /**
     * 根据用户名或邮箱和状态查找用户
     */
    Page<User> findByUsernameContainingOrEmailContainingAndStatus(String username, String email, Integer status, Pageable pageable);

    /**
     * 根据用户名或邮箱查找用户
     */
    Page<User> findByUsernameContainingOrEmailContaining(String username, String email, Pageable pageable);

    /**
     * 根据状态统计用户数量
     */
    long countByStatus(Integer status);

    /**
     * 根据创建时间范围统计用户数量
     */
    long countByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 根据用户名或邮箱和状态查找用户列表
     */
    List<User> findByUsernameContainingOrEmailContainingAndStatus(String username, String email, Integer status);

    /**
     * 根据用户名或邮箱查找用户列表
     */
    List<User> findByUsernameContainingOrEmailContaining(String username, String email);

    /**
     * 根据状态查找用户列表
     */
    List<User> findByStatus(Integer status);
}