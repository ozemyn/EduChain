package com.example.educhain.controller;

import com.example.educhain.dto.HotKeywordDTO;
import com.example.educhain.dto.SearchRequest;
import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.service.KeywordStatisticsService;
import com.example.educhain.service.RecommendationService;
import com.example.educhain.service.SearchService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 搜索控制器
 */
@RestController
@RequestMapping("/api/search")
@Tag(name = "搜索管理", description = "搜索和推荐相关接口")
public class SearchController {

    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    private SearchService searchService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private KeywordStatisticsService keywordStatisticsService;

    /**
     * 基础搜索
     */
    @PostMapping
    @Operation(summary = "执行搜索", description = "根据搜索请求执行搜索操作")
    public Result<Page<SearchResultDTO>> search(
            @Valid @RequestBody SearchRequest request,
            HttpServletRequest httpRequest) {
        try {
            // 记录搜索行为
            String ipAddress = getClientIpAddress(httpRequest);
            logger.info("搜索请求: keyword={}, ip={}", request.getKeyword(), ipAddress);
            
            Page<SearchResultDTO> results = searchService.search(request);
            
            // 异步记录搜索统计
            recordSearchAsync(request.getKeyword(), results.getTotalElements(), request.getCategoryId());
            
            return Result.success(results);
        } catch (Exception e) {
            logger.error("搜索失败", e);
            return Result.error("SEARCH_ERROR", "搜索失败，请稍后重试");
        }
    }

    /**
     * 快速搜索
     */
    @GetMapping("/quick")
    @Operation(summary = "快速搜索", description = "简单的关键词搜索")
    public Result<Page<SearchResultDTO>> quickSearch(
            @Parameter(description = "搜索关键词") @RequestParam String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        try {
            Page<SearchResultDTO> results = searchService.fullTextSearch(keyword, page, size);
            
            // 记录搜索行为
            recordSearchAsync(keyword, results.getTotalElements(), null);
            
            return Result.success(results);
        } catch (Exception e) {
            logger.error("快速搜索失败: keyword={}", keyword, e);
            return Result.error("SEARCH_ERROR", "搜索失败，请稍后重试");
        }
    }

    /**
     * 高级搜索
     */
    @PostMapping("/advanced")
    @Operation(summary = "高级搜索", description = "支持多条件筛选的高级搜索")
    public Result<Page<SearchResultDTO>> advancedSearch(
            @Valid @RequestBody SearchRequest request,
            HttpServletRequest httpRequest) {
        try {
            Page<SearchResultDTO> results = searchService.advancedSearch(request);
            
            // 记录搜索行为
            recordSearchAsync(request.getKeyword(), results.getTotalElements(), request.getCategoryId());
            
            return Result.success(results);
        } catch (Exception e) {
            logger.error("高级搜索失败", e);
            return Result.error("SEARCH_ERROR", "高级搜索失败，请稍后重试");
        }
    }

