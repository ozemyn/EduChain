package com.example.educhain.repository;

import com.example.educhain.entity.Notification;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 通知Repository接口 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  /** 获取用户的所有通知 */
  Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  /** 获取用户的未读通知 */
  Page<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(
      Long userId, Boolean isRead, Pageable pageable);

  /** 获取用户特定类型的通知 */
  Page<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(
      Long userId, Notification.NotificationType type, Pageable pageable);

  /** 获取用户特定类型的未读通知 */
  Page<Notification> findByUserIdAndTypeAndIsReadOrderByCreatedAtDesc(
      Long userId, Notification.NotificationType type, Boolean isRead, Pageable pageable);

  /** 统计用户的未读通知数量 */
  long countByUserIdAndIsRead(Long userId, Boolean isRead);

  /** 统计用户特定类型的未读通知数量 */
  long countByUserIdAndTypeAndIsRead(
      Long userId, Notification.NotificationType type, Boolean isRead);

  /** 获取用户最近的通知 */
  List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

  /** 获取用户最近的未读通知 */
  List<Notification> findTop10ByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);

  /** 查找指定时间范围内的通知 */
  List<Notification> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);

  /** 查找用户在指定时间范围内的通知 */
  List<Notification> findByUserIdAndCreatedAtBetween(
      Long userId, LocalDateTime startTime, LocalDateTime endTime);

  /** 批量标记用户的通知为已读 */
  @Modifying
  @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
  int markAllAsReadByUserId(@Param("userId") Long userId);

  /** 批量标记用户特定类型的通知为已读 */
  @Modifying
  @Query(
      "UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.type = :type AND n.isRead = false")
  int markAllAsReadByUserIdAndType(
      @Param("userId") Long userId, @Param("type") Notification.NotificationType type);

  /** 标记单个通知为已读 */
  @Modifying
  @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.userId = :userId")
  int markAsReadById(@Param("id") Long id, @Param("userId") Long userId);

  /** 删除用户的所有通知 */
  void deleteByUserId(Long userId);

  /** 删除用户特定类型的通知 */
  void deleteByUserIdAndType(Long userId, Notification.NotificationType type);

  /** 删除指定时间之前的通知 */
  void deleteByCreatedAtBefore(LocalDateTime time);

  /** 获取系统通知 */
  Page<Notification> findByTypeOrderByCreatedAtDesc(
      Notification.NotificationType type, Pageable pageable);

  /** 检查是否存在相同的通知（防重复） */
  boolean existsByUserIdAndTypeAndRelatedIdAndRelatedUserIdAndCreatedAtAfter(
      Long userId,
      Notification.NotificationType type,
      Long relatedId,
      Long relatedUserId,
      LocalDateTime time);

  /** 获取通知统计信息 */
  @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.userId = :userId GROUP BY n.type")
  List<Object[]> getNotificationStatsByUserId(@Param("userId") Long userId);

  /** 获取系统通知统计 */
  @Query("SELECT n.type, COUNT(n) FROM Notification n GROUP BY n.type")
  List<Object[]> getSystemNotificationStats();

  /** 获取最活跃的通知接收者 */
  @Query(
      "SELECT n.userId, COUNT(n) as notificationCount "
          + "FROM Notification n "
          + "WHERE n.createdAt >= :startTime "
          + "GROUP BY n.userId "
          + "ORDER BY notificationCount DESC")
  List<Object[]> findActiveNotificationReceivers(
      @Param("startTime") LocalDateTime startTime, Pageable pageable);
}
