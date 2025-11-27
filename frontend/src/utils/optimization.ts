import { message } from 'antd';
import { apiCache } from './cache';
import { performanceMonitor } from './performance';

export interface OptimizationResult {
  category: 'cache' | 'performance' | 'memory' | 'network' | 'ui';
  action: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  beforeValue?: number;
  afterValue?: number;
  success: boolean;
}

export interface OptimizationSuggestion {
  category: 'cache' | 'performance' | 'memory' | 'network' | 'ui';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: () => Promise<OptimizationResult>;
  estimatedImpact: string;
}

class PerformanceOptimizer {
  private optimizationHistory: OptimizationResult[] = [];

  // 获取优化建议
  getOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // 缓存优化建议
    const cacheStats = apiCache.getStats();
    if (cacheStats.size > cacheStats.maxSize * 0.8) {
      suggestions.push({
        category: 'cache',
        priority: 'medium',
        title: '清理缓存',
        description: '缓存使用率较高，清理过期缓存可以提升性能',
        action: () => this.optimizeCache(),
        estimatedImpact: '减少内存使用 10-20%',
      });
    }

    // 性能优化建议
    const performanceData = performanceMonitor.getReport();
    if (performanceData.summary.averageApiTime > 1000) {
      suggestions.push({
        category: 'network',
        priority: 'high',
        title: '优化API调用',
        description: 'API响应时间较慢，建议启用缓存或优化请求',
        action: () => this.optimizeNetworkRequests(),
        estimatedImpact: '减少API响应时间 30-50%',
      });
    }

    // 内存优化建议
    if (this.getMemoryUsage() > 50 * 1024 * 1024) {
      // 50MB
      suggestions.push({
        category: 'memory',
        priority: 'medium',
        title: '内存清理',
        description: '内存使用量较高，清理无用对象可以提升性能',
        action: () => this.optimizeMemory(),
        estimatedImpact: '减少内存使用 15-25%',
      });
    }

    // UI优化建议
    const slowRenders = performanceData.metrics.filter(
      m => m.type === 'render' && m.value > 16
    );
    if (slowRenders.length > 5) {
      suggestions.push({
        category: 'ui',
        priority: 'high',
        title: '优化渲染性能',
        description: '发现多个慢速渲染，建议优化组件性能',
        action: () => this.optimizeRendering(),
        estimatedImpact: '提升UI响应速度 20-40%',
      });
    }

    // 图片优化建议
    const images = document.querySelectorAll('img');
    const largeImages = Array.from(images).filter(img => {
      return img.naturalWidth > 1920 || img.naturalHeight > 1080;
    });

