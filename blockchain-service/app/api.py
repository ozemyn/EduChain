"""FastAPI REST API 接口"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

from .blockchain import Blockchain
from .transaction import Transaction
from .database.db_manager import BlockchainDB

# 初始化FastAPI应用
app = FastAPI(
    title="EduChain Blockchain Service",
    description="教育知识共享平台区块链服务",
    version="1.0.0"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化区块链和数据库
blockchain = Blockchain()
db_manager = BlockchainDB()


# 数据模型
class CertifyRequest(BaseModel):
    """存证请求"""
    type: str  # KNOWLEDGE_CERT, ACHIEVEMENT, COPYRIGHT
    knowledge_id: Optional[int] = None
    user_id: int
    content_hash: str
    metadata: Optional[Dict[str, Any]] = None


class VerifyRequest(BaseModel):
    """验证请求"""
    knowledge_id: int
    content_hash: str


class TransactionResponse(BaseModel):
    """交易响应"""
    transaction_id: Optional[int] = None
    block_index: int
    status: str  # pending, confirmed
    timestamp: str


class VerifyResponse(BaseModel):
    """验证响应"""
    is_valid: bool
    block_index: Optional[int] = None
    transaction_timestamp: Optional[str] = None
    message: Optional[str] = None


class ChainInfoResponse(BaseModel):
    """区块链信息响应"""
    chain_length: int
    pending_transactions_count: int
    is_valid: bool
    latest_block_index: int
    latest_block_hash: str


# 启动时从数据库加载区块链
@app.on_event("startup")
async def startup_event():
    """启动时加载区块链数据"""
    try:
        loaded_chain = db_manager.load_chain()
        if loaded_chain:
            blockchain.chain = loaded_chain
            print(f"Loaded {len(loaded_chain)} blocks from database")
    except Exception as e:
        print(f"Error loading chain: {e}")


# 定期保存区块到数据库（可选）
def save_block_to_db(block):
    """保存区块到数据库"""
    db_manager.save_block(block)


# API端点
@app.get("/")
async def root():
    """根路径"""
    return {
        "service": "EduChain Blockchain Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "chain_length": len(blockchain.chain),
        "is_valid": blockchain.is_chain_valid()
    }


@app.post("/api/blockchain/certify", response_model=TransactionResponse)
async def certify(request: CertifyRequest, background_tasks: BackgroundTasks):
    """存证接口
    
    将知识内容、用户成就等信息存证到区块链
    """
    try:
        # 创建交易
        transaction = Transaction(
            type=request.type,
            knowledge_id=request.knowledge_id,
            user_id=request.user_id,
            content_hash=request.content_hash,
            metadata=request.metadata or {}
        )
        
        # 验证交易
        if not transaction.validate():
            raise HTTPException(status_code=400, detail="Invalid transaction")
        
        # 添加到待处理队列
        block_index = blockchain.add_transaction(transaction)
        
        # 立即创建区块（打包交易）
        block = blockchain.create_block()
        
        if block:
            # 后台保存到数据库
            background_tasks.add_task(save_block_to_db, block)
            
            return TransactionResponse(
                transaction_id=len(block.transactions),
                block_index=block.index,
                status="confirmed",
                timestamp=transaction.timestamp
            )
        else:
            return TransactionResponse(
                transaction_id=None,
                block_index=block_index,
                status="pending",
                timestamp=transaction.timestamp
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/blockchain/verify", response_model=VerifyResponse)
async def verify(request: VerifyRequest):
    """验证接口
    
    验证知识内容的哈希值是否与区块链中存储的一致
    """
    try:
        is_valid = blockchain.verify_knowledge(
            request.knowledge_id,
            request.content_hash
        )
        
        transaction = blockchain.get_transaction_by_knowledge_id(
            request.knowledge_id
        )
        
        if transaction:
            # 查找交易所在的区块
            block_index = None
            for i, block in enumerate(blockchain.chain):
                if transaction in block.transactions:
                    block_index = i
                    break
            
            return VerifyResponse(
                is_valid=is_valid,
                block_index=block_index,
                transaction_timestamp=transaction.timestamp,
                message="验证成功" if is_valid else "哈希值不匹配"
            )
        else:
            return VerifyResponse(
                is_valid=False,
                block_index=None,
                transaction_timestamp=None,
                message="未找到相关交易"
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/blockchain/chain", response_model=ChainInfoResponse)
async def get_chain():
    """获取区块链信息"""
    info = blockchain.get_chain_info()
    return ChainInfoResponse(**info)


@app.post("/api/blockchain/create-block")
async def create_block():
    """手动创建新区块
    
    将待处理的存证交易打包成新区块
    """
    block = blockchain.create_block()
    if block:
        # 保存到数据库
        db_manager.save_block(block)
        return {
            "message": "Block created successfully",
            "block_index": block.index,
            "transactions_count": len(block.transactions),
            "block_hash": block.hash
        }
    return {
        "message": "No pending transactions to create block"
    }


@app.get("/api/blockchain/transaction/{knowledge_id}")
async def get_transaction(knowledge_id: int):
    """根据知识ID获取交易信息"""
    transaction = blockchain.get_transaction_by_knowledge_id(knowledge_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # 查找交易所在的区块
    block_index = None
    for i, block in enumerate(blockchain.chain):
        if transaction in block.transactions:
            block_index = i
            break
    
    return {
        "transaction": transaction.to_dict(),
        "block_index": block_index,
        "status": "confirmed" if block_index is not None else "pending"
    }


@app.get("/api/blockchain/block/{index}")
async def get_block(index: int):
    """根据索引获取区块信息"""
    block = blockchain.get_block_by_index(index)
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    
    return block.to_dict()


@app.get("/api/blockchain/user/{user_id}/transactions")
async def get_user_transactions(user_id: int, transaction_type: Optional[str] = None):
    """获取用户的所有交易"""
    transactions = blockchain.get_transaction_by_user_id(user_id, transaction_type)
    return {
        "user_id": user_id,
        "transaction_type": transaction_type,
        "count": len(transactions),
        "transactions": [tx.to_dict() for tx in transactions]
    }


@app.get("/api/blockchain/stats")
async def get_stats():
    """获取区块链统计信息"""
    all_transactions = blockchain.get_all_transactions()
    
    # 统计各类型交易数量
    type_counts = {}
    for tx in all_transactions:
        type_counts[tx.type] = type_counts.get(tx.type, 0) + 1
    
    return {
        "total_blocks": len(blockchain.chain),
        "total_transactions": len(all_transactions),
        "pending_transactions": len(blockchain.pending_transactions),
        "transaction_types": type_counts,
        "is_valid": blockchain.is_chain_valid()
    }

