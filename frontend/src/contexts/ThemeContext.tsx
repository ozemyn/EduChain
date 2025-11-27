import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { Storage, STORAGE_KEYS } from '@/utils/storage';

// 主题类型定义
export type ThemeMode = 'light' | 'dark';

interface ThemeConfig {
  primaryColor: string;
  borderRadius: number;
  colorBgContainer: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  config: ThemeConfig;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;
}

// 默认主题配置
const defaultLightConfig: ThemeConfig = {
  primaryColor: '#1890ff',
  borderRadius: 6,
  colorBgContainer: '#ffffff',
};

const defaultDarkConfig: ThemeConfig = {
  primaryColor: '#1890ff',
  borderRadius: 6,
  colorBgContainer: '#141414',
};

// 创建Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 初始化状态时直接从存储中读取
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return Storage.getLocal<ThemeMode>(STORAGE_KEYS.THEME) || 'light';
  });
  
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const savedConfig = Storage.getLocal<ThemeConfig>('themeConfig');
    const savedMode = Storage.getLocal<ThemeMode>(STORAGE_KEYS.THEME) || 'light';
    
    if (savedConfig) {
      return savedConfig;
    }
    return savedMode === 'dark' ? defaultDarkConfig : defaultLightConfig;
  });

  // 初始化主题
  useEffect(() => {
    // 设置HTML根元素的主题类名
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // 切换主题模式
  const toggleMode = (): void => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  // 设置主题模式
  const setMode = (newMode: ThemeMode): void => {
    setModeState(newMode);
    Storage.setLocal(STORAGE_KEYS.THEME, newMode);

    // 更新配置
    const newConfig =
      newMode === 'dark' ? defaultDarkConfig : defaultLightConfig;
    setConfig(newConfig);
    Storage.setLocal('themeConfig', newConfig);

    // 设置HTML根元素的主题类名
    document.documentElement.setAttribute('data-theme', newMode);
  };

  // 更新主题配置
  const updateConfig = (newConfig: Partial<ThemeConfig>): void => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    Storage.setLocal('themeConfig', updatedConfig);
  };

  // Ant Design主题配置
  const antdTheme = {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: config.primaryColor,
      borderRadius: config.borderRadius,
      colorBgContainer: config.colorBgContainer,
    },
    components: {
      Layout: {
        headerBg: mode === 'dark' ? '#001529' : '#ffffff',
        bodyBg: mode === 'dark' ? '#000000' : '#f5f5f5',
        footerBg: mode === 'dark' ? '#001529' : '#f5f5f5',
      },
      Menu: {
        darkItemBg: '#001529',
        darkSubMenuItemBg: '#000c17',
        darkItemSelectedBg: '#1890ff',
      },
    },
  };

  const value: ThemeContextType = {
    mode,
    config,
    toggleMode,
    setMode,
    updateConfig,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


