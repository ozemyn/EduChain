package com.example.educhain.controller;

import com.example.educhain.dto.ExternalContentDTO;
import com.example.educhain.dto.ExternalSourceDTO;
import com.example.educhain.service.ExternalContentCrawlerService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** 外部内容管理控制器 */
@RestController
@RequestMapping("/external-content")
@Tag(name = "外部内容管理", description = "外部内容抓取和管理相关接口")
public class ExternalContentController {

  @Autowired private ExternalContentCrawlerService externalContentCrawlerService;

  // ==================== 外部数据源管理 ====================

  /**
   * 创建外部数据源接口（管理员权限） 创建新的外部内容数据源配置，用于抓取外部网站的内容
   *
   * @param sourceDTO 外部数据源信息，包含URL、抓取规则等
   * @return 创建成功的数据源信息
   */
  @PostMapping("/sources")
  @Operation(summary = "创建外部数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<ExternalSourceDTO> createExternalSource(
      @Valid @RequestBody ExternalSourceDTO sourceDTO) {
    ExternalSourceDTO created = externalContentCrawlerService.createExternalSource(sourceDTO);
    return Result.success(created);
  }

  /**
   * 更新外部数据源接口（管理员权限） 更新指定外部数据源的配置信息
   *
   * @param sourceId 数据源ID
   * @param sourceDTO 更新的数据源信息
   * @return 更新后的数据源信息
   */
  @PutMapping("/sources/{sourceId}")
  @Operation(summary = "更新外部数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<ExternalSourceDTO> updateExternalSource(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId,
      @Valid @RequestBody ExternalSourceDTO sourceDTO) {
    ExternalSourceDTO updated =
        externalContentCrawlerService.updateExternalSource(sourceId, sourceDTO);
    return Result.success(updated);
  }

  /**
   * 删除外部数据源接口（管理员权限） 删除指定的外部数据源配置
   *
   * @param sourceId 数据源ID
   * @return 删除成功响应
   */
  @DeleteMapping("/sources/{sourceId}")
  @Operation(summary = "删除外部数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> deleteExternalSource(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    externalContentCrawlerService.deleteExternalSource(sourceId);
    return Result.success();
  }

  /**
   * 获取外部数据源详情接口（管理员权限） 根据数据源ID获取数据源的详细信息
   *
   * @param sourceId 数据源ID
   * @return 数据源详细信息
   */
  @GetMapping("/sources/{sourceId}")
  @Operation(summary = "获取外部数据源详情")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<ExternalSourceDTO> getExternalSource(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    ExternalSourceDTO source = externalContentCrawlerService.getExternalSource(sourceId);
    return Result.success(source);
  }

  /**
   * 获取所有外部数据源接口（管理员权限） 分页获取系统中所有外部数据源列表
   *
   * @param pageable 分页参数
   * @return 外部数据源列表（分页）
   */
  @GetMapping("/sources")
  @Operation(summary = "获取所有外部数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Page<ExternalSourceDTO>> getAllExternalSources(
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalSourceDTO> sources = externalContentCrawlerService.getAllExternalSources(pageable);
    return Result.success(sources);
  }

  /**
   * 获取启用的外部数据源接口（管理员权限） 返回所有启用状态的外部数据源列表
   *
   * @return 启用的外部数据源列表
   */
  @GetMapping("/sources/active")
  @Operation(summary = "获取启用的外部数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<List<ExternalSourceDTO>> getActiveExternalSources() {
    List<ExternalSourceDTO> sources = externalContentCrawlerService.getActiveExternalSources();
    return Result.success(sources);
  }

  /**
   * 启用/禁用数据源接口（管理员权限） 切换指定数据源的启用/禁用状态
   *
   * @param sourceId 数据源ID
   * @param enabled 是否启用（true=启用，false=禁用）
   * @return 操作成功响应
   */
  @PostMapping("/sources/{sourceId}/toggle")
  @Operation(summary = "启用/禁用数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> toggleSourceStatus(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId,
      @Parameter(description = "是否启用") @RequestParam boolean enabled) {
    externalContentCrawlerService.toggleSourceStatus(sourceId, enabled);
    return Result.success();
  }

