# EduChain API接口文档

## 1. 概述

### 1.1 基本信息

- **基础URL**: `http://localhost:8080/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 认证说明

除公开接口外，所有接口需要在请求头中携带JWT令牌：

```
Authorization: Bearer <token>
```

### 1.3 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "errorCode": null
}
```

### 1.4 分页响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 5,
    "size": 20,
    "number": 0
  }
}
```

### 1.5 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 2. 认证管理 (AuthController)

### 2.1 用户注册

**POST** `/auth/register`

**请求体**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "测试用户"
}
```

**响应**:
```json
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

**限流**: 5次/分钟/IP

---

### 2.2 用户登录

**POST** `/auth/login`

**请求体**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应**:
```json
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

**限流**: 10次/分钟/IP

---

### 2.3 刷新令牌

**POST** `/auth/refresh`

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

---

### 2.4 用户登出

**POST** `/auth/logout`

**请求体**:
```json
{
  "userId": 1
}
```

---

### 2.5 检查用户名可用性

**GET** `/auth/check-username?username=testuser`

**响应**:
```json
{
  "code": 200,
  "message": "用户名可用",
  "data": true
}
```

---

### 2.6 检查邮箱可用性

**GET** `/auth/check-email?email=test@example.com`

---

### 2.7 获取活跃用户数

**GET** `/auth/stats/active-users`

---

## 3. 用户管理 (UserController)

### 3.1 获取当前用户信息

**GET** `/users/me`

