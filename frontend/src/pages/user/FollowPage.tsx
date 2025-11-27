import React from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import { FollowList } from '@/components/knowledge';
import { useAuth } from '@/contexts/AuthContext';

const { Content } = Layout;

const FollowPage: React.FC = () => {
  const { userId, tab = 'following' } = useParams<{
    userId?: string;
    tab?: 'following' | 'followers';
  }>();
  const { user } = useAuth();

  const targetUserId = userId ? parseInt(userId, 10) : user?.id;

  if (!targetUserId) {
    return <div>用户不存在</div>;
  }

  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <FollowList
            userId={targetUserId}
            currentUserId={user?.id}
            defaultTab={tab}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FollowPage;