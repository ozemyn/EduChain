# EduChain 后端系统文档

## 文档概述

本文档集为 EduChain 基于区块链存证的教育知识共享与智能检索系统后端的完整技术文档，适用于毕业设计参考。

## 文档目录

| 文档名称 | 说明 |
|---------|------|
| [后端系统设计文档](./后端系统设计文档.md) | 系统架构、技术栈、模块设计、安全机制 |
| [API接口文档](./API接口文档.md) | 全部21个控制器的RESTful API接口详细说明 |
| [实体类文档](./实体类文档.md) | 21个JPA实体类的数据模型设计 |
| [部署文档](./部署文档.md) | 构建、部署、配置、运维指南 |

## 系统概述

EduChain 后端是基于 Spring Boot 3.2 构建的现代化 Java 后端服务，采用分层架构设计，提供基于区块链存证的教育知识共享与智能检索系统的完整功能。

### 核心特性

- **Spring Boot 3.2** + **Java 21** 最新技术栈
- **Spring Security** + **JWT** 安全认证
- **Spring Data JPA** + **MySQL** 数据持久化
- **Redis** 缓存与限流
- **区块链存证** 知识内容防篡改
- **OpenAPI/Swagger** 接口文档

### 项目结构

```
src/main/java/com/example/educhain/
├── EduChainApplication.java      # 应用入口
├── annotation/                   # 自定义注解
├── aspect/                       # AOP切面
├── config/                       # 配置类 (13个)
├── controller/                   # 控制器 (21个)
├── dto/                          # 数据传输对象 (47个)
├── entity/                       # 实体类 (21个)
├── enums/                        # 枚举类
├── exception/                    # 异常处理
├── repository/                   # 数据访问层 (21个)
├── service/                      # 服务层 (22个)
└── util/                         # 工具类 (13个)
```

### 功能模块

| 模块 | 说明 |
|------|------|
| 认证模块 | 用户注册、登录、JWT令牌管理 |
| 用户模块 | 用户信息管理、统计、关注 |
| 知识模块 | 知识内容CRUD、版本管理、草稿 |
| 分类标签 | 分类树、标签管理 |
| 评论模块 | 评论、回复、审核 |
| 互动模块 | 点赞、收藏、浏览 |
| 通知模块 | 系统通知、消息推送 |
| 搜索模块 | 全文搜索、热词、推荐 |
| 区块链模块 | 内容存证、证书生成 |
| 管理模块 | 用户管理、内容审核、统计 |

## 快速开始

### 环境要求

- JDK 21+
- Maven 3.9+
- MySQL 8.0+
- Redis 7.0+

### 启动命令

```bash
# 开发环境
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 生产环境
java -jar target/EduChain-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### 访问地址

- API服务: http://localhost:8080/api
- Swagger文档: http://localhost:8080/api/swagger-ui.html

## 版本信息

- 文档版本: 1.0.0
- 更新日期: 2025年12月
- 作者: EduChain开发团队
