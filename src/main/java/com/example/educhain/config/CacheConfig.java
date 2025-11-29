package com.example.educhain.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 缓存配置类
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * 配置缓存管理器
     * 使用内存缓存（ConcurrentMapCacheManager）
     * 生产环境建议使用Redis缓存
     */
    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        
        // 定义缓存名称
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "categories",      // 分类缓存
            "categoryTree",    // 分类树缓存
            "tags",            // 标签缓存
            "userStats",       // 用户统计缓存
            "knowledgeStats"   // 知识统计缓存
        ));
        
        // 允许动态创建缓存
        cacheManager.setAllowNullValues(false);
        
        return cacheManager;
    }
}

