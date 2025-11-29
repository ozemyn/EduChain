package com.example.educhain.dto;

import java.time.LocalDateTime;

/** 热门关键词DTO */
public class HotKeywordDTO {

  private Long id;
  private String keyword;
  private Long searchCount;
  private Long resultCount;
  private Long clickCount;
  private Double trendScore;
  private Long dailyCount;
  private Long weeklyCount;
  private Long monthlyCount;
  private LocalDateTime lastSearchedAt;
  private Long categoryId;
  private String categoryName;
  private Double clickRate; // 点击率
  private String trendDirection; // 趋势方向: up, down, stable

  // 默认构造函数
  public HotKeywordDTO() {}

  // 构造函数
  public HotKeywordDTO(String keyword, Long searchCount, Long resultCount, Double trendScore) {
    this.keyword = keyword;
    this.searchCount = searchCount;
    this.resultCount = resultCount;
    this.trendScore = trendScore;
  }

  // 构造函数 - 从实体转换
  public HotKeywordDTO(
      Long id,
      String keyword,
      Long searchCount,
      Long resultCount,
      Long clickCount,
      Double trendScore,
      Long dailyCount,
      LocalDateTime lastSearchedAt,
      Long categoryId,
      String categoryName) {
    this.id = id;
    this.keyword = keyword;
    this.searchCount = searchCount;
    this.resultCount = resultCount;
    this.clickCount = clickCount;
    this.trendScore = trendScore;
    this.dailyCount = dailyCount;
    this.lastSearchedAt = lastSearchedAt;
    this.categoryId = categoryId;
    this.categoryName = categoryName;

    // 计算点击率
    if (searchCount != null && searchCount > 0 && clickCount != null) {
      this.clickRate = Math.round((double) clickCount / searchCount * 10000.0) / 100.0;
    } else {
      this.clickRate = 0.0;
    }

    // 判断趋势方向
    if (dailyCount != null && searchCount != null && searchCount > 0) {
      double dailyRatio = (double) dailyCount / searchCount;
      if (dailyRatio > 0.1) {
        this.trendDirection = "up";
      } else if (dailyRatio < 0.01) {
        this.trendDirection = "down";
      } else {
        this.trendDirection = "stable";
      }
    } else {
      this.trendDirection = "stable";
    }
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getKeyword() {
    return keyword;
  }

  public void setKeyword(String keyword) {
    this.keyword = keyword;
  }

  public Long getSearchCount() {
    return searchCount;
  }

  public void setSearchCount(Long searchCount) {
    this.searchCount = searchCount;
  }

  public Long getResultCount() {
    return resultCount;
  }

  public void setResultCount(Long resultCount) {
    this.resultCount = resultCount;
  }

  public Long getClickCount() {
    return clickCount;
  }

  public void setClickCount(Long clickCount) {
    this.clickCount = clickCount;
  }

  public Double getTrendScore() {
    return trendScore;
  }

  public void setTrendScore(Double trendScore) {
    this.trendScore = trendScore;
  }

  public Long getDailyCount() {
    return dailyCount;
  }

  public void setDailyCount(Long dailyCount) {
    this.dailyCount = dailyCount;
  }

  public Long getWeeklyCount() {
    return weeklyCount;
  }

  public void setWeeklyCount(Long weeklyCount) {
    this.weeklyCount = weeklyCount;
  }

  public Long getMonthlyCount() {
    return monthlyCount;
  }

  public void setMonthlyCount(Long monthlyCount) {
    this.monthlyCount = monthlyCount;
  }

  public LocalDateTime getLastSearchedAt() {
    return lastSearchedAt;
  }

  public void setLastSearchedAt(LocalDateTime lastSearchedAt) {
    this.lastSearchedAt = lastSearchedAt;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public Double getClickRate() {
    return clickRate;
  }

  public void setClickRate(Double clickRate) {
    this.clickRate = clickRate;
  }

  public String getTrendDirection() {
    return trendDirection;
  }

  public void setTrendDirection(String trendDirection) {
    this.trendDirection = trendDirection;
  }

  @Override
  public String toString() {
    return "HotKeywordDTO{"
        + "id="
        + id
        + ", keyword='"
        + keyword
        + '\''
        + ", searchCount="
        + searchCount
        + ", resultCount="
        + resultCount
        + ", trendScore="
        + trendScore
        + ", clickRate="
        + clickRate
        + ", trendDirection='"
        + trendDirection
        + '\''
        + ", lastSearchedAt="
        + lastSearchedAt
        + '}';
  }
}