**响应**:
```json
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
    "role": "LEARNER",
    "status": 1,
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

---

### 3.2 更新用户信息

**PUT** `/users/me`

**请求体**:
```json
{
  "fullName": "新名字",
  "avatarUrl": "http://...",
  "school": "XX大学",
  "bio": "新简介"
}
```

---

### 3.3 修改密码

**PUT** `/users/me/password`

**请求体**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

### 3.4 获取用户统计

**GET** `/users/me/stats`

**响应**:
```json
{
  "code": 200,
  "data": {
    "totalKnowledge": 10,
    "totalLikes": 100,
    "totalFavorites": 50,
    "totalViews": 1000,
    "followers": 20,
    "following": 15
  }
}
```

---

### 3.5 根据ID获取用户

**GET** `/users/{userId}`

---

### 3.6 搜索用户

**GET** `/users/search?keyword=test&page=0&size=20`

---

### 3.7 获取所有用户 (管理员)

**GET** `/users?page=0&size=20&sortBy=createdAt&sortDir=desc`

**权限**: ADMIN

---

### 3.8 更新用户状态 (管理员)

**PUT** `/users/{userId}/status`

**请求体**:
```json
{
  "status": 0
}
```

**权限**: ADMIN

---

## 4. 知识内容管理 (KnowledgeItemController)

### 4.1 创建知识内容

**POST** `/knowledge`

**请求体**:
```json
{
  "title": "知识标题",
  "content": "知识内容...",
  "type": "TEXT",
  "categoryId": 1,
  "tags": "Java,Spring Boot",
  "linkUrl": "http://..."
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "shareCode": "abc123xyz",
    "title": "知识标题",
    "content": "知识内容...",
    "type": "TEXT",
    "categoryId": 1,
    "uploaderId": 1,
    "status": 1,
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

---

### 4.2 创建知识内容(带文件)

**POST** `/knowledge/with-files`

**Content-Type**: `multipart/form-data`

**参数**:
- `request`: JSON格式的创建请求
- `files`: 文件列表

---

### 4.3 更新知识内容

**PUT** `/knowledge/{id}`

**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "tags": "Java,Spring"
}
```

---

### 4.4 删除知识内容

**DELETE** `/knowledge/{id}`

---

### 4.5 批量删除

**POST** `/knowledge/batch-delete`

**请求体**:
```json
[1, 2, 3, 4, 5]
```

---

### 4.6 恢复已删除内容

**PUT** `/knowledge/{id}/restore`

---

### 4.7 通过分享码获取内容

**GET** `/knowledge/share/{shareCode}`

**说明**: 公开接口，无需认证

---

### 4.8 获取内容详情

**GET** `/knowledge/{id}`

---

### 4.9 分页查询知识内容

**GET** `/knowledge?page=0&size=20`

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码 |
| size | int | 每页大小 |
| categoryId | Long | 分类ID |
| type | String | 内容类型 |
| keyword | String | 关键词 |
| sortBy | String | 排序字段 |

---

### 4.10 获取用户的知识内容

**GET** `/knowledge/user/{userId}?page=0&size=20`

---

### 4.11 获取分类下的内容

**GET** `/knowledge/category/{categoryId}?page=0&size=20`

---

### 4.12 根据标签获取内容

**GET** `/knowledge/tag/{tag}?page=0&size=20`

---

### 4.13 搜索知识内容

**GET** `/knowledge/search?keyword=Java&page=0&size=20`

---

### 4.14 高级搜索

**POST** `/knowledge/advanced-search?page=0&size=20`

**请求体**:
```json
{
  "keyword": "Java",
  "categoryId": 1,
  "type": "TEXT",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

---

### 4.15 获取热门内容

**GET** `/knowledge/popular?page=0&size=20`

---

### 4.16 获取最新内容

**GET** `/knowledge/latest?page=0&size=20`

---

### 4.17 获取推荐内容

**GET** `/knowledge/recommended?page=0&size=20`

---

### 4.18 获取相关内容

**GET** `/knowledge/{id}/related?limit=10`

---

### 4.19 获取版本历史

**GET** `/knowledge/{id}/versions?page=0&size=10`

---

### 4.20 获取指定版本

**GET** `/knowledge/{id}/versions/{versionNumber}`

---

### 4.21 恢复到指定版本

**POST** `/knowledge/{id}/restore-version?versionNumber=1&changeSummary=恢复`

---

### 4.22 比较版本差异

**GET** `/knowledge/{id}/compare-versions?version1=1&version2=2`

---

### 4.23 保存草稿

**POST** `/knowledge/drafts`

---

### 4.24 发布草稿

**POST** `/knowledge/{id}/publish`

---

### 4.25 获取用户草稿

**GET** `/knowledge/drafts?page=0&size=20`

---

### 4.26 获取知识统计

**GET** `/knowledge/stats`

---

## 5. 分类管理 (CategoryController)

### 5.1 获取分类树

**GET** `/categories/tree`

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "编程语言",
      "children": [
        {"id": 2, "name": "Java"},
        {"id": 3, "name": "Python"}
      ]
    }
  ]
}
```

---

### 5.2 获取所有分类

**GET** `/categories`

---

### 5.3 获取分类详情

**GET** `/categories/{id}`

---

### 5.4 创建分类 (管理员)

**POST** `/categories`

**请求体**:
```json
{
  "name": "新分类",
  "description": "分类描述",
  "parentId": 1,
  "sortOrder": 0
}
```

---

### 5.5 更新分类 (管理员)

**PUT** `/categories/{id}`

---

### 5.6 删除分类 (管理员)

**DELETE** `/categories/{id}`

---

## 6. 标签管理 (TagController)

### 6.1 获取所有标签

**GET** `/tags?page=0&size=50`

---

### 6.2 获取热门标签

**GET** `/tags/popular?limit=20`

---

### 6.3 搜索标签

**GET** `/tags/search?keyword=Java&limit=10`

---

### 6.4 创建标签

**POST** `/tags`

**请求体**:
```json
{
  "name": "新标签",
  "description": "标签描述",
  "category": "技术",
  "color": "#FF5733"
}
```

---

## 7. 评论管理 (CommentController)

### 7.1 创建评论

**POST** `/comments`

**请求体**:
```json
{
  "knowledgeId": 1,
  "content": "评论内容",
  "parentId": null
}
```

---

### 7.2 回复评论

**POST** `/comments`

**请求体**:
```json
{
  "knowledgeId": 1,
  "content": "回复内容",
  "parentId": 5
}
```

---

### 7.3 删除评论

**DELETE** `/comments/{commentId}`

---

### 7.4 获取评论详情

**GET** `/comments/{commentId}`

---

### 7.5 获取知识内容的评论

**GET** `/comments/knowledge/{knowledgeId}?page=0&size=20`

---

### 7.6 获取评论回复

**GET** `/comments/{commentId}/replies`

---

### 7.7 获取评论树结构

**GET** `/comments/tree/{knowledgeId}`

---

### 7.8 获取用户评论

**GET** `/comments/user?page=0&size=20`

---

### 7.9 获取热门评论

**GET** `/comments/popular/{knowledgeId}?limit=10`

---

### 7.10 获取评论统计

**GET** `/comments/stats/{knowledgeId}`

---

### 7.11 管理员删除评论

**DELETE** `/comments/admin/{commentId}`

**权限**: ADMIN

---

### 7.12 审核通过评论

**PUT** `/comments/admin/{commentId}/approve`

**权限**: ADMIN

---

### 7.13 拒绝评论

**PUT** `/comments/admin/{commentId}/reject`

**权限**: ADMIN

---

## 8. 用户互动 (UserInteractionController)

### 8.1 点赞

**POST** `/interactions/like/{knowledgeId}`

---

### 8.2 取消点赞

**DELETE** `/interactions/like/{knowledgeId}`

---

### 8.3 收藏

**POST** `/interactions/favorite/{knowledgeId}`

---

### 8.4 取消收藏

**DELETE** `/interactions/favorite/{knowledgeId}`

---

### 8.5 获取用户点赞列表

**GET** `/interactions/likes?page=0&size=20`

---

### 8.6 获取用户收藏列表

**GET** `/interactions/favorites?page=0&size=20`

---

### 8.7 检查互动状态

**GET** `/interactions/status/{knowledgeId}`

**响应**:
```json
{
  "code": 200,
  "data": {
    "liked": true,
    "favorited": false
  }
}
```

---

## 9. 用户关注 (UserFollowController)

### 9.1 关注用户

**POST** `/follows/{userId}`

---

### 9.2 取消关注

**DELETE** `/follows/{userId}`

---

### 9.3 获取关注列表

**GET** `/follows/following?page=0&size=20`

---

### 9.4 获取粉丝列表

**GET** `/follows/followers?page=0&size=20`

---

### 9.5 检查关注状态

**GET** `/follows/status/{userId}`

---

## 10. 通知管理 (NotificationController)

### 10.1 获取用户通知

**GET** `/notifications?page=0&size=20`

---

### 10.2 获取未读通知

**GET** `/notifications/unread?page=0&size=20`

---

### 10.3 获取特定类型通知

**GET** `/notifications/type/{type}?page=0&size=20`

**类型**: LIKE, COMMENT, REPLY, FOLLOW, SYSTEM

---

### 10.4 标记为已读

**PUT** `/notifications/{notificationId}/read`

---

### 10.5 标记所有为已读

**PUT** `/notifications/read-all`

---

### 10.6 删除通知

**DELETE** `/notifications/{notificationId}`

---

### 10.7 获取未读数量

**GET** `/notifications/unread/count`

---

### 10.8 获取通知统计

**GET** `/notifications/stats`

---

### 10.9 创建系统通知 (管理员)

**POST** `/notifications/admin/system?title=标题&content=内容`

**权限**: ADMIN

---

## 11. 搜索推荐 (SearchController)

### 11.1 执行搜索

**POST** `/search`

**请求体**:
```json
{
  "keyword": "Java",
  "categoryId": 1,
  "page": 0,
  "size": 20,
  "sortBy": "relevance"
}
```

---

### 11.2 快速搜索

**GET** `/search/quick?keyword=Java&page=0&size=20`

---

### 11.3 高级搜索

**POST** `/search/advanced`

---

### 11.4 获取搜索建议

**GET** `/search/suggestions?prefix=Ja&limit=10`

---

### 11.5 获取热门关键词

**GET** `/search/hot-keywords?period=week&limit=20`

---

### 11.6 获取趋势关键词

**GET** `/search/trending-keywords?limit=15`

---

### 11.7 获取相关关键词

**GET** `/search/related-keywords?keyword=Java&limit=10`

---

### 11.8 获取搜索趋势

**GET** `/search/trend/{keyword}?days=30`

---

### 11.9 个性化推荐

**GET** `/search/recommendations/personalized?limit=20`

---

### 11.10 热门推荐

**GET** `/search/recommendations/popular?categoryId=1&limit=20`

---

### 11.11 最新推荐

**GET** `/search/recommendations/latest?limit=20`

---

### 11.12 相似内容推荐

**GET** `/search/recommendations/similar/{knowledgeId}?limit=15`

---

### 11.13 混合推荐

**GET** `/search/recommendations/hybrid?limit=20`

---

### 11.14 获取搜索历史

**GET** `/search/history?limit=20`

---

### 11.15 清空搜索历史

**DELETE** `/search/history`

---

### 11.16 获取搜索统计

**GET** `/search/statistics`

---

## 12. 区块链浏览器 (BlockchainController)

### 12.1 获取区块链概览

**GET** `/blockchain/overview`

**响应**:
```json
{
  "code": 200,
  "data": {
    "totalBlocks": 100,
    "totalTransactions": 500,
    "chainValid": true,
    "pendingTransactions": 5,
    "latestBlock": {
      "index": 99,
      "hash": "abc123...",
      "timestamp": "2024-01-01T00:00:00",
      "transactionsCount": 10
    }
  }
}
```

---

### 12.2 获取区块列表

**GET** `/blockchain/blocks?page=0&size=20`

---

### 12.3 获取区块详情

**GET** `/blockchain/blocks/{index}`

---

### 12.4 获取交易详情

**GET** `/blockchain/transactions/{knowledgeId}`

---

### 12.5 搜索区块链

**GET** `/blockchain/search?searchType=block&keyword=10`

**搜索类型**: block, knowledge

---

### 12.6 获取统计信息

**GET** `/blockchain/statistics`

---

### 12.7 验证内容

**POST** `/blockchain/verify`

**请求体**:
```json
{
  "blockIndex": 10,
  "message": "content_hash"
}
```

---

### 12.8 存证内容

**POST** `/blockchain/certify`

**请求体**:
```json
{
  "knowledge_id": 1,
  "user_id": 1,
  "content_hash": "sha256:...",
  "type": "CREATE"
}
```

---

### 12.9 生成存证证书

**POST** `/blockchain/certificates`

---

### 12.10 下载证书

**GET** `/blockchain/certificates/{certificateId}/download`

---

### 12.11 验证证书

**GET** `/blockchain/certificates/{certificateId}/verify`

---

## 13. 文件上传 (FileUploadController)

### 13.1 上传文件

**POST** `/files/upload`

**Content-Type**: `multipart/form-data`

**参数**:
- `file`: 文件

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "fileName": "image.jpg",
    "fileUrl": "http://localhost:8080/uploads/...",
    "fileSize": 102400,
    "mimeType": "image/jpeg"
  }
}
```

