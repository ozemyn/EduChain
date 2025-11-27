import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>登录页面</Title>
      <p>登录功能将在后续任务中实现</p>
    </div>
  );
};

export default Login;
