/* ===================================
   管理员顶部导航组件 - Admin Header Component
   ===================================
   
   特性：
   - 左侧汉堡菜单按钮
   - 右侧主题切换和个人信息
   - 独立的组件，不依赖其他布局
   - 完整的响应式支持
   
   ================================== */

import React from 'react';
import { Avatar, Dropdown, Space, Button, Switch } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import './AdminHeader.css';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  collapsed?: boolean;
}

/**
 * 管理员顶部导航组件
 */
const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

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

  // 主题切换
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    // 这里可以添加主题切换逻辑
    document.documentElement.setAttribute(
      'data-theme',
      checked ? 'dark' : 'light'
    );
  };

  return (
    <header className="admin-header">
      {/* 左侧汉堡菜单 */}
      <div className="admin-header-left">
        <Button
          type="text"
          icon={<MenuUnfoldOutlined />}
          onClick={onMenuToggle}
          className="admin-menu-toggle"
        />
      </div>

      {/* 右侧功能区 */}
      <div className="admin-header-right">
        <Space size="middle">
          {/* 主题切换 */}
          <div className="admin-theme-switch">
            <Switch
              checked={isDarkMode}
              onChange={handleThemeChange}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              className="theme-switch"
            />
          </div>

          {/* 通知 */}
          <Button
            type="text"
            icon={<BellOutlined />}
            className="admin-header-button"
          />

          {/* 用户信息 */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <div className="admin-user-info">
              <Avatar
                src={user?.avatarUrl}
                icon={!user?.avatarUrl && <UserOutlined />}
                size="default"
              />
              <div className="admin-user-details">
                <div className="admin-user-name">
                  {user?.fullName || user?.username}
                </div>
                <div className="admin-user-role">管理员</div>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </header>
  );
};

export default AdminHeader;
