/**
 * Webpack 构建工具配置指南
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const webpackConfigKnowledge = {
  id: 13,
  shareCode: generateMockShareCode(13),
  title: 'Webpack 构建工具配置指南 - 从入门到优化',
  content: `# Webpack 构建工具配置指南 - 从入门到优化

## 🚀 引言

Webpack 是现代前端项目的核心构建工具，用于打包 JavaScript 应用程序。它将项目中的各种资源（JS、CSS、图片等）视为模块，通过依赖关系构建出优化的静态资源。

### Webpack 的优势

✅ **模块化管理** - 统一管理各类资源
✅ **代码分割** - 按需加载，提升性能
✅ **丰富的插件** - 强大的生态系统
✅ **开发体验** - 热更新、Source Map
✅ **生产优化** - 压缩、Tree Shaking

---

## 📚 核心概念

### 1. Entry（入口）

入口指示 Webpack 从哪个文件开始构建依赖图。

\`\`\`javascript
// 单入口
module.exports = {
  entry: './src/index.js'
};

// 多入口
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};

// 动态入口
module.exports = {
  entry: () => ({
    app: './src/app.js',
    vendor: ['react', 'react-dom']
  })
};
\`\`\`

### 2. Output（输出）

输出指示 Webpack 在哪里输出打包后的文件。

\`\`\`javascript
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    publicPath: '/',
    clean: true // 清理旧文件
  }
};
\`\`\`

### 3. Loader（加载器）

Loader 让 Webpack 能够处理非 JavaScript 文件。

\`\`\`javascript
module.exports = {
  module: {
    rules: [
      // Babel Loader - 转译 ES6+
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      
      // CSS Loader
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // Sass Loader
      {
        test: /\\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      
      // 图片资源
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      
      // 字体资源
      {
        test: /\\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  }
};
\`\`\`

### 4. Plugin（插件）

插件执行更广泛的任务，如打包优化、资源管理等。

\`\`\`javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    // 生成 HTML 文件
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    
    // 提取 CSS 到单独文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    
    // 清理输出目录
    new CleanWebpackPlugin(),
    
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    
    // 进度条
    new webpack.ProgressPlugin()
  ]
};
\`\`\`

### 5. Mode（模式）

模式告诉 Webpack 使用相应的内置优化。

\`\`\`javascript
module.exports = {
  // development - 开发模式
  mode: 'development',
  devtool: 'eval-source-map'
};

module.exports = {
  // production - 生产模式
  mode: 'production',
  devtool: 'source-map'
};
\`\`\`

---

## 🛠️ 开发环境配置

### DevServer 配置

\`\`\`javascript
module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    hot: true, // 热模块替换
    open: true, // 自动打开浏览器
    compress: true, // 启用 gzip 压缩
    historyApiFallback: true, // SPA 路由支持
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
\`\`\`

### Source Map 配置

\`\`\`javascript
// 开发环境 - 快速重建
module.exports = {
  devtool: 'eval-cheap-module-source-map'
};

// 生产环境 - 高质量
module.exports = {
  devtool: 'source-map'
};

// 不生成 Source Map
module.exports = {
  devtool: false
};
\`\`\`

---

## ⚡ 性能优化

### 1. 代码分割

\`\`\`javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 提取第三方库
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        },
        
        // 提取公共代码
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // 运行时代码单独打包
    runtimeChunk: {
      name: 'runtime'
    }
  }
};

// 动态导入
import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
  console.log(_.join(['Hello', 'webpack'], ' '));
});
\`\`\`

### 2. Tree Shaking

\`\`\`javascript
// package.json
{
  "sideEffects": false
}

// 或指定有副作用的文件
{
  "sideEffects": ["*.css", "*.scss"]
}

// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true
  }
};
\`\`\`

### 3. 压缩优化

\`\`\`javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩 JavaScript
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      
      // 压缩 CSS
      new CssMinimizerPlugin()
    ]
  }
};
\`\`\`

### 4. 缓存优化

\`\`\`javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  
  // 持久化缓存
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single'
  }
};
\`\`\`

### 5. 并行构建

\`\`\`javascript
// 使用 thread-loader
module.exports = {
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
};

// 使用 TerserPlugin 并行压缩
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
};
\`\`\`

---

## 🎯 实战配置

### 完整的生产环境配置

\`\`\`javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ],
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    },
    runtimeChunk: 'single'
  },
  
  cache: {
    type: 'filesystem'
  }
};
\`\`\`

---

## 📋 最佳实践

1. **区分环境配置**
   - 使用 webpack-merge 合并配置
   - 开发环境注重速度
   - 生产环境注重优化

2. **合理使用 Loader**
   - 使用 include/exclude 限制范围
   - 启用缓存加速构建

3. **优化构建速度**
   - 使用持久化缓存
   - 启用并行构建
   - 减少 resolve 范围

4. **优化输出体积**
   - 启用 Tree Shaking
   - 代码分割
   - 压缩资源

5. **提升用户体验**
   - 使用 contenthash 实现长期缓存
   - 预加载关键资源
   - 懒加载非关键资源

---

## 🎓 总结

Webpack 是前端工程化的核心工具，掌握它能够：

- 构建高效的开发环境
- 优化生产环境的性能
- 提升项目的可维护性

通过本指南，你应该已经了解了 Webpack 的核心概念和优化技巧。继续实践，你会发现 Webpack 的强大之处！

---

**参考资源：**
- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Webpack 性能优化指南](https://webpack.js.org/guides/build-performance/)`,
  type: 'TEXT' as const,
  uploaderId: 5,
  uploaderName: '钱七',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi',
  categoryId: 11,
  categoryName: 'React',
  tags: 'Webpack,构建工具,前端工程化,打包',
  status: 1,
  createdAt: '2025-12-13T11:00:00Z',
  updatedAt: '2026-01-05T15:30:00Z',
  contentHash: 'hash_webpack_config_guide',
};
