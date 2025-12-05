# EduChain 区块链存证服务

基于 Python FastAPI 的区块链存证服务，用于教育知识共享平台的知识内容存证和用户成就认证。

**本系统专注于数据存证和不可篡改验证，不涉及虚拟货币、代币或挖矿。**

## 功能特性

- ✅ 区块链存证系统（数据不可篡改）
- ✅ 知识内容存证（版权保护）
- ✅ 用户成就认证（可信认证）
- ✅ 版权验证（哈希验证）
- ✅ 数据持久化（SQLite/PostgreSQL）
- ✅ RESTful API
- ✅ 自动API文档

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL=sqlite:///blockchain.db
HOST=0.0.0.0
PORT=8000
AUTO_CREATE_BLOCK=true
CREATE_BLOCK_INTERVAL=60
```

### 3. 启动服务

```bash
# 开发模式
python main.py

# 或使用 uvicorn
uvicorn app.api:app --reload --host 0.0.0.0 --port 8000
```

### 4. 访问API文档

http://localhost:8000/docs

## API端点

- `POST /api/blockchain/certify` - 存证（将知识内容存证到区块链）
- `POST /api/blockchain/verify` - 验证（验证知识内容的哈希值）
- `GET /api/blockchain/chain` - 获取区块链信息
- `POST /api/blockchain/create-block` - 手动创建新区块
- `GET /api/blockchain/transaction/{knowledge_id}` - 获取交易信息

## 项目结构

```
blockchain-service/
├── app/
│   ├── __init__.py
│   ├── blockchain.py      # 区块链核心
│   ├── block.py           # 区块结构
│   ├── transaction.py     # 交易结构
│   ├── api.py             # FastAPI接口
│   ├── config.py          # 配置
│   └── database/
│       ├── __init__.py
│       └── db_manager.py   # 数据库管理
├── main.py                # 服务入口
├── requirements.txt       # Python依赖
└── README.md             # 说明文档
```

