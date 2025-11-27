package com.example.educhain.repository;

import com.example.educhain.entity.SystemLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 系统日志数据访问接口
 */
@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    /**
     * 根据日志类型查询日志
     */
    Page<SystemLog> findByLogType(SystemLog.LogType logType, Pageable pageable);

    /**
     * 根据日志级别查询日志
     */
    Page<SystemLog> findByLevel(SystemLog.LogLevel level, Pageable pageable);

    /**
     * 根据用户ID查询日志
     */
    Page<SystemLog> findByUserId(Long userId, Pageable pageable);

    /**
     * 根据用户名查询日志
     */
    Page<SystemLog> findByUsernameContaining(String username, Pageable pageable);

    /**
     * 根据操作名称查询日志
     */
    Page<SystemLog> findByOperationContaining(String operation, Pageable pageable);

    /**
     * 根据时间范围查询日志
     */
    Page<SystemLog> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据IP地址查询日志
     */
    Page<SystemLog> findByIpAddress(String ipAddress, Pageable pageable);

    /**
     * 复合查询：根据日志类型和时间范围查询
     */
    @Query("SELECT sl FROM SystemLog sl WHERE sl.logType = :logType AND sl.createdAt BETWEEN :startTime AND :endTime")
    Page<SystemLog> findByLogTypeAndTimeRange(@Param("logType") SystemLog.LogType logType,
                                              @Param("startTime") LocalDateTime startTime,
                                              @Param("endTime") LocalDateTime endTime,
                                              Pageable pageable);

    /**
     * 复合查询：根据用户ID和日志类型查询
     */
    @Query("SELECT sl FROM SystemLog sl WHERE sl.userId = :userId AND sl.logType = :logType")
    Page<SystemLog> findByUserIdAndLogType(@Param("userId") Long userId,
                                           @Param("logType") SystemLog.LogType logType,
                                           Pageable pageable);

    /**
     * 查询错误日志统计
     */
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.level IN ('ERROR', 'FATAL') AND sl.createdAt BETWEEN :startTime AND :endTime")
    Long countErrorLogsByTimeRange(@Param("startTime") LocalDateTime startTime,
                                   @Param("endTime") LocalDateTime endTime);

    /**
     * 查询用户操作统计
     */
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.logType = 'OPERATION' AND sl.userId = :userId AND sl.createdAt BETWEEN :startTime AND :endTime")
    Long countUserOperationsByTimeRange(@Param("userId") Long userId,
                                        @Param("startTime") LocalDateTime startTime,
                                        @Param("endTime") LocalDateTime endTime);

    /**
     * 查询安全日志统计
     */
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.logType = 'SECURITY' AND sl.createdAt BETWEEN :startTime AND :endTime")
    Long countSecurityLogsByTimeRange(@Param("startTime") LocalDateTime startTime,
                                      @Param("endTime") LocalDateTime endTime);

    /**
     * 查询性能异常日志
     */
    @Query("SELECT sl FROM SystemLog sl WHERE sl.logType = 'PERFORMANCE' AND sl.executionTime > :threshold ORDER BY sl.executionTime DESC")
    List<SystemLog> findSlowOperations(@Param("threshold") Long threshold, Pageable pageable);

    /**
     * 查询最近的系统错误
     */
    @Query("SELECT sl FROM SystemLog sl WHERE sl.level IN ('ERROR', 'FATAL') ORDER BY sl.createdAt DESC")
    List<SystemLog> findRecentErrors(Pageable pageable);

    /**
     * 根据异常信息查询日志
     */
    Page<SystemLog> findByExceptionContaining(String exception, Pageable pageable);

    /**
     * 删除指定时间之前的日志（用于日志清理）
     */
    void deleteByCreatedAtBefore(LocalDateTime cutoffTime);
}