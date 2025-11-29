package com.example.educhain.service.impl;

import com.example.educhain.dto.HotKeywordDTO;
import com.example.educhain.entity.Category;
import com.example.educhain.entity.HotKeyword;
import com.example.educhain.repository.CategoryRepository;
import com.example.educhain.repository.HotKeywordRepository;
import com.example.educhain.service.KeywordStatisticsService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/** 关键词统计服务实现类 */
@Service
@Transactional
public class KeywordStatisticsServiceImpl implements KeywordStatisticsService {

  private static final Logger logger = LoggerFactory.getLogger(KeywordStatisticsServiceImpl.class);

  @Autowired private HotKeywordRepository hotKeywordRepository;

  @Autowired private CategoryRepository categoryRepository;

  @Override
  public void updateKeywordStatistics(String keyword, Long resultCount, Long categoryId) {
    if (!StringUtils.hasText(keyword)) {
      return;
    }

    try {
      keyword = keyword.trim().toLowerCase();

      Optional<HotKeyword> existingKeyword = hotKeywordRepository.findByKeyword(keyword);
      HotKeyword hotKeyword;

      if (existingKeyword.isPresent()) {
        hotKeyword = existingKeyword.get();
        hotKeyword.incrementSearchCount(resultCount);
      } else {
        hotKeyword = new HotKeyword(keyword);
        hotKeyword.incrementSearchCount(resultCount);

        // 设置分类信息
        if (categoryId != null) {
          Optional<Category> category = categoryRepository.findById(categoryId);
          if (category.isPresent()) {
            hotKeyword.setCategoryId(categoryId);
            hotKeyword.setCategoryName(category.get().getName());
          }
        }
      }

      hotKeywordRepository.save(hotKeyword);
      logger.debug("更新关键词统计: {} (结果数: {})", keyword, resultCount);
    } catch (Exception e) {
      logger.error("更新关键词统计失败: {}", keyword, e);
    }
  }

  @Override
  public List<HotKeywordDTO> getHotKeywordsRanking(String period, int limit) {
    limit = Math.min(limit, 100);
    Pageable pageable = PageRequest.of(0, limit);

    List<HotKeyword> hotKeywords;

    switch (period.toLowerCase()) {
      case "daily":
        hotKeywords = hotKeywordRepository.findTodayHotKeywords(1, pageable);
        break;
      case "weekly":
        hotKeywords = hotKeywordRepository.findWeeklyHotKeywords(1, pageable);
        break;
      case "monthly":
        hotKeywords = hotKeywordRepository.findMonthlyHotKeywords(1, pageable);
        break;
      case "trending":
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        hotKeywords = hotKeywordRepository.findTrendingKeywords(since, 1, pageable);
        break;
      default:
        hotKeywords = hotKeywordRepository.findHotKeywordsByTrendScore(1, pageable);
        break;
    }

    return hotKeywords.stream().map(this::convertToHotKeywordDTO).collect(Collectors.toList());
  }

  @Override
  public Map<String, Object> getSearchTrend(String keyword, int days) {
    Map<String, Object> trendData = new HashMap<>();

    try {
      Optional<HotKeyword> hotKeyword = hotKeywordRepository.findByKeywordAndStatus(keyword, 1);
      if (hotKeyword.isPresent()) {
        HotKeyword kw = hotKeyword.get();

        trendData.put("keyword", keyword);
        trendData.put("totalSearches", kw.getSearchCount());
        trendData.put("dailySearches", kw.getDailyCount());
        trendData.put("weeklySearches", kw.getWeeklyCount());
        trendData.put("monthlySearches", kw.getMonthlyCount());
        trendData.put("trendScore", kw.getTrendScore());
        trendData.put("lastSearchedAt", kw.getLastSearchedAt());

        // 计算趋势方向
        String trendDirection = calculateTrendDirection(kw);
        trendData.put("trendDirection", trendDirection);

        // 计算增长率
        double growthRate = calculateGrowthRate(kw);
        trendData.put("growthRate", growthRate);

        // 预测未来趋势
        List<Double> prediction = predictTrend(kw, days);
        trendData.put("prediction", prediction);
      } else {
        trendData.put("keyword", keyword);
        trendData.put("totalSearches", 0);
        trendData.put("message", "关键词暂无搜索数据");
      }
    } catch (Exception e) {
      logger.error("获取搜索趋势失败: {}", keyword, e);
      trendData.put("error", "获取趋势数据失败");
    }

    return trendData;
  }

