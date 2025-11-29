package com.example.educhain.service;

import com.example.educhain.dto.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 统计分析服务接口 */
public interface StatisticsAnalysisService {

  /** 获取平台整体统计信息 */
  PlatformStatsDTO getPlatformStats();

  /** 获取知识内容统计信息 */
  KnowledgeStatsDTO getKnowledgeStats(Long knowledgeId);

  /** 获取用户统计信息 */
  UserStatsDTO getUserStats(Long userId);

  /** 获取热门知识内容排行榜 */
  Page<KnowledgeStatsDTO> getPopularKnowledge(String sortBy, Pageable pageable);

  /** 获取活跃用户排行榜 */
  Page<UserStatsDTO> getActiveUsers(String sortBy, Pageable pageable);

  /** 计算知识内容质量分数 */
  Double calculateQualityScore(Long knowledgeId);

  /** 批量计算质量分数 */
  void batchCalculateQualityScores();

  /** 获取统计趋势数据 */
  Map<String, List<?>> getStatisticsTrends(
      String type, LocalDateTime startDate, LocalDateTime endDate);

  /** 生成统计报表 */
  StatisticsReportDTO generateReport(String reportType, String period);

  /** 获取分类统计信息 */
  List<Map<String, Object>> getCategoryStats();

  /** 获取标签使用统计 */
  List<Map<String, Object>> getTagUsageStats();

  /** 获取用户活跃度分析 */
  Map<String, Object> getUserActivityAnalysis();

  /** 获取内容发布趋势 */
  Map<String, List<?>> getContentPublishTrends(int days);

  /** 获取互动行为分析 */
  Map<String, Object> getInteractionAnalysis();

  /** 实时更新统计数据 */
  void updateStatistics();

  /** 导出统计数据 */
  byte[] exportStatistics(String format, String type);
}