  /**
   * 测试数据源连接接口（管理员权限） 测试指定数据源的URL连接是否可用
   *
   * @param sourceId 数据源ID
   * @return 连接是否成功（true=成功，false=失败）
   */
  @PostMapping("/sources/{sourceId}/test")
  @Operation(summary = "测试数据源连接")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Boolean> testSourceConnection(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    ExternalSourceDTO source = externalContentCrawlerService.getExternalSource(sourceId);
    boolean connected = externalContentCrawlerService.testSourceConnection(source.getSourceUrl());
    return Result.success(connected);
  }

  /**
   * 验证数据源配置接口（管理员权限） 验证数据源配置的有效性，检查URL格式、抓取规则等
   *
   * @param sourceDTO 要验证的数据源配置
   * @return 配置是否有效（true=有效，false=无效）
   */
  @PostMapping("/sources/validate")
  @Operation(summary = "验证数据源配置")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Boolean> validateSourceConfiguration(
      @Valid @RequestBody ExternalSourceDTO sourceDTO) {
    boolean valid = externalContentCrawlerService.validateSourceConfiguration(sourceDTO);
    return Result.success(valid);
  }

  // ==================== 内容抓取管理 ====================

  /**
   * 手动抓取指定数据源接口（管理员权限） 立即触发指定数据源的内容抓取任务
   *
   * @param sourceId 数据源ID
   * @return 抓取任务启动成功响应
   */
  @PostMapping("/sources/{sourceId}/crawl")
  @Operation(summary = "手动抓取指定数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> crawlExternalSource(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
    externalContentCrawlerService.crawlExternalSource(sourceId);
    return Result.success();
  }

  /**
   * 抓取所有需要更新的数据源接口（管理员权限） 触发所有需要更新的数据源的内容抓取任务
   *
   * @return 抓取任务启动成功响应
   */
  @PostMapping("/crawl/all")
  @Operation(summary = "抓取所有需要更新的数据源")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> crawlAllSources() {
    externalContentCrawlerService.crawlAllSources();
    return Result.success();
  }

  /**
   * 抓取单个URL的内容接口（管理员权限） 抓取指定URL的单个页面内容
   *
   * @param url 要抓取的URL地址
   * @param sourceId 关联的数据源ID
   * @return 抓取到的内容信息
   */
  @PostMapping("/crawl/single")
  @Operation(summary = "抓取单个URL的内容")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<ExternalContentDTO> crawlSingleUrl(
      @Parameter(description = "URL地址") @RequestParam String url,
      @Parameter(description = "数据源ID") @RequestParam Long sourceId) {
    ExternalContentDTO content = externalContentCrawlerService.crawlSingleUrl(url, sourceId);
    return Result.success(content);
  }

  // ==================== 外部内容管理 ====================

  /**
   * 获取外部内容详情接口 根据内容ID获取外部内容的详细信息
   *
   * @param contentId 内容ID
   * @return 外部内容详细信息
   */
  @GetMapping("/content/{contentId}")
  @Operation(summary = "获取外部内容详情")
  public Result<ExternalContentDTO> getExternalContent(
      @Parameter(description = "内容ID") @PathVariable Long contentId) {
    ExternalContentDTO content = externalContentCrawlerService.getExternalContent(contentId);
    return Result.success(content);
  }

  /**
   * 搜索外部内容接口 根据关键词搜索外部内容，支持全文搜索
   *
   * @param keyword 搜索关键词
   * @param pageable 分页参数
   * @return 匹配的外部内容列表（分页）
   */
  @GetMapping("/content/search")
  @Operation(summary = "搜索外部内容")
  public Result<Page<ExternalContentDTO>> searchExternalContent(
      @Parameter(description = "搜索关键词") @RequestParam String keyword,
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalContentDTO> contents =
        externalContentCrawlerService.searchExternalContent(keyword, pageable);
    return Result.success(contents);
  }

  /**
   * 根据数据源获取内容接口 获取指定数据源抓取的所有内容列表
   *
   * @param sourceId 数据源ID
   * @param pageable 分页参数
   * @return 该数据源的内容列表（分页）
   */
  @GetMapping("/content/source/{sourceId}")
  @Operation(summary = "根据数据源获取内容")
  public Result<Page<ExternalContentDTO>> getContentBySource(
      @Parameter(description = "数据源ID") @PathVariable Long sourceId,
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalContentDTO> contents =
        externalContentCrawlerService.getContentBySource(sourceId, pageable);
    return Result.success(contents);
  }

