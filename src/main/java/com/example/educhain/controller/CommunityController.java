package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.CommunityService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/** 社区控制器 提供社区相关的API接口 */
@Slf4j
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "社区管理", description = "社区相关接口")
public class CommunityController {

  private final CommunityService communityService;

  /** 获取社区动态聚合数据 一次性返回社区页面所需的所有数据 */
  @GetMapping("/feed")
  @Operation(summary = "获取社区动态", description = "获取社区页面的聚合数据，包括热门讨论、活跃用户、热门话题等")
  public Result<CommunityFeedDTO> getCommunityFeed() {
    log.info("获取社区动态聚合数据");
    CommunityFeedDTO feed = communityService.getCommunityFeed();
    return Result.success(feed);
  }

  /** 获取热门讨论列表 */
  @GetMapping("/discussions/hot")
  @Operation(summary = "获取热门讨论", description = "获取热门讨论列表，按互动数排序")
  public Result<List<DiscussionDTO>> getHotDiscussions(
      @Parameter(description = "返回数量") @RequestParam(defaultValue = "10") Integer limit) {
    log.info("获取热门讨论列表，limit: {}", limit);
    List<DiscussionDTO> discussions = communityService.getHotDiscussions(limit);
    return Result.success(discussions);
  }

  /** 获取最新讨论列表 */
  @GetMapping("/discussions/new")
  @Operation(summary = "获取最新讨论", description = "获取最新发布的讨论列表")
  public Result<List<DiscussionDTO>> getNewDiscussions(
      @Parameter(description = "返回数量") @RequestParam(defaultValue = "10") Integer limit) {
    log.info("获取最新讨论列表，limit: {}", limit);
    List<DiscussionDTO> discussions = communityService.getNewDiscussions(limit);
    return Result.success(discussions);
  }

  /** 获取趋势讨论列表 */
  @GetMapping("/discussions/trending")
  @Operation(summary = "获取趋势讨论", description = "获取近期热度上升的讨论列表")
  public Result<List<DiscussionDTO>> getTrendingDiscussions(
      @Parameter(description = "返回数量") @RequestParam(defaultValue = "10") Integer limit) {
    log.info("获取趋势讨论列表，limit: {}", limit);
    List<DiscussionDTO> discussions = communityService.getTrendingDiscussions(limit);
    return Result.success(discussions);
  }

  /** 获取活跃用户列表 */
  @GetMapping("/users/active")
  @Operation(summary = "获取活跃用户", description = "获取社区活跃用户排行榜")
  public Result<List<ActiveUserDTO>> getActiveUsers(
      @Parameter(description = "返回数量") @RequestParam(defaultValue = "10") Integer limit) {
    log.info("获取活跃用户列表，limit: {}", limit);
    List<ActiveUserDTO> users = communityService.getActiveUsers(limit);
    return Result.success(users);
  }

  /** 获取热门话题标签 */
  @GetMapping("/topics/hot")
  @Operation(summary = "获取热门话题", description = "获取热门话题标签列表")
  public Result<List<HotTopicDTO>> getHotTopics(
      @Parameter(description = "返回数量") @RequestParam(defaultValue = "10") Integer limit) {
    log.info("获取热门话题列表，limit: {}", limit);
    List<HotTopicDTO> topics = communityService.getHotTopics(limit);
    return Result.success(topics);
  }

  /** 获取社区统计数据 */
  @GetMapping("/stats")
  @Operation(summary = "获取社区统计", description = "获取社区整体统计数据")
  public Result<CommunityStatsDTO> getCommunityStats() {
    log.info("获取社区统计数据");
    CommunityStatsDTO stats = communityService.getCommunityStats();
    return Result.success(stats);
  }
}
