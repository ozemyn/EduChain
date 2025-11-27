package com.example.educhain.service;

import com.example.educhain.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 通知服务接口
 */
public interface NotificationService {

    /**
     * 创建点赞通知
     */
    void createLikeNotification(Long knowledgeId, Long authorId, Long likerId);

    /**
     * 创建评论通知
     */
    void createCommentNotification(Long knowledgeId, Long authorId, Long commenterId, Long commentId);

    /**
     * 创建回复通知
     */
    void createReplyNotification(Long knowledgeId, Long parentCommentUserId, Long replierId, Long commentId);

    /**
     * 创建关注通知
     */
    void createFollowNotification(Long followedUserId, Long followerId);

    /**
     * 创建系统通知
     */
    void createSystemNotification(String title, String content);

    /**
     * 创建系统通知（指定用户）
     */
    void createSystemNotification(Long userId, String title, String content);

    /**
     * 批量创建系统通知
     */
    void createBatchSystemNotification(List<Long> userIds, String title, String content);

    /**
     * 获取用户的所有通知
     */
    Page<Notification> getUserNotifications(Long userId, Pageable pageable);

    /**
     * 获取用户的未读通知
     */
    Page<Notification> getUnreadNotifications(Long userId, Pageable pageable);

    /**
     * 获取用户特定类型的通知
     */
    Page<Notification> getNotificationsByType(Long userId, Notification.NotificationType type, Pageable pageable);

    /**
     * 获取用户特定类型的未读通知
     */
    Page<Notification> getUnreadNotificationsByType(Long userId, Notification.NotificationType type, Pageable pageable);

    /**
     * 统计用户的未读通知数量
     */
    long getUnreadNotificationCount(Long userId);

    /**
     * 统计用户特定类型的未读通知数量
     */
    long getUnreadNotificationCountByType(Long userId, Notification.NotificationType type);

    /**
     * 标记通知为已读
     */
    void markAsRead(Long notificationId, Long userId);

    /**
     * 批量标记用户的所有通知为已读
     */
    int markAllAsRead(Long userId);

    /**
     * 批量标记用户特定类型的通知为已读
     */
    int markAllAsReadByType(Long userId, Notification.NotificationType type);

    /**
     * 删除通知
     */
    void deleteNotification(Long notificationId, Long userId);

    /**
     * 删除用户的所有通知
     */
    void deleteAllUserNotifications(Long userId);

    /**
     * 删除用户特定类型的通知
     */
    void deleteUserNotificationsByType(Long userId, Notification.NotificationType type);

    /**
     * 获取用户最近的通知
     */
    List<Notification> getRecentNotifications(Long userId, int limit);

    /**
     * 获取用户最近的未读通知
     */
    List<Notification> getRecentUnreadNotifications(Long userId, int limit);

    /**
     * 获取系统通知
     */
    Page<Notification> getSystemNotifications(Pageable pageable);

    /**
     * 获取通知统计信息
     */
    Map<String, Long> getNotificationStats(Long userId);

    /**
     * 获取系统通知统计
     */
    Map<String, Long> getSystemNotificationStats();

    /**
     * 清理过期通知
     */
    void cleanupExpiredNotifications(LocalDateTime beforeTime);

    /**
     * 检查是否存在重复通知（防重复）
     */
    boolean isDuplicateNotification(Long userId, Notification.NotificationType type, 
                                   Long relatedId, Long relatedUserId, LocalDateTime afterTime);

    /**
     * 获取活跃的通知接收者
     */
    List<Map<String, Object>> getActiveNotificationReceivers(LocalDateTime startTime, int limit);

    /**
     * 获取通知详情
     */
    Notification getNotificationById(Long notificationId);

    /**
     * 检查用户是否有权限访问通知
     */
    boolean canAccessNotification(Long notificationId, Long userId);
}