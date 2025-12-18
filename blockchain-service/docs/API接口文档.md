# EduChain 区块链服务 API 接口文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 服务名称 | EduChain Blockchain Service |
| 基础URL | http://localhost:8000 |
| API版本 | v1.0.0 |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

---

## 一、接口概览

### 1.1 基础接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取服务信息 |
| GET | `/health` | 健康检查 |

### 1.2 存证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/blockchain/certify` | 内容存证 |
| POST | `/api/blockchain/verify` | 内容验证 |
| POST | `/api/blockchain/create-block` | 手动创建区块 |

### 1.3 查询接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/blockchain/chain` | 获取区块链信息 |
| GET | `/api/blockchain/transaction/{knowledge_id}` | 查询交易 |
| GET | `/api/blockchain/block/{index}` | 查询区块 |
| GET | `/api/blockchain/user/{user_id}/transactions` | 用户交易列表 |
| GET | `/api/blockchain/stats` | 统计信息 |

### 1.4 证书接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/blockchain/certificates` | 生成证书 |
| GET | `/api/blockchain/certificates/{certificate_id}/download` | 下载证书 |
| GET | `/api/blockchain/certificates/{certificate_id}/verify` | 验证证书 |
| GET | `/api/blockchain/certificates/knowledge/{knowledge_id}` | 按知识ID查询证书 |

---

## 二、基础接口

### 2.1 获取服务信息

获取区块链服务的基本信息。

**请求**
```
GET /
```

**响应**
```json
{
    "service": "EduChain Blockchain Service",
    "version": "1.0.0",
    "status": "running"
}
```

---

### 2.2 健康检查

检查服务运行状态和区块链有效性。

**请求**
```
GET /health
```

