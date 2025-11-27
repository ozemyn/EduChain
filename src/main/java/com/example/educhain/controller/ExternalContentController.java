package com.example.educhain.controller;

import com.example.educhain.dto.ExternalContentDTO;
import com.example.educhain.dto.ExternalSourceDTO;
import com.example.educhain.service.ExternalContentCrawlerService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 外部内容管理控制器
 */
@RestController
@RequestMapping("/api/external-content")
@Tag(name = "外部内容管理", description = "外部内容抓取和管理相关接口")
public class ExternalContentController {

    @Autowired
    private ExternalContentCrawlerService externalContentCrawlerService;

    // ==================== 外部数据源管理 ====================

    @PostMapping("/sources")
    @Operation(summary = "创建外部数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<ExternalSourceDTO> createExternalSource(@Valid @RequestBody ExternalSourceDTO sourceDTO) {
        ExternalSourceDTO created = externalContentCrawlerService.createExternalSource(sourceDTO);
        return Result.success(created);
    }

    @PutMapping("/sources/{sourceId}")
    @Operation(summary = "更新外部数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<ExternalSourceDTO> updateExternalSource(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId,
            @Valid @RequestBody ExternalSourceDTO sourceDTO) {
        ExternalSourceDTO updated = externalContentCrawlerService.updateExternalSource(sourceId, sourceDTO);
        return Result.success(updated);
    }

    @DeleteMapping("/sources/{sourceId}")
    @Operation(summary = "删除外部数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteExternalSource(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
        externalContentCrawlerService.deleteExternalSource(sourceId);
        return Result.success();
    }

    @GetMapping("/sources/{sourceId}")
    @Operation(summary = "获取外部数据源详情")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<ExternalSourceDTO> getExternalSource(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
        ExternalSourceDTO source = externalContentCrawlerService.getExternalSource(sourceId);
        return Result.success(source);
    }

    @GetMapping("/sources")
    @Operation(summary = "获取所有外部数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Page<ExternalSourceDTO>> getAllExternalSources(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalSourceDTO> sources = externalContentCrawlerService.getAllExternalSources(pageable);
        return Result.success(sources);
    }

    @GetMapping("/sources/active")
    @Operation(summary = "获取启用的外部数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<List<ExternalSourceDTO>> getActiveExternalSources() {
        List<ExternalSourceDTO> sources = externalContentCrawlerService.getActiveExternalSources();
        return Result.success(sources);
    }

    @PostMapping("/sources/{sourceId}/toggle")
    @Operation(summary = "启用/禁用数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> toggleSourceStatus(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId,
            @Parameter(description = "是否启用") @RequestParam boolean enabled) {
        externalContentCrawlerService.toggleSourceStatus(sourceId, enabled);
        return Result.success();
    }

    @PostMapping("/sources/{sourceId}/test")
    @Operation(summary = "测试数据源连接")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Boolean> testSourceConnection(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
        ExternalSourceDTO source = externalContentCrawlerService.getExternalSource(sourceId);
        boolean connected = externalContentCrawlerService.testSourceConnection(source.getSourceUrl());
        return Result.success(connected);
    }

    @PostMapping("/sources/validate")
    @Operation(summary = "验证数据源配置")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Boolean> validateSourceConfiguration(@Valid @RequestBody ExternalSourceDTO sourceDTO) {
        boolean valid = externalContentCrawlerService.validateSourceConfiguration(sourceDTO);
        return Result.success(valid);
    }

    // ==================== 内容抓取管理 ====================

    @PostMapping("/sources/{sourceId}/crawl")
    @Operation(summary = "手动抓取指定数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> crawlExternalSource(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId) {
        externalContentCrawlerService.crawlExternalSource(sourceId);
        return Result.success();
    }

    @PostMapping("/crawl/all")
    @Operation(summary = "抓取所有需要更新的数据源")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> crawlAllSources() {
        externalContentCrawlerService.crawlAllSources();
        return Result.success();
    }

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

