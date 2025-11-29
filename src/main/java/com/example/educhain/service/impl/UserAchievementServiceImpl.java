package com.example.educhain.service.impl;

import com.example.educhain.dto.AchievementSummaryDTO;
import com.example.educhain.dto.UserAchievementDTO;
import com.example.educhain.entity.UserAchievement;
import com.example.educhain.entity.UserStats;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.*;
import com.example.educhain.service.NotificationService;
import com.example.educhain.service.UserAchievementService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 用户成就服务实现类 */
@Service
@Transactional
public class UserAchievementServiceImpl implements UserAchievementService {

  private static final Logger logger = LoggerFactory.getLogger(UserAchievementServiceImpl.class);

  @Autowired private UserAchievementRepository userAchievementRepository;

  @Autowired private UserStatsRepository userStatsRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private KnowledgeItemRepository knowledgeItemRepository;

  @Autowired private UserInteractionRepository userInteractionRepository;

  @Autowired private NotificationService notificationService;

  @Override
  public void initializeUserAchievements(Long userId) {
    logger.info("初始化用户成就系统: {}", userId);

    // 检查用户是否已经初始化过成就系统
    if (userAchievementRepository.existsByUserIdAndAchievementType(
        userId, UserAchievement.AchievementType.KNOWLEDGE_CREATOR)) {
      logger.info("用户成就系统已初始化: {}", userId);
      return;
    }

    List<UserAchievement> initialAchievements = createInitialAchievements(userId);
    userAchievementRepository.saveAll(initialAchievements);

    logger.info("用户成就系统初始化完成: {}，创建了 {} 个成就", userId, initialAchievements.size());
  }

