/**
 * Redis 缓存设计与实践
 */

export const redisCacheKnowledge = {
  id: 7,
  title: 'Redis 缓存设计与实践',
  content: `Redis 是一个开源的内存数据结构存储系统，可以用作数据库、缓存和消息中间件。

核心数据结构：

1. String（字符串）
最基本的数据类型，可以存储字符串、整数或浮点数。

2. Hash（哈希）
键值对集合，适合存储对象。

3. List（列表）
有序的字符串列表，支持从两端推入或弹出元素。

4. Set（集合）
无序的字符串集合，元素唯一。

5. Sorted Set（有序集合）
有序的字符串集合，每个元素关联一个分数。

常用命令：

字符串操作：
• SET - 设置值
• GET - 获取值
• INCR - 自增
• EXPIRE - 设置过期时间

哈希操作：
• HSET - 设置字段值
• HGET - 获取字段值
• HGETALL - 获取所有字段

列表操作：
• LPUSH - 左侧推入
• RPUSH - 右侧推入
• LPOP - 左侧弹出
• LRANGE - 获取范围元素

集合操作：
• SADD - 添加元素
• SMEMBERS - 获取所有元素
• SINTER - 交集
• SUNION - 并集

缓存策略：

1. 缓存穿透
查询不存在的数据，导致每次都查询数据库。
解决方案：布隆过滤器、缓存空值

2. 缓存击穿
热点数据过期，大量请求直接打到数据库。
解决方案：互斥锁、永不过期

3. 缓存雪崩
大量缓存同时过期，导致数据库压力骤增。
解决方案：过期时间随机化、多级缓存

4. 数据一致性
缓存和数据库数据不一致。
解决方案：先更新数据库再删除缓存、延迟双删

最佳实践：
• 设置合理的过期时间
• 使用连接池
• 避免大 key
• 使用 Pipeline 批量操作
• 监控 Redis 性能`,
  type: 'TEXT',
  uploaderId: 6,
  uploaderName: '孙八',
  uploaderAvatar: '',
  categoryId: 32,
  categoryName: 'Redis',
  tags: 'Redis,缓存,NoSQL,数据库',
  status: 1,
  createdAt: '2024-11-08T13:45:00Z',
  updatedAt: '2024-11-21T10:20:00Z',
  contentHash: 'hash_redis_cache_patterns',
};
