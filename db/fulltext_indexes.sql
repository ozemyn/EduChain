-- 为搜索功能添加 FULLTEXT 索引

-- 为 knowledge_items 表添加 FULLTEXT 索引
ALTER TABLE knowledge_items ADD FULLTEXT(title, content, tags);

-- 为 search_indexes 表添加 FULLTEXT 索引
ALTER TABLE search_indexes ADD FULLTEXT(search_text);
ALTER TABLE search_indexes ADD FULLTEXT(title, content_summary, tags);

-- 创建搜索索引表的索引
CREATE INDEX idx_search_quality_score ON search_indexes(quality_score DESC);
CREATE INDEX idx_search_view_count ON search_indexes(view_count DESC);
CREATE INDEX idx_search_like_count ON search_indexes(like_count DESC);
CREATE INDEX idx_search_favorite_count ON search_indexes(favorite_count DESC);
CREATE INDEX idx_search_comment_count ON search_indexes(comment_count DESC);

-- 创建热门关键词表的索引
CREATE INDEX idx_hot_keyword_search_count ON hot_keywords(search_count DESC);
CREATE INDEX idx_hot_keyword_trend_score ON hot_keywords(trend_score DESC);
CREATE INDEX idx_hot_keyword_daily_count ON hot_keywords(daily_count DESC);
CREATE INDEX idx_hot_keyword_weekly_count ON hot_keywords(weekly_count DESC);
CREATE INDEX idx_hot_keyword_monthly_count ON hot_keywords(monthly_count DESC);

-- 优化搜索性能的配置建议
-- 在 MySQL 配置文件中设置以下参数：
-- ft_min_word_len = 2  # 最小索引词长度
-- ft_max_word_len = 84 # 最大索引词长度
-- ft_stopword_file = '' # 停用词文件，可以设置为空以索引所有词