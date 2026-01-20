'use client';

/**
 * 主题管理 Context
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { storage } from '@/lib';
import { STORAGE_KEY } from '@/config';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (storage.get<Theme>(STORAGE_KEY.THEME)) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = storage.get<Theme>(STORAGE_KEY.THEME) || 'system';
    return saved === 'system' ? getSystemTheme() : saved;
  });

  // 应用主题到 DOM
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    setResolvedTheme(resolved);
  }, []);

  // 设置主题
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      storage.set(STORAGE_KEY.THEME, newTheme);
      applyTheme(newTheme === 'system' ? getSystemTheme() : newTheme);
    },
    [applyTheme]
  );

  // 切换主题
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // 初始化主题
  useEffect(() => {
    applyTheme(theme === 'system' ? getSystemTheme() : theme);
  }, [theme, applyTheme]);

  // 多标签页同步
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY.THEME && e.newValue) {
        const newTheme = e.newValue.replace(/"/g, '') as Theme;
        setThemeState(newTheme);
        applyTheme(newTheme === 'system' ? getSystemTheme() : newTheme);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
