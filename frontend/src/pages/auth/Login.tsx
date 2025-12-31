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
import { Form, Input, Button, Typography, Card, Space, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CrownOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { message } from 'antd';
import type { LoginRequest } from '@/types/api';
import { USE_MOCK } from '@/mock';
import EnvironmentIndicator from '@/components/common/EnvironmentIndicator';
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
      // 普通用户登录页面只允许普通用户登录
      await login(values.usernameOrEmail, values.password, 'LEARNER');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // 如果是角色错误，提示用户使用正确的登录页面
      if (error instanceof Error && error.message.includes('管理员')) {
        message.warning('管理员请使用管理员登录页面');
        setTimeout(() => {
          navigate('/admin/login');
        }, 1500);
      }
    }
  };

  // Mock模式下的快速登录
  const handleQuickLogin = async (userType: 'user' | 'admin') => {
    try {
      if (userType === 'admin') {
        // 管理员应该在管理员登录页面登录
        message.info('正在跳转到管理员登录页面...');
        navigate('/admin/login');
        return;
      } else {
        // 普通用户登录，指定角色验证
        await login('zhangsan', 'password', 'LEARNER');
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Quick login failed:', error);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <EnvironmentIndicator />
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

          <h2 className="brand-title">
            基于区块链存证的教育知识共享与智能检索系统
          </h2>
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

            {/* Mock模式下的快速登录 */}
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
                  className="mock-login-card"
                  style={{
                    marginBottom: 'var(--spacing-lg)',
                    background:
                      'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    border: '1px solid #0ea5e9',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: '13px',
                        color: '#0369a1',
                        fontWeight: 500,
                      }}
                    >
                      开发测试模式 - 一键登录
                    </Text>
                  </div>

                  <Space
                    direction="vertical"
                    style={{ width: '100%' }}
                    size="small"
                  >
                    <Button
                      type="default"
                      icon={<UserOutlined />}
                      onClick={() => handleQuickLogin('user')}
                      loading={loading}
                      block
                      style={{
                        height: '40px',
                        borderColor: '#22c55e',
                        color: '#16a34a',
                        background:
                          'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      }}
                    >
                      普通用户登录 (张三)
                    </Button>

                    <Button
                      type="default"
                      icon={<CrownOutlined />}
                      onClick={() => handleQuickLogin('admin')}
                      loading={loading}
                      block
                      style={{
                        height: '40px',
                        borderColor: '#f59e0b',
                        color: '#d97706',
                        background:
                          'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                      }}
                    >
                      跳转管理员登录页面
                    </Button>
                  </Space>

                  <Divider style={{ margin: '12px 0 8px 0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      切换登录页面
                    </span>
                  </Divider>

                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate('/admin/login')}
                    block
                    style={{
                      fontSize: '12px',
                      color: '#6366f1',
                      padding: '4px 0',
                    }}
                  >
                    前往管理员登录页面 →
                  </Button>

                  <div
                    style={{
                      marginTop: 'var(--spacing-xs)',
                      textAlign: 'center',
                      fontSize: '11px',
                      color: '#64748b',
                    }}
                  >
                    仅在Mock模式下可用，使用虚拟数据
                  </div>
                </Card>
              </>
            )}

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
