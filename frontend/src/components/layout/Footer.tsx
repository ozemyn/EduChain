import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { GithubOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f5f5f5',
        padding: '24px 50px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Space split={<Divider type="vertical" />} size="large">
          <Link href="mailto:contact@educhain.com">
            <MailOutlined /> 联系我们
          </Link>
          <Link href="tel:400-123-4567">
            <PhoneOutlined /> 400-123-4567
          </Link>
          <Link href="https://github.com/educhain" target="_blank">
            <GithubOutlined /> GitHub
          </Link>
        </Space>

        <Divider />

        <div>
          <Text type="secondary">
            EduChain 教育知识共享平台 ©2024 Created by EduChain Team
          </Text>
        </div>

        <div style={{ marginTop: '8px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            致力于为学习者和教育者提供便捷的知识分享、交流和学习环境
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
