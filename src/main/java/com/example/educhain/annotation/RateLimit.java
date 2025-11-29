package com.example.educhain.annotation;

import com.example.educhain.enums.RateLimitType;

import java.lang.annotation.*;

/**
 * 限流注解
 * 用于标记需要限流的方法
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /**
     * 限流键前缀
     */
    String key() default "rate_limit";

    /**
     * 时间窗口（秒）
     */
    int timeWindow() default 60;

    /**
     * 限制次数（在时间窗口内的最大请求数）
     */
    int limit() default 100;

    /**
     * 限流类型
     */
    RateLimitType type() default RateLimitType.IP;

    /**
     * 限流算法
     */
    String algorithm() default "sliding_window";

    /**
     * 超出限制时的错误信息
     */
    String message() default "请求过于频繁，请稍后再试";

    /**
     * 是否启用限流
     */
    boolean enabled() default true;
}

