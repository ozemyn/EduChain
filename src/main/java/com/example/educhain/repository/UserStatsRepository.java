package com.example.educhain.repository;

import com.example.educhain.entity.UserStats;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 用户统计数据访问接口 */
@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {

  /** 根据用户ID查找统计信息 */
  Optional<UserStats> findByUserId(Long userId);

  /** 检查用户统计是否存在 */
  boolean existsByUserId(Long userId);

  /** 根据积分排序查找用户统计 */
  Page<UserStats> findAllByOrderByTotalScoreDesc(Pageable pageable);

  /** 根据知识内容数量排序查找用户统计 */
  Page<UserStats> findAllByOrderByKnowledgeCountDesc(Pageable pageable);

  /** 根据关注者数量排序查找用户统计 */
  Page<UserStats> findAllByOrderByFollowerCountDesc(Pageable pageable);

  /** 查找积分排名前N的用户 */
  @Query("SELECT us FROM UserStats us ORDER BY us.totalScore DESC")
  Page<UserStats> findTopByScore(Pageable pageable);

  /** 查找最活跃的用户（根据登录次数） */
  @Query("SELECT us FROM UserStats us ORDER BY us.loginCount DESC")
  Page<UserStats> findMostActiveUsers(Pageable pageable);

  /** 统计总用户数 */
  @Query("SELECT COUNT(us) FROM UserStats us")
  long countTotalUsers();

  /** 统计平均积分 */
  @Query("SELECT AVG(us.totalScore) FROM UserStats us")
  Double getAverageScore();

  /** 根据积分范围查找用户统计 */
  Page<UserStats> findByTotalScoreBetween(Integer minScore, Integer maxScore, Pageable pageable);

  /** 查找知识内容数量大于指定值的用户 */
  @Query("SELECT us FROM UserStats us WHERE us.knowledgeCount >= :minCount")
  Page<UserStats> findByKnowledgeCountGreaterThanEqual(
      @Param("minCount") Integer minCount, Pageable pageable);
}
