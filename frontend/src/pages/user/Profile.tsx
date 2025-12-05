/* ===================================
   个人资料页面组件 - Profile Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 个人信息展示和编辑
   - 统计数据可视化
   - 标签页切换
   - 高性能优化
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Modal,
  Space,
  Progress,
  Statistic,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BankOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  HeartOutlined,
  EyeOutlined,
  BookOutlined,
  StarOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import type { User, UserStats } from '@/types/api';
import './Profile.css';

const { Option } = Select;
const { TextArea } = Input;

interface UpdateProfileFormData {
  fullName: string;
  email: string;
  school?: string;
  bio?: string;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 个人资料页面组件
 */
const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 获取用户统计数据
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          // 模拟数据
          setUserStats({
            userId: user.id,
            knowledgeCount: 15,
            likeCount: 128,
            favoriteCount: 45,
            followingCount: 23,
            followerCount: 67,
            viewCount: 1234,
          });
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        school: user.school,
        bio: user.bio,
      });
    }
  }, [user, profileForm]);

  // 更新个人信息
  const handleUpdateProfile = async (values: UpdateProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser: User = {
        ...user,
        ...values,
        updatedAt: new Date().toISOString(),
      };

      updateUser(updatedUser);
      message.success('个人信息更新成功！');
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: ChangePasswordFormData) => {
    try {
      setPasswordLoading(true);
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      message.success('密码修改成功！');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('Failed to change password:', error);
      message.error('密码修改失败，请检查原密码是否正确');
    } finally {
      setPasswordLoading(false);
    }
  };

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/files/upload',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    beforeUpload: file => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
        return false;
      }
      return true;
    },
    onChange: info => {
      if (info.file.status === 'done') {
        if (info.file.response?.success && user) {
          const updatedUser: User = {
            ...user,
            avatarUrl: info.file.response.data.url,
            updatedAt: new Date().toISOString(),
          };
          updateUser(updatedUser);
          message.success('头像更新成功！');
        }
      } else if (info.file.status === 'error') {
        message.error('头像上传失败！');
      }
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

  // 标签页配置
  const tabItems = [
    { key: 'overview', label: '概览', icon: <UserOutlined /> },
    { key: 'stats', label: '统计', icon: <TrophyOutlined /> },
    { key: 'settings', label: '设置', icon: <SettingOutlined /> },
  ];

  // 加载状态
  if (!user) {
    return (
      <div className="profile-loading animate-fade-in">
        <div className="loading-card glass-card">
          <div className="loading-spinner animate-spin"></div>
          <p>加载用户信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="profile-background">
        <div className="profile-blob profile-blob-1" />
        <div className="profile-blob profile-blob-2" />
        <div className="profile-blob profile-blob-3" />
      </div>

      <div className="profile-content container">
        {/* ===================================
            个人资料头部 - Profile Header
            ================================== */}
        <section className="profile-header glass-light animate-fade-in-up">
          <div className="profile-header-grid">
            {/* 头像区域 */}
            <div className="profile-avatar-section">
              <Upload {...uploadProps} showUploadList={false}>
                <div className="profile-avatar-wrapper hover-lift active-scale gpu-accelerated">
                  <Avatar
                    size={120}
                    src={user.avatarUrl}
                    icon={<UserOutlined />}
                    className="profile-avatar"
                  />
                  <div className="profile-avatar-overlay glass-medium">
                    <CameraOutlined />
                  </div>
                </div>
              </Upload>
            </div>

            {/* 用户信息 */}
            <div className="profile-user-info">
              <h1 className="profile-name gradient-text">{user.fullName}</h1>
              <p className="profile-username">@{user.username}</p>

              <div className="profile-badges">
                <div className="glass-badge">
                  <StarOutlined />
                  <span>等级 {user.level}</span>
                </div>
                {user.role === 'ADMIN' && (
                  <div className="glass-badge admin-badge">
                    <TrophyOutlined />
                    <span>管理员</span>
                  </div>
                )}
              </div>

              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-meta">
                <div className="profile-meta-item">
                  <MailOutlined />
                  <span>{user.email}</span>
                </div>
                {user.school && (
                  <div className="profile-meta-item">
                    <BankOutlined />
                    <span>{user.school}</span>
                  </div>
                )}
                <div className="profile-meta-item">
                  <CalendarOutlined />
                  <span>
                    加入于 {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="profile-actions">
              <Button
                className="glass-button hover-lift active-scale"
                icon={<EditOutlined />}
                onClick={() => setActiveTab('settings')}
              >
                编辑资料
              </Button>
              <Button
                className="glass-button hover-lift active-scale"
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                修改密码
              </Button>
            </div>
          </div>
        </section>

        {/* ===================================
            统计数据卡片 - Statistics Cards
            ================================== */}
        {userStats && (
          <section className="profile-stats-section animate-fade-in-up delay-100">
            <div className="stats-grid">
              <div className="stat-card glass-floating-card hover-lift gpu-accelerated">
                <div className="stat-icon stat-icon-primary">
                  <BookOutlined />
                </div>
                <Statistic
                  title="发布内容"
                  value={userStats.knowledgeCount}
                  valueStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>

              <div className="stat-card glass-floating-card hover-lift gpu-accelerated delay-100">
                <div className="stat-icon stat-icon-success">
                  <HeartOutlined />
                </div>
                <Statistic
                  title="获得点赞"
                  value={userStats.likeCount}
                  valueStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>

              <div className="stat-card glass-floating-card hover-lift gpu-accelerated delay-200">
                <div className="stat-icon stat-icon-warning">
                  <EyeOutlined />
                </div>
                <Statistic
                  title="总浏览量"
                  value={userStats.viewCount}
                  valueStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>

              <div className="stat-card glass-floating-card hover-lift gpu-accelerated delay-300">
                <div className="stat-icon stat-icon-info">
                  <TeamOutlined />
                </div>
                <Statistic
                  title="粉丝数量"
                  value={userStats.followerCount}
                  valueStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ===================================
            标签页导航 - Tabs Navigation
            ================================== */}
        <section className="profile-tabs-section animate-fade-in-up delay-200">
          <div className="profile-tabs glass-medium">
            {tabItems.map(item => (
              <button
                key={item.key}
                className={`profile-tab ${activeTab === item.key ? 'active' : ''} hover-scale active-scale`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ===================================
            标签页内容 - Tab Content
            ================================== */}
        <section className="profile-content-section animate-fade-in-up delay-300">
          {/* 概览标签 */}
          {activeTab === 'overview' && (
            <div className="profile-overview glass-card">
              <h2 className="section-title">个人概览</h2>
              <div className="overview-grid">
                <div className="overview-item">
                  <h3>学习进度</h3>
                  <div className="progress-list">
                    <div className="progress-item">
                      <span>知识掌握度</span>
                      <Progress percent={75} strokeColor="var(--primary-600)" />
                    </div>
                    <div className="progress-item">
                      <span>活跃度</span>
                      <Progress
                        percent={88}
                        strokeColor="var(--accent-success)"
                      />
                    </div>
                  </div>
                </div>

                <div className="overview-item">
                  <h3>最近活动</h3>
                  <div className="activity-list">
                    <div className="activity-item glass-light hover-scale">
                      <BookOutlined />
                      <span>发布了新的知识内容</span>
                      <time>2小时前</time>
                    </div>
                    <div className="activity-item glass-light hover-scale">
                      <HeartOutlined />
                      <span>获得了5个点赞</span>
                      <time>1天前</time>
                    </div>
                    <div className="activity-item glass-light hover-scale">
                      <TeamOutlined />
                      <span>新增了3个粉丝</span>
                      <time>2天前</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 统计标签 */}
          {activeTab === 'stats' && userStats && (
            <div className="profile-stats-detail glass-card">
              <h2 className="section-title">详细统计</h2>
              <div className="stats-detail-grid">
                <div className="stats-category">
                  <h3>内容统计</h3>
                  <div className="stats-items">
                    <div className="stats-item glass-light hover-scale">
                      <FileTextOutlined />
                      <span>发布内容</span>
                      <strong>{userStats.knowledgeCount}</strong>
                    </div>
                    <div className="stats-item glass-light hover-scale">
                      <EyeOutlined />
                      <span>总浏览量</span>
                      <strong>{userStats.viewCount}</strong>
                    </div>
                    <div className="stats-item glass-light hover-scale">
                      <HeartOutlined />
                      <span>获得点赞</span>
                      <strong>{userStats.likeCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="stats-category">
                  <h3>社交统计</h3>
                  <div className="stats-items">
                    <div className="stats-item glass-light hover-scale">
                      <TeamOutlined />
                      <span>粉丝数量</span>
                      <strong>{userStats.followerCount}</strong>
                    </div>
                    <div className="stats-item glass-light hover-scale">
                      <UserOutlined />
                      <span>关注数量</span>
                      <strong>{userStats.followingCount}</strong>
                    </div>
                    <div className="stats-item glass-light hover-scale">
                      <TrophyOutlined />
                      <span>收藏数量</span>
                      <strong>{userStats.favoriteCount}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 设置标签 */}
          {activeTab === 'settings' && (
            <div className="profile-settings glass-card">
              <h2 className="section-title">个人设置</h2>
              {editMode ? (
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  className="profile-form"
                >
                  <Form.Item
                    name="fullName"
                    label="真实姓名"
                    rules={[
                      { required: true, message: '请输入真实姓名！' },
                      {
                        min: 2,
                        max: 20,
                        message: '姓名长度应在2-20个字符之间！',
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入真实姓名"
                      prefix={<UserOutlined />}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱！' },
                      { type: 'email', message: '请输入有效的邮箱地址！' },
                    ]}
                  >
                    <Input
                      placeholder="请输入邮箱地址"
                      prefix={<MailOutlined />}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item name="school" label="学校">
                    <Select
                      placeholder="请选择或输入学校名称"
                      showSearch
                      allowClear
                      size="large"
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
                    name="bio"
                    label="个人简介"
                    rules={[
                      { max: 200, message: '个人简介不能超过200个字符！' },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="介绍一下自己吧..."
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="glass-button glass-strong hover-lift active-scale"
                        size="large"
                      >
                        保存修改
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        className="glass-button hover-scale active-scale"
                        size="large"
                      >
                        取消
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <div className="settings-overview">
                  <div className="settings-item glass-light hover-lift">
                    <div className="settings-info">
                      <h3>基本信息</h3>
                      <p>管理您的个人资料信息</p>
                    </div>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                      className="glass-button hover-lift active-scale"
                      size="large"
                    >
                      编辑
                    </Button>
                  </div>

                  <div className="settings-item glass-light hover-lift">
                    <div className="settings-info">
                      <h3>账户安全</h3>
                      <p>修改密码和安全设置</p>
                    </div>
                    <Button
                      icon={<LockOutlined />}
                      onClick={() => setPasswordModalVisible(true)}
                      className="glass-button hover-lift active-scale"
                      size="large"
                    >
                      修改密码
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ===================================
          修改密码模态框 - Change Password Modal
          ================================== */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        centered
        className="profile-modal"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="password-form"
        >
          <Form.Item
            name="currentPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码！' }]}
          >
            <Input.Password
              placeholder="请输入原密码"
              prefix={<LockOutlined />}
              size="large"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码！' },
              { min: 6, max: 20, message: '密码长度应在6-20个字符之间！' },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                message: '密码必须包含字母和数字！',
              },
            ]}
          >
            <Input.Password
              placeholder="请输入新密码"
              prefix={<LockOutlined />}
              size="large"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="请再次输入新密码"
              prefix={<LockOutlined />}
              size="large"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item className="modal-actions">
            <Space>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
                className="glass-button hover-scale active-scale"
                size="large"
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={passwordLoading}
                className="glass-button glass-strong hover-lift active-scale"
                size="large"
              >
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
