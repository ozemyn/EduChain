"""区块链核心实现 - 数据存证系统"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from .block import Block
from .transaction import Transaction


class Blockchain:
    """区块链核心类 - 用于教育知识内容的存证和验证
    
    本系统专注于数据存证和不可篡改验证，不涉及虚拟货币、代币或挖矿
    """
    
    def __init__(self):
        """初始化区块链存证系统"""
        self.chain: List[Block] = []
        self.pending_transactions: List[Transaction] = []
        
        # 创建创世区块
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """创建创世区块"""
        genesis_block = Block(
            index=0,
            timestamp=datetime.utcnow().isoformat(),
            transactions=[],
            previous_hash='0' * 64  # 64个0作为创世区块的前一个哈希
        )
        genesis_block.hash = genesis_block.calculate_hash()
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        """获取最新区块"""
        return self.chain[-1]
    
    def add_transaction(self, transaction: Transaction) -> int:
        """添加存证交易到待处理队列
        
        Args:
            transaction: 存证交易对象
        
        Returns:
            交易将被添加到的区块索引
        """
        if not transaction.validate():
            raise ValueError("Invalid transaction")
        
        self.pending_transactions.append(transaction)
        return self.get_latest_block().index + 1
    
    def create_block(self) -> Optional[Block]:
        """创建新区块（打包待处理交易）
        
        将待处理的存证交易打包成新区块，直接计算哈希并添加到链中
        不涉及工作量证明或挖矿
        
        Returns:
            新创建的区块，如果没有待处理交易则返回None
        """
        if not self.pending_transactions:
            return None
        
        # 创建新区块，直接计算哈希
        block = Block(
            index=len(self.chain),
            timestamp=datetime.utcnow().isoformat(),
            transactions=self.pending_transactions.copy(),
            previous_hash=self.get_latest_block().hash
        )
        
        # 添加到链
        self.chain.append(block)
        
        # 清空待处理交易
        self.pending_transactions = []
        
        return block
    
    def is_chain_valid(self) -> bool:
        """验证区块链有效性
        
        Returns:
            区块链是否有效
        """
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
    
    def get_transaction_by_knowledge_id(self, knowledge_id: int) -> Optional[Transaction]:
        """根据知识ID查找交易
        
        Args:
            knowledge_id: 知识内容ID
        
        Returns:
            交易对象，如果不存在则返回None
        """
        for block in self.chain:
            for transaction in block.transactions:
                if (transaction.type == Transaction.TYPE_KNOWLEDGE_CERT and 
                    transaction.knowledge_id == knowledge_id):
                    return transaction
        
        # 也在待处理交易中查找
        for transaction in self.pending_transactions:
            if (transaction.type == Transaction.TYPE_KNOWLEDGE_CERT and 
                transaction.knowledge_id == knowledge_id):
                return transaction
        
        return None
    
    def get_transaction_by_user_id(self, user_id: int, transaction_type: Optional[str] = None) -> List[Transaction]:
        """根据用户ID查找交易
        
        Args:
            user_id: 用户ID
            transaction_type: 交易类型（可选）
        
        Returns:
            交易列表
        """
        transactions = []
        
        for block in self.chain:
            for transaction in block.transactions:
                if transaction.user_id == user_id:
                    if transaction_type is None or transaction.type == transaction_type:
                        transactions.append(transaction)
        
        # 也在待处理交易中查找
        for transaction in self.pending_transactions:
            if transaction.user_id == user_id:
                if transaction_type is None or transaction.type == transaction_type:
                    transactions.append(transaction)
        
        return transactions
    
    def verify_knowledge(self, knowledge_id: int, content_hash: str) -> bool:
        """验证知识内容
        
        Args:
            knowledge_id: 知识内容ID
            content_hash: 内容哈希值
        
        Returns:
            验证是否通过
        """
        transaction = self.get_transaction_by_knowledge_id(knowledge_id)
        if not transaction:
            return False
        
        return transaction.content_hash == content_hash
    
    def get_chain_info(self) -> Dict[str, Any]:
        """获取区块链信息
        
        Returns:
            区块链信息字典
        """
        return {
            'chain_length': len(self.chain),
            'pending_transactions_count': len(self.pending_transactions),
            'is_valid': self.is_chain_valid(),
            'latest_block_index': self.get_latest_block().index,
            'latest_block_hash': self.get_latest_block().hash
        }
    
    def get_block_by_index(self, index: int) -> Optional[Block]:
        """根据索引获取区块
        
        Args:
            index: 区块索引
        
        Returns:
            区块对象，如果不存在则返回None
        """
        if 0 <= index < len(self.chain):
            return self.chain[index]
        return None
    
    def get_all_transactions(self) -> List[Transaction]:
        """获取所有交易（包括已确认和待处理）
        
        Returns:
            交易列表
        """
        all_transactions = []
        
        # 已确认的交易
        for block in self.chain:
            all_transactions.extend(block.transactions)
        
        # 待处理的交易
        all_transactions.extend(self.pending_transactions)
        
        return all_transactions

