import React from 'react';
import { Steps, Card, Alert, Button, Space } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  SafetyOutlined,
  FileProtectOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import './CertificationProgress.css';

export const CertificationStep = {
  UPLOADING: 0, // 内容上传
  HASHING: 1, // 计算哈希
  CERTIFYING: 2, // 区块链存证
  GENERATING: 3, // 生成证书
  COMPLETED: 4, // 完成
} as const;

export type CertificationStep =
  (typeof CertificationStep)[keyof typeof CertificationStep];

export const CertificationStatus = {
  PENDING: 'wait',
  IN_PROGRESS: 'process',
  SUCCESS: 'finish',
  ERROR: 'error',
} as const;

export type CertificationStatus =
  (typeof CertificationStatus)[keyof typeof CertificationStatus];

interface CertificationProgressProps {
  currentStep: CertificationStep;
  status: CertificationStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onDownloadCertificate?: () => void;
  onViewDetail?: () => void;
}

/**
 * 存证进度组件
 * 显示内容上传到存证完成的整个过程
 */
const CertificationProgress: React.FC<CertificationProgressProps> = ({
  currentStep,
  status,
  errorMessage,
  onRetry,
  onDownloadCertificate,
  onViewDetail,
}) => {
  // 定义存证步骤
  const steps = [
    {
      title: '内容上传',
      description: '正在上传知识内容...',
      icon: <CloudUploadOutlined />,
    },
    {
      title: '计算哈希',
      description: '正在计算内容哈希值...',
      icon: <FileProtectOutlined />,
    },
    {
      title: '区块链存证',
      description: '正在将哈希记录到区块链...',
      icon: <SafetyOutlined />,
    },
    {
      title: '生成证书',
      description: '正在生成存证证书...',
      icon: <CheckOutlined />,
    },
    {
      title: '完成',
      description: '存证完成！',
      icon: <CheckCircleOutlined />,
    },
  ];

  // 获取步骤状态
  const getStepStatus = (stepIndex: number) => {
    if (status === CertificationStatus.ERROR && stepIndex === currentStep) {
      return 'error';
    }
    if (stepIndex < currentStep) {
      return 'finish';
    }
    if (stepIndex === currentStep) {
      return status === CertificationStatus.SUCCESS ? 'finish' : 'process';
    }
    return 'wait';
  };

  // 获取步骤图标
  const getStepIcon = (stepIndex: number) => {
    const stepStatus = getStepStatus(stepIndex);

    if (stepStatus === 'error') {
      return <CloseCircleOutlined />;
    }
    if (stepStatus === 'process') {
      return <LoadingOutlined />;
    }
    if (stepStatus === 'finish') {
      return <CheckCircleOutlined />;
    }
    return steps[stepIndex].icon;
  };

  return (
    <Card className="certification-progress-card" bordered={false}>
      <div className="progress-header">
        <h3>区块链存证进度</h3>
        {status === CertificationStatus.IN_PROGRESS && (
          <span className="progress-status processing">
            <LoadingOutlined spin /> 正在处理...
          </span>
        )}
        {status === CertificationStatus.SUCCESS &&
          currentStep === CertificationStep.COMPLETED && (
            <span className="progress-status success">
              <CheckCircleOutlined /> 存证成功
            </span>
          )}
        {status === CertificationStatus.ERROR && (
          <span className="progress-status error">
            <CloseCircleOutlined /> 存证失败
          </span>
        )}
      </div>

      <Steps
        current={currentStep}
        status={status === CertificationStatus.ERROR ? 'error' : undefined}
        className="certification-steps"
        items={steps.map((step, index) => ({
          title: step.title,
          description:
            index === currentStep && status === CertificationStatus.IN_PROGRESS
              ? step.description
              : undefined,
          icon: getStepIcon(index),
          status: getStepStatus(index),
        }))}
      />

      {/* 错误提示 */}
      {status === CertificationStatus.ERROR && errorMessage && (
        <Alert
          message="存证失败"
          description={errorMessage}
          type="error"
          showIcon
          className="error-alert"
          action={
            onRetry && (
              <Button size="small" danger onClick={onRetry}>
                重试
              </Button>
            )
          }
        />
      )}

      {/* 成功提示和操作 */}
      {status === CertificationStatus.SUCCESS &&
        currentStep === CertificationStep.COMPLETED && (
          <div className="success-actions">
            <Alert
              message="存证成功"
              description="您的内容已成功存证到区块链，内容哈希和时间戳已被永久记录。"
              type="success"
              showIcon
              className="success-alert"
            />
            <Space size="middle" className="action-buttons">
              {onDownloadCertificate && (
                <Button type="primary" onClick={onDownloadCertificate}>
                  下载存证证书
                </Button>
              )}
              {onViewDetail && <Button onClick={onViewDetail}>查看详情</Button>}
            </Space>
          </div>
        )}

      {/* 进度说明 */}
      <div className="progress-info">
        <p className="info-text">
          <SafetyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          区块链存证可以证明您的内容创作时间和原创性，具有法律效力。
        </p>
      </div>
    </Card>
  );
};

export default CertificationProgress;
