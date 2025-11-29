package com.example.educhain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 管理员操作日志实体类 */
@Entity
@Table(
    name = "admin_logs",
    indexes = {
      @Index(name = "idx_admin_id", columnList = "admin_id"),
      @Index(name = "idx_operation_type", columnList = "operation_type"),
      @Index(name = "idx_target_type", columnList = "target_type"),
      @Index(name = "idx_created_at", columnList = "created_at")
    })
@EntityListeners(AuditingEntityListener.class)
public class AdminLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "admin_id", nullable = false)
  private Long adminId;

  @Column(name = "admin_username", nullable = false, length = 50)
  private String adminUsername;

  @Enumerated(EnumType.STRING)
  @Column(name = "operation_type", nullable = false, length = 30)
  private OperationType operationType;

  @Enumerated(EnumType.STRING)
  @Column(name = "target_type", nullable = false, length = 30)
  private TargetType targetType;

  @Column(name = "target_id")
  private Long targetId;

  @Column(name = "target_name", length = 200)
  private String targetName;

  @Column(nullable = false, length = 200)
  private String operation;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "old_value", columnDefinition = "TEXT")
  private String oldValue;

  @Column(name = "new_value", columnDefinition = "TEXT")
  private String newValue;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "user_agent", length = 500)
  private String userAgent;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private OperationResult result;

  @Column(name = "error_message", columnDefinition = "TEXT")
  private String errorMessage;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  // 操作类型枚举
  public enum OperationType {
    CREATE("创建"),
    UPDATE("更新"),
    DELETE("删除"),
    APPROVE("审核通过"),
    REJECT("审核拒绝"),
    DISABLE("禁用"),
    ENABLE("启用"),
    EXPORT("导出"),
    IMPORT("导入"),
    BACKUP("备份"),
    RESTORE("恢复");

    private final String description;

    OperationType(String description) {
      this.description = description;
    }

    public String getDescription() {
      return description;
    }
  }

  // 目标类型枚举
  public enum TargetType {
    USER("用户"),
    KNOWLEDGE_ITEM("知识内容"),
    CATEGORY("分类"),
    COMMENT("评论"),
    TAG("标签"),
    SYSTEM_CONFIG("系统配置"),
    EXTERNAL_SOURCE("外部数据源"),
    NOTIFICATION("通知"),
    LOG("日志");

    private final String description;

    TargetType(String description) {
      this.description = description;
    }

    public String getDescription() {
      return description;
    }
  }

  // 操作结果枚举
  public enum OperationResult {
    SUCCESS("成功"),
    FAILED("失败"),
    PARTIAL("部分成功");

    private final String description;

    OperationResult(String description) {
      this.description = description;
    }

    public String getDescription() {
      return description;
    }
  }

  // 默认构造函数
  public AdminLog() {}

  // 构造函数
  public AdminLog(
      Long adminId,
      String adminUsername,
      OperationType operationType,
      TargetType targetType,
      String operation,
      String description) {
    this.adminId = adminId;
    this.adminUsername = adminUsername;
    this.operationType = operationType;
    this.targetType = targetType;
    this.operation = operation;
    this.description = description;
    this.result = OperationResult.SUCCESS;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getAdminId() {
    return adminId;
  }

  public void setAdminId(Long adminId) {
    this.adminId = adminId;
  }

  public String getAdminUsername() {
    return adminUsername;
  }

  public void setAdminUsername(String adminUsername) {
    this.adminUsername = adminUsername;
  }

  public OperationType getOperationType() {
    return operationType;
  }

  public void setOperationType(OperationType operationType) {
    this.operationType = operationType;
  }

  public TargetType getTargetType() {
    return targetType;
  }

  public void setTargetType(TargetType targetType) {
    this.targetType = targetType;
  }

  public Long getTargetId() {
    return targetId;
  }

  public void setTargetId(Long targetId) {
    this.targetId = targetId;
  }

  public String getTargetName() {
    return targetName;
  }

  public void setTargetName(String targetName) {
    this.targetName = targetName;
  }

  public String getOperation() {
    return operation;
  }

  public void setOperation(String operation) {
    this.operation = operation;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getOldValue() {
    return oldValue;
  }

  public void setOldValue(String oldValue) {
    this.oldValue = oldValue;
  }

  public String getNewValue() {
    return newValue;
  }

  public void setNewValue(String newValue) {
    this.newValue = newValue;
  }

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }

  public String getUserAgent() {
    return userAgent;
  }

  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
  }

  public OperationResult getResult() {
    return result;
  }

  public void setResult(OperationResult result) {
    this.result = result;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public String toString() {
    return "AdminLog{"
        + "id="
        + id
        + ", adminId="
        + adminId
        + ", adminUsername='"
        + adminUsername
        + '\''
        + ", operationType="
        + operationType
        + ", targetType="
        + targetType
        + ", operation='"
        + operation
        + '\''
        + ", result="
        + result
        + ", createdAt="
        + createdAt
        + '}';
  }
}
