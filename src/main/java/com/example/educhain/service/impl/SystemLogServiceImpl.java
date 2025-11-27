package com.example.educhain.service.impl;

import com.example.educhain.entity.SystemLog;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.SystemLogRepository;
import com.example.educhain.service.SystemLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统日志服务实现类
 */
@Service
@Transactional
public class SystemLogServiceImpl implements SystemLogService {

    private static final Logger logger = LoggerFactory.getLogger(SystemLogServiceImpl.class);

    @Autowired
    private SystemLogRepository systemLogRepository;

    @Override
    public void logOperation(Long userId, String username, String operation, String description,
                           String ipAddress, String userAgent, String requestUrl, String requestMethod,
                           Integer responseStatus, Long executionTime) {
        try {
            SystemLog log = new SystemLog();
            log.setLogType(SystemLog.LogType.OPERATION);
            log.setLevel(SystemLog.LogLevel.INFO);
            log.setUserId(userId);
            log.setUsername(username);
            log.setOperation(operation);
            log.setDescription(description);
            log.setIpAddress(ipAddress);
            log.setUserAgent(userAgent);
            log.setRequestUrl(requestUrl);
            log.setRequestMethod(requestMethod);
            log.setResponseStatus(responseStatus);
            log.setExecutionTime(executionTime);

            systemLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录操作日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    public void logError(String operation, String description, String exception,
                        String ipAddress, String requestUrl, String requestMethod) {
        try {
            SystemLog log = new SystemLog();
            log.setLogType(SystemLog.LogType.ERROR);
            log.setLevel(SystemLog.LogLevel.ERROR);
            log.setOperation(operation);
            log.setDescription(description);
            log.setException(exception);
            log.setIpAddress(ipAddress);
            log.setRequestUrl(requestUrl);
            log.setRequestMethod(requestMethod);

            systemLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录错误日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    public void logSecurity(Long userId, String username, String operation, String description,
                          String ipAddress, String userAgent, String requestUrl) {
        try {
            SystemLog log = new SystemLog();
            log.setLogType(SystemLog.LogType.SECURITY);
            log.setLevel(SystemLog.LogLevel.WARN);
            log.setUserId(userId);
            log.setUsername(username);
            log.setOperation(operation);
            log.setDescription(description);
            log.setIpAddress(ipAddress);
            log.setUserAgent(userAgent);
            log.setRequestUrl(requestUrl);

            systemLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录安全日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    public void logPerformance(String operation, String description, Long executionTime,
                             String requestUrl, String requestMethod) {
        try {
            SystemLog log = new SystemLog();
            log.setLogType(SystemLog.LogType.PERFORMANCE);
            log.setLevel(executionTime > 5000 ? SystemLog.LogLevel.WARN : SystemLog.LogLevel.INFO);
            log.setOperation(operation);
            log.setDescription(description);
            log.setExecutionTime(executionTime);
            log.setRequestUrl(requestUrl);
            log.setRequestMethod(requestMethod);

            systemLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录性能日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    public void logSystem(String operation, String description, SystemLog.LogLevel level) {
        try {
            SystemLog log = new SystemLog();
            log.setLogType(SystemLog.LogType.SYSTEM);
            log.setLevel(level);
            log.setOperation(operation);
            log.setDescription(description);

            systemLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录系统日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SystemLog> findLogs(SystemLog.LogType logType, SystemLog.LogLevel level,
                                   Long userId, String username, String operation,
                                   LocalDateTime startTime, LocalDateTime endTime,
                                   String ipAddress, Pageable pageable) {
        
        // 创建排序规则，按创建时间倒序
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );

        // 根据不同条件进行查询
        if (logType != null && startTime != null && endTime != null) {
            return systemLogRepository.findByLogTypeAndTimeRange(logType, startTime, endTime, sortedPageable);
        } else if (userId != null && logType != null) {
            return systemLogRepository.findByUserIdAndLogType(userId, logType, sortedPageable);
        } else if (logType != null) {
            return systemLogRepository.findByLogType(logType, sortedPageable);
        } else if (level != null) {
            return systemLogRepository.findByLevel(level, sortedPageable);
        } else if (userId != null) {
            return systemLogRepository.findByUserId(userId, sortedPageable);
        } else if (username != null && !username.trim().isEmpty()) {
            return systemLogRepository.findByUsernameContaining(username.trim(), sortedPageable);
        } else if (operation != null && !operation.trim().isEmpty()) {
            return systemLogRepository.findByOperationContaining(operation.trim(), sortedPageable);
        } else if (startTime != null && endTime != null) {
            return systemLogRepository.findByCreatedAtBetween(startTime, endTime, sortedPageable);
        } else if (ipAddress != null && !ipAddress.trim().isEmpty()) {
            return systemLogRepository.findByIpAddress(ipAddress.trim(), sortedPageable);
        } else {
            return systemLogRepository.findAll(sortedPageable);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public SystemLog findById(Long id) {
        return systemLogRepository.findById(id)
            .orElseThrow(() -> new BusinessException("SYSTEM_LOG_NOT_FOUND", "系统日志不存在"));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getLogStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            // 总日志数量
            long totalLogs = systemLogRepository.findByCreatedAtBetween(startTime, endTime, Pageable.unpaged()).getTotalElements();
            statistics.put("totalLogs", totalLogs);

            // 错误日志数量
            long errorLogs = systemLogRepository.countErrorLogsByTimeRange(startTime, endTime);
            statistics.put("errorLogs", errorLogs);

            // 安全日志数量
            long securityLogs = systemLogRepository.countSecurityLogsByTimeRange(startTime, endTime);
            statistics.put("securityLogs", securityLogs);

            // 各类型日志统计
            Map<String, Long> logTypeStats = new HashMap<>();
            for (SystemLog.LogType logType : SystemLog.LogType.values()) {
                long count = systemLogRepository.findByLogTypeAndTimeRange(logType, startTime, endTime, Pageable.unpaged()).getTotalElements();
                logTypeStats.put(logType.name(), count);
            }
            statistics.put("logTypeStats", logTypeStats);

            // 各级别日志统计
            Map<String, Long> logLevelStats = new HashMap<>();
            for (SystemLog.LogLevel level : SystemLog.LogLevel.values()) {
                long count = systemLogRepository.findByLevel(level, Pageable.unpaged()).getTotalElements();
                logLevelStats.put(level.name(), count);
            }
            statistics.put("logLevelStats", logLevelStats);

        } catch (Exception e) {
            logger.error("获取日志统计信息失败: {}", e.getMessage(), e);
            throw new BusinessException("LOG_STATISTICS_ERROR", "获取日志统计信息失败");
        }

        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public Long getErrorLogCount(LocalDateTime startTime, LocalDateTime endTime) {
        return systemLogRepository.countErrorLogsByTimeRange(startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUserOperationCount(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        return systemLogRepository.countUserOperationsByTimeRange(userId, startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getSecurityLogCount(LocalDateTime startTime, LocalDateTime endTime) {
        return systemLogRepository.countSecurityLogsByTimeRange(startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemLog> getSlowOperations(Long thresholdMs, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return systemLogRepository.findSlowOperations(thresholdMs, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemLog> getRecentErrors(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return systemLogRepository.findRecentErrors(pageable);
    }

    @Override
    public void cleanupOldLogs(int daysToKeep) {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysToKeep);
            systemLogRepository.deleteByCreatedAtBefore(cutoffTime);
            logger.info("清理了{}天前的日志记录", daysToKeep);
        } catch (Exception e) {
            logger.error("清理过期日志失败: {}", e.getMessage(), e);
            throw new BusinessException("LOG_CLEANUP_ERROR", "清理过期日志失败");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemLog> exportLogs(SystemLog.LogType logType, LocalDateTime startTime, LocalDateTime endTime) {
        try {
            if (logType != null) {
                return systemLogRepository.findByLogTypeAndTimeRange(logType, startTime, endTime, Pageable.unpaged()).getContent();
            } else {
                return systemLogRepository.findByCreatedAtBetween(startTime, endTime, Pageable.unpaged()).getContent();
            }
        } catch (Exception e) {
            logger.error("导出日志数据失败: {}", e.getMessage(), e);
            throw new BusinessException("LOG_EXPORT_ERROR", "导出日志数据失败");
        }
    }
}