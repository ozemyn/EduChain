'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import './ThemeSwitcher.css';

type Theme = 'light' | 'dark';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const isTransitioning = useRef(false);

  // 初始化主题
  useEffect(() => {
    setMounted(true);
    
    // 从 localStorage 读取或使用系统偏好
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyThemeInstantly(initialTheme);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyThemeInstantly(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // 立即应用主题（无过渡）
  const applyThemeInstantly = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 更新 meta theme-color
    updateMetaThemeColor(newTheme);
  }, []);

  // 带过渡的主题应用（用户切换时）
  const applyThemeWithTransition = useCallback((newTheme: Theme) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const root = document.documentElement;
    
    // 使用 CSS 变量控制过渡
    root.style.setProperty('--theme-transition-duration', '200ms');
    
    // 使用 requestAnimationFrame 确保在下一帧应用
    requestAnimationFrame(() => {
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // 更新 meta theme-color
      updateMetaThemeColor(newTheme);
      
      // 过渡完成后清理
      setTimeout(() => {
        root.style.removeProperty('--theme-transition-duration');
        isTransitioning.current = false;
      }, 200);
    });
  }, []);

  // 更新 meta theme-color
  const updateMetaThemeColor = useCallback((newTheme: Theme) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#fefcfd');
    }
  }, []);

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeWithTransition(newTheme);
  }, [theme, applyThemeWithTransition]);

  // 避免服务端渲染闪烁
  if (!mounted) {
    return (
      <button className="theme-switcher" aria-label="Toggle theme" disabled>
        <div className="theme-icon-wrapper">
          <div className="theme-icon theme-icon-sun" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-switcher"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-icon-wrapper">
        {/* 太阳图标 */}
        <div className={`theme-icon theme-icon-sun ${theme === 'light' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>

        {/* 月亮图标 */}
        <div className={`theme-icon theme-icon-moon ${theme === 'dark' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>

      {/* 背景光晕 */}
      <div className="theme-glow" />
    </button>
  );
};