    /**
     * 搜索建议
     */
    @GetMapping("/suggestions")
    @Operation(summary = "获取搜索建议", description = "根据输入前缀获取搜索建议")
    public Result<List<String>> getSuggestions(
            @Parameter(description = "关键词前缀") @RequestParam String prefix,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<String> suggestions = searchService.getSuggestions(prefix, limit);
            return Result.success(suggestions);
        } catch (Exception e) {
            logger.error("获取搜索建议失败: prefix={}", prefix, e);
            return Result.error("SUGGESTION_ERROR", "获取搜索建议失败");
        }
    }

    /**
     * 热门关键词
     */
    @GetMapping("/hot-keywords")
    @Operation(summary = "获取热门关键词", description = "获取热门搜索关键词列表")
    public Result<List<HotKeywordDTO>> getHotKeywords(
            @Parameter(description = "时间周期") @RequestParam(defaultValue = "all") String period,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<HotKeywordDTO> hotKeywords = keywordStatisticsService.getHotKeywordsRanking(period, limit);
            return Result.success(hotKeywords);
        } catch (Exception e) {
            logger.error("获取热门关键词失败: period={}", period, e);
            return Result.error("HOT_KEYWORDS_ERROR", "获取热门关键词失败");
        }
    }

    /**
     * 趋势关键词
     */
    @GetMapping("/trending-keywords")
    @Operation(summary = "获取趋势关键词", description = "获取上升趋势的关键词")
    public Result<List<HotKeywordDTO>> getTrendingKeywords(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "15") int limit) {
        try {
            List<HotKeywordDTO> trendingKeywords = keywordStatisticsService.getHotKeywordsRanking("trending", limit);
            return Result.success(trendingKeywords);
        } catch (Exception e) {
            logger.error("获取趋势关键词失败", e);
            return Result.error("TRENDING_KEYWORDS_ERROR", "获取趋势关键词失败");
        }
    }

    /**
     * 相关关键词
     */
    @GetMapping("/related-keywords")
    @Operation(summary = "获取相关关键词", description = "根据基础关键词获取相关搜索建议")
    public Result<List<String>> getRelatedKeywords(
            @Parameter(description = "基础关键词") @RequestParam String keyword,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<String> relatedKeywords = keywordStatisticsService.getRelatedSearchSuggestions(keyword, limit);
            return Result.success(relatedKeywords);
        } catch (Exception e) {
            logger.error("获取相关关键词失败: keyword={}", keyword, e);
            return Result.error("RELATED_KEYWORDS_ERROR", "获取相关关键词失败");
        }
    }

    /**
     * 搜索趋势分析
     */
    @GetMapping("/trend/{keyword}")
    @Operation(summary = "获取搜索趋势", description = "获取指定关键词的搜索趋势分析")
    public Result<Map<String, Object>> getSearchTrend(
            @Parameter(description = "关键词") @PathVariable String keyword,
            @Parameter(description = "分析天数") @RequestParam(defaultValue = "30") int days) {
        try {
            Map<String, Object> trendData = keywordStatisticsService.getSearchTrend(keyword, days);
            return Result.success(trendData);
        } catch (Exception e) {
            logger.error("获取搜索趋势失败: keyword={}", keyword, e);
            return Result.error("TREND_ERROR", "获取搜索趋势失败");
        }
    }

    /**
     * 关键词分类分布
     */
    @GetMapping("/category-distribution")
    @Operation(summary = "获取关键词分类分布", description = "获取搜索关键词的分类分布统计")
    public Result<Map<String, Long>> getCategoryDistribution(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit) {
        try {
            Map<String, Long> distribution = keywordStatisticsService.getKeywordCategoryDistribution(limit);
            return Result.success(distribution);
        } catch (Exception e) {
            logger.error("获取分类分布失败", e);
            return Result.error("DISTRIBUTION_ERROR", "获取分类分布失败");
        }
    }

    /**
     * 搜索热度地图
     */
    @GetMapping("/heatmap")
    @Operation(summary = "获取搜索热度地图", description = "获取搜索热度地图数据")
    public Result<List<Map<String, Object>>> getSearchHeatmap(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<Map<String, Object>> heatmapData = keywordStatisticsService.getSearchHeatmapData(startTime, endTime);
            return Result.success(heatmapData);
        } catch (Exception e) {
            logger.error("获取搜索热度地图失败", e);
            return Result.error("HEATMAP_ERROR", "获取搜索热度地图失败");
        }
    }

    /**
     * 个性化推荐
     */
    @GetMapping("/recommendations/personalized")
    @Operation(summary = "获取个性化推荐", description = "基于用户行为的个性化内容推荐")
    public Result<List<SearchResultDTO>> getPersonalizedRecommendations(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                // 未登录用户返回热门推荐
                List<SearchResultDTO> popularRecommendations = recommendationService.getPopularRecommendations(null, limit);
                return Result.success(popularRecommendations);
            }
            
            Long userId = getUserIdFromAuthentication(authentication);
            List<SearchResultDTO> recommendations = recommendationService.getPersonalizedRecommendations(userId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取个性化推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取个性化推荐失败");
        }
    }

    /**
     * 热门内容推荐
     */
    @GetMapping("/recommendations/popular")
    @Operation(summary = "获取热门推荐", description = "获取热门内容推荐")
    public Result<List<SearchResultDTO>> getPopularRecommendations(
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<SearchResultDTO> recommendations = recommendationService.getPopularRecommendations(categoryId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取热门推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取热门推荐失败");
        }
    }

    /**
     * 最新内容推荐
     */
    @GetMapping("/recommendations/latest")
    @Operation(summary = "获取最新推荐", description = "获取最新发布的内容推荐")
    public Result<List<SearchResultDTO>> getLatestRecommendations(
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<SearchResultDTO> recommendations = recommendationService.getLatestRecommendations(categoryId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取最新推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取最新推荐失败");
        }
    }

    /**
     * 相似内容推荐
     */
    @GetMapping("/recommendations/similar/{knowledgeId}")
    @Operation(summary = "获取相似内容推荐", description = "基于指定内容获取相似内容推荐")
    public Result<List<SearchResultDTO>> getSimilarRecommendations(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "15") int limit) {
        try {
            List<SearchResultDTO> recommendations = recommendationService.getContentBasedRecommendations(knowledgeId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取相似内容推荐失败: knowledgeId={}", knowledgeId, e);
            return Result.error("RECOMMENDATION_ERROR", "获取相似内容推荐失败");
        }
    }

    /**
     * 混合推荐
     */
    @GetMapping("/recommendations/hybrid")
    @Operation(summary = "获取混合推荐", description = "获取多种算法混合的推荐结果")
    public Result<List<SearchResultDTO>> getHybridRecommendations(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                // 未登录用户返回热门推荐
                List<SearchResultDTO> popularRecommendations = recommendationService.getPopularRecommendations(null, limit);
                return Result.success(popularRecommendations);
            }
            
            Long userId = getUserIdFromAuthentication(authentication);
            List<SearchResultDTO> recommendations = recommendationService.getHybridRecommendations(userId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取混合推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取混合推荐失败");
        }
    }

    /**
     * 记录关键词点击
     */
    @PostMapping("/click/{keyword}")
    @Operation(summary = "记录关键词点击", description = "记录用户点击关键词的行为")
    public Result<Void> recordKeywordClick(
            @Parameter(description = "关键词") @PathVariable String keyword) {
        try {
            searchService.recordKeywordClick(keyword);
            return Result.success();
        } catch (Exception e) {
            logger.error("记录关键词点击失败: keyword={}", keyword, e);
            return Result.error("CLICK_RECORD_ERROR", "记录点击失败");
        }
    }

    /**
     * 记录推荐点击
     */
    @PostMapping("/recommendations/click")
    @Operation(summary = "记录推荐点击", description = "记录用户点击推荐内容的行为")
    public Result<Void> recordRecommendationClick(
            @Parameter(description = "知识内容ID") @RequestParam Long knowledgeId,
            @Parameter(description = "推荐类型") @RequestParam String recommendationType,
            @Parameter(description = "推荐位置") @RequestParam(required = false) Integer position,
            Authentication authentication) {
        try {
            Long userId = authentication != null && authentication.isAuthenticated() 
                    ? getUserIdFromAuthentication(authentication) : null;
            
            recommendationService.recordRecommendationClick(userId, knowledgeId, recommendationType, position);
            return Result.success();
        } catch (Exception e) {
            logger.error("记录推荐点击失败: knowledgeId={}, type={}", knowledgeId, recommendationType, e);
            return Result.error("CLICK_RECORD_ERROR", "记录推荐点击失败");
        }
    }

    /**
     * 搜索统计信息
     */
    @GetMapping("/statistics")
    @Operation(summary = "获取搜索统计", description = "获取搜索相关的统计信息")
    public Result<SearchService.SearchStatisticsDTO> getSearchStatistics() {
        try {
            SearchService.SearchStatisticsDTO statistics = searchService.getSearchStatistics();
            return Result.success(statistics);
        } catch (Exception e) {
            logger.error("获取搜索统计失败", e);
            return Result.error("STATISTICS_ERROR", "获取搜索统计失败");
        }
    }

    /**
     * 搜索报告
     */
    @GetMapping("/report")
    @Operation(summary = "生成搜索报告", description = "生成指定时间范围的搜索报告")
    public Result<Map<String, Object>> generateSearchReport(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            Map<String, Object> report = keywordStatisticsService.generateSearchReport(startTime, endTime);
            return Result.success(report);
        } catch (Exception e) {
            logger.error("生成搜索报告失败", e);
            return Result.error("REPORT_ERROR", "生成搜索报告失败");
        }
    }

    /**
     * 推荐解释
     */
    @GetMapping("/recommendations/explain")
    @Operation(summary = "获取推荐解释", description = "获取推荐内容的解释说明")
    public Result<String> getRecommendationExplanation(
            @Parameter(description = "知识内容ID") @RequestParam Long knowledgeId,
            @Parameter(description = "推荐类型") @RequestParam String recommendationType,
            Authentication authentication) {
        try {
            Long userId = authentication != null && authentication.isAuthenticated() 
                    ? getUserIdFromAuthentication(authentication) : null;
            
            String explanation = recommendationService.getRecommendationExplanation(userId, knowledgeId, recommendationType);
            return Result.success(explanation);
        } catch (Exception e) {
            logger.error("获取推荐解释失败: knowledgeId={}, type={}", knowledgeId, recommendationType, e);
            return Result.error("EXPLANATION_ERROR", "获取推荐解释失败");
        }
    }

    // 私有辅助方法

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                return Long.parseLong(authentication.getName());
            } catch (NumberFormatException e) {
                logger.warn("无法解析用户ID: {}", authentication.getName());
            }
        }
        return null;
    }

    private void recordSearchAsync(String keyword, Long resultCount, Long categoryId) {
        // 异步记录搜索行为，避免影响响应时间
        try {
            searchService.recordSearch(keyword, resultCount, categoryId);
        } catch (Exception e) {
            logger.warn("异步记录搜索行为失败: keyword={}", keyword, e);
        }
    }
}