package com.example.educhain.service.impl;

import com.example.educhain.dto.HotKeywordDTO;
import com.example.educhain.dto.SearchRequest;
import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.entity.*;
import com.example.educhain.repository.*;
import com.example.educhain.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 搜索服务实现类
 */
@Service
@Transactional
public class SearchServiceImpl implements SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchServiceImpl.class);

    @Autowired
    private SearchIndexRepository searchIndexRepository;

    @Autowired
    private HotKeywordRepository hotKeywordRepository;

    @Autowired
    private KnowledgeItemRepository knowledgeItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserInteractionRepository userInteractionRepository;

    @Autowired
    private CommentRepository commentRepository;

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_SUGGESTION_LIMIT = 10;

    @Override
    public Page<SearchResultDTO> search(SearchRequest request) {
        logger.info("执行搜索: {}", request);

        // 参数验证和预处理
        String keyword = preprocessKeyword(request.getKeyword());
        if (!StringUtils.hasText(keyword)) {
            return Page.empty();
        }

        // 记录搜索行为
        recordSearchAsync(keyword, request.getCategoryId());

        // 创建分页对象
        Pageable pageable = createPageable(request);

        // 根据搜索类型选择搜索方法
        Page<SearchIndex> searchResults;
        if (request.getUseFullText() && isFullTextSearchAvailable()) {
            searchResults = performFullTextSearch(keyword, request, pageable);
        } else {
            searchResults = performFuzzySearch(keyword, request, pageable);
        }

        // 转换为DTO并添加高亮
        List<SearchResultDTO> resultDTOs = searchResults.getContent().stream()
                .map(index -> convertToSearchResultDTO(index, keyword, request.getHighlightKeyword()))
                .collect(Collectors.toList());

        return new PageImpl<>(resultDTOs, pageable, searchResults.getTotalElements());
    }

    @Override
    public Page<SearchResultDTO> fullTextSearch(String keyword, int page, int size) {
        SearchRequest request = new SearchRequest(keyword);
        request.setPage(page);
        request.setSize(size);
        request.setUseFullText(true);
        return search(request);
    }

    @Override
    public Page<SearchResultDTO> advancedSearch(SearchRequest request) {
        logger.info("执行高级搜索: {}", request);

        String keyword = preprocessKeyword(request.getKeyword());
        Pageable pageable = createPageable(request);

        // 使用高级搜索方法
        Page<SearchIndex> searchResults = searchIndexRepository.advancedSearch(
                request.getCategoryId(),
                request.getContentType(),
                request.getUploaderId(),
                keyword,
                1, // 正常状态
                pageable
        );

        // 记录搜索行为
        recordSearchAsync(keyword, request.getCategoryId());

        // 转换为DTO
        List<SearchResultDTO> resultDTOs = searchResults.getContent().stream()
                .map(index -> convertToSearchResultDTO(index, keyword, request.getHighlightKeyword()))
                .collect(Collectors.toList());

        return new PageImpl<>(resultDTOs, pageable, searchResults.getTotalElements());
    }

    @Override
    public List<String> getSuggestions(String prefix, int limit) {
        if (!StringUtils.hasText(prefix) || prefix.length() < 2) {
            return new ArrayList<>();
        }

        limit = Math.min(limit, DEFAULT_SUGGESTION_LIMIT);
        Pageable pageable = PageRequest.of(0, limit);

        List<HotKeyword> suggestions = hotKeywordRepository.findKeywordSuggestions(
                prefix.toLowerCase(), 1, pageable);

        return suggestions.stream()
                .map(HotKeyword::getKeyword)
                .collect(Collectors.toList());
    }

    @Override
    public List<HotKeywordDTO> getHotKeywords(int limit) {
        limit = Math.min(limit, 50);
        Pageable pageable = PageRequest.of(0, limit);

        List<HotKeyword> hotKeywords = hotKeywordRepository.findHotKeywordsByTrendScore(1, pageable);
        return hotKeywords.stream()
                .map(this::convertToHotKeywordDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HotKeywordDTO> getTodayHotKeywords(int limit) {
        limit = Math.min(limit, 20);
        Pageable pageable = PageRequest.of(0, limit);

        List<HotKeyword> todayHotKeywords = hotKeywordRepository.findTodayHotKeywords(1, pageable);
        return todayHotKeywords.stream()
                .map(this::convertToHotKeywordDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HotKeywordDTO> getTrendingKeywords(int limit) {
        limit = Math.min(limit, 20);
        Pageable pageable = PageRequest.of(0, limit);

        LocalDateTime since = LocalDateTime.now().minusDays(7); // 最近7天
        List<HotKeyword> trendingKeywords = hotKeywordRepository.findTrendingKeywords(since, 1, pageable);
        return trendingKeywords.stream()
                .map(this::convertToHotKeywordDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getRelatedKeywords(String keyword, int limit) {
        if (!StringUtils.hasText(keyword)) {
            return new ArrayList<>();
        }

        // 首先尝试通过分类查找相关关键词
        Optional<HotKeyword> hotKeyword = hotKeywordRepository.findByKeywordAndStatus(keyword, 1);
        if (hotKeyword.isPresent() && hotKeyword.get().getCategoryId() != null) {
            Pageable pageable = PageRequest.of(0, limit);
            List<HotKeyword> relatedKeywords = hotKeywordRepository.findRelatedKeywordsByCategory(
                    hotKeyword.get().getCategoryId(), 1, pageable);
            
            return relatedKeywords.stream()
                    .map(HotKeyword::getKeyword)
                    .filter(k -> !k.equals(keyword))
                    .collect(Collectors.toList());
        }

        // 如果没有分类信息，返回热门关键词
        return getHotKeywords(limit).stream()
                .map(HotKeywordDTO::getKeyword)
                .filter(k -> !k.equals(keyword))
                .collect(Collectors.toList());
    }

    @Override
    public void recordSearch(String keyword, Long resultCount, Long categoryId) {
        if (!StringUtils.hasText(keyword)) {
            return;
        }

        try {
            keyword = preprocessKeyword(keyword);
            
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
            logger.debug("记录搜索关键词: {} (结果数: {})", keyword, resultCount);
        } catch (Exception e) {
            logger.error("记录搜索关键词失败: {}", keyword, e);
        }
    }

    @Override
    public void recordKeywordClick(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return;
        }

        try {
            Optional<HotKeyword> hotKeyword = hotKeywordRepository.findByKeyword(keyword);
            if (hotKeyword.isPresent()) {
                hotKeyword.get().incrementClickCount();
                hotKeywordRepository.save(hotKeyword.get());
                logger.debug("记录关键词点击: {}", keyword);
            }
        } catch (Exception e) {
            logger.error("记录关键词点击失败: {}", keyword, e);
        }
    }

    @Override
    public void updateSearchIndex(Long knowledgeId) {
        try {
            Optional<KnowledgeItem> knowledgeItem = knowledgeItemRepository.findById(knowledgeId);
            if (knowledgeItem.isPresent()) {
                updateSearchIndexForKnowledge(knowledgeItem.get());
                logger.debug("更新搜索索引: {}", knowledgeId);
            }
        } catch (Exception e) {
            logger.error("更新搜索索引失败: {}", knowledgeId, e);
        }
    }

    @Override
    public void batchUpdateSearchIndex(List<Long> knowledgeIds) {
        for (Long knowledgeId : knowledgeIds) {
            updateSearchIndex(knowledgeId);
        }
    }

    @Override
    public void deleteSearchIndex(Long knowledgeId) {
        try {
            searchIndexRepository.deleteByKnowledgeId(knowledgeId);
            logger.debug("删除搜索索引: {}", knowledgeId);
        } catch (Exception e) {
            logger.error("删除搜索索引失败: {}", knowledgeId, e);
        }
    }

    @Override
    public void rebuildSearchIndex() {
        logger.info("开始重建搜索索引");
        
        try {
            // 清空现有索引
            searchIndexRepository.deleteAll();
            
            // 重建索引
            List<KnowledgeItem> allKnowledge = knowledgeItemRepository.findByStatus(1);
            for (KnowledgeItem knowledge : allKnowledge) {
                updateSearchIndexForKnowledge(knowledge);
            }
            
            logger.info("搜索索引重建完成，共处理 {} 条记录", allKnowledge.size());
        } catch (Exception e) {
            logger.error("重建搜索索引失败", e);
        }
    }

    @Override
    public void cleanupExpiredData() {
        try {
            // 清理低频关键词
            LocalDateTime cutoffTime = LocalDateTime.now().minusMonths(3);
            int cleanedCount = hotKeywordRepository.cleanupLowFrequencyKeywords(5L, cutoffTime);
            logger.info("清理低频关键词: {} 条", cleanedCount);
        } catch (Exception e) {
            logger.error("清理过期数据失败", e);
        }
    }

    @Override
    public SearchStatisticsDTO getSearchStatistics() {
        try {
            Long totalKeywords = hotKeywordRepository.countByStatus(1);
            Long todaySearches = hotKeywordRepository.sumDailySearchCount(1);
            Long weeklySearches = hotKeywordRepository.sumWeeklySearchCount(1);
            Long monthlySearches = hotKeywordRepository.sumMonthlySearchCount(1);
            
            // 计算总搜索次数
            List<HotKeyword> allKeywords = hotKeywordRepository.findAll();
            Long totalSearches = allKeywords.stream()
                    .mapToLong(HotKeyword::getSearchCount)
                    .sum();
            
            // 计算平均结果数
            Double averageResultCount = allKeywords.stream()
                    .filter(k -> k.getResultCount() > 0)
                    .mapToLong(HotKeyword::getResultCount)
                    .average()
                    .orElse(0.0);
            
            return new SearchStatisticsDTO(totalSearches, totalKeywords, todaySearches,
                    weeklySearches, monthlySearches, averageResultCount);
        } catch (Exception e) {
            logger.error("获取搜索统计信息失败", e);
            return new SearchStatisticsDTO(0L, 0L, 0L, 0L, 0L, 0.0);
        }
    }

    // 私有辅助方法

    private String preprocessKeyword(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return "";
        }
        
        // 去除多余空格，转换为小写
        return keyword.trim().toLowerCase();
    }

    private Pageable createPageable(SearchRequest request) {
        int page = Math.max(0, request.getPage());
        int size = Math.min(Math.max(1, request.getSize()), MAX_PAGE_SIZE);
        return PageRequest.of(page, size);
    }

    private boolean isFullTextSearchAvailable() {
        // 检查是否支持全文搜索（这里简化处理，实际应该检查数据库配置）
        return true;
    }

    private Page<SearchIndex> performFullTextSearch(String keyword, SearchRequest request, Pageable pageable) {
        if (hasAdvancedFilters(request)) {
            return searchIndexRepository.advancedSearch(
                    request.getCategoryId(),
                    request.getContentType(),
                    request.getUploaderId(),
                    keyword,
                    1,
                    pageable
            );
        } else {
            return searchIndexRepository.fullTextSearch(keyword, 1, pageable);
        }
    }

    private Page<SearchIndex> performFuzzySearch(String keyword, SearchRequest request, Pageable pageable) {
        if (hasAdvancedFilters(request)) {
            return searchIndexRepository.advancedSearch(
                    request.getCategoryId(),
                    request.getContentType(),
                    request.getUploaderId(),
                    keyword,
                    1,
                    pageable
            );
        } else {
            return searchIndexRepository.fuzzySearch(keyword, 1, pageable);
        }
    }

    private boolean hasAdvancedFilters(SearchRequest request) {
        return request.getCategoryId() != null || 
               request.getContentType() != null || 
               request.getUploaderId() != null;
    }

    private SearchResultDTO convertToSearchResultDTO(SearchIndex index, String keyword, Boolean highlight) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(index.getKnowledgeId());
        dto.setTitle(index.getTitle());
        dto.setContentSummary(index.getContentSummary());
        dto.setType(index.getContentType());
        dto.setUploaderId(index.getUploaderId());
        dto.setUploaderName(index.getUploaderName());
        dto.setCategoryId(index.getCategoryId());
        dto.setCategoryName(index.getCategoryName());
        dto.setTags(index.getTags());
        dto.setViewCount(index.getViewCount());
        dto.setLikeCount(index.getLikeCount());
        dto.setFavoriteCount(index.getFavoriteCount());
        dto.setCommentCount(index.getCommentCount());
        dto.setQualityScore(index.getQualityScore());
        dto.setCreatedAt(index.getCreatedAt());
        dto.setUpdatedAt(index.getUpdatedAt());

        // 添加高亮
        if (highlight && StringUtils.hasText(keyword)) {
            dto.setHighlightedTitle(highlightKeyword(index.getTitle(), keyword));
            dto.setHighlightedContent(highlightKeyword(index.getContentSummary(), keyword));
            dto.setHighlightedTags(highlightKeyword(index.getTags(), keyword));
        }

        return dto;
    }

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
                hotKeyword.getCategoryName()
        );
    }

    private String highlightKeyword(String text, String keyword) {
        if (!StringUtils.hasText(text) || !StringUtils.hasText(keyword)) {
            return text;
        }

        try {
            String pattern = "(?i)" + Pattern.quote(keyword);
            return text.replaceAll(pattern, "<mark>$0</mark>");
        } catch (Exception e) {
            logger.warn("关键词高亮失败: {}", keyword, e);
            return text;
        }
    }

    private void updateSearchIndexForKnowledge(KnowledgeItem knowledge) {
        try {
            // 获取用户信息
            Optional<User> uploader = userRepository.findById(knowledge.getUploaderId());
            String uploaderName = uploader.map(User::getFullName).orElse("未知用户");

            // 获取分类信息
            Optional<Category> category = categoryRepository.findById(knowledge.getCategoryId());
            String categoryName = category.map(Category::getName).orElse("未分类");

            // 获取统计信息
            Long viewCount = userInteractionRepository.countByKnowledgeIdAndInteractionType(
                    knowledge.getId(), UserInteraction.InteractionType.VIEW);
            Long likeCount = userInteractionRepository.countByKnowledgeIdAndInteractionType(
                    knowledge.getId(), UserInteraction.InteractionType.LIKE);
            Long favoriteCount = userInteractionRepository.countByKnowledgeIdAndInteractionType(
                    knowledge.getId(), UserInteraction.InteractionType.FAVORITE);
            Long commentCount = commentRepository.countByKnowledgeIdAndStatus(knowledge.getId(), 1);

            // 创建或更新搜索索引
            Optional<SearchIndex> existingIndex = searchIndexRepository.findByKnowledgeId(knowledge.getId());
            SearchIndex searchIndex;

            if (existingIndex.isPresent()) {
                searchIndex = existingIndex.get();
                searchIndex.setTitle(knowledge.getTitle());
                searchIndex.setTags(knowledge.getTags());
                searchIndex.setCategoryId(knowledge.getCategoryId());
                searchIndex.setCategoryName(categoryName);
                searchIndex.setUploaderName(uploaderName);
                searchIndex.setContentType(knowledge.getType());
                searchIndex.setStatus(knowledge.getStatus());
                
                // 更新内容摘要和搜索文本
                if (knowledge.getContent() != null && knowledge.getContent().length() > 500) {
                    searchIndex.setContentSummary(knowledge.getContent().substring(0, 500) + "...");
                } else {
                    searchIndex.setContentSummary(knowledge.getContent());
                }
                
                // 重新构建搜索文本
                StringBuilder searchText = new StringBuilder();
                if (knowledge.getTitle() != null) searchText.append(knowledge.getTitle()).append(" ");
                if (knowledge.getContent() != null) searchText.append(knowledge.getContent()).append(" ");
                if (knowledge.getTags() != null) searchText.append(knowledge.getTags()).append(" ");
                if (categoryName != null) searchText.append(categoryName).append(" ");
                if (uploaderName != null) searchText.append(uploaderName).append(" ");
                searchIndex.setSearchText(searchText.toString().trim());
            } else {
                searchIndex = new SearchIndex(
                        knowledge.getId(),
                        knowledge.getTitle(),
                        knowledge.getContent(),
                        knowledge.getTags(),
                        knowledge.getCategoryId(),
                        categoryName,
                        knowledge.getUploaderId(),
                        uploaderName,
                        knowledge.getType()
                );
                searchIndex.setStatus(knowledge.getStatus());
            }

            // 更新统计数据
            searchIndex.updateStats(viewCount, likeCount, favoriteCount, commentCount);

            searchIndexRepository.save(searchIndex);
        } catch (Exception e) {
            logger.error("更新知识内容搜索索引失败: {}", knowledge.getId(), e);
        }
    }

    private void recordSearchAsync(String keyword, Long categoryId) {
        // 异步记录搜索行为，避免影响搜索性能
        try {
            // 获取搜索结果数量
            Long resultCount = searchIndexRepository.countSearchResults(keyword, 1);
            recordSearch(keyword, resultCount, categoryId);
        } catch (Exception e) {
            logger.warn("异步记录搜索行为失败: {}", keyword, e);
        }
    }
}