/**
 * 知识条目详细数据 Mock
 * 包含完整的知识内容和统计数据
 */

import type { KnowledgeItem, KnowledgeStats } from '@/types/api';

// 详细的知识条目数据
export const mockKnowledgeDetailed: KnowledgeItem[] = [
  {
    id: 1,
    title: 'React 18 新特性详解与实践指南',
    type: 'TEXT' as const,
    content: `# React 18 新特性详解与实践指南

## 概述

React 18 是 React 的一个重大版本更新，引入了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性，并提供实践指南。

## 主要新特性

### 1. 并发渲染 (Concurrent Rendering)

并发渲染是 React 18 最重要的新特性之一。它允许 React 在渲染过程中被中断，从而提高应用的响应性。

\`\`\`jsx
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
\`\`\`

### 2. Automatic Batching

React 18 引入了自动批处理，可以将多个状态更新合并为一次重新渲染。

\`\`\`jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // React 18 会自动批处理这些更新
    setCount(c => c + 1);
    setFlag(f => !f);
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
\`\`\`

### 3. Suspense 改进

React 18 对 Suspense 进行了重大改进，现在支持服务端渲染。

\`\`\`jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfilePage />
    </Suspense>
  );
}
\`\`\`

### 4. 新的 Hooks

#### useId

\`\`\`jsx
import { useId } from 'react';

function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
}
\`\`\`

#### useDeferredValue

\`\`\`jsx
import { useDeferredValue, useState } from 'react';

function App() {
  const [text, setText] = useState('hello');
  const deferredText = useDeferredValue(text);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </div>
  );
}
\`\`\`

## 迁移指南

### 1. 升级到 React 18

\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

### 2. 更新根组件渲染方式

\`\`\`jsx
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## 性能优化建议

1. **使用 Concurrent Features**: 利用 startTransition 和 useDeferredValue 优化用户体验
2. **合理使用 Suspense**: 在数据获取和代码分割中使用 Suspense
3. **避免不必要的重渲染**: 使用 React.memo 和 useMemo 优化组件

## 总结

React 18 带来了许多激动人心的新特性，特别是并发渲染功能，为构建更好的用户体验提供了强大的工具。建议开发者逐步迁移到 React 18，并充分利用这些新特性。`,
    summary:
      'React 18 新特性详解，包括并发渲染、自动批处理、Suspense 改进和新的 Hooks',
    tags: 'React,JavaScript,前端开发,并发渲染,Hooks',
    categoryId: 1,
    uploaderId: 2,
    uploaderName: '张三',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    status: 1,
    createdAt: '2024-12-01T10:30:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    contentHash:
      '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: 2,
    title: 'TypeScript 高级类型系统深度解析',
    type: 'TEXT' as const,
    content: `# TypeScript 高级类型系统深度解析

## 引言

TypeScript 的类型系统是其最强大的特性之一。本文将深入探讨 TypeScript 的高级类型特性，帮助开发者更好地利用类型系统。

## 高级类型特性

### 1. 联合类型 (Union Types)

联合类型允许一个值可以是几种类型之一。

\`\`\`typescript
type StringOrNumber = string | number;

function formatValue(value: StringOrNumber): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toString();
}
\`\`\`

### 2. 交叉类型 (Intersection Types)

交叉类型将多个类型合并为一个类型。

\`\`\`typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type PersonEmployee = Person & Employee;

const employee: PersonEmployee = {
  name: 'John',
  age: 30,
  employeeId: 12345,
  department: 'Engineering'
};
\`\`\`

### 3. 条件类型 (Conditional Types)

条件类型根据条件选择类型。

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { data: number }
\`\`\`

### 4. 映射类型 (Mapped Types)

映射类型基于旧类型创建新类型。

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
\`\`\`

### 5. 模板字面量类型 (Template Literal Types)

模板字面量类型基于字符串字面量类型构建新的字符串字面量类型。

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>; // 'onClick'
type MouseEvent = EventName<'mouseOver'>; // 'onMouseOver'

// 实际应用
type Events = 'click' | 'focus' | 'blur';
type EventHandlers = {
  [K in Events as EventName<K>]: (event: Event) => void;
};
// 结果: { onClick: (event: Event) => void; onFocus: ...; onBlur: ... }
\`\`\`

## 实用工具类型

### 1. Pick 和 Omit

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
type UserWithoutPassword = Omit<User, 'password'>;
\`\`\`

### 2. Record

\`\`\`typescript
type Role = 'admin' | 'user' | 'guest';
type Permissions = Record<Role, string[]>;

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};
\`\`\`

### 3. Extract 和 Exclude

\`\`\`typescript
type T1 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'
type T2 = Exclude<'a' | 'b' | 'c', 'a' | 'f'>; // 'b' | 'c'
\`\`\`

## 高级模式

### 1. 函数重载

\`\`\`typescript
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}
\`\`\`

### 2. 泛型约束

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\`

### 3. 索引访问类型

\`\`\`typescript
type Person = {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
};

type PersonName = Person['name']; // string
type PersonAddress = Person['address']; // { street: string; city: string; }
type PersonAddressStreet = Person['address']['street']; // string
\`\`\`

## 最佳实践

1. **使用严格模式**: 启用 \`strict\` 模式获得最佳类型检查
2. **避免 any**: 尽量使用具体类型而不是 \`any\`
3. **利用类型推断**: 让 TypeScript 自动推断类型
4. **使用联合类型**: 而不是重载来处理多种输入类型
5. **组合而非继承**: 使用交叉类型组合功能

## 总结

TypeScript 的高级类型系统提供了强大的工具来构建类型安全的应用程序。掌握这些高级特性可以显著提高代码质量和开发效率。`,
    summary:
      'TypeScript 高级类型系统详解，包括联合类型、交叉类型、条件类型、映射类型等',
    tags: 'TypeScript,类型系统,前端开发,JavaScript,静态类型',
    categoryId: 1,
    uploaderId: 3,
    uploaderName: '李四',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    status: 1,
    createdAt: '2024-11-28T14:20:00Z',
    updatedAt: '2024-11-28T14:20:00Z',
    contentHash:
      '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
  },
  {
    id: 3,
    title: 'Vue 3 Composition API 最佳实践',
    type: 'TEXT' as const,
    content: `# Vue 3 Composition API 最佳实践

## 简介

Vue 3 引入了 Composition API，这是一种新的组件逻辑组织方式。本文将介绍 Composition API 的最佳实践。

## 基础概念

### 1. setup() 函数

\`\`\`vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const title = ref('Vue 3 Demo')
    
    const increment = () => {
      count.value++
    }
    
    const doubleCount = computed(() => count.value * 2)
    
    return {
      count,
      title,
      increment,
      doubleCount
    }
  }
}
</script>
\`\`\`

### 2. 响应式 API

#### ref()

\`\`\`javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
\`\`\`

#### reactive()

\`\`\`javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})

state.count++
state.name = 'Vue 3'
\`\`\`

#### computed()

\`\`\`javascript
import { ref, computed } from 'vue'

const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

count.value++
console.log(plusOne.value) // 3
\`\`\`

### 3. 生命周期钩子

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件即将卸载')
    })
  }
}
\`\`\`

## 高级用法

### 1. 自定义 Hooks

\`\`\`javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}

// 在组件中使用
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
\`\`\`

### 2. 响应式数据监听

\`\`\`javascript
import { ref, watch, watchEffect } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const name = ref('Vue')
    
    // 监听单个响应式引用
    watch(count, (newValue, oldValue) => {
      console.log(\`count changed from \${oldValue} to \${newValue}\`)
    })
    
    // 监听多个响应式引用
    watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
      console.log('count or name changed')
    })
    
    // 立即执行的监听器
    watchEffect(() => {
      console.log(\`count is \${count.value}\`)
    })
    
    return { count, name }
  }
}
\`\`\`

### 3. 依赖注入

\`\`\`javascript
// 父组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const theme = ref('dark')
    provide('theme', theme)
    
    return { theme }
  }
}

// 子组件
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('theme')
    
    return { theme }
  }
}
\`\`\`

## 最佳实践

### 1. 组织代码结构

\`\`\`javascript
export default {
  setup() {
    // 1. 响应式数据
    const state = reactive({
      loading: false,
      data: null,
      error: null
    })
    
    // 2. 计算属性
    const hasData = computed(() => state.data !== null)
    
    // 3. 方法
    const fetchData = async () => {
      state.loading = true
      try {
        state.data = await api.getData()
      } catch (error) {
        state.error = error
      } finally {
        state.loading = false
      }
    }
    
    // 4. 生命周期
    onMounted(() => {
      fetchData()
    })
    
    // 5. 返回
    return {
      ...toRefs(state),
      hasData,
      fetchData
    }
  }
}
\`\`\`

### 2. 使用 TypeScript

\`\`\`typescript
import { ref, computed, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default {
  setup() {
    const user: Ref<User | null> = ref(null)
    const isLoggedIn = computed(() => user.value !== null)
    
    const login = (userData: User) => {
      user.value = userData
    }
    
    return {
      user,
      isLoggedIn,
      login
    }
  }
}
\`\`\`

### 3. 性能优化

\`\`\`javascript
import { ref, shallowRef, readonly, markRaw } from 'vue'

export default {
  setup() {
    // 对于大型对象，使用 shallowRef
    const largeObject = shallowRef({
      // 大量数据
    })
    
    // 对于不需要响应式的数据，使用 markRaw
    const nonReactiveData = markRaw({
      // 静态数据
    })
    
    // 对于只读数据，使用 readonly
    const readonlyState = readonly(state)
    
    return {
      largeObject,
      nonReactiveData,
      readonlyState
    }
  }
}
\`\`\`

## 总结

Composition API 提供了更灵活的代码组织方式，特别适合复杂组件的逻辑复用。通过合理使用响应式 API、自定义 Hooks 和 TypeScript，可以构建更加健壮和可维护的 Vue 应用。`,
    summary: 'Vue 3 Composition API 完整指南，包括基础用法、高级特性和最佳实践',
    tags: 'Vue.js,Composition API,前端开发,JavaScript,响应式编程',
    categoryId: 1,
    uploaderId: 4,
    uploaderName: '王五',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    status: 1,
    createdAt: '2024-11-25T16:45:00Z',
    updatedAt: '2024-11-25T16:45:00Z',
    contentHash:
      '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
  },
  {
    id: 4,
    title: 'Node.js 性能优化实战经验分享',
    type: 'TEXT' as const,
    content: `# Node.js 性能优化实战经验分享

## 前言

Node.js 作为服务端 JavaScript 运行时，在高并发场景下的性能优化至关重要。本文分享一些实战中的性能优化经验。

## 性能监控

### 1. 内置性能监控

\`\`\`javascript
const { performance, PerformanceObserver } = require('perf_hooks');

// 监控函数执行时间
function measureFunction(fn, name) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(\`\${name} took \${end - start} milliseconds\`);
    return result;
  };
}

// 使用示例
const optimizedFunction = measureFunction(someFunction, 'someFunction');
\`\`\`

### 2. 内存使用监控

\`\`\`javascript
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log({
    rss: \`\${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB\`,
    heapTotal: \`\${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB\`,
    heapUsed: \`\${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB\`,
    external: \`\${Math.round(used.external / 1024 / 1024 * 100) / 100} MB\`
  });
}

// 定期监控内存使用
setInterval(logMemoryUsage, 5000);
\`\`\`

## 异步编程优化

### 1. 避免回调地狱

\`\`\`javascript
// 不好的做法
function badAsyncCode() {
  fs.readFile('file1.txt', (err, data1) => {
    if (err) throw err;
    fs.readFile('file2.txt', (err, data2) => {
      if (err) throw err;
      fs.readFile('file3.txt', (err, data3) => {
        if (err) throw err;
        // 处理数据
      });
    });
  });
}

// 好的做法 - 使用 Promise
async function goodAsyncCode() {
  try {
    const [data1, data2, data3] = await Promise.all([
      fs.promises.readFile('file1.txt'),
      fs.promises.readFile('file2.txt'),
      fs.promises.readFile('file3.txt')
    ]);
    // 处理数据
  } catch (error) {
    console.error('Error reading files:', error);
  }
}
\`\`\`

### 2. 使用 Worker Threads

\`\`\`javascript
// main.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // 主线程
  const worker = new Worker(__filename, {
    workerData: { numbers: [1, 2, 3, 4, 5] }
  });
  
  worker.on('message', (result) => {
    console.log('计算结果:', result);
  });
} else {
  // 工作线程
  const { numbers } = workerData;
  const result = numbers.reduce((sum, num) => sum + num * num, 0);
  parentPort.postMessage(result);
}
\`\`\`

## 数据库优化

### 1. 连接池管理

\`\`\`javascript
const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// 使用连接池
async function queryDatabase(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
\`\`\`

### 2. 查询优化

\`\`\`javascript
// 批量插入优化
async function batchInsert(data) {
  const batchSize = 1000;
  const batches = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    const values = batch.map(item => [item.name, item.email, item.age]);
    await pool.query(
      'INSERT INTO users (name, email, age) VALUES ?',
      [values]
    );
  }
}
\`\`\`

## 缓存策略

### 1. 内存缓存

\`\`\`javascript
class MemoryCache {
  constructor(ttl = 300000) { // 默认5分钟过期
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new MemoryCache();
\`\`\`

### 2. Redis 缓存

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

class RedisCache {
  async set(key, value, ttl = 300) {
    await client.setEx(key, ttl, JSON.stringify(value));
  }
  
  async get(key) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async del(key) {
    await client.del(key);
  }
}

const redisCache = new RedisCache();
\`\`\`

## HTTP 优化

### 1. 启用 Gzip 压缩

\`\`\`javascript
const express = require('express');
const compression = require('compression');

const app = express();

// 启用 Gzip 压缩
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
\`\`\`

### 2. 请求限流

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
\`\`\`

## 代码优化

### 1. 避免同步操作

\`\`\`javascript
// 不好的做法
const fs = require('fs');
const data = fs.readFileSync('large-file.txt'); // 阻塞操作

// 好的做法
const fs = require('fs').promises;
const data = await fs.readFile('large-file.txt'); // 非阻塞操作
\`\`\`

### 2. 使用流处理大文件

\`\`\`javascript
const fs = require('fs');
const readline = require('readline');

async function processLargeFile(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    // 逐行处理，避免内存溢出
    processLine(line);
  }
}
\`\`\`

### 3. 对象池模式

\`\`\`javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const bufferPool = new ObjectPool(
  () => Buffer.alloc(1024),
  (buffer) => buffer.fill(0)
);
\`\`\`

## 监控和调试

### 1. 使用 Clinic.js

\`\`\`bash
npm install -g clinic
clinic doctor -- node app.js
clinic flame -- node app.js
clinic bubbleprof -- node app.js
\`\`\`

### 2. 使用 0x 进行火焰图分析

\`\`\`bash
npm install -g 0x
0x node app.js
\`\`\`

## 部署优化

### 1. PM2 集群模式

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 'max', // 使用所有CPU核心
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
\`\`\`

### 2. Docker 优化

\`\`\`dockerfile
FROM node:16-alpine

# 使用非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制应用代码
COPY . .

# 切换到非root用户
USER nextjs

EXPOSE 3000

CMD ["node", "app.js"]
\`\`\`

## 总结

Node.js 性能优化是一个系统性工程，需要从多个维度进行考虑：

1. **监控先行**: 建立完善的性能监控体系
2. **异步优化**: 充分利用 Node.js 的异步特性
3. **缓存策略**: 合理使用内存和分布式缓存
4. **数据库优化**: 连接池、查询优化、索引设计
5. **代码优化**: 避免阻塞操作，使用流处理
6. **部署优化**: 集群模式、容器化部署

通过这些优化手段，可以显著提升 Node.js 应用的性能和稳定性。`,
    summary:
      'Node.js 性能优化完整指南，包括监控、异步编程、数据库优化、缓存策略等',
    tags: 'Node.js,性能优化,后端开发,JavaScript,服务器',
    categoryId: 2,
    uploaderId: 5,
    uploaderName: '赵六',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    status: 1,
    createdAt: '2024-11-22T09:15:00Z',
    updatedAt: '2024-11-22T09:15:00Z',
    contentHash:
      '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  {
    id: 5,
    title: 'Docker 容器化部署完整指南',
    type: 'TEXT' as const,
    content: `# Docker 容器化部署完整指南

## Docker 基础概念

### 什么是 Docker？

Docker 是一个开源的容器化平台，它允许开发者将应用程序及其依赖项打包到轻量级、可移植的容器中。

### 核心概念

- **镜像 (Image)**: 只读的模板，用于创建容器
- **容器 (Container)**: 镜像的运行实例
- **Dockerfile**: 用于构建镜像的文本文件
- **仓库 (Repository)**: 存储镜像的地方

## Dockerfile 最佳实践

### 1. 基础镜像选择

\`\`\`dockerfile
# 使用官方的轻量级基础镜像
FROM node:16-alpine

# 或者使用多阶段构建
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### 2. 层缓存优化

\`\`\`dockerfile
FROM node:16-alpine

WORKDIR /app

# 先复制 package 文件，利用 Docker 层缓存
COPY package*.json ./
RUN npm ci --only=production

# 再复制应用代码
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 3. 安全最佳实践

\`\`\`dockerfile
FROM node:16-alpine

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# 以 root 身份安装依赖
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制应用文件并设置权限
COPY --chown=nextjs:nodejs . .

# 切换到非 root 用户
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Docker Compose

### 1. 基本配置

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    restart: unless-stopped

volumes:
  postgres_data:
\`\`\`

### 2. 开发环境配置

\`\`\`yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

volumes:
  postgres_dev_data:
\`\`\`

## 容器编排

### 1. Docker Swarm

\`\`\`yaml
# docker-stack.yml
version: '3.8'

services:
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    configs:
      - source: nginx_config
        target: /etc/nginx/nginx.conf
    deploy:
      replicas: 1
    networks:
      - app-network

networks:
  app-network:
    driver: overlay

configs:
  nginx_config:
    external: true
\`\`\`

### 2. Kubernetes 部署

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
\`\`\`

## 监控和日志

### 1. 健康检查

\`\`\`dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### 2. 日志管理

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    environment:
      - LOG_LEVEL=info

  # 使用 ELK Stack 进行日志收集
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.14.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
\`\`\`

## 性能优化

### 1. 镜像优化

\`\`\`dockerfile
# 多阶段构建减小镜像大小
FROM node:16-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS runtime
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 2. 资源限制

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
\`\`\`

## CI/CD 集成

### 1. GitHub Actions

\`\`\`yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1
    
    - name: Login to DockerHub
      uses: docker/login-action@v1
      with:
        username: \${{ secrets.DOCKERHUB_USERNAME }}
        password: \${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v2
      with:
        context: .
        push: true
        tags: myapp:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
\`\`\`

### 2. GitLab CI

\`\`\`yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker stop myapp || true
    - docker rm myapp || true
    - docker run -d --name myapp -p 3000:3000 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
\`\`\`

## 安全最佳实践

### 1. 镜像扫描

\`\`\`bash
# 使用 Trivy 扫描镜像漏洞
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy image myapp:latest

# 使用 Clair 进行静态分析
docker run -d --name clair-db arminc/clair-db:latest
docker run -p 6060:6060 --link clair-db:postgres -d --name clair arminc/clair-local-scan:latest
\`\`\`

### 2. 运行时安全

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
\`\`\`

## 故障排查

### 1. 常用调试命令

\`\`\`bash
# 查看容器日志
docker logs -f container_name

# 进入容器调试
docker exec -it container_name /bin/sh

# 查看容器资源使用情况
docker stats

# 检查容器网络
docker network ls
docker network inspect network_name

# 查看容器详细信息
docker inspect container_name
\`\`\`

### 2. 性能分析

\`\`\`bash
# 监控容器性能
docker run --rm -it --pid container:myapp --cap-add SYS_PTRACE \\
  nicolaka/netshoot htop

# 网络分析
docker run --rm -it --net container:myapp nicolaka/netshoot tcpdump -i eth0
\`\`\`

## 总结

Docker 容器化部署涉及多个方面：

1. **Dockerfile 优化**: 多阶段构建、层缓存、安全配置
2. **编排工具**: Docker Compose、Swarm、Kubernetes
3. **监控日志**: 健康检查、日志收集、性能监控
4. **CI/CD 集成**: 自动化构建和部署
5. **安全实践**: 镜像扫描、运行时安全、权限控制

掌握这些技能可以帮助你构建高效、安全、可维护的容器化应用。`,
    summary:
      'Docker 容器化部署完整指南，包括 Dockerfile 优化、编排、监控、CI/CD 等',
    tags: 'Docker,容器化,DevOps,部署,微服务',
    categoryId: 4,
    uploaderId: 6,
    uploaderName: '孙七',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
    status: 1,
    createdAt: '2024-11-20T11:30:00Z',
    updatedAt: '2024-11-20T11:30:00Z',
    contentHash:
      '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  },
];

// 对应的统计数据
export const mockKnowledgeDetailedStats: Record<number, KnowledgeStats> = {
  1: {
    knowledgeId: 1,
    viewCount: 4511,
    likeCount: 263,
    favoriteCount: 174,
    commentCount: 57,
    score: 92.5,
  },
  2: {
    knowledgeId: 2,
    viewCount: 3892,
    likeCount: 218,
    favoriteCount: 145,
    commentCount: 43,
    score: 89.3,
  },
  3: {
    knowledgeId: 3,
    viewCount: 3245,
    likeCount: 195,
    favoriteCount: 128,
    commentCount: 38,
    score: 87.1,
  },
  4: {
    knowledgeId: 4,
    viewCount: 2987,
    likeCount: 176,
    favoriteCount: 112,
    commentCount: 34,
    score: 85.7,
  },
  5: {
    knowledgeId: 5,
    viewCount: 2756,
    likeCount: 164,
    favoriteCount: 98,
    commentCount: 31,
    score: 84.2,
  },
};
