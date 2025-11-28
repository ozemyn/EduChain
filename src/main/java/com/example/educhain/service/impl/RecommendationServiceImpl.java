package com.example.educhain.service.impl;

import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.entity.*;
import com.example.educhain.repository.*;
import com.example.educhain.service.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 推荐算法服务实现类
 */
@Service
@Transactional(readOnly = true)
public class RecommendationServiceImpl implements RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationServiceImpl.class);

    @Autowired
    private SearchIndexRepository searchIndexRepository;

    @Autowired
    private UserInteractionRepository userInteractionRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private KnowledgeItemRepository knowledgeItemRepository;

    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 50;

    @Override
    public List<SearchResultDTO> getPersonalizedRecommendations(Long userId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            // 获取用户偏好分析
            Map<String, Object> preferences = getUserPreferenceAnalysis(userId);
            
            // 基于用户偏好的推荐权重
            List<SearchResultDTO> recommendations = new ArrayList<>();
            
            // 1. 基于用户历史行为的推荐 (40%)
            List<SearchResultDTO> behaviorBased = getBehaviorBasedRecommendations(userId, "mixed", limit / 2);
            recommendations.addAll(behaviorBased);
            
            // 2. 基于协同过滤的推荐 (30%)
            List<SearchResultDTO> collaborative = getCollaborativeFilteringRecommendations(userId, limit / 3);
            recommendations.addAll(collaborative);
            
            // 3. 热门内容推荐 (20%)
            @SuppressWarnings("unchecked")
            List<Long> preferredCategories = (List<Long>) preferences.getOrDefault("preferredCategories", new ArrayList<>());
            Long topCategoryId = preferredCategories.isEmpty() ? null : preferredCategories.get(0);
            List<SearchResultDTO> popular = getPopularRecommendations(topCategoryId, limit / 5);
            recommendations.addAll(popular);
            
            // 4. 最新内容推荐 (10%)
            List<SearchResultDTO> latest = getLatestRecommendations(topCategoryId, limit / 10);
            recommendations.addAll(latest);
            
            // 去重并按质量分数排序
            return recommendations.stream()
                    .collect(Collectors.toMap(
                            SearchResultDTO::getId,
                            dto -> dto,
                            (existing, replacement) -> existing.getQualityScore() > replacement.getQualityScore() ? existing : replacement
                    ))
                    .values()
                    .stream()
                    .sorted((a, b) -> Double.compare(b.getQualityScore(), a.getQualityScore()))
                    .limit(limit)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取个性化推荐失败 - 详细错误: userId={}, 错误类型={}, 错误信息={}", 
                    userId, e.getClass().getSimpleName(), e.getMessage(), e);
            // 降级到热门推荐
            return getPopularRecommendations(null, limit);
        }
    }

    @Override
    public List<SearchResultDTO> getContentBasedRecommendations(Long knowledgeId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            // 获取基础内容的搜索索引
            Optional<SearchIndex> baseIndex = searchIndexRepository.findByKnowledgeIdAndStatus(knowledgeId, 1);
            if (!baseIndex.isPresent()) {
                return new ArrayList<>();
            }
            
            SearchIndex base = baseIndex.get();
            Pageable pageable = PageRequest.of(0, limit * 2); // 获取更多候选项
            
            // 基于标签相似度的推荐
            List<SearchIndex> similarContent = searchIndexRepository.findSimilarContent(knowledgeId, 1, pageable);
            
            // 计算相似度分数并排序
            List<SearchResultDTO> recommendations = similarContent.stream()
                    .map(index -> {
                        SearchResultDTO dto = convertToSearchResultDTO(index);
                        // 计算相似度分数
                        double similarity = calculateContentSimilarityScore(base, index);
                        dto.setRelevanceScore(similarity);
                        return dto;
                    })
                    .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                    .limit(limit)
                    .collect(Collectors.toList());
            
            logger.debug("基于内容的推荐: knowledgeId={}, 推荐数量={}", knowledgeId, recommendations.size());
            return recommendations;
            
        } catch (Exception e) {
            logger.error("获取基于内容的推荐失败 - 详细错误: knowledgeId={}, 错误类型={}, 错误信息={}", 
                    knowledgeId, e.getClass().getSimpleName(), e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SearchResultDTO> getCollaborativeFilteringRecommendations(Long userId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            // 1. 找到相似用户
            List<Long> similarUsers = findSimilarUsers(userId, 20);
            if (similarUsers.isEmpty()) {
                return getPopularRecommendations(null, limit);
            }
            
            // 2. 获取相似用户喜欢的内容
            Map<Long, Double> contentScores = new HashMap<>();
            
            for (Long similarUserId : similarUsers) {
                List<UserInteraction> interactions = userInteractionRepository
                        .findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
                                similarUserId, UserInteraction.InteractionType.LIKE, PageRequest.of(0, 50)).getContent();
                
                double userSimilarity = calculateUserSimilarity(userId, similarUserId);
                
                for (UserInteraction interaction : interactions) {
                    Long knowledgeId = interaction.getKnowledgeId();
                    
                    // 检查当前用户是否已经互动过这个内容
                    boolean alreadyInteracted = userInteractionRepository
                            .existsByUserIdAndKnowledgeId(userId, knowledgeId);
                    
                    if (!alreadyInteracted) {
                        contentScores.merge(knowledgeId, userSimilarity, Double::sum);
                    }
                }
            }
            
            // 3. 按分数排序并获取推荐内容
            List<Long> recommendedIds = contentScores.entrySet().stream()
                    .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                    .limit(limit)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            // 4. 转换为DTO
            List<SearchResultDTO> recommendations = new ArrayList<>();
            for (Long knowledgeId : recommendedIds) {
                Optional<SearchIndex> index = searchIndexRepository.findByKnowledgeIdAndStatus(knowledgeId, 1);
                if (index.isPresent()) {
                    SearchResultDTO dto = convertToSearchResultDTO(index.get());
                    dto.setRelevanceScore(contentScores.get(knowledgeId));
                    recommendations.add(dto);
                }
            }
            
            logger.debug("协同过滤推荐: userId={}, 相似用户数={}, 推荐数量={}", 
                    userId, similarUsers.size(), recommendations.size());
            return recommendations;
            
        } catch (Exception e) {
            logger.error("获取协同过滤推荐失败 - 详细错误: userId={}, 错误类型={}, 错误信息={}", 
                    userId, e.getClass().getSimpleName(), e.getMessage(), e);
            return getPopularRecommendations(null, limit);
        }
    }

    @Override
    @Transactional(readOnly = true, noRollbackFor = Exception.class)
    public List<SearchResultDTO> getPopularRecommendations(Long categoryId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        Pageable pageable = PageRequest.of(0, limit);
        
        try {
            List<SearchIndex> popularContent;
            if (categoryId != null) {
                popularContent = searchIndexRepository.findPopularContentByCategory(categoryId, 1, pageable).getContent();
            } else {
                popularContent = searchIndexRepository.findPopularContent(1, pageable).getContent();
            }
            
            if (popularContent.isEmpty()) {
                logger.warn("热门推荐查询结果为空: categoryId={}", categoryId);
            }
            
            return popularContent.stream()
                    .map(this::convertToSearchResultDTO)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取热门推荐失败 - 详细错误: categoryId={}, 错误类型={}, 错误信息={}", 
                    categoryId, e.getClass().getSimpleName(), e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SearchResultDTO> getLatestRecommendations(Long categoryId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        Pageable pageable = PageRequest.of(0, limit);
        
        try {
            List<SearchIndex> latestContent = searchIndexRepository.findLatestContent(1, pageable).getContent();
            
            if (categoryId != null) {
                latestContent = latestContent.stream()
                        .filter(index -> categoryId.equals(index.getCategoryId()))
                        .collect(Collectors.toList());
            }
            
            if (latestContent.isEmpty()) {
                logger.warn("最新推荐查询结果为空: categoryId={}", categoryId);
            }
            
            return latestContent.stream()
                    .map(this::convertToSearchResultDTO)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取最新推荐失败 - 详细错误: categoryId={}, 错误类型={}, 错误信息={}", 
                    categoryId, e.getClass().getSimpleName(), e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SearchResultDTO> getTagBasedRecommendations(List<String> tags, Long excludeId, int limit) {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            Set<SearchResultDTO> recommendations = new HashSet<>();
            
            for (String tag : tags) {
                if (StringUtils.hasText(tag)) {
                    List<SearchIndex> taggedContent = searchIndexRepository.fuzzySearch(tag, 1, 
                            PageRequest.of(0, limit / tags.size() + 5)).getContent();
                    
                    for (SearchIndex index : taggedContent) {
                        if (!index.getKnowledgeId().equals(excludeId)) {
                            SearchResultDTO dto = convertToSearchResultDTO(index);
                            // 计算标签匹配度
                            double tagMatchScore = calculateTagMatchScore(tags, index.getTags());
                            dto.setRelevanceScore(tagMatchScore);
                            recommendations.add(dto);
                        }
                    }
                }
            }
            
            return recommendations.stream()
                    .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                    .limit(limit)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取基于标签的推荐失败: tags={}", tags, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SearchResultDTO> getBehaviorBasedRecommendations(Long userId, String behaviorType, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            List<Long> categoryIds = new ArrayList<>();
            List<String> tags = new ArrayList<>();
            
            // 根据行为类型获取用户偏好
            if ("like".equals(behaviorType) || "mixed".equals(behaviorType)) {
                List<UserInteraction> likes = userInteractionRepository
                        .findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
                                userId, UserInteraction.InteractionType.LIKE, PageRequest.of(0, 50)).getContent();
                
                for (UserInteraction like : likes) {
                    Optional<SearchIndex> index = searchIndexRepository.findByKnowledgeIdAndStatus(like.getKnowledgeId(), 1);
                    if (index.isPresent()) {
                        if (index.get().getCategoryId() != null) {
                            categoryIds.add(index.get().getCategoryId());
                        }
                        if (StringUtils.hasText(index.get().getTags())) {
                            tags.addAll(Arrays.asList(index.get().getTags().split(",")));
                        }
                    }
                }
            }
            
            if ("favorite".equals(behaviorType) || "mixed".equals(behaviorType)) {
                List<UserInteraction> favorites = userInteractionRepository
                        .findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
                                userId, UserInteraction.InteractionType.FAVORITE, PageRequest.of(0, 30)).getContent();
                
                for (UserInteraction favorite : favorites) {
                    Optional<SearchIndex> index = searchIndexRepository.findByKnowledgeIdAndStatus(favorite.getKnowledgeId(), 1);
                    if (index.isPresent()) {
                        if (index.get().getCategoryId() != null) {
                            categoryIds.add(index.get().getCategoryId());
                        }
                        if (StringUtils.hasText(index.get().getTags())) {
                            tags.addAll(Arrays.asList(index.get().getTags().split(",")));
                        }
                    }
                }
            }
            
            // 统计偏好分类和标签
            Map<Long, Long> categoryFreq = categoryIds.stream()
                    .collect(Collectors.groupingBy(id -> id, Collectors.counting()));
            
            Map<String, Long> tagFreq = tags.stream()
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
            
            // 基于偏好推荐内容
            List<SearchResultDTO> recommendations = new ArrayList<>();
            
            // 基于偏好分类推荐
            List<Long> topCategories = categoryFreq.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            for (Long categoryId : topCategories) {
                List<SearchIndex> categoryContent = searchIndexRepository.findRecommendedContent(
                        Arrays.asList(categoryId), userId, 1, PageRequest.of(0, limit / topCategories.size() + 2));
                
                recommendations.addAll(categoryContent.stream()
                        .map(this::convertToSearchResultDTO)
                        .collect(Collectors.toList()));
            }
            
            // 基于偏好标签推荐
            List<String> topTags = tagFreq.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            if (!topTags.isEmpty()) {
                recommendations.addAll(getTagBasedRecommendations(topTags, null, limit / 2));
            }
            
            // 去重并排序
            return recommendations.stream()
                    .collect(Collectors.toMap(
                            SearchResultDTO::getId,
                            dto -> dto,
                            (existing, replacement) -> existing.getQualityScore() > replacement.getQualityScore() ? existing : replacement
                    ))
                    .values()
                    .stream()
                    .sorted((a, b) -> Double.compare(b.getQualityScore(), a.getQualityScore()))
                    .limit(limit)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取基于行为的推荐失败: userId={}, behaviorType={}", userId, behaviorType, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SearchResultDTO> getHybridRecommendations(Long userId, int limit) {
        limit = Math.min(limit, MAX_LIMIT);
        
        try {
            List<SearchResultDTO> hybridRecommendations = new ArrayList<>();
            
            // 混合推荐策略权重分配
            int personalizedCount = (int) (limit * 0.4); // 40% 个性化推荐
            int contentBasedCount = (int) (limit * 0.2);  // 20% 基于内容推荐
            int popularCount = (int) (limit * 0.3);       // 30% 热门推荐
            int latestCount = limit - personalizedCount - contentBasedCount - popularCount; // 10% 最新推荐
            
            // 1. 个性化推荐
            List<SearchResultDTO> personalized = getPersonalizedRecommendations(userId, personalizedCount);
            hybridRecommendations.addAll(personalized);
            
            // 2. 基于用户最近互动内容的相似推荐
            List<UserInteraction> recentInteractions = userInteractionRepository
                    .findByUserIdAndInteractionTypeOrderByCreatedAtDesc(
                            userId, UserInteraction.InteractionType.LIKE, PageRequest.of(0, 5)).getContent();
            
            if (!recentInteractions.isEmpty()) {
                Long recentKnowledgeId = recentInteractions.get(0).getKnowledgeId();
                List<SearchResultDTO> contentBased = getContentBasedRecommendations(recentKnowledgeId, contentBasedCount);
                hybridRecommendations.addAll(contentBased);
            }
            
            // 3. 热门推荐
            List<SearchResultDTO> popular = getPopularRecommendations(null, popularCount);
            hybridRecommendations.addAll(popular);
            
            // 4. 最新推荐
            List<SearchResultDTO> latest = getLatestRecommendations(null, latestCount);
            hybridRecommendations.addAll(latest);
            
            // 去重、重新排序并限制数量
            return hybridRecommendations.stream()
                    .collect(Collectors.toMap(
                            SearchResultDTO::getId,
                            dto -> dto,
                            (existing, replacement) -> {
                                // 保留质量分数更高的
                                double existingScore = existing.getQualityScore() + (existing.getRelevanceScore() != null ? existing.getRelevanceScore() : 0);
                                double replacementScore = replacement.getQualityScore() + (replacement.getRelevanceScore() != null ? replacement.getRelevanceScore() : 0);
                                return existingScore > replacementScore ? existing : replacement;
                            }
                    ))
                    .values()
                    .stream()
                    .sorted((a, b) -> {
                        double scoreA = a.getQualityScore() + (a.getRelevanceScore() != null ? a.getRelevanceScore() : 0);
                        double scoreB = b.getQualityScore() + (b.getRelevanceScore() != null ? b.getRelevanceScore() : 0);
                        return Double.compare(scoreB, scoreA);
                    })
                    .limit(limit)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("获取混合推荐失败: userId={}", userId, e);
            return getPopularRecommendations(null, limit);
        }
    }

    @Override
    public Double calculateContentSimilarity(Long knowledgeId1, Long knowledgeId2) {
        try {
            Optional<SearchIndex> index1 = searchIndexRepository.findByKnowledgeIdAndStatus(knowledgeId1, 1);
            Optional<SearchIndex> index2 = searchIndexRepository.findByKnowledgeIdAndStatus(knowledgeId2, 1);
            
            if (!index1.isPresent() || !index2.isPresent()) {
                return 0.0;
            }
            
            return calculateContentSimilarityScore(index1.get(), index2.get());
        } catch (Exception e) {
            logger.error("计算内容相似度失败: id1={}, id2={}", knowledgeId1, knowledgeId2, e);
            return 0.0;
        }
    }

    @Override
    public Double calculateUserSimilarity(Long userId1, Long userId2) {
        try {
            // 基于用户行为计算相似度
            List<UserInteraction> user1Interactions = userInteractionRepository
                    .findByUserIdOrderByCreatedAtDesc(userId1, PageRequest.of(0, 100)).getContent();
            List<UserInteraction> user2Interactions = userInteractionRepository
                    .findByUserIdOrderByCreatedAtDesc(userId2, PageRequest.of(0, 100)).getContent();
            
            Set<Long> user1Knowledge = user1Interactions.stream()
                    .map(UserInteraction::getKnowledgeId)
                    .collect(Collectors.toSet());
            Set<Long> user2Knowledge = user2Interactions.stream()
                    .map(UserInteraction::getKnowledgeId)
                    .collect(Collectors.toSet());
            
            // 计算Jaccard相似度
            Set<Long> intersection = new HashSet<>(user1Knowledge);
            intersection.retainAll(user2Knowledge);
            
            Set<Long> union = new HashSet<>(user1Knowledge);
            union.addAll(user2Knowledge);
            
            if (union.isEmpty()) {
                return 0.0;
            }
            
            return (double) intersection.size() / union.size();
        } catch (Exception e) {
            logger.error("计算用户相似度失败: userId1={}, userId2={}", userId1, userId2, e);
            return 0.0;
        }
    }

    @Override
    public void updateUserPreferenceModel(Long userId) {
        // 这里可以实现更复杂的用户偏好模型更新逻辑
        logger.debug("更新用户偏好模型: userId={}", userId);
    }

    @Override
    public Map<String, Object> getUserPreferenceAnalysis(Long userId) {
        Map<String, Object> preferences = new HashMap<>();
        
        try {
            // 分析用户的分类偏好
            List<UserInteraction> interactions = userInteractionRepository
                    .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 200)).getContent();
            
            Map<Long, Long> categoryPreferences = new HashMap<>();
            Map<String, Long> tagPreferences = new HashMap<>();
            Map<KnowledgeItem.ContentType, Long> typePreferences = new HashMap<>();
            
            for (UserInteraction interaction : interactions) {
                Optional<SearchIndex> index = searchIndexRepository.findByKnowledgeIdAndStatus(interaction.getKnowledgeId(), 1);
                if (index.isPresent()) {
                    SearchIndex searchIndex = index.get();
                    
                    // 分类偏好
                    if (searchIndex.getCategoryId() != null) {
                        categoryPreferences.merge(searchIndex.getCategoryId(), 1L, Long::sum);
                    }
                    
                    // 标签偏好
                    if (StringUtils.hasText(searchIndex.getTags())) {
                        Arrays.stream(searchIndex.getTags().split(","))
                                .map(String::trim)
                                .filter(StringUtils::hasText)
                                .forEach(tag -> tagPreferences.merge(tag, 1L, Long::sum));
                    }
                    
                    // 内容类型偏好
                    if (searchIndex.getContentType() != null) {
                        typePreferences.merge(searchIndex.getContentType(), 1L, Long::sum);
                    }
                }
            }
            
            // 排序并获取Top偏好
            List<Long> preferredCategories = categoryPreferences.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            List<String> preferredTags = tagPreferences.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(10)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            List<KnowledgeItem.ContentType> preferredTypes = typePreferences.entrySet().stream()
                    .sorted(Map.Entry.<KnowledgeItem.ContentType, Long>comparingByValue().reversed())
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            
            preferences.put("preferredCategories", preferredCategories);
            preferences.put("preferredTags", preferredTags);
            preferences.put("preferredTypes", preferredTypes);
            preferences.put("totalInteractions", interactions.size());
            preferences.put("analysisTime", LocalDateTime.now());
            
        } catch (Exception e) {
            logger.error("分析用户偏好失败: userId={}", userId, e);
        }
        
        return preferences;
    }

    @Override
    public void recordRecommendationClick(Long userId, Long knowledgeId, String recommendationType, Integer position) {
        // 记录推荐点击行为，用于评估推荐效果
        logger.debug("记录推荐点击: userId={}, knowledgeId={}, type={}, position={}", 
                userId, knowledgeId, recommendationType, position);
    }

    @Override
    public Map<String, Object> getRecommendationEffectiveness(String recommendationType) {
        Map<String, Object> effectiveness = new HashMap<>();
        effectiveness.put("recommendationType", recommendationType);
        effectiveness.put("message", "推荐效果统计功能待实现");
        return effectiveness;
    }

    @Override
    public void trainRecommendationModel() {
        logger.info("训练推荐模型 - 功能待实现");
    }

    @Override
    public String getRecommendationExplanation(Long userId, Long knowledgeId, String recommendationType) {
        try {
            switch (recommendationType) {
                case "personalized":
                    return "基于您的浏览历史和偏好推荐";
                case "content_based":
                    return "因为您对相似内容感兴趣";
                case "collaborative":
                    return "喜欢相似内容的用户也喜欢这个";
                case "popular":
                    return "热门推荐";
                case "latest":
                    return "最新发布";
                case "tag_based":
                    return "基于相关标签推荐";
                default:
                    return "为您推荐";
            }
        } catch (Exception e) {
            logger.error("获取推荐解释失败", e);
            return "为您推荐";
        }
    }

    // 私有辅助方法

    private SearchResultDTO convertToSearchResultDTO(SearchIndex index) {
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
        return dto;
    }

    private double calculateContentSimilarityScore(SearchIndex index1, SearchIndex index2) {
        double similarity = 0.0;
        
        // 分类相似度 (权重: 30%)
        if (Objects.equals(index1.getCategoryId(), index2.getCategoryId())) {
            similarity += 0.3;
        }
        
        // 标签相似度 (权重: 40%)
        double tagSimilarity = calculateTagSimilarity(index1.getTags(), index2.getTags());
        similarity += tagSimilarity * 0.4;
        
        // 内容类型相似度 (权重: 20%)
        if (Objects.equals(index1.getContentType(), index2.getContentType())) {
            similarity += 0.2;
        }
        
        // 上传者相似度 (权重: 10%)
        if (Objects.equals(index1.getUploaderId(), index2.getUploaderId())) {
            similarity += 0.1;
        }
        
        return Math.min(1.0, similarity);
    }

    private double calculateTagSimilarity(String tags1, String tags2) {
        if (!StringUtils.hasText(tags1) || !StringUtils.hasText(tags2)) {
            return 0.0;
        }
        
        Set<String> tagSet1 = Arrays.stream(tags1.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
        
        Set<String> tagSet2 = Arrays.stream(tags2.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
        
        if (tagSet1.isEmpty() || tagSet2.isEmpty()) {
            return 0.0;
        }
        
        Set<String> intersection = new HashSet<>(tagSet1);
        intersection.retainAll(tagSet2);
        
        Set<String> union = new HashSet<>(tagSet1);
        union.addAll(tagSet2);
        
        return (double) intersection.size() / union.size();
    }

    private double calculateTagMatchScore(List<String> queryTags, String contentTags) {
        if (queryTags == null || queryTags.isEmpty() || !StringUtils.hasText(contentTags)) {
            return 0.0;
        }
        
        Set<String> contentTagSet = Arrays.stream(contentTags.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
        
        if (contentTagSet.isEmpty()) {
            return 0.0;
        }
        
        long matchCount = queryTags.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .mapToLong(tag -> contentTagSet.contains(tag) ? 1 : 0)
                .sum();
        
        return (double) matchCount / queryTags.size();
    }

    private List<Long> findSimilarUsers(Long userId, int limit) {
        try {
            // 简化的相似用户查找算法
            List<UserInteraction> userInteractions = userInteractionRepository
                    .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 100)).getContent();
            
            Set<Long> userKnowledgeIds = userInteractions.stream()
                    .map(UserInteraction::getKnowledgeId)
                    .collect(Collectors.toSet());
            
            if (userKnowledgeIds.isEmpty()) {
                return new ArrayList<>();
            }
            
            // 找到对相同内容有互动的其他用户
            Map<Long, Long> userSimilarityCount = new HashMap<>();
            
            for (Long knowledgeId : userKnowledgeIds) {
                List<UserInteraction> otherInteractions = userInteractionRepository
                        .findByKnowledgeIdAndUserIdNot(knowledgeId, userId);
                
                for (UserInteraction interaction : otherInteractions) {
                    userSimilarityCount.merge(interaction.getUserId(), 1L, Long::sum);
                }
            }
            
            return userSimilarityCount.entrySet().stream()
                    .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                    .limit(limit)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            logger.error("查找相似用户失败: userId={}", userId, e);
            return new ArrayList<>();
        }
    }
}