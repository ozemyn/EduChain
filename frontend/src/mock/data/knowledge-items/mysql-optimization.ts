/**
 * MySQL 性能优化实战
 */

export const mysqlOptimizationKnowledge = {
  id: 6,
  title: 'MySQL 性能优化实战',
  content: `MySQL 是最流行的关系型数据库之一，掌握性能优化技巧对于构建高性能应用至关重要。

优化策略：

1. 索引优化
• 为查询条件、排序字段创建索引
• 避免在索引列上使用函数
• 使用覆盖索引减少回表
• 定期分析和优化索引

2. 查询优化
• 避免 SELECT *，只查询需要的字段
• 使用 LIMIT 限制返回行数
• 避免在 WHERE 子句中使用 OR
• 使用 EXPLAIN 分析查询执行计划

3. 表结构优化
• 选择合适的数据类型
• 使用 NOT NULL 约束
• 合理使用范式和反范式
• 分区表处理大数据量

4. 配置优化
• 调整缓冲池大小（innodb_buffer_pool_size）
• 优化连接数（max_connections）
• 调整查询缓存
• 配置慢查询日志

5. 硬件优化
• 使用 SSD 硬盘
• 增加内存
• 使用 RAID 提高 I/O 性能

常见问题：

慢查询：
• 缺少索引
• 索引失效
• 数据量过大
• 锁等待

解决方案：
• 添加合适的索引
• 优化查询语句
• 分库分表
• 读写分离

最佳实践：
• 定期备份数据
• 监控数据库性能
• 及时清理无用数据
• 使用连接池
• 避免大事务`,
  type: 'TEXT',
  uploaderId: 5,
  uploaderName: '钱七',
  uploaderAvatar: '',
  categoryId: 31,
  categoryName: 'MySQL',
  tags: 'MySQL,数据库,性能优化,SQL',
  status: 1,
  createdAt: '2024-11-07T11:30:00Z',
  updatedAt: '2024-11-20T16:00:00Z',
};
