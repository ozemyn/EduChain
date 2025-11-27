// 性能监控工具
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'api' | 'render' | 'navigation' | 'resource';
  details?: Record<string, unknown>;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalMetrics: number;
    averageApiTime: number;
    averageRenderTime: number;
    slowestApi: PerformanceMetric | null;
    slowestRender: PerformanceMetric | null;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupPerformanceObservers();
  }

  // 设置性能观察器
  private setupPerformanceObservers(): void {
    // 观察导航性能
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.addMetric({
                name: 'page_load',
                value: navEntry.loadEventEnd - navEntry.fetchStart,
                timestamp: Date.now(),
                type: 'navigation',
                details: {
                  domContentLoaded:
                    navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
                  firstPaint: navEntry.responseEnd - navEntry.fetchStart,
                },
              });
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Navigation performance observer not supported:', error);
      }

      // 观察资源加载性能
      try {
        const resourceObserver = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              // 只记录较慢的资源加载
              if (resourceEntry.duration > 100) {
                this.addMetric({
                  name: `resource_load_${resourceEntry.name.split('/').pop()}`,
                  value: resourceEntry.duration,
                  timestamp: Date.now(),
                  type: 'resource',
                  details: {
                    url: resourceEntry.name,
                    size: resourceEntry.transferSize,
                  },
                });
              }
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource performance observer not supported:', error);
      }
    }
  }

  // 添加性能指标
  addMetric(metric: PerformanceMetric): void {
    if (this.metrics.length >= this.maxMetrics) {
      // 移除最旧的指标
      this.metrics.shift();
    }

    this.metrics.push(metric);
  }

  // 测量API调用性能
  measureApiCall<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now();

    return apiCall()
      .then(result => {
        const endTime = performance.now();
        this.addMetric({
          name: `api_${apiName}`,
          value: endTime - startTime,
          timestamp: Date.now(),
          type: 'api',
          details: {
            success: true,
          },
        });
        return result;
      })
      .catch(error => {
        const endTime = performance.now();
        this.addMetric({
          name: `api_${apiName}`,
          value: endTime - startTime,
          timestamp: Date.now(),
          type: 'api',
          details: {
            success: false,
            error: error.message,
          },
        });
        throw error;
      });
  }

  // 测量组件渲染性能
  measureRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();

    this.addMetric({
      name: `render_${componentName}`,
      value: endTime - startTime,
      timestamp: Date.now(),
      type: 'render',
    });
  }

  // 获取性能报告
  getReport(): PerformanceReport {
    const apiMetrics = this.metrics.filter(m => m.type === 'api');
    const renderMetrics = this.metrics.filter(m => m.type === 'render');

    const averageApiTime =
      apiMetrics.length > 0
        ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
        : 0;

    const averageRenderTime =
      renderMetrics.length > 0
        ? renderMetrics.reduce((sum, m) => sum + m.value, 0) /
          renderMetrics.length
        : 0;

    const slowestApi =
      apiMetrics.length > 0
        ? apiMetrics.reduce((slowest, current) =>
            current.value > slowest.value ? current : slowest
          )
        : null;

    const slowestRender =
      renderMetrics.length > 0
        ? renderMetrics.reduce((slowest, current) =>
            current.value > slowest.value ? current : slowest
          )
        : null;

    return {
      metrics: [...this.metrics],
      summary: {
        totalMetrics: this.metrics.length,
        averageApiTime,
        averageRenderTime,
        slowestApi,
        slowestRender,
      },
    };
  }

  // 获取最近的性能指标
  getRecentMetrics(minutes: number = 5): PerformanceMetric[] {
    const cutoffTime = Date.now() - minutes * 60 * 1000;
    return this.metrics.filter(m => m.timestamp > cutoffTime);
  }

  // 获取特定类型的指标
  getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
    return this.metrics.filter(m => m.type === type);
  }

  // 清理旧指标
  cleanup(olderThanMinutes: number = 60): void {
    const cutoffTime = Date.now() - olderThanMinutes * 60 * 1000;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoffTime);
  }

  // 导出性能数据
  exportData(): string {
    return JSON.stringify(this.getReport(), null, 2);
  }

  // 检查性能问题
  checkPerformanceIssues(): {
    slowApis: PerformanceMetric[];
    slowRenders: PerformanceMetric[];
    recommendations: string[];
  } {
    const slowApis = this.metrics
      .filter(m => m.type === 'api' && m.value > 2000) // 超过2秒的API调用
      .sort((a, b) => b.value - a.value);

    const slowRenders = this.metrics
      .filter(m => m.type === 'render' && m.value > 16) // 超过16ms的渲染
      .sort((a, b) => b.value - a.value);

    const recommendations: string[] = [];

    if (slowApis.length > 0) {
      recommendations.push(
        `发现 ${slowApis.length} 个慢速API调用，建议优化网络请求或添加缓存`
      );
    }

    if (slowRenders.length > 0) {
      recommendations.push(
        `发现 ${slowRenders.length} 个慢速渲染，建议优化组件性能`
      );
    }

    const apiMetrics = this.getMetricsByType('api');
    if (apiMetrics.length > 0) {
      const averageApiTime =
        apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length;
      if (averageApiTime > 1000) {
        recommendations.push(
          '平均API响应时间较慢，建议检查网络连接或服务器性能'
        );
      }
    }

    return {
      slowApis,
      slowRenders,
      recommendations,
    };
  }

  // 销毁监控器
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 便捷的性能测量装饰器
export const withPerformanceTracking = <
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    return performanceMonitor.measureApiCall(name, () => fn(...args));
  }) as T;
};

// React Hook for performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const trackRender = React.useCallback(() => {
    performanceMonitor.measureRender(componentName, () => {});
  }, [componentName]);

  React.useEffect(() => {
    trackRender();
  });

  return { trackRender };
};

// 性能监控报告组件数据
export const getPerformanceDashboardData = () => {
  const report = performanceMonitor.getReport();
  const issues = performanceMonitor.checkPerformanceIssues();
  const recentMetrics = performanceMonitor.getRecentMetrics(10);

  return {
    report,
    issues,
    recentMetrics,
    chartData: {
      apiTimes: report.metrics
        .filter(m => m.type === 'api')
        .slice(-20)
        .map(m => ({
          name: m.name,
          time: m.value,
          timestamp: new Date(m.timestamp).toLocaleTimeString(),
        })),
      renderTimes: report.metrics
        .filter(m => m.type === 'render')
        .slice(-20)
        .map(m => ({
          name: m.name,
          time: m.value,
          timestamp: new Date(m.timestamp).toLocaleTimeString(),
        })),
    },
  };
};

// 导入React用于Hook
import React from 'react';
