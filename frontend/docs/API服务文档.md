# EduChain 前端API服务文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | EduChain 前端API服务 |
| 基础URL | /api |
| HTTP客户端 | Axios |

---

## 一、API架构

### 1.1 服务层结构

```
services/
├── api.ts              # Axios实例和基础配置
├── auth.ts             # 认证服务
├── knowledge.ts        # 知识内容服务
├── user.ts             # 用户服务
├── search.ts           # 搜索服务
├── blockchain.ts       # 区块链服务
├── interaction.ts      # 互动服务
├── notification.ts     # 通知服务
├── category.ts         # 分类服务
├── community.ts        # 社区服务
├── admin.ts            # 管理服务
└── index.ts            # 统一导出
```

### 1.2 请求封装

```typescript
// api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 通用请求方法
export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    api.get(url, config).then(res => res.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.post(url, data, config).then(res => res.data),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.put(url, data, config).then(res => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    api.delete(url, config).then(res => res.data),
};
```

### 1.3 响应类型

```typescript
// 统一响应格式
interface ApiResponse<T = unknown> {
  success: boolean;
  code?: string;
  message: string;
  data: T;
  timestamp?: string;
}

// 分页响应格式
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

---

## 二、认证服务 (authService)

### 2.1 用户登录

```typescript
authService.login(data: LoginRequest): Promise<ApiResponse<LoginResponse>>
```

**请求参数**：
```typescript
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
```

**响应数据**：
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}
```

**使用示例**：
```typescript
const response = await authService.login({
  usernameOrEmail: 'admin',
  password: '123456'
});
const { accessToken, user } = response.data;
```

### 2.2 用户注册

```typescript
authService.register(data: RegisterRequest): Promise<ApiResponse<User>>
```

**请求参数**：
```typescript
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  school?: string;
}
```

### 2.3 刷新Token

```typescript
authService.refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>>
```

### 2.4 登出

```typescript
authService.logout(userId: number): Promise<ApiResponse<void>>
```

### 2.5 获取当前用户

```typescript
authService.getCurrentUser(): Promise<ApiResponse<User>>
```

### 2.6 修改密码

```typescript
authService.changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<void>>
```

---

## 三、知识服务 (knowledgeService)

### 3.1 获取知识列表

```typescript
knowledgeService.getKnowledgeList(params: PageRequest & {
  categoryId?: number;
  type?: string;
}): Promise<ApiResponse<PageResponse<KnowledgeItem>>>
```

**使用示例**：
```typescript
const response = await knowledgeService.getKnowledgeList({
  page: 0,
  size: 10,
  categoryId: 1,
  type: 'TEXT'
});
const { content, totalElements } = response.data;
```

### 3.2 获取知识详情

```typescript
// 通过分享码获取
knowledgeService.getKnowledgeByShareCode(shareCode: string): Promise<ApiResponse<KnowledgeItem>>

// 通过ID获取
knowledgeService.getKnowledgeById(id: number): Promise<ApiResponse<KnowledgeItem>>
```

### 3.3 创建知识

```typescript
knowledgeService.createKnowledge(data: CreateKnowledgeRequest): Promise<ApiResponse<KnowledgeItem>>
```

**请求参数**：
```typescript
interface CreateKnowledgeRequest {
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  mediaUrls?: string[];
  linkUrl?: string;
  categoryId?: number;
  tags?: string;
}
```

### 3.4 更新知识

```typescript
knowledgeService.updateKnowledge(id: number, data: Partial<CreateKnowledgeRequest>): Promise<ApiResponse<KnowledgeItem>>
```

### 3.5 删除知识

```typescript
knowledgeService.deleteKnowledge(id: number): Promise<ApiResponse<void>>
```

### 3.6 搜索知识

```typescript
knowledgeService.searchKnowledge(keyword: string, params: PageRequest): Promise<ApiResponse<PageResponse<KnowledgeItem>>>
```

### 3.7 获取热门内容

```typescript
knowledgeService.getPopularKnowledge(params: PageRequest): Promise<ApiResponse<PageResponse<KnowledgeItem>>>
```

### 3.8 获取最新内容

```typescript
knowledgeService.getLatestKnowledge(params: PageRequest): Promise<ApiResponse<PageResponse<KnowledgeItem>>>
```

### 3.9 获取推荐内容

