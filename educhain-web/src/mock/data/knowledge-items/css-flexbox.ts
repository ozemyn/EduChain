/**
 * CSS Flexbox 布局完全指南
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const cssFlexboxKnowledge = {
  id: 11,
  shareCode: generateMockShareCode(11),
  title: 'CSS Flexbox 布局完全指南 - 现代化布局方案',
  content: `# CSS Flexbox 布局完全指南 - 现代化布局方案

## 🎨 引言

Flexbox 是 CSS3 引入的强大布局模式，使得创建灵活的响应式布局变得简单。它解决了传统布局方式的诸多痛点，是现代 Web 开发的必备技能。

### Flexbox 的优势

✅ **灵活性强** - 轻松实现各种布局
✅ **响应式友好** - 自适应不同屏幕尺寸
✅ **对齐简单** - 轻松实现居中对齐
✅ **浏览器支持好** - 现代浏览器全面支持

---

## 📚 基本概念

### 1. Flex 容器和项目

\`\`\`css
/* Flex 容器 */
.container {
  display: flex; /* 或 inline-flex */
}

/* Flex 项目 */
.item {
  /* 容器的直接子元素自动成为 flex 项目 */
}
\`\`\`

### 2. 主轴和交叉轴

- **主轴（Main Axis）**：Flex 项目排列的方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向

---

## 🎯 容器属性

### 1. flex-direction

设置主轴方向。

\`\`\`css
.container {
  flex-direction: row; /* 默认，水平方向 */
  flex-direction: row-reverse; /* 水平反向 */
  flex-direction: column; /* 垂直方向 */
  flex-direction: column-reverse; /* 垂直反向 */
}
\`\`\`

### 2. flex-wrap

设置是否换行。

\`\`\`css
.container {
  flex-wrap: nowrap; /* 默认，不换行 */
  flex-wrap: wrap; /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}
\`\`\`

### 3. flex-flow

flex-direction 和 flex-wrap 的简写。

\`\`\`css
.container {
  flex-flow: row wrap;
}
\`\`\`

### 4. justify-content

主轴对齐方式。

\`\`\`css
.container {
  justify-content: flex-start; /* 起点对齐（默认） */
  justify-content: flex-end; /* 终点对齐 */
  justify-content: center; /* 居中对齐 */
  justify-content: space-between; /* 两端对齐，项目之间间隔相等 */
  justify-content: space-around; /* 每个项目两侧间隔相等 */
  justify-content: space-evenly; /* 项目和容器边缘间隔相等 */
}
\`\`\`

### 5. align-items

交叉轴对齐方式。

\`\`\`css
.container {
  align-items: stretch; /* 拉伸填充（默认） */
  align-items: flex-start; /* 起点对齐 */
  align-items: flex-end; /* 终点对齐 */
  align-items: center; /* 居中对齐 */
  align-items: baseline; /* 基线对齐 */
}
\`\`\`

### 6. align-content

多行对齐方式（仅在多行时有效）。

\`\`\`css
.container {
  align-content: stretch; /* 拉伸填充（默认） */
  align-content: flex-start; /* 起点对齐 */
  align-content: flex-end; /* 终点对齐 */
  align-content: center; /* 居中对齐 */
  align-content: space-between; /* 两端对齐 */
  align-content: space-around; /* 分散对齐 */
}
\`\`\`

---

## 🔧 项目属性

### 1. order

项目的排列顺序，数值越小越靠前。

\`\`\`css
.item {
  order: 0; /* 默认 */
  order: 1;
  order: -1;
}
\`\`\`

### 2. flex-grow

放大比例，默认为 0（不放大）。

\`\`\`css
.item {
  flex-grow: 0; /* 默认 */
  flex-grow: 1; /* 等比例放大 */
  flex-grow: 2; /* 放大比例为其他项目的 2 倍 */
}
\`\`\`

### 3. flex-shrink

缩小比例，默认为 1（空间不足时缩小）。

\`\`\`css
.item {
  flex-shrink: 1; /* 默认 */
  flex-shrink: 0; /* 不缩小 */
  flex-shrink: 2; /* 缩小比例为其他项目的 2 倍 */
}
\`\`\`

### 4. flex-basis

项目占据的主轴空间，默认为 auto。

\`\`\`css
.item {
  flex-basis: auto; /* 默认 */
  flex-basis: 200px; /* 固定宽度 */
  flex-basis: 50%; /* 百分比 */
}
\`\`\`

### 5. flex

flex-grow、flex-shrink 和 flex-basis 的简写。

\`\`\`css
.item {
  flex: 0 1 auto; /* 默认 */
  flex: 1; /* 等同于 flex: 1 1 0% */
  flex: auto; /* 等同于 flex: 1 1 auto */
  flex: none; /* 等同于 flex: 0 0 auto */
}
\`\`\`

### 6. align-self

单个项目的对齐方式，可覆盖 align-items。

\`\`\`css
.item {
  align-self: auto; /* 默认，继承父元素的 align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
\`\`\`

---

## 🛠️ 常见布局

### 1. 水平居中

\`\`\`css
.container {
  display: flex;
  justify-content: center;
}
\`\`\`

### 2. 垂直居中

\`\`\`css
.container {
  display: flex;
  align-items: center;
}
\`\`\`

### 3. 完全居中

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

### 4. 两端对齐

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
}
\`\`\`

### 5. 等分布局

\`\`\`css
.container {
  display: flex;
}

.item {
  flex: 1;
}
\`\`\`

### 6. 圣杯布局

\`\`\`css
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header, .footer {
  flex: 0 0 auto;
}

.main {
  display: flex;
  flex: 1;
}

.sidebar {
  flex: 0 0 200px;
}

.content {
  flex: 1;
}
\`\`\`

### 7. 响应式导航

\`\`\`css
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.nav-item {
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
  
  .nav-item {
    flex: 1 1 100%;
  }
}
\`\`\`

---

## 📋 最佳实践

1. **优先使用 Flexbox 处理一维布局**
   - 水平或垂直方向的布局
   - 导航栏、工具栏等

2. **结合 Grid 处理二维布局**
   - 同时需要行和列的布局
   - 复杂的页面布局

3. **注意浏览器兼容性**
   - 使用 Autoprefixer 自动添加前缀
   - 测试旧版浏览器

4. **使用简写属性**
   - flex 代替 flex-grow、flex-shrink、flex-basis
   - flex-flow 代替 flex-direction、flex-wrap

5. **避免过度嵌套**
   - 保持 DOM 结构简洁
   - 合理使用 Flexbox 和其他布局方式

---

## 🎓 总结

Flexbox 是现代 CSS 布局的核心技术，掌握它能够让你轻松实现各种复杂布局。通过本指南，你应该已经了解了：

- Flexbox 的基本概念和术语
- 容器和项目的所有属性
- 常见布局的实现方法
- 最佳实践和注意事项

继续实践，你会发现 Flexbox 让布局变得简单高效！

---

**参考资源：**
- [CSS Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [MDN - Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [Flexbox Froggy](https://flexboxfroggy.com/) - 游戏学习 Flexbox`,
  type: 'TEXT' as const,
  uploaderId: 2,
  uploaderName: '张三',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan2',
  categoryId: 11,
  categoryName: 'React',
  tags: 'CSS,Flexbox,布局,前端开发',
  status: 1,
  createdAt: '2025-12-11T10:45:00Z',
  updatedAt: '2025-12-29T16:20:00Z',
  contentHash: 'hash_css_flexbox_guide',
};
