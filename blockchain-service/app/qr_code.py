"""
二维码生成模块
用于生成证书验证地址的二维码
"""
import qrcode
from qrcode.image.pil import PilImage
import os
from typing import Optional


class QRCodeGenerator:
    """二维码生成器"""
    
    def __init__(self, output_dir: str = "qrcodes"):
        """
        初始化二维码生成器
        
        Args:
            output_dir: 二维码输出目录
        """
        self.output_dir = output_dir
        
        # 确保输出目录存在
        os.makedirs(output_dir, exist_ok=True)
    
    def generate_qr_code(
        self, 
        data: str, 
        filename: Optional[str] = None,
        box_size: int = 10,
        border: int = 4
    ) -> str:
        """
        生成二维码图片
        
        Args:
            data: 要编码的数据（通常是URL）
            filename: 输出文件名（不含扩展名），如果为None则使用data的哈希值
            box_size: 二维码方块大小
            border: 边框大小
            
        Returns:
            生成的二维码图片路径
        """
        # 创建二维码对象
        qr = qrcode.QRCode(
            version=1,  # 控制二维码大小，1是最小的
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # 高容错率
            box_size=box_size,
            border=border,
        )
        
        # 添加数据
        qr.add_data(data)
        qr.make(fit=True)
        
        # 创建图片
        img = qr.make_image(fill_color="black", back_color="white")
        
        # 生成文件名
        if filename is None:
            import hashlib
            filename = hashlib.md5(data.encode()).hexdigest()
        
        # 保存图片
        filepath = os.path.join(self.output_dir, f"{filename}.png")
        img.save(filepath)
        
        return filepath
    
    def generate_certificate_qr(self, verification_url: str, certificate_id: str) -> str:
        """
        为证书生成二维码
        
        Args:
            verification_url: 验证地址URL
            certificate_id: 证书编号
            
        Returns:
            生成的二维码图片路径
        """
        return self.generate_qr_code(
            data=verification_url,
            filename=f"cert_{certificate_id}",
            box_size=10,
            border=2
        )
    
    def cleanup_old_qrcodes(self, max_age_days: int = 30):
        """
        清理旧的二维码文件
        
        Args:
            max_age_days: 保留天数，超过此天数的文件将被删除
        """
        import time
        
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        
        for filename in os.listdir(self.output_dir):
            filepath = os.path.join(self.output_dir, filename)
            
            # 检查文件年龄
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getmtime(filepath)
                if file_age > max_age_seconds:
                    try:
                        os.remove(filepath)
                        print(f"Deleted old QR code: {filename}")
                    except Exception as e:
                        print(f"Error deleting {filename}: {e}")


# 全局二维码生成器实例
qr_generator = QRCodeGenerator()