```typescript
knowledgeService.getRecommendedKnowledge(params: PageRequest): Promise<ApiResponse<PageResponse<KnowledgeItem>>>
```

### 3.10 获取相关内容

```typescript
knowledgeService.getRelatedKnowledge(id: number, limit?: number): Promise<ApiResponse<KnowledgeItem[]>>
```

### 3.11 版本管理

```typescript
// 获取版本历史
knowledgeService.getVersionHistory(id: number, params: PageRequest): Promise<ApiResponse<PageResponse<KnowledgeVersion>>>

// 恢复到指定版本
knowledgeService.restoreToVersion(id: number, versionNumber: number, changeSummary?: string): Promise<ApiResponse<KnowledgeItem>>

// 比较版本差异
knowledgeService.compareVersions(id: number, version1: number, version2: number): Promise<ApiResponse<VersionDiff>>
```

---

## 四、用户服务 (userService)

### 4.1 获取用户信息

```typescript
userService.getUserById(id: number): Promise<ApiResponse<User>>
```

### 4.2 更新用户信息

```typescript
userService.updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>>
```

### 4.3 获取用户统计

```typescript
userService.getUserStats(userId: number): Promise<ApiResponse<UserStats>>
```

**响应数据**：
```typescript
interface UserStats {
  userId: number;
  knowledgeCount: number;
  likeCount: number;
  favoriteCount: number;
  followingCount: number;
  followerCount: number;
  viewCount: number;
}
```

### 4.4 上传头像

```typescript
userService.uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>>
```

---

## 五、搜索服务 (searchService)

### 5.1 搜索

```typescript
searchService.search(params: SearchRequest): Promise<ApiResponse<SearchResult>>
```

**请求参数**：
```typescript
interface SearchRequest {
  keyword: string;
  categoryId?: number;
  type?: string;
  sortBy?: 'RELEVANCE' | 'TIME' | 'POPULARITY';
  page?: number;
  size?: number;
}
```

### 5.2 获取热门关键词

```typescript
searchService.getHotKeywords(limit?: number): Promise<ApiResponse<string[]>>
```

### 5.3 获取搜索建议

```typescript
searchService.getSuggestions(keyword: string): Promise<ApiResponse<string[]>>
```

### 5.4 记录搜索历史

```typescript
searchService.recordSearch(keyword: string): Promise<ApiResponse<void>>
```

---

## 六、区块链服务 (blockchainService)

### 6.1 内容存证

```typescript
blockchainService.certify(data: CertifyRequest): Promise<ApiResponse<CertifyResponse>>
```

**请求参数**：
```typescript
interface CertifyRequest {
  type: string;
  knowledgeId: number;
  userId: number;
  contentHash: string;
  metadata?: Record<string, unknown>;
}
```

### 6.2 内容验证

```typescript
blockchainService.verify(data: VerifyRequest): Promise<ApiResponse<VerifyResponse>>
```

**请求参数**：
```typescript
interface VerifyRequest {
  knowledgeId: number;
  contentHash: string;
}
```

### 6.3 获取区块链信息

```typescript
blockchainService.getChainInfo(): Promise<ApiResponse<ChainInfo>>
```

### 6.4 获取区块详情

```typescript
blockchainService.getBlock(index: number): Promise<ApiResponse<Block>>
```

### 6.5 获取交易详情

```typescript
blockchainService.getTransaction(knowledgeId: number): Promise<ApiResponse<Transaction>>
```

### 6.6 生成证书

```typescript
blockchainService.generateCertificate(data: CertificateRequest): Promise<ApiResponse<CertificateResponse>>
```

### 6.7 验证证书

```typescript
blockchainService.verifyCertificate(certificateId: string): Promise<ApiResponse<CertificateVerifyResult>>
```

---

## 七、互动服务 (interactionService)

### 7.1 点赞

```typescript
interactionService.like(knowledgeId: number): Promise<ApiResponse<void>>
interactionService.unlike(knowledgeId: number): Promise<ApiResponse<void>>
```

### 7.2 收藏

```typescript
interactionService.favorite(knowledgeId: number): Promise<ApiResponse<void>>
interactionService.unfavorite(knowledgeId: number): Promise<ApiResponse<void>>
```

### 7.3 获取互动状态

```typescript
interactionService.getInteractionStats(knowledgeId: number): Promise<ApiResponse<InteractionStats>>
```

