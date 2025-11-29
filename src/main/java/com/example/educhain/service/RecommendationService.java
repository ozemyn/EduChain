package com.example.educhain.service;

import com.example.educhain.dto.SearchResultDTO;
import java.util.List;
import java.util.Map;

/** 推荐算法服务接口 */
public interface RecommendationService {

  /**
   * 获取个性化推荐内容
   *
   * @param userId 用户ID
   * @param limit 返回数量限制
   * @return 推荐内容列表
   */
  List<SearchResultDTO> getPersonalizedRecommendations(Long userId, int limit);

  /**
   * 获取基于内容的推荐
   *
   * @param knowledgeId 基础知识内容ID
   * @param limit 返回数量限制
   * @return 相似内容列表
   */
  List<SearchResultDTO> getContentBasedRecommendations(Long knowledgeId, int limit);

  /**
   * 获取协同过滤推荐
   *
   * @param userId 用户ID
   * @param limit 返回数量限制
   * @return 推荐内容列表
   */
  List<SearchResultDTO> getCollaborativeFilteringRecommendations(Long userId, int limit);

  /**
   * 获取热门内容推荐
   *
   * @param categoryId 分类ID（可选）
   * @param limit 返回数量限制
   * @return 热门内容列表
   */
  List<SearchResultDTO> getPopularRecommendations(Long categoryId, int limit);

  /**
   * 获取最新内容推荐
   *
   * @param categoryId 分类ID（可选）
   * @param limit 返回数量限制
   * @return 最新内容列表
   */
  List<SearchResultDTO> getLatestRecommendations(Long categoryId, int limit);

  /**
   * 获取基于标签的推荐
   *
   * @param tags 标签列表
   * @param excludeId 排除的内容ID
   * @param limit 返回数量限制
   * @return 相关内容列表
   */
  List<SearchResultDTO> getTagBasedRecommendations(List<String> tags, Long excludeId, int limit);

  /**
   * 获取基于用户行为的推荐
   *
   * @param userId 用户ID
   * @param behaviorType 行为类型: like, favorite, view
   * @param limit 返回数量限制
   * @return 推荐内容列表
   */
  List<SearchResultDTO> getBehaviorBasedRecommendations(
      Long userId, String behaviorType, int limit);

  /**
   * 获取混合推荐结果
   *
   * @param userId 用户ID
   * @param limit 返回数量限制
   * @return 混合推荐内容列表
   */
  List<SearchResultDTO> getHybridRecommendations(Long userId, int limit);

  /**
   * 计算内容相似度
   *
   * @param knowledgeId1 内容1 ID
   * @param knowledgeId2 内容2 ID
   * @return 相似度分数 (0-1)
   */
  Double calculateContentSimilarity(Long knowledgeId1, Long knowledgeId2);

  /**
   * 计算用户相似度
   *
   * @param userId1 用户1 ID
   * @param userId2 用户2 ID
   * @return 相似度分数 (0-1)
   */
  Double calculateUserSimilarity(Long userId1, Long userId2);

  /**
   * 更新用户偏好模型
   *
   * @param userId 用户ID
   */
  void updateUserPreferenceModel(Long userId);

  /**
   * 获取用户偏好分析
   *
   * @param userId 用户ID
   * @return 用户偏好数据
   */
  Map<String, Object> getUserPreferenceAnalysis(Long userId);

  /**
   * 记录推荐点击行为
   *
   * @param userId 用户ID
   * @param knowledgeId 内容ID
   * @param recommendationType 推荐类型
   * @param position 推荐位置
   */
  void recordRecommendationClick(
      Long userId, Long knowledgeId, String recommendationType, Integer position);

  /**
   * 获取推荐效果统计
   *
   * @param recommendationType 推荐类型
   * @return 效果统计数据
   */
  Map<String, Object> getRecommendationEffectiveness(String recommendationType);

  /** 训练推荐模型 */
  void trainRecommendationModel();

  /**
   * 获取推荐解释
   *
   * @param userId 用户ID
   * @param knowledgeId 推荐内容ID
   * @param recommendationType 推荐类型
   * @return 推荐理由
   */
  String getRecommendationExplanation(Long userId, Long knowledgeId, String recommendationType);
}
