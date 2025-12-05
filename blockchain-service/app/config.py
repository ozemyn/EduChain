"""配置文件"""
import os


class Config:
    """应用配置"""
    
    # 数据库配置
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///blockchain.db"
    )
    
    # 服务配置
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # 区块链配置
    AUTO_CREATE_BLOCK = os.getenv("AUTO_CREATE_BLOCK", "true").lower() == "true"
    CREATE_BLOCK_INTERVAL = int(os.getenv("CREATE_BLOCK_INTERVAL", 60))  # 秒
    
    # CORS配置
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    
    # 日志配置
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

