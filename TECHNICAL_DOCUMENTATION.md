# EduChain 教育知识共享平台 - 技术开发文档

> **版本**: v1.0.0  
> **最后更新**: 2025-01-01  
> **维护者**: EduChain 开发团队

---

## 📑 目录

1. [项目概述](#1-项目概述)
2. [系统架构设计](#2-系统架构设计)
3. [技术栈详解](#3-技术栈详解)
4. [区块链集成方案](#4-区块链集成方案)
5. [数据库设计](#5-数据库设计)
6. [API 设计规范](#6-api-设计规范)
7. [前后端开发指南](#7-前后端开发指南)
8. [安全机制](#8-安全机制)
9. [性能优化](#9-性能优化)
10. [部署方案](#10-部署方案)
11. [开发规范](#11-开发规范)
12. [测试策略](#12-测试策略)
13. [监控与运维](#13-监控与运维)

---

## 1. 项目概述

### 1.1 项目简介

EduChain 是一个基于区块链技术的教育知识共享平台，旨在为教育工作者和学习者提供一个安全、透明、可信的知识分享和认证环境。

### 1.2 核心功能

- **知识内容管理**: 支持文本、图片、视频、文档等多种格式的知识分享
- **用户认证系统**: 基于 JWT 的安全认证机制
- **互动功能**: 点赞、收藏、评论、关注等社交功能
- **搜索推荐**: 全文搜索、智能推荐、热门内容
- **区块链存证**: 知识内容版权保护、学习成就认证
- **管理员系统**: 内容审核、用户管理、系统监控

### 1.3 技术特点

- **前后端分离**: React + Spring Boot 架构
- **微服务化**: 区块链服务独立部署
- **高可用性**: Redis 缓存、数据库优化
- **安全性**: JWT 认证、接口限流、数据加密
- **可扩展性**: 模块化设计、容器化部署

---

## 2. 系统架构设计

### 2.1 整体架构

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

### 2.2 分层架构

#### 2.2.1 前端分层

```
┌─────────────────────────────────────────┐
│          表现层 (Presentation)           │
│  - Pages (页面组件)                      │
│  - Components (UI组件)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         业务逻辑层 (Business Logic)      │
│  - Services (API调用)                    │
│  - Hooks (业务逻辑封装)                  │
│  - Utils (工具函数)                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         状态管理层 (State Management)    │
│  - Context API (全局状态)                │
│  - Local Storage (本地存储)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         基础设施层 (Infrastructure)      │
│  - Router (路由)                        │
│  - HTTP Client (网络请求)                │
│  - Error Handling (错误处理)             │
└─────────────────────────────────────────┘
```

#### 2.2.2 后端分层

```
┌─────────────────────────────────────────┐
│        控制器层 (Controller Layer)       │
│  - RESTful API 接口                     │
│  - 请求参数验证                          │
│  - 响应数据封装                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        服务层 (Service Layer)           │
│  - 业务逻辑处理                          │
│  - 事务管理                              │
│  - 异常处理                              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        数据访问层 (Repository Layer)     │
│  - JPA Repository                       │
│  - 自定义查询                            │
│  - 数据持久化                            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        实体层 (Entity Layer)            │
│  - 数据库实体映射                        │
│  - 关系映射                              │
└─────────────────────────────────────────┘
```

### 2.3 模块划分

#### 2.3.1 后端模块

```
com.example.educhain/
├── controller/          # 控制器层
│   ├── AuthController.java
│   ├── UserController.java
│   ├── KnowledgeItemController.java
│   ├── SearchController.java
│   └── ...
├── service/            # 服务层
│   ├── UserService.java
│   ├── KnowledgeItemService.java
│   ├── BlockchainService.java  # 区块链服务接口
│   └── ...
├── repository/         # 数据访问层
│   ├── UserRepository.java
│   ├── KnowledgeItemRepository.java
│   └── ...
├── entity/            # 实体类
│   ├── User.java
│   ├── KnowledgeItem.java
│   └── ...
├── dto/               # 数据传输对象
│   ├── UserDTO.java
│   ├── KnowledgeItemDTO.java
│   └── ...
├── config/            # 配置类
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   └── ...
├── util/              # 工具类
│   ├── JwtUtil.java
│   └── ...
└── exception/         # 异常处理
    ├── GlobalExceptionHandler.java
    └── ...
```

#### 2.3.2 前端模块

```
frontend/src/
├── pages/             # 页面组件
│   ├── Home.tsx
│   ├── knowledge/
│   ├── user/
│   └── admin/
├── components/        # UI组件
│   ├── common/
│   ├── knowledge/
│   ├── layout/
│   └── ...
├── services/          # API服务
│   ├── api.ts
│   ├── auth.ts
│   ├── knowledge.ts
│   └── blockchain.ts  # 区块链服务
├── contexts/          # 上下文
│   ├── AuthContext.tsx
│   └── ...
├── hooks/             # 自定义Hooks
│   ├── useAuth.ts
│   └── ...
├── utils/             # 工具函数
│   ├── api.ts
│   └── ...
└── types/             # 类型定义
    ├── api.ts
    └── ...
```

---

## 3. 技术栈详解

### 3.1 后端技术栈

#### 3.1.1 核心框架

**Spring Boot 3.2.0**
- **版本**: 3.2.0
- **Java版本**: 21
- **特性**:
  - 自动配置
  - 内嵌Tomcat服务器
  - 生产就绪特性（Actuator）
  - 依赖管理

**主要依赖**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 3.1.2 数据持久化

**Spring Data JPA**
- ORM框架: Hibernate
- 数据库: MySQL 8.0+
- 连接池: HikariCP
- 审计功能: JPA Auditing

**配置示例**:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false
    properties:
      hibernate:
        format_sql: false
    open-in-view: false
```

#### 3.1.3 安全框架

**Spring Security + JWT**
- 认证方式: JWT Token
- Token过期时间: 24小时
- 刷新Token: 7天
- 密码加密: BCrypt

**JWT配置**:
```yaml
jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000  # 24小时
  refresh-expiration: 604800000  # 7天
```

#### 3.1.4 缓存

**Redis**
- 用途: 会话存储、热点数据缓存
- 连接池: Lettuce
- 序列化: Jackson2JsonRedisSerializer

**配置示例**:
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

#### 3.1.5 API文档

**Swagger/OpenAPI**
- 版本: SpringDoc OpenAPI 2.5.0
- 访问路径: `/swagger-ui.html`
- API文档路径: `/v3/api-docs`

### 3.2 前端技术栈

#### 3.2.1 核心框架

**React 19.2.0**
- 特性: Hooks、函数组件、性能优化
- 构建工具: Vite 7.2.4
- 语言: TypeScript 5.9.3

**主要特性**:
- 组件化开发
- 虚拟DOM
- 单向数据流
- Hooks API

#### 3.2.2 UI框架

**Ant Design 6.0.0**
- 组件库: 丰富的UI组件
- 主题定制: 支持自定义主题
- 国际化: 支持多语言

**使用示例**:
```tsx
import { Button, Table, Form } from 'antd';

const MyComponent = () => {
  return (
    <Button type="primary">点击</Button>
  );
};
```

#### 3.2.3 路由管理

**React Router 7.9.6**
- 路由模式: BrowserRouter
- 懒加载: React.lazy()
- 路由守卫: ProtectedRoute

**配置示例**:
```tsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'knowledge', element: <KnowledgeList /> }
    ]
  }
]);
```

#### 3.2.4 HTTP客户端

**Axios 1.13.2**
- 请求拦截器: Token自动添加
- 响应拦截器: 统一错误处理
- 超时设置: 10秒

**配置示例**:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3.3 数据库

**MySQL 8.0+**
- 字符集: utf8mb4
- 排序规则: utf8mb4_unicode_ci
- 存储引擎: InnoDB
- 连接池: HikariCP

**数据库配置**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/educhain_db
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
```

### 3.4 开发工具

**代码质量**:
- ESLint: 代码检查
- Prettier: 代码格式化
- Spotless: Java代码格式化

**构建工具**:
- Maven: Java项目构建
- Vite: 前端构建工具
- Docker: 容器化部署

---

## 4. 区块链集成方案

### 4.1 架构设计

#### 4.1.1 整体架构

```
┌─────────────────────────────────────────┐
│         Spring Boot 后端服务             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   BlockchainService (接口)        │  │
│  │   - certifyKnowledge()            │  │
│  │   - verifyKnowledge()             │  │
│  │   - certifyAchievement()          │  │
│  └──────────────┬────────────────────┘  │
└─────────────────┼────────────────────────┘
                  │ HTTP REST API
┌─────────────────▼────────────────────────┐
│      Python 区块链服务 (FastAPI)          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   区块链核心模块                    │  │
│  │   - Block (区块)                   │  │
│  │   - Blockchain (链)                │  │
│  │   - Transaction (交易)               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   数据存储                          │  │
│  │   - SQLite/PostgreSQL              │  │
│  │   - 文件系统备份                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 4.1.2 技术选型

**Python框架**: FastAPI
- 高性能异步框架
- 自动API文档生成
- 类型提示支持
- 易于与Spring Boot集成

**区块链实现**:
- 轻量级自建区块链存证系统
- 哈希链结构（数据不可篡改）
- 时间戳验证
- 直接计算哈希（不涉及工作量证明）

**数据存储**:
- SQLite（开发环境）
- PostgreSQL（生产环境）
- 文件系统备份

### 4.2 区块链核心实现

#### 4.2.1 区块结构

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List
import hashlib
import json

@dataclass
class Transaction:
    """交易结构"""
    type: str  # KNOWLEDGE_CERT, ACHIEVEMENT, COPYRIGHT
    knowledge_id: int = None
    user_id: int = None
    content_hash: str = None
    metadata: dict = None
    timestamp: str = None
    
    def to_dict(self):
        return {
            'type': self.type,
            'knowledge_id': self.knowledge_id,
            'user_id': self.user_id,
            'content_hash': self.content_hash,
            'metadata': self.metadata or {},
            'timestamp': self.timestamp or datetime.utcnow().isoformat()
        }
    
    def to_json(self):
        return json.dumps(self.to_dict(), sort_keys=True)

@dataclass
class Block:
    """区块结构"""
    index: int
    timestamp: str
    transactions: List[Transaction]
    previous_hash: str
    nonce: int = 0
    hash: str = None
    
    def calculate_hash(self):
        """计算区块哈希"""
        block_string = json.dumps({
            'index': self.index,
            'timestamp': self.timestamp,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
```

#### 4.2.2 区块链实现

```python
class Blockchain:
    """区块链核心类"""
    
    def __init__(self):
        self.chain: List[Block] = []
        self.pending_transactions: List[Transaction] = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """创建创世区块"""
        genesis_block = Block(
            index=0,
            timestamp=datetime.utcnow().isoformat(),
            transactions=[],
            previous_hash='0' * 64
        )
        genesis_block.hash = genesis_block.calculate_hash()
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        """获取最新区块"""
        return self.chain[-1]
    
    def add_transaction(self, transaction: Transaction):
        """添加交易到待处理队列"""
        self.pending_transactions.append(transaction)
        return self.get_latest_block().index + 1
    
    def create_block(self):
        """创建新区块（打包待处理交易）
        
        将待处理的存证交易打包成新区块，直接计算哈希并添加到链中
        不涉及工作量证明或挖矿
        """
        if not self.pending_transactions:
            return None
        
        block = Block(
            index=len(self.chain),
            timestamp=datetime.utcnow().isoformat(),
            transactions=self.pending_transactions.copy(),
            previous_hash=self.get_latest_block().hash
        )
        
        self.chain.append(block)
        self.pending_transactions = []
        return block
    
    def is_chain_valid(self) -> bool:
        """验证区块链有效性"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # 验证当前区块哈希
            if current_block.hash != current_block.calculate_hash():
                return False
            
            # 验证与前一个区块的连接
            if current_block.previous_hash != previous_block.hash:
                return False
        
        return True
    
    def get_transaction_by_knowledge_id(self, knowledge_id: int) -> Transaction:
        """根据知识ID查找交易"""
        for block in self.chain:
            for transaction in block.transactions:
                if (transaction.type == 'KNOWLEDGE_CERT' and 
                    transaction.knowledge_id == knowledge_id):
                    return transaction
        return None
    
    def verify_knowledge(self, knowledge_id: int, content_hash: str) -> bool:
        """验证知识内容"""
        transaction = self.get_transaction_by_knowledge_id(knowledge_id)
        if not transaction:
            return False
        return transaction.content_hash == content_hash
```

### 4.3 FastAPI服务实现

#### 4.3.1 API接口

```python
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="EduChain Blockchain Service", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化区块链
blockchain = Blockchain()

# 数据模型
class CertifyRequest(BaseModel):
    type: str  # KNOWLEDGE_CERT, ACHIEVEMENT, COPYRIGHT
    knowledge_id: Optional[int] = None
    user_id: int
    content_hash: str
    metadata: Optional[dict] = None

class VerifyRequest(BaseModel):
    knowledge_id: int
    content_hash: str

class TransactionResponse(BaseModel):
    transaction_id: int
    block_index: int
    status: str
    timestamp: str

class VerifyResponse(BaseModel):
    is_valid: bool
    block_index: Optional[int] = None
    transaction_timestamp: Optional[str] = None

# API端点
@app.post("/api/blockchain/certify", response_model=TransactionResponse)
async def certify(request: CertifyRequest):
    """存证接口"""
    try:
        transaction = Transaction(
            type=request.type,
            knowledge_id=request.knowledge_id,
            user_id=request.user_id,
            content_hash=request.content_hash,
            metadata=request.metadata,
            timestamp=datetime.utcnow().isoformat()
        )
        
        block_index = blockchain.add_transaction(transaction)
        
        # 立即创建区块（打包交易）
        # blockchain.create_block()
        
        return TransactionResponse(
            transaction_id=len(blockchain.pending_transactions),
            block_index=block_index,
            status="pending",
            timestamp=transaction.timestamp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blockchain/verify", response_model=VerifyResponse)
async def verify(request: VerifyRequest):
    """验证接口"""
    try:
        is_valid = blockchain.verify_knowledge(
            request.knowledge_id,
            request.content_hash
        )
        
        transaction = blockchain.get_transaction_by_knowledge_id(
            request.knowledge_id
        )
        
        return VerifyResponse(
            is_valid=is_valid,
            block_index=transaction.block.index if transaction else None,
            transaction_timestamp=transaction.timestamp if transaction else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blockchain/chain")
async def get_chain():
    """获取区块链信息"""
    return {
        "chain_length": len(blockchain.chain),
        "pending_transactions": len(blockchain.pending_transactions),
        "is_valid": blockchain.is_chain_valid()
    }

@app.post("/api/blockchain/create-block")
async def create_block():
    """手动创建新区块"""
    block = blockchain.create_block()
    if block:
        return {
            "message": "Block created successfully",
            "block_index": block.index,
            "transactions_count": len(block.transactions)
        }
    return {"message": "No pending transactions"}

@app.get("/api/blockchain/transaction/{knowledge_id}")
async def get_transaction(knowledge_id: int):
    """根据知识ID获取交易信息"""
    transaction = blockchain.get_transaction_by_knowledge_id(knowledge_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction.to_dict()
```

#### 4.3.2 数据持久化

```python
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class BlockModel(Base):
    __tablename__ = 'blocks'
    
    id = Column(Integer, primary_key=True)
    index = Column(Integer, unique=True)
    timestamp = Column(DateTime)
    previous_hash = Column(String(64))
    hash = Column(String(64))
    nonce = Column(Integer)
    transactions_json = Column(Text)  # JSON格式存储交易

class BlockchainDB:
    """区块链数据库管理"""
    
    def __init__(self, db_url: str = "sqlite:///blockchain.db"):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    def save_block(self, block: Block):
        """保存区块到数据库"""
        session = self.Session()
        try:
            block_model = BlockModel(
                index=block.index,
                timestamp=datetime.fromisoformat(block.timestamp),
                previous_hash=block.previous_hash,
                hash=block.hash,
                nonce=block.nonce,
                transactions_json=json.dumps([tx.to_dict() for tx in block.transactions])
            )
            session.add(block_model)
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def load_chain(self) -> List[Block]:
        """从数据库加载区块链"""
        session = self.Session()
        try:
            block_models = session.query(BlockModel).order_by(BlockModel.index).all()
            chain = []
            for model in block_models:
                transactions = [
                    Transaction(**tx_dict) 
                    for tx_dict in json.loads(model.transactions_json)
                ]
                block = Block(
                    index=model.index,
                    timestamp=model.timestamp.isoformat(),
                    transactions=transactions,
                    previous_hash=model.previous_hash,
                    nonce=model.nonce,
                    hash=model.hash
                )
                chain.append(block)
            return chain
        finally:
            session.close()
```

### 4.4 Spring Boot集成

#### 4.4.1 服务接口

```java
package com.example.educhain.service;

import com.example.educhain.dto.BlockchainCertifyRequest;
import com.example.educhain.dto.BlockchainVerifyResponse;

public interface BlockchainService {
    /**
     * 知识内容存证
     */
    String certifyKnowledge(Long knowledgeId, Long userId, String contentHash);
    
    /**
     * 用户成就认证
     */
    String certifyAchievement(Long userId, String achievementType, String achievementHash);
    
    /**
     * 验证知识内容
     */
    BlockchainVerifyResponse verifyKnowledge(Long knowledgeId, String contentHash);
    
    /**
     * 获取交易信息
     */
    Object getTransaction(Long knowledgeId);
}
```

#### 4.4.2 服务实现

```java
package com.example.educhain.service.impl;

import com.example.educhain.service.BlockchainService;
import com.example.educhain.dto.BlockchainCertifyRequest;
import com.example.educhain.dto.BlockchainVerifyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class BlockchainServiceImpl implements BlockchainService {
    
    @Value("${blockchain.service.url:http://localhost:8000}")
    private String blockchainServiceUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Override
    @Async
    public CompletableFuture<String> certifyKnowledge(
            Long knowledgeId, Long userId, String contentHash) {
        try {
            String url = blockchainServiceUrl + "/api/blockchain/certify";
            
            Map<String, Object> request = new HashMap<>();
            request.put("type", "KNOWLEDGE_CERT");
            request.put("knowledge_id", knowledgeId);
            request.put("user_id", userId);
            request.put("content_hash", contentHash);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> body = response.getBody();
                return CompletableFuture.completedFuture(
                    body.get("transaction_id").toString()
                );
            }
            
            throw new RuntimeException("Blockchain service error");
        } catch (Exception e) {
            // 记录日志，但不影响主流程
            e.printStackTrace();
            return CompletableFuture.completedFuture(null);
        }
    }
    
    @Override
    public BlockchainVerifyResponse verifyKnowledge(
            Long knowledgeId, String contentHash) {
        try {
            String url = blockchainServiceUrl + "/api/blockchain/verify";
            
            Map<String, Object> request = new HashMap<>();
            request.put("knowledge_id", knowledgeId);
            request.put("content_hash", contentHash);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<BlockchainVerifyResponse> response = restTemplate.postForEntity(
                url, entity, BlockchainVerifyResponse.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
            
            return BlockchainVerifyResponse.builder()
                .isValid(false)
                .build();
        } catch (Exception e) {
            e.printStackTrace();
            return BlockchainVerifyResponse.builder()
                .isValid(false)
                .build();
        }
    }
    
    @Override
    public Object getTransaction(Long knowledgeId) {
        try {
            String url = blockchainServiceUrl + "/api/blockchain/transaction/" + knowledgeId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

#### 4.4.3 在业务服务中集成

```java
@Service
public class KnowledgeItemServiceImpl implements KnowledgeItemService {
    
    @Autowired
    private BlockchainService blockchainService;
    
    @Override
    public KnowledgeItemDTO create(CreateKnowledgeRequest request) {
        // 1. 保存到数据库
        KnowledgeItem item = saveToDatabase(request);
        
        // 2. 计算内容哈希
        String contentHash = calculateContentHash(item);
        
        // 3. 异步调用区块链存证（不阻塞主流程）
        blockchainService.certifyKnowledge(
            item.getId(),
            item.getUploaderId(),
            contentHash
        );
        
        return convertToDTO(item);
    }
    
    private String calculateContentHash(KnowledgeItem item) {
        String content = item.getTitle() + item.getContent();
        return DigestUtils.sha256Hex(content);
    }
}
```

### 4.5 配置管理

#### 4.5.1 Spring Boot配置

```yaml
# application.yml
blockchain:
  service:
    url: ${BLOCKCHAIN_SERVICE_URL:http://localhost:8000}
    timeout: 5000
    retry:
      enabled: true
      max-attempts: 3
      backoff: 1000
```

#### 4.5.2 Python服务配置

```python
# config.py
import os

class Config:
    # 数据库配置
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///blockchain.db")
    
    # 服务配置
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # 区块链配置
    DIFFICULTY = int(os.getenv("BLOCKCHAIN_DIFFICULTY", 2))
    AUTO_CREATE_BLOCK = os.getenv("AUTO_CREATE_BLOCK", "true").lower() == "true"
    CREATE_BLOCK_INTERVAL = int(os.getenv("CREATE_BLOCK_INTERVAL", 60))  # 秒
    
    # CORS配置
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
```

### 4.6 部署方案

#### 4.6.1 Docker部署

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  blockchain-service:
    build: ./blockchain-service
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/blockchain
      - BLOCKCHAIN_DIFFICULTY=2
    volumes:
      - ./blockchain-data:/app/data
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=blockchain
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - blockchain-db:/var/lib/postgresql/data

volumes:
  blockchain-db:
```

### 4.7 使用场景

#### 4.7.1 知识内容存证

```java
// 创建知识内容时自动存证
@PostMapping("/knowledge")
public Result<KnowledgeItemDTO> createKnowledge(@RequestBody CreateKnowledgeRequest request) {
    KnowledgeItemDTO item = knowledgeItemService.create(request);
    // 存证在服务层异步执行
    return Result.success(item);
}
```

#### 4.7.2 版权验证

```java
// 验证知识内容版权
@GetMapping("/knowledge/{id}/verify")
public Result<BlockchainVerifyResponse> verifyKnowledge(
        @PathVariable Long id) {
    KnowledgeItem item = knowledgeItemService.findById(id);
    String contentHash = calculateHash(item);
    BlockchainVerifyResponse response = blockchainService.verifyKnowledge(id, contentHash);
    return Result.success(response);
}
```

#### 4.7.3 成就认证

```java
// 用户获得成就时上链
public void awardAchievement(Long userId, String achievementType) {
    String achievementHash = generateAchievementHash(userId, achievementType);
    blockchainService.certifyAchievement(userId, achievementType, achievementHash);
}
```

---

## 5. 数据库设计

### 5.1 数据库概述

- **数据库名称**: educhain_db
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **存储引擎**: InnoDB
- **表数量**: 20张核心表

### 5.2 核心表结构

#### 5.2.1 用户相关表

**users (用户表)**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('LEARNER', 'ADMIN') NOT NULL DEFAULT 'LEARNER',
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    school VARCHAR(100),
    level INT NOT NULL DEFAULT 1,
    bio TEXT,
    status INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
);
```

**user_stats (用户统计表)**
```sql
CREATE TABLE user_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    knowledge_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    favorite_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    follower_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    achievement_count INT NOT NULL DEFAULT 0,
    login_count INT NOT NULL DEFAULT 0,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 5.2.2 知识内容相关表

**knowledge_items (知识条目表)**
```sql
CREATE TABLE knowledge_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    type ENUM('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LINK', 'MIXED') NOT NULL DEFAULT 'TEXT',
    media_urls JSON,
    link_url VARCHAR(500),
    uploader_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    tags VARCHAR(500),
    status INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_title (title),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_category_id (category_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

**knowledge_stats (知识统计表)**
```sql
CREATE TABLE knowledge_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id BIGINT NOT NULL UNIQUE,
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    favorite_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    share_count BIGINT NOT NULL DEFAULT 0,
    quality_score DOUBLE DEFAULT 0.0,
    last_view_at DATETIME,
    last_interaction_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_items(id) ON DELETE CASCADE
);
```

### 5.3 索引优化

#### 5.3.1 复合索引

```sql
-- 知识内容查询优化
CREATE INDEX idx_knowledge_status_created 
ON knowledge_items(status, created_at DESC);

-- 互动查询优化
CREATE INDEX idx_interactions_knowledge_type 
ON user_interactions(knowledge_id, interaction_type);

-- 评论查询优化
CREATE INDEX idx_comments_knowledge_created 
ON comments(knowledge_id, created_at DESC);
```

#### 5.3.2 全文索引

```sql
-- 搜索优化（MySQL 5.7+）
ALTER TABLE knowledge_items 
ADD FULLTEXT INDEX ft_title_content (title, content);
```

### 5.4 数据关系图

```
users (1) ──< (N) knowledge_items
users (1) ──< (N) comments
users (1) ──< (N) user_interactions
users (1) ──< (N) user_follows (follower)
users (1) ──< (N) user_follows (following)

categories (1) ──< (N) knowledge_items
categories (1) ──< (N) categories (parent)

knowledge_items (1) ──< (N) comments
knowledge_items (1) ──< (N) user_interactions
knowledge_items (1) ──< (1) knowledge_stats
knowledge_items (1) ──< (N) knowledge_versions
```

---

## 6. API 设计规范

### 6.1 RESTful API 设计原则

#### 6.1.1 URL设计

```
GET    /api/knowledge              # 获取知识列表
GET    /api/knowledge/{id}         # 获取知识详情
POST   /api/knowledge              # 创建知识内容
PUT    /api/knowledge/{id}         # 更新知识内容
DELETE /api/knowledge/{id}         # 删除知识内容
```

#### 6.1.2 HTTP方法

- **GET**: 查询资源
- **POST**: 创建资源
- **PUT**: 完整更新资源
- **PATCH**: 部分更新资源
- **DELETE**: 删除资源

#### 6.1.3 状态码

```java
200 OK              // 请求成功
201 Created         // 资源创建成功
204 No Content      // 删除成功
400 Bad Request     // 请求参数错误
401 Unauthorized    // 未认证
403 Forbidden       // 无权限
404 Not Found       // 资源不存在
409 Conflict        // 资源冲突
500 Internal Server Error // 服务器错误
```

### 6.2 统一响应格式

```java
public class Result<T> {
    private Integer code;      // 状态码
    private String message;    // 消息
    private T data;            // 数据
    private Long timestamp;    // 时间戳
    
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data, System.currentTimeMillis());
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null, System.currentTimeMillis());
    }
}
```

### 6.3 API文档

使用Swagger/OpenAPI自动生成API文档：

```java
@RestController
@RequestMapping("/api/knowledge")
@Tag(name = "知识内容管理", description = "知识内容的CRUD操作")
public class KnowledgeItemController {
    
    @GetMapping
    @Operation(summary = "获取知识列表", description = "支持分页、筛选、排序")
    public Result<Page<KnowledgeItemDTO>> getKnowledgeList(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size) {
        // ...
    }
}
```

### 6.4 分页规范

```java
// 请求参数
GET /api/knowledge?page=0&size=10&sort=createdAt,desc

// 响应格式
{
    "code": 200,
    "message": "success",
    "data": {
        "content": [...],
        "totalElements": 100,
        "totalPages": 10,
        "number": 0,
        "size": 10
    }
}
```

---

## 7. 前后端开发指南

### 7.1 后端开发指南

#### 7.1.1 项目结构

```
src/main/java/com/example/educhain/
├── controller/      # 控制器层
├── service/         # 服务层
│   └── impl/        # 服务实现
├── repository/      # 数据访问层
├── entity/          # 实体类
├── dto/             # 数据传输对象
├── config/          # 配置类
├── util/            # 工具类
└── exception/       # 异常处理
```

#### 7.1.2 开发规范

**Controller层**:
```java
@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
@Slf4j
public class KnowledgeItemController {
    
    private final KnowledgeItemService knowledgeItemService;
    
    @GetMapping("/{id}")
    public Result<KnowledgeItemDTO> getKnowledge(@PathVariable Long id) {
        return Result.success(knowledgeItemService.findById(id));
    }
}
```

**Service层**:
```java
@Service
@RequiredArgsConstructor
@Transactional
public class KnowledgeItemServiceImpl implements KnowledgeItemService {
    
    private final KnowledgeItemRepository repository;
    
    @Override
    public KnowledgeItemDTO findById(Long id) {
        KnowledgeItem item = repository.findById(id)
            .orElseThrow(() -> new BusinessException("知识内容不存在"));
        return convertToDTO(item);
    }
}
```

#### 7.1.3 异常处理

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.error(400, e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error(500, "系统异常，请稍后重试");
    }
}
```

### 7.2 前端开发指南

#### 7.2.1 项目结构

```
frontend/src/
├── pages/           # 页面组件
├── components/      # UI组件
├── services/        # API服务
├── contexts/        # 上下文
├── hooks/           # 自定义Hooks
├── utils/           # 工具函数
├── types/           # 类型定义
└── constants/       # 常量
```

#### 7.2.2 组件开发

```tsx
// 函数组件示例
import React from 'react';
import { Button } from 'antd';

interface Props {
  title: string;
  onClick: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClick}>点击</Button>
    </div>
  );
};

export default MyComponent;
```

#### 7.2.3 API调用

```typescript
// services/knowledge.ts
import api from './api';

export const knowledgeService = {
  getList: (params: any) => 
    api.get('/knowledge', { params }),
  
  getById: (id: number) => 
    api.get(`/knowledge/${id}`),
  
  create: (data: CreateKnowledgeRequest) => 
    api.post('/knowledge', data),
};
```

#### 7.2.4 状态管理

```tsx
// contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (token: string) => {
    localStorage.setItem('token', token);
    // 获取用户信息
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 8. 安全机制

### 8.1 认证与授权

#### 8.1.1 JWT认证

```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userDetails.getUsername());
        claims.put("roles", userDetails.getAuthorities());
        
        return Jwts.builder()
            .setClaims(claims)
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
    
    public Boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

#### 8.1.2 Spring Security配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 8.2 接口限流

#### 8.2.1 限流配置

```java
@Aspect
@Component
public class RateLimitAspect {
    
    @Around("@annotation(rateLimit)")
    public Object rateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) {
        String key = generateKey(joinPoint);
        if (!rateLimiter.tryAcquire(key, rateLimit.limit(), rateLimit.window())) {
            throw new RateLimitException("请求过于频繁，请稍后重试");
        }
        return joinPoint.proceed();
    }
}
```

#### 8.2.2 限流注解

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    int limit() default 100;
    int window() default 60;  // 秒
    RateLimitType type() default RateLimitType.IP;
}
```

### 8.3 数据安全

#### 8.3.1 密码加密

```java
@Service
public class PasswordEncoder {
    
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    
    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }
    
    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
```

#### 8.3.2 SQL注入防护

- 使用JPA参数化查询
- 避免拼接SQL语句
- 输入验证和过滤

#### 8.3.3 XSS防护

```java
@Component
public class XssFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) {
        // XSS过滤逻辑
        chain.doFilter(new XssHttpServletRequestWrapper((HttpServletRequest) request), 
                      response);
    }
}
```

---

## 9. 性能优化

### 9.1 数据库优化

#### 9.1.1 索引优化

- 为常用查询字段创建索引
- 使用复合索引优化多条件查询
- 定期分析慢查询日志

#### 9.1.2 查询优化

```java
// 使用分页查询
Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
Page<KnowledgeItem> items = repository.findAll(pageable);

