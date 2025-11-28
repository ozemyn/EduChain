import React from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';

interface LoadingProps extends SpinProps {
  height?: string | number;
  tip?: string;
}

const Loading: React.FC<LoadingProps> = ({
  height = '200px',
  tip = '加载中...',
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width: '100%',
      }}
    >
      <Spin size="large" {...props}>
        <div style={{ padding: '20px' }}>{tip}</div>
      </Spin>
    </div>
  );
};

export default Loading;
