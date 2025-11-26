package com.example.educhain.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA审计配置
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}