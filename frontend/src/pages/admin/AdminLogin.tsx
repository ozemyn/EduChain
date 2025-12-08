/* ===================================
   管理员登录页面组件 - Admin Login Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 左侧固定品牌展示区
   - 右侧登录表单区
   - 完整的响应式设计
   - 浅色模式接近白色背景
   - 表单验证
   - 高性能优化
   - 管理员专用样式
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Divider, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
  SecurityScanOutlined,
  CrownOutlined,
  ExperimentOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginRequest } from '@/types/api';
import { USE_MOCK } from '@/mock';
import EnvironmentIndicator from '@/components/common/EnvironmentIndicator';
import './AdminLogin.css';

const { Title, Text } = Typography;

interface LocationState {
  from?: string;
}

/**
 * 管理员登录页面组件
 */
const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const state = location.state as LocationState;
  const from = state?.from || '/admin';

  // 如果已经登录且是管理员，直接跳转到仪表盘
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const onFinish = async (values: LoginRequest) => {
    try {
      setErrorMessage('');
      // 管理员登录页面只允许管理员登录
      await login(values.usernameOrEmail, values.password, 'ADMIN');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Admin login failed:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('登录失败，请检查用户名和密码');
      }
    }
  };

  // Mock模式下的快速管理员登录
  const handleQuickAdminLogin = async () => {
    try {
      setErrorMessage('');
      // 管理员快速登录，指定角色验证
      await login('admin', 'password', 'ADMIN');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Quick admin login failed:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Mock模式管理员登录失败');
      }
    }
  };

  return (
    <div className="admin-login-page animate-fade-in">
      <EnvironmentIndicator />
      {/* 左侧品牌展示区 - 固定 */}
      <div className="admin-login-brand-section">
        {/* 背景装饰 */}
        <div className="admin-brand-background">
          <div className="admin-brand-blob admin-brand-blob-1" />
          <div className="admin-brand-blob admin-brand-blob-2" />
          <div className="admin-brand-blob admin-brand-blob-3" />
          <div className="admin-brand-grid" />
        </div>

        {/* 品牌内容 */}
        <div className="admin-brand-content animate-fade-in-up">
          <div className="admin-brand-logo">
            <div className="admin-logo-icon glass-light">
              <SafetyOutlined />
            </div>
            <h1 className="admin-logo-text gradient-text">EduChain Admin</h1>
          </div>

          <h2 className="admin-brand-title">管理员控制中心</h2>
          <p className="admin-brand-description">
            安全登录，管理平台，维护秩序
          </p>

          {/* 特性列表 */}
          <div className="admin-brand-features">
            <div className="admin-feature-item glass-light animate-fade-in-up delay-100">
              <div className="admin-feature-icon">
                <SecurityScanOutlined />
              </div>
              <div className="admin-feature-text">
                <h4>安全防护</h4>
                <p>多重安全验证</p>
              </div>
            </div>

            <div className="admin-feature-item glass-light animate-fade-in-up delay-200">
              <div className="admin-feature-icon">
                <DashboardOutlined />
              </div>
              <div className="admin-feature-text">
                <h4>数据监控</h4>
                <p>实时系统状态</p>
              </div>
            </div>

            <div className="admin-feature-item glass-light animate-fade-in-up delay-300">
              <div className="admin-feature-icon">
                <SettingOutlined />
              </div>
              <div className="admin-feature-text">
                <h4>系统管理</h4>
                <p>全面控制权限</p>
              </div>
            </div>
          </div>

          {/* 底部装饰文字 */}
          <div className="admin-brand-footer">
            <p className="admin-footer-text">
              守护平台安全
              <br />
              维护用户体验
            </p>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="admin-login-form-section">
        <div className="admin-form-container">
          {/* 表单卡片 */}
          <div className="admin-form-card glass-card animate-scale-in delay-100">
            <div className="admin-form-header">
              <Title level={2} className="admin-form-title">
                管理员登录
              </Title>
              <Text className="admin-form-subtitle">
                请使用管理员账号安全登录
              </Text>
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <Alert
                message={errorMessage}
                type="error"
                showIcon
                closable
                onClose={() => setErrorMessage('')}
                style={{ marginBottom: 'var(--spacing-lg)' }}
              />
            )}

            <Form
              form={form}
              name="adminLogin"
              onFinish={onFinish}
              size="large"
              autoComplete="off"
              className="admin-login-form"
            >
              <Form.Item
                name="usernameOrEmail"
                rules={[
                  { required: true, message: '请输入管理员用户名或邮箱！' },
                  { min: 3, message: '用户名至少需要3个字符！' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="admin-input-icon" />}
                  placeholder="管理员用户名或邮箱"
                  autoComplete="username"
                  className="admin-form-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入管理员密码！' },
                  { min: 6, message: '密码至少需要6个字符！' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="admin-input-icon" />}
                  placeholder="管理员密码"
                  autoComplete="current-password"
                  className="admin-form-input"
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="admin-submit-button glass-button glass-strong hover-lift active-scale"
                >
                  {loading ? '验证中...' : '安全登录'}
                </Button>
              </Form.Item>
            </Form>

            {/* Mock模式下的快速管理员登录 */}
            {USE_MOCK && (
              <>
                <Divider>
                  <span
                    style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}
                  >
                    <ExperimentOutlined /> Mock 模式快速登录
                  </span>
                </Divider>

                <Card
                  size="small"
                  className="mock-admin-login-card"
                  style={{
                    marginBottom: 'var(--spacing-lg)',
                    background:
                      'linear-gradient(135deg, #fef3c7 0%, #fbbf24 20%, #f59e0b 100%)',
                    border: '1px solid #d97706',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: '13px',
                        color: '#92400e',
                        fontWeight: 600,
                      }}
                    >
                      🔧 开发测试模式 - 管理员快速登录
                    </Text>
                  </div>

                  <Button
                    type="default"
                    icon={<CrownOutlined />}
                    onClick={handleQuickAdminLogin}
                    loading={loading}
                    block
                    style={{
                      height: '42px',
                      borderColor: '#dc2626',
                      color: '#dc2626',
                      background:
                        'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                      fontWeight: 500,
                    }}
                  >
                    一键管理员登录 (admin)
                  </Button>

                  <Divider style={{ margin: '12px 0 8px 0' }}>
                    <span style={{ fontSize: '11px', color: '#92400e' }}>
                      切换登录页面
                    </span>
                  </Divider>

                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate('/login')}
                    block
                    style={{
                      fontSize: '12px',
                      color: '#6366f1',
                      padding: '4px 0',
                    }}
                  >
                    前往普通用户登录页面 →
                  </Button>

                  <div
                    style={{
                      marginTop: 'var(--spacing-xs)',
                      textAlign: 'center',
                      fontSize: '11px',
                      color: '#92400e',
                    }}
                  >
                    仅在Mock模式下可用，拥有完整管理权限
                  </div>
                </Card>
              </>
            )}

            {/* 分隔线 */}
            <div className="admin-form-divider">
              <span className="admin-divider-text">需要帮助？</span>
            </div>

            {/* 帮助链接 */}
            <div className="admin-form-footer">
              <Button
                type="link"
                className="admin-link-button hover-scale"
                block
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="admin-form-bottom-text animate-fade-in-up delay-400">
            <Text className="admin-bottom-text">
              管理员账号具有系统最高权限，请妥善保管登录凭证
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
