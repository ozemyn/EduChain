import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
  Badge,
  Breadcrumb,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  CommentOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES, ROUTE_TITLES } from '@/constants/routes';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 管理员布局组件
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // 侧边栏菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: ROUTES.ADMIN.DASHBOARD,
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: ROUTES.ADMIN.USERS,
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: ROUTES.ADMIN.KNOWLEDGE,
      icon: <FileTextOutlined />,
      label: '内容管理',
    },
    {
      key: ROUTES.ADMIN.CATEGORIES,
      icon: <TagsOutlined />,
      label: '分类管理',
    },
    {
      key: ROUTES.ADMIN.COMMENTS,
      icon: <CommentOutlined />,
      label: '评论管理',
    },
    {
      key: ROUTES.ADMIN.STATISTICS,
      icon: <BarChartOutlined />,
      label: '统计分析',
    },
    {
      key: ROUTES.ADMIN.LOGS,
      icon: <FileSearchOutlined />,
      label: '系统日志',
    },
  ];

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate(ROUTES.USER.PROFILE),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '返回首页',
      onClick: () => navigate(ROUTES.HOME),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  // 菜单点击处理
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
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

    if (pathSegments.length > 1) {
      const currentPath = `/${pathSegments.join('/')}`;
      const title = ROUTE_TITLES[currentPath as keyof typeof ROUTE_TITLES];
      if (title) {
        breadcrumbItems.push({
          title: <span>{title}</span>,
        });
      }
    }

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: 'var(--bg-elevated)',
          boxShadow: '2px 0 8px 0 var(--glass-shadow)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--accent-primary)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-inverse)',
                fontWeight: 'bold',
              }}
            >
              E
            </div>
          ) : (
            <Space>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#1890ff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                E
              </div>
              <Title level={4} style={{ margin: 0, color: 'var(--accent-primary)' }}>
                EduChain
              </Title>
            </Space>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            height: 'calc(100vh - 64px)',
          }}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Space>

          <Space size="large">
            {/* 通知 */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={user?.avatarUrl}
                  icon={!user?.avatarUrl && <UserOutlined />}
                  size="small"
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {user?.fullName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>管理员</div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 面包屑 */}
        <div
          style={{
            padding: '16px 24px 0',
            background: 'var(--bg-elevated)',
          }}
        >
          <Breadcrumb items={generateBreadcrumb()} />
        </div>

        {/* 内容区域 */}
        <Content
          style={{
            margin: '0',
            background: 'var(--bg-primary)',
            minHeight: 'calc(100vh - 64px - 48px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
