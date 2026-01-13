/**
 * TypeScript 高级类型系统指南
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const typescriptGuideKnowledge = {
  id: 2,
  shareCode: generateMockShareCode(2),
  title: 'TypeScript 高级类型系统 - 深入理解与实践',
  content: `# TypeScript 高级类型系统 - 深入理解与实践

## 🎯 引言

TypeScript 是 JavaScript 的超集，为 JavaScript 添加了静态类型系统。掌握 TypeScript 的高级类型系统，能够让你编写更安全、更易维护的代码。

### TypeScript 的优势

✅ **类型安全** - 在编译时捕获错误
✅ **更好的 IDE 支持** - 智能提示和自动补全
✅ **代码可维护性** - 类型即文档
✅ **重构友好** - 安全地重构代码
✅ **团队协作** - 明确的接口定义

---

## 📚 基础类型

### 原始类型

\`\`\`typescript
// 基本类型
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// Any 和 Unknown
let notSure: any = 4;
let uncertain: unknown = 4;

// Void, Null, Undefined
function warnUser(): void {
  console.log("This is a warning message");
}

let u: undefined = undefined;
let n: null = null;

// Never
function error(message: string): never {
  throw new Error(message);
}
\`\`\`

### 对象类型

\`\`\`typescript
// 接口
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 类型别名
type Point = {
  x: number;
  y: number;
};

// 函数类型
type AddFunction = (a: number, b: number) => number;

const add: AddFunction = (a, b) => a + b;
\`\`\`

---

## 🔥 高级类型

### 1. 联合类型和交叉类型

\`\`\`typescript
// 联合类型
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      console.log('Loading...');
      break;
    case 'success':
      console.log('Success!');
      break;
    case 'error':
      console.log('Error!');
      break;
  }
}

// 交叉类型
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

const cc: ColorfulCircle = {
  color: 'red',
  radius: 42
};
\`\`\`

### 2. 类型守卫

\`\`\`typescript
// typeof 类型守卫
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  if (typeof padding === 'string') {
    return padding + value;
  }
  throw new Error(\`Expected string or number, got '\${padding}'.\`);
}

// instanceof 类型守卫
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Fish {
  swim() {
    console.log('Swimming...');
  }
}

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly();
  } else {
    animal.swim();
  }
}

// 自定义类型守卫
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}

function makeSound(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}
\`\`\`

### 3. 泛型

\`\`\`typescript
// 基础泛型
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity("myString"); // 类型推断

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity({ length: 10, value: 3 });
\`\`\`

### 4. 映射类型

\`\`\`typescript
// Partial - 所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Todo {
  title: string;
  description: string;
}

type PartialTodo = Partial<Todo>;
// { title?: string; description?: string; }

// Required - 所有属性变为必需
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Readonly - 所有属性变为只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick - 选择部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type TodoPreview = Pick<Todo, 'title'>;
// { title: string; }

// Omit - 排除部分属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type TodoWithoutDescription = Omit<Todo, 'description'>;
// { title: string; }

// Record - 创建对象类型
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type PageInfo = {
  title: string;
};

type Page = 'home' | 'about' | 'contact';

const pages: Record<Page, PageInfo> = {
  home: { title: 'Home' },
  about: { title: 'About' },
  contact: { title: 'Contact' }
};
\`\`\`

### 5. 条件类型

\`\`\`typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// string[] | number[]

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>;
// { x: number; y: number; }

// 实用的条件类型
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type NonNullable<T> = T extends null | undefined ? never : T;

type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T2 = NonNullable<string | number | undefined>; // string | number
\`\`\`

---

## 🎨 实战技巧

### 1. 类型推断

\`\`\`typescript
// 使用 typeof 获取类型
const person = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
};

type Person = typeof person;
// {
//   name: string;
//   age: number;
//   address: {
//     city: string;
//     country: string;
//   };
// }

// 使用 ReturnType 获取函数返回类型
function getUser() {
  return {
    id: 1,
    name: 'John',
    email: 'john@example.com'
  };
}

type User = ReturnType<typeof getUser>;
// {
//   id: number;
//   name: string;
//   email: string;
// }

// 使用 Parameters 获取函数参数类型
function createUser(name: string, age: number) {
  return { name, age };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
\`\`\`

### 2. 类型断言

\`\`\`typescript
// as 断言
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 非空断言
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());
}

// const 断言
let x = "hello" as const;
// type: "hello"

let y = [10, 20] as const;
// type: readonly [10, 20]

const config = {
  endpoint: 'https://api.example.com',
  timeout: 5000
} as const;
// type: {
//   readonly endpoint: "https://api.example.com";
//   readonly timeout: 5000;
// }
\`\`\`

### 3. 索引签名

\`\`\`typescript
// 基础索引签名
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];

// 字符串索引签名
interface Dictionary {
  [key: string]: number;
}

let dict: Dictionary = {
  apple: 1,
  banana: 2
};

// 混合索引签名
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number;
  name: string;
}
\`\`\`

### 4. 模板字面量类型

\`\`\`typescript
// 基础模板字面量
type World = "world";
type Greeting = \`hello \${World}\`;
// type: "hello world"

// 联合类型的模板字面量
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = \`\${EmailLocaleIDs | FooterLocaleIDs}_id\`;
// type: "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// 实用工具类型
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type UppercaseGreeting = Uppercase<"hello">;
// type: "HELLO"
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: API 响应类型

\`\`\`typescript
// 定义 API 响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 使用
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// 分页响应
interface PageResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
}

async function fetchUsers(page: number): Promise<PageResponse<User>> {
  const response = await fetch(\`/api/users?page=\${page}\`);
  return response.json();
}
\`\`\`

### 案例 2: 表单验证

\`\`\`typescript
// 表单字段类型
interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  validate: (value: T) => string | undefined;
}

// 表单类型
type Form<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// 使用
interface LoginForm {
  email: string;
  password: string;
}

const loginForm: Form<LoginForm> = {
  email: {
    value: '',
    touched: false,
    validate: (value) => {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      return undefined;
    }
  },
  password: {
    value: '',
    touched: false,
    validate: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return undefined;
    }
  }
};
\`\`\`

### 案例 3: 状态管理

\`\`\`typescript
// Redux-like 状态管理
type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

// 定义 Actions
type IncrementAction = Action<'INCREMENT'>;
type DecrementAction = Action<'DECREMENT'>;
type SetCountAction = Action<'SET_COUNT', number>;

type CounterAction = IncrementAction | DecrementAction | SetCountAction;

// Reducer
interface CounterState {
  count: number;
}

function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'SET_COUNT':
      return { count: action.payload };
    default:
      return state;
  }
}
\`\`\`

---

## 📋 最佳实践

1. **优先使用接口而非类型别名**
   - 接口可以被扩展
   - 接口有更好的错误提示

2. **使用严格模式**
   - 启用 strict 选项
   - 避免使用 any

3. **合理使用泛型**
   - 提高代码复用性
   - 保持类型安全

4. **避免类型断言**
   - 尽量让 TypeScript 推断类型
   - 只在必要时使用断言

5. **使用工具类型**
   - 利用内置工具类型
   - 创建自定义工具类型

---

## 🎓 总结

TypeScript 的类型系统非常强大，掌握高级类型能够让你编写更安全、更易维护的代码。通过本指南，你应该已经了解了：

- TypeScript 的基础类型和高级类型
- 泛型、映射类型、条件类型等高级特性
- 实战案例和最佳实践

继续实践，你会发现 TypeScript 让 JavaScript 开发变得更加可靠和高效！

---

**参考资源：**
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)`,
  type: 'TEXT' as const,
  uploaderId: 5,
  uploaderName: '赵六',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
  categoryId: 11,
  categoryName: 'React',
  tags: 'TypeScript,类型系统,前端开发,JavaScript',
  status: 1,
  createdAt: '2025-12-03T09:45:00Z',
  updatedAt: '2025-12-20T16:00:00Z',
  contentHash: 'hash_typescript_guide',
};
