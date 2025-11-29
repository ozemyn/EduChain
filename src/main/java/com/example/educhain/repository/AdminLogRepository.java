package com.example.educhain.repository;

import com.example.educhain.entity.AdminLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 管理员日志数据访问接口 */
@Repository
public interface AdminLogRepository extends JpaRepository<AdminLog, Long> {

  /** 根据管理员ID查询日志 */
  Page<AdminLog> findByAdminId(Long adminId, Pageable pageable);

  /** 根据管理员用户名查询日志 */
  Page<AdminLog> findByAdminUsernameContaining(String adminUsername, Pageable pageable);

  /** 根据操作类型查询日志 */
  Page<AdminLog> findByOperationType(AdminLog.OperationType operationType, Pageable pageable);

  /** 根据目标类型查询日志 */
  Page<AdminLog> findByTargetType(AdminLog.TargetType targetType, Pageable pageable);

  /** 根据目标ID查询日志 */
  Page<AdminLog> findByTargetId(Long targetId, Pageable pageable);

  /** 根据操作结果查询日志 */
  Page<AdminLog> findByResult(AdminLog.OperationResult result, Pageable pageable);

  /** 根据时间范围查询日志 */
  Page<AdminLog> findByCreatedAtBetween(
      LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

  /** 复合查询：根据管理员ID和操作类型查询 */
  @Query(
      "SELECT al FROM AdminLog al WHERE al.adminId = :adminId AND al.operationType = :operationType")
  Page<AdminLog> findByAdminIdAndOperationType(
      @Param("adminId") Long adminId,
      @Param("operationType") AdminLog.OperationType operationType,
      Pageable pageable);

  /** 复合查询：根据目标类型和操作类型查询 */
  @Query(
      "SELECT al FROM AdminLog al WHERE al.targetType = :targetType AND al.operationType = :operationType")
  Page<AdminLog> findByTargetTypeAndOperationType(
      @Param("targetType") AdminLog.TargetType targetType,
      @Param("operationType") AdminLog.OperationType operationType,
      Pageable pageable);

  /** 复合查询：根据管理员ID和时间范围查询 */
  @Query(
      "SELECT al FROM AdminLog al WHERE al.adminId = :adminId AND al.createdAt BETWEEN :startTime AND :endTime")
  Page<AdminLog> findByAdminIdAndTimeRange(
      @Param("adminId") Long adminId,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime,
      Pageable pageable);

  /** 统计管理员操作次数 */
  @Query(
      "SELECT COUNT(al) FROM AdminLog al WHERE al.adminId = :adminId AND al.createdAt BETWEEN :startTime AND :endTime")
  Long countByAdminIdAndTimeRange(
      @Param("adminId") Long adminId,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime);

  /** 统计操作类型分布 */
  @Query(
      "SELECT al.operationType, COUNT(al) FROM AdminLog al WHERE al.createdAt BETWEEN :startTime AND :endTime GROUP BY al.operationType")
  List<Object[]> countByOperationTypeAndTimeRange(
      @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

  /** 统计目标类型分布 */
  @Query(
      "SELECT al.targetType, COUNT(al) FROM AdminLog al WHERE al.createdAt BETWEEN :startTime AND :endTime GROUP BY al.targetType")
  List<Object[]> countByTargetTypeAndTimeRange(
      @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

  /** 查询失败的操作 */
  @Query("SELECT al FROM AdminLog al WHERE al.result = 'FAILED' ORDER BY al.createdAt DESC")
  List<AdminLog> findFailedOperations(Pageable pageable);

  /** 查询最活跃的管理员 */
  @Query(
      "SELECT al.adminId, al.adminUsername, COUNT(al) as operationCount FROM AdminLog al "
          + "WHERE al.createdAt BETWEEN :startTime AND :endTime "
          + "GROUP BY al.adminId, al.adminUsername ORDER BY operationCount DESC")
  List<Object[]> findMostActiveAdmins(
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime,
      Pageable pageable);

  /** 根据IP地址查询日志 */
  Page<AdminLog> findByIpAddress(String ipAddress, Pageable pageable);

  /** 删除指定时间之前的日志 */
  void deleteByCreatedAtBefore(LocalDateTime cutoffTime);
}
