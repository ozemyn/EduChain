# EduChain 教育知识共享平台部署指南

## 概述

EduChain 是一个现代化的教育知识共享平台，采用前后端分离架构。本文档提供了完整的部署指南，包括开发环境、测试环境和生产环境的部署方式。

## 系统要求

### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **操作系统**: Linux (Ubuntu 20.04+, CentOS 7+) 或 macOS

### 推荐配置
- **CPU**: 4核心或更多
- **内存**: 8GB RAM 或更多
- **存储**: 50GB SSD
- **操作系统**: Ubuntu 22.04 LTS

### 软件依赖
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd educhain-platform
```

### 2. 环境配置

```bash
# 复制环境变量配置文件
cp .env.example .env

# 编辑环境变量
vim .env
```

### 3. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- **前端应用**: http://localhost
- **后端API**: http://localhost:8080/api
- **API文档**: http://localhost:8080/swagger-ui.html

## 详细部署指南

### 开发环境部署

#### 前端开发环境

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

#### 后端开发环境

```bash
# 启动数据库和Redis
docker-compose up -d mysql redis

# 启动Spring Boot应用
./mvnw spring-boot:run

# 或者使用IDE运行 EduChainApplication.java
```

### 生产环境部署

#### 使用Docker Compose (推荐)

1. **准备服务器**
   ```bash
   # 更新系统
   sudo apt update && sudo apt upgrade -y
   
   # 安装Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # 安装Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **部署应用**
   ```bash
   # 克隆项目
   git clone <repository-url>
   cd educhain-platform
   
   # 配置环境变量
   cp .env.example .env
   vim .env
   
   # 构建并启动服务
   docker-compose up -d --build
   
   # 检查服务状态
   docker-compose ps
   ```

3. **配置反向代理 (可选)**
   ```bash
   # 如果需要SSL支持
   docker-compose --profile ssl up -d
   ```

#### 手动部署

1. **数据库部署**
   ```bash
   # 安装MySQL
   sudo apt install mysql-server
   
   # 创建数据库
   mysql -u root -p
   CREATE DATABASE educhain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'educhain'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON educhain_db.* TO 'educhain'@'localhost';
   FLUSH PRIVILEGES;
   
   # 导入数据库结构
   mysql -u educhain -p educhain_db < db/database_schema.sql
   mysql -u educhain -p educhain_db < db/fulltext_indexes.sql
   ```

