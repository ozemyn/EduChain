package com.example.educhain.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** 统计报表DTO */
public class StatisticsReportDTO {

  private String reportType;
  private String title;
  private LocalDateTime generatedAt;
  private String period;

  // 图表数据
  private Map<String, Object> chartData;

  // 表格数据
  private List<Map<String, Object>> tableData;

  // 关键指标
  private Map<String, Number> keyMetrics;

  // 趋势数据
  private Map<String, List<Number>> trendData;

  // 排行榜数据
  private List<RankingItemDTO> rankings;

  // 默认构造函数
  public StatisticsReportDTO() {
    this.generatedAt = LocalDateTime.now();
  }

  public StatisticsReportDTO(String reportType, String title) {
    this();
    this.reportType = reportType;
    this.title = title;
  }

  // Getters and Setters
  public String getReportType() {
    return reportType;
  }

  public void setReportType(String reportType) {
    this.reportType = reportType;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public LocalDateTime getGeneratedAt() {
    return generatedAt;
  }

  public void setGeneratedAt(LocalDateTime generatedAt) {
    this.generatedAt = generatedAt;
  }

  public String getPeriod() {
    return period;
  }

  public void setPeriod(String period) {
    this.period = period;
  }

  public Map<String, Object> getChartData() {
    return chartData;
  }

  public void setChartData(Map<String, Object> chartData) {
    this.chartData = chartData;
  }

  public List<Map<String, Object>> getTableData() {
    return tableData;
  }

  public void setTableData(List<Map<String, Object>> tableData) {
    this.tableData = tableData;
  }

  public Map<String, Number> getKeyMetrics() {
    return keyMetrics;
  }

  public void setKeyMetrics(Map<String, Number> keyMetrics) {
    this.keyMetrics = keyMetrics;
  }

  public Map<String, List<Number>> getTrendData() {
    return trendData;
  }

  public void setTrendData(Map<String, List<Number>> trendData) {
    this.trendData = trendData;
  }

  public List<RankingItemDTO> getRankings() {
    return rankings;
  }

  public void setRankings(List<RankingItemDTO> rankings) {
    this.rankings = rankings;
  }

  /** 排行榜项目DTO */
  public static class RankingItemDTO {
    private Integer rank;
    private String name;
    private String type;
    private Number value;
    private String description;

    public RankingItemDTO() {}

    public RankingItemDTO(Integer rank, String name, String type, Number value) {
      this.rank = rank;
      this.name = name;
      this.type = type;
      this.value = value;
    }

    // Getters and Setters
    public Integer getRank() {
      return rank;
    }

    public void setRank(Integer rank) {
      this.rank = rank;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }

    public Number getValue() {
      return value;
    }

    public void setValue(Number value) {
      this.value = value;
    }

    public String getDescription() {
      return description;
    }

    public void setDescription(String description) {
      this.description = description;
    }
  }

  @Override
  public String toString() {
    return "StatisticsReportDTO{"
        + "reportType='"
        + reportType
        + '\''
        + ", title='"
        + title
        + '\''
        + ", generatedAt="
        + generatedAt
        + ", period='"
        + period
        + '\''
        + '}';
  }
}
