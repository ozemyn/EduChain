/* ===================================
   管理员布局容器 - Admin Layout Container
   ===================================
   
   特性：
   - 管理员页面的主容器
   - 集成独立的侧边栏和顶部导航
   - 内容区域
   - 完整的响应式支持
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { ROUTES, ROUTE_TITLES } from '@/constants/routes';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import EnvironmentIndicator from '@/components/common/EnvironmentIndicator';
import './AdminLayout.css';

/**
 * 管理员布局容器组件
 */
const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 处理菜单切换
  const handleMenuToggle = () => {
    if (isMobile) {
      // 移动端触发侧边栏抽屉
      const event = new CustomEvent('toggleMobileSidebar');
      window.dispatchEvent(event);
    } else {
      // 桌面端切换侧边栏收缩状态
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const breadcrumbItems: Array<{
      title: React.ReactNode;
      onClick?: () => void;
    }> = [
      {
        title: (
          <span>
            <HomeOutlined />
            <span style={{ marginLeft: '4px' }}>管理后台</span>
          </span>
        ),
        onClick: () => navigate(ROUTES.ADMIN.DASHBOARD),
      },
    ];

    const currentTitle =
      ROUTE_TITLES[location.pathname as keyof typeof ROUTE_TITLES];
    if (currentTitle && location.pathname !== ROUTES.ADMIN.DASHBOARD) {
      breadcrumbItems.push({
        title: <span>{currentTitle}</span>,
      });
    }

    return breadcrumbItems;
  };

  return (
    <div className="admin-layout">
      <EnvironmentIndicator />

      {/* 侧边栏 */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {/* 主内容区 */}
      <div
        className="admin-main-content"
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 64 : 260,
        }}
      >
        {/* 顶部导航栏 */}
        <AdminHeader
          onMenuToggle={handleMenuToggle}
          collapsed={sidebarCollapsed}
        />

        {/* 面包屑 */}
        {!isMobile && (
          <div className="admin-breadcrumb">
            <Breadcrumb items={generateBreadcrumb()} />
          </div>
        )}

        {/* 内容区域 */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
