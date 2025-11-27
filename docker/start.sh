#!/bin/bash

# EduChain 应用启动脚本

set -e

echo "Starting EduChain Platform..."

# 等待数据库启动
echo "Waiting for database to be ready..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "Database is ready!"

# 等待Redis启动
echo "Waiting for Redis to be ready..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis is ready!"

# 启动Nginx
echo "Starting Nginx..."
nginx -g "daemon on;"

# 检查Nginx状态
if ! pgrep nginx > /dev/null; then
    echo "Failed to start Nginx"
    exit 1
fi

echo "Nginx started successfully"

# 启动Spring Boot应用
echo "Starting Spring Boot application..."
exec java \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} \
    -Xms512m \
    -Xmx1024m \
    -XX:+UseG1GC \
    -XX:G1HeapRegionSize=16m \
    -XX:+UseG1GC \
    -XX:+UnlockExperimentalVMOptions \
    -XX:+UseCGroupMemoryLimitForHeap \
    -jar app.jar