    @GetMapping("/content/{contentId}")
    @Operation(summary = "获取外部内容详情")
    public Result<ExternalContentDTO> getExternalContent(
            @Parameter(description = "内容ID") @PathVariable Long contentId) {
        ExternalContentDTO content = externalContentCrawlerService.getExternalContent(contentId);
        return Result.success(content);
    }

    @GetMapping("/content/search")
    @Operation(summary = "搜索外部内容")
    public Result<Page<ExternalContentDTO>> searchExternalContent(
            @Parameter(description = "搜索关键词") @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalContentDTO> contents = externalContentCrawlerService.searchExternalContent(keyword, pageable);
        return Result.success(contents);
    }

    @GetMapping("/content/source/{sourceId}")
    @Operation(summary = "根据数据源获取内容")
    public Result<Page<ExternalContentDTO>> getContentBySource(
            @Parameter(description = "数据源ID") @PathVariable Long sourceId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalContentDTO> contents = externalContentCrawlerService.getContentBySource(sourceId, pageable);
        return Result.success(contents);
    }

    @GetMapping("/content/category/{category}")
    @Operation(summary = "根据分类获取内容")
    public Result<Page<ExternalContentDTO>> getContentByCategory(
            @Parameter(description = "分类名称") @PathVariable String category,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalContentDTO> contents = externalContentCrawlerService.getContentByCategory(category, pageable);
        return Result.success(contents);
    }

    @GetMapping("/content/high-quality")
    @Operation(summary = "获取高质量内容")
    public Result<Page<ExternalContentDTO>> getHighQualityContent(
            @Parameter(description = "最低质量分数") @RequestParam(defaultValue = "70.0") Double minScore,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalContentDTO> contents = externalContentCrawlerService.getHighQualityContent(minScore, pageable);
        return Result.success(contents);
    }

    @GetMapping("/content/latest")
    @Operation(summary = "获取最新内容")
    public Result<Page<ExternalContentDTO>> getLatestContent(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ExternalContentDTO> contents = externalContentCrawlerService.getLatestContent(pageable);
        return Result.success(contents);
    }

    @DeleteMapping("/content/{contentId}")
    @Operation(summary = "删除外部内容")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteExternalContent(
            @Parameter(description = "内容ID") @PathVariable Long contentId) {
        externalContentCrawlerService.deleteExternalContent(contentId);
        return Result.success();
    }

    // ==================== 内容管理工具 ====================

    @PostMapping("/content/remove-duplicates")
    @Operation(summary = "批量删除重复内容")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Integer> removeDuplicateContent() {
        int removedCount = externalContentCrawlerService.removeDuplicateContent();
        return Result.success(removedCount);
    }

    @PostMapping("/content/update-quality-scores")
    @Operation(summary = "更新内容质量分数")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateContentQualityScores() {
        externalContentCrawlerService.updateContentQualityScores();
        return Result.success();
    }

    @PostMapping("/content/cleanup")
    @Operation(summary = "清理过期内容")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Integer> cleanupExpiredContent(
            @Parameter(description = "过期天数") @RequestParam(defaultValue = "365") int daysOld) {
        int cleanedCount = externalContentCrawlerService.cleanupExpiredContent(daysOld);
        return Result.success(cleanedCount);
    }

    // ==================== 统计信息 ====================

    @GetMapping("/statistics/crawl")
    @Operation(summary = "获取抓取统计信息")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Map<String, Object>> getCrawlStatistics() {
        Map<String, Object> stats = externalContentCrawlerService.getCrawlStatistics();
        return Result.success(stats);
    }

    @GetMapping("/statistics/content")
    @Operation(summary = "获取内容统计信息")
    public Result<Map<String, Object>> getContentStatistics() {
        Map<String, Object> stats = externalContentCrawlerService.getContentStatistics();
        return Result.success(stats);
    }
}