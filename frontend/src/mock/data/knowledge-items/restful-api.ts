/**
 * RESTful API 设计规范
 */

export const restfulApiKnowledge = {
  id: 14,
  title: 'RESTful API 设计规范',
  content: `REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序的接口。

设计原则：

1. 资源导向
一切皆资源，使用名词而非动词。

2. 统一接口
使用标准的 HTTP 方法。

3. 无状态
每个请求都包含处理该请求所需的所有信息。

4. 可缓存
响应应明确标识是否可缓存。

5. 分层系统
客户端无需知道是否直接连接到最终服务器。

HTTP 方法：

1. GET
获取资源，幂等且安全。

2. POST
创建资源，非幂等。

3. PUT
更新资源（完整更新），幂等。

4. PATCH
部分更新资源，幂等。

5. DELETE
删除资源，幂等。

URL 设计：

1. 使用名词
• 正确：/users
• 错误：/getUsers

2. 使用复数
• 正确：/users/123
• 错误：/user/123

3. 层级关系
• /users/123/posts
• /posts/456/comments

4. 过滤、排序、分页
• /users?role=admin
• /posts?sort=created_at&order=desc
• /articles?page=2&size=20

状态码：

成功响应：
• 200 OK - 请求成功
• 201 Created - 创建成功
• 204 No Content - 成功但无返回内容

客户端错误：
• 400 Bad Request - 请求错误
• 401 Unauthorized - 未授权
• 403 Forbidden - 禁止访问
• 404 Not Found - 资源未找到
• 409 Conflict - 资源冲突

服务器错误：
• 500 Internal Server Error - 服务器错误
• 502 Bad Gateway - 网关错误
• 503 Service Unavailable - 服务不可用

响应格式：

统一的响应结构：
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-11-28T10:00:00Z"
}

错误响应：
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在"
  },
  "timestamp": "2024-11-28T10:00:00Z"
}

版本控制：

1. URL 版本
/api/v1/users

2. Header 版本
Accept: application/vnd.api+json; version=1

3. 参数版本
/api/users?version=1

最佳实践：
• 使用 HTTPS
• 实现身份验证和授权
• 使用 JWT 或 OAuth 2.0
• 实现请求限流
• 提供完善的 API 文档
• 使用 HATEOAS
• 实现 CORS 支持`,
  type: 'TEXT',
  uploaderId: 6,
  uploaderName: '孙八',
  uploaderAvatar: '',
  categoryId: 21,
  categoryName: 'Spring Boot',
  tags: 'RESTful,API设计,后端开发,接口规范',
  status: 1,
  createdAt: '2024-11-15T16:45:00Z',
  updatedAt: '2024-11-28T12:00:00Z',
};
