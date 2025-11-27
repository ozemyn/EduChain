package com.example.educhain.service;

import com.example.educhain.dto.AchievementSummaryDTO;
import com.example.educhain.dto.UserAchievementDTO;
import com.example.educhain.entity.UserAchievement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * 用户成就服务接口
 */
public interface UserAchievementService {

    /**
     * 初始化用户成就系统
     */
    void initializeUserAchievements(Long userId);

    /**
     * 获取用户成就概览
     */
    AchievementSummaryDTO getUserAchievementSummary(Long userId);

    /**
     * 获取用户所有成就
     */
    List<UserAchievementDTO> getUserAchievements(Long userId);

    /**
     * 获取用户已完成的成就
     */
    List<UserAchievementDTO> getUserCompletedAchievements(Long userId);

    /**
     * 获取用户未完成的成就
     */
    List<UserAchievementDTO> getUserPendingAchievements(Long userId);

    /**
     * 获取用户最近获得的成就
     */
    List<UserAchievementDTO> getUserRecentAchievements(Long userId, int limit);

    /**
     * 获取用户接近完成的成就
     */
    List<UserAchievementDTO> getUserNearCompletionAchievements(Long userId);

    /**
     * 获取用户可升级的成就
     */
    List<UserAchievementDTO> getUserUpgradableAchievements(Long userId);

    /**
     * 检查并更新用户成就
     */
    List<UserAchievementDTO> checkAndUpdateAchievements(Long userId);

    /**
     * 手动触发成就检查
     */
    void triggerAchievementCheck(Long userId, String eventType, Map<String, Object> eventData);

    /**
     * 升级成就
     */
    UserAchievementDTO levelUpAchievement(Long userId, UserAchievement.AchievementType achievementType);

    /**
     * 重置成就
     */
    void resetAchievement(Long userId, UserAchievement.AchievementType achievementType);

    /**
     * 获取成就排行榜
     */
    Page<Map<String, Object>> getAchievementLeaderboard(Pageable pageable);

    /**
     * 获取特定类型成就排行榜
     */
    Page<Map<String, Object>> getAchievementTypeLeaderboard(UserAchievement.AchievementType achievementType, Pageable pageable);

    /**
     * 获取成就统计信息
     */
    Map<String, Object> getAchievementStatistics();

    /**
     * 获取最受欢迎的成就
     */
    List<Map<String, Object>> getMostPopularAchievements(int limit);

    /**
     * 获取最稀有的成就
     */
    List<Map<String, Object>> getRarestAchievements(int limit);

    /**
     * 计算用户等级
     */
    Integer calculateUserLevel(Long userId);

    /**
     * 获取用户总积分
     */
    Integer getUserTotalPoints(Long userId);

    /**
     * 发送成就通知
     */
    void sendAchievementNotification(Long userId, UserAchievementDTO achievement);

    /**
     * 批量处理成就检查
     */
    void batchProcessAchievements();

    /**
     * 清理过期成就数据
     */
    void cleanupExpiredAchievements();

    /**
     * 导出用户成就数据
     */
    byte[] exportUserAchievements(Long userId, String format);

    /**
     * 创建自定义成就
     */
    UserAchievementDTO createCustomAchievement(Long userId, String name, String description, Integer points);

    /**
     * 删除用户成就
     */
    void deleteUserAchievement(Long userId, UserAchievement.AchievementType achievementType);

    /**
     * 获取成就进度报告
     */
    Map<String, Object> getAchievementProgressReport(Long userId);
}