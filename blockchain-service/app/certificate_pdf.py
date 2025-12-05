"""
PDF证书生成模块
使用ReportLab生成PDF格式的区块链存证证书
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Table, TableStyle
from datetime import datetime
from typing import Optional
import os
import io

from .certificate import CertificateData


class CertificatePDFGenerator:
    """PDF证书生成器"""
    
    def __init__(self, output_dir: str = "certificates"):
        """
        初始化PDF生成器
        
        Args:
            output_dir: 证书输出目录
        """
        self.output_dir = output_dir
        self.page_width, self.page_height = A4
        
        # 确保输出目录存在
        os.makedirs(output_dir, exist_ok=True)
    
    def _draw_header(self, c: canvas.Canvas, y_position: float) -> float:
        """
        绘制证书头部
        
        Args:
            c: Canvas对象
            y_position: 当前Y坐标
            
        Returns:
            新的Y坐标
        """
        # 标题
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(colors.HexColor("#1890ff"))
        c.drawCentredString(self.page_width / 2, y_position, "EduChain Blockchain Certificate")
        y_position -= 15 * mm
        
        # 副标题
        c.setFont("Helvetica", 14)
        c.setFillColor(colors.HexColor("#666666"))
        c.drawCentredString(self.page_width / 2, y_position, "Educational Content Certification on Blockchain")
        y_position -= 20 * mm
        
        return y_position
    
    def _draw_certificate_info(
        self, 
        c: canvas.Canvas, 
        certificate: CertificateData, 
        y_position: float
    ) -> float:
        """
        绘制证书信息
        
        Args:
            c: Canvas对象
            certificate: 证书数据
            y_position: 当前Y坐标
            
        Returns:
            新的Y坐标
        """
        left_margin = 40 * mm
        label_width = 50 * mm
        
        # 证书信息列表
        info_items = [
            ("Certificate ID:", certificate.certificate_id),
            ("Knowledge ID:", str(certificate.knowledge_id)),
            ("Knowledge Title:", certificate.knowledge_title),
            ("Author:", certificate.user_name),
            ("Content Hash:", certificate.content_hash[:32] + "..."),
            ("Block Index:", str(certificate.block_index)),
            ("Block Hash:", certificate.block_hash[:32] + "..."),
            ("Certification Time:", certificate.timestamp),
        ]
        
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(colors.black)
        
        for label, value in info_items:
            # 绘制标签
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(colors.HexColor("#333333"))
            c.drawString(left_margin, y_position, label)
            
            # 绘制值
            c.setFont("Helvetica", 10)
            c.setFillColor(colors.HexColor("#666666"))
            c.drawString(left_margin + label_width, y_position, value)
            
            y_position -= 8 * mm
        
        return y_position
    
    def _draw_qr_code(
        self, 
        c: canvas.Canvas, 
        qr_image_path: Optional[str], 
        y_position: float
    ) -> float:
        """
        绘制二维码
        
        Args:
            c: Canvas对象
            qr_image_path: 二维码图片路径
            y_position: 当前Y坐标
            
        Returns:
            新的Y坐标
        """
        if qr_image_path and os.path.exists(qr_image_path):
            qr_size = 40 * mm
            x_position = (self.page_width - qr_size) / 2
            
            # 绘制二维码
            c.drawImage(qr_image_path, x_position, y_position - qr_size, 
                       width=qr_size, height=qr_size)
            
            # 绘制说明文字
            c.setFont("Helvetica", 9)
            c.setFillColor(colors.HexColor("#666666"))
            c.drawCentredString(self.page_width / 2, y_position - qr_size - 5 * mm,
                              "Scan to verify this certificate")
            
            y_position -= (qr_size + 10 * mm)
        
        return y_position
    
    def _draw_footer(self, c: canvas.Canvas, y_position: float) -> float:
        """
        绘制证书底部
        
        Args:
            c: Canvas对象
            y_position: 当前Y坐标
            
        Returns:
            新的Y坐标
        """
        # 法律声明
        c.setFont("Helvetica-Oblique", 8)
        c.setFillColor(colors.HexColor("#999999"))
        
        legal_text = [
            "This certificate proves that the content has been certified on the EduChain blockchain.",
            "The content hash and timestamp are permanently recorded and cannot be tampered with.",
            "This certificate serves as proof of content ownership and creation time.",
            "",
            "EduChain Platform - Educational Content Blockchain Certification System",
            f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        ]
        
        for line in legal_text:
            c.drawCentredString(self.page_width / 2, y_position, line)
            y_position -= 4 * mm
        
        return y_position
    
    def _draw_watermark(self, c: canvas.Canvas):
        """
        添加防伪水印
        
        Args:
            c: Canvas对象
        """
        c.saveState()
        c.setFont("Helvetica-Bold", 60)
        c.setFillColor(colors.Color(0.9, 0.9, 0.9, alpha=0.3))
        c.translate(self.page_width / 2, self.page_height / 2)
        c.rotate(45)
        c.drawCentredString(0, 0, "EDUCHAIN")
        c.restoreState()
    
    def generate_pdf(
        self, 
        certificate: CertificateData, 
        qr_image_path: Optional[str] = None
    ) -> str:
        """
        生成PDF证书
        
        Args:
            certificate: 证书数据
            qr_image_path: 二维码图片路径（可选）
            
        Returns:
            生成的PDF文件路径
        """
        # 生成文件名
        filename = f"{certificate.certificate_id}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        # 创建Canvas
        c = canvas.Canvas(filepath, pagesize=A4)
        
        # 添加水印
        self._draw_watermark(c)
        
        # 绘制边框
        c.setStrokeColor(colors.HexColor("#1890ff"))
        c.setLineWidth(2)
        c.rect(20 * mm, 20 * mm, self.page_width - 40 * mm, 
               self.page_height - 40 * mm)
        
        # 从顶部开始绘制
        y_position = self.page_height - 40 * mm
        
        # 绘制各个部分
        y_position = self._draw_header(c, y_position)
        y_position = self._draw_certificate_info(c, certificate, y_position)
        y_position -= 10 * mm  # 额外间距
        y_position = self._draw_qr_code(c, qr_image_path, y_position)
        y_position -= 10 * mm  # 额外间距
        self._draw_footer(c, y_position)
        
        # 保存PDF
        c.save()
        
        return filepath
    
    def generate_pdf_bytes(
        self, 
        certificate: CertificateData, 
        qr_image_path: Optional[str] = None
    ) -> bytes:
        """
        生成PDF证书的字节流（用于直接返回给客户端）
        
        Args:
            certificate: 证书数据
            qr_image_path: 二维码图片路径（可选）
            
        Returns:
            PDF文件的字节流
        """
        # 创建内存缓冲区
        buffer = io.BytesIO()
        
        # 创建Canvas
        c = canvas.Canvas(buffer, pagesize=A4)
        
        # 添加水印
        self._draw_watermark(c)
        
        # 绘制边框
        c.setStrokeColor(colors.HexColor("#1890ff"))
        c.setLineWidth(2)
        c.rect(20 * mm, 20 * mm, self.page_width - 40 * mm, 
               self.page_height - 40 * mm)
        
        # 从顶部开始绘制
        y_position = self.page_height - 40 * mm
        
        # 绘制各个部分
        y_position = self._draw_header(c, y_position)
        y_position = self._draw_certificate_info(c, certificate, y_position)
        y_position -= 10 * mm
        y_position = self._draw_qr_code(c, qr_image_path, y_position)
        y_position -= 10 * mm
        self._draw_footer(c, y_position)
        
        # 保存到缓冲区
        c.save()
        
        # 获取字节流
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes


# 全局PDF生成器实例
pdf_generator = CertificatePDFGenerator()
