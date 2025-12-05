/* ===================================
   管理员登录页面 - Admin Login Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 现代化的 iOS 风格
   - 玻璃态设计
   - 完整的后端集成
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import './AdminLogin.css';

interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
  remember?: boolean;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 如果已经登录且是管理员，直接跳转到仪表盘
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage('');

    try {
      // 先调用登录接口验证身份
      const response = await authService.login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });

      // 检查返回的数据
      if (!response.data) {
        throw new Error('登录响应数据为空');
      }

      const { user: userData } = response.data;

      // 验证是否为管理员
      if (userData.role !== 'ADMIN') {
        // 清除已保存的登录信息
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setErrorMessage('您没有管理员权限，请使用管理员账号登录');
        message.error('您没有管理员权限');
        return;
      }

      // 验证账号状态
      if (userData.status !== 1) {
        // 清除已保存的登录信息
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setErrorMessage('您的账号已被禁用，请联系系统管理员');
        message.error('账号已被禁用');
        return;
      }

      // 保存"记住我"选项
      if (values.remember) {
        localStorage.setItem('adminRememberMe', 'true');
        localStorage.setItem('adminUsername', values.usernameOrEmail);
      } else {
        localStorage.removeItem('adminRememberMe');
        localStorage.removeItem('adminUsername');
      }

      // 显示成功消息
      message.success(`欢迎回来，${userData.fullName || userData.username}！`);

      // 等待一小段时间让 AuthContext 更新状态
      await new Promise(resolve => setTimeout(resolve, 100));

      // 跳转到目标页面或仪表盘
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error('Admin login failed:', error);

      // 处理不同类型的错误
      let errorMsg = '登录失败，请稍后重试';

      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as {
          response?: { status?: number; data?: { message?: string } };
          request?: unknown;
          message?: string;
        };

        if (err.response) {
          // 服务器返回错误
          const { status, data } = err.response;

          if (status === 401) {
            errorMsg = '用户名或密码错误';
          } else if (status === 403) {
            errorMsg = '您没有管理员权限';
          } else if (status === 429) {
            errorMsg = '登录请求过于频繁，请稍后再试';
          } else if (data?.message) {
            errorMsg = data.message;
          }
        } else if (err.request) {
          // 请求发送但没有收到响应
          errorMsg = '网络连接失败，请检查网络设置';
        } else if (err.message) {
          errorMsg = err.message;
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 加载记住的用户名
  useEffect(() => {
    const rememberMe = localStorage.getItem('adminRememberMe') === 'true';
    const savedUsername = localStorage.getItem('adminUsername');

    if (rememberMe && savedUsername) {
      form.setFieldsValue({
        usernameOrEmail: savedUsername,
        remember: true,
      });
    }
  }, [form]);

  return (
    <div className="admin-login-page animate-fade-in">
      <div className="login-container">
        <div className="login-card glass-card animate-scale-in">
          {/* 登录头部 */}
          <div className="login-header">
            <div className="login-icon gpu-accelerated">
              <SafetyOutlined />
            </div>
            <h1 className="login-title">管理员登录</h1>
            <p className="login-subtitle">请使用管理员账号登录系统</p>
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

          {/* 登录表单 */}
          <Form
            form={form}
            className="login-form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="用户名或邮箱"
              name="usernameOrEmail"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入管理员用户名或邮箱"
                size="large"
                autoComplete="username"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入管理员密码"
                size="large"
                autoComplete="current-password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="login-button glass-button glass-strong hover-lift active-scale"
                icon={<SafetyOutlined />}
              >
                {loading ? '登录中...' : '安全登录'}
              </Button>
            </Form.Item>
          </Form>

          {/* 登录选项 */}
          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="login-remember" disabled={loading}>
                记住我
              </Checkbox>
            </Form.Item>
            <a
              href="#"
              className="login-forgot"
              onClick={e => {
                e.preventDefault();
                message.info('请联系系统管理员重置密码');
              }}
            >
              忘记密码？
            </a>
          </div>

          {/* 安全提示 */}
          <div className="security-notice">
            <InfoCircleOutlined className="security-notice-icon" />
            <div className="security-notice-text">
              为了您的账户安全，请不要在公共设备上保存登录信息。管理员账号具有系统最高权限，请妥善保管您的登录凭证。
            </div>
          </div>

          {/* 登录页脚 */}
          <div className="login-footer">
            <p className="login-footer-text">
              需要帮助？
              <a
                href="#"
                className="login-footer-link"
                onClick={e => {
                  e.preventDefault();
                  message.info('请联系技术支持：support@educhain.com');
                }}
              >
                {' '}
                联系技术支持
              </a>
            </p>
            <p
              className="login-footer-text"
              style={{ marginTop: 'var(--spacing-sm)' }}
            >
              <a
                href="/"
                className="login-footer-link"
                onClick={e => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                返回首页
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