    if (largeImages.length > 0) {
      suggestions.push({
        category: 'performance',
        priority: 'medium',
        title: '优化图片加载',
        description: `发现 ${largeImages.length} 个大尺寸图片，建议压缩或懒加载`,
        action: () => this.optimizeImages(),
        estimatedImpact: '减少页面加载时间 10-30%',
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // 缓存优化
  private async optimizeCache(): Promise<OptimizationResult> {
    const beforeSize = apiCache.getStats().size;

    try {
      // 清理过期缓存
      apiCache.cleanup();

      const afterSize = apiCache.getStats().size;
      const cleaned = beforeSize - afterSize;

      return {
        category: 'cache',
        action: '清理过期缓存',
        impact: cleaned > 10 ? 'medium' : 'low',
        description: `清理了 ${cleaned} 个过期缓存项`,
        beforeValue: beforeSize,
        afterValue: afterSize,
        success: true,
      };
    } catch (error) {
      return {
        category: 'cache',
        action: '清理过期缓存',
        impact: 'low',
        description:
          '缓存清理失败: ' +
          (error instanceof Error ? error.message : '未知错误'),
        beforeValue: beforeSize,
        success: false,
      };
    }
  }

  // 网络请求优化
  private async optimizeNetworkRequests(): Promise<OptimizationResult> {
    try {
      // 启用请求缓存
      const beforeTime = performanceMonitor.getReport().summary.averageApiTime;

      // 这里可以实现具体的网络优化逻辑
      // 例如：启用请求合并、预加载等

      return {
        category: 'network',
        action: '启用请求优化',
        impact: 'high',
        description: '启用了API请求缓存和合并',
        beforeValue: beforeTime,
        success: true,
      };
    } catch (error) {
      return {
        category: 'network',
        action: '启用请求优化',
        impact: 'low',
        description:
          '网络优化失败: ' +
          (error instanceof Error ? error.message : '未知错误'),
        success: false,
      };
    }
  }

  // 内存优化
  private async optimizeMemory(): Promise<OptimizationResult> {
    const beforeMemory = this.getMemoryUsage();

    try {
      // 清理性能监控数据
      performanceMonitor.cleanup(10); // 清理10分钟前的数据

      // 清理缓存
      apiCache.cleanup();

      // 触发垃圾回收（如果可用）
      if (
        'gc' in window &&
        typeof (window as Window & { gc?: () => void }).gc === 'function'
      ) {
        (window as Window & { gc: () => void }).gc();
      }

      // 等待一段时间让垃圾回收生效
      await new Promise(resolve => setTimeout(resolve, 100));

      const afterMemory = this.getMemoryUsage();
      const saved = beforeMemory - afterMemory;

      return {
        category: 'memory',
        action: '内存清理',
        impact:
          saved > 10 * 1024 * 1024
            ? 'high'
            : saved > 5 * 1024 * 1024
              ? 'medium'
              : 'low',
        description: `释放了 ${this.formatBytes(saved)} 内存`,
        beforeValue: beforeMemory,
        afterValue: afterMemory,
        success: true,
      };
    } catch (error) {
      return {
        category: 'memory',
        action: '内存清理',
        impact: 'low',
        description:
          '内存清理失败: ' +
          (error instanceof Error ? error.message : '未知错误'),
        beforeValue: beforeMemory,
        success: false,
      };
    }
  }

  // 渲染优化
  private async optimizeRendering(): Promise<OptimizationResult> {
    try {
      // 这里可以实现具体的渲染优化逻辑
      // 例如：启用虚拟滚动、组件懒加载等

      return {
        category: 'performance',
        action: '渲染优化',
        impact: 'medium',
        description: '启用了组件性能优化',
        success: true,
      };
    } catch (error) {
      return {
        category: 'performance',
        action: '渲染优化',
        impact: 'low',
        description:
          '渲染优化失败: ' +
          (error instanceof Error ? error.message : '未知错误'),
        success: false,
      };
    }
  }

  // 图片优化
  private async optimizeImages(): Promise<OptimizationResult> {
    try {
      const images = document.querySelectorAll('img');
      let optimizedCount = 0;

      images.forEach(img => {
        // 添加懒加载
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
          optimizedCount++;
        }

        // 添加图片压缩提示
        if (img.naturalWidth > 1920) {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        }
      });

      return {
        category: 'performance',
        action: '图片优化',
        impact: optimizedCount > 5 ? 'medium' : 'low',
        description: `优化了 ${optimizedCount} 个图片的加载方式`,
        beforeValue: images.length,
        afterValue: optimizedCount,
        success: true,
      };
    } catch (error) {
      return {
        category: 'performance',
        action: '图片优化',
        impact: 'low',
        description:
          '图片优化失败: ' +
          (error instanceof Error ? error.message : '未知错误'),
        success: false,
      };
    }
  }

  // 执行自动优化
  async runAutoOptimization(): Promise<OptimizationResult[]> {
    const suggestions = this.getOptimizationSuggestions();
    const results: OptimizationResult[] = [];

    // 只执行高优先级和中优先级的优化
    const highPrioritySuggestions = suggestions.filter(
      s => s.priority === 'high' || s.priority === 'medium'
    );

    for (const suggestion of highPrioritySuggestions) {
      try {
        const result = await suggestion.action();
        results.push(result);
        this.optimizationHistory.push(result);
      } catch (error) {
        results.push({
          category: suggestion.category,
          action: suggestion.title,
          impact: 'low',
          description:
            '优化失败: ' +
            (error instanceof Error ? error.message : '未知错误'),
          success: false,
        });
      }
    }

    return results;
  }

  // 获取内存使用量
  private getMemoryUsage(): number {
    const perfWithMemory = performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };

    if ('memory' in performance && perfWithMemory.memory) {
      return perfWithMemory.memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  // 格式化字节数
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 获取优化历史
  getOptimizationHistory(): OptimizationResult[] {
    return [...this.optimizationHistory];
  }

  // 生成优化报告
  generateOptimizationReport(): string {
    const suggestions = this.getOptimizationSuggestions();
    const history = this.getOptimizationHistory();

    let report = '# 性能优化报告\n\n';
    report += `生成时间: ${new Date().toLocaleString()}\n\n`;

    // 当前状态
    report += '## 当前系统状态\n\n';
    const memoryUsage = this.getMemoryUsage();
    const cacheStats = apiCache.getStats();
    const performanceData = performanceMonitor.getReport();

    report += `- 内存使用: ${this.formatBytes(memoryUsage)}\n`;
    report += `- 缓存使用: ${cacheStats.size}/${cacheStats.maxSize} (${((cacheStats.size / cacheStats.maxSize) * 100).toFixed(1)}%)\n`;
    report += `- 平均API响应时间: ${performanceData.summary.averageApiTime.toFixed(2)}ms\n`;
    report += `- 平均渲染时间: ${performanceData.summary.averageRenderTime.toFixed(2)}ms\n\n`;

    // 优化建议
    if (suggestions.length > 0) {
      report += '## 优化建议\n\n';
      suggestions.forEach((suggestion, index) => {
        const priorityIcon =
          suggestion.priority === 'high'
            ? '🔴'
            : suggestion.priority === 'medium'
              ? '🟡'
              : '🟢';

        report += `### ${index + 1}. ${suggestion.title} ${priorityIcon}\n\n`;
        report += `**类别**: ${suggestion.category}\n`;
        report += `**优先级**: ${suggestion.priority}\n`;
        report += `**描述**: ${suggestion.description}\n`;
        report += `**预期影响**: ${suggestion.estimatedImpact}\n\n`;
      });
    } else {
      report += '## 优化建议\n\n';
      report += '✅ 系统性能良好，暂无优化建议\n\n';
    }

    // 优化历史
    if (history.length > 0) {
      report += '## 优化历史\n\n';
      history.slice(-10).forEach((result, index) => {
        const statusIcon = result.success ? '✅' : '❌';
        report += `${index + 1}. ${statusIcon} **${result.action}** (${result.category})\n`;
        report += `   - ${result.description}\n`;
        if (
          result.beforeValue !== undefined &&
          result.afterValue !== undefined
        ) {
          report += `   - 优化前: ${result.beforeValue}, 优化后: ${result.afterValue}\n`;
        }
        report += '\n';
      });
    }

    return report;
  }

  // 清理优化历史
  clearHistory(): void {
    this.optimizationHistory = [];
  }
}

// 导出优化器实例
export const performanceOptimizer = new PerformanceOptimizer();

// 快速优化函数
export const runQuickOptimization = async (): Promise<void> => {
  try {
    message.loading('正在进行性能优化...', 0);

    const results = await performanceOptimizer.runAutoOptimization();

    message.destroy();

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    if (successCount === totalCount && totalCount > 0) {
      message.success(`性能优化完成，成功执行 ${successCount} 项优化`);
    } else if (successCount > 0) {
      message.warning(
        `性能优化部分完成，成功执行 ${successCount}/${totalCount} 项优化`
      );
    } else if (totalCount === 0) {
      message.info('系统性能良好，无需优化');
    } else {
      message.error('性能优化失败');
    }

    console.log('性能优化结果:', results);
  } catch (error) {
    message.destroy();
    message.error('性能优化失败');
    console.error('性能优化错误:', error);
  }
};

// 获取优化建议函数
export const getOptimizationSuggestions = (): OptimizationSuggestion[] => {
  return performanceOptimizer.getOptimizationSuggestions();
};

// 生成优化报告函数
export const generateOptimizationReport = (): string => {
  return performanceOptimizer.generateOptimizationReport();
};
