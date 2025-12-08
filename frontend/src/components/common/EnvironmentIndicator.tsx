import React from 'react';
import { Tag } from 'antd';
import { ExperimentOutlined, CloudOutlined } from '@ant-design/icons';
import { USE_MOCK } from '@/mock';

/**
 * 环境指示器组件
 * 显示当前运行环境（Mock模式或生产模式）
 */
const EnvironmentIndicator: React.FC = () => {
  if (!USE_MOCK) {
    return null; // 生产模式下不显示
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Tag
        icon={USE_MOCK ? <ExperimentOutlined /> : <CloudOutlined />}
        color={USE_MOCK ? 'orange' : 'green'}
        style={{
          fontSize: '12px',
          fontWeight: 500,
          padding: '4px 8px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {USE_MOCK ? 'Mock 模式' : '生产模式'}
      </Tag>
    </div>
  );
};

export default EnvironmentIndicator;
