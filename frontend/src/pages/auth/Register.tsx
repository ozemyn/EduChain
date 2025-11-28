import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Select } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BankOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterRequest } from '@/types/api';
import './auth.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
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
    <div className="auth-container animate-fade-in">
      {/* 左侧品牌展示区 */}
      <div className="auth-brand-section">
        {/* 装饰性背景元素 */}
        <div className="auth-blob auth-blob-3" />
        <div className="auth-blob auth-blob-4" />

        <div className="auth-brand-content animate-fade-in-up delay-150">
          <Title level={1} className="auth-brand-title glass-text">
            EduChain
          </Title>
          <Title level={3} className="auth-brand-subtitle">
            加入我们的学习社区
          </Title>
          <div className="auth-brand-description">
            <Divider className="auth-divider" />
            <Text className="auth-description-text">
              与全球学习者一起分享知识，共同成长
            </Text>
            <Text className="auth-description-subtext">
              开启您的知识分享之旅，让学习变得更有意义
            </Text>
          </div>
        </div>
      </div>

      {/* 右侧注册表单区 */}
      <div className="auth-form-section auth-form-section-register">
        <Card className="auth-card auth-card-register glass-card animate-scale-in delay-100">
          <div className="auth-card-header">
            <Title level={2} className="auth-card-title">
              创建账户
            </Title>
            <Text className="auth-card-subtitle">填写信息开始您的学习之旅</Text>
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
              label={<span className="auth-label">用户名</span>}
              rules={[
                { required: true },
                { min: 3, max: 20 },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: '用户名只能包含字母、数字和下划线！',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="auth-input-icon" />}
                placeholder="请输入用户名"
                autoComplete="username"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="auth-label">邮箱</span>}
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input
                prefix={<MailOutlined className="auth-input-icon" />}
                placeholder="请输入邮箱地址"
                autoComplete="email"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label={<span className="auth-label">真实姓名</span>}
              rules={[{ required: true }, { min: 2, max: 20 }]}
            >
              <Input
                prefix={<UserOutlined className="auth-input-icon" />}
                placeholder="请输入真实姓名"
                autoComplete="name"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="school"
              label={<span className="auth-label">学校</span>}
            >
              <Select
                placeholder="请选择或输入学校名称"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                suffixIcon={<BankOutlined className="auth-input-icon" />}
                className="auth-select"
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
              label={<span className="auth-label">密码</span>}
              rules={[
                { required: true },
                { min: 6, max: 20 },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                  message: '密码必须包含字母和数字！',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="auth-input-icon" />}
                placeholder="请输入密码"
                autoComplete="new-password"
                className="auth-input"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="auth-label">确认密码</span>}
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
                prefix={<LockOutlined className="auth-input-icon" />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
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
                {loading ? '注册中...' : '创建账户'}
              </Button>
            </Form.Item>

            <Divider plain className="auth-divider">
              <Text className="auth-divider-text">已有账号？</Text>
            </Divider>

            <div className="auth-link-wrapper">
              <Link to="/login">
                <Button type="link" className="auth-link-button">
                  立即登录 →
                </Button>
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
