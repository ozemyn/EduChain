-- ========================================
-- 基于区块链存证的教育知识共享与智能检索系统数据库结构 (完全匹配实体类版本)
-- EduChain Database Schema
-- 创建时间: 2025-11-28
-- 版本: 3.0 (完全匹配实体类)
-- ========================================

-- 删除原有数据库(如果存在)
DROP DATABASE IF EXISTS educhain_db;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS educhain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educhain_db;

-- ========================================
-- 1. 用户表 (User)
-- ========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    role ENUM('LEARNER', 'ADMIN') NOT NULL DEFAULT 'LEARNER' COMMENT '用户角色',
    full_name VARCHAR(100) COMMENT '真实姓名',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    school VARCHAR(100) COMMENT '学校信息',
    level INT NOT NULL DEFAULT 1 COMMENT '用户等级',
    bio TEXT COMMENT '个人简介',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ========================================
-- 2. 分类表 (Category) - 必须在 knowledge_items 之前创建
-- ========================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    parent_id BIGINT COMMENT '父分类ID',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- ========================================
-- 3. 知识条目表 (KnowledgeItem) - 依赖 users 和 categories
-- ========================================
CREATE TABLE knowledge_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    share_code VARCHAR(32) NOT NULL UNIQUE COMMENT '分享码(Base58编码)',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content LONGTEXT COMMENT '内容',
    type ENUM('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK', 'MIXED') NOT NULL DEFAULT 'TEXT' COMMENT '内容类型',
    media_urls JSON COMMENT '多媒体URL集合(JSON格式)',
    link_url VARCHAR(500) COMMENT '外部链接',
    uploader_id BIGINT NOT NULL COMMENT '上传者ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    tags VARCHAR(500) COMMENT '标签(逗号分隔)',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-删除, 2-草稿',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_share_code (share_code),
    INDEX idx_title (title),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_category_id (category_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_tags (tags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识条目表';

-- ========================================
-- 4. 标签表 (Tag)
-- ========================================
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    description VARCHAR(200) COMMENT '标签描述',
    usage_count BIGINT NOT NULL DEFAULT 0 COMMENT '使用次数',
    category VARCHAR(50) COMMENT '标签分类',
    color VARCHAR(20) COMMENT '标签颜色',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
    creator_id BIGINT COMMENT '创建者ID',
    last_used_at DATETIME COMMENT '最后使用时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_usage_count (usage_count),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ========================================
-- 5. 评论表 (Comment)
-- ========================================
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    parent_id BIGINT COMMENT '父评论ID',
    content TEXT NOT NULL COMMENT '评论内容',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-删除, 2-待审核',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ========================================
-- 6. 用户互动表 (UserInteraction)
-- ========================================
CREATE TABLE user_interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    interaction_type ENUM('LIKE', 'FAVORITE', 'VIEW') NOT NULL COMMENT '互动类型',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_knowledge_interaction (user_id, knowledge_id, interaction_type),
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_user_id (user_id),
    INDEX idx_interaction_type (interaction_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户互动表';

-- ========================================
-- 7. 用户关注表 (UserFollow)
-- ========================================
CREATE TABLE user_follows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id BIGINT NOT NULL COMMENT '关注者ID',
    following_id BIGINT NOT NULL COMMENT '被关注者ID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_follower_following (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';

-- ========================================
-- 8. 通知表 (Notification)
-- ========================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('LIKE', 'COMMENT', 'REPLY', 'FOLLOW', 'SYSTEM') NOT NULL COMMENT '通知类型',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT NOT NULL COMMENT '通知内容',
    related_id BIGINT COMMENT '关联ID(知识内容ID等)',
    related_user_id BIGINT COMMENT '相关的用户ID',
    is_read TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读: 0-未读, 1-已读',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- ========================================
-- 9. 知识版本历史表 (KnowledgeVersion)
-- ========================================
CREATE TABLE knowledge_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL COMMENT '知识条目ID',
    version_number INT NOT NULL COMMENT '版本号',
    title VARCHAR(200) NOT NULL COMMENT '历史标题',
    content LONGTEXT COMMENT '内容快照',
    type ENUM('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK', 'MIXED') NOT NULL COMMENT '内容类型',
    media_urls JSON COMMENT '多媒体URL集合(JSON格式)',
    link_url VARCHAR(500) COMMENT '外部链接',
    tags VARCHAR(500) COMMENT '标签',
    editor_id BIGINT NOT NULL COMMENT '编辑者ID',
    change_summary VARCHAR(500) COMMENT '变更摘要',
    change_type ENUM('CREATE', 'UPDATE', 'DELETE', 'RESTORE') NOT NULL DEFAULT 'UPDATE' COMMENT '变更类型',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_version_number (version_number),
    INDEX idx_created_at (created_at),
    INDEX idx_editor_id (editor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='版本历史表';

-- ========================================
-- 10. 知识统计表 (KnowledgeStats)
-- ========================================
CREATE TABLE knowledge_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL UNIQUE COMMENT '知识条目ID',
    view_count BIGINT NOT NULL DEFAULT 0 COMMENT '浏览次数',
    like_count BIGINT NOT NULL DEFAULT 0 COMMENT '点赞次数',
    favorite_count BIGINT NOT NULL DEFAULT 0 COMMENT '收藏次数',
    comment_count BIGINT NOT NULL DEFAULT 0 COMMENT '评论次数',
    share_count BIGINT NOT NULL DEFAULT 0 COMMENT '分享次数',
    quality_score DOUBLE DEFAULT 0.0 COMMENT '质量评分',
    last_view_at DATETIME COMMENT '最后浏览时间',
    last_interaction_at DATETIME COMMENT '最后互动时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    INDEX idx_favorite_count (favorite_count),
    INDEX idx_comment_count (comment_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识统计表';

-- ========================================
-- 11. 用户统计表 (UserStats)
-- ========================================
CREATE TABLE user_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE COMMENT '用户ID',
    knowledge_count INT NOT NULL DEFAULT 0 COMMENT '知识内容数量',
    like_count INT NOT NULL DEFAULT 0 COMMENT '点赞数量',
    favorite_count INT NOT NULL DEFAULT 0 COMMENT '收藏数量',
    comment_count INT NOT NULL DEFAULT 0 COMMENT '评论数量',
    follower_count INT NOT NULL DEFAULT 0 COMMENT '关注者数量',
    following_count INT NOT NULL DEFAULT 0 COMMENT '关注数量',
    view_count BIGINT NOT NULL DEFAULT 0 COMMENT '浏览量',
    total_score INT NOT NULL DEFAULT 0 COMMENT '总积分',
    achievement_count INT NOT NULL DEFAULT 0 COMMENT '成就数量',
    login_count INT NOT NULL DEFAULT 0 COMMENT '登录次数',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_total_score (total_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户统计表';

-- ========================================
-- 12. 用户成就表 (UserAchievement)
-- ========================================
CREATE TABLE user_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    achievement_type ENUM('KNOWLEDGE_CREATOR', 'KNOWLEDGE_SHARER', 'ACTIVE_LEARNER', 'SOCIAL_BUTTERFLY', 'QUALITY_CONTRIBUTOR', 'MILESTONE_ACHIEVER', 'SPECIAL_EVENT', 'SYSTEM_BADGE') NOT NULL COMMENT '成就类型',
    achievement_name VARCHAR(100) NOT NULL COMMENT '成就名称',
    achievement_description TEXT COMMENT '成就描述',
    achievement_icon VARCHAR(200) COMMENT '成就图标',
    points_awarded INT NOT NULL DEFAULT 0 COMMENT '成就积分',
    level INT NOT NULL DEFAULT 1 COMMENT '成就等级',
    progress_current INT NOT NULL DEFAULT 0 COMMENT '当前进度',
    progress_target INT NOT NULL DEFAULT 1 COMMENT '目标进度',
    is_completed TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否完成: 0-未完成, 1-已完成',
    achieved_at DATETIME COMMENT '获得时间',
    metadata JSON COMMENT '额外的成就数据',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY idx_user_achievement (user_id, achievement_type),
    INDEX idx_user_id (user_id),
    INDEX idx_achievement_type (achievement_type),
    INDEX idx_achieved_at (achieved_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户成就表';

-- ========================================
-- 13. 搜索历史表 (SearchHistory)
-- ========================================
CREATE TABLE search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '用户ID(可为空，支持匿名搜索)',
    keyword VARCHAR(100) NOT NULL COMMENT '关键词',
    result_count BIGINT NOT NULL DEFAULT 0 COMMENT '搜索结果数量',
    category_id BIGINT COMMENT '分类ID',
    content_type ENUM('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK', 'MIXED') COMMENT '内容类型',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    search_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '搜索时间',
    response_time BIGINT COMMENT '搜索响应时间（毫秒）',
    clicked_result_id BIGINT COMMENT '用户点击的结果ID',
    clicked_position INT COMMENT '点击结果在搜索结果中的位置',
    session_id VARCHAR(100) COMMENT '会话ID',
    INDEX idx_user_id (user_id),
    INDEX idx_keyword (keyword),
    INDEX idx_search_time (search_time),
    INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- ========================================
-- 14. 搜索索引表 (SearchIndex)
-- ========================================
CREATE TABLE search_indexes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL UNIQUE COMMENT '知识条目ID',
    search_text TEXT COMMENT '合并的搜索文本（标题+内容+标签）',
    title VARCHAR(200) COMMENT '标题',
    content_summary VARCHAR(500) COMMENT '内容摘要',
    category_id BIGINT COMMENT '分类ID',
    category_name VARCHAR(100) COMMENT '分类名称',
    tags VARCHAR(500) COMMENT '标签',
    uploader_id BIGINT COMMENT '上传者ID',
    uploader_name VARCHAR(50) COMMENT '上传者名称',
    content_type ENUM('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK', 'MIXED') COMMENT '内容类型',
    view_count BIGINT NOT NULL DEFAULT 0 COMMENT '浏览量',
    like_count BIGINT NOT NULL DEFAULT 0 COMMENT '点赞数',
    favorite_count BIGINT NOT NULL DEFAULT 0 COMMENT '收藏数',
    comment_count BIGINT NOT NULL DEFAULT 0 COMMENT '评论数',
    quality_score DOUBLE NOT NULL DEFAULT 0.0 COMMENT '质量评分',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-删除',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE,
    INDEX idx_knowledge_id (knowledge_id),
    INDEX idx_category_id (category_id),
    INDEX idx_tags (tags),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索索引表';

-- ========================================
-- 15. 热门关键词表 (HotKeyword)
-- ========================================
CREATE TABLE hot_keywords (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL UNIQUE COMMENT '关键词',
    search_count BIGINT NOT NULL DEFAULT 0 COMMENT '搜索次数',
    result_count BIGINT NOT NULL DEFAULT 0 COMMENT '搜索结果数量',
    click_count BIGINT NOT NULL DEFAULT 0 COMMENT '点击次数',
    trend_score DOUBLE NOT NULL DEFAULT 0.0 COMMENT '趋势分数',
    daily_count BIGINT NOT NULL DEFAULT 0 COMMENT '今日搜索次数',
    weekly_count BIGINT NOT NULL DEFAULT 0 COMMENT '本周搜索次数',
    monthly_count BIGINT NOT NULL DEFAULT 0 COMMENT '本月搜索次数',
    last_searched_at DATETIME COMMENT '最后搜索时间',
    category_id BIGINT COMMENT '关联的主要分类',
    category_name VARCHAR(100) COMMENT '分类名称',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_keyword (keyword),
    INDEX idx_search_count (search_count),
    INDEX idx_last_searched (last_searched_at),
    INDEX idx_trend_score (trend_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门关键词表';

-- ========================================
-- 16. 文件上传表 (FileUpload)
-- ========================================
CREATE TABLE file_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    stored_name VARCHAR(255) NOT NULL COMMENT '存储文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size BIGINT NOT NULL COMMENT '文件大小',
    file_type VARCHAR(100) NOT NULL COMMENT '文件类型',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    file_hash VARCHAR(64) COMMENT '文件哈希值(MD5或SHA256)',
    uploader_id BIGINT NOT NULL COMMENT '上传者ID',
    knowledge_id BIGINT COMMENT '关联的知识内容ID',
    download_count BIGINT NOT NULL DEFAULT 0 COMMENT '下载次数',
    last_accessed_at DATETIME COMMENT '最后访问时间',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-删除, 2-待审核',
    description VARCHAR(500) COMMENT '文件描述',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE SET NULL,
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_file_type (file_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_file_hash (file_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件上传表';

-- ========================================
-- 17. 外部数据源表 (ExternalSource) - 必须在 external_contents 之前创建
-- ========================================
CREATE TABLE external_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '数据源名称',
    source_url VARCHAR(500) NOT NULL UNIQUE COMMENT '数据源URL',
    source_type VARCHAR(50) NOT NULL COMMENT '数据源类型',
    description TEXT COMMENT '描述',
    crawl_frequency INT NOT NULL DEFAULT 24 COMMENT '抓取频率(小时)',
    selector_config JSON COMMENT 'CSS选择器配置',
    headers_config JSON COMMENT 'HTTP请求头配置',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
    last_crawl_at DATETIME COMMENT '最后抓取时间',
    last_success_at DATETIME COMMENT '最后成功时间',
    last_error TEXT COMMENT '最后错误信息',
    total_crawled BIGINT NOT NULL DEFAULT 0 COMMENT '总抓取次数',
    total_success BIGINT NOT NULL DEFAULT 0 COMMENT '总成功次数',
    total_failed BIGINT NOT NULL DEFAULT 0 COMMENT '总失败次数',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_source_url (source_url),
    INDEX idx_source_type (source_type),
    INDEX idx_status (status),
    INDEX idx_last_crawl_at (last_crawl_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外部数据源表';

-- ========================================
-- 18. 外部内容表 (ExternalContent) - 依赖 external_sources
-- ========================================
CREATE TABLE external_contents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id BIGINT NOT NULL COMMENT '数据源ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content LONGTEXT COMMENT '内容',
    summary TEXT COMMENT '摘要',
    author VARCHAR(100) COMMENT '作者',
    original_url VARCHAR(500) NOT NULL COMMENT '原始URL',
    image_url VARCHAR(500) COMMENT '图片URL',
    tags VARCHAR(500) COMMENT '标签',
    category VARCHAR(100) COMMENT '分类',
    content_hash VARCHAR(64) NOT NULL UNIQUE COMMENT '内容哈希(SHA-256)',
    language VARCHAR(10) DEFAULT 'zh' COMMENT '语言',
    word_count INT COMMENT '字数',
    reading_time INT COMMENT '预估阅读时间（分钟）',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 0-隐藏, -1-删除',
    quality_score DOUBLE DEFAULT 0.0 COMMENT '质量分数',
    published_at DATETIME COMMENT '发布时间',
    crawled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '抓取时间',
    last_updated_at DATETIME COMMENT '最后更新时间',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (source_id) REFERENCES external_sources(id) ON DELETE CASCADE,
    INDEX idx_source_id (source_id),
    INDEX idx_original_url (original_url),
    INDEX idx_content_hash (content_hash),
    INDEX idx_status (status),
    INDEX idx_crawled_at (crawled_at),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外部内容表';

-- ========================================
-- 19. 管理员日志表 (AdminLog)
-- ========================================
CREATE TABLE admin_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL COMMENT '管理员ID',
    admin_username VARCHAR(50) NOT NULL COMMENT '管理员用户名',
    operation_type ENUM('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'DISABLE', 'ENABLE', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE') NOT NULL COMMENT '操作类型',
    target_type ENUM('USER', 'KNOWLEDGE_ITEM', 'CATEGORY', 'COMMENT', 'TAG', 'SYSTEM_CONFIG', 'EXTERNAL_SOURCE', 'NOTIFICATION', 'LOG') NOT NULL COMMENT '目标类型',
    target_id BIGINT COMMENT '操作对象ID',
    target_name VARCHAR(200) COMMENT '操作对象名称',
    operation VARCHAR(200) NOT NULL COMMENT '操作',
    description TEXT COMMENT '描述',
    old_value TEXT COMMENT '旧值',
    new_value TEXT COMMENT '新值',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    result ENUM('SUCCESS', 'FAILED', 'PARTIAL') NOT NULL COMMENT '操作结果',
    error_message TEXT COMMENT '错误信息',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_admin_id (admin_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_target_type (target_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员日志表';

-- ========================================
-- 20. 系统日志表 (SystemLog)
-- ========================================
CREATE TABLE system_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_type ENUM('OPERATION', 'ERROR', 'SECURITY', 'PERFORMANCE', 'SYSTEM') NOT NULL COMMENT '日志类型',
    level ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL COMMENT '日志级别',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(100) COMMENT '用户名',
    operation VARCHAR(200) NOT NULL COMMENT '操作',
    description TEXT COMMENT '描述',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    request_url VARCHAR(500) COMMENT '请求URL',
    request_method VARCHAR(10) COMMENT '请求方法',
    response_status INT COMMENT '响应状态码',
    execution_time BIGINT COMMENT '执行时间(毫秒)',
    exception TEXT COMMENT '异常信息',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_log_type (log_type),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';

-- ========================================
-- 创建触发器
-- ========================================

DELIMITER $$

-- 用户互动统计触发器
CREATE TRIGGER tr_interaction_stats AFTER INSERT ON user_interactions
FOR EACH ROW
BEGIN
    IF NEW.interaction_type = 'LIKE' THEN
        INSERT INTO knowledge_stats (knowledge_id, like_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE like_count = like_count + 1;
    ELSEIF NEW.interaction_type = 'FAVORITE' THEN
        INSERT INTO knowledge_stats (knowledge_id, favorite_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE favorite_count = favorite_count + 1;
    ELSEIF NEW.interaction_type = 'VIEW' THEN
        INSERT INTO knowledge_stats (knowledge_id, view_count) 
        VALUES (NEW.knowledge_id, 1)
        ON DUPLICATE KEY UPDATE view_count = view_count + 1;
    END IF;
END$$

-- 评论统计触发器
CREATE TRIGGER tr_comment_stats AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    INSERT INTO knowledge_stats (knowledge_id, comment_count) 
    VALUES (NEW.knowledge_id, 1)
    ON DUPLICATE KEY UPDATE comment_count = comment_count + 1;
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
-- 所有表结构已完全匹配实体类定义
-- ========================================

-- ========================================
-- 初始化数据
-- ========================================

-- 插入分类数据
-- 根分类
INSERT INTO categories (id, name, description, parent_id, sort_order, created_at) VALUES
(1, '前端开发', '前端相关技术', NULL, 1, NOW()),
(2, '后端开发', '后端相关技术', NULL, 2, NOW()),
(3, '数据库', '数据库相关技术', NULL, 3, NOW()),
(4, '移动开发', '移动应用开发', NULL, 4, NOW());

-- 前端开发子分类
INSERT INTO categories (id, name, description, parent_id, sort_order, created_at) VALUES
(11, 'React', 'React框架', 1, 1, NOW()),
(12, 'Vue', 'Vue框架', 1, 2, NOW()),
(13, 'Angular', 'Angular框架', 1, 3, NOW());

-- 后端开发子分类
INSERT INTO categories (id, name, description, parent_id, sort_order, created_at) VALUES
(21, 'Spring Boot', 'Spring Boot框架', 2, 1, NOW()),
(22, 'Node.js', 'Node.js运行时', 2, 2, NOW()),
(23, 'Django', 'Django框架', 2, 3, NOW());

-- 数据库子分类
INSERT INTO categories (id, name, description, parent_id, sort_order, created_at) VALUES
(31, 'MySQL', 'MySQL数据库', 3, 1, NOW()),
(32, 'Redis', 'Redis缓存', 3, 2, NOW()),
(33, 'MongoDB', 'MongoDB文档数据库', 3, 3, NOW());

-- 移动开发子分类
INSERT INTO categories (id, name, description, parent_id, sort_order, created_at) VALUES
(41, 'React Native', 'React Native框架', 4, 1, NOW()),
(42, 'Flutter', 'Flutter框架', 4, 2, NOW()),
(43, 'iOS', 'iOS原生开发', 4, 3, NOW());

-- ========================================
-- 数据库初始化完成
-- ========================================