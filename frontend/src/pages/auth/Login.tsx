import React from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginRequest } from '@/types/api';
import './auth.css';

const { Title, Text } = Typography;

interface LocationState {
  from?: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;
  const from = state?.from || '/';

  const onFinish = async (values: LoginRequest) => {
    try {
      await login(values.usernameOrEmail, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // 错误已经在AuthContext中处理了，这里不需要额外处理
    }
  };

  const validateMessages = {
    required: '${label}不能为空！',
    types: {
      email: '请输入有效的邮箱地址！',
    },
    string: {
      min: '${label}至少需要${min}个字符！',
    },
  };

  return (
    <div className="auth-container animate-fade-in">
      {/* 左侧品牌展示区 */}
      <div className="auth-brand-section">
        {/* 装饰性背景元素 */}
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />

        <div className="auth-brand-content animate-fade-in-up delay-150">
          <Title level={1} className="auth-brand-title glass-text">
            EduChain
          </Title>
          <Title level={3} className="auth-brand-subtitle">
            教育知识共享平台
          </Title>
          <div className="auth-brand-description">
            <Divider className="auth-divider" />
            <Text className="auth-description-text">
              连接学习者与教育者，构建知识分享的桥梁
            </Text>
            <Text className="auth-description-subtext">
              在这里，每一份知识都有价值，每一次分享都有意义
            </Text>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="auth-form-section">
        <Card className="auth-card glass-card animate-scale-in delay-100">
          <div className="auth-card-header">
            <Title level={2} className="auth-card-title">
              欢迎回来
            </Title>
            <Text className="auth-card-subtitle">登录您的账户继续学习之旅</Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            validateMessages={validateMessages}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="usernameOrEmail"
              rules={[
                { required: true, message: '请输入用户名或邮箱！' },
                { min: 3, message: '用户名至少需要3个字符！' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="auth-input-icon" />}
                placeholder="用户名或邮箱"
                autoComplete="username"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, message: '密码至少需要6个字符！' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="auth-input-icon" />}
                placeholder="密码"
                autoComplete="current-password"
                className="auth-input"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '24px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="auth-submit-button glass-button hover-lift active-scale"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>

            <Divider plain className="auth-divider">
              <Text className="auth-divider-text">还没有账号？</Text>
            </Divider>

            <div className="auth-link-wrapper">
              <Link to="/register">
                <Button type="link" className="auth-link-button">
                  立即注册 →
                </Button>
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
