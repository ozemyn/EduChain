package com.example.educhain.config;

import com.example.educhain.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security配置类
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 认证提供者
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * CORS配置
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * 安全过滤器链
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF
            .csrf(AbstractHttpConfigurer::disable)
            
            // 配置CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 配置会话管理
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 配置异常处理
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            
            // 配置请求授权
            .authorizeHttpRequests(authz -> authz
                // 公开接口 - 由于context-path是/api，这里的路径是相对于context-path的
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/test/**").permitAll()
                
                // 搜索和推荐接口允许匿名访问
                .requestMatchers("/search/**").permitAll()
                .requestMatchers("/recommendations/**").permitAll()
                
                // 分类和标签接口允许匿名访问（只读操作）
                .requestMatchers("/categories/**").permitAll()
                .requestMatchers("/tags/**").permitAll()
                
                // 知识内容的只读接口允许匿名访问
                .requestMatchers("/knowledge/*/view").permitAll()
                .requestMatchers("/knowledge/list").permitAll()
                .requestMatchers("/knowledge/popular").permitAll()
                
                // Swagger文档 - 完全开放访问
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-resources/**", "/webjars/**", "/configuration/**").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-config/**").permitAll()
                
                // Actuator健康检查
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                
                // 静态资源
                .requestMatchers("/favicon.ico", "/error").permitAll()
                
                // 管理员接口
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // 用户接口
                .requestMatchers("/users/**").hasAnyRole("LEARNER", "ADMIN")
                .requestMatchers("/knowledge/**").hasAnyRole("LEARNER", "ADMIN")
                .requestMatchers("/comments/**").hasAnyRole("LEARNER", "ADMIN")
                .requestMatchers("/interactions/**").hasAnyRole("LEARNER", "ADMIN")
                .requestMatchers("/notifications/**").hasAnyRole("LEARNER", "ADMIN")
                .requestMatchers("/follows/**").hasAnyRole("LEARNER", "ADMIN")
                
                // 其他所有请求都需要认证
                .anyRequest().authenticated()
            )
            
            // 配置认证提供者
            .authenticationProvider(authenticationProvider())
            
            // 添加JWT过滤器
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}