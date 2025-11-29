package com.example.educhain.dto;

import com.example.educhain.entity.SystemLog;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/** 日志查询请求DTO */
public class LogQueryRequest {

  private SystemLog.LogType logType;
  private SystemLog.LogLevel level;
  private Long userId;
  private String username;
  private String operation;
  private String ipAddress;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime startTime;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime endTime;

  private Integer page = 0;
  private Integer size = 20;

  // 默认构造函数
  public LogQueryRequest() {}

  // Getters and Setters
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

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }

  public LocalDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }

  public Integer getPage() {
    return page;
  }

  public void setPage(Integer page) {
    this.page = page;
  }

  public Integer getSize() {
    return size;
  }

  public void setSize(Integer size) {
    this.size = size;
  }
}
