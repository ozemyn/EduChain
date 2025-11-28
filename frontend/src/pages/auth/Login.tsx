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
    <div
      style={{
        height: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #fef7f7 0%, #fdf2f8 50%, #f3e8ff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* 左侧品牌展示区 - 固定 */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          background: 'linear-gradient(135deg, rgba(255,182,193,0.3) 0%, rgba(221,160,221,0.3) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰性背景元素 */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,192,203,0.2)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '15%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(221,160,221,0.2)',
            filter: 'blur(30px)',
          }}
        />
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <Title 
            level={1} 
            style={{ 
              color: '#d946ef', 
              fontSize: '4rem',
              fontWeight: 'bold',
              marginBottom: '24px',
              textShadow: '0 2px 4px rgba(217,70,239,0.1)'
            }}
          >
            EduChain
          </Title>
          <Title 
            level={3} 
            style={{ 
              color: '#7c3aed', 
              fontWeight: 'normal',
              marginBottom: '32px',
              opacity: 0.8
            }}
          >
            教育知识共享平台
          </Title>
          <div style={{ maxWidth: '400px' }}>
            <Divider style={{ borderColor: 'rgba(217,70,239,0.3)' }} />
            <Text 
              style={{ 
                fontSize: '18px', 
                color: '#6b21a8',
                lineHeight: '1.6',
                display: 'block',
                margin: '24px 0'
              }}
            >
              连接学习者与教育者，构建知识分享的桥梁
            </Text>
            <Text 
              style={{ 
                fontSize: '16px', 
                color: '#7c3aed',
                opacity: 0.7
              }}
            >
              在这里，每一份知识都有价值，每一次分享都有意义
            </Text>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 20px 40px rgba(217,70,239,0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(217,70,239,0.1)',
            background: 'rgba(255,255,255,0.95)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ color: '#d946ef', marginBottom: '8px' }}>
              欢迎回来
            </Title>
            <Text style={{ color: '#7c3aed', fontSize: '16px' }}>
              登录您的账户继续学习之旅
            </Text>
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
                prefix={<UserOutlined style={{ color: '#d946ef' }} />}
                placeholder="用户名或邮箱"
                autoComplete="username"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3e8ff',
                  padding: '12px 16px',
                }}
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
                prefix={<LockOutlined style={{ color: '#d946ef' }} />}
                placeholder="密码"
                autoComplete="current-password"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3e8ff',
                  padding: '12px 16px',
                }}
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
                style={{ 
                  height: '50px', 
                  fontSize: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(217,70,239,0.3)',
                }}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>

            <Divider plain style={{ borderColor: 'rgba(217,70,239,0.2)' }}>
              <Text style={{ color: '#7c3aed', fontSize: '14px' }}>
                还没有账号？
              </Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
              <Link to="/register">
                <Button 
                  type="link" 
                  style={{ 
                    padding: 0, 
                    fontSize: '16px',
                    color: '#d946ef',
                    fontWeight: '500'
                  }}
                >
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