// 使用投影查询（只查询需要的字段）
@Query("SELECT k.id, k.title, k.createdAt FROM KnowledgeItem k")
List<KnowledgeItemProjection> findProjections();
```

### 9.2 缓存策略

#### 9.2.1 Redis缓存

```java
@Service
public class KnowledgeItemService {
    
    @Cacheable(value = "knowledge", key = "#id")
    public KnowledgeItemDTO findById(Long id) {
        return repository.findById(id).map(this::convertToDTO).orElse(null);
    }
    
    @CacheEvict(value = "knowledge", key = "#id")
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
```

#### 9.2.2 缓存配置

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

### 9.3 前端优化

#### 9.3.1 代码分割

```tsx
// 路由懒加载
const KnowledgeList = React.lazy(() => import('@/pages/knowledge/KnowledgeList'));

<Suspense fallback={<Loading />}>
  <KnowledgeList />
</Suspense>
```

#### 9.3.2 图片优化

- 使用WebP格式
- 图片懒加载
- CDN加速

#### 9.3.3 打包优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd'],
        },
      },
    },
  },
});
```

---

## 10. 部署方案

### 10.1 Docker部署

#### 10.1.1 后端Dockerfile

```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/EduChain-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 10.1.2 前端Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 10.1.3 Docker Compose

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: educhain_db
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
  
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

### 10.2 环境配置

#### 10.2.1 开发环境

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/educhain_db_dev
  jpa:
    show-sql: true
logging:
  level:
    com.example.educhain: DEBUG
```

#### 10.2.2 生产环境

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false
logging:
  level:
    root: WARN
    com.example.educhain: INFO
```

---

## 11. 开发规范

### 11.1 代码规范

#### 11.1.1 Java代码规范

- 遵循Google Java Style Guide
- 使用Spotless自动格式化
- 类名使用大驼峰
- 方法名使用小驼峰
- 常量使用大写下划线

#### 11.1.2 TypeScript代码规范

- 使用ESLint + Prettier
- 函数组件优先
- 使用TypeScript严格模式
- 接口命名使用大驼峰
- 变量命名使用小驼峰

### 11.2 Git工作流

#### 11.2.1 分支策略

```
main          # 主分支（生产环境）
├── develop   # 开发分支
├── feature/* # 功能分支
├── bugfix/*  # 修复分支
└── hotfix/*  # 热修复分支
```

#### 11.2.2 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 11.3 注释规范

```java
/**
 * 知识内容服务实现类
 * 
 * @author EduChain Team
 * @since 1.0.0
 */
@Service
public class KnowledgeItemServiceImpl implements KnowledgeItemService {
    
