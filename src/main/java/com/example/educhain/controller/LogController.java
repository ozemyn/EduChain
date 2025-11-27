package com.example.educhain.controller;

import com.example.educhain.config.LoggingAspect;
import com.example.educhain.dto.LogQueryRequest;
import com.example.educhain.dto.SystemLogDTO;
import com.example.educhain.entity.AdminLog;
import com.example.educhain.entity.SystemLog;
import com.example.educhain.service.AdminService;
import com.example.educhain.service.SystemLogService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 日志管理控制器
 */
@RestController
@RequestMapping("/api/admin/logs")
@Tag(name = "日志管理接口", description = "系统日志和管理员日志管理接口")
@PreAuthorize("hasRole('ADMIN')")
public class LogController {

    @Autowired
    private SystemLogService systemLogService;

    @Autowired
    private AdminService adminService;

    // ========== 系统日志管理 ==========

    @GetMapping("/system")
    @Operation(summary = "查询系统日志", description = "分页查询系统日志，支持多条件筛选")
    @LoggingAspect.OperationLog(operation = "查询系统日志", description = "管理员查询系统日志")
    public ResponseEntity<Result<Page<SystemLogDTO>>> getSystemLogs(
            @Parameter(description = "日志类型") @RequestParam(required = false) SystemLog.LogType logType,
            @Parameter(description = "日志级别") @RequestParam(required = false) SystemLog.LogLevel level,
            @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "用户名") @RequestParam(required = false) String username,
            @Parameter(description = "操作名称") @RequestParam(required = false) String operation,
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @Parameter(description = "IP地址") @RequestParam(required = false) String ipAddress,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SystemLog> logs = systemLogService.findLogs(logType, level, userId, username, operation, 
                                                         startTime, endTime, ipAddress, pageable);
        
