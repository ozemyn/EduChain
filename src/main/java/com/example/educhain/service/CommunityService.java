package com.example.educhain.service;

import com.example.educhain.dto.*;
import java.util.List;

/** 社区服务接口 提供社区相关的业务逻辑 */
public interface CommunityService {

  /**
   * 获取社区动态聚合数据
   *
   * @return 社区动态数据
   */
  CommunityFeedDTO getCommunityFeed();

  /**
   * 获取热门讨论列表
   *
   * @param limit 返回数量
   * @return 讨论列表
   */
  List<DiscussionDTO> getHotDiscussions(Integer limit);

  /**
   * 获取最新讨论列表
   *
   * @param limit 返回数量
   * @return 讨论列表
   */
  List<DiscussionDTO> getNewDiscussions(Integer limit);

  /**
   * 获取趋势讨论列表
   *
   * @param limit 返回数量
   * @return 讨论列表
   */
  List<DiscussionDTO> getTrendingDiscussions(Integer limit);

  /**
   * 获取活跃用户列表
   *
   * @param limit 返回数量
   * @return 用户列表
   */
  List<ActiveUserDTO> getActiveUsers(Integer limit);

  /**
   * 获取热门话题标签
   *
   * @param limit 返回数量
   * @return 话题列表
   */
  List<HotTopicDTO> getHotTopics(Integer limit);

  /**
   * 获取社区统计数据
   *
   * @return 统计数据
   */
  CommunityStatsDTO getCommunityStats();
}