    /**
     * 根据ID查找知识内容
     * 
     * @param id 知识内容ID
     * @return 知识内容DTO
     * @throws BusinessException 当知识内容不存在时
     */
    @Override
    public KnowledgeItemDTO findById(Long id) {
        // 实现逻辑
    }
}
```

---

## 12. 测试策略

### 12.1 单元测试

```java
@SpringBootTest
class KnowledgeItemServiceTest {
    
    @Autowired
    private KnowledgeItemService service;
    
    @Test
    void testFindById() {
        KnowledgeItemDTO dto = service.findById(1L);
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
    }
}
```

### 12.2 集成测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class KnowledgeItemControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetKnowledge() throws Exception {
        mockMvc.perform(get("/api/knowledge/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200));
    }
}
```

### 12.3 前端测试

```typescript
// 组件测试
import { render, screen } from '@testing-library/react';
import KnowledgeCard from './KnowledgeCard';

test('renders knowledge card', () => {
  render(<KnowledgeCard title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

---

## 13. 监控与运维

### 13.1 日志管理

#### 13.1.1 日志配置

```yaml
logging:
  level:
    root: INFO
    com.example.educhain: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/educhain.log
    max-size: 10MB
    max-history: 30
```

#### 13.1.2 日志级别

- **DEBUG**: 调试信息
- **INFO**: 一般信息
- **WARN**: 警告信息
- **ERROR**: 错误信息

### 13.2 监控指标

#### 13.2.1 Spring Boot Actuator

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

#### 13.2.2 关键指标

- API响应时间
- 数据库连接池状态
- Redis连接状态
- JVM内存使用
- 错误率

### 13.3 告警机制

- 错误率超过阈值
- 响应时间过长
- 数据库连接异常
- 服务不可用

---

## 附录

### A. 技术栈版本

| 技术 | 版本 |
|------|------|
| Java | 21 |
| Spring Boot | 3.2.0 |
| React | 19.2.0 |
| TypeScript | 5.9.3 |
| MySQL | 8.0+ |
| Redis | 7+ |
| Python | 3.11+ |
| FastAPI | Latest |

### B. 参考资源

- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [React官方文档](https://react.dev)
- [Ant Design文档](https://ant.design)
- [FastAPI文档](https://fastapi.tiangolo.com)

### C. 联系方式

- **项目仓库**: [GitHub Repository]
- **问题反馈**: [Issue Tracker]
- **技术文档**: [Documentation Site]

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-01  
**维护者**: EduChain 开发团队

