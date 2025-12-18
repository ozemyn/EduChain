# 贡献指南

感谢你对 EduChain 项目的关注！我们欢迎任何形式的贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)

## 行为准则

请阅读并遵守我们的行为准则，确保社区的友好和包容。

- 尊重所有贡献者
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 如何贡献

### 报告 Bug

1. 在 [Issues](https://github.com/ozemyn/EduChain/issues) 中搜索是否已有相同问题
2. 如果没有，创建新的 Issue
3. 使用 Bug 报告模板
4. 提供详细的复现步骤

### 提出新功能

1. 在 Issues 中搜索是否已有相同建议
2. 创建新的 Feature Request
3. 详细描述功能需求和使用场景

### 提交代码

1. Fork 本仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request

## 开发流程

### 1. Fork 和克隆

```bash
# Fork 仓库后克隆到本地
git clone https://github.com/YOUR_USERNAME/EduChain.git
cd EduChain

# 添加上游仓库
git remote add upstream https://github.com/ozemyn/EduChain.git
```

### 2. 创建分支

```bash
# 同步上游代码
git fetch upstream
git checkout main
git merge upstream/main

# 创建功能分支
git checkout -b feature/your-feature-name
```

### 3. 开发和测试

```bash
# 后端测试
mvn test

# 前端测试
cd frontend && npm test
```

### 4. 提交代码

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

## 代码规范

### Java 代码规范

- 使用 Google Java Style
- 运行 `mvn spotless:apply` 格式化代码
- 类名使用 PascalCase
- 方法名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

```java
// 示例
public class UserService {
    private static final int MAX_RETRY = 3;
    
    public UserDTO getUserById(Long userId) {
        // ...
    }
}
```

### TypeScript 代码规范

- 使用 ESLint + Prettier
- 运行 `npm run lint` 检查代码
- 组件使用 PascalCase
- 函数使用 camelCase

```typescript
// 示例
interface UserProps {
  userId: number;
  username: string;
}

const UserCard: React.FC<UserProps> = ({ userId, username }) => {
  // ...
};
```

### Python 代码规范

- 遵循 PEP 8
- 使用 Black 格式化
- 函数名使用 snake_case

```python
# 示例
def calculate_hash(data: str) -> str:
    """计算数据的哈希值"""
    return hashlib.sha256(data.encode()).hexdigest()
```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构（不是新功能或修复） |
| test | 测试相关 |
| chore | 构建/工具相关 |

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```
feat(auth): add JWT refresh token support

- Add refresh token generation
- Add token refresh endpoint
- Update security config

Closes #123
```

## Pull Request 流程

### 1. 创建 PR

- 填写 PR 模板
- 关联相关 Issue
- 添加适当的标签

### 2. PR 模板

```markdown
## 描述
简要描述这个 PR 做了什么

## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 重构
- [ ] 其他

## 测试
描述如何测试这些变更

## 检查清单
- [ ] 代码已自测
- [ ] 已添加必要的测试
- [ ] 文档已更新
- [ ] 代码符合规范
```

### 3. 代码审查

- 至少需要 1 个 Approve
- 所有 CI 检查通过
- 解决所有评论

### 4. 合并

- 使用 Squash and Merge
- 删除功能分支

## 开发环境设置

### 后端

```bash
# 安装依赖
mvn install

# 运行测试
mvn test

# 启动服务
mvn spring-boot:run
```

### 前端

```bash
cd frontend

# 安装依赖
npm install

# 运行测试
npm test

# 启动开发服务器
npm run dev
```

### 区块链服务

```bash
cd blockchain-service

# 安装依赖
pip install -r requirements.txt

# 运行测试
pytest

# 启动服务
python main.py
```

## 问题反馈

如有任何问题，请通过以下方式联系：

- 创建 [Issue](https://github.com/ozemyn/EduChain/issues)
- 发送邮件至项目维护者

感谢你的贡献！🎉
