/**
 * Redis 缓存设计与实践
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const redisCacheKnowledge = {
  id: 7,
  shareCode: generateMockShareCode(7),
  title: 'Redis 缓存设计与实践 - 高性能缓存方案',
  content: `# Redis 缓存设计与实践 - 高性能缓存方案

## 🚀 引言

Redis 是一个开源的内存数据结构存储系统，可以用作数据库、缓存和消息中间件。它支持多种数据结构，提供了丰富的功能，是构建高性能应用的利器。

### Redis 的优势

✅ **高性能** - 内存存储，读写速度快
✅ **丰富的数据结构** - 支持多种数据类型
✅ **持久化** - 支持 RDB 和 AOF
✅ **高可用** - 支持主从复制和哨兵模式
✅ **分布式** - 支持集群模式

---

## 📚 核心数据结构

### 1. String（字符串）

\`\`\`bash
# 设置值
SET key "value"
SET counter 100

# 获取值
GET key

# 自增/自减
INCR counter
DECR counter
INCRBY counter 10

# 设置过期时间
SETEX key 3600 "value"  # 3600秒后过期
SET key "value" EX 3600

# 批量操作
MSET key1 "value1" key2 "value2"
MGET key1 key2
\`\`\`

### 2. Hash（哈希）

\`\`\`bash
# 设置字段
HSET user:1 name "John"
HSET user:1 age 30
HSET user:1 email "john@example.com"

# 批量设置
HMSET user:1 name "John" age 30 email "john@example.com"

# 获取字段
HGET user:1 name
HMGET user:1 name age

# 获取所有字段
HGETALL user:1

# 删除字段
HDEL user:1 email

# 判断字段是否存在
HEXISTS user:1 name

# 获取所有字段名
HKEYS user:1

# 获取所有值
HVALS user:1
\`\`\`

### 3. List（列表）

\`\`\`bash
# 左侧推入
LPUSH queue "task1"
LPUSH queue "task2"

# 右侧推入
RPUSH queue "task3"

# 左侧弹出
LPOP queue

# 右侧弹出
RPOP queue

# 阻塞弹出
BLPOP queue 30  # 30秒超时

# 获取范围元素
LRANGE queue 0 -1  # 获取所有元素
LRANGE queue 0 9   # 获取前10个元素

# 获取列表长度
LLEN queue

# 修剪列表
LTRIM queue 0 99  # 只保留前100个元素
\`\`\`

### 4. Set（集合）

\`\`\`bash
# 添加元素
SADD tags "redis" "cache" "nosql"

# 获取所有元素
SMEMBERS tags

# 判断元素是否存在
SISMEMBER tags "redis"

# 删除元素
SREM tags "cache"

# 获取集合大小
SCARD tags

# 集合运算
SINTER set1 set2  # 交集
SUNION set1 set2  # 并集
SDIFF set1 set2   # 差集

# 随机获取元素
SRANDMEMBER tags 2
\`\`\`

### 5. Sorted Set（有序集合）

\`\`\`bash
# 添加元素
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"
ZADD leaderboard 150 "player3"

# 获取排名范围
ZRANGE leaderboard 0 -1  # 按分数升序
ZREVRANGE leaderboard 0 -1  # 按分数降序

# 获取分数范围
ZRANGEBYSCORE leaderboard 100 200

# 获取元素分数
ZSCORE leaderboard "player1"

# 获取元素排名
ZRANK leaderboard "player1"  # 升序排名
ZREVRANK leaderboard "player1"  # 降序排名

# 增加分数
ZINCRBY leaderboard 10 "player1"

# 删除元素
ZREM leaderboard "player1"

# 获取集合大小
ZCARD leaderboard
\`\`\`

---

## 🎯 缓存策略

### 1. 缓存穿透

**问题：** 查询不存在的数据，导致每次都查询数据库。

**解决方案：**

\`\`\`python
# 方案 1: 缓存空值
def get_user(user_id):
    # 先查缓存
    user = redis.get(f"user:{user_id}")
    if user is not None:
        if user == "null":  # 空值
            return None
        return json.loads(user)
    
    # 查数据库
    user = db.query_user(user_id)
    if user:
        redis.setex(f"user:{user_id}", 3600, json.dumps(user))
    else:
        # 缓存空值，设置较短过期时间
        redis.setex(f"user:{user_id}", 60, "null")
    
    return user

# 方案 2: 布隆过滤器
from pybloom_live import BloomFilter

bloom = BloomFilter(capacity=1000000, error_rate=0.001)

# 初始化：将所有存在的 ID 加入布隆过滤器
for user_id in db.get_all_user_ids():
    bloom.add(user_id)

def get_user(user_id):
    # 先检查布隆过滤器
    if user_id not in bloom:
        return None  # 一定不存在
    
    # 可能存在，继续查询
    return query_user_with_cache(user_id)
\`\`\`

### 2. 缓存击穿

**问题：** 热点数据过期，大量请求直接打到数据库。

**解决方案：**

\`\`\`python
import threading

locks = {}

def get_user(user_id):
    # 先查缓存
    user = redis.get(f"user:{user_id}")
    if user:
        return json.loads(user)
    
    # 获取锁
    lock_key = f"lock:user:{user_id}"
    if user_id not in locks:
        locks[user_id] = threading.Lock()
    
    with locks[user_id]:
        # 双重检查
        user = redis.get(f"user:{user_id}")
        if user:
            return json.loads(user)
        
        # 查数据库
        user = db.query_user(user_id)
        if user:
            redis.setex(f"user:{user_id}", 3600, json.dumps(user))
        
        return user

# 方案 2: 永不过期（逻辑过期）
def get_user(user_id):
    cache_data = redis.get(f"user:{user_id}")
    if cache_data:
        data = json.loads(cache_data)
        # 检查逻辑过期时间
        if data['expire_time'] > time.time():
            return data['user']
        else:
            # 异步更新缓存
            threading.Thread(target=update_cache, args=(user_id,)).start()
            return data['user']  # 返回旧数据
    
    return update_cache(user_id)
\`\`\`

### 3. 缓存雪崩

**问题：** 大量缓存同时过期，导致数据库压力骤增。

**解决方案：**

\`\`\`python
import random

def set_cache_with_random_ttl(key, value, base_ttl=3600):
    # 添加随机过期时间
    ttl = base_ttl + random.randint(0, 300)  # 0-5分钟随机值
    redis.setex(key, ttl, value)

# 多级缓存
class MultiLevelCache:
    def __init__(self):
        self.local_cache = {}  # 本地缓存
        self.redis = redis.Redis()
    
    def get(self, key):
        # 1. 查本地缓存
        if key in self.local_cache:
            return self.local_cache[key]
        
        # 2. 查 Redis
        value = self.redis.get(key)
        if value:
            self.local_cache[key] = value
            return value
        
        # 3. 查数据库
        value = db.query(key)
        if value:
            self.local_cache[key] = value
            self.redis.setex(key, 3600, value)
        
        return value
\`\`\`

### 4. 数据一致性

**问题：** 缓存和数据库数据不一致。

**解决方案：**

\`\`\`python
# 方案 1: 先更新数据库，再删除缓存
def update_user(user_id, data):
    # 1. 更新数据库
    db.update_user(user_id, data)
    
    # 2. 删除缓存
    redis.delete(f"user:{user_id}")

# 方案 2: 延迟双删
def update_user(user_id, data):
    # 1. 删除缓存
    redis.delete(f"user:{user_id}")
    
    # 2. 更新数据库
    db.update_user(user_id, data)
    
    # 3. 延迟删除缓存
    time.sleep(0.5)  # 等待可能的读操作完成
    redis.delete(f"user:{user_id}")

# 方案 3: 使用消息队列
def update_user(user_id, data):
    # 1. 更新数据库
    db.update_user(user_id, data)
    
    # 2. 发送消息到队列
    mq.publish('cache_invalidation', {
        'key': f"user:{user_id}",
        'action': 'delete'
    })
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: 分布式锁

\`\`\`python
import uuid
import time

class RedisLock:
    def __init__(self, redis_client, key, timeout=10):
        self.redis = redis_client
        self.key = f"lock:{key}"
        self.timeout = timeout
        self.identifier = str(uuid.uuid4())
    
    def acquire(self):
        end_time = time.time() + self.timeout
        while time.time() < end_time:
            # 尝试获取锁
            if self.redis.set(self.key, self.identifier, nx=True, ex=self.timeout):
                return True
            time.sleep(0.001)
        return False
    
    def release(self):
        # 使用 Lua 脚本保证原子性
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        self.redis.eval(script, 1, self.key, self.identifier)

# 使用
lock = RedisLock(redis, "resource_id")
if lock.acquire():
    try:
        # 执行业务逻辑
        pass
    finally:
        lock.release()
\`\`\`

### 案例 2: 限流器

\`\`\`python
def rate_limiter(user_id, max_requests=100, window=60):
    key = f"rate_limit:{user_id}"
    current = redis.incr(key)
    
    if current == 1:
        redis.expire(key, window)
    
    if current > max_requests:
        return False  # 超过限制
    
    return True  # 允许请求

# 滑动窗口限流
def sliding_window_limiter(user_id, max_requests=100, window=60):
    key = f"rate_limit:{user_id}"
    now = time.time()
    
    # 删除窗口外的记录
    redis.zremrangebyscore(key, 0, now - window)
    
    # 获取当前窗口内的请求数
    count = redis.zcard(key)
    
    if count < max_requests:
        redis.zadd(key, {str(uuid.uuid4()): now})
        redis.expire(key, window)
        return True
    
    return False
\`\`\`

### 案例 3: 排行榜

\`\`\`python
class Leaderboard:
    def __init__(self, redis_client, name):
        self.redis = redis_client
        self.key = f"leaderboard:{name}"
    
    def add_score(self, player_id, score):
        self.redis.zadd(self.key, {player_id: score})
    
    def increment_score(self, player_id, increment):
        self.redis.zincrby(self.key, increment, player_id)
    
    def get_top(self, n=10):
        return self.redis.zrevrange(self.key, 0, n-1, withscores=True)
    
    def get_rank(self, player_id):
        rank = self.redis.zrevrank(self.key, player_id)
        return rank + 1 if rank is not None else None
    
    def get_score(self, player_id):
        return self.redis.zscore(self.key, player_id)

# 使用
leaderboard = Leaderboard(redis, "game_scores")
leaderboard.add_score("player1", 1000)
leaderboard.increment_score("player1", 50)
top_players = leaderboard.get_top(10)
\`\`\`

---

## 📋 最佳实践

1. **键命名规范**
   - 使用冒号分隔：user:1:profile
   - 使用有意义的前缀
   - 避免过长的键名

2. **设置过期时间**
   - 所有缓存都应设置过期时间
   - 避免内存溢出
   - 根据业务场景设置合理的 TTL

3. **避免大 Key**
   - 单个 Key 不要超过 10KB
   - 使用 Hash 拆分大对象
   - 定期清理无用数据

4. **使用连接池**
   - 复用连接，减少开销
   - 设置合理的连接数
   - 处理连接异常

5. **监控和告警**
   - 监控内存使用
   - 监控命中率
   - 监控慢查询

---

## 🎓 总结

Redis 是构建高性能应用的重要工具，掌握其核心数据结构和缓存策略对于系统优化至关重要。通过本指南，你应该已经了解了：

- Redis 的核心数据结构和命令
- 常见的缓存问题和解决方案
- 实战案例和最佳实践

继续实践，你会发现 Redis 让应用性能提升显著！

---

**参考资源：**
- [Redis 官方文档](https://redis.io/documentation)
- [Redis 设计与实现](http://redisbook.com/)
- [Redis 实战](https://redislabs.com/ebook/redis-in-action/)`,
  type: 'TEXT' as const,
  uploaderId: 23,
  uploaderName: '李四二',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisier',
  categoryId: 32,
  categoryName: 'Redis',
  tags: 'Redis,缓存,NoSQL,数据库',
  status: 1,
  createdAt: '2025-12-06T10:30:00Z',
  updatedAt: '2025-12-21T10:20:00Z',
  contentHash: 'hash_redis_cache_patterns',
};