---

### 13.2 批量上传

**POST** `/files/upload/batch`

---

### 13.3 删除文件

**DELETE** `/files/{fileId}`

---

### 13.4 获取用户文件列表

**GET** `/files/user?page=0&size=20`

---

## 14. 管理员接口 (AdminController)

**所有接口需要 ADMIN 角色权限**

### 14.1 获取用户列表

**GET** `/admin/users?keyword=&status=1&page=0&size=20`

---

### 14.2 禁用用户

**PUT** `/admin/users/{userId}/disable?reason=违规`

---

### 14.3 启用用户

**PUT** `/admin/users/{userId}/enable?reason=解封`

---

### 14.4 重置用户密码

**PUT** `/admin/users/{userId}/reset-password?newPassword=123456`

---

### 14.5 删除用户

**DELETE** `/admin/users/{userId}?reason=删除原因`

---

### 14.6 获取待审核内容

**GET** `/admin/knowledge-items/pending?page=0&size=20`

---

### 14.7 审核通过内容

**PUT** `/admin/knowledge-items/{knowledgeId}/approve?reason=通过`

---

### 14.8 审核拒绝内容

**PUT** `/admin/knowledge-items/{knowledgeId}/reject?reason=内容不合规`

---

### 14.9 删除知识内容

**DELETE** `/admin/knowledge-items/{knowledgeId}?reason=删除原因`

