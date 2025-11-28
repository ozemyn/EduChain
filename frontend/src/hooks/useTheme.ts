import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

/**
 * 全局主题管理 Hook
 * 支持浅色、深色和系统自动模式
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  // 获取系统主题偏好
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 应用主题到 DOM - 优化为瞬间响应
  const applyTheme = useCallback((themeToApply: ResolvedTheme) => {
    if (typeof document === 'undefined') return;
    
    // 立即设置，无过渡
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeToApply === 'dark' ? '#000000' : '#ffffff');
    }
    
    setResolvedTheme(themeToApply);
  }, []);

  // 设置主题
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('educhain-theme', newTheme);
    }
    
    // 计算实际应用的主题
    let themeToApply: ResolvedTheme;
    if (newTheme === 'system') {
      themeToApply = getSystemTheme();
    } else {
      themeToApply = newTheme;
    }
    
    applyTheme(themeToApply);
    
    // 触发自定义事件，通知其他组件主题变化
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themeChange', {
        detail: { theme: newTheme, resolvedTheme: themeToApply }
      }));
    }
  }, [getSystemTheme, applyTheme]);

  // 切换主题（简化为：light -> dark -> light）
  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // 如果当前是系统模式，更新实际主题
      if (theme === 'system') {
        applyTheme(newSystemTheme);
      }
    };

    // 设置初始系统主题
    const initialSystemTheme = getSystemTheme();
    setSystemTheme(initialSystemTheme);

    // 监听系统主题变化
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, getSystemTheme, applyTheme]);

  // 初始化主题
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('educhain-theme') as Theme;
    const initialTheme = savedTheme || 'system';
    
    // 计算实际应用的主题
    let themeToApply: ResolvedTheme;
    if (initialTheme === 'system') {
      themeToApply = getSystemTheme();
    } else {
      themeToApply = initialTheme;
    }
    
    setThemeState(initialTheme);
    applyTheme(themeToApply);
  }, [getSystemTheme, applyTheme]);

  // 监听存储变化（多标签页同步）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'educhain-theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        
        let themeToApply: ResolvedTheme;
        if (newTheme === 'system') {
          themeToApply = getSystemTheme();
        } else {
          themeToApply = newTheme;
        }
        
        applyTheme(themeToApply);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getSystemTheme, applyTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
  };
};

/**
 * 主题工具函数
 */
export const themeUtils = {
  // 获取当前主题
  getCurrentTheme: (): ResolvedTheme => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') as ResolvedTheme || 'light';
  },
  
  // 检查是否为深色主题
  isDarkTheme: (): boolean => {
    return themeUtils.getCurrentTheme() === 'dark';
  },
  
  // 获取主题相关的 CSS 变量值
  getThemeVariable: (variable: string): string => {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  },
  
  // 设置主题相关的 CSS 变量
  setThemeVariable: (variable: string, value: string): void => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty(variable, value);
  },
  
  // 监听主题变化
  onThemeChange: (callback: (theme: ResolvedTheme) => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleThemeChange = (e: CustomEvent) => {
      callback(e.detail.resolvedTheme);
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  },
};

export default useTheme;