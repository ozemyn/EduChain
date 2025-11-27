import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Divider,
  Select,
} from 'antd';
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
            top: '15%',
            right: '10%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,192,203,0.25)',
            filter: 'blur(35px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(221,160,221,0.25)',
            filter: 'blur(45px)',
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
            加入我们的学习社区
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
              与全球学习者一起分享知识，共同成长
            </Text>
            <Text 
              style={{ 
                fontSize: '16px', 
                color: '#7c3aed',
                opacity: 0.7
              }}
            >
              开启您的知识分享之旅，让学习变得更有意义
            </Text>
          </div>
        </div>
      </div>

      {/* 右侧注册表单区 */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '40px 40px 60px 40px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 480,
            marginTop: '20px',
            marginBottom: '20px',
            boxShadow: '0 20px 40px rgba(217,70,239,0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(217,70,239,0.1)',
            background: 'rgba(255,255,255,0.95)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#d946ef', marginBottom: '8px' }}>
              创建账户
            </Title>
            <Text style={{ color: '#7c3aed', fontSize: '16px' }}>
              填写信息开始您的学习之旅
            </Text>
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
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>用户名</span>}
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
                prefix={<UserOutlined style={{ color: '#d946ef' }} />}
                placeholder="请输入用户名"
                autoComplete="username"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3e8ff',
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>邮箱</span>}
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#d946ef' }} />}
                placeholder="请输入邮箱地址"
                autoComplete="email"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3e8ff',
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>真实姓名</span>}
              rules={[{ required: true }, { min: 2, max: 20 }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#d946ef' }} />}
                placeholder="请输入真实姓名"
                autoComplete="name"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #f3e8ff',
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item 
              name="school" 
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>学校</span>}
            >
              <Select
                placeholder="请选择或输入学校名称"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                suffixIcon={<BankOutlined style={{ color: '#d946ef' }} />}
                style={{
                  borderRadius: '12px',
                }}
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
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>密码</span>}
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
                prefix={<LockOutlined style={{ color: '#d946ef' }} />}
                placeholder="请输入密码"
                autoComplete="new-password"
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

            <Form.Item
              name="confirmPassword"
              label={<span style={{ color: '#7c3aed', fontWeight: '500' }}>确认密码</span>}
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
                prefix={<LockOutlined style={{ color: '#d946ef' }} />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
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
                {loading ? '注册中...' : '创建账户'}
              </Button>
            </Form.Item>

            <Divider plain style={{ borderColor: 'rgba(217,70,239,0.2)' }}>
              <Text style={{ color: '#7c3aed', fontSize: '14px' }}>
                已有账号？
              </Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login">
                <Button 
                  type="link" 
                  style={{ 
                    padding: 0, 
                    fontSize: '16px',
                    color: '#d946ef',
                    fontWeight: '500'
                  }}
                >
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
