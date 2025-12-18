#!/bin/bash

# 生成完整的更新日志
# 使用方法: ./git-changelog.sh [输出文件名]

OUTPUT_FILE=${1:-"CHANGELOG.md"}

echo "📝 正在生成完整更新日志..."

# 检查是否在git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 错误: 当前目录不是git仓库"
    exit 1
fi

# 创建更新日志文件
cat > "$OUTPUT_FILE" << 'EOF'
# 📚 EduChain 更新日志

> 基于区块链的教育知识共享平台完整开发历程

---

## 📊 项目统计

EOF

# 添加统计信息
echo "- **总提交数**: $(git rev-list --count HEAD)" >> "$OUTPUT_FILE"
echo "- **开发周期**: $(git log --reverse --pretty=format:'%ad' --date=short | head -1) 至 $(git log -1 --pretty=format:'%ad' --date=short)" >> "$OUTPUT_FILE"
echo "- **主要贡献者**: $(git shortlog -sn | head -5 | sed 's/^[[:space:]]*[0-9]*[[:space:]]*/- /')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 按月份分组生成更新日志
echo "## 📅 按时间分组的更新记录" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 获取所有月份
MONTHS=$(git log --pretty=format:'%ad' --date=format:'%Y-%m' | sort -u -r)

for MONTH in $MONTHS; do
    YEAR=$(echo $MONTH | cut -d'-' -f1)
    MONTH_NUM=$(echo $MONTH | cut -d'-' -f2)
    
    # 转换月份数字为中文
    case $MONTH_NUM in
        01) MONTH_NAME="一月" ;;
        02) MONTH_NAME="二月" ;;
        03) MONTH_NAME="三月" ;;
        04) MONTH_NAME="四月" ;;
        05) MONTH_NAME="五月" ;;
        06) MONTH_NAME="六月" ;;
        07) MONTH_NAME="七月" ;;
        08) MONTH_NAME="八月" ;;
        09) MONTH_NAME="九月" ;;
        10) MONTH_NAME="十月" ;;
        11) MONTH_NAME="十一月" ;;
        12) MONTH_NAME="十二月" ;;
    esac
    
    echo "### 🗓️ ${YEAR}年${MONTH_NAME}" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # 获取该月的提交记录
    git --no-pager log --since="${MONTH}-01" --until="${MONTH}-31" --pretty=format:"- **%ad** [%h] %s" --date=format:'%m-%d' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

# 添加详细的功能分类
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 🎯 功能分类统计" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 统计不同类型的提交
echo "### ✨ 新功能 (feat)" >> "$OUTPUT_FILE"
git --no-pager log --grep="feat:" --pretty=format:"- [%h] %s (%ad)" --date=short >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "### 🐛 错误修复 (fix)" >> "$OUTPUT_FILE"
git --no-pager log --grep="fix:" --pretty=format:"- [%h] %s (%ad)" --date=short >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "### 🔧 其他更新" >> "$OUTPUT_FILE"
git --no-pager log --grep="feat:" --grep="fix:" --invert-grep --pretty=format:"- [%h] %s (%ad)" --date=short >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 添加文件变更统计
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## 📈 代码统计" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "总代码行数变化:" >> "$OUTPUT_FILE"
git log --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "新增: %s 行\n删除: %s 行\n净增: %s 行\n", add, subs, loc }' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "主要文件类型分布:" >> "$OUTPUT_FILE"
git ls-files | grep -E '\.(js|ts|tsx|java|py|sql|css|md)$' | sed 's/.*\.//' | sort | uniq -c | sort -nr | head -10 >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 添加生成信息
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "*📅 更新日志生成时间: $(date '+%Y-%m-%d %H:%M:%S')*" >> "$OUTPUT_FILE"
echo "*🤖 由 git-changelog.sh 自动生成*" >> "$OUTPUT_FILE"

echo "✅ 更新日志已生成: $OUTPUT_FILE"
echo "📄 文件大小: $(wc -l < "$OUTPUT_FILE") 行"
echo "🎉 包含 $(git rev-list --count HEAD) 次提交的完整记录"