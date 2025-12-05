# Mock 数据系统使用指南

## 📋 概述

本项目实现了完整的 Mock 数据系统，支持在不依赖后端服务的情况下进行前端开发和测试。

## 🎯 特性

- ✅ **完整的数据覆盖**：包含所有实体的 Mock 数据（用户、知识、评论、通知、区块链等）
- ✅ **真实的数据关系**：Mock 数据之间保持正确的关联关系
- ✅ **丰富的数据量**：每个实体至少 20-50 条数据
- ✅ **简单切换**：通过环境变量一键切换真实后端/Mock 数据
- ✅ **MSW 拦截**：使用 Mock Service Worker 拦截网络请求
- ✅ **类型安全**：完全的 TypeScript 类型支持

## 🚀 快速开始

### 1. 启用 Mock 数据

有两种方式启用 Mock 数据：

#### 方式一：使用 Mock 模式启动（推荐）

```bash
npm run dev:mock
```

#### 方式二：修改环境变量

编辑 `.env.development` 文件：

```env
VITE_USE_MOCK=true
```

然后正常启动：

```bash
npm run dev
```

### 2. 切换回真实后端

#### 方式一：使用开发模式启动

```bash
npm run dev
```

#### 方式二：修改环境变量

编辑 `.env.development` 文件：

```env
VITE_USE_MOCK=false
```

## 📁 目录结构

```
src/mock/
├── data/                    # Mock 数据文件
│   ├── users.ts            # 用户数据（30个用户）
│   ├── categories.ts       # 分类数据（完整分类树）
│   ├── knowledge.ts        # 知识条目（50条）
│   ├── comments.ts         # 评论数据（50+条）
│   ├── notifications.ts    # 通知数据（35条）
│   ├── tags.ts             # 标签数据（40个标签）
│   ├── interactions.ts     # 互动数据（点赞、收藏、浏览）
│   ├── follows.ts          # 关注关系数据
│   ├── blockchain.ts       # 区块链数据（25个区块）
│   ├── search.ts           # 搜索相关数据
│   └── index.ts            # 统一导出
├── server.ts               # MSW 服务器配置
├── index.ts                # Mock 入口文件
└── README.md               # 本文档
```

## 📊 Mock 数据详情

### 用户数据 (users.ts)

- **数量**：30 个用户
- **包含**：
  - 1 个管理员账号
  - 29 个学习者账号
  - 完整的用户统计数据
  - 真实的头像（使用 DiceBear API）

### 知识条目 (knowledge.ts)

- **数量**：50 条知识内容
- **类型**：涵盖前端、后端、数据库、AI、移动开发等
- **包含**：
  - 完整的 Markdown 内容
  - 代码示例
  - 统计数据（浏览、点赞、收藏、评论）

### 评论数据 (comments.ts)

- **数量**：50+ 条评论
- **特性**：
  - 支持嵌套回复
  - 关联真实用户
  - 时间戳真实

### 通知数据 (notifications.ts)

- **数量**：35 条通知
- **类型**：
  - 点赞通知
  - 评论通知
  - 关注通知
  - 系统通知

### 区块链数据 (blockchain.ts)

- **数量**：25 个区块
- **包含**：
  - 完整的区块链结构
  - 交易记录
  - 证书信息（16 个证书）
  - Merkle 树数据

### 标签数据 (tags.ts)

- **数量**：40 个标签
- **特性**：
  - 按分类组织
  - 使用次数统计
  - 颜色标识

### 互动数据 (interactions.ts)

- **类型**：点赞、收藏、浏览
- **特性**：
  - 自动生成大量互动记录
  - 真实的统计数据

### 关注数据 (follows.ts)

- **数量**：47 条关注关系
- **特性**：
  - 关注/粉丝列表
  - 互相关注检测

### 搜索数据 (search.ts)

- **热门关键词**：20 个
- **搜索历史**：每个用户 5-15 条
- **特性**：
  - 趋势分析（上升/下降/稳定）
  - 搜索建议

## 🔧 API 覆盖

Mock 服务器实现了以下 API 端点：

