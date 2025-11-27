package com.example.educhain.config;

import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT认证过滤器
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        logger.debug("Processing request: " + path);
        
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && jwtUtil.validateTokenFormat(jwt) && !isTokenBlacklisted(jwt)) {
                String username = jwtUtil.getUsernameFromToken(jwt);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    if (jwtUtil.validateToken(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求中获取JWT token
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 检查请求是否需要跳过JWT验证
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        
        logger.debug("Checking shouldNotFilter for path: " + path + ", contextPath: " + contextPath);
        
        // 移除上下文路径，获取实际的servlet路径
        String servletPath = path;
        if (contextPath != null && !contextPath.isEmpty() && path.startsWith(contextPath)) {
            servletPath = path.substring(contextPath.length());
        }
        
        logger.debug("Servlet path after context removal: " + servletPath);
        
        // 跳过认证的路径
        boolean shouldSkip = servletPath.startsWith("/auth/") ||
               servletPath.startsWith("/public/") ||
               servletPath.startsWith("/swagger-ui/") ||
               servletPath.startsWith("/v3/api-docs/") ||
               servletPath.startsWith("/swagger-resources/") ||
               servletPath.startsWith("/webjars/") ||
               servletPath.equals("/favicon.ico") ||
               servletPath.equals("/error");
        
        logger.debug("Should skip filter: " + shouldSkip);
        return shouldSkip;
    }

    /**
     * 检查token是否在黑名单中
     */
    private boolean isTokenBlacklisted(String token) {
        try {
            return redisTemplate.hasKey("blacklist:token:" + token);
        } catch (Exception e) {
            // Redis连接失败时，为了安全起见，不阻止token验证
            logger.warn("Redis blacklist check failed: " + e.getMessage());
            return false;
        }
    }
}