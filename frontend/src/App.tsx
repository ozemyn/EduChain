import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { App as AntApp, ConfigProvider } from 'antd';
import { ThemeProvider } from '@contexts/ThemeProvider';
import { AuthProvider } from '@contexts/AuthContext';
import { AppProvider } from '@contexts/AppContext';
import { ErrorBoundary } from '@components/common';
import router from './router';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import '@/styles/globals.css';
import '@/styles/theme-variables.css';
import '@/styles/theme-antd.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';
import '@/styles/performance.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              // 可以在这里自定义主题
            },
          }}
        >
          <AntApp>
            <AuthProvider>
              <AppProvider>
                <RouterProvider router={router} />
              </AppProvider>
            </AuthProvider>
          </AntApp>
        </ConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