  @Override
  public Map<String, Long> getKeywordCategoryDistribution(int limit) {
    Map<String, Long> distribution = new HashMap<>();

    try {
      List<Category> categories = categoryRepository.findAll();

      for (Category category : categories) {
        Pageable pageable = PageRequest.of(0, 1000); // 获取足够多的数据
        List<HotKeyword> categoryKeywords =
            hotKeywordRepository.findRelatedKeywordsByCategory(category.getId(), 1, pageable);

        long totalSearches = categoryKeywords.stream().mapToLong(HotKeyword::getSearchCount).sum();

        if (totalSearches > 0) {
          distribution.put(category.getName(), totalSearches);
        }
      }

      // 按搜索次数排序并限制返回数量
      return distribution.entrySet().stream()
          .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
          .limit(limit)
          .collect(
              Collectors.toMap(
                  Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    } catch (Exception e) {
      logger.error("获取关键词分类分布失败", e);
      return distribution;
    }
  }

  @Override
  public List<Map<String, Object>> getSearchHeatmapData(
      LocalDateTime startTime, LocalDateTime endTime) {
    List<Map<String, Object>> heatmapData = new ArrayList<>();

    try {
      List<HotKeyword> recentKeywords =
          hotKeywordRepository.findRecentKeywords(startTime, 1, PageRequest.of(0, 100));

      for (HotKeyword keyword : recentKeywords) {
        Map<String, Object> dataPoint = new HashMap<>();
        dataPoint.put("keyword", keyword.getKeyword());
        dataPoint.put("searchCount", keyword.getSearchCount());
        dataPoint.put("trendScore", keyword.getTrendScore());
        dataPoint.put("categoryName", keyword.getCategoryName());
        dataPoint.put("lastSearchedAt", keyword.getLastSearchedAt());

        // 计算热度值 (0-100)
        double heatValue = Math.min(100, keyword.getTrendScore() * 10);
        dataPoint.put("heatValue", heatValue);

        heatmapData.add(dataPoint);
      }

      // 按热度值排序
      heatmapData.sort(
          (a, b) -> Double.compare((Double) b.get("heatValue"), (Double) a.get("heatValue")));

    } catch (Exception e) {
      logger.error("获取搜索热度地图数据失败", e);
    }

    return heatmapData;
  }

  @Override
  public Map<String, Object> analyzeUserSearchBehavior(Long userId) {
    Map<String, Object> analysis = new HashMap<>();

    // 这里简化实现，实际应该有用户搜索历史表
    analysis.put("userId", userId);
    analysis.put("message", "用户搜索行为分析功能待实现");

    return analysis;
  }

  @Override
  public List<String> getRelatedSearchSuggestions(String keyword, int limit) {
    if (!StringUtils.hasText(keyword)) {
      return new ArrayList<>();
    }

    try {
      // 首先查找相同分类的关键词
      Optional<HotKeyword> baseKeyword = hotKeywordRepository.findByKeywordAndStatus(keyword, 1);
      if (baseKeyword.isPresent() && baseKeyword.get().getCategoryId() != null) {
        Pageable pageable = PageRequest.of(0, limit);
        List<HotKeyword> relatedKeywords =
            hotKeywordRepository.findRelatedKeywordsByCategory(
                baseKeyword.get().getCategoryId(), 1, pageable);

        return relatedKeywords.stream()
            .map(HotKeyword::getKeyword)
            .filter(k -> !k.equals(keyword))
            .collect(Collectors.toList());
      }

      // 如果没有分类信息，返回热门关键词
      List<HotKeyword> hotKeywords =
          hotKeywordRepository.findHotKeywordsByTrendScore(1, PageRequest.of(0, limit + 5));

      return hotKeywords.stream()
          .map(HotKeyword::getKeyword)
          .filter(k -> !k.equals(keyword))
          .limit(limit)
          .collect(Collectors.toList());
    } catch (Exception e) {
      logger.error("获取相关搜索建议失败: {}", keyword, e);
      return new ArrayList<>();
    }
  }

  @Override
  public void resetStatisticsCounters(String resetType) {
    try {
      switch (resetType.toLowerCase()) {
        case "daily":
          int dailyReset = hotKeywordRepository.resetDailyCount(1);
          logger.info("重置日统计计数器: {} 条记录", dailyReset);
          break;
        case "weekly":
          int weeklyReset = hotKeywordRepository.resetWeeklyCount(1);
          logger.info("重置周统计计数器: {} 条记录", weeklyReset);
          break;
        case "monthly":
          int monthlyReset = hotKeywordRepository.resetMonthlyCount(1);
          logger.info("重置月统计计数器: {} 条记录", monthlyReset);
          break;
        default:
          logger.warn("未知的重置类型: {}", resetType);
          break;
      }
    } catch (Exception e) {
      logger.error("重置统计计数器失败: {}", resetType, e);
    }
  }

  @Override
  public Map<String, Object> generateSearchReport(LocalDateTime startTime, LocalDateTime endTime) {
    Map<String, Object> report = new HashMap<>();

    try {
      // 基础统计
      Long totalKeywords = hotKeywordRepository.countByStatus(1);
      Long totalSearches = hotKeywordRepository.sumMonthlySearchCount(1);
      Long todaySearches = hotKeywordRepository.sumDailySearchCount(1);
      Long weeklySearches = hotKeywordRepository.sumWeeklySearchCount(1);

      report.put("reportPeriod", Map.of("startTime", startTime, "endTime", endTime));
      report.put("totalKeywords", totalKeywords);
      report.put("totalSearches", totalSearches);
      report.put("todaySearches", todaySearches);
      report.put("weeklySearches", weeklySearches);

      // 热门关键词
      List<HotKeywordDTO> topKeywords = getHotKeywordsRanking("all", 10);
      report.put("topKeywords", topKeywords);

      // 趋势关键词
      List<HotKeywordDTO> trendingKeywords = getHotKeywordsRanking("trending", 10);
      report.put("trendingKeywords", trendingKeywords);

      // 分类分布
      Map<String, Long> categoryDistribution = getKeywordCategoryDistribution(10);
      report.put("categoryDistribution", categoryDistribution);

      // 搜索失败关键词
      List<HotKeywordDTO> failedKeywords = getFailedSearchKeywords(10);
      report.put("failedSearchKeywords", failedKeywords);

      report.put("generatedAt", LocalDateTime.now());

    } catch (Exception e) {
      logger.error("生成搜索报告失败", e);
      report.put("error", "生成报告失败");
    }

    return report;
  }

  @Override
  public List<HotKeywordDTO> predictHotKeywords(int days, int limit) {
    // 简化的预测算法：基于当前趋势分数和增长率
    try {
      List<HotKeyword> currentHotKeywords =
          hotKeywordRepository.findHotKeywordsByTrendScore(1, PageRequest.of(0, limit * 2));

      return currentHotKeywords.stream()
          .filter(kw -> kw.getDailyCount() > 0) // 有当日搜索的关键词
          .map(this::convertToHotKeywordDTO)
          .sorted((a, b) -> Double.compare(b.getTrendScore(), a.getTrendScore()))
          .limit(limit)
          .collect(Collectors.toList());
    } catch (Exception e) {
      logger.error("预测热门关键词失败", e);
      return new ArrayList<>();
    }
  }

  @Override
  public List<HotKeywordDTO> getFailedSearchKeywords(int limit) {
    try {
      // 查找结果数为0的关键词
      List<HotKeyword> allKeywords = hotKeywordRepository.findAll();

      return allKeywords.stream()
          .filter(kw -> kw.getResultCount() == 0 && kw.getSearchCount() > 1)
          .sorted((a, b) -> Long.compare(b.getSearchCount(), a.getSearchCount()))
          .limit(limit)
          .map(this::convertToHotKeywordDTO)
          .collect(Collectors.toList());
    } catch (Exception e) {
      logger.error("获取搜索失败关键词失败", e);
      return new ArrayList<>();
    }
  }

  // 私有辅助方法

  private HotKeywordDTO convertToHotKeywordDTO(HotKeyword hotKeyword) {
    return new HotKeywordDTO(
        hotKeyword.getId(),
        hotKeyword.getKeyword(),
        hotKeyword.getSearchCount(),
        hotKeyword.getResultCount(),
        hotKeyword.getClickCount(),
        hotKeyword.getTrendScore(),
        hotKeyword.getDailyCount(),
        hotKeyword.getLastSearchedAt(),
        hotKeyword.getCategoryId(),
        hotKeyword.getCategoryName());
  }

  private String calculateTrendDirection(HotKeyword keyword) {
    if (keyword.getDailyCount() == null
        || keyword.getSearchCount() == null
        || keyword.getSearchCount() == 0) {
      return "stable";
    }

    double dailyRatio = (double) keyword.getDailyCount() / keyword.getSearchCount();

    if (dailyRatio > 0.1) {
      return "up";
    } else if (dailyRatio < 0.01) {
      return "down";
    } else {
      return "stable";
    }
  }

  private double calculateGrowthRate(HotKeyword keyword) {
    if (keyword.getWeeklyCount() == null
        || keyword.getMonthlyCount() == null
        || keyword.getMonthlyCount() == 0) {
      return 0.0;
    }

    // 简化的增长率计算：周搜索量 / 月搜索量 * 4
    double weeklyAverage = (double) keyword.getWeeklyCount();
    double monthlyAverage = (double) keyword.getMonthlyCount() / 4.0;

    if (monthlyAverage == 0) {
      return 0.0;
    }

    return Math.round(((weeklyAverage - monthlyAverage) / monthlyAverage * 100) * 100.0) / 100.0;
  }

  private List<Double> predictTrend(HotKeyword keyword, int days) {
    List<Double> prediction = new ArrayList<>();

    // 简化的预测算法：基于当前趋势分数
    double baseValue = keyword.getTrendScore();
    double growthRate = calculateGrowthRate(keyword) / 100.0;

    for (int i = 1; i <= days; i++) {
      double predictedValue = baseValue * Math.pow(1 + growthRate, i);
      prediction.add(Math.round(predictedValue * 100.0) / 100.0);
    }

    return prediction;
  }
}
