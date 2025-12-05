"""数据库管理模块"""
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from datetime import datetime
import json
import os

from ..block import Block
from ..transaction import Transaction

Base = declarative_base()


class BlockModel(Base):
    """区块数据模型"""
    __tablename__ = 'blocks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    index = Column(Integer, unique=True, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    previous_hash = Column(String(64), nullable=False)
    hash = Column(String(64), nullable=False)
    transactions_json = Column(Text, nullable=False)  # JSON格式存储交易
    created_at = Column(DateTime, default=datetime.utcnow)


class BlockchainDB:
    """区块链数据库管理类"""
    
    def __init__(self, database_url: Optional[str] = None):
        """初始化数据库连接
        
        Args:
            database_url: 数据库URL，如果为None则使用环境变量或默认SQLite
        """
        if database_url is None:
            database_url = os.getenv(
                'DATABASE_URL', 
                'sqlite:///blockchain.db'
            )
        
        self.engine = create_engine(database_url, echo=False)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    def save_block(self, block: Block) -> bool:
        """保存区块到数据库
        
        Args:
            block: 区块对象
        
        Returns:
            是否保存成功
        """
        session = self.Session()
        try:
            # 检查是否已存在
            existing = session.query(BlockModel).filter_by(index=block.index).first()
            if existing:
                return False  # 区块已存在
            
            block_model = BlockModel(
                index=block.index,
                timestamp=datetime.fromisoformat(block.timestamp),
                previous_hash=block.previous_hash,
                hash=block.hash,
                transactions_json=json.dumps(
                    [tx.to_dict() for tx in block.transactions],
                    ensure_ascii=False
                )
            )
            session.add(block_model)
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            print(f"Error saving block: {e}")
            return False
        finally:
            session.close()
    
    def load_chain(self) -> List[Block]:
        """从数据库加载区块链
        
        Returns:
            区块列表
        """
        session = self.Session()
        try:
            block_models = session.query(BlockModel).order_by(BlockModel.index).all()
            chain = []
            
            for model in block_models:
                transactions = [
                    Transaction.from_dict(tx_dict) 
                    for tx_dict in json.loads(model.transactions_json)
                ]
                
                block = Block(
                    index=model.index,
                    timestamp=model.timestamp.isoformat(),
                    transactions=transactions,
                    previous_hash=model.previous_hash,
                    hash=model.hash
                )
                chain.append(block)
            
            return chain
        except Exception as e:
            print(f"Error loading chain: {e}")
            return []
        finally:
            session.close()
    
    def get_block_count(self) -> int:
        """获取区块数量
        
        Returns:
            区块数量
        """
        session = self.Session()
        try:
            return session.query(BlockModel).count()
        finally:
            session.close()
    
    def get_latest_block(self) -> Optional[BlockModel]:
        """获取最新区块
        
        Returns:
            最新区块模型，如果不存在则返回None
        """
        session = self.Session()
        try:
            return session.query(BlockModel).order_by(BlockModel.index.desc()).first()
        finally:
            session.close()
    
    def clear_all(self):
        """清空所有数据（谨慎使用）"""
        session = self.Session()
        try:
            session.query(BlockModel).delete()
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"Error clearing data: {e}")
        finally:
            session.close()

