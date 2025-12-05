# Mock 数据系统安装指南

## 📦 安装依赖

Mock 数据系统需要安装 MSW (Mock Service Worker) 库。

### 1. 安装 MSW

```bash
cd frontend
npm install msw --save-dev
```

### 2. 初始化 MSW Service Worker

```bash
npx msw init public/ --save
```

这个命令会在 `public/` 目录下创建 `mockServiceWorker.js` 文件。

## ✅ 验证安装

安装完成后，你的项目结构应该包含：

```
frontend/
├── public/
│   └── mockServiceWorker.js  # MSW Service Worker 文件
├── src/
│   └── mock/
│       ├── data/              # Mock 数据
│       ├── server.ts          # Mock 服务器配置
│       ├── index.ts           # Mock 入口
│       └── README.md          # 使用文档
├── .env.development           # 开发环境配置
├── .env.mock                  # Mock 环境配置
└── package.json
```

## 🚀 启动 Mock 模式

安装完成后，使用以下命令启动 Mock 模式：

```bash
npm run dev:mock
```

或者修改 `.env.development` 文件：

```env
VITE_USE_MOCK=true
```

然后正常启动：

```bash
npm run dev
```

## 🔍 验证 Mock 是否生效

1. 启动项目后，打开浏览器控制台
2. 应该看到消息：`🎭 Mock 服务已启用`
3. 所有 API 请求会显示 `[MSW]` 标记

## 📝 package.json 依赖

确保 `package.json` 中包含：

```json
{
  "devDependencies": {
    "msw": "^2.0.0"
  }
}
```

## ⚠️ 常见问题

### 问题 1：MSW 未生效

**解决方案**：
1. 确认 `public/mockServiceWorker.js` 文件存在
2. 检查环境变量 `VITE_USE_MOCK=true`
3. 清除浏览器缓存并重启开发服务器

### 问题 2：Service Worker 注册失败

**解决方案**：
1. 确保使用 HTTPS 或 localhost
2. 检查浏览器是否支持 Service Worker
3. 在浏览器开发者工具的 Application > Service Workers 中检查状态

### 问题 3：某些 API 未被拦截

**解决方案**：
1. 检查 `src/mock/server.ts` 中是否配置了对应的 API 处理
2. 确认 API 路径是否正确匹配
3. 查看控制台是否有 MSW 警告信息

## 📚 更多信息

详细使用说明请查看：`src/mock/README.md`

---

**安装完成后即可开始使用 Mock 数据进行开发！** 🎉
