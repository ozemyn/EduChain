package com.example.educhain.service;

import com.example.educhain.entity.SystemLog;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 系统日志服务接口 */
public interface SystemLogService {

  /** 记录操作日志 */
  void logOperation(
      Long userId,
      String username,
      String operation,
      String description,
      String ipAddress,
      String userAgent,
      String requestUrl,
      String requestMethod,
      Integer responseStatus,
      Long executionTime);

  /** 记录错误日志 */
  void logError(
      String operation,
      String description,
      String exception,
      String ipAddress,
      String requestUrl,
      String requestMethod);

  /** 记录安全日志 */
  void logSecurity(
      Long userId,
      String username,
      String operation,
      String description,
      String ipAddress,
      String userAgent,
      String requestUrl);

  /** 记录性能日志 */
  void logPerformance(
      String operation,
      String description,
      Long executionTime,
      String requestUrl,
      String requestMethod);

  /** 记录系统日志 */
  void logSystem(String operation, String description, SystemLog.LogLevel level);

  /** 查询日志列表 */
  Page<SystemLog> findLogs(
      SystemLog.LogType logType,
      SystemLog.LogLevel level,
      Long userId,
      String username,
      String operation,
      LocalDateTime startTime,
      LocalDateTime endTime,
      String ipAddress,
      Pageable pageable);

  /** 根据ID查询日志详情 */
  SystemLog findById(Long id);

  /** 获取日志统计信息 */
  Map<String, Object> getLogStatistics(LocalDateTime startTime, LocalDateTime endTime);

  /** 获取错误日志统计 */
  Long getErrorLogCount(LocalDateTime startTime, LocalDateTime endTime);

  /** 获取用户操作统计 */
  Long getUserOperationCount(Long userId, LocalDateTime startTime, LocalDateTime endTime);

  /** 获取安全日志统计 */
  Long getSecurityLogCount(LocalDateTime startTime, LocalDateTime endTime);

  /** 获取性能异常操作 */
  List<SystemLog> getSlowOperations(Long thresholdMs, int limit);

  /** 获取最近的系统错误 */
  List<SystemLog> getRecentErrors(int limit);

  /** 清理过期日志 */
  void cleanupOldLogs(int daysToKeep);

  /** 导出日志数据 */
  List<SystemLog> exportLogs(
      SystemLog.LogType logType, LocalDateTime startTime, LocalDateTime endTime);
}