---

### 14.10 批量删除内容

**DELETE** `/admin/knowledge-items/batch?reason=批量删除`

**请求体**:
```json
[1, 2, 3, 4, 5]
```

---

### 14.11 获取待审核评论

**GET** `/admin/comments/pending?page=0&size=20`

---

### 14.12 审核通过评论

**PUT** `/admin/comments/{commentId}/approve`

---

### 14.13 审核拒绝评论

**PUT** `/admin/comments/{commentId}/reject?reason=内容不当`

---

### 14.14 删除评论

**DELETE** `/admin/comments/{commentId}?reason=删除原因`

---

### 14.15 获取系统统计

**GET** `/admin/statistics/system`

**响应**:
```json
{
  "code": 200,
  "data": {
    "totalUsers": 1000,
    "totalKnowledge": 5000,
    "totalComments": 10000,
    "todayNewUsers": 50,
    "todayNewKnowledge": 100
  }
}
```

---

### 14.16 获取用户统计

**GET** `/admin/statistics/users?startTime=2024-01-01T00:00:00&endTime=2024-12-31T23:59:59`

---

### 14.17 获取内容统计

**GET** `/admin/statistics/content?startTime=2024-01-01T00:00:00&endTime=2024-12-31T23:59:59`

---

### 14.18 获取性能指标

