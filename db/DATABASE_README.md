# EduChain 教育知识共享平台数据库设计文档 (精简版)

## 📋 概述

EduChain 精简版数据库设计，严格控制在 **20张表** 以内，通过合并相关功能实现完整的教育知识共享平台功能。

### 核心特性
- **表数限制**: 严格控制在20张表
- **功能完整**: 涵盖用户管理、知识分享、互动统计等核心功能
- **性能优化**: 合理的索引设计和统计表
- **扩展性**: 每张表包含预留字段

## 🏗️ 数据库架构 (20张表)

```
EduChain Database (20 Tables)
├── 1.  users                    (用户信息 - 合并核心+扩展)
├── 2.  knowledge_items          (知识条目 - 合并多媒体)
├── 3.  categories               (分类管理)
├── 4.  comments                 (评论系统)
├── 5.  user_interactions        (用户互动 - 合并点赞/收藏/浏览)
├── 6.  knowledge_stats          (知识统计)
├── 7.  user_stats               (用户统计)
├── 8.  search_index             (搜索索引)
├── 9.  hot_keywords             (热门关键词)
├── 10. system_settings          (系统设置)
├── 11. notifications            (通知系统)
├── 12. admin_logs               (管理员日志)
├── 13. knowledge_versions       (版本历史)
├── 14. user_follows             (用户关注)
├── 15. tags                     (标签管理)
├── 16. file_uploads             (文件管理)
├── 17. external_sources         (外部数据源)
├── 18. external_content         (外部内容)
├── 19. user_achievements        (用户成就)
└── 20. system_logs              (系统日志)
```

## 📖 表结构详细说明

### 1. users - 用户信息表 (合并设计)
**合并内容**: 原 users + user_profiles
```sql
-- 核心字段 + 扩展字段合并
username, password_hash, email, role    -- 核心登录信息
full_name, avatar_url, school, level, bio  -- 扩展个人信息
```

### 2. knowledge_items - 知识条目表 (合并设计)
**合并内容**: 原 knowledge_items + knowledge_images + knowledge_files + knowledge_videos
```sql
-- 使用JSON字段存储多媒体URL
media_urls JSON  -- 存储图片、文件、视频URL集合
tags VARCHAR(500)  -- 直接存储标签(逗号分隔)
```

### 3. categories - 分类表
```sql
-- 支持层级分类
parent_id BIGINT  -- 父分类ID，支持多级分类
```

### 4. comments - 评论表
```sql
-- 支持多级评论
parent_id BIGINT  -- 父评论ID
```

### 5. user_interactions - 用户互动表 (合并设计)
**合并内容**: 原 likes + favorites + views
```sql
interaction_type ENUM('LIKE', 'FAVORITE', 'VIEW')  -- 统一互动类型
-- 点赞和收藏有唯一约束，浏览记录允许重复
```

### 6. knowledge_stats - 知识统计表
```sql
-- 实时统计避免COUNT查询
views_count, likes_count, favorites_count, comments_count
score DECIMAL(5,2)  -- 综合评分
```

### 7. user_stats - 用户统计表
```sql
-- 用户活跃度统计
upload_count, likes_received, active_score
```

### 8. search_index - 搜索索引表
```sql
-- 全文搜索优化
FULLTEXT KEY ft_search (title, content_snippet, tags)
```

### 9. hot_keywords - 热门关键词表
```sql
-- 搜索热词统计
keyword, search_count, last_searched_at
```

### 10. system_settings - 系统设置表
```sql
-- 键值对配置
setting_key, setting_value, description
```

### 11. notifications - 通知表
```sql
-- 用户消息通知
type ENUM('LIKE', 'COMMENT', 'FOLLOW', 'SYSTEM')
```

### 12. admin_logs - 管理员日志表
```sql
-- 管理操作记录
target_type ENUM('KNOWLEDGE', 'USER', 'COMMENT')
action ENUM('APPROVE', 'REJECT', 'DELETE', 'EDIT', 'RESTORE', 'BAN')
```

### 13. knowledge_versions - 版本历史表
```sql
-- 内容版本管理
version_number, content_snapshot
```

### 14. user_follows - 用户关注表
```sql
-- 用户关注关系
follower_id, following_id
```

### 15. tags - 标签表
```sql
-- 标签管理和统计
name, usage_count
```

### 16. file_uploads - 文件管理表
```sql
-- 统一文件管理
file_name, file_path, file_type, file_size, mime_type
```

