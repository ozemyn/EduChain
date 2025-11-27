import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>个人中心</Title>
      <p>个人中心功能将在后续任务中实现</p>
    </div>
  );
};

export default Profile;
