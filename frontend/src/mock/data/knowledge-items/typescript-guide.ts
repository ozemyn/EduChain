/**
 * TypeScript 类型系统深度解析
 */

export const typescriptGuideKnowledge = {
  id: 2,
  title: 'TypeScript 类型系统深度解析',
  content: `TypeScript 是 JavaScript 的超集，为 JavaScript 添加了静态类型系统。它能在编译时发现错误，提高代码质量和开发效率。

核心概念：

1. 基础类型
• string - 字符串类型
• number - 数字类型
• boolean - 布尔类型
• array - 数组类型
• tuple - 元组类型
• enum - 枚举类型
• any - 任意类型
• void - 空类型
• null 和 undefined
• never - 永不存在的值的类型

2. 接口（Interface）
用于定义对象的结构，描述对象应该具有哪些属性和方法。

3. 类型别名（Type Alias）
使用 type 关键字创建类型别名，可以给类型起一个新名字。

4. 联合类型和交叉类型
• 联合类型：值可以是多种类型之一
• 交叉类型：将多个类型合并为一个类型

5. 泛型（Generics）
泛型允许我们在定义函数、接口或类时，不预先指定具体的类型，而在使用时再指定类型。

6. 类型守卫
用于在运行时检查类型，缩小类型范围。

7. 高级类型
• 映射类型
• 条件类型
• 索引类型
• 工具类型（Partial、Required、Pick、Omit等）

最佳实践：
• 尽量避免使用 any 类型
• 合理使用类型推断
• 使用严格模式（strict: true）
• 为公共 API 编写类型定义
• 使用类型守卫确保类型安全`,
  type: 'TEXT',
  uploaderId: 2,
  uploaderName: '李四',
  uploaderAvatar: '',
  categoryId: 11,
  categoryName: 'React',
  tags: 'TypeScript,类型系统,前端开发,JavaScript',
  status: 1,
  createdAt: '2024-11-02T10:30:00Z',
  updatedAt: '2024-11-16T14:20:00Z',
};
