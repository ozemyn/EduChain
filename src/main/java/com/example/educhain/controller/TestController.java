package com.example.educhain.controller;

import com.example.educhain.exception.DatabaseException;
import com.example.educhain.exception.RecommendationException;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

/** 测试控制器 - 用于测试错误处理机制 */
@RestController
@RequestMapping("/test")
@Tag(name = "测试接口", description = "用于测试各种错误处理机制")
public class TestController {

  @GetMapping("/recommendation-error/{type}")
  @Operation(summary = "测试推荐系统错误", description = "测试不同类型的推荐系统错误")
  public Result<String> testRecommendationError(@PathVariable String type) {
    switch (type) {
      case "user-not-found":
        throw RecommendationException.userNotFound(999L);
      case "insufficient-data":
        throw RecommendationException.insufficientData("用户行为数据");
      case "algorithm-error":
        throw RecommendationException.algorithmError("协同过滤", new RuntimeException("算法计算异常"));
      case "invalid-params":
        throw RecommendationException.invalidParameters("limit", -1);
      case "content-not-found":
        throw RecommendationException.contentNotFound(999L);
      default:
        return Result.success("测试成功");
    }
  }

  @GetMapping("/database-error/{type}")
  @Operation(summary = "测试数据库错误", description = "测试不同类型的数据库错误")
  public Result<String> testDatabaseError(@PathVariable String type) {
    switch (type) {
      case "connection-failed":
        throw DatabaseException.connectionFailed(new RuntimeException("连接超时"));
      case "query-failed":
        throw DatabaseException.queryFailed("SELECT * FROM test", new RuntimeException("语法错误"));
      case "transaction-failed":
        throw DatabaseException.transactionFailed("用户注册", new RuntimeException("事务回滚"));
      case "duplicate-key":
        throw DatabaseException.duplicateKey("username", "testuser");
      case "foreign-key":
        throw DatabaseException.foreignKeyViolation(
            "user_stats", "user_id", new RuntimeException("外键约束"));
      default:
        return Result.success("测试成功");
    }
  }

  @GetMapping("/runtime-error/{type}")
  @Operation(summary = "测试运行时错误", description = "测试不同类型的运行时错误")
  public Result<String> testRuntimeError(@PathVariable String type) {
    switch (type) {
      case "null-pointer":
        String nullStr = null;
        return Result.success(nullStr.length() + "");
      case "illegal-state":
        throw new IllegalStateException("系统状态异常");
      case "class-cast":
        Object obj = "string";
        Integer num = (Integer) obj;
        return Result.success(num.toString());
      default:
        return Result.success("测试成功");
    }
  }

  @PostMapping("/sql-error")
  @Operation(summary = "测试SQL错误", description = "模拟SQL错误")
  public Result<String> testSqlError() {
    // 这里可以通过JPA执行一个会导致SQL错误的操作
    // 比如查询不存在的表或字段
    throw new RuntimeException("模拟SQL错误: Unknown column 'test_field' in 'field list'");
  }
}
