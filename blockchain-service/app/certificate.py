"""
证书生成模块
用于生成区块链存证证书
"""
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional, Dict, Any
import hashlib
import uuid


@dataclass
class CertificateData:
    """证书数据结构"""
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
    qr_code_data: Optional[str] = None  # 二维码数据
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return asdict(self)


class CertificateGenerator:
    """证书生成器"""
    
    def __init__(self, base_url: str = "https://educhain.cc"):
        """
        初始化证书生成器
        
        Args:
            base_url: 系统基础URL
        """
        self.base_url = base_url
    
    def generate_certificate_id(self, knowledge_id: int, block_index: int) -> str:
        """
        生成证书编号
        
        格式: CERT-YYYY-NNNNNN
        其中 YYYY 是年份，NNNNNN 是基于知识ID和区块索引的唯一编号
        
        Args:
            knowledge_id: 知识ID
            block_index: 区块索引
            
        Returns:
            证书编号
        """
        year = datetime.now().year
        # 使用知识ID和区块索引生成唯一编号
        unique_str = f"{knowledge_id}-{block_index}-{uuid.uuid4().hex[:8]}"
        hash_obj = hashlib.sha256(unique_str.encode())
        unique_number = int(hash_obj.hexdigest()[:6], 16) % 1000000
        
        return f"CERT-{year}-{unique_number:06d}"
    
    def generate_verification_url(self, certificate_id: str) -> str:
        """
        生成验证地址
        
        Args:
            certificate_id: 证书编号
            
        Returns:
            验证地址URL
        """
        return f"{self.base_url}/blockchain/certificates/{certificate_id}/verify"
    
    def create_certificate(
        self,
        knowledge_id: int,
        knowledge_title: str,
        user_id: int,
        user_name: str,
        content_hash: str,
        block_index: int,
        block_hash: str,
        timestamp: str
    ) -> CertificateData:
        """
        创建证书数据
        
        Args:
            knowledge_id: 知识ID
            knowledge_title: 知识标题
            user_id: 用户ID
            user_name: 用户名
            content_hash: 内容哈希
            block_index: 区块索引
            block_hash: 区块哈希
            timestamp: 存证时间
            
        Returns:
            证书数据对象
        """
        # 生成证书编号
        certificate_id = self.generate_certificate_id(knowledge_id, block_index)
        
        # 生成验证地址
        verification_url = self.generate_verification_url(certificate_id)
        
        # 创建证书数据
        certificate = CertificateData(
            certificate_id=certificate_id,
            knowledge_id=knowledge_id,
            knowledge_title=knowledge_title,
            user_id=user_id,
            user_name=user_name,
            content_hash=content_hash,
            block_index=block_index,
            block_hash=block_hash,
            timestamp=timestamp,
            verification_url=verification_url
        )
        
        return certificate
    
    def validate_certificate_data(self, certificate: CertificateData) -> bool:
        """
        验证证书数据的完整性
        
        Args:
            certificate: 证书数据
            
        Returns:
            是否有效
        """
        # 检查必填字段
        required_fields = [
            certificate.certificate_id,
            certificate.knowledge_id,
            certificate.knowledge_title,
            certificate.user_id,
            certificate.user_name,
            certificate.content_hash,
            certificate.block_index,
            certificate.block_hash,
            certificate.timestamp,
            certificate.verification_url
        ]
        
        # 确保所有必填字段都有值
        if not all(required_fields):
            return False
        
        # 验证证书编号格式
        if not certificate.certificate_id.startswith("CERT-"):
            return False
        
        # 验证哈希长度（SHA-256应该是64个字符）
        if len(certificate.content_hash) != 64 or len(certificate.block_hash) != 64:
            return False
        
        return True


# 全局证书生成器实例
certificate_generator = CertificateGenerator()
