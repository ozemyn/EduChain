package com.example.educhain.controller;

import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器 - 用于验证 API 和 Swagger 是否正常工作
 */
@RestController
@RequestMapping("/test")
@Tag(name = "系统测试", description = "系统状态测试接口")
public class TestController {

    @GetMapping("/ping")
    @Operation(summary = "系统心跳检测", description = "检查系统是否正常运行")
    public Result<Map<String, Object>> ping() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "ok");
        data.put("timestamp", LocalDateTime.now());
        data.put("message", "EduChain API 运行正常");
        return Result.success("系统运行正常", data);
    }

    @GetMapping("/swagger")
    @Operation(summary = "Swagger 测试", description = "测试 Swagger 文档是否正常")
    public Result<String> swaggerTest() {
        return Result.success("Swagger 文档正常工作！访问地址：http://localhost:8080/api/swagger-ui.html");
    }
}