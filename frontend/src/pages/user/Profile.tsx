import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Divider,
  Statistic,
  Modal,
  Space,
  Tag,
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
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import type { User, UserStats } from '@/types/api';

const { Title, Text, Paragraph } = Typography;
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
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 左侧个人信息卡片 */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Upload {...uploadProps} showUploadList={false}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    size={120}
                    src={user.avatarUrl}
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#1890ff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid white',
                    }}
                  >
                    <CameraOutlined
                      style={{ color: 'white', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </Upload>

              <Title
                level={3}
                style={{ marginTop: '16px', marginBottom: '8px' }}
              >
                {user.fullName}
              </Title>

              <Space direction="vertical" size="small">
                <Text type="secondary">@{user.username}</Text>
                <Tag color="blue">等级 {user.level}</Tag>
                {user.role === 'ADMIN' && <Tag color="red">管理员</Tag>}
              </Space>
            </div>

            <Divider />

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>
                  <MailOutlined /> 邮箱
                </Text>
                <br />
                <Text type="secondary">{user.email}</Text>
              </div>

              {user.school && (
                <div>
                  <Text strong>
                    <BankOutlined /> 学校
                  </Text>
                  <br />
                  <Text type="secondary">{user.school}</Text>
                </div>
              )}

              <div>
                <Text strong>
                  <CalendarOutlined /> 注册时间
                </Text>
                <br />
                <Text type="secondary">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </div>

              {user.bio && (
                <div>
                  <Text strong>个人简介</Text>
                  <br />
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {user.bio}
                  </Paragraph>
                </div>
              )}
            </Space>

            <Divider />

            <Space style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditMode(true)}
                block
              >
                编辑资料
              </Button>
              <Button
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
                block
              >
                修改密码
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 右侧统计信息和编辑表单 */}
        <Col xs={24} lg={16}>
          {/* 统计数据 */}
          {userStats && (
            <Card title="我的统计" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="发布内容"
                    value={userStats.knowledgeCount}
                    prefix={<BookOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="获得点赞"
                    value={userStats.likeCount}
                    prefix={<HeartOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="总浏览量"
                    value={userStats.viewCount}
                    prefix={<EyeOutlined />}
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="收藏数"
                    value={userStats.favoriteCount}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic title="关注" value={userStats.followingCount} />
                </Col>
                <Col span={8}>
                  <Statistic title="粉丝" value={userStats.followerCount} />
                </Col>
              </Row>
            </Card>
          )}

          {/* 编辑个人信息表单 */}
          {editMode && (
            <Card title="编辑个人信息">
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
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
                  <Input placeholder="请输入真实姓名" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱！' },
                    { type: 'email', message: '请输入有效的邮箱地址！' },
                  ]}
                >
                  <Input placeholder="请输入邮箱地址" />
                </Form.Item>

                <Form.Item name="school" label="学校">
                  <Select
                    placeholder="请选择或输入学校名称"
                    showSearch
                    allowClear
                    optionFilterProp="children"
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
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存修改
                    </Button>
                    <Button onClick={() => setEditMode(false)}>取消</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>
      </Row>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码！' }]}
          >
            <Input.Password
              placeholder="请输入原密码"
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
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={passwordLoading}
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
