/**
 * Node.js + Express 后端开发
 */

export const nodejsExpressKnowledge = {
  id: 12,
  title: 'Node.js + Express 后端开发',
  content: `Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，Express 是最流行的 Node.js Web 框架。

Node.js 核心特性：

1. 事件驱动
基于事件循环机制，非阻塞 I/O 操作。

2. 单线程
使用单线程处理请求，通过事件循环实现高并发。

3. 模块系统
CommonJS 模块规范，支持 ES6 模块。

4. NPM 包管理
世界上最大的开源库生态系统。

Express 框架：

1. 路由
定义应用如何响应客户端请求。

2. 中间件
处理请求和响应的函数，可以访问请求对象、响应对象和下一个中间件。

3. 模板引擎
支持多种模板引擎，如 EJS、Pug、Handlebars。

4. 错误处理
统一的错误处理机制。

常用中间件：

1. body-parser
解析请求体。

2. cors
处理跨域请求。

3. morgan
HTTP 请求日志。

4. helmet
增强安全性。

5. express-validator
请求参数验证。

RESTful API 设计：

1. HTTP 方法
• GET - 获取资源
• POST - 创建资源
• PUT - 更新资源
• PATCH - 部分更新
• DELETE - 删除资源

2. 状态码
• 200 - 成功
• 201 - 创建成功
• 400 - 请求错误
• 401 - 未授权
• 404 - 未找到
• 500 - 服务器错误

3. URL 设计
• 使用名词而非动词
• 使用复数形式
• 使用层级关系

数据库集成：

1. MongoDB
使用 Mongoose ODM。

2. MySQL
使用 mysql2 或 Sequelize ORM。

3. PostgreSQL
使用 pg 或 Sequelize ORM。

4. Redis
使用 redis 客户端。

最佳实践：
• 使用环境变量管理配置
• 实现统一的错误处理
• 使用 async/await 处理异步
• 实现请求日志
• 使用 JWT 进行身份验证
• 编写单元测试和集成测试`,
  type: 'TEXT',
  uploaderId: 4,
  uploaderName: '赵六',
  uploaderAvatar: '',
  categoryId: 22,
  categoryName: 'Node.js',
  tags: 'Node.js,Express,后端开发,JavaScript',
  status: 1,
  createdAt: '2024-11-13T14:30:00Z',
  updatedAt: '2024-11-26T10:00:00Z',
  contentHash: 'hash_nodejs_async',
};
