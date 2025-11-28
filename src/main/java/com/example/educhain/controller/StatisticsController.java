package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.StatisticsAnalysisService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 统计分析控制器
 */
@RestController
@RequestMapping("/statistics")
@Tag(name = "统计分析", description = "统计分析相关接口")
public class StatisticsController {

    @Autowired
    private StatisticsAnalysisService statisticsAnalysisService;

    @GetMapping("/platform")
    @Operation(summary = "获取平台整体统计信息")
    public Result<PlatformStatsDTO> getPlatformStats() {
        PlatformStatsDTO stats = statisticsAnalysisService.getPlatformStats();
        return Result.success(stats);
    }

    @GetMapping("/knowledge/{knowledgeId}")
    @Operation(summary = "获取知识内容统计信息")
    public Result<KnowledgeStatsDTO> getKnowledgeStats(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
        KnowledgeStatsDTO stats = statisticsAnalysisService.getKnowledgeStats(knowledgeId);
        return Result.success(stats);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户统计信息")
    public Result<UserStatsDTO> getUserStats(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        UserStatsDTO stats = statisticsAnalysisService.getUserStats(userId);
        return Result.success(stats);
    }

    @GetMapping("/popular/knowledge")
    @Operation(summary = "获取热门知识内容排行榜")
    public Result<Page<KnowledgeStatsDTO>> getPopularKnowledge(
            @Parameter(description = "排序方式: views, likes, favorites, quality") 
            @RequestParam(defaultValue = "views") String sortBy,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<KnowledgeStatsDTO> popularKnowledge = statisticsAnalysisService.getPopularKnowledge(sortBy, pageable);
        return Result.success(popularKnowledge);
    }

    @GetMapping("/active/users")
    @Operation(summary = "获取活跃用户排行榜")
    public Result<Page<UserStatsDTO>> getActiveUsers(
            @Parameter(description = "排序方式: score, knowledge, followers, activity") 
            @RequestParam(defaultValue = "score") String sortBy,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserStatsDTO> activeUsers = statisticsAnalysisService.getActiveUsers(sortBy, pageable);
        return Result.success(activeUsers);
    }

    @PostMapping("/quality-score/{knowledgeId}")
    @Operation(summary = "计算知识内容质量分数")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Double> calculateQualityScore(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
        Double score = statisticsAnalysisService.calculateQualityScore(knowledgeId);
        return Result.success(score);
    }

    @PostMapping("/quality-score/batch")
    @Operation(summary = "批量计算质量分数")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> batchCalculateQualityScores() {
        statisticsAnalysisService.batchCalculateQualityScores();
        return Result.success();
    }

    @GetMapping("/trends")
    @Operation(summary = "获取统计趋势数据")
    public Result<Map<String, List<?>>> getStatisticsTrends(
            @Parameter(description = "趋势类型") @RequestParam String type,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, List<?>> trends = statisticsAnalysisService.getStatisticsTrends(type, startDate, endDate);
        return Result.success(trends);
    }

    @GetMapping("/report")
    @Operation(summary = "生成统计报表")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<StatisticsReportDTO> generateReport(
            @Parameter(description = "报表类型") @RequestParam String reportType,
            @Parameter(description = "统计周期") @RequestParam String period) {
        StatisticsReportDTO report = statisticsAnalysisService.generateReport(reportType, period);
        return Result.success(report);
    }

    @GetMapping("/categories")
    @Operation(summary = "获取分类统计信息")
    public Result<List<Map<String, Object>>> getCategoryStats() {
        List<Map<String, Object>> stats = statisticsAnalysisService.getCategoryStats();
        return Result.success(stats);
    }

    @GetMapping("/tags")
    @Operation(summary = "获取标签使用统计")
    public Result<List<Map<String, Object>>> getTagUsageStats() {
        List<Map<String, Object>> stats = statisticsAnalysisService.getTagUsageStats();
        return Result.success(stats);
    }

    @GetMapping("/user-activity")
    @Operation(summary = "获取用户活跃度分析")
    public Result<Map<String, Object>> getUserActivityAnalysis() {
        Map<String, Object> analysis = statisticsAnalysisService.getUserActivityAnalysis();
        return Result.success(analysis);
    }

    @GetMapping("/content-trends")
    @Operation(summary = "获取内容发布趋势")
    public Result<Map<String, List<?>>> getContentPublishTrends(
            @Parameter(description = "天数") @RequestParam(defaultValue = "30") int days) {
        Map<String, List<?>> trends = statisticsAnalysisService.getContentPublishTrends(days);
        return Result.success(trends);
    }

    @GetMapping("/interaction-analysis")
    @Operation(summary = "获取互动行为分析")
    public Result<Map<String, Object>> getInteractionAnalysis() {
        Map<String, Object> analysis = statisticsAnalysisService.getInteractionAnalysis();
        return Result.success(analysis);
    }

    @PostMapping("/update")
    @Operation(summary = "实时更新统计数据")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateStatistics() {
        statisticsAnalysisService.updateStatistics();
        return Result.success();
    }

    @GetMapping("/export")
    @Operation(summary = "导出统计数据")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportStatistics(
            @Parameter(description = "导出格式: csv, excel, pdf") @RequestParam(defaultValue = "csv") String format,
            @Parameter(description = "数据类型") @RequestParam String type) {
        
        byte[] data = statisticsAnalysisService.exportStatistics(format, type);
        
        String filename = "statistics_" + type + "_" + System.currentTimeMillis();
        String contentType = switch (format.toLowerCase()) {
            case "excel" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "pdf" -> "application/pdf";
            default -> "text/csv";
        };
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + "." + format)
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}