### 认证相关

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/users/me` - 获取当前用户

### 用户相关

- `GET /api/users/:id` - 获取用户信息
- `GET /api/users/:id/stats` - 获取用户统计
- `GET /api/users/me/stats` - 获取当前用户统计

### 分类相关

- `GET /api/categories` - 获取分类列表
- `GET /api/categories/tree` - 获取分类树
- `GET /api/categories/:id` - 获取分类详情

### 知识内容相关

- `GET /api/knowledge` - 获取知识列表（支持分页、分类筛选）
- `GET /api/knowledge/:id` - 获取知识详情
- `POST /api/knowledge` - 创建知识
- `GET /api/knowledge/popular` - 获取热门内容
- `GET /api/knowledge/latest` - 获取最新内容

### 评论相关

- `GET /api/comments` - 获取评论列表
- `POST /api/comments` - 创建评论

### 通知相关

- `GET /api/notifications` - 获取通知列表
- `GET /api/notifications/unread/count` - 获取未读数量
- `PUT /api/notifications/:id/read` - 标记已读

### 互动相关

- `POST /api/interactions/like/:id` - 点赞
- `DELETE /api/interactions/like/:id` - 取消点赞
- `POST /api/interactions/favorite/:id` - 收藏
- `DELETE /api/interactions/favorite/:id` - 取消收藏
- `GET /api/interactions/stats/:id` - 获取互动统计

### 关注相关

- `POST /api/users/follow` - 关注用户
- `DELETE /api/users/follow` - 取消关注
- `GET /api/users/following` - 获取关注列表
- `GET /api/users/followers` - 获取粉丝列表
- `GET /api/users/follow/status/:id` - 检查关注状态

### 搜索相关

- `POST /api/search` - 搜索知识
- `GET /api/search/hot-keywords` - 获取热门关键词
- `GET /api/search/suggestions` - 获取搜索建议
- `GET /api/search/history` - 获取搜索历史

### 区块链相关

- `GET /api/blockchain/overview` - 获取区块链概览
- `GET /api/blockchain/blocks` - 获取区块列表
- `GET /api/blockchain/blocks/:index` - 获取区块详情
- `GET /api/blockchain/certificates/knowledge/:id` - 获取证书
- `GET /api/blockchain/certificates/:id/verify` - 验证证书
- `POST /api/blockchain/certificates` - 创建证书

### 推荐相关

- `GET /api/recommendations` - 获取推荐内容
- `GET /api/recommendations/similar/:id` - 获取相似内容

## 💡 使用示例

### 在组件中使用

Mock 数据对组件完全透明，无需修改任何代码：

```typescript
import { knowledgeService } from '@/services/knowledge';

// 这个调用会被 MSW 拦截并返回 Mock 数据
const { data } = await knowledgeService.getKnowledgeList({ page: 0, size: 10 });
```

### 测试登录

使用任意 Mock 用户登录：

```typescript
// 用户名：zhangsan, lisi, wangwu 等
// 密码：任意（Mock 环境下不验证密码）
await authService.login({
  usernameOrEmail: 'zhangsan',
  password: 'any_password',
});
```

## 🎨 自定义 Mock 数据

### 添加新数据

1. 在 `src/mock/data/` 目录下创建或编辑数据文件
2. 导出数据到 `src/mock/data/index.ts`
3. 在 `src/mock/server.ts` 中添加对应的 API 处理

### 修改现有数据

直接编辑 `src/mock/data/` 目录下的对应文件即可。

## 🔍 调试

启用 Mock 后，在浏览器控制台会看到：

```
🎭 Mock 服务已启用
```

所有被拦截的请求都会在控制台显示 `[MSW]` 标记。

## ⚠️ 注意事项

1. **网络延迟模拟**：Mock 服务器默认添加 300ms 延迟，模拟真实网络环境
2. **数据持久化**：Mock 数据仅存在于内存中，刷新页面后会重置
3. **文件上传**：Mock 环境下文件上传会被模拟，不会真正上传文件
4. **WebSocket**：当前 Mock 不支持 WebSocket，需要真实后端

## 📝 开发建议

1. **开发新功能**：使用 Mock 数据可以快速开发，无需等待后端 API
2. **前后端并行**：前端使用 Mock，后端同时开发真实 API
3. **测试场景**：Mock 数据可以轻松模拟各种边界情况
4. **演示 Demo**：使用 Mock 数据可以独立演示前端功能

## 🚀 生产环境

生产环境构建时，Mock 代码会被自动排除，不会影响最终包大小。

```bash
npm run build  # 生产构建，不包含 Mock
```

## 📚 相关技术

- [MSW (Mock Service Worker)](https://mswjs.io/) - API Mock 库
- [Faker.js](https://fakerjs.dev/) - 可选的假数据生成库

## 🤝 贡献

如需添加更多 Mock 数据或改进 Mock 服务，请：

1. 在 `src/mock/data/` 添加数据
2. 在 `src/mock/server.ts` 添加 API 处理
3. 更新本文档

---

**Happy Mocking! 🎭**
