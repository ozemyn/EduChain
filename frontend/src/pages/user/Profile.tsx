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
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Option } = Select;
const { TextArea } = Input;

interface UpdateProfileFormData {
  fullName: string;
  email: string;
  school?: string;
  bio?: string;
}

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
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
          // 这里应该调用获取用户统计的API
          // const response = await userService.getUserStats(user.id);
          // setUserStats(response.data);

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
      // 这里应该调用更新用户信息的API
      // const response = await userService.updateProfile(user.id, values);

      // 模拟更新
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
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
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

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="glass-card">
          <div className="loading-content">
            <div className="loading-spinner animate-spin"></div>
            <p>加载用户信息中...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabItems = [
    { key: 'overview', label: '概览', icon: <UserOutlined /> },
    { key: 'stats', label: '统计', icon: <TrophyOutlined /> },
    { key: 'settings', label: '设置', icon: <SettingOutlined /> },
  ];

  return (
    <div className="profile-container animate-fade-in">
      {/* 背景装饰 */}
      <div className="profile-background">
        <div className="profile-blob profile-blob-1" />
        <div className="profile-blob profile-blob-2" />
        <div className="profile-blob profile-blob-3" />
      </div>

      {/* 个人资料头部 */}
      <section className="profile-header glass-light animate-fade-in-up">
        <div className="profile-header-content">
          {/* 头像区域 */}
          <div className="profile-avatar-section">
            <Upload {...uploadProps} showUploadList={false}>
              <div className="profile-avatar-wrapper hover-lift">
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

      {/* 统计数据卡片 */}
      {userStats && (
        <section className="profile-stats-section animate-fade-in-up delay-100">
          <div className="stats-grid">
            <div className="stat-card glass-floating-card hover-lift">
              <div
                className="stat-icon"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary), var(--primary-600))',
                }}
              >
                <BookOutlined />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.knowledgeCount}</h3>
                <p className="stat-label">发布内容</p>
              </div>
            </div>

            <div className="stat-card glass-floating-card hover-lift">
              <div
                className="stat-icon"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-success), #059669)',
                }}
              >
                <HeartOutlined />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.likeCount}</h3>
                <p className="stat-label">获得点赞</p>
              </div>
            </div>

            <div className="stat-card glass-floating-card hover-lift">
              <div
                className="stat-icon"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-warning), #d97706)',
                }}
              >
                <EyeOutlined />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.viewCount}</h3>
                <p className="stat-label">总浏览量</p>
              </div>
            </div>

            <div className="stat-card glass-floating-card hover-lift">
              <div
                className="stat-icon"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-info), #2563eb)',
                }}
              >
                <TeamOutlined />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{userStats.followerCount}</h3>
                <p className="stat-label">粉丝数量</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 标签页导航 */}
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

      {/* 标签页内容 */}
      <section className="profile-content-section animate-fade-in-up delay-300">
        {activeTab === 'overview' && (
          <div className="profile-overview glass-card">
            <h2 className="section-title">个人概览</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <h3>学习进度</h3>
                <div className="progress-item">
                  <span>知识掌握度</span>
                  <Progress percent={75} strokeColor="var(--accent-primary)" />
                </div>
                <div className="progress-item">
                  <span>活跃度</span>
                  <Progress percent={88} strokeColor="var(--accent-success)" />
                </div>
              </div>

              <div className="overview-item">
                <h3>最近活动</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <BookOutlined />
                    <span>发布了新的知识内容</span>
                    <time>2小时前</time>
                  </div>
                  <div className="activity-item">
                    <HeartOutlined />
                    <span>获得了5个点赞</span>
                    <time>1天前</time>
                  </div>
                  <div className="activity-item">
                    <TeamOutlined />
                    <span>新增了3个粉丝</span>
                    <time>2天前</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && userStats && (
          <div className="profile-stats-detail glass-card">
            <h2 className="section-title">详细统计</h2>
            <div className="stats-detail-grid">
              <div className="stats-category">
                <h3>内容统计</h3>
                <div className="stats-items">
                  <div className="stats-item">
                    <FileTextOutlined />
                    <span>发布内容</span>
                    <strong>{userStats.knowledgeCount}</strong>
                  </div>
                  <div className="stats-item">
                    <EyeOutlined />
                    <span>总浏览量</span>
                    <strong>{userStats.viewCount}</strong>
                  </div>
                  <div className="stats-item">
                    <HeartOutlined />
                    <span>获得点赞</span>
                    <strong>{userStats.likeCount}</strong>
                  </div>
                </div>
              </div>

              <div className="stats-category">
                <h3>社交统计</h3>
                <div className="stats-items">
                  <div className="stats-item">
                    <TeamOutlined />
                    <span>粉丝数量</span>
                    <strong>{userStats.followerCount}</strong>
                  </div>
                  <div className="stats-item">
                    <UserOutlined />
                    <span>关注数量</span>
                    <strong>{userStats.followingCount}</strong>
                  </div>
                  <div className="stats-item">
                    <TrophyOutlined />
                    <span>收藏数量</span>
                    <strong>{userStats.favoriteCount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    className="profile-input"
                    prefix={<UserOutlined />}
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
                    className="profile-input"
                    prefix={<MailOutlined />}
                  />
                </Form.Item>

                <Form.Item name="school" label="学校">
                  <Select
                    placeholder="请选择或输入学校名称"
                    showSearch
                    allowClear
                    className="profile-select"
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
                  rules={[{ max: 200, message: '个人简介不能超过200个字符！' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="介绍一下自己吧..."
                    showCount
                    maxLength={200}
                    className="profile-textarea"
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="glass-button hover-lift active-scale"
                    >
                      保存修改
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      className="glass-button hover-scale active-scale"
                    >
                      取消
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <div className="settings-overview">
                <div className="settings-item">
                  <div className="settings-info">
                    <h3>基本信息</h3>
                    <p>管理您的个人资料信息</p>
                  </div>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                    className="glass-button hover-lift active-scale"
                  >
                    编辑
                  </Button>
                </div>

                <div className="settings-item">
                  <div className="settings-info">
                    <h3>账户安全</h3>
                    <p>修改密码和安全设置</p>
                  </div>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}
                    className="glass-button hover-lift active-scale"
                  >
                    修改密码
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 修改密码模态框 */}
      <Modal
        title={<span className="modal-title">修改密码</span>}
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        className="profile-modal"
        centered
      >
        <div className="modal-content glass-light">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            className="password-form"
          >
            <Form.Item
              name="oldPassword"
              label={<span className="form-label">原密码</span>}
              rules={[{ required: true, message: '请输入原密码！' }]}
            >
              <Input.Password
                placeholder="请输入原密码"
                className="profile-input"
                prefix={<LockOutlined />}
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={<span className="form-label">新密码</span>}
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
                className="profile-input"
                prefix={<LockOutlined />}
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="form-label">确认新密码</span>}
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
                className="profile-input"
                prefix={<LockOutlined />}
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
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  className="glass-button hover-lift active-scale"
                >
                  确认修改
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <style>{`
        /* ===== 个人中心页面样式 ===== */
        .profile-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: var(--spacing-lg);
        }

        /* 背景装饰 */
        .profile-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }

        .profile-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: var(--blur-xl);
          animation: float 8s ease-in-out infinite;
        }

        .profile-blob-1 {
          top: 10%;
          left: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .profile-blob-2 {
          top: 60%;
          right: 10%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%);
          animation-delay: 2s;
        }

        .profile-blob-3 {
          bottom: 20%;
          left: 20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--accent-warning) 0%, transparent 70%);
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        /* 加载状态 */
        .profile-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }

        .loading-content {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent-primary);
          border-radius: 50%;
          margin: 0 auto var(--spacing-lg);
        }

        /* 个人资料头部 */
        .profile-header {
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-xl);
        }

        .profile-header-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: var(--spacing-2xl);
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* 头像区域 */
        .profile-avatar-section {
          display: flex;
          justify-content: center;
        }

        .profile-avatar-wrapper {
          position: relative;
          cursor: pointer;
          transition: all var(--transition-base) var(--ease-spring-ios);
        }

        .profile-avatar {
          border: 4px solid var(--glass-border);
          box-shadow: var(--glass-shadow-lg);
        }

        .profile-avatar-overlay {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          font-size: 16px;
          opacity: 0;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .profile-avatar-wrapper:hover .profile-avatar-overlay {
          opacity: 1;
        }

        /* 用户信息 */
        .profile-user-info {
          min-width: 0;
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 var(--spacing-sm);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-username {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-md);
        }

        .profile-badges {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          flex-wrap: wrap;
        }

        .admin-badge {
          background: linear-gradient(135deg, var(--accent-warning), #d97706);
          color: white;
        }

        .profile-bio {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 var(--spacing-lg);
          max-width: 500px;
        }

        .profile-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .profile-meta-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        .profile-meta-item svg {
          color: var(--accent-primary);
        }

        /* 快速操作 */
        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        /* 统计数据 */
        .profile-stats-section {
          margin-bottom: var(--spacing-2xl);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card {
          padding: var(--spacing-xl);
          text-align: center;
          border-radius: var(--liquid-border-radius-lg);
          transition: all var(--transition-base) var(--ease-spring-ios);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--spacing-md);
          font-size: 1.5rem;
          color: white;
          box-shadow: var(--glass-shadow-md);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* 标签页 */
        .profile-tabs-section {
          margin-bottom: var(--spacing-xl);
        }

        .profile-tabs {
          display: flex;
          padding: var(--spacing-sm);
          border-radius: var(--liquid-border-radius-lg);
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .profile-tab:hover {
          color: var(--text-primary);
          background: var(--glass-bg-light);
        }

        .profile-tab.active {
          color: var(--accent-primary);
          background: var(--glass-bg-medium);
          box-shadow: var(--glass-shadow-sm);
        }

        /* 内容区域 */
        .profile-content-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xl);
        }

        /* 概览页面 */
        .profile-overview {
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-lg);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
        }

        .overview-item h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-lg);
        }

        .progress-item {
          margin-bottom: var(--spacing-md);
        }

        .progress-item span {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--glass-bg-light);
          border-radius: var(--radius-md);
        }

        .activity-item svg {
          color: var(--accent-primary);
        }

        .activity-item span {
          flex: 1;
          color: var(--text-secondary);
        }

        .activity-item time {
          color: var(--text-quaternary);
          font-size: 0.75rem;
        }

        /* 统计详情 */
        .profile-stats-detail {
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-lg);
        }

        .stats-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
        }

        .stats-category h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-lg);
        }

        .stats-items {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .stats-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--glass-bg-light);
          border-radius: var(--radius-md);
        }

        .stats-item svg {
          color: var(--accent-primary);
        }

        .stats-item span {
          flex: 1;
          color: var(--text-secondary);
        }

        .stats-item strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* 设置页面 */
        .profile-settings {
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-lg);
        }

        .settings-overview {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          background: var(--glass-bg-light);
          border-radius: var(--radius-lg);
        }

        .settings-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs);
        }

        .settings-info p {
          color: var(--text-secondary);
          margin: 0;
        }

        /* 表单样式 */
        .profile-form {
          max-width: 600px;
        }

        .form-label {
          color: var(--text-primary);
          font-weight: 500;
        }

        .profile-input,
        .profile-select,
        .profile-textarea {
          border-radius: var(--radius-md) !important;
          border: 2px solid var(--border-color) !important;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .profile-input:hover,
        .profile-select:hover,
        .profile-textarea:hover {
          border-color: var(--accent-primary) !important;
        }

        .profile-input:focus,
        .profile-select:focus,
        .profile-textarea:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px var(--primary-200) !important;
        }

        /* 模态框样式 */
        .profile-modal .ant-modal-content {
          background: var(--bg-glass-strong) !important;
          backdrop-filter: var(--blur-lg);
          -webkit-backdrop-filter: var(--blur-lg);
          border: 1px solid var(--glass-border) !important;
          border-radius: var(--liquid-border-radius-lg) !important;
          box-shadow: var(--glass-shadow-xl) !important;
        }

        .modal-title {
          color: var(--text-primary);
          font-weight: 600;
        }

        .modal-content {
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
        }

        .password-form {
          margin-top: var(--spacing-lg);
        }

        .modal-actions {
          margin-top: var(--spacing-xl);
          text-align: right;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .profile-header-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: var(--spacing-xl);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .overview-grid,
          .stats-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: var(--spacing-md);
          }

          .profile-header {
            padding: var(--spacing-xl);
          }

          .profile-name {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .profile-tabs {
            flex-direction: column;
            gap: var(--spacing-xs);
          }

          .profile-tab {
            justify-content: flex-start;
          }

          .profile-overview,
          .profile-stats-detail,
          .profile-settings {
            padding: var(--spacing-xl);
          }

          .settings-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
        }

        @media (max-width: 640px) {
          .profile-actions {
            width: 100%;
          }

          .profile-actions .glass-button {
            width: 100%;
          }

          .profile-meta {
            align-items: flex-start;
          }

          .modal-actions {
            text-align: center;
          }

          .modal-actions .ant-space {
            width: 100%;
            justify-content: center;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .profile-container,
          .profile-header,
          .profile-stats-section,
          .profile-tabs-section,
          .profile-content-section,
          .stat-card,
          .profile-tab,
          .profile-avatar-wrapper,
          .profile-blob {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