  /**
   * 根据分类获取内容接口 获取指定分类下的所有外部内容
   *
   * @param category 分类名称
   * @param pageable 分页参数
   * @return 该分类下的内容列表（分页）
   */
  @GetMapping("/content/category/{category}")
  @Operation(summary = "根据分类获取内容")
  public Result<Page<ExternalContentDTO>> getContentByCategory(
      @Parameter(description = "分类名称") @PathVariable String category,
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalContentDTO> contents =
        externalContentCrawlerService.getContentByCategory(category, pageable);
    return Result.success(contents);
  }

  /**
   * 获取高质量内容接口 获取质量分数达到指定阈值的外部内容
   *
   * @param minScore 最低质量分数，默认70.0
   * @param pageable 分页参数
   * @return 高质量内容列表（分页）
   */
  @GetMapping("/content/high-quality")
  @Operation(summary = "获取高质量内容")
  public Result<Page<ExternalContentDTO>> getHighQualityContent(
      @Parameter(description = "最低质量分数") @RequestParam(defaultValue = "70.0") Double minScore,
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalContentDTO> contents =
        externalContentCrawlerService.getHighQualityContent(minScore, pageable);
    return Result.success(contents);
  }

  /**
   * 获取最新内容接口 获取最近抓取的外部内容，按抓取时间倒序排列
   *
   * @param pageable 分页参数
   * @return 最新内容列表（分页）
   */
  @GetMapping("/content/latest")
  @Operation(summary = "获取最新内容")
  public Result<Page<ExternalContentDTO>> getLatestContent(
      @PageableDefault(size = 20) Pageable pageable) {
    Page<ExternalContentDTO> contents = externalContentCrawlerService.getLatestContent(pageable);
    return Result.success(contents);
  }

  /**
   * 删除外部内容接口（管理员权限） 删除指定的外部内容记录
   *
   * @param contentId 内容ID
   * @return 删除成功响应
   */
  @DeleteMapping("/content/{contentId}")
  @Operation(summary = "删除外部内容")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> deleteExternalContent(
      @Parameter(description = "内容ID") @PathVariable Long contentId) {
    externalContentCrawlerService.deleteExternalContent(contentId);
    return Result.success();
  }

  // ==================== 内容管理工具 ====================

  /**
   * 批量删除重复内容接口（管理员权限） 检测并删除重复的外部内容，基于URL或内容哈希值
   *
   * @return 删除的重复内容数量
   */
  @PostMapping("/content/remove-duplicates")
  @Operation(summary = "批量删除重复内容")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Integer> removeDuplicateContent() {
    int removedCount = externalContentCrawlerService.removeDuplicateContent();
    return Result.success(removedCount);
  }

  /**
   * 更新内容质量分数接口（管理员权限） 重新计算所有外部内容的质量分数
   *
   * @return 更新成功响应
   */
  @PostMapping("/content/update-quality-scores")
  @Operation(summary = "更新内容质量分数")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Void> updateContentQualityScores() {
    externalContentCrawlerService.updateContentQualityScores();
    return Result.success();
  }

  /**
   * 清理过期内容接口（管理员权限） 删除指定天数之前的过期外部内容
   *
   * @param daysOld 过期天数，默认365天
   * @return 清理的内容数量
   */
  @PostMapping("/content/cleanup")
  @Operation(summary = "清理过期内容")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Integer> cleanupExpiredContent(
      @Parameter(description = "过期天数") @RequestParam(defaultValue = "365") int daysOld) {
    int cleanedCount = externalContentCrawlerService.cleanupExpiredContent(daysOld);
    return Result.success(cleanedCount);
  }

  // ==================== 统计信息 ====================

  /**
   * 获取抓取统计信息接口（管理员权限） 返回内容抓取的统计数据，包括抓取次数、成功率等
   *
   * @return 抓取统计数据
   */
  @GetMapping("/statistics/crawl")
  @Operation(summary = "获取抓取统计信息")
  @PreAuthorize("hasRole('ADMIN')")
  public Result<Map<String, Object>> getCrawlStatistics() {
    Map<String, Object> stats = externalContentCrawlerService.getCrawlStatistics();
    return Result.success(stats);
  }

  /**
   * 获取内容统计信息接口 返回外部内容的统计数据，包括总数、分类分布等
   *
   * @return 内容统计数据
   */
  @GetMapping("/statistics/content")
  @Operation(summary = "获取内容统计信息")
  public Result<Map<String, Object>> getContentStatistics() {
    Map<String, Object> stats = externalContentCrawlerService.getContentStatistics();
    return Result.success(stats);
  }
}
