package com.example.educhain.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 限流配置属性类
 */
@Data
@Component
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    /**
     * 是否启用限流
     */
    private boolean enabled = true;

    /**
     * 默认算法
     */
    private String defaultAlgorithm = "sliding_window";

    /**
     * 默认限制次数
     */
    private int defaultLimit = 100;

    /**
     * 默认时间窗口（秒）
     */
    private int defaultWindow = 60;

    /**
     * 不同接口的限流配置
     */
    private Map<String, EndpointConfig> endpoints = new HashMap<>();

    @Data
    public static class EndpointConfig {
        private int limit = 100;
        private int window = 60;
        private String type = "IP";
        private String algorithm = "sliding_window";
    }
}

