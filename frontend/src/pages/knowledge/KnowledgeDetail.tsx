import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const KnowledgeDetail: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>知识详情</Title>
      <p>知识详情功能将在后续任务中实现</p>
    </div>
  );
};

export default KnowledgeDetail;
