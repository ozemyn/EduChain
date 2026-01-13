/**
 * Git 工作流程与最佳实践
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const gitWorkflowKnowledge = {
  id: 9,
  shareCode: generateMockShareCode(9),
  title: 'Git 工作流程与最佳实践 - 团队协作指南',
  content: `# Git 工作流程与最佳实践 - 团队协作指南

## 🌿 引言

Git 是目前最流行的分布式版本控制系统，掌握 Git 的工作流程和最佳实践对于团队协作至关重要。

### Git 的优势

✅ **分布式** - 每个开发者都有完整的代码库
✅ **分支管理** - 轻量级分支，易于合并
✅ **速度快** - 本地操作，响应迅速
✅ **数据完整性** - SHA-1 哈希保证数据完整
✅ **开源免费** - 广泛使用，社区活跃

---

## 📚 基础命令

### 1. 配置

\`\`\`bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list

# 配置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
\`\`\`

### 2. 基本操作

\`\`\`bash
# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/user/repo.git

# 查看状态
git status

# 添加文件到暂存区
git add file.txt
git add .  # 添加所有文件

# 提交更改
git commit -m "提交信息"
git commit -am "添加并提交"  # 跳过暂存区

# 查看提交历史
git log
git log --oneline
git log --graph --all

# 查看差异
git diff  # 工作区 vs 暂存区
git diff --staged  # 暂存区 vs 仓库
git diff HEAD  # 工作区 vs 仓库
\`\`\`

### 3. 分支管理

\`\`\`bash
# 创建分支
git branch feature-login

# 切换分支
git checkout feature-login
git switch feature-login  # 新命令

# 创建并切换分支
git checkout -b feature-login
git switch -c feature-login

# 查看分支
git branch  # 本地分支
git branch -r  # 远程分支
git branch -a  # 所有分支

# 合并分支
git checkout main
git merge feature-login

# 删除分支
git branch -d feature-login  # 安全删除
git branch -D feature-login  # 强制删除

# 重命名分支
git branch -m old-name new-name
\`\`\`

### 4. 远程操作

\`\`\`bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 拉取更新
git fetch origin
git pull origin main

# 推送更改
git push origin main
git push -u origin main  # 设置上游分支

# 删除远程分支
git push origin --delete feature-login
\`\`\`

---

## 🔄 工作流程

### 1. Git Flow

\`\`\`bash
# 主分支
main (master)  # 生产环境
develop        # 开发环境

# 辅助分支
feature/*      # 功能分支
release/*      # 发布分支
hotfix/*       # 热修复分支

# 功能开发流程
git checkout develop
git checkout -b feature/user-login
# 开发功能...
git add .
git commit -m "feat: 实现用户登录功能"
git checkout develop
git merge feature/user-login
git branch -d feature/user-login

# 发布流程
git checkout develop
git checkout -b release/1.0.0
# 修复 bug，更新版本号...
git checkout main
git merge release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git checkout develop
git merge release/1.0.0
git branch -d release/1.0.0

# 热修复流程
git checkout main
git checkout -b hotfix/critical-bug
# 修复 bug...
git checkout main
git merge hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git checkout develop
git merge hotfix/critical-bug
git branch -d hotfix/critical-bug
\`\`\`

### 2. GitHub Flow

\`\`\`bash
# 简化的工作流程
# 1. 从 main 创建分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到远程
git push origin feature/new-feature

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR

# 5. 代码审查和讨论
# 团队成员审查代码

# 6. 合并到 main
# 通过 PR 合并

# 7. 部署
# 自动部署到生产环境
\`\`\`

---

## 🛠️ 高级技巧

### 1. 变基（Rebase）

\`\`\`bash
# 变基到 main
git checkout feature-branch
git rebase main

# 交互式变基
git rebase -i HEAD~3  # 修改最近 3 次提交

# 变基选项
pick    # 使用提交
reword  # 使用提交，但修改提交信息
edit    # 使用提交，但停下来修改
squash  # 使用提交，但合并到前一个提交
fixup   # 类似 squash，但丢弃提交信息
drop    # 删除提交
\`\`\`

### 2. 储藏（Stash）

\`\`\`bash
# 储藏更改
git stash
git stash save "工作进度"

# 查看储藏列表
git stash list

# 应用储藏
git stash apply  # 应用最近的储藏
git stash apply stash@{0}  # 应用指定储藏

# 应用并删除储藏
git stash pop

# 删除储藏
git stash drop stash@{0}
git stash clear  # 删除所有储藏
\`\`\`

### 3. 撤销操作

\`\`\`bash
# 撤销工作区更改
git checkout -- file.txt
git restore file.txt  # 新命令

# 撤销暂存区更改
git reset HEAD file.txt
git restore --staged file.txt  # 新命令

# 撤销提交
git reset --soft HEAD~1  # 保留更改在暂存区
git reset --mixed HEAD~1  # 保留更改在工作区
git reset --hard HEAD~1  # 丢弃所有更改

# 撤销已推送的提交
git revert HEAD  # 创建新提交撤销更改
\`\`\`

### 4. 标签管理

\`\`\`bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看标签
git tag
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 删除标签
git tag -d v1.0.0  # 删除本地标签
git push origin --delete v1.0.0  # 删除远程标签
\`\`\`

---

## 📋 最佳实践

### 1. 提交信息规范

\`\`\`bash
# Conventional Commits 规范
<type>(<scope>): <subject>

<body>

<footer>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响代码运行）
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建过程或辅助工具的变动

# 示例
feat(auth): 添加用户登录功能

实现了基于 JWT 的用户认证系统，包括：
- 登录接口
- 注册接口
- Token 刷新机制

Closes #123
\`\`\`

### 2. 分支命名规范

\`\`\`bash
# 功能分支
feature/user-authentication
feature/payment-integration

# 修复分支
fix/login-error
fix/memory-leak

# 热修复分支
hotfix/critical-security-issue

# 发布分支
release/1.0.0
release/2.0.0-beta

# 文档分支
docs/api-documentation
docs/readme-update
\`\`\`

### 3. .gitignore 配置

\`\`\`bash
# Node.js
node_modules/
npm-debug.log*
.env
.env.local

# Python
__pycache__/
*.py[cod]
venv/
.pytest_cache/

# Java
*.class
*.jar
target/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# 构建产物
dist/
build/
*.log
\`\`\`

### 4. 团队协作

\`\`\`bash
# 1. 保持分支更新
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/new-feature

# 3. 定期同步主分支
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main

# 4. 提交前检查
git status
git diff

# 5. 编写清晰的提交信息
git commit -m "feat: 添加用户搜索功能"

# 6. 推送前拉取最新代码
git pull --rebase origin main

# 7. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR

# 8. 代码审查
# 等待团队成员审查

# 9. 合并后删除分支
git branch -d feature/new-feature
git push origin --delete feature/new-feature
\`\`\`

---

## 🎓 总结

Git 是现代软件开发不可或缺的工具，掌握 Git 的工作流程和最佳实践能够显著提高团队协作效率。通过本指南，你应该已经了解了：

- Git 的基础命令和操作
- 常用的工作流程（Git Flow、GitHub Flow）
- 高级技巧和最佳实践

继续实践，你会发现 Git 让版本控制变得简单高效！

---

**参考资源：**
- [Pro Git 书籍](https://git-scm.com/book/zh/v2)
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)`,
  type: 'TEXT' as const,
  uploaderId: 9,
  uploaderName: '郑十',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengshi',
  categoryId: 15,
  categoryName: '开发工具',
  tags: 'Git,版本控制,团队协作,DevOps',
  status: 1,
  createdAt: '2025-12-09T14:15:00Z',
  updatedAt: '2025-12-27T09:30:00Z',
  contentHash: 'hash_git_workflow_guide',
};
