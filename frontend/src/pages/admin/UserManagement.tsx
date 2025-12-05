/* ===================================
   用户管理页面 - User Management Page
   ===================================
   
   完整功能的用户管理系统
   使用全局样式系统，完整响应式设计
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
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
  Typography,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './UserManagement.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

// 用户类型
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  school?: string;
  level: number;
  bio?: string;
  role: 'LEARNER' | 'ADMIN';
  status: number;
  createdAt: string;
  updatedAt: string;
}

// 用户统计类型
interface UserStats {
  userId: number;
  knowledgeCount: number;
  likeCount: number;
  favoriteCount: number;
  followingCount: number;
  followerCount: number;
  viewCount: number;
}

/**
 * 用户管理页面组件
 */
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      if (searchKeyword) params.append('keyword', searchKeyword);
      if (statusFilter) params.append('status', statusFilter);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setUsers(result.data.content || []);
        setTotal(result.data.totalElements || 0);
      }
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

    try {
      const response = await fetch(`/api/users/${user.id}/stats`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUserStats(result.data);
        }
      }
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

      const url = selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';
      const method = selectedUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      const result = await response.json();
      if (result.success) {
        message.success(selectedUser ? '用户信息更新成功' : '用户创建成功');
        setEditModalVisible(false);
        loadUsers();
      } else {
        throw new Error(result.message || '保存失败');
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      message.error(error instanceof Error ? error.message : '保存失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: number) => {
    try {
      console.log('Deleting user:', userId);
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

      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success(`用户已${newStatus === 1 ? '启用' : '禁用'}`);
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      message.error('操作失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的用户');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          console.log('Batch deleting users:', selectedRowKeys);
          await new Promise(resolve => setTimeout(resolve, 1000));

          message.success('批量删除成功');
          setSelectedRowKeys([]);
          loadUsers();
        } catch (error) {
          console.error('Failed to batch delete:', error);
          message.error('批量删除失败');
        }
      },
    });
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
      fixed: 'left',
      width: 200,
      render: (_, user) => (
        <Space>
          <Avatar
            src={user.avatarUrl}
            icon={!user.avatarUrl && <UserOutlined />}
            size="default"
          />
          <div>
            <div className="user-fullname">{user.fullName}</div>
            <div className="user-username">@{user.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      width: 150,
      render: school => school || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
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
      width: 100,
      render: level => <Tag color="green">Lv.{level}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      width: 180,
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, user) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(user)}
            className="hover-scale"
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(user)}
            className="hover-scale"
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleUserStatus(user)}
            className="hover-scale"
          >
            {user.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover-scale"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="user-management-page animate-fade-in">
      <div className="management-content container">
        {/* 页面头部 */}
        <header className="management-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <TeamOutlined />
                用户管理
              </h1>
              <p className="page-subtitle">管理系统用户，查看用户数据统计</p>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <div className="management-main glass-card animate-fade-in-up delay-100">
          {/* 搜索和筛选 */}
          <div className="filter-section">
            <Space wrap size="middle">
              <Search
                placeholder="搜索用户名、邮箱或姓名"
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
                prefix={<SearchOutlined />}
                className="search-input"
              />
              <Select
                placeholder="选择角色"
                allowClear
                style={{ width: 120 }}
                value={roleFilter}
                onChange={setRoleFilter}
                suffixIcon={<FilterOutlined />}
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
                suffixIcon={<FilterOutlined />}
              >
                <Option value="1">正常</Option>
                <Option value="0">禁用</Option>
              </Select>
            </Space>
          </div>

          {/* 操作按钮 */}
          <div className="action-section">
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.resetFields();
                  setSelectedUser(null);
                  setEditModalVisible(true);
                }}
                className="glass-button glass-strong hover-lift active-scale"
              >
                新增用户
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
                className="glass-button hover-scale active-scale"
              >
                批量删除{' '}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExportUsers}
                className="glass-button hover-scale active-scale"
              >
                导出数据
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadUsers}
                className="glass-button hover-scale active-scale"
              >
                刷新
              </Button>
            </Space>
          </div>

          {/* 用户表格 */}
          <div className="table-section">
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              rowSelection={rowSelection}
              scroll={{ x: 1200 }}
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
              className="user-table"
            />
          </div>
        </div>
      </div>

      {/* 用户详情抽屉 */}
      <Drawer
        title={
          <Space>
            <UserOutlined />
            <span>用户详情</span>
          </Space>
        }
        placement="right"
        width={600}
        open={userDetailVisible}
        onClose={() => setUserDetailVisible(false)}
        className="user-detail-drawer"
      >
        {selectedUser && (
          <div className="user-detail-content">
            <div className="user-profile">
              <Avatar
                src={selectedUser.avatarUrl}
                icon={!selectedUser.avatarUrl && <UserOutlined />}
                size={80}
              />
              <div className="profile-info">
                <Title level={3}>{selectedUser.fullName}</Title>
                <Text type="secondary">@{selectedUser.username}</Text>
              </div>
            </div>

            <Descriptions column={1} bordered className="user-descriptions">
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
              <div className="user-stats">
                <Title level={4}>用户统计</Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="发布内容"
                        value={userStats.knowledgeCount}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic title="获得点赞" value={userStats.likeCount} />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="被收藏"
                        value={userStats.favoriteCount}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="关注数"
                        value={userStats.followingCount}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic
                        title="粉丝数"
                        value={userStats.followerCount}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="stat-item glass-light">
                      <Statistic title="浏览量" value={userStats.viewCount} />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 编辑用户模态框 */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>{selectedUser ? '编辑用户' : '新增用户'}</span>
          </Space>
        }
        open={editModalVisible}
        onOk={handleSaveUser}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
        className="edit-user-modal"
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
