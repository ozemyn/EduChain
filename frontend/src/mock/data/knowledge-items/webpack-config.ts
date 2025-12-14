/**
 * Webpack 构建工具配置指南
 */

import { generateMockShareCode } from '../../utils/shareCodeGenerator';

export const webpackConfigKnowledge = {
  id: 13,
  shareCode: generateMockShareCode(13),
  title: 'Webpack 构建工具配置指南',
  content: `Webpack 是现代前端项目的核心构建工具，用于打包 JavaScript 应用程序。

核心概念：

1. Entry（入口）
指示 Webpack 从哪个文件开始构建依赖图。

2. Output（输出）
指示 Webpack 在哪里输出打包后的文件。

3. Loader（加载器）
让 Webpack 能够处理非 JavaScript 文件。

4. Plugin（插件）
执行更广泛的任务，如打包优化、资源管理等。

5. Mode（模式）
• development - 开发模式
• production - 生产模式
• none - 不使用任何默认优化

常用 Loader：

1. babel-loader
转译 ES6+ 代码。

2. css-loader
处理 CSS 文件。

3. style-loader
将 CSS 注入到 DOM。

4. sass-loader
处理 Sass/SCSS 文件。

5. file-loader
处理文件资源。

6. url-loader
将小文件转为 Data URL。

常用 Plugin：

1. HtmlWebpackPlugin
生成 HTML 文件。

2. MiniCssExtractPlugin
提取 CSS 到单独文件。

3. CleanWebpackPlugin
清理输出目录。

4. DefinePlugin
定义环境变量。

5. CopyWebpackPlugin
复制文件到输出目录。

性能优化：

1. 代码分割
• 入口分割
• 动态导入
• SplitChunksPlugin

2. Tree Shaking
移除未使用的代码。

3. 压缩
• TerserPlugin - 压缩 JS
• CssMinimizerPlugin - 压缩 CSS

4. 缓存
• 使用 contenthash
• 持久化缓存

5. 并行构建
• thread-loader
• parallel-webpack

开发体验：

1. DevServer
• 热模块替换（HMR）
• 代理配置
• 自动刷新

2. Source Map
方便调试，映射到源代码。

3. 模块热替换
无需刷新页面即可更新模块。

最佳实践：
• 区分开发和生产配置
• 使用 Tree Shaking
• 合理配置代码分割
• 优化构建速度
• 使用缓存
• 分析打包结果`,
  type: 'TEXT',
  uploaderId: 5,
  uploaderName: '钱七',
  uploaderAvatar: '',
  categoryId: 11,
  categoryName: 'React',
  tags: 'Webpack,构建工具,前端工程化,打包',
  status: 1,
  createdAt: '2024-11-14T11:00:00Z',
  updatedAt: '2024-11-27T15:30:00Z',
  contentHash: 'hash_webpack_config_guide',
};
