import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Input, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  BookOutlined,
  SearchOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuth } from '@contexts/AuthContext';
import { ThemeToggle } from '@components/common';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人中心</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'knowledge',
      icon: <BookOutlined />,
      label: <Link to="/knowledge">知识库</Link>,
    },
  ];

  return (
    <AntHeader className="glass-navbar animate-fade-in-down">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link hover-scale">
            <span className="logo-text glass-text">EduChain</span>
          </Link>
        </div>

        {/* 导航菜单 */}
        <div className="nav-menu">
          <Menu mode="horizontal" items={menuItems} className="glass-menu" />
        </div>

        {/* 搜索框 */}
        <div className="search-section">
          <Search
            placeholder="搜索知识内容..."
            allowClear
            onSearch={handleSearch}
            className="glass-search"
            prefix={<SearchOutlined />}
          />
        </div>

        {/* 用户操作区域 */}
        <div className="user-actions">
          <Space size="middle">
            {/* 主题切换器 */}
            <ThemeToggle variant="glass" size="middle" />

            {user ? (
              <>
                <Button
                  className="glass-button hover-lift active-scale"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/knowledge/create')}
                >
                  发布内容
                </Button>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <div className="user-profile hover-scale active-press">
                    <Avatar
                      src={user.avatarUrl}
                      icon={<UserOutlined />}
                      className="user-avatar"
                    />
                    <span className="user-name">
                      {user.fullName || user.username}
                    </span>
                  </div>
                </Dropdown>
              </>
            ) : (
              <Space size="small">
                <Button
                  className="glass-button hover-scale active-scale"
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  className="glass-button glass-strong hover-lift active-scale"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/register')}
                >
                  注册
                </Button>
              </Space>
            )}
          </Space>
        </div>
      </div>

      <style>{`
        .glass-navbar {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          padding: 0;
          height: auto;
          min-height: 64px;
          border-bottom: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
        }

        .header-container {
          display: flex;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-lg);
          max-width: 1400px;
          margin: 0 auto;
          gap: var(--spacing-lg);
        }

        .logo-section {
          flex-shrink: 0;
        }

        .logo-link {
          display: inline-block;
          text-decoration: none;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px var(--glass-shadow));
        }

        .nav-menu {
          flex: 1;
          min-width: 0;
        }

        .glass-menu {
          background: transparent !important;
          border: none !important;
          font-weight: 500;
        }

        .glass-menu .ant-menu-item {
          border-radius: var(--radius-md);
          margin: 0 var(--spacing-xs);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .glass-menu .ant-menu-item:hover {
          background: var(--glass-bg-light) !important;
          backdrop-filter: var(--blur-sm);
          -webkit-backdrop-filter: var(--blur-sm);
        }

        .glass-menu .ant-menu-item-selected {
          background: var(--glass-bg-medium) !important;
          backdrop-filter: var(--blur-md);
          -webkit-backdrop-filter: var(--blur-md);
          color: var(--accent-primary) !important;
        }

        .search-section {
          flex-shrink: 0;
        }

        .glass-search {
          width: 280px;
          background: var(--glass-bg-light) !important;
          backdrop-filter: var(--blur-sm) !important;
          -webkit-backdrop-filter: var(--blur-sm) !important;
          border: var(--glass-border-width) var(--glass-border-style) var(--glass-border) !important;
          border-radius: var(--liquid-border-radius) !important;
          transition: all var(--transition-fast) var(--ease-ios) !important;
        }

        .glass-search:hover {
          background: var(--glass-bg-medium) !important;
          box-shadow: var(--glass-shadow-sm) !important;
        }

        .glass-search:focus-within {
          background: var(--glass-bg-medium) !important;
          box-shadow: var(--glass-shadow-md) !important;
          border-color: var(--accent-primary) !important;
        }

        .glass-search .ant-input {
          background: transparent !important;
          border: none !important;
          color: var(--text-primary) !important;
          font-weight: 500 !important;
        }

        .glass-search .ant-input::placeholder {
          color: var(--text-placeholder) !important;
        }

        .glass-search .ant-input-prefix {
          color: var(--text-tertiary) !important;
        }

        .user-actions {
          flex-shrink: 0;
        }

        .glass-button {
          background: var(--glass-bg-light) !important;
          backdrop-filter: var(--blur-sm) !important;
          -webkit-backdrop-filter: var(--blur-sm) !important;
          border: var(--glass-border-width) var(--glass-border-style) var(--glass-border) !important;
          border-radius: var(--liquid-border-radius) !important;
          color: var(--text-primary) !important;
          font-weight: 500 !important;
          transition: all var(--transition-fast) var(--ease-ios) !important;
        }

        .glass-button:hover {
          background: var(--glass-bg-medium) !important;
          box-shadow: var(--glass-shadow-sm) !important;
          transform: translateY(-1px) !important;
        }

        .glass-button.glass-strong {
          background: var(--glass-bg-medium) !important;
          backdrop-filter: var(--blur-md) !important;
          -webkit-backdrop-filter: var(--blur-md) !important;
        }

        .glass-button.glass-strong:hover {
          background: var(--glass-bg-strong) !important;
          box-shadow: var(--glass-shadow-md) !important;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--liquid-border-radius);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-ios);
          background: var(--glass-bg-light);
          backdrop-filter: var(--blur-sm);
          -webkit-backdrop-filter: var(--blur-sm);
          border: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
        }

        .user-profile:hover {
          background: var(--glass-bg-medium);
          box-shadow: var(--glass-shadow-sm);
        }

        .user-avatar {
          border: 2px solid var(--glass-border);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .user-name {
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
          .glass-search {
            width: 240px;
          }
        }

        @media (max-width: 992px) {
          .header-container {
            gap: var(--spacing-md);
          }
          
          .glass-search {
            width: 200px;
          }
          
          .user-name {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: var(--spacing-xs) var(--spacing-md);
            gap: var(--spacing-sm);
          }
          
          .nav-menu {
            display: none;
          }
          
          .search-section {
            flex: 1;
          }
          
          .glass-search {
            width: 100%;
          }
          
          .glass-button span:not(.anticon) {
            display: none;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .glass-navbar,
          .logo-link,
          .glass-button,
          .user-profile {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;
