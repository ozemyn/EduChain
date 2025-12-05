/**
 * Vue 3 Composition API 实战指南
 */

export const vue3CompositionKnowledge = {
  id: 3,
  title: 'Vue 3 Composition API 实战指南',
  content: `Vue 3 引入了全新的 Composition API，提供了更灵活的代码组织方式和更好的逻辑复用能力。

核心 API：

1. setup() 函数
组件的入口点，在组件创建之前执行，接收 props 和 context 作为参数。

2. 响应式 API
• ref() - 创建响应式引用
• reactive() - 创建响应式对象
• computed() - 创建计算属性
• watch() - 监听响应式数据变化
• watchEffect() - 自动追踪依赖并执行副作用

3. 生命周期钩子
• onBeforeMount - 挂载前
• onMounted - 挂载后
• onBeforeUpdate - 更新前
• onUpdated - 更新后
• onBeforeUnmount - 卸载前
• onUnmounted - 卸载后

4. 依赖注入
• provide() - 提供数据
• inject() - 注入数据

5. 模板引用
• ref 属性 - 获取 DOM 元素或组件实例

优势：
• 更好的代码组织
• 更容易的逻辑复用
• 更好的类型推导
• 更小的打包体积
• 更好的性能

与 Options API 对比：
Options API 按选项组织代码（data、methods、computed等），而 Composition API 按逻辑功能组织代码，使相关代码更加聚合。

最佳实践：
• 使用 script setup 语法糖
• 合理拆分组合式函数
• 使用 TypeScript 获得更好的类型支持
• 注意响应式数据的解构问题
• 合理使用 ref 和 reactive`,
  type: 'TEXT',
  uploaderId: 3,
  uploaderName: '王五',
  uploaderAvatar: '',
  categoryId: 12,
  categoryName: 'Vue',
  tags: 'Vue3,Composition API,前端开发,JavaScript',
  status: 1,
  createdAt: '2024-11-03T14:15:00Z',
  updatedAt: '2024-11-17T09:45:00Z',
};
