package com.example.educhain.repository;

import com.example.educhain.entity.UserFollow;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 用户关注Repository接口 */
@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {

  /** 查找关注关系 */
  Optional<UserFollow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

  /** 检查是否存在关注关系 */
  boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

  /** 获取用户的关注列表 */
  Page<UserFollow> findByFollowerIdOrderByCreatedAtDesc(Long followerId, Pageable pageable);

  /** 获取用户的粉丝列表 */
  Page<UserFollow> findByFollowingIdOrderByCreatedAtDesc(Long followingId, Pageable pageable);

  /** 统计用户关注的人数 */
  long countByFollowerId(Long followerId);

  /** 统计用户的粉丝数 */
  long countByFollowingId(Long followingId);

  /** 获取用户最近关注的人 */
  List<UserFollow> findTop10ByFollowerIdOrderByCreatedAtDesc(Long followerId);

  /** 获取用户最近的粉丝 */
  List<UserFollow> findTop10ByFollowingIdOrderByCreatedAtDesc(Long followingId);

  /** 删除关注关系 */
  void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

  /** 获取指定时间范围内的关注记录 */
  List<UserFollow> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);

  /** 获取用户在指定时间范围内的关注记录 */
  List<UserFollow> findByFollowerIdAndCreatedAtBetween(
      Long followerId, LocalDateTime startTime, LocalDateTime endTime);

  /** 获取用户在指定时间范围内的新粉丝 */
  List<UserFollow> findByFollowingIdAndCreatedAtBetween(
      Long followingId, LocalDateTime startTime, LocalDateTime endTime);

  /** 获取热门用户（按粉丝数排序） */
  @Query(
      "SELECT uf.followingId, COUNT(uf) as followerCount "
          + "FROM UserFollow uf "
          + "GROUP BY uf.followingId "
          + "ORDER BY followerCount DESC")
  List<Object[]> findPopularUsers(Pageable pageable);

  /** 获取最活跃的关注者（按关注数排序） */
  @Query(
      "SELECT uf.followerId, COUNT(uf) as followingCount "
          + "FROM UserFollow uf "
          + "GROUP BY uf.followerId "
          + "ORDER BY followingCount DESC")
  List<Object[]> findActiveFollowers(Pageable pageable);

  /** 获取用户关注的人的ID列表 */
  @Query("SELECT uf.followingId FROM UserFollow uf WHERE uf.followerId = :followerId")
  List<Long> findFollowingIdsByFollowerId(@Param("followerId") Long followerId);

  /** 获取用户粉丝的ID列表 */
  @Query("SELECT uf.followerId FROM UserFollow uf WHERE uf.followingId = :followingId")
  List<Long> findFollowerIdsByFollowingId(@Param("followingId") Long followingId);

  /** 获取互相关注的用户关系 */
  @Query(
      "SELECT uf1 FROM UserFollow uf1 "
          + "WHERE EXISTS (SELECT uf2 FROM UserFollow uf2 "
          + "WHERE uf2.followerId = uf1.followingId AND uf2.followingId = uf1.followerId) "
          + "AND uf1.followerId = :userId")
  List<UserFollow> findMutualFollows(@Param("userId") Long userId);

  /** 统计系统总关注关系数 */
  @Override
  long count();

  /** 获取最近的关注活动 */
  List<UserFollow> findTop20ByOrderByCreatedAtDesc();
}
