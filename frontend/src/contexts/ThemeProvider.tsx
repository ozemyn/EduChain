import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme, ResolvedTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 全局主题提供者组件
 * 为整个应用提供主题管理功能
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  } = useTheme();

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题上下文的 Hook
 * 必须在 ThemeProvider 内部使用
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * 主题感知组件的高阶组件
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ThemeContextType }>
) {
  const WrappedComponent = (props: P) => {
    const theme = useThemeContext();
    return <Component {...props} theme={theme} />;
  };
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * 主题切换按钮组件
 */
export const ThemeToggleButton: React.FC<{
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'text' | 'both';
  className?: string;
}> = ({ size = 'medium', variant = 'icon', className = '' }) => {
  const { toggleTheme, isDark, isSystem } = useThemeContext();
  
  const getIcon = () => {
    if (isSystem) {
      return isDark ? '🌙' : '☀️';
    }
    return isDark ? '🌙' : '☀️';
  };
  
  const getText = () => {
    if (isSystem) {
      return `自动 (${isDark ? '深色' : '浅色'})`;
    }
    return isDark ? '深色模式' : '浅色模式';
  };
  
  const sizeClasses = {
    small: 'text-sm p-1',
    medium: 'text-base p-2',
    large: 'text-lg p-3',
  };
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        glass-button hover-scale active-scale
        ${sizeClasses[size]}
        ${className}
      `}
      title={`当前: ${getText()}, 点击切换`}
      aria-label="切换主题"
    >
      {(variant === 'icon' || variant === 'both') && (
        <span className="theme-icon animate-fade-in">
          {getIcon()}
        </span>
      )}
      {(variant === 'text' || variant === 'both') && (
        <span className="theme-text">
          {getText()}
        </span>
      )}
    </button>
  );
};

/**
 * 主题感知的条件渲染组件
 */
export const ThemeConditional: React.FC<{
  light?: ReactNode;
  dark?: ReactNode;
  system?: ReactNode;
  children?: (theme: ThemeContextType) => ReactNode;
}> = ({ light, dark, system, children }) => {
  const theme = useThemeContext();
  
  if (children) {
    return <>{children(theme)}</>;
  }
  
  if (theme.isSystem && system) {
    return <>{system}</>;
  }
  
  if (theme.isDark && dark) {
    return <>{dark}</>;
  }
  
  if (theme.isLight && light) {
    return <>{light}</>;
  }
  
  return null;
};

/**
 * 主题样式注入组件
 */
export const ThemeStyles: React.FC = () => {
  return (
    <style>{`
      /* 主题切换动画 */
      * {
        transition: 
          background-color var(--transition-base),
          border-color var(--transition-base),
          color var(--transition-base),
          fill var(--transition-base),
          stroke var(--transition-base),
          opacity var(--transition-base),
          box-shadow var(--transition-base);
      }
      
      /* 主题特定样式 */
      [data-theme="light"] {
        color-scheme: light;
      }
      
      [data-theme="dark"] {
        color-scheme: dark;
      }
      
      /* 主题图标动画 */
      .theme-icon {
        display: inline-block;
        transition: transform var(--transition-fast) var(--ease-spring-ios);
      }
      
      .glass-button:hover .theme-icon {
        transform: rotate(15deg) scale(1.1);
      }
      
      /* 深色模式特殊效果 */
      [data-theme="dark"] .theme-icon {
        filter: drop-shadow(0 0 8px var(--accent-primary));
      }
      
      /* 浅色模式特殊效果 */
      [data-theme="light"] .theme-icon {
        filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.5));
      }
      
      /* 减少动画偏好 */
      @media (prefers-reduced-motion: reduce) {
        .theme-icon {
          transition: none;
          animation: none;
        }
      }
    `}</style>
  );
};

export default ThemeProvider;