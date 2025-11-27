import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>欢迎来到 EduChain</Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          教育知识共享平台，为学习者和教育者提供便捷的知识分享、交流和学习环境
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/knowledge')}
          style={{ marginTop: '16px' }}
        >
          开始探索
        </Button>
      </div>

      {/* 功能介绍 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '100%' }}
            onClick={() => navigate('/knowledge')}
          >
            <BookOutlined
              style={{
                fontSize: '48px',
                color: '#1890ff',
                marginBottom: '16px',
              }}
            />
            <Title level={3}>知识库</Title>
            <Paragraph>
              浏览和发现各种教育内容，包括文本、图片、视频、PDF等多媒体资源
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '100%' }}
            onClick={() => navigate('/search')}
          >
            <SearchOutlined
              style={{
                fontSize: '48px',
                color: '#52c41a',
                marginBottom: '16px',
              }}
            />
            <Title level={3}>智能搜索</Title>
            <Paragraph>
              强大的全文搜索功能，快速找到您需要的知识内容和学习资源
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', height: '100%' }}
            onClick={() => navigate('/profile')}
          >
            <UserOutlined
              style={{
                fontSize: '48px',
                color: '#fa8c16',
                marginBottom: '16px',
              }}
            />
            <Title level={3}>个人中心</Title>
            <Paragraph>
              管理您的个人信息、发布的内容、收藏夹和关注的用户
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
