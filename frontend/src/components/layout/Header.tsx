/* ===================================
   现代化导航栏组件 - Modern Header Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 玻璃态效果
   - 流畅的动画
   - 移动端抽屉菜单
   - 滚动时动态效果
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, Input, Drawer, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BookOutlined,
  SearchOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  MenuOutlined,
  BellOutlined,
  CloseOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { useAuth } from '@contexts/AuthContext';
import { ThemeToggle } from '@components/common';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // 状态管理
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // 监听滚动，添加导航栏效果
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 搜索处理
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  // 登出处理
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // 用户下拉菜单
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

  // 导航链接配置
  const navLinks = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      path: '/',
    },
    {
      key: 'knowledge',
      icon: <BookOutlined />,
      label: '知识库',
      path: '/knowledge',
    },
    {
      key: 'blockchain',
      icon: <BlockOutlined />,
      label: '区块链',
      path: '/blockchain',
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: '搜索',
      path: '/search',
    },
    {
      key: 'recommendations',
      icon: <ThunderboltOutlined />,
      label: '推荐',
      path: '/recommendations',
    },
    {
      key: 'community',
      icon: <TeamOutlined />,
      label: '社区',
      path: '/community',
    },
  ];

  // 判断当前路由是否激活
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* 主导航栏 */}
      <AntHeader
        className={`modern-navbar glass-navbar optimized-card ${
          scrolled ? 'scrolled' : ''
        } ${searchFocused ? 'search-focused' : ''}`}
      >
        <div className="navbar-container container">
          {/* Logo 区域 */}
          <Link
            to="/"
            className="logo-section hover-scale active-press gpu-accelerated"
          >
            <div className="logo-icon glass-badge">
              <BookOutlined />
            </div>
            <span className="logo-text gradient-text">EduChain</span>
          </Link>

          {/* 桌面端导航链接 */}
          <nav className="nav-links desktop-only">
            {navLinks.map(link => (
              <Link
                key={link.key}
                to={link.path}
                className={`nav-link glass-button hover-lift active-scale ${
                  isActive(link.path) ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* 搜索框 - 桌面端 */}
          <div className="search-wrapper desktop-only">
            <Search
              placeholder="搜索知识、课程、专家..."
              allowClear
              onSearch={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="navbar-search glass-medium"
              prefix={<SearchOutlined />}
            />
          </div>

          {/* 右侧操作区 */}
          <div className="navbar-actions">
            {/* 通知 - 仅登录用户 */}
            {user && (
              <Badge count={3} size="small" className="desktop-only">
                <Button
                  className="action-button glass-button hover-scale active-scale"
                  icon={<BellOutlined />}
                  shape="circle"
                />
              </Badge>
            )}

            {/* 主题切换 */}
            <div className="desktop-only">
              <ThemeToggle variant="glass" size="middle" />
            </div>

            {/* 用户区域 */}
            {user ? (
              <>
                <Button
                  className="create-button glass-button glass-strong hover-lift active-scale desktop-only"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/knowledge/create')}
                >
                  发布
                </Button>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <div className="user-profile glass-light hover-scale active-press">
                    <Avatar
                      src={user.avatarUrl}
                      icon={<UserOutlined />}
                      size="default"
                      className="user-avatar"
                    />
                    <span className="user-name desktop-only">
                      {user.fullName || user.username}
                    </span>
                  </div>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  className="login-button glass-button hover-scale active-scale desktop-only"
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  className="register-button glass-button glass-strong hover-lift active-scale"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/register')}
                >
                  <span className="desktop-only">注册</span>
                </Button>
              </>
            )}

            {/* 移动端菜单按钮 */}
            <Button
              className="mobile-menu-button glass-button hover-scale active-scale mobile-only"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              shape="circle"
            />
          </div>
        </div>
      </AntHeader>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={
          <div className="mobile-drawer-header">
            <span className="logo-text gradient-text">EduChain</span>
            <ThemeToggle variant="glass" size="small" />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-nav-drawer"
        closeIcon={<CloseOutlined />}
        width={280}
      >
        {/* 移动端搜索 */}
        <div className="mobile-search">
          <Search
            placeholder="搜索..."
            allowClear
            onSearch={handleSearch}
            className="glass-medium"
            prefix={<SearchOutlined />}
            size="large"
          />
        </div>

        {/* 移动端导航链接 */}
        <nav className="mobile-nav-links">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.path}
              className={`mobile-nav-link glass-light hover-lift ${
                isActive(link.path) ? 'active' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
              {isActive(link.path) && (
                <div className="active-indicator animate-scale-in" />
              )}
            </Link>
          ))}
        </nav>

        {/* 移动端用户操作 */}
        {user && (
          <div className="mobile-user-actions">
            <Button
              className="glass-button glass-strong hover-lift"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate('/knowledge/create');
                setMobileMenuOpen(false);
              }}
              block
              size="large"
            >
              发布内容
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Header;
