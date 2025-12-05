# EduChain 区块链存证系统优化方案 - 设计文档

> **版本**: v1.0.0  
> **日期**: 2025-01-01  
> **基于需求**: requirements.md v1.0.0

## 1. 设计概述

本设计文档描述了EduChain区块链存证系统优化方案的技术实现方案，包括架构设计、组件设计、数据模型和接口设计。

### 1.1 设计目标

1. **可见性**：让区块链从后台服务变成用户可见的核心功能
2. **可用性**：提供直观易用的区块链浏览器和存证证书
3. **专业性**：展示技术深度，突出项目亮点
4. **合规性**：确保所有功能符合监管要求

### 1.2 技术选型

| 模块 | 技术栈 | 说明 |
|------|--------|------|
| 前端浏览器 | React + TypeScript + Ant Design | 区块链浏览器UI |
| 证书生成 | Python + ReportLab | PDF证书生成 |
| 数据可视化 | ECharts / Recharts | 统计图表 |
| Merkle Tree | Python hashlib | 高效验证 |
| 数字签名 | Python cryptography | RSA签名 |

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────┐
│         前端层 (React)                   │
│  ┌────────────────────────────────────┐ │
│  │ 区块链浏览器页面                    │ │
│  │ - 区块列表                          │ │
│  │ - 区块详情                          │ │
│  │ - 交易详情                          │ │
│  │ - 搜索功能                          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ 存证信息展示组件                    │ │
│  │ - 存证状态卡片                      │ │
│  │ - 证书下载按钮                      │ │
│  │ - 验证功能                          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ 存证进度组件                        │ │
│  │ - 步骤展示                          │ │
│  │ - 进度条                            │ │
│  └────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTP/HTTPS
┌─────────────────▼───────────────────────┐
│      Spring Boot 后端服务                │
│  ┌────────────────────────────────────┐ │
│  │ BlockchainController (新增)        │ │
│  │ - 浏览器API                         │ │
│  │ - 证书生成API                       │ │
│  │ - 统计API                           │ │
│  └────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTP
┌─────────────────▼───────────────────────┐
│      Python 区块链服务 (FastAPI)         │
│  ┌────────────────────────────────────┐ │
│  │ 新增功能模块                        │ │
│  │ - CertificateGenerator (证书)      │ │
│  │ - MerkleTree (默克尔树)            │ │
│  │ - DigitalSignature (数字签名)      │ │
│  │ - StatisticsService (统计)         │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2.2 模块划分

#### 前端模块
- `pages/blockchain/` - 区块链浏览器页面
- `components/blockchain/` - 区块链相关组件
- `services/blockchain.ts` - 区块链API服务

#### 后端模块
- `controller/BlockchainController.java` - 区块链控制器
- `service/BlockchainCertificateService.java` - 证书服务
- `service/BlockchainStatisticsService.java` - 统计服务

#### 区块链服务模块
- `app/certificate.py` - 证书生成
- `app/merkle_tree.py` - Merkle Tree
- `app/digital_signature.py` - 数字签名
- `app/statistics.py` - 统计服务


## 3. 组件设计

### 3.1 区块链浏览器（前端）

#### 3.1.1 页面结构
- **BlockchainExplorer.tsx** - 主页面
  - 区块链概览卡片
  - 区块列表表格
  - 搜索框
  - 分页组件

- **BlockDetail.tsx** - 区块详情页
  - 区块基本信息
  - 交易列表
  - 哈希值展示
  - 返回按钮

- **TransactionDetail.tsx** - 交易详情页
  - 交易类型
  - 知识ID链接
  - 用户ID链接
  - 内容哈希
  - 时间戳

#### 3.1.2 组件设计
```
BlockchainExplorer/
├── BlockchainOverview.tsx      # 概览卡片
├── BlockList.tsx                # 区块列表
├── BlockCard.tsx                # 区块卡片
├── TransactionList.tsx          # 交易列表
├── TransactionCard.tsx          # 交易卡片
├── BlockchainSearch.tsx         # 搜索组件
└── BlockchainStats.tsx          # 统计图表
```

### 3.2 存证证书生成（后端）

#### 3.2.1 证书数据结构
```python
@dataclass
class Certificate:
    certificate_id: str          # 证书编号
    knowledge_id: int            # 知识ID
    knowledge_title: str         # 知识标题
    user_id: int                 # 用户ID
    user_name: str               # 用户名
    content_hash: str            # 内容哈希
    block_index: int             # 区块索引
    block_hash: str              # 区块哈希
    timestamp: str               # 存证时间
    verification_url: str        # 验证地址
    qr_code: str                 # 二维码
```

#### 3.2.2 证书生成流程
1. 接收存证完成通知
2. 查询区块链数据
3. 生成证书编号
4. 生成二维码
5. 渲染PDF模板
6. 保存证书文件
7. 返回下载链接

