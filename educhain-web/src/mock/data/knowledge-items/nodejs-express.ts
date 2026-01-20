/**
 * Node.js + Express 后端开发
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const nodejsExpressKnowledge = {
  id: 12,
  shareCode: generateMockShareCode(12),
  title: 'Node.js + Express 后端开发 - 构建RESTful API',
  content: `# Node.js + Express 后端开发 - 构建RESTful API

## 🚀 引言

Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，Express 是最流行的 Node.js Web 框架。它们的组合让 JavaScript 开发者能够轻松构建高性能的后端应用。

### Node.js + Express 的优势

✅ **JavaScript 全栈** - 前后端使用同一语言
✅ **高性能** - 非阻塞 I/O，事件驱动
✅ **丰富的生态** - NPM 拥有海量的包
✅ **易于学习** - 简洁的 API 设计
✅ **活跃的社区** - 大量学习资源

---

## 📚 Node.js 核心特性

### 1. 事件驱动

\`\`\`javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// 监听事件
myEmitter.on('event', (data) => {
  console.log('事件触发:', data);
});

// 触发事件
myEmitter.emit('event', { message: 'Hello' });
\`\`\`

### 2. 非阻塞 I/O

\`\`\`javascript
const fs = require('fs');

// 异步读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 使用 Promise
const fsPromises = require('fs').promises;

async function readFile() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

### 3. 模块系统

\`\`\`javascript
// CommonJS
const express = require('express');
const { add, subtract } = require('./math');

module.exports = {
  add,
  subtract
};

// ES6 模块
import express from 'express';
import { add, subtract } from './math.js';

export { add, subtract };
\`\`\`

---

## 🎯 Express 框架

### 1. 基础应用

\`\`\`javascript
const express = require('express');
const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

### 2. 路由

\`\`\`javascript
// 基础路由
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// 路由参数
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id });
});

// 查询参数
app.get('/search', (req, res) => {
  const { q, page } = req.query;
  res.json({ query: q, page });
});

// 路由模块化
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.json({ users: [] });
});

userRouter.post('/', (req, res) => {
  res.status(201).json(req.body);
});

app.use('/api/users', userRouter);
\`\`\`

### 3. 中间件

\`\`\`javascript
// 应用级中间件
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});

// 路由级中间件
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // 验证 token
  next();
};

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Protected route' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
\`\`\`

---

## 🛠️ RESTful API 设计

### 1. HTTP 方法

\`\`\`javascript
// GET - 获取资源
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST - 创建资源
app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// PUT - 更新资源（完整更新）
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// PATCH - 更新资源（部分更新）
app.patch('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// DELETE - 删除资源
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
\`\`\`

### 2. 状态码

\`\`\`javascript
// 2xx 成功
res.status(200).json({ message: 'OK' });
res.status(201).json({ message: 'Created' });
res.status(204).send(); // No Content

// 4xx 客户端错误
res.status(400).json({ error: 'Bad Request' });
res.status(401).json({ error: 'Unauthorized' });
res.status(403).json({ error: 'Forbidden' });
res.status(404).json({ error: 'Not Found' });

// 5xx 服务器错误
res.status(500).json({ error: 'Internal Server Error' });
res.status(503).json({ error: 'Service Unavailable' });
\`\`\`

### 3. 请求验证

\`\`\`javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // 创建用户
    res.status(201).json({ message: 'User created' });
  }
);
\`\`\`

---

## 💾 数据库集成

### 1. MongoDB + Mongoose

\`\`\`javascript
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义模型
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CRUD 操作
// 创建
const user = await User.create({
  name: 'John',
  email: 'john@example.com',
  password: 'hashed_password'
});

// 查询
const users = await User.find();
const user = await User.findById(id);
const user = await User.findOne({ email: 'john@example.com' });

// 更新
await User.findByIdAndUpdate(id, { name: 'Jane' });

// 删除
await User.findByIdAndDelete(id);
\`\`\`

### 2. MySQL + Sequelize

\`\`\`javascript
const { Sequelize, DataTypes } = require('sequelize');

// 连接数据库
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// 定义模型
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// 同步模型
await sequelize.sync();

// CRUD 操作
const user = await User.create({
  name: 'John',
  email: 'john@example.com',
  password: 'hashed_password'
});

const users = await User.findAll();
const user = await User.findByPk(id);
await user.update({ name: 'Jane' });
await user.destroy();
\`\`\`

---

## 🔐 身份验证

### JWT 认证

\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 注册
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // 哈希密码
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 创建用户
  const user = await User.create({
    email,
    password: hashedPassword
  });
  
  res.status(201).json({ message: 'User created' });
});

// 登录
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 查找用户
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // 验证密码
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // 生成 token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token });
});

// 认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 受保护的路由
app.get('/api/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});
\`\`\`

---

## 📋 最佳实践

1. **环境变量管理**
   - 使用 dotenv 管理配置
   - 不要提交敏感信息到版本控制

2. **错误处理**
   - 实现统一的错误处理中间件
   - 记录错误日志

3. **异步处理**
   - 使用 async/await
   - 正确处理 Promise 错误

4. **安全性**
   - 使用 helmet 增强安全性
   - 实现 CORS 策略
   - 验证和清理用户输入

5. **性能优化**
   - 使用缓存（Redis）
   - 实现数据库索引
   - 使用连接池

---

## 🎓 总结

Node.js + Express 是构建现代 Web 应用的强大组合。通过本指南，你应该已经了解了：

- Node.js 的核心特性
- Express 框架的使用
- RESTful API 设计
- 数据库集成和身份验证

继续实践，你会发现 Node.js 让后端开发变得简单高效！

---

**参考资源：**
- [Node.js 官方文档](https://nodejs.org/docs/)
- [Express 官方文档](https://expressjs.com/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)`,
  type: 'TEXT' as const,
  uploaderId: 5,
  uploaderName: '赵六',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu3',
  categoryId: 22,
  categoryName: 'Node.js',
  tags: 'Node.js,Express,后端开发,JavaScript',
  status: 1,
  createdAt: '2025-12-12T12:00:00Z',
  updatedAt: '2025-12-30T10:00:00Z',
  contentHash: 'hash_nodejs_async',
};
