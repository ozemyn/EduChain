import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Avatar,
  Typography,
  Space,
  Tabs,
  Empty,
  Spin,
  message,
  Input,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { interactionService } from '@/services';
import type { UserFollow } from '@/types';
import { formatDate } from '@/utils/format';
import FollowButton from './FollowButton';

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

interface FollowListProps {
  userId: number;
  currentUserId?: number;
  defaultTab?: 'following' | 'followers';
}

const FollowList: React.FC<FollowListProps> = ({
  userId,
  currentUserId,
  defaultTab = 'following',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [followingList, setFollowingList] = useState<UserFollow[]>([]);
  const [followersList, setFollowersList] = useState<UserFollow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    following: { current: 1, pageSize: 20, total: 0 },
    followers: { current: 1, pageSize: 20, total: 0 },
  });

  // 获取关注列表
  const fetchFollowing = async (page = 1, size = 20, _keyword = '') => {
    setLoading(true);
    try {
      const response = await interactionService.getFollowing(userId, {
        page: page - 1,
        size,
      });
      
      setFollowingList(response.data.content);
      setPagination(prev => ({
        ...prev,
        following: {
          current: page,
          pageSize: size,
          total: response.data.totalElements,
        },
      }));
    } catch (error) {
      message.error('获取关注列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取粉丝列表
  const fetchFollowers = async (page = 1, size = 20, _keyword = '') => {
    setLoading(true);
    try {
      const response = await interactionService.getFollowers(userId, {
        page: page - 1,
        size,
      });
      
      setFollowersList(response.data.content);
      setPagination(prev => ({
        ...prev,
        followers: {
          current: page,
          pageSize: size,
          total: response.data.totalElements,
        },
      }));
    } catch (error) {
      message.error('获取粉丝列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'following') {
      fetchFollowing();
    } else {
      fetchFollowers();
    }
  }, [userId, activeTab]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchKeyword('');
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    if (activeTab === 'following') {
      fetchFollowing(1, pagination.following.pageSize, value);
    } else {
      fetchFollowers(1, pagination.followers.pageSize, value);
    }
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize?: number) => {
    if (activeTab === 'following') {
      fetchFollowing(page, pageSize || pagination.following.pageSize, searchKeyword);
    } else {
      fetchFollowers(page, pageSize || pagination.followers.pageSize, searchKeyword);
    }
  };

  // 处理关注状态变化
  const handleFollowChange = (targetUserId: number, isFollowing: boolean) => {
    // 如果当前用户取消关注了某人，从关注列表中移除
    if (!isFollowing && activeTab === 'following' && currentUserId === userId) {
      setFollowingList(prev => prev.filter(item => item.following?.id !== targetUserId));
      setPagination(prev => ({
        ...prev,
        following: {
          ...prev.following,
          total: prev.following.total - 1,
        },
      }));
    }
  };

  const renderUserItem = (item: UserFollow) => {
    const user = activeTab === 'following' ? item.following : item.follower;
    if (!user) return null;

    return (
      <List.Item
        key={item.id}
        actions={[
          currentUserId && currentUserId !== user.id && (
            <FollowButton
              userId={user.id}
              size="small"
              onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
            />
          ),
        ].filter(Boolean)}
      >
        <List.Item.Meta
          avatar={
            <Link to={`/user/${user.id}`}>
              <Avatar src={user.avatarUrl} alt={user.fullName}>
                {user.fullName?.charAt(0)}
              </Avatar>
            </Link>
          }
          title={
            <Space>
              <Link to={`/user/${user.id}`}>
                <Text strong>{user.fullName}</Text>
              </Link>
              <Text type="secondary">@{user.username}</Text>
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {user.bio && (
                <Text type="secondary" ellipsis={{ tooltip: user.bio }}>
                  {user.bio}
                </Text>
              )}
              {user.school && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user.school}
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {activeTab === 'following' ? '关注于' : '关注你于'} {formatDate(item.createdAt)}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  const currentList = activeTab === 'following' ? followingList : followersList;
  const currentPagination = pagination[activeTab as keyof typeof pagination];

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>
          <TeamOutlined /> 关注关系
        </Title>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <Space>
              <HeartOutlined />
              关注 ({pagination.following.total})
            </Space>
          }
          key="following"
        />
        <TabPane
          tab={
            <Space>
              <UserOutlined />
              粉丝 ({pagination.followers.total})
            </Space>
          }
          key="followers"
        />
      </Tabs>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder={`搜索${activeTab === 'following' ? '关注的用户' : '粉丝'}`}
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      <Spin spinning={loading}>
        {currentList.length > 0 ? (
          <List
            dataSource={currentList}
            renderItem={renderUserItem}
            pagination={{
              current: currentPagination.current,
              pageSize: currentPagination.pageSize,
              total: currentPagination.total,
              onChange: handlePageChange,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 个用户`,
            }}
          />
        ) : (
          <Empty
            description={`暂无${activeTab === 'following' ? '关注的用户' : '粉丝'}`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </Card>
  );
};

export default FollowList;