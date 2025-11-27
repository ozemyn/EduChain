import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginRequest } from '@/types/api';

const { Title, Text } = Typography;

interface LocationState {
  from?: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;
  const from = state?.from || '/';

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      message.success('登录成功！');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            EduChain
          </Title>
          <Text type="secondary">教育知识共享平台</Text>
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
            name="username"
            rules={[
              { required: true, message: '请输入用户名或邮箱！' },
              { min: 3, message: '用户名至少需要3个字符！' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名或邮箱"
              autoComplete="username"
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
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: '44px', fontSize: '16px' }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              还没有账号？
            </Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">
              <Button type="link" style={{ padding: 0, fontSize: '14px' }}>
                立即注册
              </Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
