import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Divider,
} from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

const { Title, Text, Link } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

// 管理员登录页面
const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form] = Form.useForm();

  // 获取重定向路径
  const from =
    (location.state as { from?: string })?.from || ROUTES.ADMIN.DASHBOARD;

  // 处理登录
  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      await login(values.username, values.password);

      // 登录成功后检查用户角色
      // 这里应该在login成功后检查用户角色，如果不是管理员则拒绝访问
      // 暂时模拟检查逻辑
      if (values.username !== 'admin') {
        setError('只有管理员才能访问管理后台');
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 头部 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#1890ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            <SafetyOutlined />
          </div>
          <Title level={2} style={{ margin: '0 0 8px 0' }}>
            管理员登录
          </Title>
          <Text type="secondary">EduChain 教育知识共享平台管理后台</Text>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* 登录表单 */}
        <Form
          form={form}
          name="adminLogin"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="管理员用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="管理员密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: '48px', fontSize: '16px' }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        {/* 底部链接 */}
        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              只有管理员才能访问此页面
            </Text>
            <Link
              onClick={() => navigate(ROUTES.HOME)}
              style={{ fontSize: '14px' }}
            >
              返回首页
            </Link>
          </Space>
        </div>

        {/* 演示账号提示 */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#52c41a' }}>
            <strong>演示账号：</strong>
            <br />
            用户名: admin
            <br />
            密码: admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
