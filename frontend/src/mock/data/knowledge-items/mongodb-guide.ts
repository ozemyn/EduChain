/**
 * MongoDB 文档数据库入门
 */

export const mongodbGuideKnowledge = {
  id: 15,
  title: 'MongoDB 文档数据库入门',
  content: `MongoDB 是一个基于分布式文件存储的 NoSQL 数据库，使用 JSON 格式存储数据。

核心概念：

1. 数据库（Database）
MongoDB 中的数据库，包含多个集合。

2. 集合（Collection）
类似于关系型数据库中的表，存储文档。

3. 文档（Document）
MongoDB 中的基本数据单元，类似于 JSON 对象。

4. 字段（Field）
文档中的键值对。

基本操作：

1. 插入文档
• insertOne() - 插入单个文档
• insertMany() - 插入多个文档

2. 查询文档
• find() - 查询多个文档
• findOne() - 查询单个文档
• 查询条件：$eq、$gt、$lt、$in 等

3. 更新文档
• updateOne() - 更新单个文档
• updateMany() - 更新多个文档
• 更新操作符：$set、$inc、$push 等

4. 删除文档
• deleteOne() - 删除单个文档
• deleteMany() - 删除多个文档

索引：

1. 单字段索引
在单个字段上创建索引。

2. 复合索引
在多个字段上创建索引。

3. 文本索引
支持文本搜索。

4. 地理空间索引
支持地理位置查询。

聚合管道：

1. $match
过滤文档。

2. $group
分组聚合。

3. $sort
排序。

4. $project
投影，选择字段。

5. $lookup
关联查询，类似 SQL 的 JOIN。

6. $unwind
展开数组。

数据建模：

1. 嵌入式文档
将相关数据嵌入到单个文档中。

2. 引用
使用文档 ID 引用其他文档。

3. 选择策略
• 一对一：嵌入
• 一对多（少量）：嵌入
• 一对多（大量）：引用
• 多对多：引用

性能优化：

1. 创建合适的索引
根据查询模式创建索引。

2. 使用投影
只返回需要的字段。

3. 限制返回数量
使用 limit() 限制结果。

4. 使用聚合管道
复杂查询使用聚合管道。

5. 分片
水平扩展，分布式存储。

最佳实践：
• 根据查询模式设计数据模型
• 合理使用嵌入和引用
• 创建必要的索引
• 避免大文档
• 使用连接池
• 定期备份数据`,
  type: 'TEXT',
  uploaderId: 7,
  uploaderName: '周九',
  uploaderAvatar: '',
  categoryId: 33,
  categoryName: 'MongoDB',
  tags: 'MongoDB,NoSQL,数据库,文档数据库',
  status: 1,
  createdAt: '2024-11-16T13:20:00Z',
  updatedAt: '2024-11-29T09:15:00Z',
};
