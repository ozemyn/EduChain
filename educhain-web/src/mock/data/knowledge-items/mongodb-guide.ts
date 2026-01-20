/**
 * MongoDB 文档数据库入门
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const mongodbGuideKnowledge = {
  id: 15,
  shareCode: generateMockShareCode(15),
  title: 'MongoDB 文档数据库入门 - NoSQL 数据建模',
  content: `# MongoDB 文档数据库入门 - NoSQL 数据建模

## 🚀 引言

MongoDB 是一个基于分布式文件存储的 NoSQL 数据库，使用类似 JSON 的 BSON 格式存储数据。它提供了高性能、高可用性和易扩展性，特别适合处理大量非结构化数据。

### MongoDB 的优势

✅ **灵活的数据模型** - 无需预定义 Schema
✅ **高性能** - 支持索引和聚合
✅ **水平扩展** - 分片支持
✅ **丰富的查询** - 支持复杂查询
✅ **高可用** - 副本集支持

---

## 📚 核心概念

### 1. 数据库（Database）

MongoDB 中的数据库，包含多个集合。

\`\`\`javascript
// 查看所有数据库
show dbs

// 切换/创建数据库
use myapp

// 查看当前数据库
db

// 删除数据库
db.dropDatabase()
\`\`\`

### 2. 集合（Collection）

类似于关系型数据库中的表，存储文档。

\`\`\`javascript
// 创建集合
db.createCollection('users')

// 查看所有集合
show collections

// 删除集合
db.users.drop()
\`\`\`

### 3. 文档（Document）

MongoDB 中的基本数据单元，类似于 JSON 对象。

\`\`\`javascript
// 文档示例
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "张三",
  age: 25,
  email: "zhangsan@example.com",
  address: {
    city: "北京",
    street: "朝阳区"
  },
  hobbies: ["读书", "旅游", "编程"],
  createdAt: ISODate("2025-12-16T10:00:00Z")
}
\`\`\`

### 4. 字段（Field）

文档中的键值对。

\`\`\`javascript
{
  name: "张三",        // 字符串字段
  age: 25,            // 数字字段
  isActive: true,     // 布尔字段
  tags: ["tag1"],     // 数组字段
  profile: {...}      // 嵌入文档字段
}
\`\`\`

---

## 🎯 基本操作

### 1. 插入文档

\`\`\`javascript
// 插入单个文档
db.users.insertOne({
  name: "张三",
  age: 25,
  email: "zhangsan@example.com",
  createdAt: new Date()
});

// 插入多个文档
db.users.insertMany([
  {
    name: "李四",
    age: 30,
    email: "lisi@example.com"
  },
  {
    name: "王五",
    age: 28,
    email: "wangwu@example.com"
  }
]);

// 返回结果
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId("..."),
    '1': ObjectId("...")
  }
}
\`\`\`

### 2. 查询文档

\`\`\`javascript
// 查询所有文档
db.users.find()

// 查询单个文档
db.users.findOne({ name: "张三" })

// 条件查询
db.users.find({ age: { $gt: 25 } })  // 年龄大于25
db.users.find({ age: { $gte: 25 } }) // 年龄大于等于25
db.users.find({ age: { $lt: 30 } })  // 年龄小于30
db.users.find({ age: { $lte: 30 } }) // 年龄小于等于30
db.users.find({ age: { $ne: 25 } })  // 年龄不等于25

// 多条件查询
db.users.find({
  age: { $gte: 25, $lte: 30 },
  name: "张三"
})

// OR 查询
db.users.find({
  $or: [
    { age: { $lt: 25 } },
    { age: { $gt: 30 } }
  ]
})

// IN 查询
db.users.find({
  name: { $in: ["张三", "李四", "王五"] }
})

// 正则表达式查询
db.users.find({
  name: /^张/
})

// 投影（选择字段）
db.users.find(
  { age: { $gt: 25 } },
  { name: 1, email: 1, _id: 0 }
)

// 排序
db.users.find().sort({ age: 1 })  // 升序
db.users.find().sort({ age: -1 }) // 降序

// 限制数量
db.users.find().limit(10)

// 跳过
db.users.find().skip(10)

// 分页
db.users.find()
  .sort({ createdAt: -1 })
  .skip(20)
  .limit(10)

// 统计
db.users.countDocuments({ age: { $gt: 25 } })
\`\`\`

### 3. 更新文档

\`\`\`javascript
// 更新单个文档
db.users.updateOne(
  { name: "张三" },
  {
    $set: { age: 26, email: "newemail@example.com" }
  }
)

// 更新多个文档
db.users.updateMany(
  { age: { $lt: 25 } },
  {
    $set: { status: "young" }
  }
)

// 替换文档
db.users.replaceOne(
  { name: "张三" },
  {
    name: "张三",
    age: 26,
    email: "zhangsan@example.com"
  }
)

// 更新操作符
// $set - 设置字段值
db.users.updateOne(
  { name: "张三" },
  { $set: { age: 26 } }
)

// $inc - 增加数值
db.users.updateOne(
  { name: "张三" },
  { $inc: { age: 1 } }
)

// $push - 添加数组元素
db.users.updateOne(
  { name: "张三" },
  { $push: { hobbies: "游泳" } }
)

// $pull - 删除数组元素
db.users.updateOne(
  { name: "张三" },
  { $pull: { hobbies: "游泳" } }
)

// $addToSet - 添加唯一元素到数组
db.users.updateOne(
  { name: "张三" },
  { $addToSet: { hobbies: "游泳" } }
)

// $unset - 删除字段
db.users.updateOne(
  { name: "张三" },
  { $unset: { email: "" } }
)

// upsert - 不存在则插入
db.users.updateOne(
  { name: "赵六" },
  { $set: { age: 30 } },
  { upsert: true }
)
\`\`\`

### 4. 删除文档

\`\`\`javascript
// 删除单个文档
db.users.deleteOne({ name: "张三" })

// 删除多个文档
db.users.deleteMany({ age: { $lt: 25 } })

// 删除所有文档
db.users.deleteMany({})
\`\`\`

---

## 🔍 索引

### 1. 创建索引

\`\`\`javascript
// 单字段索引
db.users.createIndex({ email: 1 })  // 升序
db.users.createIndex({ age: -1 })   // 降序

// 复合索引
db.users.createIndex({ name: 1, age: -1 })

// 唯一索引
db.users.createIndex(
  { email: 1 },
  { unique: true }
)

// 文本索引
db.posts.createIndex({ content: "text" })

// 地理空间索引
db.places.createIndex({ location: "2dsphere" })

// TTL 索引（自动过期）
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)
\`\`\`

### 2. 查看和删除索引

\`\`\`javascript
// 查看所有索引
db.users.getIndexes()

// 删除索引
db.users.dropIndex("email_1")

// 删除所有索引（除了 _id）
db.users.dropIndexes()
\`\`\`

### 3. 索引性能分析

\`\`\`javascript
// 查看查询计划
db.users.find({ email: "zhangsan@example.com" }).explain("executionStats")

// 查看索引使用情况
db.users.aggregate([
  { $indexStats: {} }
])
\`\`\`

---

## 📊 聚合管道

### 1. 基础聚合

\`\`\`javascript
// $match - 过滤文档
db.users.aggregate([
  { $match: { age: { $gte: 25 } } }
])

// $group - 分组聚合
db.users.aggregate([
  {
    $group: {
      _id: "$city",
      count: { $sum: 1 },
      avgAge: { $avg: "$age" }
    }
  }
])

// $sort - 排序
db.users.aggregate([
  { $sort: { age: -1 } }
])

// $project - 投影
db.users.aggregate([
  {
    $project: {
      name: 1,
      age: 1,
      isAdult: { $gte: ["$age", 18] }
    }
  }
])

// $limit - 限制数量
db.users.aggregate([
  { $limit: 10 }
])

// $skip - 跳过
db.users.aggregate([
  { $skip: 10 }
])
\`\`\`

### 2. 高级聚合

\`\`\`javascript
// $lookup - 关联查询（类似 JOIN）
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])

// $unwind - 展开数组
db.users.aggregate([
  { $unwind: "$hobbies" }
])

// $addFields - 添加字段
db.users.aggregate([
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
  }
])

// $bucket - 分桶
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50, 100],
      default: "Other",
      output: {
        count: { $sum: 1 }
      }
    }
  }
])

// 复杂聚合示例
db.orders.aggregate([
  // 1. 过滤最近30天的订单
  {
    $match: {
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  },
  // 2. 关联用户信息
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  // 3. 展开用户数组
  { $unwind: "$user" },
  // 4. 按用户分组统计
  {
    $group: {
      _id: "$userId",
      userName: { $first: "$user.name" },
      totalOrders: { $sum: 1 },
      totalAmount: { $sum: "$amount" }
    }
  },
  // 5. 排序
  { $sort: { totalAmount: -1 } },
  // 6. 限制前10名
  { $limit: 10 }
])
\`\`\`

---

## 🎨 数据建模

### 1. 嵌入式文档

适用于一对一或一对少量的关系。

\`\`\`javascript
// 用户和地址（一对一）
{
  _id: ObjectId("..."),
  name: "张三",
  email: "zhangsan@example.com",
  address: {
    city: "北京",
    street: "朝阳区",
    zipCode: "100000"
  }
}

// 博客文章和评论（一对少量）
{
  _id: ObjectId("..."),
  title: "MongoDB 入门",
  content: "...",
  comments: [
    {
      user: "李四",
      text: "写得不错",
      createdAt: ISODate("...")
    },
    {
      user: "王五",
      text: "很有帮助",
      createdAt: ISODate("...")
    }
  ]
}
\`\`\`

### 2. 引用

适用于一对多（大量）或多对多的关系。

\`\`\`javascript
// 用户集合
{
  _id: ObjectId("user1"),
  name: "张三",
  email: "zhangsan@example.com"
}

// 文章集合（引用用户）
{
  _id: ObjectId("post1"),
  title: "MongoDB 入门",
  content: "...",
  authorId: ObjectId("user1"),
  createdAt: ISODate("...")
}

// 查询时关联
db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  }
])
\`\`\`

### 3. 选择策略

\`\`\`
嵌入式文档：
✅ 数据经常一起访问
✅ 子文档数量有限
✅ 子文档不会独立查询

引用：
✅ 数据量大
✅ 数据会独立查询
✅ 多对多关系
\`\`\`

---

## ⚡ 性能优化

### 1. 创建合适的索引

\`\`\`javascript
// 分析慢查询
db.setProfilingLevel(2)
db.system.profile.find().sort({ ts: -1 }).limit(10)

// 根据查询模式创建索引
db.users.createIndex({ email: 1 })
db.posts.createIndex({ authorId: 1, createdAt: -1 })
\`\`\`

### 2. 使用投影

\`\`\`javascript
// 只返回需要的字段
db.users.find(
  { age: { $gt: 25 } },
  { name: 1, email: 1, _id: 0 }
)
\`\`\`

### 3. 限制返回数量

\`\`\`javascript
// 使用 limit
db.users.find().limit(100)

// 分页查询
db.users.find()
  .sort({ createdAt: -1 })
  .skip(page * size)
  .limit(size)
\`\`\`

### 4. 使用聚合管道

\`\`\`javascript
// 复杂查询使用聚合管道
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
])
\`\`\`

### 5. 批量操作

\`\`\`javascript
// 批量插入
db.users.insertMany([...])

// 批量更新
const bulk = db.users.initializeUnorderedBulkOp();
bulk.find({ age: { $lt: 18 } }).update({ $set: { status: "minor" } });
bulk.find({ age: { $gte: 18 } }).update({ $set: { status: "adult" } });
bulk.execute();
\`\`\`

---

## 🔒 最佳实践

1. **合理设计数据模型**
   - 根据查询模式设计
   - 平衡嵌入和引用

2. **创建必要的索引**
   - 为常用查询创建索引
   - 避免过多索引

3. **避免大文档**
   - 单个文档不超过 16MB
   - 大数组使用引用

4. **使用连接池**
   - 复用数据库连接
   - 合理配置连接数

5. **定期备份数据**
   - 使用 mongodump/mongorestore
   - 配置副本集

---

## 🎓 总结

MongoDB 是强大的 NoSQL 数据库，适合处理灵活的数据结构。通过本指南，你应该已经了解了：

- MongoDB 的核心概念
- CRUD 操作
- 索引和聚合
- 数据建模策略
- 性能优化技巧

继续实践，你会发现 MongoDB 在现代应用开发中的强大之处！

---

**参考资源：**
- [MongoDB 官方文档](https://docs.mongodb.com/)
- [MongoDB 中文文档](https://www.mongodb.org.cn/)
- [MongoDB University](https://university.mongodb.com/)`,
  type: 'TEXT' as const,
  uploaderId: 7,
  uploaderName: '周九',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoujiu',
  categoryId: 33,
  categoryName: 'MongoDB',
  tags: 'MongoDB,NoSQL,数据库,文档数据库',
  status: 1,
  createdAt: '2025-12-16T13:20:00Z',
  updatedAt: '2026-01-15T09:15:00Z',
  contentHash: 'hash_mongodb_modeling',
};
