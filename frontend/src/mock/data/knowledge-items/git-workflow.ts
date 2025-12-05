/**
 * Git 版本控制最佳实践
 */

export const gitWorkflowKnowledge = {
  id: 9,
  title: 'Git 版本控制最佳实践',
  content: `Git 是目前最流行的分布式版本控制系统，掌握 Git 是每个开发者的必备技能。

基础命令：

1. 仓库操作
• git init - 初始化仓库
• git clone - 克隆仓库
• git status - 查看状态
• git log - 查看历史

2. 文件操作
• git add - 添加到暂存区
• git commit - 提交更改
• git rm - 删除文件
• git mv - 移动文件

3. 分支操作
• git branch - 查看分支
• git checkout - 切换分支
• git merge - 合并分支
• git rebase - 变基

4. 远程操作
• git remote - 管理远程仓库
• git fetch - 获取远程更新
• git pull - 拉取并合并
• git push - 推送到远程

工作流程：

1. Git Flow
• master - 主分支
• develop - 开发分支
• feature - 功能分支
• release - 发布分支
• hotfix - 热修复分支

2. GitHub Flow
• master - 主分支
• feature - 功能分支
• 通过 Pull Request 合并

3. GitLab Flow
• production - 生产分支
• pre-production - 预发布分支
• master - 主分支

提交规范：

格式：
type(scope): subject

类型：
• feat - 新功能
• fix - 修复 bug
• docs - 文档更新
• style - 代码格式
• refactor - 重构
• test - 测试
• chore - 构建过程或辅助工具

最佳实践：
• 频繁提交，保持提交粒度小
• 编写清晰的提交信息
• 使用分支进行开发
• 定期同步远程仓库
• 使用 .gitignore 忽略不需要的文件
• 代码审查后再合并`,
  type: 'TEXT',
  uploaderId: 2,
  uploaderName: '李四',
  uploaderAvatar: '',
  categoryId: 22,
  categoryName: 'Node.js',
  tags: 'Git,版本控制,DevOps,协作开发',
  status: 1,
  createdAt: '2024-11-10T10:00:00Z',
  updatedAt: '2024-11-23T09:30:00Z',
};
