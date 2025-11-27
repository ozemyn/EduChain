import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const KnowledgeList: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>知识库</Title>
      <p>知识库功能将在后续任务中实现</p>
    </div>
  );
};

export default KnowledgeList;