### 17. external_sources - 外部数据源表
```sql
-- 外部内容抓取配置
domain, api_endpoint, crawl_frequency
```

### 18. external_content - 外部内容表
```sql
-- 外部抓取内容索引
title, summary, url, content_hash
```

### 19. user_achievements - 用户成就表
```sql
-- 用户成就系统
achievement_type, achievement_name, points
```

### 20. system_logs - 系统日志表
```sql
-- 系统操作日志
log_level, module, action, request_data, response_data
```

## 🚀 核心优化策略

### 1. 表合并策略
- **用户信息合并**: users + user_profiles → users
- **多媒体合并**: 多个附件表 → knowledge_items.media_urls (JSON)
- **互动合并**: likes + favorites + views → user_interactions
- **标签简化**: 直接在knowledge_items中存储标签字符串

### 2. JSON字段应用
```sql
-- 多媒体URL存储示例
media_urls JSON
-- 存储格式: {"images":["url1","url2"], "videos":["url3"], "files":["url4"]}

-- 系统日志数据存储
request_data JSON, response_data JSON
```

### 3. 性能优化
```sql
-- 关键复合索引
CREATE INDEX idx_knowledge_status_created ON knowledge_items(status, created_at DESC);
CREATE INDEX idx_interactions_knowledge_type ON user_interactions(knowledge_id, interaction_type);

-- 全文搜索索引
FULLTEXT KEY ft_search (title, content_snippet, tags);
```

### 4. 触发器自动化
```sql
-- 自动更新统计数据
CREATE TRIGGER tr_interaction_stats AFTER INSERT ON user_interactions
-- 自动更新评论统计
CREATE TRIGGER tr_comment_stats AFTER INSERT ON comments
```

## 📦 部署指南

### 1. 快速部署
```bash
# 执行SQL脚本
mysql -u root -p < src/main/resources/db/database_schema.sql
```

### 2. Spring Boot配置
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/educhain_db?useUnicode=true&characterEncoding=utf8mb4
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
```

### 3. JSON字段使用示例
```java
// 多媒体URL存储
@Column(columnDefinition = "JSON")
private String mediaUrls;

// 使用Jackson处理JSON
ObjectMapper mapper = new ObjectMapper();
Map<String, List<String>> media = mapper.readValue(mediaUrls, Map.class);
```

## 🔧 维护建议

### 1. 预留字段使用
每张表的 `reserved_field_1` 可用于：
```sql
-- 示例：为用户添加积分字段
ALTER TABLE users CHANGE reserved_field_1 points INT DEFAULT 0 COMMENT '用户积分';

-- 示例：为知识条目添加难度等级
ALTER TABLE knowledge_items CHANGE reserved_field_1 difficulty TINYINT DEFAULT 1 COMMENT '难度等级';
```

### 2. 数据清理策略
- 定期清理过期日志 (system_logs)
- 归档历史版本 (knowledge_versions)
- 清理无效外部内容 (external_content)

### 3. 扩展建议
- 大数据量时考虑分表 (按时间或用户ID)
- 引入Redis缓存热点数据
- 使用Elasticsearch增强搜索功能

## 📊 表数量确认

✅ **严格控制在20张表以内**

| 序号 | 表名 | 功能 | 合并说明 |
|------|------|------|----------|
| 1 | users | 用户信息 | 合并核心+扩展信息 |
| 2 | knowledge_items | 知识条目 | 合并多媒体附件 |
| 3 | categories | 分类管理 | - |
| 4 | comments | 评论系统 | - |
| 5 | user_interactions | 用户互动 | 合并点赞/收藏/浏览 |
| 6 | knowledge_stats | 知识统计 | - |
| 7 | user_stats | 用户统计 | - |
| 8 | search_index | 搜索索引 | - |
| 9 | hot_keywords | 热门关键词 | - |
| 10 | system_settings | 系统设置 | - |
| 11 | notifications | 通知系统 | - |
| 12 | admin_logs | 管理员日志 | - |
| 13 | knowledge_versions | 版本历史 | - |
| 14 | user_follows | 用户关注 | - |
| 15 | tags | 标签管理 | - |
| 16 | file_uploads | 文件管理 | - |
| 17 | external_sources | 外部数据源 | - |
| 18 | external_content | 外部内容 | - |
| 19 | user_achievements | 用户成就 | - |
| 20 | system_logs | 系统日志 | - |

**总计: 20张表** ✅

---

**版本**: 2.0 (精简版)  
**更新时间**: 2025-11-26  
**维护者**: EduChain开发团队