**响应数据**：
```typescript
interface InteractionStats {
  knowledgeId: number;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  commentCount: number;
  userLiked?: boolean;
  userFavorited?: boolean;
}
```

### 7.4 评论

```typescript
// 获取评论列表
interactionService.getComments(knowledgeId: number, params: PageRequest): Promise<ApiResponse<PageResponse<Comment>>>

// 发表评论
interactionService.createComment(data: CreateCommentRequest): Promise<ApiResponse<Comment>>

// 删除评论
interactionService.deleteComment(commentId: number): Promise<ApiResponse<void>>
```

### 7.5 关注

```typescript
// 关注用户
interactionService.follow(userId: number): Promise<ApiResponse<void>>

// 取消关注
interactionService.unfollow(userId: number): Promise<ApiResponse<void>>

// 获取关注状态
interactionService.getFollowStats(userId: number): Promise<ApiResponse<FollowStats>>
```

---

## 八、通知服务 (notificationService)

### 8.1 获取通知列表

```typescript
notificationService.getNotifications(params: PageRequest): Promise<ApiResponse<PageResponse<Notification>>>
```

### 8.2 获取未读数量

```typescript
notificationService.getUnreadCount(): Promise<ApiResponse<number>>
```

### 8.3 标记已读

```typescript
notificationService.markAsRead(notificationId: number): Promise<ApiResponse<void>>
notificationService.markAllAsRead(): Promise<ApiResponse<void>>
```

---

## 九、分类服务 (categoryService)

### 9.1 获取分类树

```typescript
categoryService.getCategoryTree(): Promise<ApiResponse<Category[]>>
```

### 9.2 获取分类详情

```typescript
categoryService.getCategoryById(id: number): Promise<ApiResponse<Category>>
```

### 9.3 创建分类

```typescript
categoryService.createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>>
```

### 9.4 更新分类

```typescript
categoryService.updateCategory(id: number, data: Partial<Category>): Promise<ApiResponse<Category>>
```

### 9.5 删除分类

```typescript
categoryService.deleteCategory(id: number): Promise<ApiResponse<void>>
```

---

## 十、管理服务 (adminService)

### 10.1 用户管理

```typescript
// 获取用户列表
adminService.getUsers(params: PageRequest & { status?: number }): Promise<ApiResponse<PageResponse<User>>>

// 禁用用户
adminService.disableUser(userId: number): Promise<ApiResponse<void>>

// 启用用户
adminService.enableUser(userId: number): Promise<ApiResponse<void>>
```

### 10.2 内容管理

```typescript
// 获取内容列表
adminService.getKnowledgeList(params: PageRequest & { status?: number }): Promise<ApiResponse<PageResponse<KnowledgeItem>>>

// 审核内容
adminService.reviewKnowledge(id: number, status: number): Promise<ApiResponse<void>>

// 删除内容
adminService.deleteKnowledge(id: number): Promise<ApiResponse<void>>
```

### 10.3 系统统计

```typescript
adminService.getSystemStats(): Promise<ApiResponse<SystemStats>>
```

### 10.4 系统日志

```typescript
adminService.getSystemLogs(params: PageRequest & { type?: string }): Promise<ApiResponse<PageResponse<SystemLog>>>
```

---

## 十一、错误处理

### 11.1 错误码定义

| 错误码 | 说明 |
|--------|------|
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 11.2 错误处理示例

```typescript
try {
  const response = await knowledgeService.createKnowledge(data);
  message.success('创建成功');
} catch (error) {
  if (error.response?.status === 401) {
    // 跳转登录
    navigate('/login');
  } else {
    message.error(error.message || '操作失败');
  }
}
```

---

## 十二、请求拦截器

### 12.1 请求拦截

```typescript
api.interceptors.request.use(async config => {
  // 添加Token
  const token = TokenManager.getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Token即将过期时自动刷新
  if (TokenManager.isTokenExpiringSoon(token)) {
    await refreshTokenIfNeeded();
  }
  
  return config;
});
```

### 12.2 响应拦截

```typescript
api.interceptors.response.use(
  response => {
    // 检查业务状态码
    if (!response.data.success) {
      return Promise.reject(new Error(response.data.message));
    }
    return response;
  },
  error => {
    // 处理HTTP错误
    handleApiError(error);
    return Promise.reject(error);
  }
);
```

---

**文档结束**
