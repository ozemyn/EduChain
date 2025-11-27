package com.example.educhain.service;

import com.example.educhain.dto.HotKeywordDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 关键词统计服务接口
 */
public interface KeywordStatisticsService {

    /**
     * 更新关键词统计
     * @param keyword 关键词
     * @param resultCount 搜索结果数量
     * @param categoryId 分类ID
     */
    void updateKeywordStatistics(String keyword, Long resultCount, Long categoryId);

    /**
     * 获取热门关键词排行榜
     * @param period 时间周期: daily, weekly, monthly, all
     * @param limit 返回数量限制
     * @return 热门关键词列表
     */
    List<HotKeywordDTO> getHotKeywordsRanking(String period, int limit);

    /**
     * 获取搜索趋势分析
     * @param keyword 关键词
     * @param days 分析天数
     * @return 趋势数据
     */
    Map<String, Object> getSearchTrend(String keyword, int days);

    /**
     * 获取关键词分类分布
     * @param limit 返回数量限制
     * @return 分类分布数据
     */
    Map<String, Long> getKeywordCategoryDistribution(int limit);

    /**
     * 获取搜索热度地图数据
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 热度地图数据
     */
    List<Map<String, Object>> getSearchHeatmapData(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 分析用户搜索行为
     * @param userId 用户ID
     * @return 搜索行为分析结果
     */
    Map<String, Object> analyzeUserSearchBehavior(Long userId);

    /**
     * 获取相关搜索建议
     * @param keyword 基础关键词
     * @param limit 返回数量限制
     * @return 相关搜索建议
     */
    List<String> getRelatedSearchSuggestions(String keyword, int limit);

    /**
     * 重置统计计数器
     * @param resetType 重置类型: daily, weekly, monthly
     */
    void resetStatisticsCounters(String resetType);

    /**
     * 生成搜索报告
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 搜索报告数据
     */
    Map<String, Object> generateSearchReport(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 预测热门关键词
     * @param days 预测天数
     * @param limit 返回数量限制
     * @return 预测的热门关键词
     */
    List<HotKeywordDTO> predictHotKeywords(int days, int limit);

    /**
     * 获取搜索失败关键词
     * @param limit 返回数量限制
     * @return 搜索失败的关键词列表
     */
    List<HotKeywordDTO> getFailedSearchKeywords(int limit);
}