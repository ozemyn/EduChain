import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Register: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>注册页面</Title>
      <p>注册功能将在后续任务中实现</p>
    </div>
  );
};

export default Register;
