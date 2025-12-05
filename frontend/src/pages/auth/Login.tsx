/* ===================================
   登录页面组件 - Login Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 左侧固定品牌展示区
   - 右侧登录表单区
   - 完整的响应式设计
   - 浅色模式接近白色背景
   - 表单验证
   - 高性能优化
   
   ================================== */

import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginRequest } from '@/types/api';
import './Login.css';

const { Title, Text } = Typography;

interface LocationState {
  from?: string;
}

/**
 * 登录页面组件
 */
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
    }
  };

  return (
    <div className="login-page animate-fade-in">
      {/* 左侧品牌展示区 - 固定 */}
      <div className="login-brand-section">
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

          <h2 className="brand-title">教育知识共享平台</h2>
          <p className="brand-description">
            连接学习者与教育者，构建知识分享的桥梁
          </p>

          {/* 特性列表 */}
          <div className="brand-features">
            <div className="feature-item glass-light animate-fade-in-up delay-100">
              <div className="feature-icon">
                <SafetyOutlined />
              </div>
              <div className="feature-text">
                <h4>安全可靠</h4>
                <p>企业级安全保障</p>
              </div>
            </div>

            <div className="feature-item glass-light animate-fade-in-up delay-200">
              <div className="feature-icon">
                <ThunderboltOutlined />
              </div>
              <div className="feature-text">
                <h4>高效学习</h4>
                <p>智能推荐系统</p>
              </div>
            </div>

            <div className="feature-item glass-light animate-fade-in-up delay-300">
              <div className="feature-icon">
                <TeamOutlined />
              </div>
              <div className="feature-text">
                <h4>活跃社区</h4>
                <p>与优秀者同行</p>
              </div>
            </div>
          </div>

          {/* 底部装饰文字 */}
          <div className="brand-footer">
            <p className="footer-text">
              在这里，每一份知识都有价值
              <br />
              每一次分享都有意义
            </p>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="login-form-section">
        <div className="form-container">
          {/* 表单卡片 */}
          <div className="form-card glass-card animate-scale-in delay-100">
            <div className="form-header">
              <Title level={2} className="form-title">
                欢迎回来
              </Title>
              <Text className="form-subtitle">登录您的账户继续学习之旅</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              size="large"
              autoComplete="off"
              className="login-form"
            >
              <Form.Item
                name="usernameOrEmail"
                rules={[
                  { required: true, message: '请输入用户名或邮箱！' },
                  { min: 3, message: '用户名至少需要3个字符！' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="用户名或邮箱"
                  autoComplete="username"
                  className="form-input"
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
                  prefix={<LockOutlined className="input-icon" />}
                  placeholder="密码"
                  autoComplete="current-password"
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
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            {/* 分隔线 */}
            <div className="form-divider">
              <span className="divider-text">还没有账号？</span>
            </div>

            {/* 注册链接 */}
            <div className="form-footer">
              <Link to="/register" className="footer-link">
                <Button type="link" className="link-button hover-scale" block>
                  立即注册 →
                </Button>
              </Link>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="form-bottom-text animate-fade-in-up delay-400">
            <Text className="bottom-text">
              登录即表示您同意我们的
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

export default Login;