**响应**
```json
{
    "status": "healthy",
    "chain_length": 100,
    "is_valid": true
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| status | string | 服务状态（healthy/unhealthy） |
| chain_length | integer | 区块链长度 |
| is_valid | boolean | 区块链是否有效 |

---

## 三、存证接口

### 3.1 内容存证

将知识内容的哈希值存证到区块链。

**请求**
```
POST /api/blockchain/certify
Content-Type: application/json
```

**请求体**
```json
{
    "type": "KNOWLEDGE_CERT",
    "knowledge_id": 12345,
    "user_id": 1001,
    "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "metadata": {
        "title": "React Hooks 完全指南",
        "category": "前端开发",
        "tags": ["React", "Hooks", "前端"]
    }
}
```

**请求参数说明**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 存证类型 |
| knowledge_id | integer | 否 | 知识内容ID |
| user_id | integer | 是 | 用户ID |
| content_hash | string | 是 | 内容SHA-256哈希值（64位） |
| metadata | object | 否 | 额外元数据 |

**存证类型说明**

| 类型值 | 说明 |
|--------|------|
| KNOWLEDGE_CERT | 知识内容存证 |
| ACHIEVEMENT | 用户成就认证 |
| COPYRIGHT | 版权声明 |
| USER_ACTION | 用户行为记录 |

**响应**
```json
{
    "transaction_id": 1,
    "block_index": 5,
    "status": "confirmed",
    "timestamp": "2025-01-15T10:30:00.000000"
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| transaction_id | integer | 交易ID（区块内序号） |
| block_index | integer | 区块索引 |
| status | string | 状态（pending/confirmed） |
| timestamp | string | 时间戳（ISO格式） |

---

### 3.2 内容验证

验证知识内容是否被篡改。

**请求**
```
POST /api/blockchain/verify
Content-Type: application/json
```

**请求体**
```json
{
    "knowledge_id": 12345,
    "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

**请求参数说明**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| knowledge_id | integer | 是 | 知识内容ID |
| content_hash | string | 是 | 当前内容的SHA-256哈希值 |

**响应（验证通过）**
```json
{
    "is_valid": true,
    "block_index": 5,
    "transaction_timestamp": "2025-01-15T10:30:00.000000",
    "message": "验证成功"
}
```

**响应（验证失败 - 内容被篡改）**
```json
{
    "is_valid": false,
    "block_index": 5,
    "transaction_timestamp": "2025-01-15T10:30:00.000000",
    "message": "哈希值不匹配"
}
```

**响应（验证失败 - 未找到记录）**
```json
{
    "is_valid": false,
    "block_index": null,
    "transaction_timestamp": null,
    "message": "未找到相关交易"
}
```

---

### 3.3 手动创建区块

将待处理的交易打包成新区块。

**请求**
```
POST /api/blockchain/create-block
```

**响应（成功）**
```json
{
    "message": "Block created successfully",
    "block_index": 6,
    "transactions_count": 5,
    "block_hash": "abc123def456..."
}
```

**响应（无待处理交易）**
```json
{
    "message": "No pending transactions to create block"
}
```

---


## 四、查询接口

### 4.1 获取区块链信息

获取区块链的整体信息。

**请求**
```
GET /api/blockchain/chain
```

**响应**
```json
{
    "chain_length": 100,
    "pending_transactions_count": 3,
    "is_valid": true,
    "latest_block_index": 99,
    "latest_block_hash": "abc123def456789..."
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| chain_length | integer | 区块链总长度 |
| pending_transactions_count | integer | 待处理交易数量 |
| is_valid | boolean | 区块链是否有效 |
| latest_block_index | integer | 最新区块索引 |
| latest_block_hash | string | 最新区块哈希 |

---

### 4.2 查询交易

根据知识ID查询交易信息。

**请求**
```
GET /api/blockchain/transaction/{knowledge_id}
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| knowledge_id | integer | 知识内容ID |

**响应**
```json
{
    "transaction": {
        "id": "a1b2c3d4e5f6",
        "type": "KNOWLEDGE_CERTIFICATION",
        "knowledge_id": 12345,
        "user_id": 1001,
        "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "metadata": {
            "title": "React Hooks 完全指南"
        },
        "timestamp": "2025-01-15T10:30:00.000000",
        "signature": null,
        "public_key": null
    },
    "block_index": 5,
    "status": "confirmed"
}
```

**错误响应**
```json
{
    "detail": "Transaction not found"
}
```

---

### 4.3 查询区块

根据索引查询区块详情。

**请求**
```
GET /api/blockchain/block/{index}
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| index | integer | 区块索引（从0开始） |

**响应**
```json
{
    "index": 5,
    "timestamp": "2025-01-15T10:30:00.000000",
    "transactions": [
        {
            "id": "a1b2c3d4e5f6",
            "type": "KNOWLEDGE_CERTIFICATION",
            "knowledge_id": 12345,
            "user_id": 1001,
            "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "metadata": {},
            "timestamp": "2025-01-15T10:29:00.000000",
            "signature": null,
            "public_key": null
        }
    ],
    "previous_hash": "def456ghi789...",
    "hash": "abc123def456..."
}
```

---

### 4.4 用户交易列表

获取指定用户的所有交易记录。

**请求**
```
GET /api/blockchain/user/{user_id}/transactions?transaction_type=KNOWLEDGE_CERTIFICATION
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| user_id | integer | 用户ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| transaction_type | string | 否 | 交易类型筛选 |

**响应**
```json
{
    "user_id": 1001,
    "transaction_type": "KNOWLEDGE_CERTIFICATION",
    "count": 10,
    "transactions": [
        {
            "id": "a1b2c3d4e5f6",
            "type": "KNOWLEDGE_CERTIFICATION",
            "knowledge_id": 12345,
            "user_id": 1001,
            "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "metadata": {},
            "timestamp": "2025-01-15T10:30:00.000000",
            "signature": null,
            "public_key": null
        }
    ]
}
```

---

### 4.5 统计信息

获取区块链的统计数据。

**请求**
```
GET /api/blockchain/stats
```

**响应**
```json
{
    "total_blocks": 100,
    "total_transactions": 500,
    "pending_transactions": 3,
    "transaction_types": {
        "KNOWLEDGE_CERTIFICATION": 450,
        "ACHIEVEMENT": 30,
        "COPYRIGHT": 20
    },
    "is_valid": true
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| total_blocks | integer | 总区块数 |
| total_transactions | integer | 总交易数 |
| pending_transactions | integer | 待处理交易数 |
| transaction_types | object | 各类型交易统计 |
| is_valid | boolean | 区块链是否有效 |

---

## 五、证书接口

### 5.1 生成证书

为已存证的知识内容生成PDF证书。

**请求**
```
POST /api/blockchain/certificates
Content-Type: application/json
```

**请求体**
```json
{
    "knowledge_id": 12345,
    "knowledge_title": "React Hooks 完全指南",
    "user_id": 1001,
    "user_name": "张三"
}
```

**请求参数说明**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| knowledge_id | integer | 是 | 知识内容ID |
| knowledge_title | string | 是 | 知识标题 |
| user_id | integer | 是 | 用户ID |
| user_name | string | 是 | 用户名 |

**响应**
```json
{
    "certificate_id": "CERT-2025-123456",
    "knowledge_id": 12345,
    "block_index": 5,
    "pdf_url": "http://localhost:8000/api/blockchain/certificates/CERT-2025-123456/download",
    "qr_code_url": "http://localhost:8000/qrcodes/cert_CERT-2025-123456.png",
    "verification_url": "https://educhain.com/blockchain/certificates/CERT-2025-123456/verify",
    "created_at": "2025-01-15T10:35:00.000000"
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| certificate_id | string | 证书编号 |
| knowledge_id | integer | 知识内容ID |
| block_index | integer | 区块索引 |
| pdf_url | string | PDF下载地址 |
| qr_code_url | string | 二维码图片地址 |
| verification_url | string | 在线验证地址 |
| created_at | string | 创建时间 |

**错误响应**
```json
{
    "detail": "No certification found for knowledge_id 12345"
}
```

---

### 5.2 下载证书

下载PDF格式的存证证书。

**请求**
```
GET /api/blockchain/certificates/{certificate_id}/download
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| certificate_id | string | 证书编号 |

**响应**
- Content-Type: application/pdf
- 返回PDF文件流

**错误响应**
```json
{
    "detail": "Certificate not found"
}
```

---

### 5.3 验证证书

验证证书的有效性。

**请求**
```
GET /api/blockchain/certificates/{certificate_id}/verify
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| certificate_id | string | 证书编号 |

**响应（有效）**
```json
{
    "valid": true,
    "certificate_id": "CERT-2025-123456",
    "message": "Certificate is valid",
    "verification_time": "2025-01-15T11:00:00.000000"
}
```

**响应（无效）**
```json
{
    "valid": false,
    "certificate_id": "CERT-2025-123456",
    "message": "Certificate not found"
}
```

---

### 5.4 按知识ID查询证书

根据知识内容ID查询证书信息。

**请求**
```
GET /api/blockchain/certificates/knowledge/{knowledge_id}
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| knowledge_id | integer | 知识内容ID |

**响应**
```json
{
    "knowledge_id": 12345,
    "block_index": 5,
    "block_hash": "abc123def456...",
    "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "timestamp": "2025-01-15T10:30:00.000000",
    "has_certificate": true
}
```

---

## 六、错误处理

### 6.1 错误响应格式

```json
{
    "detail": "错误描述信息"
}
```

### 6.2 HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 6.3 常见错误

| 错误信息 | 说明 | 解决方案 |
|----------|------|----------|
| Invalid transaction | 交易数据无效 | 检查必填字段 |
| Transaction not found | 交易不存在 | 确认knowledge_id正确 |
| Block not found | 区块不存在 | 确认区块索引有效 |
| Certificate not found | 证书不存在 | 先生成证书 |
| No certification found | 未找到存证记录 | 先进行内容存证 |

---

## 七、使用示例

### 7.1 完整存证流程

```bash
# 步骤1：计算内容哈希（客户端完成）
# SHA-256("知识内容...") = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

# 步骤2：提交存证
curl -X POST "http://localhost:8000/api/blockchain/certify" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "KNOWLEDGE_CERT",
    "knowledge_id": 1,
    "user_id": 1,
    "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }'

# 步骤3：生成证书
curl -X POST "http://localhost:8000/api/blockchain/certificates" \
  -H "Content-Type: application/json" \
  -d '{
    "knowledge_id": 1,
    "knowledge_title": "测试知识",
    "user_id": 1,
    "user_name": "测试用户"
  }'

# 步骤4：下载证书
curl -o certificate.pdf "http://localhost:8000/api/blockchain/certificates/CERT-2025-123456/download"
```

### 7.2 验证内容完整性

```bash
# 重新计算当前内容哈希，与存证时的哈希比对
curl -X POST "http://localhost:8000/api/blockchain/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "knowledge_id": 1,
    "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }'
```

---

## 附录：数据模型

### 交易数据结构

```json
{
    "id": "string (16位哈希)",
    "type": "string (交易类型)",
    "knowledge_id": "integer | null",
    "user_id": "integer | null",
    "content_hash": "string (64位SHA-256) | null",
    "metadata": "object",
    "timestamp": "string (ISO格式)",
    "signature": "string | null",
    "public_key": "string | null"
}
```

### 区块数据结构

```json
{
    "index": "integer",
    "timestamp": "string (ISO格式)",
    "transactions": "array<Transaction>",
    "previous_hash": "string (64位)",
    "hash": "string (64位)"
}
```

---

**文档结束**
