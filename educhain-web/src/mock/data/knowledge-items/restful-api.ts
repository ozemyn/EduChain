/**
 * RESTful API 设计规范
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const restfulApiKnowledge = {
  id: 14,
  shareCode: generateMockShareCode(14),
  title: 'RESTful API 设计规范 - 构建优雅的接口',
  content: `# RESTful API 设计规范 - 构建优雅的接口

## 🚀 引言

REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序的接口。RESTful API 是遵循 REST 架构风格的 Web API，它使用 HTTP 协议进行通信，具有简单、可扩展、易于理解的特点。

### RESTful API 的优势

✅ **统一接口** - 使用标准的 HTTP 方法
✅ **无状态** - 每个请求独立，易于扩展
✅ **可缓存** - 提升性能
✅ **分层系统** - 支持负载均衡、缓存等
✅ **易于理解** - 资源导向，语义清晰

---

## 📚 设计原则

### 1. 资源导向

一切皆资源，使用名词而非动词。

\`\`\`
✅ 正确：
GET /users
GET /users/123
POST /users
PUT /users/123
DELETE /users/123

❌ 错误：
GET /getUsers
POST /createUser
POST /updateUser
POST /deleteUser
\`\`\`

### 2. 统一接口

使用标准的 HTTP 方法操作资源。

\`\`\`
GET    - 获取资源
POST   - 创建资源
PUT    - 更新资源（完整更新）
PATCH  - 更新资源（部分更新）
DELETE - 删除资源
\`\`\`

### 3. 无状态

每个请求都包含处理该请求所需的所有信息。

\`\`\`javascript
// 请求头包含认证信息
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 不依赖服务器端会话
\`\`\`

### 4. 可缓存

响应应明确标识是否可缓存。

\`\`\`
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT
\`\`\`

### 5. 分层系统

客户端无需知道是否直接连接到最终服务器。

\`\`\`
Client -> Load Balancer -> API Gateway -> Service -> Database
\`\`\`

---

## 🎯 HTTP 方法详解

### GET - 获取资源

\`\`\`javascript
// 获取用户列表
GET /api/users
Response: 200 OK
{
  "data": [
    { "id": 1, "name": "张三" },
    { "id": 2, "name": "李四" }
  ]
}

// 获取单个用户
GET /api/users/123
Response: 200 OK
{
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}

// 获取用户的文章
GET /api/users/123/posts
Response: 200 OK
{
  "data": [
    { "id": 1, "title": "文章标题" }
  ]
}
\`\`\`

### POST - 创建资源

\`\`\`javascript
// 创建用户
POST /api/users
Content-Type: application/json

{
  "name": "王五",
  "email": "wangwu@example.com",
  "password": "123456"
}

Response: 201 Created
Location: /api/users/124
{
  "data": {
    "id": 124,
    "name": "王五",
    "email": "wangwu@example.com",
    "createdAt": "2025-12-14T10:00:00Z"
  }
}
\`\`\`

### PUT - 完整更新资源

\`\`\`javascript
// 完整更新用户信息
PUT /api/users/123
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "address": "北京市朝阳区"
}

Response: 200 OK
{
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "address": "北京市朝阳区",
    "updatedAt": "2025-12-14T10:00:00Z"
  }
}
\`\`\`

### PATCH - 部分更新资源

\`\`\`javascript
// 只更新用户的手机号
PATCH /api/users/123
Content-Type: application/json

{
  "phone": "13900139000"
}

Response: 200 OK
{
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13900139000",
    "updatedAt": "2025-12-14T10:00:00Z"
  }
}
\`\`\`

### DELETE - 删除资源

\`\`\`javascript
// 删除用户
DELETE /api/users/123

Response: 204 No Content

// 或返回删除的资源
Response: 200 OK
{
  "message": "用户已删除",
  "data": {
    "id": 123,
    "name": "张三"
  }
}
\`\`\`

---

## 🛠️ URL 设计规范

### 1. 使用名词复数

\`\`\`
✅ 正确：
/users
/posts
/comments

❌ 错误：
/user
/post
/comment
\`\`\`

### 2. 层级关系

\`\`\`
// 用户的文章
GET /users/123/posts

// 文章的评论
GET /posts/456/comments

// 评论的回复
GET /comments/789/replies
\`\`\`

### 3. 过滤、排序、分页

\`\`\`javascript
// 过滤
GET /users?role=admin&status=active

// 排序
GET /posts?sort=createdAt&order=desc

// 分页
GET /articles?page=2&size=20

// 组合使用
GET /users?role=admin&sort=createdAt&order=desc&page=1&size=10
\`\`\`

### 4. 搜索

\`\`\`javascript
// 简单搜索
GET /users?q=张三

// 高级搜索
POST /users/search
{
  "keyword": "张三",
  "filters": {
    "role": "admin",
    "createdAfter": "2025-01-01"
  }
}
\`\`\`

### 5. 版本控制

\`\`\`
方式1：URL 版本
GET /api/v1/users
GET /api/v2/users

方式2：Header 版本
GET /api/users
Accept: application/vnd.api+json; version=1

方式3：参数版本
GET /api/users?version=1
\`\`\`

---

## 📊 状态码规范

### 2xx 成功

\`\`\`
200 OK - 请求成功
201 Created - 创建成功
202 Accepted - 已接受，异步处理中
204 No Content - 成功但无返回内容
\`\`\`

### 3xx 重定向

\`\`\`
301 Moved Permanently - 永久重定向
302 Found - 临时重定向
304 Not Modified - 资源未修改，使用缓存
\`\`\`

### 4xx 客户端错误

\`\`\`
400 Bad Request - 请求参数错误
401 Unauthorized - 未授权，需要登录
403 Forbidden - 禁止访问，权限不足
404 Not Found - 资源不存在
405 Method Not Allowed - 方法不允许
409 Conflict - 资源冲突
422 Unprocessable Entity - 请求格式正确但语义错误
429 Too Many Requests - 请求过多，限流
\`\`\`

### 5xx 服务器错误

\`\`\`
500 Internal Server Error - 服务器内部错误
502 Bad Gateway - 网关错误
503 Service Unavailable - 服务不可用
504 Gateway Timeout - 网关超时
\`\`\`

---

## 📝 响应格式设计

### 统一的响应结构

\`\`\`javascript
// 成功响应
{
  "success": true,
  "data": {
    "id": 123,
    "name": "张三"
  },
  "message": "操作成功",
  "timestamp": "2025-12-14T10:00:00Z"
}

// 列表响应
{
  "success": true,
  "data": {
    "items": [
      { "id": 1, "name": "张三" },
      { "id": 2, "name": "李四" }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  },
  "timestamp": "2025-12-14T10:00:00Z"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": {
      "userId": 123
    }
  },
  "timestamp": "2025-12-14T10:00:00Z"
}

// 验证错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "fields": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "password",
        "message": "密码长度至少6位"
      }
    ]
  },
  "timestamp": "2025-12-14T10:00:00Z"
}
\`\`\`

---

## 🔐 安全性设计

### 1. 身份验证

\`\`\`javascript
// JWT Token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// API Key
X-API-Key: your-api-key-here

// OAuth 2.0
Authorization: Bearer access_token
\`\`\`

### 2. HTTPS

\`\`\`
所有 API 请求必须使用 HTTPS
http://api.example.com -> https://api.example.com
\`\`\`

### 3. 请求限流

\`\`\`javascript
// 响应头
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000

// 超过限制
Response: 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁，请稍后再试"
  }
}
\`\`\`

### 4. 输入验证

\`\`\`javascript
// 验证所有输入
POST /api/users
{
  "email": "invalid-email",
  "password": "123"
}

Response: 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": [
      { "field": "email", "message": "邮箱格式不正确" },
      { "field": "password", "message": "密码长度至少6位" }
    ]
  }
}
\`\`\`

### 5. CORS 配置

\`\`\`javascript
// 响应头
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
\`\`\`

---

## 🎯 最佳实践

### 1. 使用 HATEOAS

\`\`\`javascript
// 响应中包含相关链接
{
  "data": {
    "id": 123,
    "name": "张三",
    "links": {
      "self": "/api/users/123",
      "posts": "/api/users/123/posts",
      "followers": "/api/users/123/followers"
    }
  }
}
\`\`\`

### 2. 提供完善的文档

\`\`\`
使用 Swagger/OpenAPI 规范
提供交互式 API 文档
包含请求示例和响应示例
说明错误码和处理方式
\`\`\`

### 3. 版本管理

\`\`\`
保持向后兼容
提前通知废弃的 API
提供迁移指南
\`\`\`

### 4. 性能优化

\`\`\`javascript
// 使用 ETag 缓存
GET /api/users/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

Response: 304 Not Modified

// 字段过滤
GET /api/users?fields=id,name,email

// 批量操作
POST /api/users/batch
{
  "operations": [
    { "method": "POST", "path": "/users", "body": {...} },
    { "method": "PUT", "path": "/users/123", "body": {...} }
  ]
}
\`\`\`

### 5. 错误处理

\`\`\`javascript
// 提供详细的错误信息
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "余额不足",
    "details": {
      "balance": 100,
      "required": 200
    },
    "suggestion": "请先充值"
  }
}
\`\`\`

---

## 📋 实战示例

### 用户管理 API

\`\`\`javascript
// 获取用户列表
GET /api/v1/users?page=1&size=10&role=admin

// 获取用户详情
GET /api/v1/users/123

// 创建用户
POST /api/v1/users
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "password": "123456"
}

// 更新用户
PUT /api/v1/users/123
{
  "username": "zhangsan",
  "email": "zhangsan@example.com"
}

// 部分更新
PATCH /api/v1/users/123
{
  "email": "newemail@example.com"
}

// 删除用户
DELETE /api/v1/users/123

// 获取用户的文章
GET /api/v1/users/123/posts

// 关注用户
POST /api/v1/users/123/follow

// 取消关注
DELETE /api/v1/users/123/follow
\`\`\`

---

## 🎓 总结

RESTful API 设计是后端开发的核心技能。通过本指南，你应该已经了解了：

- REST 架构的核心原则
- HTTP 方法的正确使用
- URL 设计规范
- 状态码和响应格式
- 安全性和最佳实践

遵循这些规范，你可以设计出优雅、易用、可维护的 API！

---

**参考资源：**
- [RESTful API 设计指南](https://restfulapi.net/)
- [HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [OpenAPI 规范](https://swagger.io/specification/)`,
  type: 'TEXT' as const,
  uploaderId: 6,
  uploaderName: '孙八',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunba',
  categoryId: 21,
  categoryName: 'Spring Boot',
  tags: 'RESTful,API设计,后端开发,接口规范',
  status: 1,
  createdAt: '2025-12-15T16:45:00Z',
  updatedAt: '2026-01-10T12:00:00Z',
  contentHash: 'hash_restful_api_design',
};
