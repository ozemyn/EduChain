import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Modal,
  Form,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, UserStats } from '@/types/api';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// 用户管理页面组件
const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [form] = Form.useForm();

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟用户数据
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'zhangsan',
          email: 'zhangsan@example.com',
          fullName: '张三',
          avatarUrl: undefined,
          school: '清华大学',
          level: 5,
          bio: '热爱学习的程序员',
          role: 'LEARNER',
          status: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
        {
          id: 2,
          username: 'lisi',
          email: 'lisi@example.com',
          fullName: '李四',
          avatarUrl: undefined,
          school: '北京大学',
          level: 3,
          bio: '前端开发工程师',
          role: 'LEARNER',
          status: 1,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
        },
        {
          id: 3,
          username: 'admin',
          email: 'admin@example.com',
          fullName: '管理员',
          avatarUrl: undefined,
          school: undefined,
          level: 10,
          bio: '系统管理员',
          role: 'ADMIN',
          status: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
        },
      ];

      setUsers(mockUsers);
      setTotal(mockUsers.length);
    } catch (error) {
      console.error('Failed to load users:', error);
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchKeyword, statusFilter, roleFilter]);

  // 查看用户详情
  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setUserDetailVisible(true);

    // 加载用户统计数据
    try {
      // 模拟API调用
      const mockStats: UserStats = {
        userId: user.id,
        knowledgeCount: 25,
        likeCount: 156,
        favoriteCount: 89,
        followingCount: 45,
        followerCount: 123,
        viewCount: 2345,
      };
      setUserStats(mockStats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      school: user.school,
      role: user.role,
      status: user.status,
      bio: user.bio,
    });
    setEditModalVisible(true);
  };

  // 保存用户编辑
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      console.log('Saving user:', values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('用户信息更新成功');
      setEditModalVisible(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      message.error('保存失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: number) => {
    try {
      console.log('Deleting user:', userId);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('用户删除成功');
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('删除失败');
    }
  };

  // 禁用/启用用户
  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      console.log(`Toggle user ${user.id} status to ${newStatus}`);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success(`用户已${newStatus === 1 ? '启用' : '禁用'}`);
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      message.error('操作失败');
    }
  };

  // 导出用户数据
  const handleExportUsers = () => {
    message.info('导出功能开发中...');
  };

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户',
      key: 'user',
      render: (_, user) => (
        <Space>
          <Avatar
            src={user.avatarUrl}
            icon={!user.avatarUrl && <UserOutlined />}
            size="small"
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{user.fullName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              @{user.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      render: school => school || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? '管理员' : '学习者'}
        </Tag>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: level => <Tag color="green">Lv.{level}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, user) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(user)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(user)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleUserStatus(user)}
          >
            {user.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Search
              placeholder="搜索用户名、邮箱或姓名"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchKeyword}
            />
            <Select
              placeholder="选择角色"
              allowClear
              style={{ width: 120 }}
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Option value="LEARNER">学习者</Option>
              <Option value="ADMIN">管理员</Option>
            </Select>
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setSelectedUser(null);
                setEditModalVisible(true);
              }}
            >
              新增用户
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExportUsers}>
              导出数据
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadUsers}>
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        width={600}
        open={userDetailVisible}
        onClose={() => setUserDetailVisible(false)}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar
                src={selectedUser.avatarUrl}
                icon={!selectedUser.avatarUrl && <UserOutlined />}
                size={80}
              />
              <div style={{ marginTop: '8px' }}>
                <h3>{selectedUser.fullName}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>@{selectedUser.username}</p>
              </div>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="邮箱">
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="学校">
                {selectedUser.school || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                <Tag color={selectedUser.role === 'ADMIN' ? 'red' : 'blue'}>
                  {selectedUser.role === 'ADMIN' ? '管理员' : '学习者'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="等级">
                <Tag color="green">Lv.{selectedUser.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedUser.status === 1 ? 'green' : 'red'}>
                  {selectedUser.status === 1 ? '正常' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="个人简介">
                {selectedUser.bio || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {dayjs(selectedUser.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(selectedUser.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            {userStats && (
              <div style={{ marginTop: '24px' }}>
                <h4>用户统计</h4>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="发布内容"
                      value={userStats.knowledgeCount}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic title="获得点赞" value={userStats.likeCount} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="被收藏" value={userStats.favoriteCount} />
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '16px' }}>
                  <Col span={8}>
                    <Statistic
                      title="关注数"
                      value={userStats.followingCount}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic title="粉丝数" value={userStats.followerCount} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="浏览量" value={userStats.viewCount} />
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 编辑用户模态框 */}
      <Modal
        title={selectedUser ? '编辑用户' : '新增用户'}
        open={editModalVisible}
        onOk={handleSaveUser}
        onCancel={() => setEditModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 1,
            role: 'LEARNER',
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item name="school" label="学校">
            <Input placeholder="请输入学校" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="LEARNER">学习者</Option>
              <Option value="ADMIN">管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>正常</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item name="bio" label="个人简介">
            <Input.TextArea
              rows={3}
              placeholder="请输入个人简介"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
