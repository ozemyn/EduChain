package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.KnowledgeStats;
import com.example.educhain.entity.UserStats;
import com.example.educhain.repository.*;
import com.example.educhain.service.StatisticsAnalysisService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 统计分析服务实现类 */
@Service
@Transactional
public class StatisticsAnalysisServiceImpl implements StatisticsAnalysisService {

  private static final Logger logger = LoggerFactory.getLogger(StatisticsAnalysisServiceImpl.class);

  @Autowired private KnowledgeStatsRepository knowledgeStatsRepository;

  @Autowired private UserStatsRepository userStatsRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private KnowledgeItemRepository knowledgeItemRepository;

  @Autowired private CategoryRepository categoryRepository;

  @Autowired private TagRepository tagRepository;

  @Autowired private UserInteractionRepository userInteractionRepository;

  @Override
  @Transactional(readOnly = true)
  public PlatformStatsDTO getPlatformStats() {
    logger.info("获取平台整体统计信息");

    PlatformStatsDTO stats = new PlatformStatsDTO();

    try {
      // 用户统计
      stats.setTotalUsers(userRepository.count());
      stats.setActiveUsers(userRepository.countActiveUsers());
      stats.setNewUsersToday(userRepository.countNewUsersToday());
      stats.setAverageUserScore(userStatsRepository.getAverageScore());

      // 知识内容统计
      stats.setTotalKnowledge(knowledgeItemRepository.count());
      stats.setNewKnowledgeToday(knowledgeItemRepository.countNewKnowledgeToday());
      stats.setTotalViews(knowledgeStatsRepository.getTotalViewCount());
      stats.setTotalLikes(knowledgeStatsRepository.getTotalLikeCount());
      stats.setTotalFavorites(knowledgeStatsRepository.getTotalFavoriteCount());
      stats.setTotalComments(knowledgeStatsRepository.getTotalCommentCount());

      // 互动统计
      Long totalInteractions =
          Optional.ofNullable(stats.getTotalLikes()).orElse(0L)
              + Optional.ofNullable(stats.getTotalFavorites()).orElse(0L)
              + Optional.ofNullable(stats.getTotalComments()).orElse(0L);
      stats.setTotalInteractions(totalInteractions);
      stats.setInteractionsToday(userInteractionRepository.countTodayInteractions());

      // 分类和标签统计
      stats.setTotalCategories(categoryRepository.count());
      stats.setTotalTags(tagRepository.count());

      // 平均质量分数
      stats.setAverageQualityScore(calculateAverageQualityScore());

      stats.setReportPeriod("实时数据");

    } catch (Exception e) {
      logger.error("获取平台统计信息失败", e);
      throw new RuntimeException("获取平台统计信息失败", e);
    }

    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public KnowledgeStatsDTO getKnowledgeStats(Long knowledgeId) {
    logger.info("获取知识内容统计信息: {}", knowledgeId);

    Optional<KnowledgeStats> statsOpt = knowledgeStatsRepository.findByKnowledgeId(knowledgeId);
    if (statsOpt.isPresent()) {
      return KnowledgeStatsDTO.fromEntity(statsOpt.get());
    } else {
      // 如果不存在统计记录，创建一个默认的
      KnowledgeStats stats = new KnowledgeStats(knowledgeId);
      stats = knowledgeStatsRepository.save(stats);
      return KnowledgeStatsDTO.fromEntity(stats);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public UserStatsDTO getUserStats(Long userId) {
    logger.info("获取用户统计信息: {}", userId);

    Optional<UserStats> statsOpt = userStatsRepository.findByUserId(userId);
    if (statsOpt.isPresent()) {
      return UserStatsDTO.fromEntity(statsOpt.get());
    } else {
      // 如果不存在统计记录，创建一个默认的
      UserStats stats = new UserStats(userId);
      stats = userStatsRepository.save(stats);
      return UserStatsDTO.fromEntity(stats);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeStatsDTO> getPopularKnowledge(String sortBy, Pageable pageable) {
    logger.info("获取热门知识内容排行榜: sortBy={}", sortBy);

    Page<KnowledgeStats> statsPage;

    switch (sortBy.toLowerCase()) {
      case "views":
        statsPage = knowledgeStatsRepository.findMostViewed(pageable);
        break;
      case "likes":
        statsPage = knowledgeStatsRepository.findMostLiked(pageable);
        break;
      case "favorites":
        statsPage = knowledgeStatsRepository.findMostFavorited(pageable);
        break;
      case "quality":
        statsPage = knowledgeStatsRepository.findHighestQuality(pageable);
        break;
      default:
        statsPage = knowledgeStatsRepository.findMostViewed(pageable);
    }

    return statsPage.map(KnowledgeStatsDTO::fromEntity);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<UserStatsDTO> getActiveUsers(String sortBy, Pageable pageable) {
    logger.info("获取活跃用户排行榜: sortBy={}", sortBy);

    Page<UserStats> statsPage;

    switch (sortBy.toLowerCase()) {
      case "score":
        statsPage = userStatsRepository.findTopByScore(pageable);
        break;
      case "knowledge":
        statsPage = userStatsRepository.findAllByOrderByKnowledgeCountDesc(pageable);
        break;
      case "followers":
        statsPage = userStatsRepository.findAllByOrderByFollowerCountDesc(pageable);
        break;
      case "activity":
        statsPage = userStatsRepository.findMostActiveUsers(pageable);
        break;
      default:
        statsPage = userStatsRepository.findTopByScore(pageable);
    }

    return statsPage.map(UserStatsDTO::fromEntity);
  }

  @Override
  public Double calculateQualityScore(Long knowledgeId) {
    logger.info("计算知识内容质量分数: {}", knowledgeId);

    Optional<KnowledgeStats> statsOpt = knowledgeStatsRepository.findByKnowledgeId(knowledgeId);
    if (statsOpt.isPresent()) {
      KnowledgeStats stats = statsOpt.get();
      stats.calculateQualityScore();
      knowledgeStatsRepository.save(stats);
      return stats.getQualityScore();
    }

    return 0.0;
  }

  @Override
  public void batchCalculateQualityScores() {
    logger.info("批量计算质量分数");

    int pageSize = 100;
    int pageNumber = 0;
    Page<KnowledgeStats> page;

    do {
      page = knowledgeStatsRepository.findAll(PageRequest.of(pageNumber, pageSize));

      for (KnowledgeStats stats : page.getContent()) {
        stats.calculateQualityScore();
      }

      knowledgeStatsRepository.saveAll(page.getContent());
      pageNumber++;

    } while (page.hasNext());

    logger.info("批量计算质量分数完成");
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, List<?>> getStatisticsTrends(
      String type, LocalDateTime startDate, LocalDateTime endDate) {
    logger.info("获取统计趋势数据: type={}, startDate={}, endDate={}", type, startDate, endDate);

    Map<String, List<?>> trends = new HashMap<>();

    // 这里简化实现，实际应该根据时间范围查询历史数据
    List<Number> values = new ArrayList<>();
    List<String> dates = new ArrayList<>();

    LocalDate start = startDate.toLocalDate();
    LocalDate end = endDate.toLocalDate();

    for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
      dates.add(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
      // 模拟数据，实际应该从数据库查询
      values.add(Math.random() * 1000);
    }

    trends.put("dates", dates);
    trends.put("values", values);

    return trends;
  }

  @Override
  @Transactional(readOnly = true)
  public StatisticsReportDTO generateReport(String reportType, String period) {
    logger.info("生成统计报表: reportType={}, period={}", reportType, period);

    StatisticsReportDTO report = new StatisticsReportDTO(reportType, "平台统计报表");
    report.setPeriod(period);

    // 关键指标
    Map<String, Number> keyMetrics = new HashMap<>();
    keyMetrics.put("totalUsers", userRepository.count());
    keyMetrics.put("totalKnowledge", knowledgeItemRepository.count());
    keyMetrics.put("totalViews", knowledgeStatsRepository.getTotalViewCount());
    keyMetrics.put("totalLikes", knowledgeStatsRepository.getTotalLikeCount());
    report.setKeyMetrics(keyMetrics);

    // 排行榜数据
    List<StatisticsReportDTO.RankingItemDTO> rankings = new ArrayList<>();
    Page<KnowledgeStats> topKnowledge =
        knowledgeStatsRepository.findMostViewed(PageRequest.of(0, 10));
    int rank = 1;
    for (KnowledgeStats stats : topKnowledge.getContent()) {
      rankings.add(
          new StatisticsReportDTO.RankingItemDTO(
              rank++, "知识内容 " + stats.getKnowledgeId(), "knowledge", stats.getViewCount()));
    }
    report.setRankings(rankings);

    return report;
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getCategoryStats() {
    logger.info("获取分类统计信息");

    return categoryRepository.getCategoryStats();
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getTagUsageStats() {
    logger.info("获取标签使用统计");

    return tagRepository.getTagUsageStats();
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getUserActivityAnalysis() {
    logger.info("获取用户活跃度分析");

    Map<String, Object> analysis = new HashMap<>();

    // 活跃用户数
    analysis.put("activeUsers", userRepository.countActiveUsers());

    // 新用户数
    analysis.put("newUsers", userRepository.countNewUsersToday());

    // 用户等级分布
    Map<String, Long> levelDistribution = userRepository.getUserLevelDistribution();
    analysis.put("levelDistribution", levelDistribution);

    return analysis;
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, List<?>> getContentPublishTrends(int days) {
    logger.info("获取内容发布趋势: days={}", days);

    Map<String, List<?>> trends = new HashMap<>();
    List<Number> values = new ArrayList<>();
    List<String> dates = new ArrayList<>();

    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusDays(days - 1);

    for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
      dates.add(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
      Long count = knowledgeItemRepository.countByCreatedAtDate(date);
      values.add(count);
    }

    trends.put("dates", dates);
    trends.put("values", values);

    return trends;
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getInteractionAnalysis() {
    logger.info("获取互动行为分析");

    Map<String, Object> analysis = new HashMap<>();

    // 总互动数
    Long totalLikes = knowledgeStatsRepository.getTotalLikeCount();
    Long totalFavorites = knowledgeStatsRepository.getTotalFavoriteCount();
    Long totalComments = knowledgeStatsRepository.getTotalCommentCount();

    analysis.put("totalLikes", totalLikes);
    analysis.put("totalFavorites", totalFavorites);
    analysis.put("totalComments", totalComments);
    analysis.put("totalInteractions", totalLikes + totalFavorites + totalComments);

    // 今日互动数
    analysis.put("todayInteractions", userInteractionRepository.countTodayInteractions());

    return analysis;
  }

  @Override
  public void updateStatistics() {
    logger.info("实时更新统计数据");

    // 批量计算质量分数
    batchCalculateQualityScores();

    logger.info("统计数据更新完成");
  }

  @Override
  @Transactional(readOnly = true)
  public byte[] exportStatistics(String format, String type) {
    logger.info("导出统计数据: format={}, type={}", format, type);

    // 简化实现，实际应该根据格式生成相应的文件
    String data = "统计数据导出\n";
    data += "导出时间: " + LocalDateTime.now() + "\n";
    data += "数据类型: " + type + "\n";

    PlatformStatsDTO stats = getPlatformStats();
    data += "总用户数: " + stats.getTotalUsers() + "\n";
    data += "总知识数: " + stats.getTotalKnowledge() + "\n";
    data += "总浏览量: " + stats.getTotalViews() + "\n";

    return data.getBytes();
  }

  /** 计算平均质量分数 */
  private Double calculateAverageQualityScore() {
    List<KnowledgeStats> allStats = knowledgeStatsRepository.findAll();
    if (allStats.isEmpty()) {
      return 0.0;
    }

    double sum =
        allStats.stream()
            .mapToDouble(stats -> Optional.ofNullable(stats.getQualityScore()).orElse(0.0))
            .sum();

    return sum / allStats.size();
  }
}
