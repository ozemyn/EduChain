import React from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeContext } from '@contexts/ThemeProvider';

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large';
  variant?: 'button' | 'glass' | 'minimal';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'middle',
  variant = 'glass',
  showLabel = false,
  className = '',
}) => {
  const { resolvedTheme, toggleTheme } = useThemeContext();

  // 快速切换处理
  const handleToggle = () => {
    // 立即切换，无延迟
    toggleTheme();
  };

  // 获取图标 - 简化逻辑
  const getIcon = () => {
    return resolvedTheme === 'dark' ? <MoonOutlined /> : <SunOutlined />;
  };

  // 获取标签文本 - 简化逻辑
  const getLabel = () => {
    return resolvedTheme === 'dark' ? '深色模式' : '浅色模式';
  };

  // 渲染不同变体
  const renderButton = () => {
    const baseClasses = `theme-toggle ${className}`;

    switch (variant) {
      case 'glass':
        return (
          <button
            onClick={handleToggle}
            className={`${baseClasses} glass-button hover-scale active-scale`}
            title={`切换到${resolvedTheme === 'light' ? '深色' : '浅色'}模式`}
            aria-label="切换主题"
          >
            <span className="theme-toggle-icon animate-fade-in">
              {getIcon()}
            </span>
            {showLabel && (
              <span className="theme-toggle-label">{getLabel()}</span>
            )}
          </button>
        );

      case 'minimal':
        return (
          <button
            onClick={handleToggle}
            className={`${baseClasses} theme-toggle-minimal hover-scale active-scale`}
            title={`切换到${resolvedTheme === 'light' ? '深色' : '浅色'}模式`}
            aria-label="切换主题"
          >
            <span className="theme-toggle-icon animate-fade-in">
              {getIcon()}
            </span>
            {showLabel && (
              <span className="theme-toggle-label">{getLabel()}</span>
            )}
          </button>
        );

      case 'button':
      default:
        return (
          <Button
            onClick={handleToggle}
            icon={getIcon()}
            size={size}
            className={`${baseClasses} hover-scale active-scale`}
            title={`切换到${resolvedTheme === 'light' ? '深色' : '浅色'}模式`}
            aria-label="切换主题"
          >
            {showLabel && getLabel()}
          </Button>
        );
    }
  };

  return (
    <div className="theme-toggle-wrapper">
      {renderButton()}
      <style>{`
        .theme-toggle-wrapper {
          display: inline-flex;
          align-items: center;
        }

        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .theme-toggle-minimal {
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          background: var(--hover-overlay);
          backdrop-filter: var(--blur-xs);
          -webkit-backdrop-filter: var(--blur-xs);
        }

        .theme-toggle-minimal:hover {
          background: var(--active-overlay);
        }

        .theme-toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          transition: transform var(--transition-fast) var(--ease-spring-ios);
        }

        .theme-toggle:hover .theme-toggle-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .theme-toggle-label {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
          .theme-toggle-label {
            display: none;
          }
        }

        /* 焦点样式 */
        .theme-toggle:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 2px;
        }

        /* 深色模式图标动画 */
        .theme-toggle[data-theme="dark"] .theme-toggle-icon {
          animation: moonGlow 2s ease-in-out infinite alternate;
        }

        @keyframes moonGlow {
          from {
            filter: drop-shadow(0 0 5px var(--accent-primary));
          }
          to {
            filter: drop-shadow(0 0 15px var(--accent-primary));
          }
        }

        /* 浅色模式图标动画 */
        .theme-toggle[data-theme="light"] .theme-toggle-icon {
          animation: sunRays 3s ease-in-out infinite;
        }

        @keyframes sunRays {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        /* 减少动画偏好 */
        @media (prefers-reduced-motion: reduce) {
          .theme-toggle-icon,
          .theme-toggle[data-theme="dark"] .theme-toggle-icon,
          .theme-toggle[data-theme="light"] .theme-toggle-icon {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;
