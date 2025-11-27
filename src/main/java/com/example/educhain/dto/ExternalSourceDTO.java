package com.example.educhain.dto;

import com.example.educhain.entity.ExternalSource;

import java.time.LocalDateTime;

/**
 * 外部数据源DTO
 */
public class ExternalSourceDTO {

    private Long id;
    private String name;
    private String sourceUrl;
    private String sourceType;
    private String description;
    private Integer crawlFrequency;
    private String selectorConfig;
    private String headersConfig;
    private Integer status;
    private LocalDateTime lastCrawlAt;
    private LocalDateTime lastSuccessAt;
    private String lastError;
    private Long totalCrawled;
    private Long totalSuccess;
    private Long totalFailed;
    private Double successRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 默认构造函数
    public ExternalSourceDTO() {}

    // 从ExternalSource实体创建DTO的构造函数
    public ExternalSourceDTO(ExternalSource externalSource) {
        this.id = externalSource.getId();
        this.name = externalSource.getName();
        this.sourceUrl = externalSource.getSourceUrl();
        this.sourceType = externalSource.getSourceType();
        this.description = externalSource.getDescription();
        this.crawlFrequency = externalSource.getCrawlFrequency();
        this.selectorConfig = externalSource.getSelectorConfig();
        this.headersConfig = externalSource.getHeadersConfig();
        this.status = externalSource.getStatus();
        this.lastCrawlAt = externalSource.getLastCrawlAt();
        this.lastSuccessAt = externalSource.getLastSuccessAt();
        this.lastError = externalSource.getLastError();
        this.totalCrawled = externalSource.getTotalCrawled();
        this.totalSuccess = externalSource.getTotalSuccess();
        this.totalFailed = externalSource.getTotalFailed();
        this.successRate = externalSource.getSuccessRate();
        this.createdAt = externalSource.getCreatedAt();
        this.updatedAt = externalSource.getUpdatedAt();
    }

    // 静态工厂方法
    public static ExternalSourceDTO fromEntity(ExternalSource externalSource) {
        return new ExternalSourceDTO(externalSource);
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

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
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
        return "ExternalSourceDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sourceUrl='" + sourceUrl + '\'' +
                ", sourceType='" + sourceType + '\'' +
                ", status=" + status +
                ", totalCrawled=" + totalCrawled +
                ", successRate=" + successRate +
                '}';
    }
}