#!/bin/bash

# EduChain 安全检查脚本

set -e

echo "=== EduChain 安全检查开始 ==="

# 检查Docker容器安全
echo "1. 检查Docker容器安全..."
docker-compose exec app ps aux | grep -v grep | grep java
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT user, host FROM mysql.user;"

# 检查文件权限
echo "2. 检查文件权限..."
ls -la uploads/
ls -la logs/

# 检查网络端口
echo "3. 检查开放端口..."
netstat -tlnp | grep -E ':(80|443|3306|6379|8080)'

# 检查SSL证书
echo "4. 检查SSL证书..."
if [ -f "/etc/nginx/ssl/cert.pem" ]; then
    openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout | grep -E "(Not Before|Not After)"
else
    echo "SSL证书未配置"
fi

echo "=== 安全检查完成 ==="