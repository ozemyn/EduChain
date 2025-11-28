package com.example.educhain.controller;

import com.example.educhain.dto.NotificationDTO;
import com.example.educhain.entity.Notification;
import com.example.educhain.service.NotificationService;
import com.example.educhain.util.JwtUtil;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 通知控制器
 */
@RestController
@RequestMapping("/notifications")
@Tag(name = "通知管理", description = "通知相关接口")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 获取用户的所有通知
     */
    @GetMapping
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取用户通知", description = "获取当前用户的所有通知")
    public ResponseEntity<Result<Page<Notification>>> getUserNotifications(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getUserNotifications(userId, pageable);
            return ResponseEntity.ok(Result.success(notifications));
        } catch (Exception e) {
            logger.error("获取用户通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_USER_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的未读通知
     */
    @GetMapping("/unread")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取未读通知", description = "获取当前用户的未读通知")
    public ResponseEntity<Result<Page<Notification>>> getUnreadNotifications(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getUnreadNotifications(userId, pageable);
            return ResponseEntity.ok(Result.success(notifications));
        } catch (Exception e) {
            logger.error("获取未读通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_UNREAD_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取特定类型的通知
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取特定类型通知", description = "获取当前用户特定类型的通知")
    public ResponseEntity<Result<Page<Notification>>> getNotificationsByType(
            @Parameter(description = "通知类型") @PathVariable Notification.NotificationType type,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "只看未读") @RequestParam(defaultValue = "false") boolean unreadOnly,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications;
            
            if (unreadOnly) {
                notifications = notificationService.getUnreadNotificationsByType(userId, type, pageable);
            } else {
                notifications = notificationService.getNotificationsByType(userId, type, pageable);
            }
            
            return ResponseEntity.ok(Result.success(notifications));
        } catch (Exception e) {
            logger.error("获取特定类型通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_NOTIFICATIONS_BY_TYPE_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取通知详情
     */
    @GetMapping("/{notificationId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取通知详情", description = "获取指定通知的详细信息")
    public ResponseEntity<Result<Notification>> getNotification(
            @Parameter(description = "通知ID") @PathVariable Long notificationId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            
            // 检查权限
            if (!notificationService.canAccessNotification(notificationId, userId)) {
                return ResponseEntity.badRequest().body(Result.error("NO_PERMISSION", "无权限访问该通知"));
            }
            
            Notification notification = notificationService.getNotificationById(notificationId);
            return ResponseEntity.ok(Result.success(notification));
        } catch (Exception e) {
            logger.error("获取通知详情失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_NOTIFICATION_FAILED", e.getMessage()));
        }
    }

    /**
     * 标记通知为已读
     */
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "标记通知为已读", description = "将指定通知标记为已读")
    public ResponseEntity<Result<Void>> markAsRead(
            @Parameter(description = "通知ID") @PathVariable Long notificationId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            notificationService.markAsRead(notificationId, userId);
            return ResponseEntity.ok(Result.<Void>success("通知已标记为已读", null));
        } catch (Exception e) {
            logger.error("标记通知为已读失败", e);
            return ResponseEntity.badRequest().body(Result.error("MARK_AS_READ_FAILED", e.getMessage()));
        }
    }

    /**
     * 批量标记所有通知为已读
     */
    @PutMapping("/read-all")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "标记所有通知为已读", description = "将当前用户的所有通知标记为已读")
    public ResponseEntity<Result<Map<String, Integer>>> markAllAsRead(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            int updatedCount = notificationService.markAllAsRead(userId);
            Map<String, Integer> result = Map.of("updatedCount", updatedCount);
            return ResponseEntity.ok(Result.success("所有通知已标记为已读", result));
        } catch (Exception e) {
            logger.error("批量标记通知为已读失败", e);
            return ResponseEntity.badRequest().body(Result.error("MARK_ALL_AS_READ_FAILED", e.getMessage()));
        }
    }

    /**
     * 批量标记特定类型通知为已读
     */
    @PutMapping("/read-all/{type}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "标记特定类型通知为已读", description = "将当前用户特定类型的通知标记为已读")
    public ResponseEntity<Result<Map<String, Integer>>> markAllAsReadByType(
            @Parameter(description = "通知类型") @PathVariable Notification.NotificationType type,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            int updatedCount = notificationService.markAllAsReadByType(userId, type);
            Map<String, Integer> result = Map.of("updatedCount", updatedCount);
            return ResponseEntity.ok(Result.success("特定类型通知已标记为已读", result));
        } catch (Exception e) {
            logger.error("批量标记特定类型通知为已读失败", e);
            return ResponseEntity.badRequest().body(Result.error("MARK_ALL_AS_READ_BY_TYPE_FAILED", e.getMessage()));
        }
    }

    /**
     * 删除通知
     */
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "删除通知", description = "删除指定的通知")
    public ResponseEntity<Result<Void>> deleteNotification(
            @Parameter(description = "通知ID") @PathVariable Long notificationId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            notificationService.deleteNotification(notificationId, userId);
            return ResponseEntity.ok(Result.<Void>success("通知删除成功", null));
        } catch (Exception e) {
            logger.error("删除通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("DELETE_NOTIFICATION_FAILED", e.getMessage()));
        }
    }

    /**
     * 删除所有通知
     */
    @DeleteMapping("/all")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "删除所有通知", description = "删除当前用户的所有通知")
    public ResponseEntity<Result<Void>> deleteAllNotifications(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            notificationService.deleteAllUserNotifications(userId);
            return ResponseEntity.ok(Result.<Void>success("所有通知删除成功", null));
        } catch (Exception e) {
            logger.error("删除所有通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("DELETE_ALL_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 删除特定类型的通知
     */
    @DeleteMapping("/type/{type}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "删除特定类型通知", description = "删除当前用户特定类型的通知")
    public ResponseEntity<Result<Void>> deleteNotificationsByType(
            @Parameter(description = "通知类型") @PathVariable Notification.NotificationType type,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            notificationService.deleteUserNotificationsByType(userId, type);
            return ResponseEntity.ok(Result.<Void>success("特定类型通知删除成功", null));
        } catch (Exception e) {
            logger.error("删除特定类型通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("DELETE_NOTIFICATIONS_BY_TYPE_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取未读通知数量
     */
    @GetMapping("/unread/count")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取未读通知数量", description = "获取当前用户的未读通知数量")
    public ResponseEntity<Result<Map<String, Long>>> getUnreadNotificationCount(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            long unreadCount = notificationService.getUnreadNotificationCount(userId);
            Map<String, Long> result = Map.of("unreadCount", unreadCount);
            return ResponseEntity.ok(Result.success(result));
        } catch (Exception e) {
            logger.error("获取未读通知数量失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_UNREAD_COUNT_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取通知统计
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取通知统计", description = "获取当前用户的通知统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getNotificationStats(HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            Map<String, Long> stats = notificationService.getNotificationStats(userId);
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取通知统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_NOTIFICATION_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取最近通知
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "获取最近通知", description = "获取当前用户的最近通知")
    public ResponseEntity<Result<List<Notification>>> getRecentNotifications(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "只看未读") @RequestParam(defaultValue = "false") boolean unreadOnly,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            List<Notification> notifications;
            
            if (unreadOnly) {
                notifications = notificationService.getRecentUnreadNotifications(userId, limit);
            } else {
                notifications = notificationService.getRecentNotifications(userId, limit);
            }
            
            return ResponseEntity.ok(Result.success(notifications));
        } catch (Exception e) {
            logger.error("获取最近通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_RECENT_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    // 管理员接口

    /**
     * 创建系统通知
     */
    @PostMapping("/admin/system")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "创建系统通知", description = "管理员创建系统通知")
    public ResponseEntity<Result<Void>> createSystemNotification(
            @Parameter(description = "通知标题") @RequestParam @NotBlank @Size(min = 1, max = 200) String title,
            @Parameter(description = "通知内容") @RequestParam @NotBlank @Size(min = 1, max = 1000) String content) {
        try {
            notificationService.createSystemNotification(title, content);
            return ResponseEntity.ok(Result.<Void>success("系统通知创建成功", null));
        } catch (Exception e) {
            logger.error("创建系统通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("CREATE_SYSTEM_NOTIFICATION_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取系统通知
     */
    @GetMapping("/admin/system")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取系统通知", description = "管理员获取系统通知列表")
    public ResponseEntity<Result<Page<Notification>>> getSystemNotifications(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationService.getSystemNotifications(pageable);
            return ResponseEntity.ok(Result.success(notifications));
        } catch (Exception e) {
            logger.error("获取系统通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_SYSTEM_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取系统通知统计
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取系统通知统计", description = "管理员获取系统通知统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getSystemNotificationStats() {
        try {
            Map<String, Long> stats = notificationService.getSystemNotificationStats();
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取系统通知统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_SYSTEM_NOTIFICATION_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 清理过期通知
     */
    @DeleteMapping("/admin/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "清理过期通知", description = "管理员清理过期的通知")
    public ResponseEntity<Result<Void>> cleanupExpiredNotifications(
            @Parameter(description = "保留天数") @RequestParam(defaultValue = "30") int days) {
        try {
            LocalDateTime beforeTime = LocalDateTime.now().minusDays(days);
            notificationService.cleanupExpiredNotifications(beforeTime);
            return ResponseEntity.ok(Result.<Void>success("过期通知清理成功", null));
        } catch (Exception e) {
            logger.error("清理过期通知失败", e);
            return ResponseEntity.badRequest().body(Result.error("CLEANUP_NOTIFICATIONS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取活跃通知接收者
     */
    @GetMapping("/admin/active-receivers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取活跃通知接收者", description = "管理员获取活跃的通知接收者")
    public ResponseEntity<Result<List<Map<String, Object>>>> getActiveNotificationReceivers(
            @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            LocalDateTime startTime = LocalDateTime.now().minusDays(days);
            List<Map<String, Object>> activeReceivers = notificationService.getActiveNotificationReceivers(startTime, limit);
            return ResponseEntity.ok(Result.success(activeReceivers));
        } catch (Exception e) {
            logger.error("获取活跃通知接收者失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_ACTIVE_RECEIVERS_FAILED", e.getMessage()));
        }
    }
}