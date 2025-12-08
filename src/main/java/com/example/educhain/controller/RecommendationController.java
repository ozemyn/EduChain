package com.example.educhain.controller;

import com.example.educhain.dto.KnowledgeItemDTO;
import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.RecommendationService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 推荐系统控制器 提供个性化推荐、热门推荐、相似内容推荐等功能 */
@RestController
@RequestMapping("/recommendations")
@Tag(name = "推荐系统", description = "内容推荐相关接口")
public class RecommendationController {

  @Autowired private RecommendationService recommendationService;

  /**
   * 获取推荐内容接口 根据用户偏好和行为数据推荐相关内容
   *
   * @param limit 返回数量限制
   * @param authentication 认证信息
   * @return 推荐内容列表
   */
  @GetMapping("")
  @Operation(summary = "获取推荐内容", description = "获取基于用户行为的推荐内容")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> getRecommendations(
      @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit,
      Authentication authentication) {

    Long userId = getUserIdFromAuthentication(authentication);
    List<SearchResultDTO> searchResults;

    if (userId != null) {
      searchResults = recommendationService.getPersonalizedRecommendations(userId, limit);
    } else {
      searchResults = recommendationService.getPopularRecommendations(null, limit);
    }

    List<KnowledgeItemDTO> recommendations = convertToKnowledgeItemDTOs(searchResults);
    return ResponseEntity.ok(Result.success(recommendations));
  }

  /**
   * 获取个性化推荐接口 基于用户历史行为和偏好的个性化推荐
   *
   * @param limit 返回数量限制
   * @param principal 当前登录用户信息
   * @return 个性化推荐列表
   */
  @GetMapping("/personalized")
  @Operation(summary = "获取个性化推荐", description = "基于用户行为的个性化内容推荐")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> getPersonalizedRecommendations(
      @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    if (principal == null) {
      return ResponseEntity.badRequest().body(Result.error("UNAUTHORIZED", "需要登录才能获取个性化推荐"));
    }

    List<SearchResultDTO> searchResults =
        recommendationService.getPersonalizedRecommendations(principal.getId(), limit);

    List<KnowledgeItemDTO> recommendations = convertToKnowledgeItemDTOs(searchResults);
    return ResponseEntity.ok(Result.success(recommendations));
  }

