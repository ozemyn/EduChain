/**
 * 算法与数据结构入门
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const algorithmBasicsKnowledge = {
  id: 10,
  shareCode: generateMockShareCode(10),
  title: '算法与数据结构入门 - 编程基础必修课',
  content: `# 算法与数据结构入门 - 编程基础必修课

## 🎯 引言

算法和数据结构是计算机科学的基础，掌握它们对于成为优秀的程序员至关重要。无论是面试还是实际开发，都需要扎实的算法基础。

### 为什么要学习算法？

✅ **提升编程能力** - 写出更高效的代码
✅ **通过技术面试** - 大厂面试必考
✅ **解决实际问题** - 优化系统性能
✅ **培养逻辑思维** - 提高问题分析能力

---

## 📚 基础数据结构

### 1. 数组（Array）

连续的内存空间，支持随机访问。

**时间复杂度：**
- 访问：O(1)
- 搜索：O(n)
- 插入：O(n)
- 删除：O(n)

**常见操作：**

\`\`\`javascript
// 创建数组
const arr = [1, 2, 3, 4, 5];

// 访问元素
console.log(arr[0]); // 1

// 添加元素
arr.push(6); // 末尾添加
arr.unshift(0); // 开头添加

// 删除元素
arr.pop(); // 删除末尾
arr.shift(); // 删除开头

// 遍历
arr.forEach(item => console.log(item));
arr.map(item => item * 2);
arr.filter(item => item > 3);
\`\`\`

### 2. 链表（Linked List）

节点通过指针连接，插入删除效率高。

\`\`\`javascript
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // 添加节点
  append(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  
  // 删除节点
  remove(val) {
    if (!this.head) return;
    
    if (this.head.val === val) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.val === val) {
        current.next = current.next.next;
        this.size--;
        return;
      }
      current = current.next;
    }
  }
}
\`\`\`

### 3. 栈（Stack）

后进先出（LIFO）。

\`\`\`javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// 应用：括号匹配
function isValid(s) {
  const stack = new Stack();
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.isEmpty() || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  
  return stack.isEmpty();
}
\`\`\`

### 4. 队列（Queue）

先进先出（FIFO）。

\`\`\`javascript
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    return this.items.shift();
  }
  
  front() {
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}
\`\`\`

### 5. 哈希表（Hash Table）

键值对存储，平均查找时间复杂度 O(1)。

\`\`\`javascript
// JavaScript 中的 Map 就是哈希表
const map = new Map();

// 添加
map.set('name', 'John');
map.set('age', 30);

// 获取
console.log(map.get('name')); // 'John'

// 删除
map.delete('age');

// 检查
console.log(map.has('name')); // true

// 遍历
map.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});
\`\`\`

### 6. 树（Tree）

\`\`\`javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// 二叉搜索树
class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }
  
  // 中序遍历
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.val);
      this.inorder(node.right, result);
    }
    return result;
  }
}
\`\`\`

---

## 🔍 常用算法

### 1. 排序算法

**冒泡排序 - O(n²)：**

\`\`\`javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

**快速排序 - O(n log n)：**

\`\`\`javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
\`\`\`

**归并排序 - O(n log n)：**

\`\`\`javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
\`\`\`

### 2. 搜索算法

**二分搜索 - O(log n)：**

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
\`\`\`

**深度优先搜索（DFS）：**

\`\`\`javascript
function dfs(node, visited = new Set()) {
  if (!node || visited.has(node)) return;
  
  visited.add(node);
  console.log(node.val);
  
  if (node.left) dfs(node.left, visited);
  if (node.right) dfs(node.right, visited);
}
\`\`\`

**广度优先搜索（BFS）：**

\`\`\`javascript
function bfs(root) {
  if (!root) return;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node.val);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
\`\`\`

### 3. 动态规划

**斐波那契数列：**

\`\`\`javascript
// 递归（效率低）
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// 动态规划（效率高）
function fibDP(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 空间优化
function fibOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}
\`\`\`

**爬楼梯问题：**

\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}
\`\`\`

---

## 📊 时间复杂度

### 常见复杂度

- **O(1)** - 常数时间：数组访问
- **O(log n)** - 对数时间：二分搜索
- **O(n)** - 线性时间：遍历数组
- **O(n log n)** - 线性对数时间：快速排序、归并排序
- **O(n²)** - 平方时间：冒泡排序、选择排序
- **O(2ⁿ)** - 指数时间：递归斐波那契

### 复杂度比较

\`\`\`
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
\`\`\`

---

## 📋 学习建议

1. **理解基本概念**
   - 掌握每种数据结构的特点
   - 理解时间和空间复杂度

2. **多做练习题**
   - LeetCode
   - HackerRank
   - CodeWars

3. **分析复杂度**
   - 学会分析算法的时间复杂度
   - 优化代码性能

4. **学习经典算法**
   - 排序算法
   - 搜索算法
   - 动态规划
   - 贪心算法

5. **参加算法竞赛**
   - ACM/ICPC
   - Google Code Jam
   - LeetCode 周赛

---

## 🎓 总结

算法和数据结构是编程的基础，掌握它们能够显著提升编程能力。通过本指南，你应该已经了解了：

- 基础数据结构的实现和应用
- 常用算法的原理和实现
- 时间复杂度的分析方法

继续实践，你会发现算法让编程变得更加有趣！

---

**参考资源：**
- [算法导论](https://mitpress.mit.edu/books/introduction-algorithms)
- [LeetCode](https://leetcode.com/)
- [算法可视化](https://visualgo.net/)`,
  type: 'TEXT' as const,
  uploaderId: 4,
  uploaderName: '王五',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu2',
  categoryId: 11,
  categoryName: 'React',
  tags: '算法,数据结构,编程基础,面试',
  status: 1,
  createdAt: '2025-12-10T09:15:00Z',
  updatedAt: '2025-12-28T11:45:00Z',
  contentHash: 'hash_algorithm_basics_guide',
};
