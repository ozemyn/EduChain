import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const CreateKnowledge: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>发布内容</Title>
      <p>发布内容功能将在后续任务中实现</p>
    </div>
  );
};

export default CreateKnowledge;
