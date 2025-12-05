"""交易结构定义"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any
import json
import hashlib


@dataclass
class Transaction:
    """区块链交易结构"""
    
    # 交易类型
    TYPE_KNOWLEDGE_CERT = "KNOWLEDGE_CERTIFICATION"  # 知识内容存证
    TYPE_ACHIEVEMENT = "ACHIEVEMENT"  # 用户成就认证
    TYPE_COPYRIGHT = "COPYRIGHT"  # 版权声明
    TYPE_USER_ACTION = "USER_ACTION"  # 用户行为记录
    
    type: str  # 交易类型
    knowledge_id: Optional[int] = None  # 知识内容ID
    user_id: Optional[int] = None  # 用户ID
    content_hash: Optional[str] = None  # 内容哈希值
    metadata: Dict[str, Any] = field(default_factory=dict)  # 额外元数据
    timestamp: Optional[str] = None  # 时间戳
    signature: Optional[str] = None  # 数字签名
    public_key: Optional[str] = None  # 公钥
    
    def __post_init__(self):
        """初始化后处理"""
        if self.timestamp is None:
            self.timestamp = datetime.utcnow().isoformat()
    
    def generate_id(self) -> str:
        """生成交易ID"""
        data = f"{self.type}_{self.knowledge_id}_{self.user_id}_{self.timestamp}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            'id': self.generate_id(),
            'type': self.type,
            'knowledge_id': self.knowledge_id,
            'user_id': self.user_id,
            'content_hash': self.content_hash,
            'metadata': self.metadata,
            'timestamp': self.timestamp,
            'signature': self.signature,
            'public_key': self.public_key
        }
    
    def to_json(self) -> str:
        """转换为JSON字符串"""
        return json.dumps(self.to_dict(), sort_keys=True, ensure_ascii=False)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Transaction':
        """从字典创建交易"""
        return cls(
            type=data.get('type'),
            knowledge_id=data.get('knowledge_id'),
            user_id=data.get('user_id'),
            content_hash=data.get('content_hash'),
            metadata=data.get('metadata', {}),
            timestamp=data.get('timestamp'),
            signature=data.get('signature'),
            public_key=data.get('public_key')
        )
    
    def validate(self) -> bool:
        """验证交易有效性"""
        if not self.type:
            return False
        
        # 根据交易类型验证必需字段
        if self.type in [self.TYPE_KNOWLEDGE_CERT, "KNOWLEDGE_CERT"]:
            return (self.knowledge_id is not None and 
                   self.user_id is not None and 
                   self.content_hash is not None)
        elif self.type == self.TYPE_ACHIEVEMENT:
            return (self.user_id is not None and 
                   self.content_hash is not None)
        elif self.type == self.TYPE_COPYRIGHT:
            return (self.knowledge_id is not None and 
                   self.user_id is not None)
        
        return True

