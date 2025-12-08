# Cloudflare Pages 部署指南

## 🚀 快速部署 Mock 版本

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **准备代码**
   ```bash
   cd frontend
   npm install
   npm run build:mock
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Pages 部分

3. **创建新项目**
   - 点击 "Create a project"
   - 选择 "Connect to Git" 或 "Upload assets"

4. **配置构建设置**
   - **Framework preset**: `Vite`
   - **Build command**: `cd frontend && npm install && npm run build:mock`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `/` (项目根目录)

5. **环境变量设置**
   ```
   VITE_USE_MOCK=true
   VITE_APP_ENV=mock
   VITE_ENABLE_MOCK=true
   VITE_ENABLE_DEVTOOLS=true
   ```

### 方法二：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   cd frontend && npm install && npm run build:mock && cd ..
   wrangler pages deploy frontend/dist --project-name educhain-frontend-mock
   ```

## 📋 部署检查清单

### 构建前检查
- [ ] 确认 MSW 已安装：`npm list msw`
- [ ] 确认 Service Worker 文件存在：`public/mockServiceWorker.js`
- [ ] 测试 mock 构建：`npm run build:mock`
- [ ] 验证构建产物：检查 `dist` 目录

### 部署后验证
- [ ] 访问部署的网站
- [ ] 打开浏览器控制台，确认看到：`🎭 Mock 服务已启用`
- [ ] 检查右下角是否显示 "Mock 模式" 标签
- [ ] 测试登录功能（使用快速登录按钮）
- [ ] 验证 API 请求显示 `[MSW]` 标记

## 🔧 常见问题解决

### 问题 1：Service Worker 注册失败
**解决方案**：
- 确保 `_headers` 文件配置正确
- 检查 `mockServiceWorker.js` 是否在 `public` 目录
- 验证 HTTPS 访问（Cloudflare Pages 默认提供）

### 问题 2：Mock 数据未生效
**解决方案**：
- 检查环境变量 `VITE_USE_MOCK=true`
- 确认使用了 `build:mock` 命令构建
- 清除浏览器缓存重试

### 问题 3：路由 404 错误
**解决方案**：
- 确保 `_redirects` 文件存在且配置正确
- 验证 SPA 重定向规则

## 🌐 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Cloudflare
3. 等待 SSL 证书自动配置完成

## 📊 性能优化建议

- 启用 Cloudflare 的 Auto Minify
- 开启 Brotli 压缩
- 配置适当的缓存策略（已在 `_headers` 中配置）
- 使用 Cloudflare Analytics 监控性能

## 🔄 自动部署

连接 Git 仓库后，每次推送到主分支都会自动触发部署。

可以配置不同分支对应不同环境：
- `main` 分支 → 生产环境（mock 模式）
- `dev` 分支 → 开发环境

---

**部署完成后，你就有了一个完全独立运行的 Mock 版本网站！** 🎉