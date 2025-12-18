# EduChain API 文档

## 1. 概述

### 1.1 基本信息

| 项目 | 说明 |
|------|------|
| 基础URL | `http://localhost:8080/api` |
| 认证方式 | JWT Bearer Token |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

### 1.2 在线文档

- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v3/api-docs

### 1.3 认证方式

```
Authorization: Bearer <token>
```

### 1.4 响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "错误信息",
  "errorCode": "ERROR_CODE"
}
```

## 2. 接口分类

### 2.1 公开接口 (无需认证)

| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/register` | POST | 用户注册 |
| `/auth/login` | POST | 用户登录 |
| `/auth/check-username` | GET | 检查用户名 |
| `/auth/check-email` | GET | 检查邮箱 |
| `/categories/**` | GET | 分类查询 |
| `/tags/**` | GET | 标签查询 |
| `/search/**` | GET/POST | 搜索功能 |
| `/knowledge/share/{code}` | GET | 分享码访问 |

### 2.2 用户接口 (需要认证)

| 接口 | 方法 | 说明 |
|------|------|------|
| `/users/me` | GET/PUT | 当前用户信息 |
| `/knowledge/**` | ALL | 知识内容管理 |
| `/comments/**` | ALL | 评论管理 |
| `/interactions/**` | ALL | 互动操作 |
| `/follows/**` | ALL | 关注操作 |
| `/notifications/**` | ALL | 通知管理 |

### 2.3 管理员接口 (需要ADMIN角色)

| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/users/**` | ALL | 用户管理 |
| `/admin/knowledge-items/**` | ALL | 内容审核 |
| `/admin/comments/**` | ALL | 评论审核 |
| `/admin/statistics/**` | GET | 统计数据 |

## 3. 认证接口

### 3.1 用户注册

**POST** `/auth/register`

```json
// 请求
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

// 响应
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "LEARNER"
  }
}
```

### 3.2 用户登录

**POST** `/auth/login`

```json
// 请求
{
  "username": "testuser",
  "password": "password123"
}

// 响应
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "username": "testuser",
      "role": "LEARNER"
    }
  }
}
```

### 3.3 刷新令牌

**POST** `/auth/refresh`

```json
// 请求
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

## 4. 用户接口

### 4.1 获取当前用户

**GET** `/users/me`

```json
// 响应
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "测试用户",
    "avatarUrl": "http://...",
    "school": "XX大学",
    "level": 5,
    "bio": "个人简介",
    "role": "LEARNER"
  }
}
```

### 4.2 更新用户信息

**PUT** `/users/me`

```json
// 请求
{
  "fullName": "新名字",
  "school": "XX大学",
  "bio": "新简介"
}
```

### 4.3 修改密码

**PUT** `/users/me/password`

```json
// 请求
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## 5. 知识内容接口

### 5.1 创建知识

**POST** `/knowledge`

```json
// 请求
{
  "title": "知识标题",
  "content": "知识内容...",
  "type": "TEXT",
  "categoryId": 1,
  "tags": "Java,Spring Boot"
}

// 响应
{
  "code": 200,
  "data": {
    "id": 1,
    "shareCode": "abc123xyz",
    "title": "知识标题",
    "type": "TEXT",
    "status": 1
  }
}
```

### 5.2 获取知识详情

**GET** `/knowledge/{id}`

### 5.3 通过分享码获取

**GET** `/knowledge/share/{shareCode}`

### 5.4 分页查询

**GET** `/knowledge?page=0&size=20&categoryId=1`

### 5.5 搜索知识

**GET** `/knowledge/search?keyword=Java&page=0&size=20`

### 5.6 更新知识

**PUT** `/knowledge/{id}`

### 5.7 删除知识

**DELETE** `/knowledge/{id}`

## 6. 评论接口

### 6.1 创建评论

**POST** `/comments`

```json
// 请求
{
  "knowledgeId": 1,
  "content": "评论内容",
  "parentId": null
}
```

### 6.2 获取评论列表

**GET** `/comments/knowledge/{knowledgeId}?page=0&size=20`

### 6.3 删除评论

**DELETE** `/comments/{commentId}`

## 7. 互动接口

### 7.1 点赞

**POST** `/interactions/like/{knowledgeId}`

### 7.2 取消点赞

**DELETE** `/interactions/like/{knowledgeId}`

### 7.3 收藏

**POST** `/interactions/favorite/{knowledgeId}`

### 7.4 取消收藏

**DELETE** `/interactions/favorite/{knowledgeId}`

### 7.5 获取互动状态

**GET** `/interactions/status/{knowledgeId}`

```json
// 响应
{
  "code": 200,
  "data": {
    "liked": true,
    "favorited": false
  }
}
```

## 8. 关注接口

### 8.1 关注用户

**POST** `/follows/{userId}`

### 8.2 取消关注

**DELETE** `/follows/{userId}`

### 8.3 获取关注列表

**GET** `/follows/following?page=0&size=20`

### 8.4 获取粉丝列表

**GET** `/follows/followers?page=0&size=20`

## 9. 通知接口

### 9.1 获取通知列表

**GET** `/notifications?page=0&size=20`

### 9.2 获取未读通知

**GET** `/notifications/unread?page=0&size=20`

### 9.3 标记已读

**PUT** `/notifications/{id}/read`

### 9.4 标记全部已读

**PUT** `/notifications/read-all`

### 9.5 获取未读数量

**GET** `/notifications/unread/count`

## 10. 搜索接口

### 10.1 快速搜索

**GET** `/search/quick?keyword=Java&page=0&size=20`

### 10.2 高级搜索

**POST** `/search/advanced`

```json
// 请求
{
  "keyword": "Java",
  "categoryId": 1,
  "type": "TEXT",
  "sortBy": "relevance"
}
```

### 10.3 搜索建议

**GET** `/search/suggestions?prefix=Ja&limit=10`

### 10.4 热门关键词

**GET** `/search/hot-keywords?limit=20`

### 10.5 个性化推荐

**GET** `/search/recommendations/personalized?limit=20`

## 11. 区块链接口

### 11.1 获取概览

**GET** `/blockchain/overview`

```json
// 响应
{
  "code": 200,
  "data": {
    "totalBlocks": 100,
    "totalTransactions": 500,
    "chainValid": true,
    "latestBlock": {
      "index": 99,
      "hash": "abc123..."
    }
  }
}
```

### 11.2 获取区块列表

**GET** `/blockchain/blocks?page=0&size=20`

### 11.3 获取区块详情

**GET** `/blockchain/blocks/{index}`

### 11.4 获取交易详情

**GET** `/blockchain/transactions/{knowledgeId}`

### 11.5 验证内容

**POST** `/blockchain/verify`

### 11.6 生成证书

**POST** `/blockchain/certificates`

### 11.7 下载证书

**GET** `/blockchain/certificates/{id}/download`

## 12. 管理员接口

### 12.1 用户管理

**GET** `/admin/users?page=0&size=20`

**PUT** `/admin/users/{id}/disable?reason=违规`

**PUT** `/admin/users/{id}/enable?reason=解封`

### 12.2 内容审核

**GET** `/admin/knowledge-items/pending?page=0&size=20`

**PUT** `/admin/knowledge-items/{id}/approve`

**PUT** `/admin/knowledge-items/{id}/reject?reason=内容不合规`

### 12.3 评论审核

**GET** `/admin/comments/pending?page=0&size=20`

**PUT** `/admin/comments/{id}/approve`

**PUT** `/admin/comments/{id}/reject?reason=违规`

### 12.4 统计数据

**GET** `/admin/statistics/system`

**GET** `/admin/statistics/users`

**GET** `/admin/statistics/content`

## 13. 错误码

| 错误码 | HTTP状态 | 说明 |
|--------|----------|------|
| 200 | 200 | 成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未认证 |
| 403 | 403 | 无权限 |
| 404 | 404 | 资源不存在 |
| 429 | 429 | 请求过于频繁 |
| 500 | 500 | 服务器错误 |

## 14. 限流说明

| 接口 | 限制 | 时间窗口 |
|------|------|----------|
| /auth/register | 5次 | 60秒 |
| /auth/login | 10次 | 60秒 |
| /search | 50次 | 60秒 |
| 其他API | 200次 | 60秒 |
