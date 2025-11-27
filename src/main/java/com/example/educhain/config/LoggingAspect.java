package com.example.educhain.config;

import com.example.educhain.service.SystemLogService;
import com.example.educhain.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 日志记录切面
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Autowired
    private SystemLogService systemLogService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 操作日志注解
     */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface OperationLog {
        String operation() default "";
        String description() default "";
        boolean recordParams() default false;
        boolean recordResult() default false;
    }

    /**
     * 环绕通知，记录操作日志
     */
    @Around("@annotation(operationLog)")
    public Object logOperation(ProceedingJoinPoint joinPoint, OperationLog operationLog) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 获取请求信息
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = getClientIpAddress(request);
        String userAgent = request != null ? request.getHeader("User-Agent") : null;
        String requestUrl = request != null ? request.getRequestURL().toString() : null;
        String requestMethod = request != null ? request.getMethod() : null;
        
        // 获取用户信息
        Long userId = null;
        String username = null;
        try {
            String token = extractTokenFromRequest(request);
            if (token != null && jwtUtil.validateTokenFormat(token)) {
                username = jwtUtil.getUsernameFromToken(token);
                // 这里可以根据需要获取用户ID
            }
        } catch (Exception e) {
            logger.debug("获取用户信息失败: {}", e.getMessage());
        }

        String operation = operationLog.operation();
        if (operation.isEmpty()) {
            operation = joinPoint.getSignature().getName();
        }

        String description = operationLog.description();
        if (description.isEmpty()) {
            description = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        }

        Object result = null;
        Integer responseStatus = 200;
        
        try {
            // 执行目标方法
            result = joinPoint.proceed();
            
            // 记录参数（如果需要）
            if (operationLog.recordParams()) {
                Object[] args = joinPoint.getArgs();
                if (args != null && args.length > 0) {
                    try {
                        String params = objectMapper.writeValueAsString(args);
                        description += " | 参数: " + params;
                    } catch (Exception e) {
                        logger.debug("序列化参数失败: {}", e.getMessage());
                    }
                }
            }

            // 记录结果（如果需要）
            if (operationLog.recordResult() && result != null) {
                try {
                    String resultStr = objectMapper.writeValueAsString(result);
                    description += " | 结果: " + resultStr;
                } catch (Exception e) {
                    logger.debug("序列化结果失败: {}", e.getMessage());
                }
            }

        } catch (Exception e) {
            responseStatus = 500;
            description += " | 异常: " + e.getMessage();
            
            // 记录错误日志
            systemLogService.logError(operation, description, e.toString(), 
                                    ipAddress, requestUrl, requestMethod);
            throw e;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 记录操作日志
            systemLogService.logOperation(userId, username, operation, description,
                                        ipAddress, userAgent, requestUrl, requestMethod,
                                        responseStatus, executionTime);
        }

        return result;
    }

    /**
     * 获取当前请求
     */
    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attributes != null ? attributes.getRequest() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * 从请求中提取JWT令牌
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}