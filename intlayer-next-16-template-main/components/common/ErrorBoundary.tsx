'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

/**
 * 错误边界组件 - Error Boundary Component
 * 
 * 捕获子组件树中的 JavaScript 错误，显示优雅的错误界面
 * 符合 Apple/Google 设计规范，支持无障碍访问
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // 生成简短的错误ID用于追踪
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 生产环境可以上报错误到监控服务
    console.error('[ErrorBoundary]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误界面
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          {/* 装饰背景 */}
          <div className="error-boundary-decoration error-boundary-decoration-1" aria-hidden="true" />
          <div className="error-boundary-decoration error-boundary-decoration-2" aria-hidden="true" />

          {/* 图标 */}
          <div className="error-boundary-icon-wrapper">
            <div className="error-boundary-icon-bg" aria-hidden="true" />
            <div className="error-boundary-icon">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" strokeLinecap="round" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* 内容 */}
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">
              哎呀，出了点问题
            </h1>
            <p className="error-boundary-subtitle">
              别担心，这不是你的错
            </p>
            <p className="error-boundary-message">
              页面遇到了一些技术问题，我们正在努力修复。请尝试刷新页面或返回首页。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="error-boundary-actions">
            <button
              type="button"
              onClick={this.handleRefresh}
              className="error-boundary-btn error-boundary-btn-primary"
              aria-label="刷新当前页面"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              刷新页面
            </button>
            <Link
              href="/"
              className="error-boundary-btn error-boundary-btn-secondary"
              aria-label="返回网站首页"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              返回首页
            </Link>
          </div>

          {/* 错误代码 */}
          {this.state.errorId && (
            <div className="error-boundary-code" aria-label="错误追踪代码">
              错误代码: {this.state.errorId}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
