"""区块结构定义"""
from dataclasses import dataclass
from typing import List, Optional
import hashlib
import json
from .transaction import Transaction


@dataclass
class Block:
    """区块链区块结构 - 用于数据存证和不可篡改验证"""
    
    index: int  # 区块索引
    timestamp: str  # 时间戳
    transactions: List[Transaction]  # 交易列表（存证记录）
    previous_hash: str  # 前一个区块的哈希
    hash: Optional[str] = None  # 当前区块哈希
    
    def __post_init__(self):
        """初始化后处理 - 自动计算区块哈希"""
        if self.hash is None:
            self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """计算区块哈希值
        
        使用SHA-256算法计算区块的哈希值，确保数据完整性
        
        Returns:
            区块的SHA-256哈希值（64位十六进制字符串）
        """
        block_string = json.dumps({
            'index': self.index,
            'timestamp': self.timestamp,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash
        }, sort_keys=True, ensure_ascii=False)
        
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()
    
    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            'index': self.index,
            'timestamp': self.timestamp,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash,
            'hash': self.hash
        }
    
    def to_json(self) -> str:
        """转换为JSON字符串"""
        return json.dumps(self.to_dict(), sort_keys=True, ensure_ascii=False, indent=2)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Block':
        """从字典创建区块"""
        transactions = [
            Transaction.from_dict(tx) 
            for tx in data.get('transactions', [])
        ]
        
        block = cls(
            index=data['index'],
            timestamp=data['timestamp'],
            transactions=transactions,
            previous_hash=data['previous_hash'],
            hash=data.get('hash')
        )
        
        return block