        Page<SystemLogDTO> logDTOs = logs.map(SystemLogDTO::new);
        return ResponseEntity.ok(Result.success(logDTOs));
    }

    @GetMapping("/system/{id}")
    @Operation(summary = "获取系统日志详情", description = "根据ID获取系统日志详细信息")
    @LoggingAspect.OperationLog(operation = "查询系统日志详情", description = "管理员查询系统日志详情")
    public ResponseEntity<Result<SystemLogDTO>> getSystemLogById(
            @Parameter(description = "日志ID") @PathVariable Long id) {
        
        SystemLog log = systemLogService.findById(id);
        SystemLogDTO logDTO = new SystemLogDTO(log);
        return ResponseEntity.ok(Result.success(logDTO));
    }

    @GetMapping("/system/statistics")
    @Operation(summary = "获取系统日志统计", description = "获取指定时间范围内的系统日志统计信息")
    @LoggingAspect.OperationLog(operation = "查询系统日志统计", description = "管理员查询系统日志统计")
    public ResponseEntity<Result<Map<String, Object>>> getSystemLogStatistics(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        Map<String, Object> statistics = systemLogService.getLogStatistics(startTime, endTime);
        return ResponseEntity.ok(Result.success(statistics));
    }

    @GetMapping("/system/errors/recent")
    @Operation(summary = "获取最近错误日志", description = "获取最近的系统错误日志")
    @LoggingAspect.OperationLog(operation = "查询最近错误日志", description = "管理员查询最近错误日志")
    public ResponseEntity<Result<List<SystemLogDTO>>> getRecentErrors(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        
        List<SystemLog> errors = systemLogService.getRecentErrors(limit);
        List<SystemLogDTO> errorDTOs = errors.stream()
                .map(SystemLogDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Result.success(errorDTOs));
    }

    @GetMapping("/system/performance/slow")
    @Operation(summary = "获取慢操作日志", description = "获取执行时间超过阈值的操作日志")
    @LoggingAspect.OperationLog(operation = "查询慢操作日志", description = "管理员查询慢操作日志")
    public ResponseEntity<Result<List<SystemLogDTO>>> getSlowOperations(
            @Parameter(description = "时间阈值(毫秒)") @RequestParam(defaultValue = "5000") Long thresholdMs,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        
        List<SystemLog> slowOps = systemLogService.getSlowOperations(thresholdMs, limit);
        List<SystemLogDTO> slowOpDTOs = slowOps.stream()
                .map(SystemLogDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Result.success(slowOpDTOs));
    }

    @GetMapping("/system/export")
    @Operation(summary = "导出系统日志", description = "导出指定条件的系统日志数据")
    @LoggingAspect.OperationLog(operation = "导出系统日志", description = "管理员导出系统日志")
    public ResponseEntity<Result<List<SystemLogDTO>>> exportSystemLogs(
            @Parameter(description = "日志类型") @RequestParam(required = false) SystemLog.LogType logType,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        List<SystemLog> logs = systemLogService.exportLogs(logType, startTime, endTime);
        List<SystemLogDTO> logDTOs = logs.stream()
                .map(SystemLogDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Result.success(logDTOs));
    }

    // ========== 管理员日志管理 ==========

    @GetMapping("/admin")
    @Operation(summary = "查询管理员日志", description = "分页查询管理员操作日志，支持多条件筛选")
    @LoggingAspect.OperationLog(operation = "查询管理员日志", description = "管理员查询管理员操作日志")
    public ResponseEntity<Result<Page<AdminLog>>> getAdminLogs(
            @Parameter(description = "管理员ID") @RequestParam(required = false) Long adminId,
            @Parameter(description = "管理员用户名") @RequestParam(required = false) String adminUsername,
            @Parameter(description = "操作类型") @RequestParam(required = false) AdminLog.OperationType operationType,
            @Parameter(description = "目标类型") @RequestParam(required = false) AdminLog.TargetType targetType,
            @Parameter(description = "操作结果") @RequestParam(required = false) AdminLog.OperationResult result,
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminLog> logs = adminService.getAdminLogs(adminId, adminUsername, operationType, 
                                                       targetType, result, startTime, endTime, pageable);
        return ResponseEntity.ok(Result.success(logs));
    }

    @GetMapping("/admin/statistics")
    @Operation(summary = "获取管理员操作统计", description = "获取指定时间范围内的管理员操作统计信息")
    @LoggingAspect.OperationLog(operation = "查询管理员操作统计", description = "管理员查询操作统计")
    public ResponseEntity<Result<Map<String, Object>>> getAdminOperationStatistics(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        Map<String, Object> statistics = adminService.getAdminOperationStatistics(startTime, endTime);
        return ResponseEntity.ok(Result.success(statistics));
    }

    @GetMapping("/admin/active")
    @Operation(summary = "获取最活跃管理员", description = "获取指定时间范围内最活跃的管理员列表")
    @LoggingAspect.OperationLog(operation = "查询最活跃管理员", description = "管理员查询最活跃管理员")
    public ResponseEntity<Result<List<Map<String, Object>>>> getMostActiveAdmins(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        
        List<Map<String, Object>> activeAdmins = adminService.getMostActiveAdmins(startTime, endTime, limit);
        return ResponseEntity.ok(Result.success(activeAdmins));
    }

    @GetMapping("/admin/failures")
    @Operation(summary = "获取失败操作记录", description = "获取最近的失败操作记录")
    @LoggingAspect.OperationLog(operation = "查询失败操作记录", description = "管理员查询失败操作记录")
    public ResponseEntity<Result<List<AdminLog>>> getFailedOperations(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        
        List<AdminLog> failedOps = adminService.getFailedOperations(limit);
        return ResponseEntity.ok(Result.success(failedOps));
    }

    @GetMapping("/admin/export")
    @Operation(summary = "导出管理员日志", description = "导出指定时间范围内的管理员操作日志")
    @LoggingAspect.OperationLog(operation = "导出管理员日志", description = "管理员导出操作日志")
    public ResponseEntity<Result<List<AdminLog>>> exportAdminLogs(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        List<AdminLog> logs = adminService.exportAdminLogs(startTime, endTime);
        return ResponseEntity.ok(Result.success(logs));
    }

    // ========== 日志维护 ==========

    @DeleteMapping("/cleanup")
    @Operation(summary = "清理过期日志", description = "清理指定天数之前的过期日志")
    @LoggingAspect.OperationLog(operation = "清理过期日志", description = "管理员清理过期日志")
    public ResponseEntity<Result<Void>> cleanupOldLogs(
            @Parameter(description = "保留天数") @RequestParam(defaultValue = "30") int daysToKeep) {
        
        systemLogService.cleanupOldLogs(daysToKeep);
        return ResponseEntity.ok(Result.success());
    }

    // ========== 日志分析 ==========

    @GetMapping("/analysis/error-trends")
    @Operation(summary = "错误趋势分析", description = "分析指定时间范围内的错误日志趋势")
    @LoggingAspect.OperationLog(operation = "错误趋势分析", description = "管理员分析错误趋势")
    public ResponseEntity<Result<Map<String, Object>>> analyzeErrorTrends(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        // 简化实现，返回错误日志数量
        Long errorCount = systemLogService.getErrorLogCount(startTime, endTime);
        Map<String, Object> trends = Map.of(
            "errorCount", errorCount,
            "period", startTime + " ~ " + endTime
        );
        return ResponseEntity.ok(Result.success(trends));
    }

    @GetMapping("/analysis/user-activity")
    @Operation(summary = "用户活动分析", description = "分析指定用户在指定时间范围内的活动情况")
    @LoggingAspect.OperationLog(operation = "用户活动分析", description = "管理员分析用户活动")
    public ResponseEntity<Result<Map<String, Object>>> analyzeUserActivity(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        Long operationCount = systemLogService.getUserOperationCount(userId, startTime, endTime);
        Map<String, Object> activity = Map.of(
            "userId", userId,
            "operationCount", operationCount,
            "period", startTime + " ~ " + endTime
        );
        return ResponseEntity.ok(Result.success(activity));
    }

    @GetMapping("/analysis/security-events")
    @Operation(summary = "安全事件分析", description = "分析指定时间范围内的安全相关事件")
    @LoggingAspect.OperationLog(operation = "安全事件分析", description = "管理员分析安全事件")
    public ResponseEntity<Result<Map<String, Object>>> analyzeSecurityEvents(
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        Long securityLogCount = systemLogService.getSecurityLogCount(startTime, endTime);
        Map<String, Object> events = Map.of(
            "securityEventCount", securityLogCount,
            "period", startTime + " ~ " + endTime
        );
        return ResponseEntity.ok(Result.success(events));
    }
}