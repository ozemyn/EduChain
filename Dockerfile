# 多阶段构建 Dockerfile for EduChain Platform

# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend/package*.json ./
RUN npm ci --only=production

# 复制前端源码并构建
COPY frontend/ ./
RUN npm run build

# 阶段2: 构建后端
FROM maven:3.8.6-openjdk-17-slim AS backend-builder

WORKDIR /app

# 复制Maven配置文件
COPY pom.xml ./
COPY src ./src

# 构建后端应用
RUN mvn clean package -DskipTests

# 阶段3: 运行时环境
FROM openjdk:17-jre-slim

# 安装必要的工具
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# 创建应用目录
WORKDIR /app

# 复制后端JAR文件
COPY --from=backend-builder /app/target/*.jar app.jar

# 复制前端构建文件到nginx目录
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# 复制nginx配置
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 创建日志目录
RUN mkdir -p /app/logs /app/uploads

# 复制启动脚本
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 80 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/auth/stats/active-users || exit 1

# 启动应用
CMD ["/app/start.sh"]