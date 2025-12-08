package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.*;
import com.example.educhain.repository.*;
import com.example.educhain.service.CommunityService;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 社区服务实现 复用现有的知识内容、用户、标签等数据 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

  private final KnowledgeItemRepository knowledgeItemRepository;
  private final KnowledgeStatsRepository knowledgeStatsRepository;
  private final UserRepository userRepository;
  private final UserStatsRepository userStatsRepository;
  private final TagRepository tagRepository;
  private final CommentRepository commentRepository;

  private static final String[] TAG_COLORS = {
    "blue", "cyan", "green", "purple", "orange", "red", "magenta", "lime"
  };

  @Override
  @Transactional(readOnly = true)
  public CommunityFeedDTO getCommunityFeed() {
    log.info("获取社区动态聚合数据");

    return CommunityFeedDTO.builder()
        .hotDiscussions(getHotDiscussions(10))
        .activeUsers(getActiveUsers(4))
        .hotTopics(getHotTopics(8))
        .stats(getCommunityStats())
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscussionDTO> getHotDiscussions(Integer limit) {
    log.info("获取热门讨论，limit: {}", limit);

    // 按点赞数 + 评论数 + 浏览数综合排序
    Pageable pageable = PageRequest.of(0, limit);
    List<KnowledgeItem> items =
        knowledgeItemRepository.findByStatusOrderByCreatedAtDesc(1, pageable);

    return items.stream().map(this::convertToDiscussionDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscussionDTO> getNewDiscussions(Integer limit) {
    log.info("获取最新讨论，limit: {}", limit);

    Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
    List<KnowledgeItem> items =
        knowledgeItemRepository.findByStatusOrderByCreatedAtDesc(1, pageable);

    return items.stream().map(this::convertToDiscussionDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscussionDTO> getTrendingDiscussions(Integer limit) {
    log.info("获取趋势讨论，limit: {}", limit);

    // 获取最近7天的内容，按互动数排序
    LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
    Pageable pageable = PageRequest.of(0, limit);

    List<KnowledgeItem> items =
        knowledgeItemRepository.findByStatusAndCreatedAtAfterOrderByCreatedAtDesc(
            1, sevenDaysAgo, pageable);

    return items.stream().map(this::convertToDiscussionDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ActiveUserDTO> getActiveUsers(Integer limit) {
    log.info("获取活跃用户，limit: {}", limit);

    Pageable pageable = PageRequest.of(0, limit);
    List<UserStats> userStatsList = userStatsRepository.findTopByOrderByTotalScoreDesc(pageable);

    List<ActiveUserDTO> activeUsers = new ArrayList<>();
    int rank = 1;

    for (UserStats stats : userStatsList) {
      User user = userRepository.findById(stats.getUserId()).orElse(null);
      if (user != null) {
        activeUsers.add(
            ActiveUserDTO.builder()
                .id(user.getId())
                .name(user.getUsername())
                .avatar(user.getAvatarUrl())
                .posts(stats.getKnowledgeCount())
                .likes((long) stats.getLikeCount())
                .level("LV." + user.getLevel())
                .rank(rank++)
                .build());
      }
    }

    return activeUsers;
  }

  @Override
  @Transactional(readOnly = true)
  public List<HotTopicDTO> getHotTopics(Integer limit) {
    log.info("获取热门话题，limit: {}", limit);

    Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "usageCount"));
    List<Tag> tags = tagRepository.findByStatus(1, pageable);

    List<HotTopicDTO> hotTopics = new ArrayList<>();
    for (int i = 0; i < tags.size(); i++) {
      Tag tag = tags.get(i);
      hotTopics.add(
          HotTopicDTO.builder()
              .name(tag.getName())
              .count(tag.getUsageCount())
              .color(TAG_COLORS[i % TAG_COLORS.length])
              .build());
    }

    return hotTopics;
  }

  @Override
  @Transactional(readOnly = true)
  public CommunityStatsDTO getCommunityStats() {
    log.info("获取社区统计数据");

    // 活跃用户数（状态为1的用户）
    Long activeUsers = userRepository.countByStatus(1);

    // 总讨论数（知识内容总数）
    Long totalDiscussions = knowledgeItemRepository.countByStatus(1);

    // 今日发帖数
    LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
    Long todayPosts = knowledgeItemRepository.countByStatusAndCreatedAtAfter(1, todayStart);

    // 今日评论数
    Long todayComments = commentRepository.countByStatusAndCreatedAtAfter(1, todayStart);

    return CommunityStatsDTO.builder()
        .activeUsers(activeUsers)
        .totalDiscussions(totalDiscussions)
        .todayPosts(todayPosts)
        .todayComments(todayComments)
        .build();
  }

  /** 将KnowledgeItem转换为DiscussionDTO */
  private DiscussionDTO convertToDiscussionDTO(KnowledgeItem item) {
    User uploader = userRepository.findById(item.getUploaderId()).orElse(null);
    KnowledgeStats stats = knowledgeStatsRepository.findByKnowledgeId(item.getId()).orElse(null);

    // 解析标签
    List<String> tags = new ArrayList<>();
    if (item.getTags() != null && !item.getTags().isEmpty()) {
      tags = Arrays.asList(item.getTags().split(","));
    }

    // 计算时间差
    String timeAgo = formatTimeAgo(item.getCreatedAt());

    // 判断是否为热门（点赞数 > 50 或 评论数 > 20）
    boolean isHot = false;
    long likes = 0;
    long views = 0;
    int replies = 0;

    if (stats != null) {
      likes = stats.getLikeCount();
      views = stats.getViewCount();
      replies = stats.getCommentCount().intValue();
      isHot = likes > 50 || replies > 20;
    }

    return DiscussionDTO.builder()
        .id(item.getId())
        .title(item.getTitle())
        .author(uploader != null ? uploader.getUsername() : "未知用户")
        .authorAvatar(uploader != null ? uploader.getAvatarUrl() : null)
        .authorId(item.getUploaderId())
        .replies(replies)
        .views(views)
        .likes(likes)
        .time(timeAgo)
        .createdAt(item.getCreatedAt())
        .tags(tags)
        .isHot(isHot)
        .build();
  }

  /** 格式化时间为"xx前"的形式 */
  private String formatTimeAgo(LocalDateTime dateTime) {
    Duration duration = Duration.between(dateTime, LocalDateTime.now());

    long minutes = duration.toMinutes();
    if (minutes < 1) {
      return "刚刚";
    } else if (minutes < 60) {
      return minutes + "分钟前";
    }

    long hours = duration.toHours();
    if (hours < 24) {
      return hours + "小时前";
    }

    long days = duration.toDays();
    if (days < 7) {
      return days + "天前";
    } else if (days < 30) {
      return (days / 7) + "周前";
    } else if (days < 365) {
      return (days / 30) + "个月前";
    } else {
      return (days / 365) + "年前";
    }
  }
}