**GET** `/admin/monitoring/performance`

---

### 14.19 获取系统健康状态

**GET** `/admin/monitoring/health`

---

### 14.20 清理过期数据

**POST** `/admin/maintenance/cleanup?daysToKeep=30`

---

### 14.21 重建搜索索引

**POST** `/admin/maintenance/rebuild-index`

---

### 14.22 系统备份

**POST** `/admin/maintenance/backup`

---

### 14.23 发送系统通知

**POST** `/admin/notifications/system?title=标题&content=内容`

**请求体**:
```json
[1, 2, 3]
```

---

### 14.24 导出用户数据

**GET** `/admin/export/users?keyword=&status=1`

---

### 14.25 导出知识内容数据

**GET** `/admin/export/knowledge-items?startTime=2024-01-01T00:00:00&endTime=2024-12-31T23:59:59`

---

## 15. 成就系统 (AchievementController)

### 15.1 获取用户成就

**GET** `/achievements/user/{userId}`

---

### 15.2 获取成就列表

**GET** `/achievements`

---

### 15.3 获取成就详情

**GET** `/achievements/{achievementId}`

---

## 16. 社区功能 (CommunityController)

### 16.1 获取社区动态

**GET** `/community/feed?page=0&size=20`

---

### 16.2 获取社区统计

**GET** `/community/stats`

---

### 16.3 获取热门话题

**GET** `/community/hot-topics?limit=10`

---

### 16.4 获取活跃用户

**GET** `/community/active-users?limit=10`

---

## 17. 统计分析 (StatisticsController)

### 17.1 获取平台统计

**GET** `/statistics/platform`

---

### 17.2 获取知识统计

**GET** `/statistics/knowledge`

---

### 17.3 获取用户统计

**GET** `/statistics/users`

---

### 17.4 生成统计报告

**GET** `/statistics/report?startTime=2024-01-01T00:00:00&endTime=2024-12-31T23:59:59`

---

## 18. 接口限流说明

| 接口 | 限制 | 时间窗口 | 限流类型 |
|------|------|----------|----------|
| /auth/register | 5次 | 60秒 | IP |
| /auth/login | 10次 | 60秒 | IP |
| /auth/refresh | 20次 | 60秒 | USER |
| /search | 50次 | 60秒 | IP |
| /files/upload | 20次 | 60秒 | IP |
| 其他API | 200次 | 60秒 | IP |

---

## 19. Swagger文档

在线API文档地址: `http://localhost:8080/api/swagger-ui.html`

API规范文档: `http://localhost:8080/api/v3/api-docs`
