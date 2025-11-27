import React from 'react';
import { Typography, Row, Col } from 'antd';
import { RecommendationList } from '@/components/recommendation';
import styles from './Recommendations.module.css';

const { Title, Paragraph } = Typography;

const Recommendations: React.FC = () => {
  return (
    <div className={styles.recommendationsPage}>
      <div className={styles.header}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>
            为您推荐
          </Title>
          <Paragraph className={styles.description}>
            基于您的兴趣和行为，为您精心挑选的优质内容
          </Paragraph>
        </div>
      </div>

      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <RecommendationList
              title=""
              showTabs={true}
              defaultTab="personalized"
              limit={20}
              compact={false}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Recommendations;
