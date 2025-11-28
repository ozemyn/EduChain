import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { App as AntApp, ConfigProvider } from 'antd';
import { ThemeProvider } from '@contexts/ThemeProvider';
import { ThemeProvider as AntThemeProvider } from '@contexts/ThemeContext';
import { AuthProvider } from '@contexts/AuthContext';
import { AppProvider } from '@contexts/AppContext';
import { ErrorBoundary } from '@components/common';
import router from './router';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            // 可以在这里自定义主题
          },
        }}
      >
        <ThemeProvider>
          <AntThemeProvider>
            <AntApp>
              <AuthProvider>
                <AppProvider>
                  <RouterProvider router={router} />
                </AppProvider>
              </AuthProvider>
            </AntApp>
          </AntThemeProvider>
        </ThemeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
