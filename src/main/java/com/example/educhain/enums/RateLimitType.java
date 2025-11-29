package com.example.educhain.enums;

/**
 * 限流类型枚举
 */
public enum RateLimitType {
    /**
     * IP限流
     */
    IP,
    
    /**
     * 用户限流
     */
    USER,
    
    /**
     * 全局限流
     */
    GLOBAL,
    
    /**
     * IP+用户组合限流
     */
    IP_AND_USER
}

