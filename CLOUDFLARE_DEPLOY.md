# 🚀 Cloudflare Pages 部署指南

## 📋 项目结构说明

这是一个前后端分离的项目：
- **后端**: Spring Boot (Java) - 位于根目录
- **前端**: React + Vite - 位于 `frontend/` 目录
- **部署目标**: 仅部署前端的 Mock 版本到 Cloudflare Pages

## 🎯 快速部署步骤

### 方法一：Cloudflare Dashboard（推荐新手）

1. **连接 Git 仓库**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Pages → Create a project → Connect to Git
   - 选择这个仓库

2. **配置构建设置**
   ```
   Framework preset: Vite
   Build command: cd frontend && npm install && npm run build:mock
   Build output directory: frontend/dist
   Root directory: / (保持默认)
   ```

3. **环境变量**
   ```
   VITE_USE_MOCK=true
   VITE_APP_ENV=mock
   VITE_ENABLE_MOCK=true
   ```

4. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（约2-3分钟）

### 方法二：手动上传（快速测试）

```bash
# 1. 构建前端
cd frontend
npm install
npm run build:mock

# 2. 在Cloudflare Dashboard中选择 "Upload assets"
# 3. 上传整个 frontend/dist 文件夹
```

## 🔧 配置文件说明

项目根目录包含以下 Cloudflare Pages 配置文件：

- **`_headers`**: HTTP 头配置（Service Worker 支持）
- **`_redirects`**: SPA 路由重定向配置

## ✅ 部署验证

部署成功后访问网站，应该看到：

1. **右下角显示**: "Mock 模式" 橙色标签
2. **控制台输出**: `🎭 Mock 服务已启用`
3. **登录页面**: 有 "Mock 模式快速登录" 选项
4. **API 请求**: 显示 `[MSW]` 标记

## 🌐 访问地址

部署完成后，Cloudflare 会提供：
- **临时域名**: `https://educhain-frontend-mock.pages.dev`
- **自定义域名**: 可在项目设置中配置

## 🔄 自动部署

连接 Git 后，每次推送代码到主分支都会自动触发部署。

**监听变化**: 只有 `frontend/` 目录的变化才会触发重新构建。

## 🎭 Mock 模式特性

部署的网站具有完整功能：
- ✅ 用户注册/登录
- ✅ 知识管理
- ✅ 社区功能  
- ✅ 区块链证书
- ✅ 管理后台
- ✅ 所有 API 交互

**无需后端服务器**，完全独立运行！

## 🚨 注意事项

1. **仅前端部署**: 这个配置只部署前端 Mock 版本
2. **数据持久性**: Mock 数据在浏览器刷新后重置
3. **开发用途**: 适合演示、测试、开发使用

## 📞 需要帮助？

如果遇到问题：
1. 检查构建日志
2. 验证环境变量设置
3. 确认 `frontend/public/mockServiceWorker.js` 文件存在

---

**现在就可以开始部署了！** 🎉