#!/bin/bash

# EduChain 性能测试脚本

set -e

echo "=== EduChain 性能测试开始 ==="

# 检查应用响应时间
echo "1. 测试API响应时间..."
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8080/api/auth/stats/active-users"

# 检查数据库性能
echo "2. 测试数据库连接..."
docker-compose exec mysql mysql -u educhain -p$MYSQL_PASSWORD -e "SELECT COUNT(*) FROM knowledge_items;"

# 检查Redis性能
echo "3. 测试Redis性能..."
docker-compose exec redis redis-cli ping

# 检查内存使用
echo "4. 检查内存使用..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo "=== 性能测试完成 ==="