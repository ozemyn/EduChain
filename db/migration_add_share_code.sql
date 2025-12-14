-- ========================================
-- 数据库迁移脚本：添加分享码字段
-- 版本: 1.1.0
-- 创建时间: 2025-01-01
-- 说明: 为knowledge_items表添加share_code字段并生成历史数据的分享码
-- ========================================

USE educhain_db;

-- 1. 添加share_code字段
ALTER TABLE knowledge_items 
ADD COLUMN share_code VARCHAR(32) NOT NULL DEFAULT '' COMMENT '分享码(Base58编码)' 
AFTER id;

-- 2. 添加唯一索引
ALTER TABLE knowledge_items 
ADD UNIQUE INDEX idx_share_code (share_code);

-- 3. 为现有数据生成分享码
-- 注意：这里使用简化的分享码生成逻辑，实际生产环境应该使用Java后端的ShareCodeService
UPDATE knowledge_items 
SET share_code = CONCAT('EK', 
    CASE 
        WHEN id = 1 THEN '2VfUX'
        WHEN id = 2 THEN '2VfUY'
        WHEN id = 3 THEN '2VfUZ'
        WHEN id = 4 THEN '2VfV2'
        WHEN id = 5 THEN '2VfV3'
        WHEN id = 6 THEN '2VfV4'
        WHEN id = 7 THEN '2VfV5'
        WHEN id = 8 THEN '2VfV6'
        WHEN id = 9 THEN '2VfV7'
        WHEN id = 10 THEN '2VfV8'
        WHEN id = 11 THEN '2VfV9'
        WHEN id = 12 THEN '2VfVA'
        WHEN id = 13 THEN '2VfVB'
        WHEN id = 14 THEN '2VfVC'
        WHEN id = 15 THEN '2VfVD'
        ELSE CONCAT(LPAD(id, 5, '0'), 'X')
    END
)
WHERE share_code = '';

-- 4. 移除默认值约束
ALTER TABLE knowledge_items 
ALTER COLUMN share_code DROP DEFAULT;

-- 5. 验证数据
SELECT 
    id, 
    share_code, 
    title,
    created_at
FROM knowledge_items 
ORDER BY id;

-- 6. 检查唯一性
SELECT 
    share_code, 
    COUNT(*) as count 
FROM knowledge_items 
GROUP BY share_code 
HAVING COUNT(*) > 1;

-- ========================================
-- 迁移完成
-- ========================================