2. **Redis部署**
   ```bash
   # 安装Redis
   sudo apt install redis-server
   
   # 启动Redis
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

3. **后端部署**
   ```bash
   # 安装Java 17
   sudo apt install openjdk-17-jdk
   
   # 构建应用
   ./mvnw clean package -DskipTests
   
   # 创建服务用户
   sudo useradd -r -s /bin/false educhain
   
   # 创建应用目录
   sudo mkdir -p /opt/educhain
   sudo cp target/*.jar /opt/educhain/app.jar
   sudo chown -R educhain:educhain /opt/educhain
   
   # 创建systemd服务
   sudo tee /etc/systemd/system/educhain.service > /dev/null <<EOF
   [Unit]
   Description=EduChain Platform
   After=network.target mysql.service redis.service
   
   [Service]
   Type=simple
   User=educhain
   ExecStart=/usr/bin/java -jar /opt/educhain/app.jar
   Restart=always
   RestartSec=10
   
   [Install]
   WantedBy=multi-user.target
   EOF
   
   # 启动服务
   sudo systemctl daemon-reload
   sudo systemctl start educhain
   sudo systemctl enable educhain
   ```

4. **前端部署**
   ```bash
   # 安装Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 构建前端
   cd frontend
   npm install
   npm run build
   
   # 安装Nginx
   sudo apt install nginx
   
   # 复制前端文件
   sudo cp -r dist/* /var/www/html/
   
   # 配置Nginx
   sudo cp docker/nginx.conf /etc/nginx/sites-available/educhain
   sudo ln -s /etc/nginx/sites-available/educhain /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   
   # 重启Nginx
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

## 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `MYSQL_ROOT_PASSWORD` | MySQL root密码 | - | 是 |
| `MYSQL_DATABASE` | 数据库名称 | educhain_db | 否 |
| `MYSQL_USER` | 数据库用户名 | educhain | 否 |
| `MYSQL_PASSWORD` | 数据库密码 | - | 是 |
| `JWT_SECRET` | JWT密钥 | - | 是 |
| `JWT_EXPIRATION` | JWT过期时间(毫秒) | 86400000 | 否 |
| `SPRING_PROFILES_ACTIVE` | Spring配置文件 | prod | 否 |
| `LOG_LEVEL` | 日志级别 | INFO | 否 |

### 数据库配置

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/educhain_db?useSSL=false&serverTimezone=UTC
    username: educhain
    password: ${MYSQL_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate  # 生产环境使用validate
    show-sql: false       # 生产环境关闭SQL日志
```

### 文件上传配置

```yaml
file:
  upload:
    path: ./uploads/
    max-size: 10485760  # 10MB
    allowed-types: jpg,jpeg,png,gif,pdf,doc,docx,ppt,pptx,mp4,avi,mov
```

## 监控和维护

### 健康检查

```bash
# 检查应用健康状态
curl http://localhost:8080/api/auth/stats/active-users

# 检查数据库连接
docker-compose exec mysql mysql -u educhain -p -e "SELECT 1"

# 检查Redis连接
docker-compose exec redis redis-cli ping
```

### 日志管理

```bash
# 查看应用日志
docker-compose logs -f app

# 查看特定服务日志
docker-compose logs -f mysql
docker-compose logs -f redis

# 查看系统日志
sudo journalctl -u educhain -f
```

### 备份策略

#### 数据库备份

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# 备份数据库
docker-compose exec -T mysql mysqldump -u educhain -p$MYSQL_PASSWORD educhain_db > $BACKUP_DIR/educhain_db_$DATE.sql

# 备份文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/

# 清理7天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# 设置定时备份
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

#### 恢复数据

```bash
# 恢复数据库
docker-compose exec -T mysql mysql -u educhain -p$MYSQL_PASSWORD educhain_db < backup_file.sql

# 恢复文件
tar -xzf uploads_backup.tar.gz
```

### 性能优化

#### 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_knowledge_title ON knowledge_items(title);
CREATE INDEX idx_knowledge_created_at ON knowledge_items(created_at);
CREATE INDEX idx_user_interactions_knowledge_id ON user_interactions(knowledge_id);

-- 优化配置
SET GLOBAL innodb_buffer_pool_size = 1073741824;  -- 1GB
SET GLOBAL query_cache_size = 268435456;          -- 256MB
```

#### 应用优化

```yaml
# application-prod.yml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
  data:
    redis:
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

## 安全配置

### SSL/TLS配置

```bash
# 使用Let's Encrypt获取SSL证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 或者使用自签名证书
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem
```

### 防火墙配置

```bash
# 配置UFW防火墙
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 安全头配置

Nginx配置已包含基本的安全头，包括：
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## 故障排除

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
   
   # 检查网络连接
   docker-compose exec app nc -zv mysql 3306
   ```

2. **Redis连接失败**
   ```bash
   # 检查Redis状态
   docker-compose exec redis redis-cli ping
   
   # 检查网络连接
   docker-compose exec app nc -zv redis 6379
   ```

3. **文件上传失败**
   ```bash
   # 检查上传目录权限
   ls -la uploads/
   
   # 修复权限
   sudo chown -R 1000:1000 uploads/
   sudo chmod -R 755 uploads/
   ```

4. **内存不足**
   ```bash
   # 调整JVM内存设置
   docker-compose exec app java -XX:+PrintFlagsFinal -version | grep HeapSize
   
   # 在docker-compose.yml中调整
   environment:
     JAVA_OPTS: "-Xms512m -Xmx1024m"
   ```

### 日志分析

```bash
# 查看错误日志
grep -i error logs/educhain.log

# 查看访问日志
tail -f /var/log/nginx/access.log

# 分析慢查询
grep "slow query" /var/log/mysql/mysql-slow.log
```

## 升级指南

### 应用升级

```bash
# 1. 备份数据
./backup.sh

# 2. 停止服务
docker-compose down

# 3. 更新代码
git pull origin main

# 4. 重新构建并启动
docker-compose up -d --build

# 5. 验证升级
curl http://localhost:8080/api/auth/stats/active-users
```

### 数据库迁移

```bash
# 运行数据库迁移脚本
docker-compose exec app java -jar app.jar --spring.jpa.hibernate.ddl-auto=update
```

## 支持和联系

如果在部署过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查项目的GitHub Issues
3. 联系技术支持团队

---

**注意**: 在生产环境中部署前，请确保已经充分测试所有功能，并根据实际需求调整配置参数。