  /**
   * 获取热门推荐接口 基于全平台数据的热门内容推荐
   *
   * @param limit 返回数量限制
   * @return 热门推荐列表
   */
  @GetMapping("/trending")
  @Operation(summary = "获取热门推荐", description = "获取平台热门内容推荐")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> getTrendingRecommendations(
      @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "10") int limit) {

    List<SearchResultDTO> searchResults = recommendationService.getTrendingRecommendations(limit);

    List<KnowledgeItemDTO> recommendations = convertToKnowledgeItemDTOs(searchResults);
    return ResponseEntity.ok(Result.success(recommendations));
  }

  /**
   * 获取相似内容推荐接口 基于指定内容的相似内容推荐
   *
   * @param id 知识内容ID
   * @param limit 返回数量限制
   * @return 相似内容推荐列表
   */
  @GetMapping("/similar/{id}")
  @Operation(summary = "获取相似内容推荐", description = "基于指定内容的相似内容推荐")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> getSimilarRecommendations(
      @Parameter(description = "知识内容ID") @PathVariable Long id,
      @Parameter(description = "返回数量限制") @RequestParam(defaultValue = "5") int limit) {

    List<SearchResultDTO> searchResults =
        recommendationService.getContentBasedRecommendations(id, limit);

    List<KnowledgeItemDTO> recommendations = convertToKnowledgeItemDTOs(searchResults);
    return ResponseEntity.ok(Result.success(recommendations));
  }

  /**
   * 推荐反馈接口 用户对推荐内容的反馈，用于优化推荐算法
   *
   * @param request 反馈请求
   * @param principal 当前登录用户信息
   * @return 反馈处理结果
   */
  @PostMapping("/feedback")
  @Operation(summary = "推荐反馈", description = "用户对推荐内容的反馈")
  public ResponseEntity<Result<Map<String, Object>>> submitRecommendationFeedback(
      @Valid @RequestBody RecommendationFeedbackRequest request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    if (principal == null) {
      return ResponseEntity.badRequest().body(Result.error("UNAUTHORIZED", "需要登录才能提交反馈"));
    }

    recommendationService.recordRecommendationFeedback(
        principal.getId(), request.getKnowledgeId(), request.getFeedback());

    return ResponseEntity.ok(Result.success("反馈已记录", Map.of("success", true, "message", "反馈已记录")));
  }

  /**
   * 获取推荐解释接口 解释为什么推荐某个内容
   *
   * @param knowledgeId 知识内容ID
   * @param principal 当前登录用户信息
   * @return 推荐解释
   */
  @GetMapping("/explain/{knowledgeId}")
  @Operation(summary = "获取推荐解释", description = "解释推荐内容的原因")
  public ResponseEntity<Result<Map<String, String>>> getRecommendationExplanation(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    if (principal == null) {
      return ResponseEntity.badRequest().body(Result.error("UNAUTHORIZED", "需要登录才能获取推荐解释"));
    }

    String explanation =
        recommendationService.getRecommendationExplanation(
            principal.getId(), knowledgeId, "personalized");

    return ResponseEntity.ok(Result.success(Map.of("explanation", explanation)));
  }

  /**
   * 获取推荐统计接口 获取推荐系统的统计信息
   *
   * @param principal 当前登录用户信息
   * @return 推荐统计信息
   */
  @GetMapping("/stats")
  @Operation(summary = "获取推荐统计", description = "获取用户的推荐统计信息")
  public ResponseEntity<Result<Map<String, Object>>> getRecommendationStats(
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    if (principal == null) {
      return ResponseEntity.badRequest().body(Result.error("UNAUTHORIZED", "需要登录才能获取推荐统计"));
    }

    Map<String, Object> stats = recommendationService.getRecommendationStats(principal.getId());
    return ResponseEntity.ok(Result.success(stats));
  }

  // 辅助方法
  private Long getUserIdFromAuthentication(Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
        return ((CustomUserDetailsService.CustomUserPrincipal) principal).getId();
      }
    }
    return null;
  }

  /** 将SearchResultDTO转换为KnowledgeItemDTO */
  private List<KnowledgeItemDTO> convertToKnowledgeItemDTOs(List<SearchResultDTO> searchResults) {
    return searchResults.stream().map(this::convertToKnowledgeItemDTO).collect(Collectors.toList());
  }

  /** 将单个SearchResultDTO转换为KnowledgeItemDTO */
  private KnowledgeItemDTO convertToKnowledgeItemDTO(SearchResultDTO searchResult) {
    KnowledgeItemDTO dto = new KnowledgeItemDTO();
    dto.setId(searchResult.getId());
    dto.setTitle(searchResult.getTitle());
    dto.setContent(searchResult.getContent());
    dto.setType(searchResult.getType());
    dto.setMediaUrls(searchResult.getMediaUrls());
    dto.setLinkUrl(searchResult.getLinkUrl());
    dto.setUploaderId(searchResult.getUploaderId());
    dto.setUploaderName(searchResult.getUploaderName());
    dto.setUploaderAvatar(searchResult.getUploaderAvatar());
    dto.setCategoryId(searchResult.getCategoryId());
    dto.setCategoryName(searchResult.getCategoryName());
    dto.setTags(searchResult.getTags());
    dto.setViewCount(searchResult.getViewCount());
    dto.setLikeCount(searchResult.getLikeCount());
    dto.setFavoriteCount(searchResult.getFavoriteCount());
    dto.setCommentCount(searchResult.getCommentCount());
    dto.setQualityScore(searchResult.getQualityScore());
    dto.setCreatedAt(searchResult.getCreatedAt());
    dto.setUpdatedAt(searchResult.getUpdatedAt());
    return dto;
  }

  /** 推荐反馈请求DTO */
  public static class RecommendationFeedbackRequest {
    private Long knowledgeId;
    private String feedback; // "like", "dislike", "not_interested"

    // Constructors
    public RecommendationFeedbackRequest() {}

    public RecommendationFeedbackRequest(Long knowledgeId, String feedback) {
      this.knowledgeId = knowledgeId;
      this.feedback = feedback;
    }

    // Getters and Setters
    public Long getKnowledgeId() {
      return knowledgeId;
    }

    public void setKnowledgeId(Long knowledgeId) {
      this.knowledgeId = knowledgeId;
    }

    public String getFeedback() {
      return feedback;
    }

    public void setFeedback(String feedback) {
      this.feedback = feedback;
    }
  }
}
