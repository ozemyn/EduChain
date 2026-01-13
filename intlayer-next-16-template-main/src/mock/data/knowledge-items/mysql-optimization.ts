/**
 * MySQL 性能优化实战
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const mysqlOptimizationKnowledge = {
  id: 6,
  shareCode: generateMockShareCode(6),
  title: 'MySQL 性能优化实战 - 从理论到实践',
  content: `# MySQL 性能优化实战 - 从理论到实践

## 🎯 引言

MySQL 是最流行的关系型数据库之一，掌握性能优化技巧对于构建高性能应用至关重要。本指南将从索引优化、查询优化、表结构设计等多个维度，全面讲解 MySQL 性能优化的最佳实践。

### 性能优化的重要性

✅ **提升响应速度** - 减少查询时间
✅ **降低服务器负载** - 提高并发处理能力
✅ **节省资源成本** - 减少硬件投入
✅ **改善用户体验** - 提高系统可用性

---

## 📚 索引优化

### 1. 索引类型

\`\`\`sql
-- 主键索引
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL
);

-- 唯一索引
CREATE UNIQUE INDEX idx_username ON users(username);

-- 普通索引
CREATE INDEX idx_email ON users(email);

-- 组合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 全文索引
CREATE FULLTEXT INDEX idx_content ON articles(content);
\`\`\`

### 2. 索引设计原则

**最左前缀原则：**

\`\`\`sql
-- 组合索引 (name, age, city)
-- 可以使用的查询
SELECT * FROM users WHERE name = 'John';
SELECT * FROM users WHERE name = 'John' AND age = 30;
SELECT * FROM users WHERE name = 'John' AND age = 30 AND city = 'NY';

-- 不能使用索引的查询
SELECT * FROM users WHERE age = 30;
SELECT * FROM users WHERE city = 'NY';
\`\`\`

**覆盖索引：**

\`\`\`sql
-- 创建覆盖索引
CREATE INDEX idx_user_info ON users(id, name, email);

-- 使用覆盖索引，无需回表
SELECT id, name, email FROM users WHERE id = 1;
\`\`\`

### 3. 索引失效场景

\`\`\`sql
-- ❌ 在索引列上使用函数
SELECT * FROM users WHERE YEAR(created_at) = 2025;

-- ✅ 改进
SELECT * FROM users WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01';

-- ❌ 使用 OR 连接
SELECT * FROM users WHERE name = 'John' OR age = 30;

-- ✅ 改进：使用 UNION
SELECT * FROM users WHERE name = 'John'
UNION
SELECT * FROM users WHERE age = 30;

-- ❌ 使用 LIKE 以通配符开头
SELECT * FROM users WHERE name LIKE '%John';

-- ✅ 改进
SELECT * FROM users WHERE name LIKE 'John%';

-- ❌ 类型不匹配
SELECT * FROM users WHERE id = '1';  -- id 是 INT 类型

-- ✅ 改进
SELECT * FROM users WHERE id = 1;
\`\`\`

---

## 🔍 查询优化

### 1. EXPLAIN 分析

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE name = 'John';

-- 关键字段说明：
-- type: 连接类型（system > const > eq_ref > ref > range > index > ALL）
-- possible_keys: 可能使用的索引
-- key: 实际使用的索引
-- rows: 扫描的行数
-- Extra: 额外信息
\`\`\`

### 2. 查询优化技巧

**避免 SELECT *：**

\`\`\`sql
-- ❌ 不推荐
SELECT * FROM users WHERE id = 1;

-- ✅ 推荐
SELECT id, name, email FROM users WHERE id = 1;
\`\`\`

**使用 LIMIT：**

\`\`\`sql
-- 分页查询
SELECT id, name FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 20;

-- 优化大偏移量
SELECT id, name FROM users 
WHERE id > (SELECT id FROM users ORDER BY id LIMIT 10000, 1)
LIMIT 10;
\`\`\`

**子查询优化：**

\`\`\`sql
-- ❌ 不推荐：相关子查询
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ✅ 推荐：JOIN
SELECT DISTINCT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id;
\`\`\`

**批量操作：**

\`\`\`sql
-- ❌ 不推荐：逐条插入
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane', 'jane@example.com');

-- ✅ 推荐：批量插入
INSERT INTO users (name, email) VALUES 
('John', 'john@example.com'),
('Jane', 'jane@example.com'),
('Bob', 'bob@example.com');
\`\`\`

---

## 🏗️ 表结构优化

### 1. 数据类型选择

\`\`\`sql
-- ✅ 使用合适的数据类型
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,  -- 精确的货币类型
    stock INT UNSIGNED DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,  -- 布尔值
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ❌ 避免过大的类型
-- VARCHAR(1000) 当实际只需要 VARCHAR(50)
-- BIGINT 当 INT 就足够
\`\`\`

### 2. 范式与反范式

**第三范式（3NF）：**

\`\`\`sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100)
);

-- 订单表
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

**反范式化（提高查询性能）：**

\`\`\`sql
-- 订单表（冗余用户信息）
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(50),  -- 冗余
    user_email VARCHAR(100),  -- 冗余
    total_amount DECIMAL(10, 2)
);
\`\`\`

### 3. 分区表

\`\`\`sql
-- 按日期分区
CREATE TABLE logs (
    id INT AUTO_INCREMENT,
    message TEXT,
    created_at DATETIME,
    PRIMARY KEY (id, created_at)
)
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
\`\`\`

---

## ⚙️ 配置优化

### 1. InnoDB 配置

\`\`\`ini
# my.cnf

# 缓冲池大小（建议设置为物理内存的 70-80%）
innodb_buffer_pool_size = 8G

# 日志文件大小
innodb_log_file_size = 512M

# 刷新日志到磁盘的策略
innodb_flush_log_at_trx_commit = 2

# 每个表使用独立表空间
innodb_file_per_table = 1

# 并发线程数
innodb_thread_concurrency = 0
\`\`\`

### 2. 连接配置

\`\`\`ini
# 最大连接数
max_connections = 500

# 连接超时时间
wait_timeout = 28800
interactive_timeout = 28800

# 查询缓存（MySQL 8.0 已移除）
query_cache_type = 0
query_cache_size = 0
\`\`\`

### 3. 慢查询日志

\`\`\`ini
# 启用慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log

# 慢查询阈值（秒）
long_query_time = 2

# 记录未使用索引的查询
log_queries_not_using_indexes = 1
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: 优化分页查询

**问题：**

\`\`\`sql
-- 大偏移量导致性能问题
SELECT * FROM articles ORDER BY id LIMIT 100000, 10;
\`\`\`

**解决方案：**

\`\`\`sql
-- 方案 1: 使用子查询
SELECT * FROM articles 
WHERE id >= (SELECT id FROM articles ORDER BY id LIMIT 100000, 1)
LIMIT 10;

-- 方案 2: 记录上次查询的最大 ID
SELECT * FROM articles 
WHERE id > 100000 
ORDER BY id 
LIMIT 10;
\`\`\`

### 案例 2: 优化 COUNT 查询

**问题：**

\`\`\`sql
-- 全表扫描
SELECT COUNT(*) FROM users;
\`\`\`

**解决方案：**

\`\`\`sql
-- 使用近似值
SELECT table_rows FROM information_schema.tables 
WHERE table_schema = 'mydb' AND table_name = 'users';

-- 使用缓存
-- 在 Redis 中缓存计数结果
\`\`\`

### 案例 3: 优化 JOIN 查询

**问题：**

\`\`\`sql
-- 多表 JOIN 性能差
SELECT u.name, o.total, p.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN products p ON o.product_id = p.id
WHERE u.created_at > '2025-01-01';
\`\`\`

**解决方案：**

\`\`\`sql
-- 1. 添加索引
CREATE INDEX idx_user_created ON users(created_at);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_product ON orders(product_id);

-- 2. 使用小表驱动大表
-- 3. 避免 SELECT *
SELECT u.name, o.total, p.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN products p ON o.product_id = p.id
WHERE u.created_at > '2025-01-01';
\`\`\`

---

## 📋 最佳实践

1. **索引设计**
   - 为查询条件、排序字段创建索引
   - 避免过多索引（影响写入性能）
   - 定期分析和优化索引

2. **查询优化**
   - 避免 SELECT *
   - 使用 LIMIT 限制返回行数
   - 使用 EXPLAIN 分析查询计划

3. **表结构设计**
   - 选择合适的数据类型
   - 合理使用范式和反范式
   - 考虑分区表处理大数据量

4. **配置优化**
   - 调整缓冲池大小
   - 优化连接数
   - 启用慢查询日志

5. **监控和维护**
   - 定期备份数据
   - 监控数据库性能
   - 及时清理无用数据

---

## 🎓 总结

MySQL 性能优化是一个系统工程，需要从多个维度进行优化。通过本指南，你应该已经了解了：

- 索引优化的原理和技巧
- 查询优化的方法和工具
- 表结构设计的最佳实践
- 配置优化和实战案例

继续实践，你会发现性能优化让数据库运行更加高效！

---

**参考资源：**
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [High Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/)
- [MySQL 性能优化最佳实践](https://www.percona.com/blog/)`,
  type: 'TEXT' as const,
  uploaderId: 3,
  uploaderName: '李四',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
  categoryId: 31,
  categoryName: 'MySQL',
  tags: 'MySQL,数据库,性能优化,SQL',
  status: 1,
  createdAt: '2025-12-04T11:15:00Z',
  updatedAt: '2025-12-18T10:20:00Z',
  contentHash: 'hash_mysql_optimization',
};
