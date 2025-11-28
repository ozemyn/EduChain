#!/bin/bash

# Redis管理脚本 for macOS
# 使用方法: ./redis-manager.sh [start|stop|restart|status]

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JAVA_CLASS="com.example.educhain.util.RedisManager"

# 检查Java环境
check_java() {
    if ! command -v java &> /dev/null; then
        echo -e "${RED}❌ Java未安装或未在PATH中${NC}"
        exit 1
    fi
}

# 编译Java类
compile_java() {
    echo -e "${BLUE}🔧 编译Redis管理器...${NC}"
    cd "$PROJECT_DIR"
    
    if [ -f "pom.xml" ]; then
        # Maven项目
        mvn compile -q
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 编译成功${NC}"
        else
            echo -e "${RED}❌ 编译失败${NC}"
            exit 1
        fi
    else
        # 直接编译
        javac -d target/classes src/main/java/com/example/educhain/util/RedisManager.java
    fi
}

# 运行Redis管理器
run_redis_manager() {
    local command=$1
    cd "$PROJECT_DIR"
    
    if [ -f "target/classes/$JAVA_CLASS.class" ] || [ -f "target/classes/com/example/educhain/util/RedisManager.class" ]; then
        java -cp target/classes $JAVA_CLASS $command
    else
        echo -e "${RED}❌ 找不到编译后的类文件，请先编译${NC}"
        exit 1
    fi
}

# 主函数
main() {
    local command=${1:-"status"}
    
    echo -e "${BLUE}=== Redis管理脚本 for macOS ===${NC}"
    
    check_java
    compile_java
    run_redis_manager $command
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}=== Redis管理脚本使用说明 ===${NC}"
    echo ""
    echo "用法: $0 [command]"
    echo ""
    echo "命令:"
    echo -e "  ${GREEN}start${NC}   - 启动Redis服务"
    echo -e "  ${GREEN}stop${NC}    - 停止Redis服务"  
    echo -e "  ${GREEN}restart${NC} - 重启Redis服务"
    echo -e "  ${GREEN}status${NC}  - 检查Redis状态 (默认)"
    echo -e "  ${GREEN}help${NC}    - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start"
    echo "  $0 status"
    echo ""
}

# 参数处理
case "${1:-status}" in
    "help"|"-h"|"--help")
        show_help
        ;;
    "start"|"stop"|"restart"|"status")
        main $1
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac