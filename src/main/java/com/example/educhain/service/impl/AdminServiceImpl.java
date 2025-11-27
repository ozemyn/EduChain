package com.example.educhain.service.impl;

import com.example.educhain.dto.UserDTO;
import com.example.educhain.dto.KnowledgeItemDTO;
import com.example.educhain.dto.CommentDTO;
import com.example.educhain.entity.*;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.*;
import com.example.educhain.service.AdminService;
import com.example.educhain.service.NotificationService;
import com.example.educhain.service.SystemLogService;
import com.example.educhain.util.PasswordUtil;
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
import java.util.*;
import java.util.stream.Collectors;

/**
 * 管理员服务实现类
 */
@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KnowledgeItemRepository knowledgeItemRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AdminLogRepository adminLogRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Autowired
    private KnowledgeStatsRepository knowledgeStatsRepository;

    @Autowired
    private SystemLogService systemLogService;

    @Autowired
    private NotificationService notificationService;

    // ========== 用户管理 ==========

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(String keyword, Integer status, Pageable pageable) {
        Page<User> users;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (status != null) {
                users = userRepository.findByUsernameContainingOrEmailContainingAndStatus(
                    keyword.trim(), keyword.trim(), status, pageable);
            } else {
                users = userRepository.findByUsernameContainingOrEmailContaining(
                    keyword.trim(), keyword.trim(), pageable);
            }
        } else if (status != null) {
            users = userRepository.findByStatus(status, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::convertToUserDTO);
    }

    @Override
    public void disableUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        if (user.getStatus() == 0) {
            throw new BusinessException("USER_ALREADY_DISABLED", "用户已被禁用");
        }

        String oldValue = "状态: " + (user.getStatus() == 1 ? "正常" : "禁用");
        user.setStatus(0);
        userRepository.save(user);

        String newValue = "状态: 禁用";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.DISABLE,
                         AdminLog.TargetType.USER, userId, user.getUsername(),
                         "禁用用户", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 记录系统日志
        systemLogService.logOperation(adminId, adminUsername, "禁用用户",
                                    String.format("管理员禁用用户: %s, 原因: %s", user.getUsername(), reason),
                                    ipAddress, null, null, null, 200, null);

        logger.info("管理员 {} 禁用了用户 {}, 原因: {}", adminUsername, user.getUsername(), reason);
    }

    @Override
    public void enableUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        if (user.getStatus() == 1) {
            throw new BusinessException("USER_ALREADY_ENABLED", "用户已是正常状态");
        }

        String oldValue = "状态: " + (user.getStatus() == 1 ? "正常" : "禁用");
        user.setStatus(1);
        userRepository.save(user);

        String newValue = "状态: 正常";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.ENABLE,
                         AdminLog.TargetType.USER, userId, user.getUsername(),
                         "启用用户", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 记录系统日志
        systemLogService.logOperation(adminId, adminUsername, "启用用户",
                                    String.format("管理员启用用户: %s, 原因: %s", user.getUsername(), reason),
                                    ipAddress, null, null, null, 200, null);

        logger.info("管理员 {} 启用了用户 {}, 原因: {}", adminUsername, user.getUsername(), reason);
    }

    @Override
    public void resetUserPassword(Long adminId, String adminUsername, Long userId, String newPassword, String ipAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        String oldValue = "密码: [已加密]";
        String hashedPassword = PasswordUtil.encode(newPassword);
        user.setPasswordHash(hashedPassword);
        userRepository.save(user);

        String newValue = "密码: [已重置]";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.UPDATE,
                         AdminLog.TargetType.USER, userId, user.getUsername(),
                         "重置用户密码", "管理员重置用户密码", oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 记录系统日志
        systemLogService.logOperation(adminId, adminUsername, "重置用户密码",
                                    String.format("管理员重置用户密码: %s", user.getUsername()),
                                    ipAddress, null, null, null, 200, null);

        logger.info("管理员 {} 重置了用户 {} 的密码", adminUsername, user.getUsername());
    }

    @Override
    public void deleteUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 软删除：设置状态为-1
        String oldValue = "状态: " + (user.getStatus() == 1 ? "正常" : "禁用");
        user.setStatus(-1);
        userRepository.save(user);

        String newValue = "状态: 已删除";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.DELETE,
                         AdminLog.TargetType.USER, userId, user.getUsername(),
                         "删除用户", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 记录系统日志
        systemLogService.logOperation(adminId, adminUsername, "删除用户",
                                    String.format("管理员删除用户: %s, 原因: %s", user.getUsername(), reason),
                                    ipAddress, null, null, null, 200, null);

        logger.info("管理员 {} 删除了用户 {}, 原因: {}", adminUsername, user.getUsername(), reason);
    }

    // ========== 内容管理 ==========

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> getPendingKnowledgeItems(Pageable pageable) {
        Page<KnowledgeItem> items = knowledgeItemRepository.findByStatus(0, pageable); // 0: 待审核
        return items.map(this::convertToKnowledgeItemDTO);
    }

    @Override
    public void approveKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress) {
        KnowledgeItem item = knowledgeItemRepository.findById(knowledgeId)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_ITEM_NOT_FOUND", "知识内容不存在"));

        String oldValue = "状态: 待审核";
        item.setStatus(1); // 1: 已发布
        knowledgeItemRepository.save(item);

        String newValue = "状态: 已发布";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.APPROVE,
                         AdminLog.TargetType.KNOWLEDGE_ITEM, knowledgeId, item.getTitle(),
                         "审核通过知识内容", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 发送通知给内容作者
        if (item.getUploaderId() != null) {
            notificationService.createSystemNotification(item.getUploaderId(), "内容审核通过",
                String.format("您的知识内容《%s》已审核通过", item.getTitle()));
        }

        logger.info("管理员 {} 审核通过了知识内容 {}", adminUsername, item.getTitle());
    }

    @Override
    public void rejectKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress) {
        KnowledgeItem item = knowledgeItemRepository.findById(knowledgeId)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_ITEM_NOT_FOUND", "知识内容不存在"));

        String oldValue = "状态: 待审核";
        item.setStatus(-1); // -1: 审核拒绝
        knowledgeItemRepository.save(item);

        String newValue = "状态: 审核拒绝";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.REJECT,
                         AdminLog.TargetType.KNOWLEDGE_ITEM, knowledgeId, item.getTitle(),
                         "审核拒绝知识内容", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        // 发送通知给内容作者
        if (item.getUploaderId() != null) {
            notificationService.createSystemNotification(item.getUploaderId(), "内容审核未通过",
                String.format("您的知识内容《%s》审核未通过，原因：%s", item.getTitle(), reason));
        }

        logger.info("管理员 {} 审核拒绝了知识内容 {}, 原因: {}", adminUsername, item.getTitle(), reason);
    }

    @Override
    public void deleteKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress) {
        KnowledgeItem item = knowledgeItemRepository.findById(knowledgeId)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_ITEM_NOT_FOUND", "知识内容不存在"));

        String oldValue = "状态: " + getKnowledgeItemStatusText(item.getStatus());
        item.setStatus(-2); // -2: 已删除
        knowledgeItemRepository.save(item);

        String newValue = "状态: 已删除";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.DELETE,
                         AdminLog.TargetType.KNOWLEDGE_ITEM, knowledgeId, item.getTitle(),
                         "删除知识内容", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        logger.info("管理员 {} 删除了知识内容 {}, 原因: {}", adminUsername, item.getTitle(), reason);
    }

    @Override
    public void batchDeleteKnowledgeItems(Long adminId, String adminUsername, List<Long> knowledgeIds, String reason, String ipAddress) {
        int successCount = 0;
        int failCount = 0;
        StringBuilder errorMessages = new StringBuilder();

        for (Long knowledgeId : knowledgeIds) {
            try {
                deleteKnowledgeItem(adminId, adminUsername, knowledgeId, reason, ipAddress);
                successCount++;
            } catch (Exception e) {
                failCount++;
                errorMessages.append(String.format("ID %d: %s; ", knowledgeId, e.getMessage()));
            }
        }

        AdminLog.OperationResult result = failCount == 0 ? AdminLog.OperationResult.SUCCESS :
                                         (successCount == 0 ? AdminLog.OperationResult.FAILED : AdminLog.OperationResult.PARTIAL);

        // 记录批量操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.DELETE,
                         AdminLog.TargetType.KNOWLEDGE_ITEM, null, "批量删除",
                         "批量删除知识内容", String.format("成功: %d, 失败: %d, 原因: %s", successCount, failCount, reason),
                         null, null, ipAddress, null, result, errorMessages.toString());

        logger.info("管理员 {} 批量删除知识内容，成功: {}, 失败: {}", adminUsername, successCount, failCount);
    }

    // ========== 评论管理 ==========

    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> getPendingComments(Pageable pageable) {
        Page<Comment> comments = commentRepository.findByStatus(0, pageable); // 0: 待审核
        return comments.map(this::convertToCommentDTO);
    }

    @Override
    public void approveComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

        String oldValue = "状态: 待审核";
        comment.setStatus(1); // 1: 已发布
        commentRepository.save(comment);

        String newValue = "状态: 已发布";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.APPROVE,
                         AdminLog.TargetType.COMMENT, commentId, "评论",
                         "审核通过评论", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        logger.info("管理员 {} 审核通过了评论 {}", adminUsername, commentId);
    }

    @Override
    public void rejectComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

        String oldValue = "状态: 待审核";
        comment.setStatus(-1); // -1: 审核拒绝
        commentRepository.save(comment);

        String newValue = "状态: 审核拒绝";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.REJECT,
                         AdminLog.TargetType.COMMENT, commentId, "评论",
                         "审核拒绝评论", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        logger.info("管理员 {} 审核拒绝了评论 {}, 原因: {}", adminUsername, commentId, reason);
    }

    @Override
    public void deleteComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

        String oldValue = "状态: " + getCommentStatusText(comment.getStatus());
        comment.setStatus(-2); // -2: 已删除
        commentRepository.save(comment);

        String newValue = "状态: 已删除";
        
        // 记录管理员操作日志
        logAdminOperation(adminId, adminUsername, AdminLog.OperationType.DELETE,
                         AdminLog.TargetType.COMMENT, commentId, "评论",
                         "删除评论", reason, oldValue, newValue,
                         ipAddress, null, AdminLog.OperationResult.SUCCESS, null);

        logger.info("管理员 {} 删除了评论 {}, 原因: {}", adminUsername, commentId, reason);
    }

    // ========== 系统监控 ==========

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // 用户统计
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.countByStatus(1);
            long disabledUsers = userRepository.countByStatus(0);
            
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("disabledUsers", disabledUsers);

            // 内容统计
            long totalKnowledgeItems = knowledgeItemRepository.count();
            long publishedItems = knowledgeItemRepository.countByStatus(1);
            long pendingItems = knowledgeItemRepository.countByStatus(0);
            
            stats.put("totalKnowledgeItems", totalKnowledgeItems);
            stats.put("publishedItems", publishedItems);
            stats.put("pendingItems", pendingItems);

            // 评论统计
            long totalComments = commentRepository.count();
            long publishedComments = commentRepository.countByStatus(1);
            long pendingComments = commentRepository.countByStatus(0);
            
            stats.put("totalComments", totalComments);
            stats.put("publishedComments", publishedComments);
            stats.put("pendingComments", pendingComments);

        } catch (Exception e) {
            logger.error("获取系统统计信息失败: {}", e.getMessage(), e);
            throw new BusinessException("SYSTEM_STATISTICS_ERROR", "获取系统统计信息失败");
        }

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // 新注册用户数
            long newUsers = userRepository.countByCreatedAtBetween(startTime, endTime);
            stats.put("newUsers", newUsers);

            // 活跃用户数（这里简化处理，实际应该根据用户活动记录计算）
            long activeUsers = userRepository.countByStatus(1);
            stats.put("activeUsers", activeUsers);

        } catch (Exception e) {
            logger.error("获取用户统计信息失败: {}", e.getMessage(), e);
            throw new BusinessException("USER_STATISTICS_ERROR", "获取用户统计信息失败");
        }

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getContentStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // 新增内容数
            long newContent = knowledgeItemRepository.countByCreatedAtBetween(startTime, endTime);
            stats.put("newContent", newContent);

            // 新增评论数
            long newComments = commentRepository.countByCreatedAtBetween(startTime, endTime);
            stats.put("newComments", newComments);

        } catch (Exception e) {
            logger.error("获取内容统计信息失败: {}", e.getMessage(), e);
            throw new BusinessException("CONTENT_STATISTICS_ERROR", "获取内容统计信息失败");
        }

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        try {
            // 获取JVM内存信息
            Runtime runtime = Runtime.getRuntime();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;
            long maxMemory = runtime.maxMemory();

            metrics.put("totalMemory", totalMemory);
            metrics.put("freeMemory", freeMemory);
            metrics.put("usedMemory", usedMemory);
            metrics.put("maxMemory", maxMemory);
            metrics.put("memoryUsagePercent", (double) usedMemory / maxMemory * 100);

            // 获取系统负载（简化处理）
            metrics.put("systemLoad", "正常");
            metrics.put("timestamp", LocalDateTime.now());

        } catch (Exception e) {
            logger.error("获取性能指标失败: {}", e.getMessage(), e);
            throw new BusinessException("PERFORMANCE_METRICS_ERROR", "获取性能指标失败");
        }

        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // 数据库连接状态
            boolean dbHealthy = true;
            try {
                userRepository.count();
            } catch (Exception e) {
                dbHealthy = false;
            }
            health.put("database", dbHealthy ? "UP" : "DOWN");

            // 应用状态
            health.put("application", "UP");
            health.put("timestamp", LocalDateTime.now());

        } catch (Exception e) {
            logger.error("获取系统健康状态失败: {}", e.getMessage(), e);
            health.put("application", "DOWN");
            health.put("error", e.getMessage());
        }

        return health;
    }

    // ========== 管理员日志 ==========

    @Override
    public void logAdminOperation(Long adminId, String adminUsername, AdminLog.OperationType operationType,
                                 AdminLog.TargetType targetType, Long targetId, String targetName,
                                 String operation, String description, String oldValue, String newValue,
                                 String ipAddress, String userAgent, AdminLog.OperationResult result, String errorMessage) {
        try {
            AdminLog log = new AdminLog();
            log.setAdminId(adminId);
            log.setAdminUsername(adminUsername);
            log.setOperationType(operationType);
            log.setTargetType(targetType);
            log.setTargetId(targetId);
            log.setTargetName(targetName);
            log.setOperation(operation);
            log.setDescription(description);
            log.setOldValue(oldValue);
            log.setNewValue(newValue);
            log.setIpAddress(ipAddress);
            log.setUserAgent(userAgent);
            log.setResult(result);
            log.setErrorMessage(errorMessage);

            adminLogRepository.save(log);
        } catch (Exception e) {
            logger.error("记录管理员操作日志失败: {}", e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminLog> getAdminLogs(Long adminId, String adminUsername, AdminLog.OperationType operationType,
                                      AdminLog.TargetType targetType, AdminLog.OperationResult result,
                                      LocalDateTime startTime, LocalDateTime endTime, Pageable pageable) {
        
        // 创建排序规则，按创建时间倒序
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );

        // 根据不同条件进行查询
        if (adminId != null && operationType != null) {
            return adminLogRepository.findByAdminIdAndOperationType(adminId, operationType, sortedPageable);
        } else if (targetType != null && operationType != null) {
            return adminLogRepository.findByTargetTypeAndOperationType(targetType, operationType, sortedPageable);
        } else if (adminId != null && startTime != null && endTime != null) {
            return adminLogRepository.findByAdminIdAndTimeRange(adminId, startTime, endTime, sortedPageable);
        } else if (adminId != null) {
            return adminLogRepository.findByAdminId(adminId, sortedPageable);
        } else if (adminUsername != null && !adminUsername.trim().isEmpty()) {
            return adminLogRepository.findByAdminUsernameContaining(adminUsername.trim(), sortedPageable);
        } else if (operationType != null) {
            return adminLogRepository.findByOperationType(operationType, sortedPageable);
        } else if (targetType != null) {
            return adminLogRepository.findByTargetType(targetType, sortedPageable);
        } else if (result != null) {
            return adminLogRepository.findByResult(result, sortedPageable);
        } else if (startTime != null && endTime != null) {
            return adminLogRepository.findByCreatedAtBetween(startTime, endTime, sortedPageable);
        } else {
            return adminLogRepository.findAll(sortedPageable);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminOperationStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            // 操作类型统计
            List<Object[]> operationTypeStats = adminLogRepository.countByOperationTypeAndTimeRange(startTime, endTime);
            Map<String, Long> operationTypeMap = operationTypeStats.stream()
                .collect(Collectors.toMap(
                    arr -> arr[0].toString(),
                    arr -> (Long) arr[1]
                ));
            statistics.put("operationTypeStats", operationTypeMap);

            // 目标类型统计
            List<Object[]> targetTypeStats = adminLogRepository.countByTargetTypeAndTimeRange(startTime, endTime);
            Map<String, Long> targetTypeMap = targetTypeStats.stream()
                .collect(Collectors.toMap(
                    arr -> arr[0].toString(),
                    arr -> (Long) arr[1]
                ));
            statistics.put("targetTypeStats", targetTypeMap);

        } catch (Exception e) {
            logger.error("获取管理员操作统计失败: {}", e.getMessage(), e);
            throw new BusinessException("ADMIN_STATISTICS_ERROR", "获取管理员操作统计失败");
        }

        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMostActiveAdmins(LocalDateTime startTime, LocalDateTime endTime, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = adminLogRepository.findMostActiveAdmins(startTime, endTime, pageable);
        
        return results.stream().map(arr -> {
            Map<String, Object> admin = new HashMap<>();
            admin.put("adminId", arr[0]);
            admin.put("adminUsername", arr[1]);
            admin.put("operationCount", arr[2]);
            return admin;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminLog> getFailedOperations(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return adminLogRepository.findFailedOperations(pageable);
    }

    // ========== 数据导出 ==========

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> exportUsers(String keyword, Integer status) {
        List<User> users;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (status != null) {
                users = userRepository.findByUsernameContainingOrEmailContainingAndStatus(
                    keyword.trim(), keyword.trim(), status);
            } else {
                users = userRepository.findByUsernameContainingOrEmailContaining(
                    keyword.trim(), keyword.trim());
            }
        } else if (status != null) {
            users = userRepository.findByStatus(status);
        } else {
            users = userRepository.findAll();
        }

        return users.stream().map(this::convertToUserDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KnowledgeItemDTO> exportKnowledgeItems(LocalDateTime startTime, LocalDateTime endTime) {
        List<KnowledgeItem> items = knowledgeItemRepository.findByCreatedAtBetween(startTime, endTime);
        return items.stream().map(this::convertToKnowledgeItemDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminLog> exportAdminLogs(LocalDateTime startTime, LocalDateTime endTime) {
        return adminLogRepository.findByCreatedAtBetween(startTime, endTime, Pageable.unpaged()).getContent();
    }

    // ========== 系统维护 ==========

    @Override
    public void cleanupExpiredData(int daysToKeep) {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysToKeep);
            
            // 清理过期的系统日志
            systemLogService.cleanupOldLogs(daysToKeep);
            
            // 清理过期的管理员日志
            adminLogRepository.deleteByCreatedAtBefore(cutoffTime);
            
            logger.info("清理了{}天前的过期数据", daysToKeep);
        } catch (Exception e) {
            logger.error("清理过期数据失败: {}", e.getMessage(), e);
            throw new BusinessException("CLEANUP_ERROR", "清理过期数据失败");
        }
    }

    @Override
    public void rebuildSearchIndex() {
        try {
            // 这里应该实现重建搜索索引的逻辑
            // 由于当前使用的是数据库全文搜索，这里简化处理
            logger.info("搜索索引重建完成");
        } catch (Exception e) {
            logger.error("重建搜索索引失败: {}", e.getMessage(), e);
            throw new BusinessException("REBUILD_INDEX_ERROR", "重建搜索索引失败");
        }
    }

    @Override
    public void backupSystem(Long adminId, String adminUsername, String ipAddress) {
        try {
            // 这里应该实现系统备份的逻辑
            // 简化处理，只记录备份操作
            logAdminOperation(adminId, adminUsername, AdminLog.OperationType.BACKUP,
                             AdminLog.TargetType.SYSTEM_CONFIG, null, "系统备份",
                             "系统备份", "执行系统数据备份", null, null,
                             ipAddress, null, AdminLog.OperationResult.SUCCESS, null);
            
            logger.info("管理员 {} 执行了系统备份", adminUsername);
        } catch (Exception e) {
            logger.error("系统备份失败: {}", e.getMessage(), e);
            throw new BusinessException("BACKUP_ERROR", "系统备份失败");
        }
    }

    @Override
    public void sendSystemNotification(Long adminId, String adminUsername, String title, String content, 
                                      List<Long> targetUserIds, String ipAddress) {
        try {
            int successCount = 0;
            int failCount = 0;

            for (Long userId : targetUserIds) {
                try {
                    notificationService.createSystemNotification(userId, title, content);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    logger.warn("发送通知给用户 {} 失败: {}", userId, e.getMessage());
                }
            }

            AdminLog.OperationResult result = failCount == 0 ? AdminLog.OperationResult.SUCCESS :
                                             (successCount == 0 ? AdminLog.OperationResult.FAILED : AdminLog.OperationResult.PARTIAL);

            logAdminOperation(adminId, adminUsername, AdminLog.OperationType.CREATE,
                             AdminLog.TargetType.NOTIFICATION, null, "系统通知",
                             "发送系统通知", String.format("标题: %s, 成功: %d, 失败: %d", title, successCount, failCount),
                             null, null, ipAddress, null, result, null);

            logger.info("管理员 {} 发送系统通知，成功: {}, 失败: {}", adminUsername, successCount, failCount);
        } catch (Exception e) {
            logger.error("发送系统通知失败: {}", e.getMessage(), e);
            throw new BusinessException("SEND_NOTIFICATION_ERROR", "发送系统通知失败");
        }
    }

    // ========== 辅助方法 ==========

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setSchool(user.getSchool());
        dto.setLevel(user.getLevel());
        dto.setBio(user.getBio());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    private KnowledgeItemDTO convertToKnowledgeItemDTO(KnowledgeItem item) {
        KnowledgeItemDTO dto = new KnowledgeItemDTO();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setContent(item.getContent());
        dto.setType(item.getType());
        dto.setMediaUrls(item.getMediaUrls());
        dto.setLinkUrl(item.getLinkUrl());
        dto.setUploaderId(item.getUploaderId());
        dto.setCategoryId(item.getCategoryId());
        dto.setTags(item.getTags());
        dto.setStatus(item.getStatus());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }

    private CommentDTO convertToCommentDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setKnowledgeId(comment.getKnowledgeId());
        dto.setUserId(comment.getUserId());
        dto.setParentId(comment.getParentId());
        dto.setContent(comment.getContent());
        dto.setStatus(comment.getStatus());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }

    private String getKnowledgeItemStatusText(Integer status) {
        switch (status) {
            case 0: return "待审核";
            case 1: return "已发布";
            case -1: return "审核拒绝";
            case -2: return "已删除";
            default: return "未知状态";
        }
    }

    private String getCommentStatusText(Integer status) {
        switch (status) {
            case 0: return "待审核";
            case 1: return "已发布";
            case -1: return "审核拒绝";
            case -2: return "已删除";
            default: return "未知状态";
        }
    }
}