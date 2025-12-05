/* ===================================
   注册页面组件 - Register Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 左侧固定品牌展示区
   - 右侧注册表单区
   - 完整的响应式设计
   - 浅色模式接近白色背景
   - 表单验证
   - 高性能优化
   
   ================================== */

import React from 'react';
import { Form, Input, Button, Typography, Select } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BankOutlined,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterRequest } from '@/types/api';
import './Register.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

/**
 * 注册页面组件
 */
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
    }
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
    <div className="register-page animate-fade-in">
      {/* 左侧品牌展示区 - 固定 */}
      <div className="register-brand-section">
        {/* 背景装饰 */}
        <div className="brand-background">
          <div className="brand-blob brand-blob-1" />
          <div className="brand-blob brand-blob-2" />
          <div className="brand-blob brand-blob-3" />
          <div className="brand-grid" />
        </div>

        {/* 品牌内容 */}
        <div className="brand-content animate-fade-in-up">
          <div className="brand-logo">
            <div className="logo-icon glass-light">
              <RocketOutlined />
            </div>
            <h1 className="logo-text gradient-text">EduChain</h1>
          </div>

          <h2 className="brand-title">加入我们的学习社区</h2>
          <p className="brand-description">
            与全球学习者一起分享知识，共同成长
          </p>

          {/* 特性列表 */}
          <div className="brand-features">
            <div className="feature-item glass-light animate-fade-in-up delay-100">
              <div className="feature-icon">
                <TeamOutlined />
              </div>
              <div className="feature-text">
                <h4>活跃社区</h4>
                <p>12,000+ 学习者</p>
              </div>
            </div>

            <div className="feature-item glass-light animate-fade-in-up delay-200">
              <div className="feature-icon">
                <SafetyOutlined />
              </div>
              <div className="feature-text">
                <h4>优质内容</h4>
                <p>8,000+ 知识分享</p>
              </div>
            </div>

            <div className="feature-item glass-light animate-fade-in-up delay-300">
              <div className="feature-icon">
                <ThunderboltOutlined />
              </div>
              <div className="feature-text">
                <h4>智能推荐</h4>
                <p>个性化学习路径</p>
              </div>
            </div>
          </div>

          {/* 底部装饰文字 */}
          <div className="brand-footer">
            <p className="footer-text">
              开启您的知识分享之旅
              <br />
              让学习变得更有意义
            </p>
          </div>
        </div>
      </div>

      {/* 右侧注册表单区 */}
      <div className="register-form-section">
        <div className="form-container">
          {/* 表单卡片 */}
          <div className="form-card glass-card animate-scale-in delay-100">
            <div className="form-header">
              <Title level={2} className="form-title">
                创建账户
              </Title>
              <Text className="form-subtitle">填写信息开始您的学习之旅</Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              size="large"
              autoComplete="off"
              layout="vertical"
              className="register-form"
            >
              <Form.Item
                name="username"
                label={<span className="form-label">用户名</span>}
                rules={[
                  { required: true, message: '请输入用户名！' },
                  {
                    min: 3,
                    max: 20,
                    message: '用户名长度应在3-20个字符之间！',
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: '用户名只能包含字母、数字和下划线！',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="请输入用户名"
                  autoComplete="username"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="form-label">邮箱</span>}
                rules={[
                  { required: true, message: '请输入邮箱！' },
                  { type: 'email', message: '请输入有效的邮箱地址！' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="input-icon" />}
                  placeholder="请输入邮箱地址"
                  autoComplete="email"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="fullName"
                label={<span className="form-label">真实姓名</span>}
                rules={[
                  { required: true, message: '请输入真实姓名！' },
                  { min: 2, max: 20, message: '姓名长度应在2-20个字符之间！' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="请输入真实姓名"
                  autoComplete="name"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="school"
                label={<span className="form-label">学校（可选）</span>}
              >
                <Select
                  placeholder="请选择或输入学校名称"
                  showSearch
                  allowClear
                  suffixIcon={<BankOutlined className="input-icon" />}
                  className="form-select"
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
                label={<span className="form-label">密码</span>}
                rules={[
                  { required: true, message: '请输入密码！' },
                  { min: 6, max: 20, message: '密码长度应在6-20个字符之间！' },
                  {
                    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                    message: '密码必须包含字母和数字！',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="input-icon" />}
                  placeholder="请输入密码"
                  autoComplete="new-password"
                  className="form-input"
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="form-label">确认密码</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码！' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('两次输入的密码不一致！')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="input-icon" />}
                  placeholder="请再次输入密码"
                  autoComplete="new-password"
                  className="form-input"
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
                  className="submit-button glass-button glass-strong hover-lift active-scale"
                >
                  {loading ? '注册中...' : '创建账户'}
                </Button>
              </Form.Item>
            </Form>

            {/* 分隔线 */}
            <div className="form-divider">
              <span className="divider-text">已有账号？</span>
            </div>

            {/* 登录链接 */}
            <div className="form-footer">
              <Link to="/login" className="footer-link">
                <Button type="link" className="link-button hover-scale" block>
                  立即登录 →
                </Button>
              </Link>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="form-bottom-text animate-fade-in-up delay-400">
            <Text className="bottom-text">
              注册即表示您同意我们的
              <a href="/terms" className="bottom-link">
                服务条款
              </a>
              和
              <a href="/privacy" className="bottom-link">
                隐私政策
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
