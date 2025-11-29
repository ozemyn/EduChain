package com.example.educhain.repository;

import com.example.educhain.entity.UserAchievement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 用户成就Repository接口 */
@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

  /** 根据用户ID查找所有成就 */
  List<UserAchievement> findByUserIdOrderByCreatedAtDesc(Long userId);

  /** 根据用户ID和成就类型查找成就 */
  Optional<UserAchievement> findByUserIdAndAchievementType(
      Long userId, UserAchievement.AchievementType achievementType);

  /** 根据用户ID查找已完成的成就 */
  List<UserAchievement> findByUserIdAndIsCompletedTrueOrderByAchievedAtDesc(Long userId);

  /** 根据用户ID查找未完成的成就 */
  List<UserAchievement> findByUserIdAndIsCompletedFalseOrderByCreatedAtDesc(Long userId);

  /** 根据成就类型查找所有成就 */
  List<UserAchievement> findByAchievementTypeOrderByCreatedAtDesc(
      UserAchievement.AchievementType achievementType);

  /** 统计用户已完成的成就数量 */
  long countByUserIdAndIsCompletedTrue(Long userId);

  /** 统计用户未完成的成就数量 */
  long countByUserIdAndIsCompletedFalse(Long userId);

  /** 统计用户特定类型的成就数量 */
  long countByUserIdAndAchievementType(
      Long userId, UserAchievement.AchievementType achievementType);

  /** 统计用户特定类型已完成的成就数量 */
  long countByUserIdAndAchievementTypeAndIsCompletedTrue(
      Long userId, UserAchievement.AchievementType achievementType);

  /** 查找用户最近获得的成就 */
  @Query(
      "SELECT ua FROM UserAchievement ua WHERE ua.userId = :userId AND ua.isCompleted = true "
          + "ORDER BY ua.achievedAt DESC")
  List<UserAchievement> findRecentAchievements(@Param("userId") Long userId, Pageable pageable);

  /** 查找用户可以升级的成就 */
  @Query(
      "SELECT ua FROM UserAchievement ua WHERE ua.userId = :userId AND ua.isCompleted = true "
          + "AND ua.level < (CASE ua.achievementType "
          + "WHEN 'KNOWLEDGE_CREATOR' THEN 10 "
          + "WHEN 'KNOWLEDGE_SHARER' THEN 10 "
          + "WHEN 'ACTIVE_LEARNER' THEN 5 "
          + "WHEN 'SOCIAL_BUTTERFLY' THEN 5 "
          + "WHEN 'QUALITY_CONTRIBUTOR' THEN 8 "
          + "WHEN 'MILESTONE_ACHIEVER' THEN 20 "
          + "ELSE 3 END)")
  List<UserAchievement> findUpgradableAchievements(@Param("userId") Long userId);

  /** 查找用户接近完成的成就（进度超过80%） */
  @Query(
      "SELECT ua FROM UserAchievement ua WHERE ua.userId = :userId AND ua.isCompleted = false "
          + "AND (ua.progressCurrent * 1.0 / ua.progressTarget) >= 0.8")
  List<UserAchievement> findNearCompletionAchievements(@Param("userId") Long userId);

  /** 查找指定时间范围内获得的成就 */
  List<UserAchievement> findByUserIdAndAchievedAtBetween(
      Long userId, LocalDateTime startTime, LocalDateTime endTime);

  /** 查找所有用户的成就排行榜 */
  @Query(
      "SELECT ua.userId, COUNT(ua) as achievementCount, SUM(ua.pointsAwarded) as totalPoints "
          + "FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "GROUP BY ua.userId ORDER BY totalPoints DESC, achievementCount DESC")
  List<Object[]> findAchievementLeaderboard(Pageable pageable);

  /** 查找特定成就类型的排行榜 */
  @Query(
      "SELECT ua.userId, COUNT(ua) as achievementCount, MAX(ua.level) as maxLevel "
          + "FROM UserAchievement ua WHERE ua.achievementType = :achievementType AND ua.isCompleted = true "
          + "GROUP BY ua.userId ORDER BY maxLevel DESC, achievementCount DESC")
  List<Object[]> findAchievementTypeLeaderboard(
      @Param("achievementType") UserAchievement.AchievementType achievementType, Pageable pageable);

  /** 统计各成就类型的完成情况 */
  @Query(
      "SELECT ua.achievementType, COUNT(ua) as totalCount, "
          + "SUM(CASE WHEN ua.isCompleted = true THEN 1 ELSE 0 END) as completedCount "
          + "FROM UserAchievement ua GROUP BY ua.achievementType")
  List<Object[]> getAchievementTypeStatistics();

  /** 查找最受欢迎的成就（完成人数最多） */
  @Query(
      "SELECT ua.achievementType, ua.achievementName, COUNT(ua) as completedCount "
          + "FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "GROUP BY ua.achievementType, ua.achievementName "
          + "ORDER BY completedCount DESC")
  List<Object[]> findMostPopularAchievements(Pageable pageable);

  /** 查找最稀有的成就（完成人数最少） */
  @Query(
      "SELECT ua.achievementType, ua.achievementName, COUNT(ua) as completedCount "
          + "FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "GROUP BY ua.achievementType, ua.achievementName "
          + "ORDER BY completedCount ASC")
  List<Object[]> findRarestAchievements(Pageable pageable);

  /** 统计用户获得的总积分 */
  @Query(
      "SELECT SUM(ua.pointsAwarded) FROM UserAchievement ua WHERE ua.userId = :userId AND ua.isCompleted = true")
  Integer getTotalPointsByUserId(@Param("userId") Long userId);

  /** 查找今日获得成就的用户 */
  @Query(
      "SELECT DISTINCT ua.userId FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "AND DATE(ua.achievedAt) = CURRENT_DATE")
  List<Long> findUsersWithTodayAchievements();

  /** 查找本周获得成就的用户 */
  @Query(
      "SELECT DISTINCT ua.userId FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "AND ua.achievedAt >= :weekStart")
  List<Long> findUsersWithWeeklyAchievements(@Param("weekStart") LocalDateTime weekStart);

  /** 检查用户是否已有特定成就 */
  boolean existsByUserIdAndAchievementType(
      Long userId, UserAchievement.AchievementType achievementType);

  /** 删除用户的所有成就 */
  void deleteByUserId(Long userId);

  /** 查找需要通知的新成就 */
  @Query(
      "SELECT ua FROM UserAchievement ua WHERE ua.isCompleted = true "
          + "AND ua.achievedAt >= :since ORDER BY ua.achievedAt DESC")
  List<UserAchievement> findNewAchievements(@Param("since") LocalDateTime since);

  /** 获取成就统计概览 */
  @Query(
      "SELECT "
          + "COUNT(DISTINCT ua.userId) as totalUsers, "
          + "COUNT(ua) as totalAchievements, "
          + "SUM(CASE WHEN ua.isCompleted = true THEN 1 ELSE 0 END) as completedAchievements, "
          + "AVG(ua.progressCurrent * 1.0 / ua.progressTarget) as avgProgress "
          + "FROM UserAchievement ua")
  Object[] getAchievementOverview();
}
