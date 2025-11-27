import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterRequest } from '@/types/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      message.success('注册成功！请登录');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
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
      max: '${label}最多${max}个字符！',
    },
  };

  // 常见学校选项
  const commonSchools = [
    '北京大学',
    '清华大学',
    '复旦大学',
    '上海交通大学',
    '浙江大学',
    '南京大学',
    '中山大学',
    '华中科技大学',
    '西安交通大学',
    '哈尔滨工业大学',
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 480,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            加入 EduChain
          </Title>
          <Text type="secondary">开始您的知识分享之旅</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          validateMessages={validateMessages}
          size="large"
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true },
              { min: 3, max: 20 },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线！' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true },
              { type: 'email' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱地址"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="真实姓名"
            rules={[
              { required: true },
              { min: 2, max: 20 }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入真实姓名"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="school"
            label="学校"
          >
            <Select
              placeholder="请选择或输入学校名称"
              showSearch
              allowClear
              optionFilterProp="children"
              suffixIcon={<BankOutlined />}
            >
              {commonSchools.map(school => (
                <Option key={school} value={school}>
                  {school}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true },
              { min: 6, max: 20 },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              {loading ? '注册中...' : '注册'}
            </Button>
          </Form.Item>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              已有账号？
            </Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login">
              <Button type="link" style={{ padding: 0, fontSize: '14px' }}>
                立即登录
              </Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
