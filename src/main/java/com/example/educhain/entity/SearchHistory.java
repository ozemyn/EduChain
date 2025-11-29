package com.example.educhain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 搜索历史实体类 用于记录用户的搜索行为 */
@Entity
@Table(
    name = "search_history",
    indexes = {
      @Index(name = "idx_user_id", columnList = "user_id"),
      @Index(name = "idx_keyword", columnList = "keyword"),
      @Index(name = "idx_search_time", columnList = "search_time"),
      @Index(name = "idx_ip_address", columnList = "ip_address")
    })
@EntityListeners(AuditingEntityListener.class)
public class SearchHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id")
  private Long userId; // 可为空，支持匿名搜索

  @Column(name = "keyword", nullable = false, length = 100)
  private String keyword;

  @Column(name = "result_count", nullable = false)
  private Long resultCount = 0L;

  @Column(name = "category_id")
  private Long categoryId;

  @Enumerated(EnumType.STRING)
  @Column(name = "content_type", length = 20)
  private KnowledgeItem.ContentType contentType;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "user_agent", length = 500)
  private String userAgent;

  @Column(name = "search_time", nullable = false)
  @CreatedDate
  private LocalDateTime searchTime;

  @Column(name = "response_time")
  private Long responseTime; // 搜索响应时间（毫秒）

  @Column(name = "clicked_result_id")
  private Long clickedResultId; // 用户点击的结果ID

  @Column(name = "clicked_position")
  private Integer clickedPosition; // 点击结果在搜索结果中的位置

  @Column(name = "session_id", length = 100)
  private String sessionId;

  // 默认构造函数
  public SearchHistory() {}

  // 构造函数
  public SearchHistory(String keyword, Long resultCount, String ipAddress) {
    this.keyword = keyword;
    this.resultCount = resultCount;
    this.ipAddress = ipAddress;
    this.searchTime = LocalDateTime.now();
  }

  public SearchHistory(
      Long userId,
      String keyword,
      Long resultCount,
      Long categoryId,
      String ipAddress,
      String sessionId) {
    this.userId = userId;
    this.keyword = keyword;
    this.resultCount = resultCount;
    this.categoryId = categoryId;
    this.ipAddress = ipAddress;
    this.sessionId = sessionId;
    this.searchTime = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getKeyword() {
    return keyword;
  }

  public void setKeyword(String keyword) {
    this.keyword = keyword;
  }

  public Long getResultCount() {
    return resultCount;
  }

  public void setResultCount(Long resultCount) {
    this.resultCount = resultCount;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public KnowledgeItem.ContentType getContentType() {
    return contentType;
  }

  public void setContentType(KnowledgeItem.ContentType contentType) {
    this.contentType = contentType;
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

  public LocalDateTime getSearchTime() {
    return searchTime;
  }

  public void setSearchTime(LocalDateTime searchTime) {
    this.searchTime = searchTime;
  }

  public Long getResponseTime() {
    return responseTime;
  }

  public void setResponseTime(Long responseTime) {
    this.responseTime = responseTime;
  }

  public Long getClickedResultId() {
    return clickedResultId;
  }

  public void setClickedResultId(Long clickedResultId) {
    this.clickedResultId = clickedResultId;
  }

  public Integer getClickedPosition() {
    return clickedPosition;
  }

  public void setClickedPosition(Integer clickedPosition) {
    this.clickedPosition = clickedPosition;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  @Override
  public String toString() {
    return "SearchHistory{"
        + "id="
        + id
        + ", userId="
        + userId
        + ", keyword='"
        + keyword
        + '\''
        + ", resultCount="
        + resultCount
        + ", categoryId="
        + categoryId
        + ", ipAddress='"
        + ipAddress
        + '\''
        + ", searchTime="
        + searchTime
        + ", responseTime="
        + responseTime
        + '}';
  }
}