### 3.3 Merkle Tree实现

#### 3.3.1 数据结构
```python
class MerkleTree:
    def __init__(self, transactions: List[Transaction]):
        self.transactions = transactions
        self.leaves = []           # 叶子节点
        self.tree = []             # 完整树
        self.root = None           # 根哈希
        
    def build_tree(self) -> str:
        # 构建Merkle树
        pass
        
    def get_proof(self, transaction: Transaction) -> List[str]:
        # 获取Merkle证明
        pass
        
    def verify_proof(self, transaction: Transaction, 
                     proof: List[str], root: str) -> bool:
        # 验证Merkle证明
        pass
```

#### 3.3.2 验证流程
1. 计算交易哈希（叶子节点）
2. 使用Merkle Proof逐层计算
3. 比对计算结果与Merkle Root
4. 返回验证结果

### 3.4 数字签名实现

#### 3.4.1 密钥管理
```python
class KeyManager:
    def generate_key_pair(self, user_id: int) -> Tuple[str, str]:
        # 生成RSA密钥对
        # 返回 (public_key, private_key)
        pass
        
    def save_keys(self, user_id: int, public_key: str, 
                  private_key_encrypted: str):
        # 保存密钥（私钥加密存储）
        pass
        
    def get_public_key(self, user_id: int) -> str:
        # 获取公钥
        pass
```

#### 3.4.2 签名流程
1. 获取用户私钥
2. 对交易数据进行哈希
3. 使用私钥签名
4. 将签名附加到交易
5. 验证时使用公钥验证


## 4. 数据模型

### 4.1 扩展Block模型
```python
@dataclass
class Block:
    index: int
    timestamp: str
    transactions: List[Transaction]
    previous_hash: str
    hash: str
    merkle_root: str = None        # 新增：Merkle根
    merkle_tree_depth: int = 0     # 新增：树深度
```

### 4.2 扩展Transaction模型
```python
@dataclass
class Transaction:
    type: str
    knowledge_id: Optional[int]
    user_id: Optional[int]
    content_hash: str
    metadata: Dict[str, Any]
    timestamp: str
    signature: str = None          # 新增：数字签名
    public_key: str = None         # 新增：公钥
```

### 4.3 新增Certificate模型
```python
@dataclass
class Certificate:
    id: str
    knowledge_id: int
    user_id: int
    block_index: int
    content_hash: str
    created_at: str
    pdf_url: str
    qr_code_url: str
```

### 4.4 新增Statistics模型
```python
@dataclass
class BlockchainStatistics:
    total_blocks: int
    total_transactions: int
    daily_certifications: List[Dict]
    transaction_type_distribution: Dict[str, int]
    top_users: List[Dict]
    average_block_time: float
    chain_size_mb: float
```

## 5. API设计

### 5.1 区块链浏览器API

#### 获取区块链概览
```
GET /api/blockchain/overview
Response: {
  "total_blocks": 1234,
  "total_transactions": 5678,
  "latest_block": {
    "index": 1234,
    "hash": "abc123...",
    "timestamp": "2025-01-01T12:00:00Z",
    "transactions_count": 5
  },
  "chain_valid": true
}
```

#### 获取区块列表
```
GET /api/blockchain/blocks?page=0&size=20&sort=index,desc
Response: {
  "content": [
    {
      "index": 1234,
      "timestamp": "2025-01-01T12:00:00Z",
      "transactions_count": 5,
      "hash": "abc123...",
      "previous_hash": "def456..."
    }
  ],
  "total_elements": 1234,
  "total_pages": 62
}
```

#### 获取区块详情
```
GET /api/blockchain/blocks/{index}
Response: {
  "index": 1234,
  "timestamp": "2025-01-01T12:00:00Z",
  "hash": "abc123...",
  "previous_hash": "def456...",
  "merkle_root": "789xyz...",
  "transactions": [...]
}
```

### 5.2 存证证书API

#### 生成证书
```
POST /api/blockchain/certificates
Request: {
  "knowledge_id": 123,
  "user_id": 456
}
Response: {
  "certificate_id": "CERT-2025-001234",
  "pdf_url": "https://educhain.com/certificates/...",
  "qr_code_url": "https://educhain.com/qr/...",
  "created_at": "2025-01-01T12:00:00Z"
}
```

#### 下载证书
```
GET /api/blockchain/certificates/{certificate_id}/download
Response: PDF文件流
```

