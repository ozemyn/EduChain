package com.example.educhain.repository;

import com.example.educhain.entity.KnowledgeStats;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 知识内容统计数据访问层 */
@Repository
public interface KnowledgeStatsRepository extends JpaRepository<KnowledgeStats, Long> {

  /** 根据知识内容ID查找统计信息 */
  Optional<KnowledgeStats> findByKnowledgeId(Long knowledgeId);

  /** 批量查找统计信息 */
  List<KnowledgeStats> findByKnowledgeIdIn(List<Long> knowledgeIds);

  /** 查找热门内容 - 按浏览量排序 */
  @Query("SELECT ks FROM KnowledgeStats ks ORDER BY ks.viewCount DESC")
  Page<KnowledgeStats> findMostViewed(Pageable pageable);

  /** 查找热门内容 - 按点赞数排序 */
  @Query("SELECT ks FROM KnowledgeStats ks ORDER BY ks.likeCount DESC")
  Page<KnowledgeStats> findMostLiked(Pageable pageable);

  /** 查找热门内容 - 按收藏数排序 */
  @Query("SELECT ks FROM KnowledgeStats ks ORDER BY ks.favoriteCount DESC")
  Page<KnowledgeStats> findMostFavorited(Pageable pageable);

  /** 查找热门内容 - 按质量分数排序 */
  @Query("SELECT ks FROM KnowledgeStats ks ORDER BY ks.qualityScore DESC")
  Page<KnowledgeStats> findHighestQuality(Pageable pageable);

  /** 查找最近活跃的内容 */
  @Query(
      "SELECT ks FROM KnowledgeStats ks WHERE ks.lastInteractionAt >= :since ORDER BY ks.lastInteractionAt DESC")
  Page<KnowledgeStats> findRecentlyActive(@Param("since") LocalDateTime since, Pageable pageable);

  /** 统计总浏览量 */
  @Query("SELECT SUM(ks.viewCount) FROM KnowledgeStats ks")
  Long getTotalViewCount();

  /** 统计总点赞数 */
  @Query("SELECT SUM(ks.likeCount) FROM KnowledgeStats ks")
  Long getTotalLikeCount();

  /** 统计总收藏数 */
  @Query("SELECT SUM(ks.favoriteCount) FROM KnowledgeStats ks")
  Long getTotalFavoriteCount();

  /** 统计总评论数 */
  @Query("SELECT SUM(ks.commentCount) FROM KnowledgeStats ks")
  Long getTotalCommentCount();

  /** 增加浏览量 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.viewCount = ks.viewCount + 1, ks.lastViewAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int incrementViewCount(@Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 增加点赞数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.likeCount = ks.likeCount + 1, ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int incrementLikeCount(@Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 减少点赞数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.likeCount = GREATEST(ks.likeCount - 1, 0), ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int decrementLikeCount(@Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 增加收藏数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.favoriteCount = ks.favoriteCount + 1, ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int incrementFavoriteCount(
      @Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 减少收藏数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.favoriteCount = GREATEST(ks.favoriteCount - 1, 0), ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int decrementFavoriteCount(
      @Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 增加评论数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.commentCount = ks.commentCount + 1, ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int incrementCommentCount(
      @Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 减少评论数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.commentCount = GREATEST(ks.commentCount - 1, 0), ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int decrementCommentCount(
      @Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 增加分享数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.shareCount = ks.shareCount + 1, ks.lastInteractionAt = :now WHERE ks.knowledgeId = :knowledgeId")
  int incrementShareCount(@Param("knowledgeId") Long knowledgeId, @Param("now") LocalDateTime now);

  /** 更新质量分数 */
  @Modifying
  @Query(
      "UPDATE KnowledgeStats ks SET ks.qualityScore = :score WHERE ks.knowledgeId = :knowledgeId")
  int updateQualityScore(@Param("knowledgeId") Long knowledgeId, @Param("score") Double score);

  /** 查找质量分数在指定范围内的内容 */
  @Query(
      "SELECT ks FROM KnowledgeStats ks WHERE ks.qualityScore BETWEEN :minScore AND :maxScore ORDER BY ks.qualityScore DESC")
  Page<KnowledgeStats> findByQualityScoreRange(
      @Param("minScore") Double minScore, @Param("maxScore") Double maxScore, Pageable pageable);
}