  @Override
  @Transactional(readOnly = true)
  public AchievementSummaryDTO getUserAchievementSummary(Long userId) {
    logger.info("获取用户成就概览: {}", userId);

    AchievementSummaryDTO summary = new AchievementSummaryDTO();
    summary.setUserId(userId);

    // 获取用户信息
    userRepository
        .findById(userId)
        .ifPresent(
            user -> {
              summary.setUsername(user.getUsername());
            });

    // 统计成就数量
    List<UserAchievement> allAchievements =
        userAchievementRepository.findByUserIdOrderByCreatedAtDesc(userId);
    summary.setTotalAchievements((long) allAchievements.size());
    summary.setCompletedAchievements(
        userAchievementRepository.countByUserIdAndIsCompletedTrue(userId));
    summary.setPendingAchievements(
        userAchievementRepository.countByUserIdAndIsCompletedFalse(userId));

    // 计算总积分和等级
    summary.setTotalPoints(getUserTotalPoints(userId));
    summary.setCurrentLevel(calculateUserLevel(userId));

    // 计算整体进度
    if (!allAchievements.isEmpty()) {
      double totalProgress =
          allAchievements.stream()
              .mapToDouble(UserAchievement::getCompletionPercentage)
              .average()
              .orElse(0.0);
      summary.setOverallProgress(totalProgress);
    }

    // 获取最近成就
    List<UserAchievementDTO> recentAchievements = getUserRecentAchievements(userId, 5);
    summary.setRecentAchievements(recentAchievements);

    // 获取接近完成的成就
    List<UserAchievementDTO> nearCompletion = getUserNearCompletionAchievements(userId);
    summary.setNearCompletionAchievements(nearCompletion);

    // 获取可升级的成就
    List<UserAchievementDTO> upgradable = getUserUpgradableAchievements(userId);
    summary.setUpgradableAchievements(upgradable);

    // 按类型统计成就
    Map<String, Long> achievementsByType =
        allAchievements.stream()
            .filter(UserAchievement::getIsCompleted)
            .collect(
                Collectors.groupingBy(
                    achievement -> achievement.getAchievementType().name(), Collectors.counting()));
    summary.setAchievementsByType(achievementsByType);

    // 获取最后成就时间
    allAchievements.stream()
        .filter(UserAchievement::getIsCompleted)
        .max(Comparator.comparing(UserAchievement::getAchievedAt))
        .ifPresent(achievement -> summary.setLastAchievementDate(achievement.getAchievedAt()));

    return summary;
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserAchievements(Long userId) {
    List<UserAchievement> achievements =
        userAchievementRepository.findByUserIdOrderByCreatedAtDesc(userId);
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserCompletedAchievements(Long userId) {
    List<UserAchievement> achievements =
        userAchievementRepository.findByUserIdAndIsCompletedTrueOrderByAchievedAtDesc(userId);
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserPendingAchievements(Long userId) {
    List<UserAchievement> achievements =
        userAchievementRepository.findByUserIdAndIsCompletedFalseOrderByCreatedAtDesc(userId);
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserRecentAchievements(Long userId, int limit) {
    List<UserAchievement> achievements =
        userAchievementRepository.findRecentAchievements(userId, PageRequest.of(0, limit));
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserNearCompletionAchievements(Long userId) {
    List<UserAchievement> achievements =
        userAchievementRepository.findNearCompletionAchievements(userId);
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserAchievementDTO> getUserUpgradableAchievements(Long userId) {
    List<UserAchievement> achievements =
        userAchievementRepository.findUpgradableAchievements(userId);
    return achievements.stream().map(UserAchievementDTO::fromEntity).collect(Collectors.toList());
  }

  @Override
  public List<UserAchievementDTO> checkAndUpdateAchievements(Long userId) {
    logger.info("检查并更新用户成就: {}", userId);

    List<UserAchievementDTO> newlyCompleted = new ArrayList<>();

    // 获取用户统计数据
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isEmpty()) {
      logger.warn("用户统计数据不存在: {}", userId);
      return newlyCompleted;
    }

    UserStats userStats = userStatsOpt.get();

    // 检查各种成就
    newlyCompleted.addAll(checkKnowledgeCreatorAchievements(userId, userStats));
    newlyCompleted.addAll(checkSocialAchievements(userId, userStats));
    newlyCompleted.addAll(checkActivityAchievements(userId, userStats));
    newlyCompleted.addAll(checkMilestoneAchievements(userId, userStats));

    // 发送通知
    for (UserAchievementDTO achievement : newlyCompleted) {
      sendAchievementNotification(userId, achievement);
    }

    logger.info("成就检查完成: {}，新完成 {} 个成就", userId, newlyCompleted.size());
    return newlyCompleted;
  }

  @Override
  public void triggerAchievementCheck(
      Long userId, String eventType, Map<String, Object> eventData) {
    logger.info("触发成就检查: userId={}, eventType={}", userId, eventType);

    switch (eventType) {
      case "KNOWLEDGE_CREATED":
        checkKnowledgeCreationAchievement(userId);
        break;
      case "KNOWLEDGE_LIKED":
        checkSocialInteractionAchievement(userId);
        break;
      case "USER_LOGIN":
        checkActivityAchievement(userId);
        break;
      case "COMMENT_POSTED":
        checkEngagementAchievement(userId);
        break;
      default:
        // 通用检查
        checkAndUpdateAchievements(userId);
    }
  }

  @Override
  public UserAchievementDTO levelUpAchievement(
      Long userId, UserAchievement.AchievementType achievementType) {
    logger.info("升级成就: userId={}, achievementType={}", userId, achievementType);

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(userId, achievementType);
    if (achievementOpt.isEmpty()) {
      throw new BusinessException("ACHIEVEMENT_NOT_FOUND", "成就不存在");
    }

    UserAchievement achievement = achievementOpt.get();
    if (!achievement.canLevelUp()) {
      throw new BusinessException("CANNOT_LEVEL_UP", "成就无法升级");
    }

    achievement.levelUp();
    achievement = userAchievementRepository.save(achievement);

    // 更新用户积分
    updateUserPoints(userId, achievement.getPointsAwarded());

    // 发送升级通知
    UserAchievementDTO achievementDTO = UserAchievementDTO.fromEntity(achievement);
    sendAchievementNotification(userId, achievementDTO);

    return achievementDTO;
  }

  @Override
  public void resetAchievement(Long userId, UserAchievement.AchievementType achievementType) {
    logger.info("重置成就: userId={}, achievementType={}", userId, achievementType);

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(userId, achievementType);
    if (achievementOpt.isPresent()) {
      UserAchievement achievement = achievementOpt.get();
      achievement.resetAchievement();
      userAchievementRepository.save(achievement);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Map<String, Object>> getAchievementLeaderboard(Pageable pageable) {
    // 这里需要实现排行榜逻辑
    // 由于复杂性，这里提供简化版本
    return Page.empty();
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Map<String, Object>> getAchievementTypeLeaderboard(
      UserAchievement.AchievementType achievementType, Pageable pageable) {
    // 这里需要实现特定类型排行榜逻辑
    return Page.empty();
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getAchievementStatistics() {
    Map<String, Object> stats = new HashMap<>();

    Object[] overview = userAchievementRepository.getAchievementOverview();
    if (overview != null && overview.length >= 4) {
      stats.put("totalUsers", overview[0]);
      stats.put("totalAchievements", overview[1]);
      stats.put("completedAchievements", overview[2]);
      stats.put("avgProgress", overview[3]);
    }

    // 按类型统计
    List<Object[]> typeStats = userAchievementRepository.getAchievementTypeStatistics();
    Map<String, Map<String, Object>> typeStatsMap = new HashMap<>();
    for (Object[] stat : typeStats) {
      Map<String, Object> typeData = new HashMap<>();
      typeData.put("total", stat[1]);
      typeData.put("completed", stat[2]);
      typeStatsMap.put(stat[0].toString(), typeData);
    }
    stats.put("achievementsByType", typeStatsMap);

    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getMostPopularAchievements(int limit) {
    List<Object[]> popular =
        userAchievementRepository.findMostPopularAchievements(PageRequest.of(0, limit));
    return popular.stream().map(this::convertToAchievementMap).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getRarestAchievements(int limit) {
    List<Object[]> rarest =
        userAchievementRepository.findRarestAchievements(PageRequest.of(0, limit));
    return rarest.stream().map(this::convertToAchievementMap).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public Integer calculateUserLevel(Long userId) {
    Integer totalPoints = getUserTotalPoints(userId);
    if (totalPoints == null || totalPoints == 0) {
      return 1;
    }

    // 简单的等级计算公式：每100积分升一级
    return Math.min(100, totalPoints / 100 + 1);
  }

  @Override
  @Transactional(readOnly = true)
  public Integer getUserTotalPoints(Long userId) {
    Integer points = userAchievementRepository.getTotalPointsByUserId(userId);
    return points != null ? points : 0;
  }

  @Override
  @Async
  public void sendAchievementNotification(Long userId, UserAchievementDTO achievement) {
    try {
      String message = String.format("恭喜！您获得了新成就：%s", achievement.getAchievementName());
      notificationService.createSystemNotification(userId, "成就获得", message);
      logger.info("成就通知已发送: userId={}, achievement={}", userId, achievement.getAchievementName());
    } catch (Exception e) {
      logger.error("发送成就通知失败: userId=" + userId, e);
    }
  }

  @Override
  @Async
  public void batchProcessAchievements() {
    logger.info("开始批量处理成就检查");

    // 获取今日活跃用户
    List<Long> activeUsers = userAchievementRepository.findUsersWithTodayAchievements();

    for (Long userId : activeUsers) {
      try {
        checkAndUpdateAchievements(userId);
      } catch (Exception e) {
        logger.error("批量处理成就失败: userId=" + userId, e);
      }
    }

    logger.info("批量处理成就检查完成，处理了 {} 个用户", activeUsers.size());
  }

  @Override
  public void cleanupExpiredAchievements() {
    logger.info("开始清理过期成就数据");

    // 这里可以实现清理逻辑，比如删除长时间未活跃用户的成就数据
    // 暂时不实现具体逻辑

    logger.info("过期成就数据清理完成");
  }

  @Override
  @Transactional(readOnly = true)
  public byte[] exportUserAchievements(Long userId, String format) {
    List<UserAchievementDTO> achievements = getUserAchievements(userId);

    StringBuilder data = new StringBuilder();
    data.append("用户成就导出\n");
    data.append("用户ID: ").append(userId).append("\n");
    data.append("导出时间: ").append(LocalDateTime.now()).append("\n\n");

    for (UserAchievementDTO achievement : achievements) {
      data.append("成就名称: ").append(achievement.getAchievementName()).append("\n");
      data.append("成就类型: ").append(achievement.getAchievementType()).append("\n");
      data.append("完成状态: ").append(achievement.getIsCompleted() ? "已完成" : "未完成").append("\n");
      data.append("进度: ")
          .append(achievement.getProgressCurrent())
          .append("/")
          .append(achievement.getProgressTarget())
          .append("\n");
      data.append("积分: ").append(achievement.getPointsAwarded()).append("\n");
      data.append("等级: ").append(achievement.getLevel()).append("\n\n");
    }

    return data.toString().getBytes();
  }

  @Override
  public UserAchievementDTO createCustomAchievement(
      Long userId, String name, String description, Integer points) {
    logger.info("创建自定义成就: userId={}, name={}", userId, name);

    UserAchievement achievement = new UserAchievement();
    achievement.setUserId(userId);
    achievement.setAchievementType(UserAchievement.AchievementType.SPECIAL_EVENT);
    achievement.setAchievementName(name);
    achievement.setAchievementDescription(description);
    achievement.setPointsAwarded(points);
    achievement.setProgressTarget(1);
    achievement.completeAchievement(); // 自定义成就直接完成

    achievement = userAchievementRepository.save(achievement);

    // 更新用户积分
    updateUserPoints(userId, points);

    return UserAchievementDTO.fromEntity(achievement);
  }

  @Override
  public void deleteUserAchievement(Long userId, UserAchievement.AchievementType achievementType) {
    logger.info("删除用户成就: userId={}, achievementType={}", userId, achievementType);

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(userId, achievementType);
    if (achievementOpt.isPresent()) {
      userAchievementRepository.delete(achievementOpt.get());
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getAchievementProgressReport(Long userId) {
    Map<String, Object> report = new HashMap<>();

    List<UserAchievement> achievements =
        userAchievementRepository.findByUserIdOrderByCreatedAtDesc(userId);

    // 总体进度
    long completed = achievements.stream().mapToLong(a -> a.getIsCompleted() ? 1 : 0).sum();
    report.put("totalAchievements", achievements.size());
    report.put("completedAchievements", completed);
    report.put(
        "completionRate",
        achievements.isEmpty() ? 0.0 : (double) completed / achievements.size() * 100);

    // 按类型分组进度
    Map<UserAchievement.AchievementType, List<UserAchievement>> byType =
        achievements.stream().collect(Collectors.groupingBy(UserAchievement::getAchievementType));

    Map<String, Map<String, Object>> typeProgress = new HashMap<>();
    for (Map.Entry<UserAchievement.AchievementType, List<UserAchievement>> entry :
        byType.entrySet()) {
      List<UserAchievement> typeAchievements = entry.getValue();
      long typeCompleted =
          typeAchievements.stream().mapToLong(a -> a.getIsCompleted() ? 1 : 0).sum();

      Map<String, Object> typeData = new HashMap<>();
      typeData.put("total", typeAchievements.size());
      typeData.put("completed", typeCompleted);
      typeData.put(
          "completionRate",
          typeAchievements.isEmpty()
              ? 0.0
              : (double) typeCompleted / typeAchievements.size() * 100);

      typeProgress.put(entry.getKey().name(), typeData);
    }
    report.put("progressByType", typeProgress);

    return report;
  }

  /** 创建初始成就 */
  private List<UserAchievement> createInitialAchievements(Long userId) {
    List<UserAchievement> achievements = new ArrayList<>();

    // 知识创作者成就
    UserAchievement knowledgeCreator =
        new UserAchievement(userId, UserAchievement.AchievementType.KNOWLEDGE_CREATOR, "知识创作者");
    knowledgeCreator.setAchievementDescription("创建您的第一个知识内容");
    knowledgeCreator.setPointsAwarded(10);
    knowledgeCreator.setProgressTarget(1);
    knowledgeCreator.setAchievementIcon("🎓");
    achievements.add(knowledgeCreator);

    // 社交达人成就
    UserAchievement socialButterfly =
        new UserAchievement(userId, UserAchievement.AchievementType.SOCIAL_BUTTERFLY, "社交达人");
    socialButterfly.setAchievementDescription("获得10个点赞");
    socialButterfly.setPointsAwarded(15);
    socialButterfly.setProgressTarget(10);
    socialButterfly.setAchievementIcon("👥");
    achievements.add(socialButterfly);

    // 活跃学习者成就
    UserAchievement activeLearner =
        new UserAchievement(userId, UserAchievement.AchievementType.ACTIVE_LEARNER, "活跃学习者");
    activeLearner.setAchievementDescription("连续登录7天");
    activeLearner.setPointsAwarded(20);
    activeLearner.setProgressTarget(7);
    activeLearner.setAchievementIcon("📚");
    achievements.add(activeLearner);

    // 里程碑达成者成就
    UserAchievement milestoneAchiever =
        new UserAchievement(userId, UserAchievement.AchievementType.MILESTONE_ACHIEVER, "里程碑达成者");
    milestoneAchiever.setAchievementDescription("获得100积分");
    milestoneAchiever.setPointsAwarded(50);
    milestoneAchiever.setProgressTarget(100);
    milestoneAchiever.setAchievementIcon("🏆");
    achievements.add(milestoneAchiever);

    return achievements;
  }

  /** 检查知识创作者成就 */
  private List<UserAchievementDTO> checkKnowledgeCreatorAchievements(
      Long userId, UserStats userStats) {
    List<UserAchievementDTO> completed = new ArrayList<>();

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(
            userId, UserAchievement.AchievementType.KNOWLEDGE_CREATOR);

    if (achievementOpt.isPresent()) {
      UserAchievement achievement = achievementOpt.get();
      achievement.updateProgress(userStats.getKnowledgeCount());

      if (achievement.getIsCompleted()
          && !completed.stream().anyMatch(a -> a.getId().equals(achievement.getId()))) {
        userAchievementRepository.save(achievement);
        completed.add(UserAchievementDTO.fromEntity(achievement));
      }
    }

    return completed;
  }

  /** 检查社交成就 */
  private List<UserAchievementDTO> checkSocialAchievements(Long userId, UserStats userStats) {
    List<UserAchievementDTO> completed = new ArrayList<>();

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(
            userId, UserAchievement.AchievementType.SOCIAL_BUTTERFLY);

    if (achievementOpt.isPresent()) {
      UserAchievement achievement = achievementOpt.get();
      achievement.updateProgress(userStats.getLikeCount());

      if (achievement.getIsCompleted()
          && !completed.stream().anyMatch(a -> a.getId().equals(achievement.getId()))) {
        userAchievementRepository.save(achievement);
        completed.add(UserAchievementDTO.fromEntity(achievement));
      }
    }

    return completed;
  }

  /** 检查活跃度成就 */
  private List<UserAchievementDTO> checkActivityAchievements(Long userId, UserStats userStats) {
    List<UserAchievementDTO> completed = new ArrayList<>();

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(
            userId, UserAchievement.AchievementType.ACTIVE_LEARNER);

    if (achievementOpt.isPresent()) {
      UserAchievement achievement = achievementOpt.get();
      achievement.updateProgress(userStats.getLoginCount());

      if (achievement.getIsCompleted()
          && !completed.stream().anyMatch(a -> a.getId().equals(achievement.getId()))) {
        userAchievementRepository.save(achievement);
        completed.add(UserAchievementDTO.fromEntity(achievement));
      }
    }

    return completed;
  }

  /** 检查里程碑成就 */
  private List<UserAchievementDTO> checkMilestoneAchievements(Long userId, UserStats userStats) {
    List<UserAchievementDTO> completed = new ArrayList<>();

    Optional<UserAchievement> achievementOpt =
        userAchievementRepository.findByUserIdAndAchievementType(
            userId, UserAchievement.AchievementType.MILESTONE_ACHIEVER);

    if (achievementOpt.isPresent()) {
      UserAchievement achievement = achievementOpt.get();
      achievement.updateProgress(userStats.getTotalScore());

      if (achievement.getIsCompleted()
          && !completed.stream().anyMatch(a -> a.getId().equals(achievement.getId()))) {
        userAchievementRepository.save(achievement);
        completed.add(UserAchievementDTO.fromEntity(achievement));
      }
    }

    return completed;
  }

  /** 检查知识创建成就 */
  private void checkKnowledgeCreationAchievement(Long userId) {
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isPresent()) {
      checkKnowledgeCreatorAchievements(userId, userStatsOpt.get());
    }
  }

  /** 检查社交互动成就 */
  private void checkSocialInteractionAchievement(Long userId) {
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isPresent()) {
      checkSocialAchievements(userId, userStatsOpt.get());
    }
  }

  /** 检查活跃度成就 */
  private void checkActivityAchievement(Long userId) {
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isPresent()) {
      checkActivityAchievements(userId, userStatsOpt.get());
    }
  }

  /** 检查参与度成就 */
  private void checkEngagementAchievement(Long userId) {
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isPresent()) {
      // 可以添加评论相关的成就检查
    }
  }

  /** 更新用户积分 */
  private void updateUserPoints(Long userId, Integer points) {
    Optional<UserStats> userStatsOpt = userStatsRepository.findByUserId(userId);
    if (userStatsOpt.isPresent()) {
      UserStats userStats = userStatsOpt.get();
      userStats.addScore(points);
      userStatsRepository.save(userStats);
    }
  }

  /** 转换成就数据为Map */
  private Map<String, Object> convertToAchievementMap(Object[] data) {
    Map<String, Object> map = new HashMap<>();
    if (data.length >= 3) {
      map.put("achievementType", data[0]);
      map.put("achievementName", data[1]);
      map.put("completedCount", data[2]);
    }
    return map;
  }
}
