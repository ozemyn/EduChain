# API限流机制使用指南

## 概述

EduChain平台实现了基于Redis的分布式限流系统，支持多种限流算法和策略，确保API的稳定性和安全性。

## 特性

- ✅ **分布式限流**：基于Redis实现，支持多实例部署
- ✅ **多种算法**：支持滑动窗口、令牌桶、固定窗口三种限流算法
- ✅ **灵活策略**：支持IP限流、用户限流、全局限流等多种维度
- ✅ **原子操作**：使用Lua脚本保证限流检查的原子性
- ✅ **优雅降级**：Redis异常时自动允许请求，避免影响业务
- ✅ **详细日志**：记录限流触发和异常情况

## 限流算法

### 1. 滑动窗口（sliding_window）
- **特点**：精确控制时间窗口内的请求数，避免固定窗口的突发问题
- **适用场景**：需要精确控制请求频率的场景
- **默认使用**

### 2. 令牌桶（token_bucket）
- **特点**：允许突发流量，适合流量波动较大的场景
- **适用场景**：文件上传、批量操作等
- **参数**：桶容量、令牌补充速率

### 3. 固定窗口（fixed_window）
- **特点**：实现简单，但可能在窗口边界出现突发
- **适用场景**：对精度要求不高的场景

## 限流类型

### 1. IP限流（IP）
- 基于客户端IP地址限流
- 适用于：登录、注册等公开接口

### 2. 用户限流（USER）
- 基于用户ID限流
- 适用于：文件上传、资源创建等需要认证的接口

### 3. 全局限流（GLOBAL）
- 所有请求共享同一个限流计数器
- 适用于：系统级别的限流

### 4. IP+用户组合（IP_AND_USER）
- 同时基于IP和用户ID限流
- 适用于：高安全性要求的接口

## 使用方法

### 1. 在Controller方法上添加注解

```java
@RestController
@RequestMapping("/api/example")
public class ExampleController {

    @PostMapping("/login")
    @RateLimit(
        key = "auth:login",
        limit = 10,           // 60秒内最多10次请求
        timeWindow = 60,      // 时间窗口60秒
        type = RateLimitType.IP,
        algorithm = "sliding_window",
        message = "登录请求过于频繁，请稍后再试"
    )
    public ResponseEntity<Result<LoginResponse>> login(@RequestBody LoginRequest request) {
        // 业务逻辑
    }
}
```

### 2. 在Controller类上添加注解（类级别）

```java
@RestController
@RequestMapping("/api/files")
@RateLimit(
    key = "file",
    limit = 20,
    timeWindow = 60,
    type = RateLimitType.USER,
    algorithm = "token_bucket"
)
public class FileController {
    // 该Controller下所有方法都应用此限流规则
}
```

### 3. 配置参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `key` | String | 是 | "rate_limit" | 限流键前缀 |
| `limit` | int | 是 | 100 | 时间窗口内的最大请求数 |
| `timeWindow` | int | 是 | 60 | 时间窗口（秒） |
| `type` | RateLimitType | 否 | IP | 限流类型 |
| `algorithm` | String | 否 | "sliding_window" | 限流算法 |
| `message` | String | 否 | "请求过于频繁，请稍后再试" | 限流时的错误消息 |
| `enabled` | boolean | 否 | true | 是否启用限流 |

## 配置示例

### application.yml配置

```yaml
rate-limit:
  enabled: true
  default-algorithm: sliding_window
  default-limit: 100
  default-window: 60
  endpoints:
    auth:
      limit: 10
      window: 60
      type: IP
      algorithm: sliding_window
    upload:
      limit: 20
      window: 60
      type: IP
      algorithm: token_bucket
    search:
      limit: 50
      window: 60
      type: IP
      algorithm: sliding_window
```

## 已配置的接口

### 认证接口（AuthController）
- `/auth/register`：注册接口，5次/分钟，IP限流
- `/auth/login`：登录接口，10次/分钟，IP限流
- `/auth/refresh`：刷新令牌，20次/分钟，用户限流，令牌桶算法

### 文件上传接口（FileUploadController）
- `/files/upload`：单文件上传，20次/分钟，用户限流，令牌桶算法
- `/files/upload-multiple`：批量上传，10次/分钟，用户限流，令牌桶算法

### 搜索接口（SearchController）
- `/search`：搜索接口，50次/分钟，IP限流，滑动窗口算法

## 异常处理

当触发限流时，系统会抛出`RateLimitException`异常，全局异常处理器会：
1. 返回HTTP 429（Too Many Requests）状态码
2. 在响应头中添加`Retry-After`字段，指示客户端何时可以重试
3. 返回友好的错误消息

### 响应示例

```json
{
  "success": false,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "登录请求过于频繁，请稍后再试，请在 45 秒后重试",
  "data": null,
  "path": "/api/auth/login"
}
```

响应头：
```
HTTP/1.1 429 Too Many Requests
Retry-After: 45
```

## 最佳实践

### 1. 选择合适的限流算法

- **高频查询接口**：使用滑动窗口，精确控制请求频率
- **文件上传接口**：使用令牌桶，允许合理的突发流量
- **批量操作接口**：使用令牌桶，提高吞吐量

### 2. 设置合理的限流阈值

- **登录/注册**：5-10次/分钟（防止暴力破解）
- **文件上传**：10-20次/分钟（考虑文件大小和服务器资源）
- **搜索接口**：30-50次/分钟（平衡用户体验和服务器负载）
- **一般API**：100-200次/分钟（默认限制）

### 3. 限流类型选择

- **公开接口**（登录、注册）：使用IP限流
- **需要认证的接口**：使用用户限流
- **高安全性接口**：使用IP+用户组合限流
- **系统级接口**：使用全局限流

### 4. 监控和调优

- 监控限流触发频率
- 根据实际流量调整限流阈值
- 关注Redis性能，确保限流不会成为瓶颈

## 技术实现

### 核心组件

1. **@RateLimit注解**：声明式限流注解
2. **RateLimitAspect**：AOP切面，拦截限流注解
3. **RateLimiter**：限流工具类，实现限流算法
4. **RedisConfig**：Redis配置，提供RedisTemplate Bean
5. **GlobalExceptionHandler**：全局异常处理，处理限流异常

### Redis数据结构

- **滑动窗口**：使用Sorted Set（ZSET）存储请求时间戳
- **令牌桶**：使用Hash存储令牌数量和最后补充时间
- **固定窗口**：使用String存储计数器

### 性能优化

- 使用Lua脚本保证原子性，避免竞态条件
- Redis异常时自动降级，不阻塞业务
- 合理的过期时间设置，避免内存泄漏

## 故障排查

### 1. 限流不生效

- 检查Redis连接是否正常
- 检查`rate-limit.enabled`配置是否为true
- 检查注解是否正确添加

### 2. 误触发限流

- 检查限流阈值是否设置合理
- 检查限流类型是否正确（IP vs 用户）
- 检查时间窗口是否合理

### 3. Redis性能问题

- 检查Redis连接池配置
- 检查限流键的过期时间设置
- 考虑使用Redis集群

## 扩展开发

### 添加新的限流算法

1. 在`RateLimiter`类中添加新的方法
2. 编写对应的Lua脚本
3. 在`RateLimitAspect`中添加算法分支

### 自定义限流键生成

修改`RateLimitAspect.buildRateLimitKey()`方法，添加自定义逻辑。

## 总结

EduChain的限流系统提供了完善的API限流功能，通过合理的配置和监控，可以有效保护系统资源，防止恶意攻击，同时保证正常用户的良好体验。

