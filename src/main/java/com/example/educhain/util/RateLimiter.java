package com.example.educhain.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * 限流工具类
 * 基于Redis实现分布式限流
 */
@Component
public class RateLimiter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimiter.class);

    private final RedisTemplate<String, Object> redisTemplate;

    // 滑动窗口限流脚本（Lua脚本保证原子性）
    private static final String SLIDING_WINDOW_SCRIPT = 
        "local key = KEYS[1]\n" +
        "local window = tonumber(ARGV[1])\n" +
        "local limit = tonumber(ARGV[2])\n" +
        "local now = tonumber(ARGV[3])\n" +
        "local expire = tonumber(ARGV[4])\n" +
        "\n" +
        "-- 移除窗口外的记录\n" +
        "redis.call('ZREMRANGEBYSCORE', key, 0, now - window * 1000)\n" +
        "\n" +
        "-- 获取当前窗口内的请求数\n" +
        "local current = redis.call('ZCARD', key)\n" +
        "\n" +
        "if current < limit then\n" +
        "    -- 添加当前请求\n" +
        "    redis.call('ZADD', key, now, now .. ':' .. math.random())\n" +
        "    redis.call('EXPIRE', key, expire)\n" +
        "    return {1, limit - current - 1, expire}\n" +
        "else\n" +
        "    -- 获取最早请求的时间\n" +
        "    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')\n" +
        "    local retryAfter = 0\n" +
        "    if #oldest > 0 then\n" +
        "        retryAfter = math.ceil((oldest[2] + window * 1000 - now) / 1000)\n" +
        "    end\n" +
        "    return {0, 0, retryAfter}\n" +
        "end";

    // 令牌桶限流脚本
    private static final String TOKEN_BUCKET_SCRIPT =
        "local key = KEYS[1]\n" +
        "local capacity = tonumber(ARGV[1])\n" +
        "local tokens = tonumber(ARGV[2])\n" +
        "local refillRate = tonumber(ARGV[3])\n" +
        "local now = tonumber(ARGV[4])\n" +
        "local expire = tonumber(ARGV[5])\n" +
        "\n" +
        "-- 获取当前桶状态\n" +
        "local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')\n" +
        "local currentTokens = tonumber(bucket[1] or capacity)\n" +
        "local lastRefill = tonumber(bucket[2] or now)\n" +
        "\n" +
        "-- 计算需要补充的令牌数\n" +
        "local elapsed = now - lastRefill\n" +
        "local tokensToAdd = math.floor(elapsed / 1000 * refillRate)\n" +
        "currentTokens = math.min(capacity, currentTokens + tokensToAdd)\n" +
        "\n" +
        "if currentTokens >= tokens then\n" +
        "    currentTokens = currentTokens - tokens\n" +
        "    redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', now)\n" +
        "    redis.call('EXPIRE', key, expire)\n" +
        "    return {1, currentTokens, expire}\n" +
        "else\n" +
        "    redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', now)\n" +
        "    redis.call('EXPIRE', key, expire)\n" +
        "    local retryAfter = math.ceil((tokens - currentTokens) / refillRate)\n" +
        "    return {0, currentTokens, retryAfter}\n" +
        "end";

    // 固定窗口限流脚本
    private static final String FIXED_WINDOW_SCRIPT =
        "local key = KEYS[1]\n" +
        "local limit = tonumber(ARGV[1])\n" +
        "local window = tonumber(ARGV[2])\n" +
        "\n" +
        "local current = redis.call('INCR', key)\n" +
        "if current == 1 then\n" +
        "    redis.call('EXPIRE', key, window)\n" +
        "end\n" +
        "\n" +
        "if current <= limit then\n" +
        "    return {1, limit - current, window}\n" +
        "else\n" +
        "    local ttl = redis.call('TTL', key)\n" +
        "    return {0, 0, ttl > 0 and ttl or window}\n" +
        "end";

    public RateLimiter(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 滑动窗口限流
     * 
     * @param key 限流键
     * @param window 时间窗口（秒）
     * @param limit 限制次数
     * @return 是否允许请求，剩余次数，重试等待时间（秒）
     */
    public RateLimitResult slidingWindow(String key, int window, int limit) {
        try {
            DefaultRedisScript<List> script = new DefaultRedisScript<>();
            script.setScriptText(SLIDING_WINDOW_SCRIPT);
            script.setResultType(List.class);

            long now = System.currentTimeMillis();
            int expire = window + 10; // 额外10秒缓冲

            @SuppressWarnings("unchecked")
            List<Number> result = redisTemplate.execute(script,
                Collections.singletonList(key),
                String.valueOf(window),
                String.valueOf(limit),
                String.valueOf(now),
                String.valueOf(expire));

            if (result != null && result.size() >= 3) {
                boolean allowed = result.get(0).longValue() == 1;
                long remaining = result.get(1).longValue();
                long retryAfter = result.get(2).longValue();
                return new RateLimitResult(allowed, remaining, retryAfter);
            }

            return new RateLimitResult(false, 0, window);
        } catch (Exception e) {
            logger.error("滑动窗口限流执行失败: key={}", key, e);
            // 限流失败时默认允许请求，避免影响业务
            return new RateLimitResult(true, limit, 0);
        }
    }

    /**
     * 令牌桶限流
     * 
     * @param key 限流键
     * @param capacity 桶容量
     * @param tokens 每次请求消耗的令牌数
     * @param refillRate 令牌补充速率（每秒）
     * @return 是否允许请求
     */
    public RateLimitResult tokenBucket(String key, int capacity, int tokens, double refillRate) {
        try {
            DefaultRedisScript<List> script = new DefaultRedisScript<>();
            script.setScriptText(TOKEN_BUCKET_SCRIPT);
            script.setResultType(List.class);

            long now = System.currentTimeMillis();
            int expire = (int) (capacity / refillRate) + 10;

            @SuppressWarnings("unchecked")
            List<Number> result = redisTemplate.execute(script,
                Collections.singletonList(key),
                String.valueOf(capacity),
                String.valueOf(tokens),
                String.valueOf(refillRate),
                String.valueOf(now),
                String.valueOf(expire));

            if (result != null && result.size() >= 3) {
                boolean allowed = result.get(0).longValue() == 1;
                long remaining = result.get(1).longValue();
                long retryAfter = result.get(2).longValue();
                return new RateLimitResult(allowed, remaining, retryAfter);
            }

            return new RateLimitResult(false, 0, 1);
        } catch (Exception e) {
            logger.error("令牌桶限流执行失败: key={}", key, e);
            return new RateLimitResult(true, capacity, 0);
        }
    }

    /**
     * 固定窗口限流
     * 
     * @param key 限流键
     * @param limit 限制次数
     * @param window 时间窗口（秒）
     * @return 是否允许请求
     */
    public RateLimitResult fixedWindow(String key, int limit, int window) {
        try {
            DefaultRedisScript<List> script = new DefaultRedisScript<>();
            script.setScriptText(FIXED_WINDOW_SCRIPT);
            script.setResultType(List.class);

            @SuppressWarnings("unchecked")
            List<Number> result = redisTemplate.execute(script,
                Collections.singletonList(key),
                String.valueOf(limit),
                String.valueOf(window));

            if (result != null && result.size() >= 3) {
                boolean allowed = result.get(0).longValue() == 1;
                long remaining = result.get(1).longValue();
                long retryAfter = result.get(2).longValue();
                return new RateLimitResult(allowed, remaining, retryAfter);
            }

            return new RateLimitResult(false, 0, window);
        } catch (Exception e) {
            logger.error("固定窗口限流执行失败: key={}", key, e);
            return new RateLimitResult(true, limit, 0);
        }
    }

    /**
     * 限流结果
     */
    public static class RateLimitResult {
        private final boolean allowed;
        private final long remaining;
        private final long retryAfter;

        public RateLimitResult(boolean allowed, long remaining, long retryAfter) {
            this.allowed = allowed;
            this.remaining = remaining;
            this.retryAfter = retryAfter;
        }

        public boolean isAllowed() {
            return allowed;
        }

        public long getRemaining() {
            return remaining;
        }

        public long getRetryAfter() {
            return retryAfter;
        }
    }
}

