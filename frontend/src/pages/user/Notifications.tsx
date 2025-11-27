import React from 'react';
import { Layout } from 'antd';
import { NotificationCenter } from '@/components/knowledge';

const { Content } = Layout;

const NotificationsPage: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <NotificationCenter />
        </div>
      </Content>
    </Layout>
  );
};

export default NotificationsPage;