#### 验证证书
```
GET /api/blockchain/certificates/{certificate_id}/verify
Response: {
  "valid": true,
  "certificate_id": "CERT-2025-001234",
  "knowledge_id": 123,
  "block_index": 1234,
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### 5.3 统计API

#### 获取统计数据
```
GET /api/blockchain/statistics
Response: {
  "total_blocks": 1234,
  "total_transactions": 5678,
  "daily_certifications": [
    {"date": "2025-01-01", "count": 50},
    {"date": "2025-01-02", "count": 60}
  ],
  "transaction_types": {
    "KNOWLEDGE_CERT": 4000,
    "ACHIEVEMENT": 1500,
    "COPYRIGHT": 178
  },
  "top_users": [
    {"user_id": 123, "name": "张三", "count": 100},
    {"user_id": 456, "name": "李四", "count": 80}
  ]
}
```

### 5.4 批量验证API

#### 批量验证
```
POST /api/blockchain/verify/batch
Request: {
  "items": [
    {"knowledge_id": 123, "content_hash": "abc..."},
    {"knowledge_id": 456, "content_hash": "def..."}
  ]
}
Response: {
  "results": [
    {"knowledge_id": 123, "valid": true},
    {"knowledge_id": 456, "valid": false, "error": "Hash mismatch"}
  ],
  "total": 2,
  "passed": 1,
  "failed": 1
}
```


## 6. 错误处理

### 6.1 错误码定义
```
BC001: 区块不存在
BC002: 交易不存在
BC003: 证书生成失败
BC004: 验证失败
BC005: Merkle证明无效
BC006: 数字签名验证失败
BC007: 密钥不存在
BC008: 数据导出失败
```

### 6.2 错误响应格式
```json
{
  "code": "BC001",
  "message": "区块不存在",
  "details": "Block with index 9999 not found",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## 7. 测试策略

### 7.1 单元测试

#### 前端组件测试
- 区块链浏览器组件渲染测试
- 存证信息卡片交互测试
- 进度条状态更新测试
- 搜索功能测试

#### 后端服务测试
- 证书生成逻辑测试
- Merkle Tree构建和验证测试
- 数字签名生成和验证测试
- 统计数据计算测试

### 7.2 集成测试

#### API集成测试
- 区块链浏览器API端到端测试
- 证书生成和下载流程测试
- 批量验证功能测试
- 统计数据查询测试

#### 前后端集成测试
- 存证流程完整测试
- 证书下载功能测试
- 区块链浏览器数据展示测试

### 7.3 性能测试

#### 性能指标
- 区块链浏览器页面加载时间 < 2秒
- 证书生成时间 < 1秒
- 单个验证时间 < 500毫秒
- 批量验证100个 < 10秒
- Merkle验证比遍历快50%以上

#### 压力测试
- 并发100用户访问区块链浏览器
- 并发50个证书生成请求
- 1000个内容批量验证

## 8. 安全设计

### 8.1 认证授权
- 所有区块链API需要JWT认证
- 证书下载需要验证用户权限
- 数据导出限制管理员权限
- 批量操作需要特殊权限

### 8.2 数据安全
- 私钥加密存储（AES-256）
- HTTPS传输加密
- 证书包含防伪水印
- 敏感信息脱敏展示

### 8.3 防护措施
- API限流（每分钟100次）
- 证书生成限流（每用户每天100次）
- 批量验证限制（单次最多1000个）
- SQL注入防护
- XSS攻击防护

## 9. 部署方案

### 9.1 前端部署
- 构建生产版本
- 部署到Nginx
- 配置CDN加速
- 启用Gzip压缩

### 9.2 后端部署
- 打包Spring Boot应用
- 部署到服务器
- 配置反向代理
- 启用HTTPS

### 9.3 区块链服务部署
- 打包Python应用
- 使用Gunicorn运行
- 配置进程管理
- 数据库备份策略

## 10. 监控和运维

### 10.1 监控指标
- API响应时间
- 证书生成成功率
- 区块链验证成功率
- 系统资源使用率
- 错误日志统计

### 10.2 告警规则
- API响应时间 > 3秒
- 证书生成失败率 > 5%
- 验证失败率 > 10%
- CPU使用率 > 80%
- 内存使用率 > 85%

### 10.3 日志管理
- 访问日志
- 错误日志
- 操作日志
- 安全日志
- 性能日志

## 11. 技术亮点

### 11.1 创新点
1. **可视化区块链浏览器**：让区块链对用户可见
2. **自动证书生成**：提供法律效力凭证
3. **Merkle Tree优化**：提升验证效率
4. **数字签名**：确保身份可信
5. **实时进度展示**：优化用户体验

### 11.2 技术深度
1. **完整的区块链实现**：自主开发，非第三方API
2. **SHA-256哈希算法**：保证数据完整性
3. **链式结构**：保证不可篡改
4. **Merkle Tree**：高效验证算法
5. **RSA数字签名**：身份认证机制

### 11.3 应用价值
1. **版权保护**：知识内容存证
2. **成就认证**：学习成就可信
3. **防止抄袭**：内容溯源
4. **法律效力**：存证证书可作为证据
5. **提升公信力**：区块链技术背书

---

**设计文档版本**: v1.0.0  
**最后更新**: 2025-01-01  
**设计者**: EduChain 技术团队  
**审核状态**: 待审核

