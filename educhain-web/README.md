# EduChain Web

> 基于区块链的教育知识共享平台 - 前端应用

## 项目简介

EduChain Web 是 EduChain 教育链平台的前端应用，采用 Next.js 16 + React 19 构建，支持完全静态导出，可部署到 Cloudflare Pages 等静态托管平台。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **国际化**: next-intlayer
- **状态管理**: React Context + Hooks
- **Mock 数据**: MSW (Mock Service Worker)
- **构建**: Turbopack

## 核心特性

- ✅ **服务器组件 + 客户端组件混合架构** - 性能最优
- ✅ **完全静态导出** - 支持 Cloudflare Pages 部署
- ✅ **国际化支持** - 中文/英文双语
- ✅ **区块链集成** - 知识存证、证书验证
- ✅ **Mock 数据** - 开发环境无需后端
- ✅ **SEO 优化** - 重要页面预渲染

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 使用 Mock 数据开发
npm run dev:mock

# 连接真实后端开发
npm run dev
```

### 构建部署

```bash
# 构建生产版本（Mock 数据）
npm run build:mock

# 构建生产版本（真实 API）
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
educhain-web/
├── app/                          # Next.js App Router
│   └── [locale]/                # 国际化路由
│       ├── (pages)/             # 页面组件
│       │   ├── blockchain/      # 区块链相关页面
│       │   ├── knowledge/       # 知识管理页面
│       │   ├── community/       # 社区页面
│       │   └── ...
│       └── layout.tsx           # 根布局
├── components/                   # 可复用组件
│   ├── layout/                  # 布局组件
│   ├── blockchain/              # 区块链组件
│   ├── knowledge/               # 知识组件
│   └── ...
├── src/
│   ├── services/                # API 服务层
│   ├── types/                   # TypeScript 类型
│   ├── mock/                    # Mock 数据
│   ├── contexts/                # React Context
│   ├── hooks/                   # 自定义 Hooks
│   └── lib/                     # 工具函数
├── public/                      # 静态资源
└── out/                         # 构建输出（静态文件）
```

## 环境变量

创建 `.env.local` 文件：

```bash
# API 基础地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# 是否使用 Mock 数据
NEXT_PUBLIC_USE_MOCK=false
```

## 部署到 Cloudflare Pages

1. 构建项目：
```bash
npm run build:mock
```

2. 部署 `out/` 目录到 Cloudflare Pages

3. 配置：
   - Build command: `npm run build:mock`
   - Build output directory: `out`

## 开发规范

### 页面架构

- **服务器组件**（外层）：负责静态生成和 SEO
- **客户端组件**（内层）：负责交互和状态管理

### 命名规范

- 组件文件：`PascalCase.tsx`
- 工具函数：`camelCase.ts`
- 样式文件：`kebab-case.css`
- 类型文件：`PascalCase.ts`

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

## 相关项目

- [blockchain-service](../blockchain-service) - 区块链服务
- [backend](../backend) - 后端 API 服务

## License

MIT

## 联系方式

- 项目地址: https://github.com/your-org/educhain
- 问题反馈: https://github.com/your-org/educhain/issues
