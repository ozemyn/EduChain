package com.example.educhain.service.impl;

import com.example.educhain.entity.Notification;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.NotificationRepository;
import com.example.educhain.repository.UserRepository;
import com.example.educhain.service.NotificationService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 通知服务实现类 */
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

  @Autowired private NotificationRepository notificationRepository;

  @Autowired private UserRepository userRepository;

  @Override
  public void createLikeNotification(Long knowledgeId, Long authorId, Long likerId) {
    if (knowledgeId == null || authorId == null || likerId == null) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    // 不给自己发通知
    if (authorId.equals(likerId)) {
      return;
    }

    // 检查是否存在重复通知（1小时内）
    LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
    if (isDuplicateNotification(
        authorId, Notification.NotificationType.LIKE, knowledgeId, likerId, oneHourAgo)) {
      return;
    }

    try {
      String title = "您的内容收到了点赞";
      String content = "有用户点赞了您的知识内容";

      Notification notification =
          new Notification(
              authorId, Notification.NotificationType.LIKE, title, content, knowledgeId, likerId);
      notificationRepository.save(notification);
      logger.debug(
          "创建点赞通知: authorId={}, likerId={}, knowledgeId={}", authorId, likerId, knowledgeId);
    } catch (Exception e) {
      logger.error("创建点赞通知失败", e);
      // 通知创建失败不抛出异常，不影响主流程
    }
  }

  @Override
  public void createCommentNotification(
      Long knowledgeId, Long authorId, Long commenterId, Long commentId) {
    if (knowledgeId == null || authorId == null || commenterId == null || commentId == null) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    // 不给自己发通知
    if (authorId.equals(commenterId)) {
      return;
    }

    try {
      String title = "您的内容收到了评论";
      String content = "有用户评论了您的知识内容";

      Notification notification =
          new Notification(
              authorId,
              Notification.NotificationType.COMMENT,
              title,
              content,
              knowledgeId,
              commenterId);
      notificationRepository.save(notification);
      logger.debug(
          "创建评论通知: authorId={}, commenterId={}, knowledgeId={}",
          authorId,
          commenterId,
          knowledgeId);
    } catch (Exception e) {
      logger.error("创建评论通知失败", e);
    }
  }

  @Override
  public void createReplyNotification(
      Long knowledgeId, Long parentCommentUserId, Long replierId, Long commentId) {
    if (knowledgeId == null
        || parentCommentUserId == null
        || replierId == null
        || commentId == null) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    // 不给自己发通知
    if (parentCommentUserId.equals(replierId)) {
      return;
    }

    try {
      String title = "您的评论收到了回复";
      String content = "有用户回复了您的评论";

      Notification notification =
          new Notification(
              parentCommentUserId,
              Notification.NotificationType.REPLY,
              title,
              content,
              commentId,
              replierId);
      notificationRepository.save(notification);
      logger.debug(
          "创建回复通知: parentUserId={}, replierId={}, commentId={}",
          parentCommentUserId,
          replierId,
          commentId);
    } catch (Exception e) {
      logger.error("创建回复通知失败", e);
    }
  }

  @Override
  public void createFollowNotification(Long followedUserId, Long followerId) {
    if (followedUserId == null || followerId == null) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    // 不给自己发通知
    if (followedUserId.equals(followerId)) {
      return;
    }

    try {
      String title = "您有新的关注者";
      String content = "有用户关注了您";

      Notification notification =
          new Notification(
              followedUserId,
              Notification.NotificationType.FOLLOW,
              title,
              content,
              null,
              followerId);
      notificationRepository.save(notification);
      logger.debug("创建关注通知: followedUserId={}, followerId={}", followedUserId, followerId);
    } catch (Exception e) {
      logger.error("创建关注通知失败", e);
    }
  }

  @Override
  public void createSystemNotification(String title, String content) {
    if (title == null || title.trim().isEmpty() || content == null || content.trim().isEmpty()) {
      throw new BusinessException("INVALID_PARAMS", "标题和内容不能为空");
    }

    try {
      // 获取所有活跃用户
      List<Long> activeUserIds =
          userRepository.findAll().stream()
              .filter(user -> user.getStatus() == 1) // 只给正常状态的用户发送
              .map(user -> user.getId())
              .collect(Collectors.toList());

      createBatchSystemNotification(activeUserIds, title.trim(), content.trim());
      logger.info("创建系统通知: title={}, 接收用户数={}", title, activeUserIds.size());
    } catch (Exception e) {
      logger.error("创建系统通知失败: title={}", title, e);
      throw new BusinessException("CREATE_SYSTEM_NOTIFICATION_FAILED", "创建系统通知失败");
    }
  }

  @Override
  public void createSystemNotification(Long userId, String title, String content) {
    if (userId == null
        || title == null
        || title.trim().isEmpty()
        || content == null
        || content.trim().isEmpty()) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    try {
      Notification notification =
          new Notification(
              userId, Notification.NotificationType.SYSTEM, title.trim(), content.trim());
      notificationRepository.save(notification);
      logger.debug("创建用户系统通知: userId={}, title={}", userId, title);
    } catch (Exception e) {
      logger.error("创建用户系统通知失败: userId={}, title={}", userId, title, e);
      throw new BusinessException("CREATE_USER_SYSTEM_NOTIFICATION_FAILED", "创建系统通知失败");
    }
  }

  @Override
  public void createBatchSystemNotification(List<Long> userIds, String title, String content) {
    if (userIds == null
        || userIds.isEmpty()
        || title == null
        || title.trim().isEmpty()
        || content == null
        || content.trim().isEmpty()) {
      throw new BusinessException("INVALID_PARAMS", "参数不能为空");
    }

    try {
      List<Notification> notifications =
          userIds.stream()
              .map(
                  userId ->
                      new Notification(
                          userId,
                          Notification.NotificationType.SYSTEM,
                          title.trim(),
                          content.trim()))
              .collect(Collectors.toList());

      notificationRepository.saveAll(notifications);
      logger.info("批量创建系统通知: title={}, 用户数={}", title, userIds.size());
    } catch (Exception e) {
      logger.error("批量创建系统通知失败: title={}, 用户数={}", title, userIds.size(), e);
      throw new BusinessException("CREATE_BATCH_SYSTEM_NOTIFICATION_FAILED", "批量创建系统通知失败");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Notification> getUnreadNotifications(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(
        userId, false, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Notification> getNotificationsByType(
      Long userId, Notification.NotificationType type, Pageable pageable) {
    if (userId == null || type == null) {
      throw new BusinessException("INVALID_PARAMS", "用户ID和通知类型不能为空");
    }
    return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Notification> getUnreadNotificationsByType(
      Long userId, Notification.NotificationType type, Pageable pageable) {
    if (userId == null || type == null) {
      throw new BusinessException("INVALID_PARAMS", "用户ID和通知类型不能为空");
    }
    return notificationRepository.findByUserIdAndTypeAndIsReadOrderByCreatedAtDesc(
        userId, type, false, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public long getUnreadNotificationCount(Long userId) {
    if (userId == null) {
      return 0;
    }
    return notificationRepository.countByUserIdAndIsRead(userId, false);
  }

  @Override
  @Transactional(readOnly = true)
  public long getUnreadNotificationCountByType(Long userId, Notification.NotificationType type) {
    if (userId == null || type == null) {
      return 0;
    }
    return notificationRepository.countByUserIdAndTypeAndIsRead(userId, type, false);
  }

  @Override
  public void markAsRead(Long notificationId, Long userId) {
    if (notificationId == null || userId == null) {
      throw new BusinessException("INVALID_PARAMS", "通知ID和用户ID不能为空");
    }

    try {
      int updated = notificationRepository.markAsReadById(notificationId, userId);
      if (updated == 0) {
        throw new BusinessException("NOTIFICATION_NOT_FOUND", "通知不存在或无权限访问");
      }
      logger.debug("标记通知为已读: notificationId={}, userId={}", notificationId, userId);
    } catch (BusinessException e) {
      throw e;
    } catch (Exception e) {
      logger.error("标记通知为已读失败: notificationId={}, userId={}", notificationId, userId, e);
      throw new BusinessException("MARK_AS_READ_FAILED", "标记通知为已读失败");
    }
  }

  @Override
  public int markAllAsRead(Long userId) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }

    try {
      int updated = notificationRepository.markAllAsReadByUserId(userId);
      logger.info("批量标记通知为已读: userId={}, 更新数量={}", userId, updated);
      return updated;
    } catch (Exception e) {
      logger.error("批量标记通知为已读失败: userId={}", userId, e);
      throw new BusinessException("MARK_ALL_AS_READ_FAILED", "批量标记通知为已读失败");
    }
  }

  @Override
  public int markAllAsReadByType(Long userId, Notification.NotificationType type) {
    if (userId == null || type == null) {
      throw new BusinessException("INVALID_PARAMS", "用户ID和通知类型不能为空");
    }

    try {
      int updated = notificationRepository.markAllAsReadByUserIdAndType(userId, type);
      logger.info("批量标记特定类型通知为已读: userId={}, type={}, 更新数量={}", userId, type, updated);
      return updated;
    } catch (Exception e) {
      logger.error("批量标记特定类型通知为已读失败: userId={}, type={}", userId, type, e);
      throw new BusinessException("MARK_ALL_AS_READ_BY_TYPE_FAILED", "批量标记通知为已读失败");
    }
  }

  @Override
  public void deleteNotification(Long notificationId, Long userId) {
    if (notificationId == null || userId == null) {
      throw new BusinessException("INVALID_PARAMS", "通知ID和用户ID不能为空");
    }

    try {
      Notification notification =
          notificationRepository
              .findById(notificationId)
              .orElseThrow(() -> new BusinessException("NOTIFICATION_NOT_FOUND", "通知不存在"));

      if (!notification.getUserId().equals(userId)) {
        throw new BusinessException("NO_PERMISSION", "无权限删除该通知");
      }

      notificationRepository.delete(notification);
      logger.debug("删除通知: notificationId={}, userId={}", notificationId, userId);
    } catch (BusinessException e) {
      throw e;
    } catch (Exception e) {
      logger.error("删除通知失败: notificationId={}, userId={}", notificationId, userId, e);
      throw new BusinessException("DELETE_NOTIFICATION_FAILED", "删除通知失败");
    }
  }

  @Override
  public void deleteAllUserNotifications(Long userId) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }

    try {
      notificationRepository.deleteByUserId(userId);
      logger.info("删除用户所有通知: userId={}", userId);
    } catch (Exception e) {
      logger.error("删除用户所有通知失败: userId={}", userId, e);
      throw new BusinessException("DELETE_ALL_NOTIFICATIONS_FAILED", "删除所有通知失败");
    }
  }

  @Override
  public void deleteUserNotificationsByType(Long userId, Notification.NotificationType type) {
    if (userId == null || type == null) {
      throw new BusinessException("INVALID_PARAMS", "用户ID和通知类型不能为空");
    }

    try {
      notificationRepository.deleteByUserIdAndType(userId, type);
      logger.info("删除用户特定类型通知: userId={}, type={}", userId, type);
    } catch (Exception e) {
      logger.error("删除用户特定类型通知失败: userId={}, type={}", userId, type, e);
      throw new BusinessException("DELETE_NOTIFICATIONS_BY_TYPE_FAILED", "删除特定类型通知失败");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<Notification> getRecentNotifications(Long userId, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Notification> getRecentUnreadNotifications(Long userId, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return notificationRepository.findTop10ByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Notification> getSystemNotifications(Pageable pageable) {
    return notificationRepository.findByTypeOrderByCreatedAtDesc(
        Notification.NotificationType.SYSTEM, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Long> getNotificationStats(Long userId) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }

    List<Object[]> results = notificationRepository.getNotificationStatsByUserId(userId);
    Map<String, Long> stats = new HashMap<>();

    for (Object[] result : results) {
      Notification.NotificationType type = (Notification.NotificationType) result[0];
      Long count = (Long) result[1];
      stats.put(type.name().toLowerCase(), count);
    }

    stats.put("unread", getUnreadNotificationCount(userId));
    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Long> getSystemNotificationStats() {
    List<Object[]> results = notificationRepository.getSystemNotificationStats();
    Map<String, Long> stats = new HashMap<>();

    for (Object[] result : results) {
      Notification.NotificationType type = (Notification.NotificationType) result[0];
      Long count = (Long) result[1];
      stats.put(type.name().toLowerCase(), count);
    }

    return stats;
  }

  @Override
  public void cleanupExpiredNotifications(LocalDateTime beforeTime) {
    if (beforeTime == null) {
      beforeTime = LocalDateTime.now().minusDays(30); // 默认删除30天前的通知
    }

    try {
      notificationRepository.deleteByCreatedAtBefore(beforeTime);
      logger.info("清理过期通知: beforeTime={}", beforeTime);
    } catch (Exception e) {
      logger.error("清理过期通知失败: beforeTime={}", beforeTime, e);
      throw new BusinessException("CLEANUP_NOTIFICATIONS_FAILED", "清理过期通知失败");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isDuplicateNotification(
      Long userId,
      Notification.NotificationType type,
      Long relatedId,
      Long relatedUserId,
      LocalDateTime afterTime) {
    if (userId == null || type == null || afterTime == null) {
      return false;
    }
    return notificationRepository
        .existsByUserIdAndTypeAndRelatedIdAndRelatedUserIdAndCreatedAtAfter(
            userId, type, relatedId, relatedUserId, afterTime);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getActiveNotificationReceivers(
      LocalDateTime startTime, int limit) {
    if (startTime == null) {
      startTime = LocalDateTime.now().minusDays(7); // 默认最近7天
    }

    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results =
        notificationRepository.findActiveNotificationReceivers(startTime, pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> receiver = new HashMap<>();
              receiver.put("userId", result[0]);
              receiver.put("notificationCount", result[1]);
              return receiver;
            })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public Notification getNotificationById(Long notificationId) {
    if (notificationId == null) {
      throw new BusinessException("NOTIFICATION_ID_NULL", "通知ID不能为空");
    }
    return notificationRepository
        .findById(notificationId)
        .orElseThrow(() -> new BusinessException("NOTIFICATION_NOT_FOUND", "通知不存在"));
  }

  @Override
  @Transactional(readOnly = true)
  public boolean canAccessNotification(Long notificationId, Long userId) {
    if (notificationId == null || userId == null) {
      return false;
    }

    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    return notification != null && notification.getUserId().equals(userId);
  }
}
