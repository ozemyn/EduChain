import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ThemeProvider } from '@contexts/ThemeContext';
import { AuthProvider } from '@contexts/AuthContext';
import { AppProvider } from '@contexts/AppContext';
import { ErrorBoundary } from '@components/common';
import router from './router';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AntApp>
          <AuthProvider>
            <AppProvider>
              <RouterProvider router={router} />
            </AppProvider>
          </AuthProvider>
        </AntApp>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
