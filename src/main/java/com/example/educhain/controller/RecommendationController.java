package com.example.educhain.controller;

import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.service.RecommendationService;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 推荐系统控制器
 */
@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "推荐系统", description = "内容推荐相关接口")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);

    @Autowired
    private RecommendationService recommendationService;

    /**
     * 获取推荐内容（通用接口）
     */
    @GetMapping
    @Operation(summary = "获取推荐内容", description = "获取推荐内容列表")
    public Result<List<SearchResultDTO>> getRecommendations(
            @Parameter(description = "推荐类型") @RequestParam(defaultValue = "popular") String type,
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            List<SearchResultDTO> recommendations;
            
            switch (type.toLowerCase()) {
                case "personalized":
                    Long userId = getCurrentUserId();
                    if (userId != null) {
                        recommendations = recommendationService.getPersonalizedRecommendations(userId, limit);
                    } else {
                        recommendations = recommendationService.getPopularRecommendations(categoryId, limit);
                    }
                    break;
                case "latest":
                    recommendations = recommendationService.getLatestRecommendations(categoryId, limit);
                    break;
                case "trending":
                    recommendations = recommendationService.getPopularRecommendations(categoryId, limit);
                    break;
                case "popular":
                default:
                    recommendations = recommendationService.getPopularRecommendations(categoryId, limit);
                    break;
            }
            
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取推荐内容失败: type={}", type, e);
            return Result.error("RECOMMENDATION_ERROR", "获取推荐内容失败");
        }
    }

    /**
     * 获取个性化推荐
     */
    @GetMapping("/personalized")
    @Operation(summary = "获取个性化推荐", description = "基于用户行为的个性化内容推荐")
    public Result<List<SearchResultDTO>> getPersonalizedRecommendations(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            Long userId = getCurrentUserId();
            List<SearchResultDTO> recommendations;
            
            if (userId != null) {
                recommendations = recommendationService.getPersonalizedRecommendations(userId, limit);
            } else {
                // 未登录用户返回热门推荐
                recommendations = recommendationService.getPopularRecommendations(null, limit);
            }
            
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取个性化推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取个性化推荐失败");
        }
    }

    /**
     * 获取热门推荐
     */
    @GetMapping("/popular")
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
     * 获取趋势推荐
     */
    @GetMapping("/trending")
    @Operation(summary = "获取趋势推荐", description = "获取趋势内容推荐")
    public Result<List<SearchResultDTO>> getTrendingRecommendations(
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            // 趋势推荐可以复用热门推荐的逻辑，或者实现专门的趋势算法
            List<SearchResultDTO> recommendations = recommendationService.getPopularRecommendations(categoryId, limit);
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取趋势推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取趋势推荐失败");
        }
    }

    /**
     * 获取最新推荐
     */
    @GetMapping("/latest")
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
     * 获取相似内容推荐
     */
    @GetMapping("/similar/{knowledgeId}")
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
     * 获取混合推荐
     */
    @GetMapping("/hybrid")
    @Operation(summary = "获取混合推荐", description = "获取多种算法混合的推荐结果")
    public Result<List<SearchResultDTO>> getHybridRecommendations(
            @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "20") int limit) {
        try {
            Long userId = getCurrentUserId();
            List<SearchResultDTO> recommendations;
            
            if (userId != null) {
                recommendations = recommendationService.getHybridRecommendations(userId, limit);
            } else {
                // 未登录用户返回热门推荐
                recommendations = recommendationService.getPopularRecommendations(null, limit);
            }
            
            return Result.success(recommendations);
        } catch (Exception e) {
            logger.error("获取混合推荐失败", e);
            return Result.error("RECOMMENDATION_ERROR", "获取混合推荐失败");
        }
    }

    /**
     * 记录推荐点击
     */
    @PostMapping("/click")
    @Operation(summary = "记录推荐点击", description = "记录用户点击推荐内容的行为")
    public Result<Void> recordRecommendationClick(
            @Parameter(description = "知识内容ID") @RequestParam Long knowledgeId,
            @Parameter(description = "推荐类型") @RequestParam String recommendationType,
            @Parameter(description = "推荐位置") @RequestParam(required = false) Integer position) {
        try {
            Long userId = getCurrentUserId();
            recommendationService.recordRecommendationClick(userId, knowledgeId, recommendationType, position);
            return Result.success();
        } catch (Exception e) {
            logger.error("记录推荐点击失败: knowledgeId={}, type={}", knowledgeId, recommendationType, e);
            return Result.error("CLICK_RECORD_ERROR", "记录推荐点击失败");
        }
    }

    /**
     * 获取推荐解释
     */
    @GetMapping("/explain")
    @Operation(summary = "获取推荐解释", description = "获取推荐内容的解释说明")
    public Result<String> getRecommendationExplanation(
            @Parameter(description = "知识内容ID") @RequestParam Long knowledgeId,
            @Parameter(description = "推荐类型") @RequestParam String recommendationType) {
        try {
            Long userId = getCurrentUserId();
            String explanation = recommendationService.getRecommendationExplanation(userId, knowledgeId, recommendationType);
            return Result.success(explanation);
        } catch (Exception e) {
            logger.error("获取推荐解释失败: knowledgeId={}, type={}", knowledgeId, recommendationType, e);
            return Result.error("EXPLANATION_ERROR", "获取推荐解释失败");
        }
    }

    /**
     * 获取当前用户ID的辅助方法
     */
    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
                CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
                return userPrincipal.getId();
            }
        } catch (Exception e) {
            logger.debug("无法获取当前用户ID: {}", e.getMessage());
        }
        return null;
    }
}