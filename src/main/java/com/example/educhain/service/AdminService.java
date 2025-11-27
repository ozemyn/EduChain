package com.example.educhain.service;

import com.example.educhain.dto.UserDTO;
import com.example.educhain.dto.KnowledgeItemDTO;
import com.example.educhain.dto.CommentDTO;
import com.example.educhain.entity.AdminLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 管理员服务接口
 */
public interface AdminService {

    // ========== 用户管理 ==========
    
    /**
     * 获取所有用户列表
     */
    Page<UserDTO> getAllUsers(String keyword, Integer status, Pageable pageable);

    /**
     * 禁用用户
     */
    void disableUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress);

    /**
     * 启用用户
     */
    void enableUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress);

    /**
     * 重置用户密码
     */
    void resetUserPassword(Long adminId, String adminUsername, Long userId, String newPassword, String ipAddress);

    /**
     * 删除用户（软删除）
     */
    void deleteUser(Long adminId, String adminUsername, Long userId, String reason, String ipAddress);

    // ========== 内容管理 ==========

    /**
     * 获取待审核的知识内容
     */
    Page<KnowledgeItemDTO> getPendingKnowledgeItems(Pageable pageable);

    /**
     * 审核通过知识内容
     */
    void approveKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress);

    /**
     * 审核拒绝知识内容
     */
    void rejectKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress);

    /**
     * 删除知识内容
     */
    void deleteKnowledgeItem(Long adminId, String adminUsername, Long knowledgeId, String reason, String ipAddress);

    /**
     * 批量删除知识内容
     */
    void batchDeleteKnowledgeItems(Long adminId, String adminUsername, List<Long> knowledgeIds, String reason, String ipAddress);

    // ========== 评论管理 ==========

    /**
     * 获取待审核的评论
     */
    Page<CommentDTO> getPendingComments(Pageable pageable);

    /**
     * 审核通过评论
     */
    void approveComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress);

    /**
     * 审核拒绝评论
     */
    void rejectComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress);

    /**
     * 删除评论
     */
    void deleteComment(Long adminId, String adminUsername, Long commentId, String reason, String ipAddress);

    // ========== 系统监控 ==========

    /**
     * 获取系统统计信息
     */
    Map<String, Object> getSystemStatistics();

    /**
     * 获取用户统计信息
     */
    Map<String, Object> getUserStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取内容统计信息
     */
    Map<String, Object> getContentStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取系统性能指标
     */
    Map<String, Object> getPerformanceMetrics();

    /**
     * 获取系统健康状态
     */
    Map<String, Object> getSystemHealth();

    // ========== 管理员日志 ==========

    /**
     * 记录管理员操作日志
     */
    void logAdminOperation(Long adminId, String adminUsername, AdminLog.OperationType operationType,
                          AdminLog.TargetType targetType, Long targetId, String targetName,
                          String operation, String description, String oldValue, String newValue,
                          String ipAddress, String userAgent, AdminLog.OperationResult result, String errorMessage);

    /**
     * 查询管理员日志
     */
    Page<AdminLog> getAdminLogs(Long adminId, String adminUsername, AdminLog.OperationType operationType,
                               AdminLog.TargetType targetType, AdminLog.OperationResult result,
                               LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 获取管理员操作统计
     */
    Map<String, Object> getAdminOperationStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取最活跃的管理员
     */
    List<Map<String, Object>> getMostActiveAdmins(LocalDateTime startTime, LocalDateTime endTime, int limit);

    /**
     * 获取失败的操作记录
     */
    List<AdminLog> getFailedOperations(int limit);

    // ========== 数据导出 ==========

    /**
     * 导出用户数据
     */
    List<UserDTO> exportUsers(String keyword, Integer status);

    /**
     * 导出知识内容数据
     */
    List<KnowledgeItemDTO> exportKnowledgeItems(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 导出管理员日志
     */
    List<AdminLog> exportAdminLogs(LocalDateTime startTime, LocalDateTime endTime);

    // ========== 系统维护 ==========

    /**
     * 清理过期数据
     */
    void cleanupExpiredData(int daysToKeep);

    /**
     * 重建搜索索引
     */
    void rebuildSearchIndex();

    /**
     * 系统备份
     */
    void backupSystem(Long adminId, String adminUsername, String ipAddress);

    /**
     * 发送系统通知
     */
    void sendSystemNotification(Long adminId, String adminUsername, String title, String content, 
                               List<Long> targetUserIds, String ipAddress);
}