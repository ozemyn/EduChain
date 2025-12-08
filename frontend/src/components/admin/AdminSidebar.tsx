/* ===================================
   管理员侧边栏组件 - Admin Sidebar Component
   ===================================
   
   特性：
   - 固定在页面左侧
   - 可点击收缩展开
   - 移动端显示为汉堡菜单
   - 现代化设计风格
   - 完整的响应式支持
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  CommentOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  HomeOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants/routes';
import { ThemeToggle } from '@components/common';
import './AdminSidebar.css';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

interface SidebarContentProps {
  inDrawer?: boolean;
  collapsed: boolean;
  menuItems: MenuItem[];
  location: { pathname: string };
  onMenuClick: (path: string) => void;
  onNavigate: (path: string) => void;
}

// 侧边栏内容组件 - 移到外部避免渲染时创建
const SidebarContent: React.FC<SidebarContentProps> = ({
  inDrawer = false,
  collapsed,
  menuItems,
  location,
  onMenuClick,
  onNavigate,
}) => (
  <>
    {/* 顶部标题区域 */}
    <div className="admin-sidebar-header">
      <div
        className="admin-sidebar-logo hover-scale active-press"
        onClick={() => onNavigate(ROUTES.ADMIN.DASHBOARD)}
        title="管理后台首页"
      >
        <div className="admin-sidebar-logo-icon glass-badge">
          <BookOutlined />
        </div>
        {(!collapsed || inDrawer) && (
          <span className="admin-sidebar-logo-text">EduChain</span>
        )}
      </div>
    </div>

    <div className="admin-sidebar-content">
      {/* 菜单区域 */}
      <nav className="admin-sidebar-nav">
        <ul className="admin-menu-list">
          {menuItems.map(item => (
            <li key={item.key} className="admin-menu-item">
              <button
                className={`admin-menu-button ${
                  location.pathname === item.path ? 'active' : ''
                } ${collapsed && !inDrawer ? 'collapsed' : ''}`}
                onClick={() => onMenuClick(item.path)}
                title={collapsed && !inDrawer ? item.label : undefined}
              >
                <span className="admin-menu-icon">{item.icon}</span>
                {(!collapsed || inDrawer) && (
                  <span className="admin-menu-label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 底部区域 */}
      <div className="admin-sidebar-footer">
        {/* 主题切换按钮 */}
        <div className="admin-sidebar-theme-toggle">
          <ThemeToggle variant="glass" size="middle" />
        </div>

        {/* 返回首页按钮 */}
        <button
          className={`admin-menu-button ${collapsed && !inDrawer ? 'collapsed' : ''}`}
          onClick={() => onNavigate('/')}
          title={collapsed && !inDrawer ? '返回用户界面' : undefined}
        >
          <span className="admin-menu-icon">
            <HomeOutlined />
          </span>
          {(!collapsed || inDrawer) && (
            <span className="admin-menu-label">返回用户界面</span>
          )}
        </button>
      </div>
    </div>
  </>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed: externalCollapsed,
  onCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 使用外部控制的collapsed状态，如果没有则使用内部状态
  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && externalCollapsed === undefined) {
        setInternalCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [externalCollapsed]);

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
      path: ROUTES.ADMIN.DASHBOARD,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      path: ROUTES.ADMIN.USERS,
    },
    {
      key: 'knowledge',
      icon: <FileTextOutlined />,
      label: '内容管理',
      path: ROUTES.ADMIN.KNOWLEDGE,
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: '分类管理',
      path: ROUTES.ADMIN.CATEGORIES,
    },
    {
      key: 'comments',
      icon: <CommentOutlined />,
      label: '评论管理',
      path: ROUTES.ADMIN.COMMENTS,
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: '统计分析',
      path: ROUTES.ADMIN.STATISTICS,
    },
    {
      key: 'logs',
      icon: <FileSearchOutlined />,
      label: '系统日志',
      path: ROUTES.ADMIN.LOGS,
    },
  ];

  // 切换侧边栏
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      const newCollapsed = !collapsed;
      if (onCollapse) {
        onCollapse(newCollapsed);
      } else {
        setInternalCollapsed(newCollapsed);
      }
    }
  }, [isMobile, mobileDrawerOpen, collapsed, onCollapse]);

  // 监听外部切换事件（来自AdminHeader）
  useEffect(() => {
    const handleToggle = () => {
      if (isMobile) {
        setMobileDrawerOpen(!mobileDrawerOpen);
      } else {
        toggleSidebar();
      }
    };

    window.addEventListener('toggleMobileSidebar', handleToggle);
    return () =>
      window.removeEventListener('toggleMobileSidebar', handleToggle);
  }, [isMobile, mobileDrawerOpen, toggleSidebar]);

  // 菜单项点击处理
  const handleMenuClick = React.useCallback(
    (path: string) => {
      navigate(path);
      // 移动端点击菜单后关闭抽屉
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    },
    [navigate, isMobile]
  );

  // 导航处理
  const handleNavigate = React.useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      {/* 桌面端侧边栏 */}
      {!isMobile && (
        <aside
          className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}
          style={{
            width: collapsed ? '64px' : '260px',
          }}
        >
          <SidebarContent
            collapsed={collapsed}
            menuItems={menuItems}
            location={location}
            onMenuClick={handleMenuClick}
            onNavigate={handleNavigate}
          />
        </aside>
      )}

      {/* 移动端抽屉 */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          width={260}
          bodyStyle={{ padding: 0 }}
          className="admin-sidebar-drawer"
        >
          <SidebarContent
            inDrawer
            collapsed={collapsed}
            menuItems={menuItems}
            location={location}
            onMenuClick={handleMenuClick}
            onNavigate={handleNavigate}
          />
        </Drawer>
      )}
    </>
  );
};

export default AdminSidebar;
