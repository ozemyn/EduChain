package com.example.educhain.service;

import com.example.educhain.dto.HotKeywordDTO;
import com.example.educhain.dto.SearchRequest;
import com.example.educhain.dto.SearchResultDTO;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 搜索服务接口
 */
public interface SearchService {

    /**
     * 执行搜索
     * @param request 搜索请求
     * @return 搜索结果分页
     */
    Page<SearchResultDTO> search(SearchRequest request);

    /**
     * 全文搜索
     * @param keyword 关键词
     * @param page 页码
     * @param size 每页大小
     * @return 搜索结果分页
     */
    Page<SearchResultDTO> fullTextSearch(String keyword, int page, int size);

    /**
     * 高级搜索
     * @param request 搜索请求
     * @return 搜索结果分页
     */
    Page<SearchResultDTO> advancedSearch(SearchRequest request);

    /**
     * 获取搜索建议
     * @param prefix 关键词前缀
     * @param limit 返回数量限制
     * @return 建议关键词列表
     */
    List<String> getSuggestions(String prefix, int limit);

    /**
     * 获取热门关键词
     * @param limit 返回数量限制
     * @return 热门关键词列表
     */
    List<HotKeywordDTO> getHotKeywords(int limit);

    /**
     * 获取今日热门关键词
     * @param limit 返回数量限制
     * @return 今日热门关键词列表
     */
    List<HotKeywordDTO> getTodayHotKeywords(int limit);

    /**
     * 获取趋势关键词
     * @param limit 返回数量限制
     * @return 趋势关键词列表
     */
    List<HotKeywordDTO> getTrendingKeywords(int limit);

    /**
     * 获取相关关键词
     * @param keyword 基础关键词
     * @param limit 返回数量限制
     * @return 相关关键词列表
     */
    List<String> getRelatedKeywords(String keyword, int limit);

    /**
     * 记录搜索行为
     * @param keyword 搜索关键词
     * @param resultCount 搜索结果数量
     * @param categoryId 主要分类ID
     */
    void recordSearch(String keyword, Long resultCount, Long categoryId);

    /**
     * 记录关键词点击
     * @param keyword 关键词
     */
    void recordKeywordClick(String keyword);

    /**
     * 更新搜索索引
     * @param knowledgeId 知识内容ID
     */
    void updateSearchIndex(Long knowledgeId);

    /**
     * 批量更新搜索索引
     * @param knowledgeIds 知识内容ID列表
     */
    void batchUpdateSearchIndex(List<Long> knowledgeIds);

    /**
     * 删除搜索索引
     * @param knowledgeId 知识内容ID
     */
    void deleteSearchIndex(Long knowledgeId);

    /**
     * 重建搜索索引
     */
    void rebuildSearchIndex();

    /**
     * 清理过期数据
     */
    void cleanupExpiredData();

    /**
     * 获取用户搜索历史
     * @param userId 用户ID
     * @param limit 返回数量限制
     * @return 搜索历史列表
     */
    List<String> getUserSearchHistory(Long userId, int limit);

    /**
     * 清空用户搜索历史
     * @param userId 用户ID
     */
    void clearUserSearchHistory(Long userId);

    /**
     * 获取搜索统计信息
     * @return 搜索统计信息
     */
    SearchStatisticsDTO getSearchStatistics();

    /**
     * 搜索统计信息DTO
     */
    class SearchStatisticsDTO {
        private Long totalSearches;
        private Long totalKeywords;
        private Long todaySearches;
        private Long weeklySearches;
        private Long monthlySearches;
        private Double averageResultCount;

        // 构造函数
        public SearchStatisticsDTO() {}

        public SearchStatisticsDTO(Long totalSearches, Long totalKeywords, Long todaySearches,
                                 Long weeklySearches, Long monthlySearches, Double averageResultCount) {
            this.totalSearches = totalSearches;
            this.totalKeywords = totalKeywords;
            this.todaySearches = todaySearches;
            this.weeklySearches = weeklySearches;
            this.monthlySearches = monthlySearches;
            this.averageResultCount = averageResultCount;
        }

        // Getters and Setters
        public Long getTotalSearches() {
            return totalSearches;
        }

        public void setTotalSearches(Long totalSearches) {
            this.totalSearches = totalSearches;
        }

        public Long getTotalKeywords() {
            return totalKeywords;
        }

        public void setTotalKeywords(Long totalKeywords) {
            this.totalKeywords = totalKeywords;
        }

        public Long getTodaySearches() {
            return todaySearches;
        }

        public void setTodaySearches(Long todaySearches) {
            this.todaySearches = todaySearches;
        }

        public Long getWeeklySearches() {
            return weeklySearches;
        }

        public void setWeeklySearches(Long weeklySearches) {
            this.weeklySearches = weeklySearches;
        }

        public Long getMonthlySearches() {
            return monthlySearches;
        }

        public void setMonthlySearches(Long monthlySearches) {
            this.monthlySearches = monthlySearches;
        }

        public Double getAverageResultCount() {
            return averageResultCount;
        }

        public void setAverageResultCount(Double averageResultCount) {
            this.averageResultCount = averageResultCount;
        }
    }
}