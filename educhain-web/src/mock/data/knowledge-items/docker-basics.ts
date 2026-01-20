/**
 * Docker 容器化部署实践
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const dockerBasicsKnowledge = {
  id: 4,
  shareCode: generateMockShareCode(4),
  title: 'Docker 容器化部署实践 - 从入门到生产',
  content: `# Docker 容器化部署实践 - 从入门到生产

## 🐳 引言

Docker 是一个开源的容器化平台，它让应用程序的打包、分发和部署变得简单高效。通过 Docker，你可以将应用及其依赖打包到一个轻量级、可移植的容器中。

### Docker 的优势

✅ **环境一致性** - 开发、测试、生产环境完全一致
✅ **快速部署** - 秒级启动，快速扩展
✅ **资源隔离** - 容器之间相互隔离
✅ **版本管理** - 镜像版本化管理
✅ **微服务架构** - 完美支持微服务部署

---

## 📚 核心概念

### 1. 镜像（Image）

镜像是一个只读的模板，包含了运行应用所需的所有内容。

\`\`\`bash
# 拉取镜像
docker pull nginx:latest
docker pull node:18-alpine

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx:latest

# 构建镜像
docker build -t myapp:1.0 .

# 推送镜像到仓库
docker push myregistry/myapp:1.0
\`\`\`

### 2. 容器（Container）

容器是镜像的运行实例，是一个独立的运行环境。

\`\`\`bash
# 运行容器
docker run -d --name mynginx -p 80:80 nginx

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop mynginx

# 启动容器
docker start mynginx

# 重启容器
docker restart mynginx

# 删除容器
docker rm mynginx

# 进入容器
docker exec -it mynginx bash

# 查看容器日志
docker logs mynginx
docker logs -f mynginx  # 实时查看

# 查看容器资源使用
docker stats mynginx
\`\`\`

### 3. Dockerfile

Dockerfile 是用于构建镜像的文本文件，包含了一系列指令。

**基础 Node.js 应用 Dockerfile：**

\`\`\`dockerfile
# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/index.js"]
\`\`\`

**多阶段构建优化：**

\`\`\`dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
\`\`\`

### 4. Docker Compose

Docker Compose 用于定义和运行多容器 Docker 应用。

**docker-compose.yml 示例：**

\`\`\`yaml
version: '3.8'

services:
  # Web 应用
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    networks:
      - app-network

  # PostgreSQL 数据库
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
\`\`\`

**Docker Compose 命令：**

\`\`\`bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f web

# 停止所有服务
docker-compose stop

# 停止并删除所有容器
docker-compose down

# 停止并删除所有容器、网络、卷
docker-compose down -v

# 重启服务
docker-compose restart web

# 执行命令
docker-compose exec web npm run migrate
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: Next.js 应用容器化

**Dockerfile：**

\`\`\`dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

**.dockerignore：**

\`\`\`
node_modules
.next
.git
.gitignore
README.md
.env*.local
npm-debug.log*
\`\`\`

### 案例 2: 微服务架构

**docker-compose.yml：**

\`\`\`yaml
version: '3.8'

services:
  # API Gateway
  gateway:
    build: ./gateway
    ports:
      - "8080:8080"
    environment:
      - USER_SERVICE_URL=http://user-service:3001
      - ORDER_SERVICE_URL=http://order-service:3002
    networks:
      - microservices

  # 用户服务
  user-service:
    build: ./services/user
    environment:
      - DATABASE_URL=postgresql://postgres:password@user-db:5432/users
      - REDIS_URL=redis://redis:6379
    depends_on:
      - user-db
      - redis
    networks:
      - microservices

  # 订单服务
  order-service:
    build: ./services/order
    environment:
      - DATABASE_URL=postgresql://postgres:password@order-db:5432/orders
      - REDIS_URL=redis://redis:6379
    depends_on:
      - order-db
      - redis
    networks:
      - microservices

  # 用户数据库
  user-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=users
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - user-db-data:/var/lib/postgresql/data
    networks:
      - microservices

  # 订单数据库
  order-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=orders
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - order-db-data:/var/lib/postgresql/data
    networks:
      - microservices

  # Redis
  redis:
    image: redis:7-alpine
    networks:
      - microservices

volumes:
  user-db-data:
  order-db-data:

networks:
  microservices:
    driver: bridge
\`\`\`

### 案例 3: CI/CD 集成

**GitHub Actions 工作流：**

\`\`\`yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: \${{ secrets.DOCKER_USERNAME }}
        password: \${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          myregistry/myapp:latest
          myregistry/myapp:\${{ github.sha }}
        cache-from: type=registry,ref=myregistry/myapp:buildcache
        cache-to: type=registry,ref=myregistry/myapp:buildcache,mode=max

    - name: Deploy to production
      run: |
        ssh user@server "docker pull myregistry/myapp:latest && docker-compose up -d"
\`\`\`

---

## 🔧 最佳实践

### 1. 镜像优化

\`\`\`dockerfile
# ✅ 使用轻量级基础镜像
FROM node:18-alpine

# ✅ 合并 RUN 命令减少层数
RUN apk add --no-cache git && \\
    npm install -g pnpm && \\
    apk del git

# ✅ 利用构建缓存
COPY package*.json ./
RUN npm ci
COPY . .

# ✅ 使用 .dockerignore
# 排除不必要的文件

# ✅ 多阶段构建
FROM node:18-alpine AS builder
# 构建阶段...

FROM node:18-alpine
# 运行阶段...
\`\`\`

### 2. 安全实践

\`\`\`dockerfile
# ✅ 使用非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# ✅ 扫描漏洞
# docker scan myapp:latest

# ✅ 使用官方镜像
FROM node:18-alpine

# ✅ 固定版本
FROM node:18.17.0-alpine3.18

# ✅ 最小化安装
RUN apk add --no-cache --virtual .build-deps \\
    python3 make g++ && \\
    npm install && \\
    apk del .build-deps
\`\`\`

### 3. 性能优化

\`\`\`bash
# 限制容器资源
docker run -d \\
  --name myapp \\
  --memory="512m" \\
  --cpus="1.0" \\
  myapp:latest

# 使用健康检查
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:3000/health || exit 1

# 使用卷挂载提高 I/O 性能
docker run -v /data:/app/data:delegated myapp
\`\`\`

### 4. 日志管理

\`\`\`yaml
# docker-compose.yml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
\`\`\`

---

## 📋 常用命令速查

\`\`\`bash
# 镜像操作
docker images                    # 列出镜像
docker pull <image>              # 拉取镜像
docker build -t <name> .         # 构建镜像
docker rmi <image>               # 删除镜像
docker tag <source> <target>     # 标记镜像

# 容器操作
docker ps                        # 列出运行中的容器
docker ps -a                     # 列出所有容器
docker run <image>               # 运行容器
docker stop <container>          # 停止容器
docker start <container>         # 启动容器
docker restart <container>       # 重启容器
docker rm <container>            # 删除容器
docker exec -it <container> sh   # 进入容器

# 系统操作
docker system df                 # 查看磁盘使用
docker system prune              # 清理未使用的资源
docker volume ls                 # 列出卷
docker network ls                # 列出网络

# Docker Compose
docker-compose up -d             # 启动服务
docker-compose down              # 停止服务
docker-compose logs -f           # 查看日志
docker-compose ps                # 查看服务状态
docker-compose exec <service> sh # 进入服务容器
\`\`\`

---

## 🎓 总结

Docker 容器化技术已经成为现代应用部署的标准。通过本指南，你应该已经了解了：

- Docker 的核心概念和基本操作
- Dockerfile 编写和镜像构建
- Docker Compose 多容器编排
- 实战案例和最佳实践

继续实践，你会发现 Docker 让应用部署变得简单高效！

---

**参考资源：**
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)`,
  type: 'TEXT' as const,
  uploaderId: 10,
  uploaderName: '陈一',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenyi',
  categoryId: 14,
  categoryName: '运维部署',
  tags: 'Docker,容器化,DevOps,部署',
  status: 1,
  createdAt: '2025-12-07T15:10:00Z',
  updatedAt: '2025-12-25T11:00:00Z',
  contentHash: 'hash_docker_deployment',
};
