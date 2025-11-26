-- ========================================
-- 教育知识共享平台数据库结构 (精简版 - 20张表)
-- EduChain Database Schema
-- 创建时间: 2025-11-26
-- 版本: 2.0 (精简版)
-- ========================================

-- 删除原有数据库(如果存在)
DROP DATABASE IF EXISTS educhain_db;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS educhain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educhain_db;

-- ========================================
-- 1. 用户核心表 (合并用户信息)
-- ========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    role ENUM('ADMIN', 'LEARNER') DEFAULT 'LEARNER' COMMENT '用户角色',
    full_name VARCHAR(100) COMMENT '真实姓名',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    school VARCHAR(200) COMMENT '学校信息',
    level INT DEFAULT 1 COMMENT '用户等级',
    bio TEXT COMMENT '个人简介',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ========================================
-- 2. 知识条目核心表 (合并多媒体信息)
-- ========================================
CREATE TABLE knowledge_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容描述',
    type ENUM('TEXT', 'IMAGE', 'LINK', 'PDF', 'VIDEO', 'MIXED') DEFAULT 'TEXT' COMMENT '类型',
    media_urls JSON COMMENT '多媒体URL集合(JSON格式)',
    link_url VARCHAR(1000) COMMENT '外部链接',
    uploader_id BIGINT NOT NULL COMMENT '上传者ID',
    category_id BIGINT COMMENT '分类ID',
    tags VARCHAR(500) COMMENT '标签(逗号分隔)',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-删除, 2-审核中',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_uploader (uploader_id),
    INDEX idx_category (category_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT KEY ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识条目表';

-- ========================================
-- 3. 分类表
-- ========================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    parent_id BIGINT COMMENT '父分类ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- ========================================
-- 4. 评论表
-- ========================================
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    parent_id BIGINT COMMENT '父评论ID',
    content TEXT NOT NULL COMMENT '评论内容',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ========================================
-- 5. 用户互动表 (合并点赞、收藏、浏览)
-- ========================================
CREATE TABLE user_interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    user_id BIGINT COMMENT '用户ID(可为空)',
    interaction_type ENUM('LIKE', 'FAVORITE', 'VIEW') NOT NULL COMMENT '互动类型',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_like_favorite (knowledge_id, user_id, interaction_type),
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (interaction_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户互动表';

-- ========================================
-- 6. 知识统计表 (合并各种统计)
-- ========================================
CREATE TABLE knowledge_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    views_count INT DEFAULT 0 COMMENT '浏览次数',
    likes_count INT DEFAULT 0 COMMENT '点赞次数',
    favorites_count INT DEFAULT 0 COMMENT '收藏次数',
    comments_count INT DEFAULT 0 COMMENT '评论次数',
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT '综合评分',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    UNIQUE KEY uk_knowledge_id (knowledge_id),
    INDEX idx_views_count (views_count),
    INDEX idx_likes_count (likes_count),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识统计表';

-- ========================================
-- 7. 用户统计表
-- ========================================
CREATE TABLE user_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    upload_count INT DEFAULT 0 COMMENT '上传数量',
    likes_received INT DEFAULT 0 COMMENT '获得点赞数',
    comments_received INT DEFAULT 0 COMMENT '获得评论数',
    active_score INT DEFAULT 0 COMMENT '活跃度分数',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id),
    INDEX idx_active_score (active_score),
    INDEX idx_upload_count (upload_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户统计表';

-- ========================================
-- 8. 搜索索引表
-- ========================================
CREATE TABLE search_index (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    title VARCHAR(500) NOT NULL COMMENT '标题',
    content_snippet TEXT COMMENT '内容摘要',
    tags VARCHAR(1000) COMMENT '标签集合',
    category_name VARCHAR(100) COMMENT '分类名称',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    UNIQUE KEY uk_knowledge_id (knowledge_id),
    FULLTEXT KEY ft_search (title, content_snippet, tags),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索索引表';

-- ========================================
-- 9. 热门关键词表
-- ========================================
CREATE TABLE hot_keywords (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(200) NOT NULL COMMENT '关键词',
    search_count INT DEFAULT 1 COMMENT '搜索次数',
    last_searched_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后搜索时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    UNIQUE KEY uk_keyword (keyword),
    INDEX idx_search_count (search_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门关键词表';

-- ========================================
-- 10. 系统设置表
-- ========================================
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    setting_value TEXT COMMENT '配置值',
    description VARCHAR(500) COMMENT '配置描述',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- ========================================
-- 11. 通知表
-- ========================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('LIKE', 'COMMENT', 'FOLLOW', 'SYSTEM') NOT NULL COMMENT '通知类型',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    related_id BIGINT COMMENT '关联ID(知识条目ID等)',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-未读, 1-已读',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- ========================================
-- 12. 管理员日志表
-- ========================================
CREATE TABLE admin_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL COMMENT '管理员ID',
    target_type ENUM('KNOWLEDGE', 'USER', 'COMMENT') NOT NULL COMMENT '操作对象类型',
    target_id BIGINT COMMENT '操作对象ID',
    action ENUM('APPROVE', 'REJECT', 'DELETE', 'EDIT', 'RESTORE', 'BAN') NOT NULL COMMENT '操作类型',
    reason TEXT COMMENT '操作原因',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_target_type (target_type),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员日志表';

-- ========================================
-- 13. 版本历史表
-- ========================================
CREATE TABLE knowledge_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    version_number INT NOT NULL COMMENT '版本号',
    title VARCHAR(500) COMMENT '历史标题',
    content_snapshot TEXT COMMENT '内容快照',
    editor_id BIGINT NOT NULL COMMENT '编辑者ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_version (version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='版本历史表';

-- ========================================
-- 14. 用户关注表
-- ========================================
CREATE TABLE user_follows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id BIGINT NOT NULL COMMENT '关注者ID',
    following_id BIGINT NOT NULL COMMENT '被关注者ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_follow (follower_id, following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';

-- ========================================
-- 15. 标签表
-- ========================================
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '标签名称',
    description VARCHAR(500) COMMENT '标签描述',
    usage_count INT DEFAULT 0 COMMENT '使用次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    INDEX idx_name (name),
    INDEX idx_usage_count (usage_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ========================================
-- 16. 文件管理表
-- ========================================
CREATE TABLE file_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT COMMENT '关联知识条目ID',
    uploader_id BIGINT NOT NULL COMMENT '上传者ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_path VARCHAR(1000) NOT NULL COMMENT '文件路径',
    file_type VARCHAR(50) NOT NULL COMMENT '文件类型',
    file_size BIGINT NOT NULL COMMENT '文件大小',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE SET NULL,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件管理表';

-- ========================================
-- 17. 外部数据源表
-- ========================================
CREATE TABLE external_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL COMMENT '数据源名称',
    domain VARCHAR(200) NOT NULL UNIQUE COMMENT '域名',
    api_endpoint VARCHAR(500) COMMENT 'API端点',
    crawl_frequency INT DEFAULT 24 COMMENT '抓取频率(小时)',
    last_crawl_at DATETIME COMMENT '最后抓取时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    INDEX idx_domain (domain),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外部数据源表';

-- ========================================
-- 18. 外部内容索引表
-- ========================================
CREATE TABLE external_content (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id BIGINT NOT NULL COMMENT '数据源ID',
    title VARCHAR(500) NOT NULL COMMENT '标题',
    summary TEXT COMMENT '摘要',
    url VARCHAR(1000) NOT NULL COMMENT '原始URL',
    content_hash VARCHAR(64) COMMENT '内容哈希',
    tags VARCHAR(500) COMMENT '标签',
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '抓取时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-删除',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (source_id) REFERENCES external_sources(id) ON DELETE CASCADE,
    INDEX idx_source_id (source_id),
    INDEX idx_content_hash (content_hash),
    INDEX idx_fetched_at (fetched_at),
    FULLTEXT KEY ft_title_summary (title, summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外部内容表';

-- ========================================
-- 19. 用户成就表
-- ========================================
CREATE TABLE user_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    achievement_type VARCHAR(50) NOT NULL COMMENT '成就类型',
    achievement_name VARCHAR(100) NOT NULL COMMENT '成就名称',
    description VARCHAR(500) COMMENT '成就描述',
    points INT DEFAULT 0 COMMENT '成就积分',
    awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (achievement_type),
    INDEX idx_awarded_at (awarded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户成就表';

-- ========================================
-- 20. 系统日志表
-- ========================================
CREATE TABLE system_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_level ENUM('INFO', 'WARN', 'ERROR', 'DEBUG') DEFAULT 'INFO' COMMENT '日志级别',
    module VARCHAR(50) NOT NULL COMMENT '模块名称',
    action VARCHAR(100) NOT NULL COMMENT '操作名称',
    user_id BIGINT COMMENT '用户ID',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    request_data JSON COMMENT '请求数据',
    response_data JSON COMMENT '响应数据',
    execution_time INT COMMENT '执行时间(毫秒)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    reserved_field_1 VARCHAR(255) DEFAULT NULL COMMENT '预留字段1',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_log_level (log_level),
    INDEX idx_module (module),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';

-- ========================================
-- 初始化数据
-- ========================================

-- 插入默认系统设置
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'EduChain 教育知识共享平台', '网站名称'),
('max_upload_size', '10485760', '最大上传文件大小(字节)'),
('enable_registration', '1', '是否开放注册'),
('default_user_level', '1', '新用户默认等级'),
('points_per_upload', '10', '每次上传获得积分'),
('points_per_like', '2', '每次点赞获得积分');

-- 插入默认分类
INSERT INTO categories (name, description, sort_order) VALUES
('计算机科学', '计算机相关知识', 1),
('数学', '数学相关知识', 2),
('物理', '物理相关知识', 3),
('化学', '化学相关知识', 4),
('生物', '生物相关知识', 5),
('其他', '其他类别知识', 99);

-- 插入默认标签
INSERT INTO tags (name, description) VALUES
('编程', '编程相关内容'),
('算法', '算法相关内容'),
('数据结构', '数据结构相关内容'),
('机器学习', '机器学习相关内容'),
('人工智能', '人工智能相关内容');

-- ========================================
-- 创建触发器
-- ========================================

DELIMITER $$

-- 用户互动统计触发器
CREATE TRIGGER tr_interaction_stats AFTER INSERT ON user_interactions
FOR EACH ROW
BEGIN
    IF NEW.interaction_type = 'LIKE' THEN
        INSERT INTO knowledge_stats (knowledge_id, likes_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE likes_count = likes_count + 1;
    ELSEIF NEW.interaction_type = 'FAVORITE' THEN
        INSERT INTO knowledge_stats (knowledge_id, favorites_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE favorites_count = favorites_count + 1;
    ELSEIF NEW.interaction_type = 'VIEW' THEN
        INSERT INTO knowledge_stats (knowledge_id, views_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE views_count = views_count + 1;
    END IF;
END$$

-- 评论统计触发器
CREATE TRIGGER tr_comment_stats AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    INSERT INTO knowledge_stats (knowledge_id, comments_count) 
    VALUES (NEW.knowledge_id, 1)
    ON DUPLICATE KEY UPDATE comments_count = comments_count + 1;
END$$

DELIMITER ;

-- ========================================
-- 创建性能优化索引
-- ========================================

-- 复合索引
CREATE INDEX idx_knowledge_status_created ON knowledge_items(status, created_at DESC);
CREATE INDEX idx_interactions_knowledge_type ON user_interactions(knowledge_id, interaction_type);
CREATE INDEX idx_comments_knowledge_created ON comments(knowledge_id, created_at DESC);

-- ========================================
-- 数据库结构创建完成 (共20张表)
-- ========================================