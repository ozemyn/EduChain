package com.example.educhain.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** 限流配置类 */
@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

  @Autowired private RedisTemplate<String, Object> redisTemplate;

  // 如果需要全局拦截器，可以在这里添加
  // 目前使用AOP方式，更灵活
}
