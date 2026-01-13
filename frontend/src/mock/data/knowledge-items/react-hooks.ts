/**
 * React Hooks 完全指南
 */

import { generateMockShareCode } from '../../utils/shareCodeGenerator';

export const reactHooksKnowledge = {
  id: 1,
  shareCode: generateMockShareCode(1),
  title: 'React Hooks 完全指南 - 从入门到精通',
  content: `React Hooks 是 React 16.8 引入的革命性特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

主要优势：
• 更简洁的代码
• 更好的逻辑复用  
• 更容易理解的组件
• 更好的性能优化

常用的 Hooks：

1. useState - 状态管理
最常用的 Hook，用于在函数组件中添加状态。

2. useEffect - 副作用处理
用于处理副作用操作，如数据获取、订阅、手动修改 DOM 等。

3. useContext - 上下文
用于在组件树中共享数据，避免 props 层层传递。

4. useReducer - 复杂状态管理
适合管理包含多个子值的复杂 state 对象。

5. useCallback - 函数缓存
返回一个记忆化的回调函数，避免不必要的重新渲染。

6. useMemo - 值缓存
返回一个记忆化的值，用于性能优化。

最佳实践：
• 只在最顶层使用 Hooks
• 只在 React 函数中调用 Hooks
• 使用 ESLint 插件检查 Hooks 规则
• 合理拆分自定义 Hooks
• 注意依赖数组的正确性`,
  type: 'TEXT',
  uploaderId: 1,
  uploaderName: '张三',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  categoryId: 11,
  categoryName: 'React',
  tags: 'React,Hooks,前端开发,JavaScript',
  status: 1,
  createdAt: '2025-12-01T18:00:00Z',
  updatedAt: '2025-12-15T22:30:00Z',
  contentHash: 'hash_react_hooks_guide',
};
