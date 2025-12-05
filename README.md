# 🎓 EduChain - 教育知识共享平台

<div align="center">

![EduChain Logo](https://img.shields.io/badge/EduChain-Education%20Blockchain-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**基于区块链技术的教育知识共享平台**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [技术栈](#-技术栈) • [项目结构](#-项目结构) • [文档](#-文档)

</div>

---

## 📋 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [系统架构](#-系统架构)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
  - [环境要求](#环境要求)
  - [后端服务启动](#后端服务启动)
  - [前端服务启动](#前端服务启动)
  - [区块链服务启动](#区块链服务启动)
  - [Docker 一键启动](#docker-一键启动)
- [模块详解](#-模块详解)
  - [后端模块 (Spring Boot)](#后端模块-spring-boot)
  - [前端模块 (React)](#前端模块-react)
  - [区块链模块 (Python)](#区块链模块-python)
- [开发指南](#-开发指南)
  - [代码规范](#代码规范)
  - [Git 工作流](#git-工作流)
  - [API 开发](#api-开发)
  - [前端开发](#前端开发)
  - [区块链开发](#区块链开发)
- [部署指南](#-部署指南)
  - [开发环境部署](#开发环境部署)
  - [生产环境部署](#生产环境部署)
  - [Docker 部署](#docker-部署)
- [API 文档](#-api-文档)
- [数据库设计](#-数据库设计)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

---

## 🎯 项目简介

EduChain 是一个基于区块链技术的教育知识共享平台，旨在为教育工作者和学习者提供一个安全、透明、可信的知识分享和认证环境。平台集成了知识内容管理、用户互动、智能搜索、区块链存证等核心功能，通过区块链技术确保知识内容的版权保护和用户成就的可信认证。

### 核心价值

- 🔐 **安全可信**: 基于区块链的知识内容存证，确保版权保护
- 📚 **知识共享**: 支持多种格式的知识内容分享和管理
- 🎖️ **成就认证**: 区块链认证的学习成就，不可篡改
- 🔍 **智能搜索**: 全文搜索、智能推荐、热门内容发现
- 👥 **社交互动**: 点赞、收藏、评论、关注等丰富的互动功能
- 🛡️ **权限管理**: 完善的用户权限和内容审核机制

---

## ✨ 功能特性

### 核心功能

#### 📖 知识内容管理
- ✅ 支持文本、图片、视频、文档、链接等多种格式
- ✅ 富文本编辑器，支持 Markdown
- ✅ 分类管理和标签系统
- ✅ 版本历史记录
- ✅ 草稿保存功能
- ✅ 多媒体文件上传和管理

#### 👤 用户系统
- ✅ 用户注册/登录（JWT 认证）
- ✅ 个人资料管理
- ✅ 头像上传
- ✅ 用户统计信息
- ✅ 用户成就系统
- ✅ 关注/粉丝功能

#### 💬 互动功能
- ✅ 点赞/取消点赞
- ✅ 收藏/取消收藏
- ✅ 多级评论系统
- ✅ 浏览记录
- ✅ 通知系统
- ✅ 分享功能

#### 🔍 搜索与推荐
- ✅ 全文搜索
- ✅ 高级搜索（多条件筛选）
- ✅ 搜索建议和自动补全
- ✅ 热门关键词
- ✅ 智能推荐算法
- ✅ 相似内容推荐

#### ⛓️ 区块链功能
- ✅ 知识内容存证（版权保护）
- ✅ 用户成就认证
- ✅ 版权声明和验证
- ✅ 区块链查询接口
- ✅ 交易历史记录

#### 🛠️ 管理员功能
- ✅ 用户管理（封禁/解封）
- ✅ 内容审核
- ✅ 分类和标签管理
- ✅ 系统监控
- ✅ 日志管理
- ✅ 统计分析

---

## 🛠️ 技术栈

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Java** | 21 | 编程语言 |
| **Spring Boot** | 3.2.0 | 核心框架 |
| **Spring Security** | 6.x | 安全框架 |
| **Spring Data JPA** | 3.x | 数据持久化 |
| **MySQL** | 8.0+ | 关系型数据库 |
| **Redis** | 7+ | 缓存数据库 |
| **JWT** | 0.11.5 | 身份认证 |
| **Swagger/OpenAPI** | 2.5.0 | API 文档 |
| **Maven** | 3.x | 构建工具 |

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.0 | UI 框架 |
| **TypeScript** | 5.9.3 | 类型系统 |
| **Vite** | 7.2.4 | 构建工具 |
| **Ant Design** | 6.0.0 | UI 组件库 |
| **React Router** | 7.9.6 | 路由管理 |
| **Axios** | 1.13.2 | HTTP 客户端 |
| **Day.js** | 1.11.19 | 日期处理 |

### 区块链技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Python** | 3.11+ | 编程语言 |
| **FastAPI** | Latest | Web 框架 |
| **SQLAlchemy** | Latest | ORM 框架 |
| **PostgreSQL/SQLite** | - | 数据存储 |
| **Pydantic** | Latest | 数据验证 |

### 开发工具

- **IDE**: IntelliJ IDEA / VS Code
- **版本控制**: Git
- **容器化**: Docker & Docker Compose
- **API 测试**: Postman / Swagger UI
- **数据库管理**: MySQL Workbench / DataGrip

---

## 🏗️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                 │
│              Web浏览器 / 移动端应用                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      前端层 (Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite                         │  │
│  │  - 组件化开发                                          │  │
│  │  - 路由管理 (React Router)                            │  │
│  │  - 状态管理 (Context API)                             │  │
│  │  - UI组件库 (Ant Design)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                    API网关层 (Gateway)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Nginx 反向代理                                       │  │
│  │  - 负载均衡                                           │  │
│  │  - SSL/TLS 终止                                       │  │
│  │  - 请求路由                                           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────┬────────────────────┘
         │                               │
┌────────▼────────┐            ┌─────────▼─────────┐
│  后端服务层      │            │  区块链服务层      │
│  (Backend)      │            │  (Blockchain)     │
│                 │            │                   │
│  Spring Boot    │◄──HTTP───►│  Python FastAPI   │
│  - RESTful API  │            │  - 区块链核心      │
│  - 业务逻辑      │            │  - 存证服务        │
│  - 安全认证      │            │  - 验证服务        │
└────────┬────────┘            └───────────────────┘
         │
    ┌────┴────┬──────────────┬──────────────┐
    │         │              │              │
┌───▼───┐ ┌──▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐
│ MySQL │ │ Redis   │ │ 文件存储   │ │ 消息队列  │
│       │ │         │ │           │ │ (可选)    │
│ 主库  │ │ 缓存    │ │ 本地/OSS   │ │ RabbitMQ  │
└───────┘ └─────────┘ └───────────┘ └───────────┘
```

### 模块交互流程

```
用户请求
    ↓
前端 (React)
    ↓ HTTP Request
后端 API (Spring Boot)
    ↓
业务逻辑处理
    ├─→ 数据库操作 (MySQL)
    ├─→ 缓存操作 (Redis)
    └─→ 区块链存证 (Python FastAPI)
    ↓
响应返回
    ↓
前端渲染
```

---

## 📁 项目结构

```
EduChain/
├── 📂 frontend/                    # 前端模块 (React)
│   ├── 📂 src/
│   │   ├── 📂 pages/               # 页面组件
│   │   │   ├── 📂 admin/           # 管理员页面
│   │   │   ├── 📂 auth/            # 认证页面
│   │   │   ├── 📂 knowledge/       # 知识内容页面
│   │   │   ├── 📂 search/          # 搜索页面
│   │   │   └── 📂 user/            # 用户页面
│   │   ├── 📂 components/          # UI组件
│   │   │   ├── 📂 common/          # 通用组件
│   │   │   ├── 📂 knowledge/       # 知识相关组件
│   │   │   ├── 📂 layout/          # 布局组件
│   │   │   └── 📂 search/          # 搜索组件
│   │   ├── 📂 services/            # API服务
│   │   │   ├── api.ts              # API配置
│   │   │   ├── auth.ts             # 认证服务
│   │   │   ├── knowledge.ts        # 知识服务
│   │   │   └── blockchain.ts       # 区块链服务
│   │   ├── 📂 contexts/           # 上下文
│   │   │   ├── AuthContext.tsx     # 认证上下文
│   │   │   └── ThemeContext.tsx     # 主题上下文
│   │   ├── 📂 hooks/              # 自定义Hooks
│   │   ├── 📂 utils/               # 工具函数
│   │   ├── 📂 types/               # TypeScript类型
│   │   └── 📂 constants/           # 常量定义
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── 📂 src/                          # 后端模块 (Spring Boot)
│   ├── 📂 main/
│   │   ├── 📂 java/com/example/educhain/
│   │   │   ├── 📂 controller/      # 控制器层
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── KnowledgeItemController.java
│   │   │   │   └── ...
│   │   │   ├── 📂 service/         # 服务层
│   │   │   │   ├── UserService.java
│   │   │   │   ├── KnowledgeItemService.java
│   │   │   │   ├── BlockchainService.java
│   │   │   │   └── 📂 impl/        # 服务实现
│   │   │   ├── 📂 repository/      # 数据访问层
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ...
│   │   │   ├── 📂 entity/          # 实体类
│   │   │   │   ├── User.java
│   │   │   │   ├── KnowledgeItem.java
│   │   │   │   └── ...
│   │   │   ├── 📂 dto/             # 数据传输对象
│   │   │   ├── 📂 config/          # 配置类
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── RedisConfig.java
│   │   │   │   └── ...
│   │   │   ├── 📂 util/            # 工具类
│   │   │   └── 📂 exception/       # 异常处理
│   │   └── 📂 resources/
│   │       ├── application.yml     # 配置文件
│   │       └── logback-spring.xml  # 日志配置
│   └── 📂 test/                     # 测试代码
│
├── 📂 blockchain-service/          # 区块链模块 (Python)
│   ├── 📂 app/
│   │   ├── blockchain.py           # 区块链核心
│   │   ├── block.py                # 区块结构
│   │   ├── transaction.py          # 交易结构
│   │   ├── api.py                  # REST API
│   │   └── models.py               # 数据模型
│   ├── 📂 database/
│   │   └── db_manager.py           # 数据库管理
│   ├── main.py                     # 服务入口
│   ├── requirements.txt            # Python依赖
│   ├── Dockerfile                  # Docker配置
│   └── config.py                    # 配置文件
│
├── 📂 db/                           # 数据库脚本
│   └── database_schema.sql          # 数据库结构
│
├── 📂 docker/                       # Docker配置
│   ├── docker-compose.yml           # Docker Compose配置
│   ├── Dockerfile.backend           # 后端Dockerfile
│   ├── Dockerfile.frontend          # 前端Dockerfile
│   └── Dockerfile.blockchain        # 区块链Dockerfile
│
├── 📂 docs/                         # 文档目录
│   ├── TECHNICAL_DOCUMENTATION.md   # 技术文档
│   ├── DEVELOPMENT_ROADMAP.md       # 开发路线图
│   └── API_DOCUMENTATION.md         # API文档
│
├── pom.xml                          # Maven配置
├── README.md                        # 项目说明（本文件）
└── .gitignore                       # Git忽略配置
```

---

## 🚀 快速开始

### 环境要求

#### 必需环境

- **Java**: JDK 21+
- **Node.js**: 18+
- **Python**: 3.11+
- **MySQL**: 8.0+
- **Redis**: 7+
- **Maven**: 3.8+ (可选，项目包含 Maven Wrapper)

#### 可选环境

- **Docker**: 20.10+ (用于容器化部署)
- **Docker Compose**: 2.0+ (用于一键启动)

### 后端服务启动

#### 1. 克隆项目

```bash
git clone https://github.com/your-org/EduChain.git
cd EduChain
```

#### 2. 配置数据库

创建 MySQL 数据库：

```bash
mysql -u root -p
```

```sql
CREATE DATABASE educhain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

执行数据库初始化脚本：

```bash
mysql -u root -p educhain_db < db/database_schema.sql
```

#### 3. 配置 Redis

启动 Redis 服务：

```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Windows
redis-server
```

#### 4. 配置应用

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/educhain_db
    username: your_username
    password: your_password
  
  data:
    redis:
      host: localhost
      port: 6379

jwt:
  secret: your-jwt-secret-key-minimum-512-bits
```

#### 5. 启动后端服务

```bash
# 使用 Maven Wrapper
./mvnw spring-boot:run

# 或使用 Maven
mvn spring-boot:run

# 或打包后运行
mvn clean package
java -jar target/EduChain-0.0.1-SNAPSHOT.jar
```

后端服务将在 `http://localhost:8080` 启动。

#### 6. 验证后端服务

- API 文档: http://localhost:8080/api/swagger-ui.html
- 健康检查: http://localhost:8080/api/actuator/health

### 前端服务启动

#### 1. 进入前端目录

```bash
cd frontend
```

#### 2. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

#### 3. 配置环境变量

创建 `.env` 文件（可选，默认配置已可用）：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

#### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

前端服务将在 `http://localhost:3000` 启动。

#### 5. 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物在 `frontend/dist` 目录。

### 区块链服务启动

#### 1. 进入区块链服务目录

```bash
cd blockchain-service
```

#### 2. 创建虚拟环境（推荐）

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate
```

#### 3. 安装依赖

```bash
pip install -r requirements.txt
```

#### 4. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL=sqlite:///blockchain.db
HOST=0.0.0.0
PORT=8000
AUTO_CREATE_BLOCK=true
CREATE_BLOCK_INTERVAL=60
```

#### 5. 启动区块链服务

```bash
# 开发模式
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 或使用 Python
python main.py
```

区块链服务将在 `http://localhost:8000` 启动。

#### 6. 验证区块链服务

- API 文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/api/blockchain/chain

### Docker 一键启动

#### 1. 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

#### 2. 单独启动服务

```bash
# 启动后端
docker-compose up -d backend

# 启动前端
docker-compose up -d frontend

# 启动区块链服务
docker-compose up -d blockchain
```

#### 3. Docker Compose 配置

`docker-compose.yml` 示例：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: educhain_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/educhain_db
      - SPRING_REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  blockchain:
    build: ./blockchain-service
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/blockchain
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: blockchain
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  mysql-data:
  redis-data:
  postgres-data:
```

---

## 📦 模块详解

### 后端模块 (Spring Boot)

#### 核心功能模块

##### 1. 用户认证模块

**文件位置**: `src/main/java/com/example/educhain/controller/AuthController.java`

**主要功能**:
- 用户注册
- 用户登录（JWT 生成）
- Token 刷新
- 用户登出
- 密码修改

**API 端点**:
```
POST   /api/auth/register          # 用户注册
POST   /api/auth/login             # 用户登录
POST   /api/auth/refresh           # 刷新Token
POST   /api/auth/logout             # 用户登出
POST   /api/auth/change-password   # 修改密码
GET    /api/auth/me                # 获取当前用户信息
```

##### 2. 知识内容管理模块

**文件位置**: `src/main/java/com/example/educhain/controller/KnowledgeItemController.java`

**主要功能**:
- 知识内容 CRUD
- 文件上传
- 版本管理
- 内容审核

**API 端点**:
```
GET    /api/knowledge              # 获取知识列表
GET    /api/knowledge/{id}         # 获取知识详情
POST   /api/knowledge              # 创建知识内容
PUT    /api/knowledge/{id}         # 更新知识内容
DELETE /api/knowledge/{id}         # 删除知识内容
POST   /api/knowledge/{id}/upload  # 上传文件
```

##### 3. 搜索模块

**文件位置**: `src/main/java/com/example/educhain/controller/SearchController.java`

**主要功能**:
- 全文搜索
- 高级搜索
- 搜索建议
- 热门关键词

**API 端点**:
```
GET    /api/search                 # 全文搜索
POST   /api/search/advanced        # 高级搜索
GET    /api/search/suggestions     # 搜索建议
GET    /api/search/hot-keywords    # 热门关键词
```

##### 4. 区块链集成模块

**文件位置**: `src/main/java/com/example/educhain/service/BlockchainService.java`

**主要功能**:
- 知识内容存证
- 成就认证
- 版权验证
- 交易查询

**使用示例**:
```java
@Service
public class KnowledgeItemServiceImpl {
    
    @Autowired
    private BlockchainService blockchainService;
    
    public KnowledgeItemDTO create(CreateKnowledgeRequest request) {
        // 1. 保存到数据库
        KnowledgeItem item = saveToDatabase(request);
        
        // 2. 计算内容哈希
        String contentHash = calculateHash(item);
        
        // 3. 异步存证到区块链
        blockchainService.certifyKnowledge(
            item.getId(),
            item.getUploaderId(),
            contentHash
        );
        
        return convertToDTO(item);
    }
}
```

#### 配置文件说明

**application.yml** 主要配置项：

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# 数据库配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/educhain_db
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD}
  
  # JPA配置
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false
  
  # Redis配置
  data:
    redis:
      host: localhost
      port: 6379

# JWT配置
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000  # 24小时
  refresh-expiration: 604800000  # 7天

# 区块链服务配置
blockchain:
  service:
    url: ${BLOCKCHAIN_SERVICE_URL:http://localhost:8000}
    timeout: 5000
```

### 前端模块 (React)

#### 核心功能模块

##### 1. 路由配置

**文件位置**: `frontend/src/router/index.tsx`

**路由结构**:
```typescript
/                          # 首页
/login                     # 登录页
/register                  # 注册页
/knowledge                 # 知识列表
/knowledge/:id             # 知识详情
/knowledge/create          # 创建知识
/search                    # 搜索页
/profile                   # 个人中心
/admin                     # 管理员后台
```

##### 2. 状态管理

**认证状态**: `frontend/src/contexts/AuthContext.tsx`

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

**主题状态**: `frontend/src/contexts/ThemeContext.tsx`

```typescript
const { theme, toggleTheme } = useTheme();
```

##### 3. API 服务

**文件位置**: `frontend/src/services/`

**主要服务**:
- `api.ts`: API 基础配置
- `auth.ts`: 认证相关 API
- `knowledge.ts`: 知识内容 API
- `search.ts`: 搜索相关 API
- `blockchain.ts`: 区块链相关 API

**使用示例**:
```typescript
import { knowledgeService } from '@/services/knowledge';

// 获取知识列表
const knowledgeList = await knowledgeService.getList({
  page: 0,
  size: 10,
  sort: 'createdAt,desc'
});

// 创建知识内容
const newKnowledge = await knowledgeService.create({
  title: '标题',
  content: '内容',
  categoryId: 1
});
```

##### 4. 组件库

**Ant Design 组件使用**:
```typescript
import { Button, Table, Form, Input } from 'antd';

const MyComponent = () => {
  return (
    <Form>
      <Form.Item name="title" label="标题">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </Form>
  );
};
```

#### 开发脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### 区块链模块 (Python)

#### 核心功能模块

##### 1. 区块链核心

**文件位置**: `blockchain-service/app/blockchain.py`

**主要类**:
- `Block`: 区块结构
- `Transaction`: 交易结构
- `Blockchain`: 区块链核心类

**核心方法**:
```python
# 创建区块链
blockchain = Blockchain()

# 添加交易
transaction = Transaction(
    type="KNOWLEDGE_CERT",
    knowledge_id=123,
    user_id=456,
    content_hash="0xabc123..."
)
blockchain.add_transaction(transaction)

# 创建新区块（打包交易）
block = blockchain.create_block()

# 验证区块链
is_valid = blockchain.is_chain_valid()

# 验证知识内容
is_valid = blockchain.verify_knowledge(knowledge_id, content_hash)
```

##### 2. REST API

**文件位置**: `blockchain-service/app/api.py`

**API 端点**:
```
POST   /api/blockchain/certify              # 存证
POST   /api/blockchain/verify                # 验证
GET    /api/blockchain/chain                 # 获取区块链信息
POST   /api/blockchain/create-block          # 手动创建新区块
GET    /api/blockchain/transaction/{id}     # 获取交易信息
```

**使用示例**:
```bash
# 存证知识内容
curl -X POST http://localhost:8000/api/blockchain/certify \
  -H "Content-Type: application/json" \
  -d '{
    "type": "KNOWLEDGE_CERT",
    "knowledge_id": 123,
    "user_id": 456,
    "content_hash": "0xabc123..."
  }'

# 验证知识内容
curl -X POST http://localhost:8000/api/blockchain/verify \
  -H "Content-Type: application/json" \
  -d '{
    "knowledge_id": 123,
    "content_hash": "0xabc123..."
  }'
```

##### 3. 数据持久化

**文件位置**: `blockchain-service/app/database/db_manager.py`

**功能**:
- 区块数据存储
- 交易数据存储
- 区块链状态恢复

**配置**:
```python
# SQLite (开发环境)
DATABASE_URL = "sqlite:///blockchain.db"

# PostgreSQL (生产环境)
DATABASE_URL = "postgresql://user:pass@localhost:5432/blockchain"
```

#### 启动脚本

**开发模式**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**生产模式**:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 💻 开发指南

### 代码规范

#### Java 代码规范

- 遵循 Google Java Style Guide
- 使用 Spotless 自动格式化
- 类名使用大驼峰: `UserService`
- 方法名使用小驼峰: `getUserById`
- 常量使用大写下划线: `MAX_SIZE`

**格式化命令**:
```bash
mvn spotless:apply
```

#### TypeScript 代码规范

- 使用 ESLint + Prettier
- 函数组件优先
- 使用 TypeScript 严格模式
- 接口命名使用大驼峰: `UserDTO`
- 变量命名使用小驼峰: `userName`

**格式化命令**:
```bash
npm run format
```

#### Python 代码规范

- 遵循 PEP 8
- 使用 Black 自动格式化
- 类名使用大驼峰: `Blockchain`
- 函数名使用小写下划线: `get_transaction`
- 常量使用大写下划线: `MAX_SIZE`

**格式化命令**:
```bash
black .
```

### Git 工作流

#### 分支策略

```
main          # 主分支（生产环境）
├── develop   # 开发分支
├── feature/* # 功能分支
├── bugfix/*  # 修复分支
└── hotfix/*  # 热修复分支
```

#### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

**示例**:
```bash
git commit -m "feat: 添加知识内容存证功能"
git commit -m "fix: 修复用户登录token过期问题"
git commit -m "docs: 更新API文档"
```

### API 开发

#### 创建新的 API 端点

**1. 创建 Controller**:
```java
@RestController
@RequestMapping("/api/example")
@RequiredArgsConstructor
@Tag(name = "示例管理")
public class ExampleController {
    
    private final ExampleService exampleService;
    
    @GetMapping
    @Operation(summary = "获取示例列表")
    public Result<Page<ExampleDTO>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(exampleService.findAll(page, size));
    }
}
```

**2. 创建 Service**:
```java
@Service
@RequiredArgsConstructor
@Transactional
public class ExampleServiceImpl implements ExampleService {
    
    private final ExampleRepository repository;
    
    @Override
    public Page<ExampleDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable)
            .map(this::convertToDTO);
    }
}
```

**3. 创建 Repository**:
```java
@Repository
public interface ExampleRepository extends JpaRepository<Example, Long> {
    // 自定义查询方法
}
```

### 前端开发

#### 创建新页面

**1. 创建页面组件**:
```typescript
// frontend/src/pages/example/ExamplePage.tsx
import React from 'react';
import { Card } from 'antd';

const ExamplePage: React.FC = () => {
  return (
    <Card title="示例页面">
      <p>这是示例页面</p>
    </Card>
  );
};

export default ExamplePage;
```

**2. 添加路由**:
```typescript
// frontend/src/router/index.tsx
{
  path: '/example',
  element: (
    <LoadingWrapper>
      <ExamplePage />
    </LoadingWrapper>
  ),
}
```

**3. 创建 API 服务**:
```typescript
// frontend/src/services/example.ts
import api from './api';

export const exampleService = {
  getList: (params: any) => 
    api.get('/example', { params }),
  
  getById: (id: number) => 
    api.get(`/example/${id}`),
};
```

### 区块链开发

#### 添加新的交易类型

**1. 扩展 Transaction**:
```python
# blockchain-service/app/transaction.py
class Transaction:
    # 添加新的交易类型
    TYPE_KNOWLEDGE_CERT = "KNOWLEDGE_CERT"
    TYPE_ACHIEVEMENT = "ACHIEVEMENT"
    TYPE_COPYRIGHT = "COPYRIGHT"
    TYPE_NEW_TYPE = "NEW_TYPE"  # 新类型
```

**2. 添加处理逻辑**:
```python
# blockchain-service/app/blockchain.py
def process_transaction(self, transaction: Transaction):
    if transaction.type == Transaction.TYPE_NEW_TYPE:
        # 处理新类型交易
        pass
```

**3. 添加 API 端点**:
```python
# blockchain-service/app/api.py
@app.post("/api/blockchain/certify-new-type")
async def certify_new_type(request: NewTypeRequest):
    transaction = Transaction(
        type=Transaction.TYPE_NEW_TYPE,
        # ...
    )
    blockchain.add_transaction(transaction)
    return {"status": "success"}
```

---

## 🚢 部署指南

### 开发环境部署

#### 1. 本地开发环境

**后端**:
```bash
./mvnw spring-boot:run
```

**前端**:
```bash
cd frontend
npm run dev
```

**区块链**:
```bash
cd blockchain-service
uvicorn main:app --reload
```

#### 2. 使用 Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 生产环境部署

#### 1. 后端部署

**构建 JAR 包**:
```bash
mvn clean package -DskipTests
```

**运行**:
```bash
java -jar target/EduChain-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod
```

**使用 systemd 管理**:
```ini
# /etc/systemd/system/educhain.service
[Unit]
Description=EduChain Backend Service
After=network.target

[Service]
Type=simple
User=educhain
WorkingDirectory=/opt/educhain
ExecStart=/usr/bin/java -jar EduChain-0.0.1-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

#### 2. 前端部署

**构建**:
```bash
cd frontend
npm run build
```

**使用 Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /opt/educhain/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 区块链服务部署

**使用 Gunicorn**:
```bash
gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

**使用 systemd**:
```ini
# /etc/systemd/system/blockchain.service
[Unit]
Description=EduChain Blockchain Service
After=network.target

[Service]
Type=simple
User=educhain
WorkingDirectory=/opt/educhain/blockchain-service
ExecStart=/opt/educhain/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### Docker 部署

#### 1. 构建镜像

```bash
# 后端
docker build -t educhain-backend -f docker/Dockerfile.backend .

# 前端
docker build -t educhain-frontend -f docker/Dockerfile.frontend ./frontend

# 区块链
docker build -t educhain-blockchain -f docker/Dockerfile.blockchain ./blockchain-service
```

#### 2. 使用 Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. 健康检查

```bash
# 检查所有服务
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart
```

---

## 📚 API 文档

### Swagger UI

后端 API 文档: http://localhost:8080/api/swagger-ui.html

### FastAPI 文档

区块链 API 文档: http://localhost:8000/docs

### API 端点列表

#### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/logout` - 用户登出

#### 知识内容相关
- `GET /api/knowledge` - 获取知识列表
- `GET /api/knowledge/{id}` - 获取知识详情
- `POST /api/knowledge` - 创建知识内容
- `PUT /api/knowledge/{id}` - 更新知识内容
- `DELETE /api/knowledge/{id}` - 删除知识内容

#### 区块链相关
- `POST /api/blockchain/certify` - 存证
- `POST /api/blockchain/verify` - 验证
- `GET /api/blockchain/chain` - 获取区块链信息

更多 API 文档请参考: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🗄️ 数据库设计

### 核心表结构

#### 用户相关表
- `users` - 用户信息表
- `user_stats` - 用户统计表
- `user_achievements` - 用户成就表
- `user_follows` - 用户关注表

#### 知识内容相关表
- `knowledge_items` - 知识条目表
- `knowledge_stats` - 知识统计表
- `knowledge_versions` - 版本历史表
- `categories` - 分类表
- `tags` - 标签表

#### 互动相关表
- `comments` - 评论表
- `user_interactions` - 用户互动表
- `notifications` - 通知表

#### 搜索相关表
- `search_history` - 搜索历史表
- `search_indexes` - 搜索索引表
- `hot_keywords` - 热门关键词表

完整数据库设计请参考: `db/database_schema.sql`

---

## ❓ 常见问题

### 1. 后端启动失败

**问题**: 数据库连接失败

**解决方案**:
- 检查 MySQL 服务是否启动
- 验证数据库配置是否正确
- 确认数据库用户权限

**问题**: 端口被占用

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :8080
# 或
netstat -ano | findstr :8080  # Windows

# 杀死进程
kill -9 <PID>
```

### 2. 前端启动失败

**问题**: 依赖安装失败

**解决方案**:
```bash
# 清除缓存
npm cache clean --force
# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

**问题**: API 请求失败

**解决方案**:
- 检查后端服务是否启动
- 验证 API 地址配置
- 检查 CORS 配置

### 3. 区块链服务问题

**问题**: 数据库连接失败

**解决方案**:
- 检查数据库服务是否启动
- 验证 DATABASE_URL 配置
- 确认数据库用户权限

**问题**: 区块创建速度慢

**解决方案**:
- 优化数据库查询
- 使用批量创建区块模式
- 调整 CREATE_BLOCK_INTERVAL 配置

### 4. Docker 相关问题

**问题**: 容器启动失败

**解决方案**:
```bash
# 查看容器日志
docker-compose logs <service-name>

# 检查容器状态
docker-compose ps

# 重建容器
docker-compose up -d --build
```

**问题**: 数据持久化问题

**解决方案**:
- 检查 volume 配置
- 验证数据目录权限
- 使用命名 volume 而非绑定挂载

---

## 🤝 贡献指南

### 如何贡献

1. **Fork 项目**
2. **创建功能分支**: `git checkout -b feature/AmazingFeature`
3. **提交更改**: `git commit -m 'feat: Add some AmazingFeature'`
4. **推送分支**: `git push origin feature/AmazingFeature`
5. **提交 Pull Request**

### 代码审查流程

1. 提交 PR 后，维护者会进行代码审查
2. 根据反馈修改代码
3. 通过审查后合并到主分支

### 开发规范

- 遵循项目代码规范
- 编写单元测试
- 更新相关文档
- 确保所有测试通过

---

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---

## 📞 联系方式

- **项目仓库**: [GitHub Repository URL]
- **问题反馈**: [Issue Tracker URL]
- **技术文档**: [Documentation URL]
- **邮箱**: contact@educhain.com

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

<div align="center">

**Made with ❤️ by EduChain Team**

[⬆ 回到顶部](#-educhain---教育知识共享平台)

</div>

