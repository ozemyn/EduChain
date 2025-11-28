import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout className="main-layout">
      <Header />
      <Content className="main-content">
        <Outlet />
      </Content>
      <Footer />

      <style>{`
        .main-layout {
          min-height: 100vh;
          background: var(--bg-primary);
          transition: background-color var(--transition-base);
        }

        .main-content {
          padding: 0;
          flex: 1;
          background: transparent;
          position: relative;
        }

        /* 确保内容区域没有额外的容器限制 */
        .main-content > * {
          width: 100%;
        }

        /* 为需要容器的页面提供可选的容器类 */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .container-fluid {
          width: 100%;
          padding: 0;
        }

        /* 响应式容器 */
        @media (max-width: 768px) {
          .container {
            padding: 0 var(--spacing-md);
          }
        }
      `}</style>
    </AntLayout>
  );
};

export default Layout;
