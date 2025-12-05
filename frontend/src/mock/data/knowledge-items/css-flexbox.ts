/**
 * CSS Flexbox 布局完全指南
 */

export const cssFlexboxKnowledge = {
  id: 11,
  title: 'CSS Flexbox 布局完全指南',
  content: `Flexbox 是 CSS3 引入的强大布局模式，使得创建灵活的响应式布局变得简单。

基本概念：

1. Flex 容器（Flex Container）
设置 display: flex 或 display: inline-flex 的元素。

2. Flex 项目（Flex Items）
Flex 容器的直接子元素。

3. 主轴（Main Axis）
Flex 项目排列的方向。

4. 交叉轴（Cross Axis）
垂直于主轴的方向。

容器属性：

1. flex-direction
设置主轴方向：
• row - 水平方向（默认）
• row-reverse - 水平反向
• column - 垂直方向
• column-reverse - 垂直反向

2. flex-wrap
设置是否换行：
• nowrap - 不换行（默认）
• wrap - 换行
• wrap-reverse - 反向换行

3. justify-content
主轴对齐方式：
• flex-start - 起点对齐
• flex-end - 终点对齐
• center - 居中对齐
• space-between - 两端对齐
• space-around - 分散对齐
• space-evenly - 均匀分布

4. align-items
交叉轴对齐方式：
• flex-start - 起点对齐
• flex-end - 终点对齐
• center - 居中对齐
• baseline - 基线对齐
• stretch - 拉伸填充（默认）

5. align-content
多行对齐方式（仅在多行时有效）。

项目属性：

1. flex-grow
放大比例，默认为 0。

2. flex-shrink
缩小比例，默认为 1。

3. flex-basis
项目占据的主轴空间，默认为 auto。

4. flex
flex-grow、flex-shrink 和 flex-basis 的简写。

5. align-self
单个项目的对齐方式，可覆盖 align-items。

6. order
项目的排列顺序，数值越小越靠前。

常见布局：

1. 水平居中
justify-content: center

2. 垂直居中
align-items: center

3. 完全居中
justify-content: center + align-items: center

4. 两端对齐
justify-content: space-between

5. 等分布局
flex: 1

最佳实践：
• 优先使用 Flexbox 处理一维布局
• 结合 Grid 处理二维布局
• 注意浏览器兼容性
• 使用简写属性简化代码`,
  type: 'TEXT',
  uploaderId: 1,
  uploaderName: '张三',
  uploaderAvatar: '',
  categoryId: 11,
  categoryName: 'React',
  tags: 'CSS,Flexbox,布局,前端开发',
  status: 1,
  createdAt: '2024-11-12T09:15:00Z',
  updatedAt: '2024-11-25T16:20:00Z',
};
