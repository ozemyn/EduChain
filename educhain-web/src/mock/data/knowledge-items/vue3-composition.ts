/**
 * Vue 3 Composition API 深度解析
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const vue3CompositionKnowledge = {
  id: 3,
  shareCode: generateMockShareCode(3),
  title: 'Vue 3 Composition API 深度解析 - 构建现代化应用',
  content: `# Vue 3 Composition API 深度解析 - 构建现代化应用

## 🎯 引言

Vue 3 的 Composition API 是 Vue 框架的重大革新，它提供了一种更灵活、更强大的方式来组织组件逻辑。相比 Options API，Composition API 让代码更易于复用和维护。

### 为什么需要 Composition API？

在 Vue 2 的 Options API 中，我们面临以下问题：

1. **逻辑复用困难**
   - Mixins 容易产生命名冲突
   - 高阶组件增加组件层级
   - 难以追踪数据来源

2. **大型组件难以维护**
   - 相关逻辑分散在不同选项中
   - 难以理解组件的完整逻辑
   - 代码跳转频繁

3. **TypeScript 支持不够好**
   - this 的类型推导困难
   - 需要额外的类型声明

### Composition API 的优势

✅ **更好的逻辑复用** - 通过组合函数轻松复用逻辑
✅ **更好的类型推导** - 完美支持 TypeScript
✅ **更灵活的代码组织** - 按功能组织代码
✅ **更小的打包体积** - Tree-shaking 友好
✅ **更好的性能** - 更少的组件实例开销

---

## 📚 核心 API

### 1. setup 函数

setup 是 Composition API 的入口点，在组件创建之前执行。

\`\`\`vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 响应式状态
const count = ref(0);
const doubleCount = computed(() => count.value * 2);

// 方法
function increment() {
  count.value++;
}

// 生命周期
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
\`\`\`

### 2. 响应式 API

#### ref

创建一个响应式引用，可以包装任何类型的值。

\`\`\`typescript
import { ref } from 'vue';

// 基本类型
const count = ref(0);
console.log(count.value); // 0
count.value++;

// 对象类型
const user = ref({
  name: 'John',
  age: 30
});

user.value.name = 'Jane';

// 数组
const list = ref([1, 2, 3]);
list.value.push(4);
\`\`\`

#### reactive

创建一个响应式对象，只能用于对象类型。

\`\`\`typescript
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  user: {
    name: 'John',
    age: 30
  }
});

// 直接访问属性
state.count++;
state.user.name = 'Jane';

// 注意：不能直接替换整个对象
// ❌ 错误
state = reactive({ count: 1 });

// ✅ 正确
Object.assign(state, { count: 1 });
\`\`\`

#### computed

创建一个计算属性，基于响应式依赖进行缓存。

\`\`\`typescript
import { ref, computed } from 'vue';

const count = ref(0);

// 只读计算属性
const doubleCount = computed(() => count.value * 2);

// 可写计算属性
const fullName = computed({
  get() {
    return \`\${firstName.value} \${lastName.value}\`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  }
});
\`\`\`

#### watch 和 watchEffect

监听响应式数据的变化。

\`\`\`typescript
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const user = ref({ name: 'John', age: 30 });

// watch - 惰性执行
watch(count, (newValue, oldValue) => {
  console.log(\`Count changed from \${oldValue} to \${newValue}\`);
});

// 监听多个源
watch([count, user], ([newCount, newUser], [oldCount, oldUser]) => {
  console.log('Count or user changed');
});

// 深度监听
watch(
  user,
  (newValue) => {
    console.log('User changed:', newValue);
  },
  { deep: true }
);

// watchEffect - 立即执行
watchEffect(() => {
  console.log(\`Count is \${count.value}\`);
});

// 停止监听
const stop = watchEffect(() => {
  console.log(\`Count is \${count.value}\`);
});

// 调用 stop 停止监听
stop();
\`\`\`

### 3. 生命周期钩子

\`\`\`typescript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue';

// 挂载前
onBeforeMount(() => {
  console.log('Before mount');
});

// 挂载后
onMounted(() => {
  console.log('Mounted');
});

// 更新前
onBeforeUpdate(() => {
  console.log('Before update');
});

// 更新后
onUpdated(() => {
  console.log('Updated');
});

// 卸载前
onBeforeUnmount(() => {
  console.log('Before unmount');
});

// 卸载后
onUnmounted(() => {
  console.log('Unmounted');
});

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('Error captured:', err);
  return false; // 阻止错误继续传播
});
\`\`\`

### 4. 依赖注入

\`\`\`typescript
import { provide, inject, InjectionKey } from 'vue';

// 定义注入键
const userKey: InjectionKey<User> = Symbol('user');

// 父组件提供
provide(userKey, {
  id: 1,
  name: 'John',
  email: 'john@example.com'
});

// 子组件注入
const user = inject(userKey);

// 提供默认值
const user = inject(userKey, {
  id: 0,
  name: 'Guest',
  email: ''
});

// 提供工厂函数
const user = inject(userKey, () => ({
  id: 0,
  name: 'Guest',
  email: ''
}));
\`\`\`

---

## 🔧 组合式函数（Composables）

组合式函数是 Composition API 最强大的特性之一，它让你可以提取和复用有状态的逻辑。

### 示例 1: useCounter

\`\`\`typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initialValue;
  }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  };
}

// 使用
<script setup lang="ts">
import { useCounter } from './composables/useCounter';

const { count, doubleCount, increment, decrement, reset } = useCounter(10);
</script>
\`\`\`

### 示例 2: useFetch

\`\`\`typescript
// composables/useFetch.ts
import { ref, watchEffect, toValue } from 'vue';

export function useFetch<T>(url: MaybeRef<string>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  watchEffect(async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(toValue(url));
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  });

  return { data, error, loading };
}

// 使用
<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from './composables/useFetch';

const userId = ref(1);
const { data: user, error, loading } = useFetch(
  computed(() => \`/api/users/\${userId.value}\`)
);
</script>
\`\`\`

### 示例 3: useLocalStorage

\`\`\`typescript
// composables/useLocalStorage.ts
import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue);

  // 从 localStorage 读取初始值
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      data.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored value:', e);
    }
  }

  // 监听变化并保存到 localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return data;
}

// 使用
<script setup lang="ts">
import { useLocalStorage } from './composables/useLocalStorage';

const theme = useLocalStorage('theme', 'light');
const settings = useLocalStorage('settings', {
  notifications: true,
  language: 'en'
});
</script>
\`\`\`

### 示例 4: useDebounce

\`\`\`typescript
// composables/useDebounce.ts
import { ref, watch } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debouncedValue = ref<T>(value.value);
  let timeout: ReturnType<typeof setTimeout>;

  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}

// 使用
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounce } from './composables/useDebounce';

const searchTerm = ref('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

watch(debouncedSearchTerm, (value) => {
  // 执行搜索
  console.log('Searching for:', value);
});
</script>
\`\`\`

---

## 🎨 高级技巧

### 1. 响应式转换

\`\`\`typescript
import { ref, reactive, toRef, toRefs, unref, isRef } from 'vue';

const state = reactive({
  count: 0,
  user: {
    name: 'John'
  }
});

// toRef - 创建对响应式对象属性的引用
const count = toRef(state, 'count');
count.value++; // state.count 也会更新

// toRefs - 将响应式对象转换为普通对象，每个属性都是 ref
const { count: countRef, user } = toRefs(state);

// unref - 如果参数是 ref，返回其值，否则返回参数本身
const value = unref(count); // 等同于 isRef(count) ? count.value : count

// isRef - 检查值是否为 ref
if (isRef(count)) {
  console.log('count is a ref');
}
\`\`\`

### 2. 只读和浅层响应式

\`\`\`typescript
import { ref, readonly, shallowRef, shallowReactive } from 'vue';

// readonly - 创建只读代理
const original = ref({ count: 0 });
const copy = readonly(original);

// ❌ 警告：无法修改只读属性
copy.value.count++;

// shallowRef - 只有 .value 是响应式的
const state = shallowRef({ count: 0 });
state.value = { count: 1 }; // 触发更新
state.value.count = 2; // 不触发更新

// shallowReactive - 只有根级别属性是响应式的
const state = shallowReactive({
  count: 0,
  nested: { value: 1 }
});
state.count++; // 触发更新
state.nested.value++; // 不触发更新
\`\`\`

### 3. 自定义 ref

\`\`\`typescript
import { customRef } from 'vue';

// 创建一个防抖 ref
function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>;

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      }
    };
  });
}

// 使用
const text = useDebouncedRef('', 500);
\`\`\`

### 4. effectScope

\`\`\`typescript
import { effectScope, ref, watch } from 'vue';

// 创建一个 effect 作用域
const scope = effectScope();

scope.run(() => {
  const count = ref(0);

  watch(count, () => {
    console.log('Count changed');
  });

  // 其他响应式效果...
});

// 停止作用域内的所有效果
scope.stop();
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: 表单处理

\`\`\`vue
<script setup lang="ts">
import { reactive, computed } from 'vue';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const form = reactive<FormData>({
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive<FormErrors>({});

const isValid = computed(() => {
  return Object.keys(errors).length === 0 &&
         form.email &&
         form.password &&
         form.confirmPassword;
});

function validateEmail() {
  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid';
  } else {
    delete errors.email;
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else {
    delete errors.password;
  }
}

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  } else {
    delete errors.confirmPassword;
  }
}

async function handleSubmit() {
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (isValid.value) {
    // 提交表单
    console.log('Form submitted:', form);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        v-model="form.email"
        @blur="validateEmail"
        type="email"
        placeholder="Email"
      />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <input
        v-model="form.password"
        @blur="validatePassword"
        type="password"
        placeholder="Password"
      />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <input
        v-model="form.confirmPassword"
        @blur="validateConfirmPassword"
        type="password"
        placeholder="Confirm Password"
      />
      <span v-if="errors.confirmPassword" class="error">
        {{ errors.confirmPassword }}
      </span>
    </div>

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>
\`\`\`

### 案例 2: 无限滚动

\`\`\`typescript
// composables/useInfiniteScroll.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useInfiniteScroll(callback: () => void) {
  const isLoading = ref(false);

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading.value) {
      isLoading.value = true;
      callback();
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return { isLoading };
}

// 使用
<script setup lang="ts">
import { ref } from 'vue';
import { useInfiniteScroll } from './composables/useInfiniteScroll';

const items = ref<string[]>([]);
const page = ref(1);

const { isLoading } = useInfiniteScroll(async () => {
  const newItems = await fetchItems(page.value);
  items.value.push(...newItems);
  page.value++;
  isLoading.value = false;
});
</script>
\`\`\`

---

## 📋 最佳实践

1. **使用 \`<script setup>\`**
   - 更简洁的语法
   - 更好的性能
   - 更好的 TypeScript 支持

2. **合理使用 ref 和 reactive**
   - 基本类型使用 ref
   - 对象类型可以使用 reactive
   - 需要替换整个对象时使用 ref

3. **提取可复用逻辑**
   - 创建组合式函数
   - 保持单一职责
   - 使用 TypeScript 提供类型安全

4. **避免过度响应式**
   - 不是所有数据都需要响应式
   - 使用 shallowRef/shallowReactive 优化性能
   - 使用 readonly 保护数据

5. **正确使用生命周期**
   - 在 setup 中注册生命周期钩子
   - 清理副作用（定时器、事件监听等）

---

## 🎓 总结

Vue 3 的 Composition API 为我们提供了更灵活、更强大的方式来组织组件逻辑。通过本指南，你应该已经了解了：

- Composition API 的核心概念和 API
- 如何创建和使用组合式函数
- 高级技巧和实战案例
- 最佳实践

继续实践，你会发现 Composition API 让 Vue 开发变得更加优雅和高效！

---

**参考资源：**
- [Vue 3 官方文档](https://vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [VueUse](https://vueuse.org/) - 实用的组合式函数集合`,
  type: 'TEXT' as const,
  uploaderId: 4,
  uploaderName: '王五',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
  categoryId: 12,
  categoryName: 'Vue',
  tags: 'Vue,Composition API,前端开发,JavaScript',
  status: 1,
  createdAt: '2025-12-05T13:30:00Z',
  updatedAt: '2025-12-22T09:45:00Z',
  contentHash: 'hash_vue3_composition_api',
};
