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
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {/* Logo */}
      <div style={{ marginRight: '24px' }}>
        <Link
          to="/"
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff',
            textDecoration: 'none',
          }}
        >
          EduChain
        </Link>
      </div>

      {/* 导航菜单 */}
      <Menu
        mode="horizontal"
        items={menuItems}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
        }}
      />

      {/* 搜索框 */}
      <div style={{ margin: '0 24px' }}>
        <Search
          placeholder="搜索知识内容..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>

      {/* 用户操作区域 */}
      <Space>
        {user ? (
          <>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/knowledge/create')}
            >
              发布内容
            </Button>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src={user.avatarUrl}
                  icon={<UserOutlined />}
                  style={{ marginRight: '8px' }}
                />
                <span>{user.fullName || user.username}</span>
              </div>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button onClick={() => navigate('/login')}>登录</Button>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/register')}
            >
              注册
            </Button>
          </Space>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
