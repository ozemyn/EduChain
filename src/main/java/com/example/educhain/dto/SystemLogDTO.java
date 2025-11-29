package com.example.educhain.dto;

import com.example.educhain.entity.SystemLog;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/** 系统日志DTO */
public class SystemLogDTO {

  private Long id;
  private SystemLog.LogType logType;
  private SystemLog.LogLevel level;
  private Long userId;
  private String username;
  private String operation;
  private String description;
  private String ipAddress;
  private String userAgent;
  private String requestUrl;
  private String requestMethod;
  private Integer responseStatus;
  private Long executionTime;
  private String exception;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createdAt;

  // 默认构造函数
  public SystemLogDTO() {}

  // 从实体转换的构造函数
  public SystemLogDTO(SystemLog systemLog) {
    this.id = systemLog.getId();
    this.logType = systemLog.getLogType();
    this.level = systemLog.getLevel();
    this.userId = systemLog.getUserId();
    this.username = systemLog.getUsername();
    this.operation = systemLog.getOperation();
    this.description = systemLog.getDescription();
    this.ipAddress = systemLog.getIpAddress();
    this.userAgent = systemLog.getUserAgent();
    this.requestUrl = systemLog.getRequestUrl();
    this.requestMethod = systemLog.getRequestMethod();
    this.responseStatus = systemLog.getResponseStatus();
    this.executionTime = systemLog.getExecutionTime();
    this.exception = systemLog.getException();
    this.createdAt = systemLog.getCreatedAt();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public SystemLog.LogType getLogType() {
    return logType;
  }

  public void setLogType(SystemLog.LogType logType) {
    this.logType = logType;
  }

  public SystemLog.LogLevel getLevel() {
    return level;
  }

  public void setLevel(SystemLog.LogLevel level) {
    this.level = level;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
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

  public String getRequestUrl() {
    return requestUrl;
  }

  public void setRequestUrl(String requestUrl) {
    this.requestUrl = requestUrl;
  }

  public String getRequestMethod() {
    return requestMethod;
  }

  public void setRequestMethod(String requestMethod) {
    this.requestMethod = requestMethod;
  }

  public Integer getResponseStatus() {
    return responseStatus;
  }

  public void setResponseStatus(Integer responseStatus) {
    this.responseStatus = responseStatus;
  }

  public Long getExecutionTime() {
    return executionTime;
  }

  public void setExecutionTime(Long executionTime) {
    this.executionTime = executionTime;
  }

  public String getException() {
    return exception;
  }

  public void setException(String exception) {
    this.exception = exception;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
