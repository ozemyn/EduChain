import React from 'react';
import { Layout, Row, Col } from 'antd';
import { ActivityTimeline } from '@/components/knowledge';
import { useAuth } from '@/contexts/AuthContext';

const { Content } = Layout;

const ActivityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <ActivityTimeline title="关注动态" showRefresh={true} />
          </Col>
          <Col xs={24} lg={8}>
            <ActivityTimeline
              userId={user?.id}
              title="我的动态"
              showRefresh={false}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ActivityPage;
