import React from 'react';
import { Typography, Row, Col, Card, Space, Tag, Button } from 'antd';
import {
  TeamOutlined,
  MessageOutlined,
  FireOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './Community.module.css';

const { Title, Paragraph } = Typography;

const Community: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.communityPage}>
      <div className={styles.header}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>
            <TeamOutlined /> 学习社区
          </Title>
          <Paragraph className={styles.description}>
            与全球学习者互动交流，分享知识与经验，共同成长
          </Paragraph>
        </div>
      </div>

      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className={styles.mainCard}>
              <Title level={4}>热门讨论</Title>
              <Paragraph type="secondary">
                社区功能正在开发中，敬请期待...
              </Paragraph>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className={styles.placeholder}>
                  <MessageOutlined style={{ fontSize: '48px', color: 'var(--text-quaternary)' }} />
                  <p>讨论功能即将上线</p>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card className={styles.sideCard}>
                <Title level={5}>
                  <FireOutlined /> 热门话题
                </Title>
                <Space wrap>
                  <Tag>前端开发</Tag>
                  <Tag>后端开发</Tag>
                  <Tag>算法学习</Tag>
                  <Tag>设计模式</Tag>
                  <Tag>机器学习</Tag>
                </Space>
              </Card>

              <Card className={styles.sideCard}>
                <Title level={5}>
                  <UserOutlined /> 活跃用户
                </Title>
                <Paragraph type="secondary">
                  社区功能正在开发中...
                </Paragraph>
              </Card>

              <Card className={styles.sideCard}>
                <Title level={5}>快速入口</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button block onClick={() => navigate('/knowledge')}>
                    浏览知识库
                  </Button>
                  <Button block onClick={() => navigate('/recommendations')}>
                    查看推荐
                  </Button>
                  <Button block onClick={() => navigate('/search')}>
                    搜索内容
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Community;

