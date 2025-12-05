"""区块链服务主入口"""
import uvicorn
import os
from app.api import app
from app.config import Config

if __name__ == "__main__":
    # 从环境变量或配置文件读取配置
    host = os.getenv("HOST", Config.HOST)
    port = int(os.getenv("PORT", Config.PORT))
    
    # 启动服务
    uvicorn.run(
        "app.api:app",
        host=host,
        port=port,
        reload=True,  # 开发模式自动重载
        log_level="info"
    )

