package com.example.educhain.aspect;

import com.example.educhain.annotation.RateLimit;
import com.example.educhain.enums.RateLimitType;
import com.example.educhain.exception.RateLimitException;
import com.example.educhain.util.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Objects;

/**
 * 限流切面
 * 拦截带有@RateLimit注解的方法进行限流
 */
@Aspect
@Component
@Order(1) // 优先级高于其他切面
public class RateLimitAspect {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitAspect.class);

    @Autowired
    private RateLimiter rateLimiter;

    @Around("@annotation(com.example.educhain.annotation.RateLimit) || @within(com.example.educhain.annotation.RateLimit)")
    public Object rateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        // 获取限流注解
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);
        if (rateLimit == null) {
            rateLimit = method.getDeclaringClass().getAnnotation(RateLimit.class);
        }

        if (rateLimit == null || !rateLimit.enabled()) {
            return joinPoint.proceed();
        }

        // 构建限流键
        String rateLimitKey = buildRateLimitKey(rateLimit, joinPoint);

        // 执行限流检查
        RateLimiter.RateLimitResult result;
        String algorithm = rateLimit.algorithm().toLowerCase();

        switch (algorithm) {
            case "token_bucket":
                // 令牌桶：容量=limit*2，补充速率=limit/timeWindow
                int capacity = rateLimit.limit() * 2;
                double refillRate = (double) rateLimit.limit() / rateLimit.timeWindow();
                result = rateLimiter.tokenBucket(rateLimitKey, capacity, 1, refillRate);
                break;
            case "fixed_window":
                // 固定窗口
                result = rateLimiter.fixedWindow(rateLimitKey, rateLimit.limit(), rateLimit.timeWindow());
                break;
            case "sliding_window":
            default:
                // 滑动窗口（默认）
                result = rateLimiter.slidingWindow(rateLimitKey, rateLimit.timeWindow(), rateLimit.limit());
                break;
        }

        if (!result.isAllowed()) {
            logger.warn("限流触发: key={}, remaining={}, retryAfter={}s", 
                rateLimitKey, result.getRemaining(), result.getRetryAfter());
            
            throw new RateLimitException(
                rateLimit.message() + "，请在 " + result.getRetryAfter() + " 秒后重试",
                result.getRetryAfter()
            );
        }

        // 记录限流日志（仅在剩余次数较少时记录）
        if (result.getRemaining() < rateLimit.limit() * 0.2) {
            logger.debug("限流检查: key={}, remaining={}, retryAfter={}s",
                rateLimitKey, result.getRemaining(), result.getRetryAfter());
        }

        return joinPoint.proceed();
    }

    /**
     * 构建限流键
     */
    private String buildRateLimitKey(RateLimit rateLimit, ProceedingJoinPoint joinPoint) {
        StringBuilder keyBuilder = new StringBuilder();
        keyBuilder.append("rate_limit:").append(rateLimit.key());

        ServletRequestAttributes attributes = 
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes == null) {
            return keyBuilder.append(":global").toString();
        }

        HttpServletRequest request = attributes.getRequest();
        RateLimitType type = rateLimit.type();

        switch (type) {
            case IP:
                keyBuilder.append(":ip:").append(getClientIpAddress(request));
                break;
            case USER:
                Long userId = getCurrentUserId();
                if (userId != null) {
                    keyBuilder.append(":user:").append(userId);
                } else {
                    keyBuilder.append(":ip:").append(getClientIpAddress(request));
                }
                break;
            case IP_AND_USER:
                keyBuilder.append(":ip:").append(getClientIpAddress(request));
                Long userId2 = getCurrentUserId();
                if (userId2 != null) {
                    keyBuilder.append(":user:").append(userId2);
                }
                break;
            case GLOBAL:
            default:
                keyBuilder.append(":global");
                break;
        }

        return keyBuilder.toString();
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 处理多级代理的情况
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip != null ? ip : "unknown";
    }

    /**
     * 获取当前用户ID
     */
    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof com.example.educhain.service.CustomUserDetailsService.CustomUserPrincipal) {
                    com.example.educhain.service.CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                        (com.example.educhain.service.CustomUserDetailsService.CustomUserPrincipal) principal;
                    return userPrincipal.getId();
                }
            }
        } catch (Exception e) {
            logger.debug("获取当前用户ID失败", e);
        }
        return null;
    }
}

