package com.example.educhain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 外部数据源实体类 */
@Entity
@Table(
    name = "external_sources",
    indexes = {
      @Index(name = "idx_source_url", columnList = "source_url", unique = true),
      @Index(name = "idx_source_type", columnList = "source_type"),
      @Index(name = "idx_status", columnList = "status"),
      @Index(name = "idx_last_crawl_at", columnList = "last_crawl_at")
    })
@EntityListeners(AuditingEntityListener.class)
public class ExternalSource {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "source_url", nullable = false, unique = true, length = 500)
  private String sourceUrl;

  @Column(name = "source_type", nullable = false, length = 50)
  private String sourceType;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "crawl_frequency", nullable = false)
  private Integer crawlFrequency = 24; // 抓取频率（小时）

  @Column(name = "selector_config", columnDefinition = "JSON")
  private String selectorConfig; // CSS选择器配置

  @Column(name = "headers_config", columnDefinition = "JSON")
  private String headersConfig; // HTTP请求头配置

  @Column(name = "status", nullable = false)
  private Integer status = 1; // 1: 启用, 0: 禁用

  @Column(name = "last_crawl_at")
  private LocalDateTime lastCrawlAt;

  @Column(name = "last_success_at")
  private LocalDateTime lastSuccessAt;

  @Column(name = "last_error")
  private String lastError;

  @Column(name = "total_crawled", nullable = false)
  private Long totalCrawled = 0L;

  @Column(name = "total_success", nullable = false)
  private Long totalSuccess = 0L;

  @Column(name = "total_failed", nullable = false)
  private Long totalFailed = 0L;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // 默认构造函数
  public ExternalSource() {}

  // 构造函数
  public ExternalSource(String name, String sourceUrl, String sourceType) {
    this.name = name;
    this.sourceUrl = sourceUrl;
    this.sourceType = sourceType;
  }

  /** 记录抓取成功 */
  public void recordCrawlSuccess() {
    this.totalCrawled++;
    this.totalSuccess++;
    this.lastCrawlAt = LocalDateTime.now();
    this.lastSuccessAt = LocalDateTime.now();
    this.lastError = null;
  }

  /** 记录抓取失败 */
  public void recordCrawlFailure(String error) {
    this.totalCrawled++;
    this.totalFailed++;
    this.lastCrawlAt = LocalDateTime.now();
    this.lastError = error;
  }

  /** 获取成功率 */
  public double getSuccessRate() {
    if (totalCrawled == 0) {
      return 0.0;
    }
    return (double) totalSuccess / totalCrawled * 100;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSourceUrl() {
    return sourceUrl;
  }

  public void setSourceUrl(String sourceUrl) {
    this.sourceUrl = sourceUrl;
  }

  public String getSourceType() {
    return sourceType;
  }

  public void setSourceType(String sourceType) {
    this.sourceType = sourceType;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getCrawlFrequency() {
    return crawlFrequency;
  }

  public void setCrawlFrequency(Integer crawlFrequency) {
    this.crawlFrequency = crawlFrequency;
  }

  public String getSelectorConfig() {
    return selectorConfig;
  }

  public void setSelectorConfig(String selectorConfig) {
    this.selectorConfig = selectorConfig;
  }

  public String getHeadersConfig() {
    return headersConfig;
  }

  public void setHeadersConfig(String headersConfig) {
    this.headersConfig = headersConfig;
  }

  public Integer getStatus() {
    return status;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }

  public LocalDateTime getLastCrawlAt() {
    return lastCrawlAt;
  }

  public void setLastCrawlAt(LocalDateTime lastCrawlAt) {
    this.lastCrawlAt = lastCrawlAt;
  }

  public LocalDateTime getLastSuccessAt() {
    return lastSuccessAt;
  }

  public void setLastSuccessAt(LocalDateTime lastSuccessAt) {
    this.lastSuccessAt = lastSuccessAt;
  }

  public String getLastError() {
    return lastError;
  }

  public void setLastError(String lastError) {
    this.lastError = lastError;
  }

  public Long getTotalCrawled() {
    return totalCrawled;
  }

  public void setTotalCrawled(Long totalCrawled) {
    this.totalCrawled = totalCrawled;
  }

  public Long getTotalSuccess() {
    return totalSuccess;
  }

  public void setTotalSuccess(Long totalSuccess) {
    this.totalSuccess = totalSuccess;
  }

  public Long getTotalFailed() {
    return totalFailed;
  }

  public void setTotalFailed(Long totalFailed) {
    this.totalFailed = totalFailed;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public String toString() {
    return "ExternalSource{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", sourceUrl='"
        + sourceUrl
        + '\''
        + ", sourceType='"
        + sourceType
        + '\''
        + ", status="
        + status
        + ", totalCrawled="
        + totalCrawled
        + ", totalSuccess="
        + totalSuccess
        + ", createdAt="
        + createdAt
        + '}';
  }
}
