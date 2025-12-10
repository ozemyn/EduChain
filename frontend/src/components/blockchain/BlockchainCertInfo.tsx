import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Space, message, Spin, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blockchainService } from '../../services/blockchain';
import type { CertificateInfo } from '../../types/blockchain';
import './BlockchainCertInfo.css';

interface BlockchainCertInfoProps {
  knowledgeId: number;
  knowledgeTitle: string;
  userId: number;
  userName: string;
  contentHash?: string;
}

/**
 * 区块链存证状态组件（简洁版）
 * 在知识详情页面侧边栏显示存证状态，点击跳转到详细页面
 */
const BlockchainCertInfo: React.FC<BlockchainCertInfoProps> = ({
  knowledgeId,
  knowledgeTitle,
  userId,
  userName,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCertificateInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeId]);

  /**
   * 加载证书信息
   */
  const loadCertificateInfo = async () => {
    try {
      setLoading(true);
      const response =
        await blockchainService.getCertificateByKnowledge(knowledgeId);

      if (response.success && response.data) {
        setCertInfo(response.data as CertificateInfo);
      }
    } catch (error) {
      console.error('Error loading certificate info:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 生成证书
   */
  const handleGenerateCertificate = async () => {
    try {
      setGenerating(true);
      const response = await blockchainService.createCertificate({
        knowledge_id: knowledgeId,
        knowledge_title: knowledgeTitle,
        user_id: userId,
        user_name: userName,
      });

      if (response.success && response.data) {
        message.success('证书生成成功');
        await loadCertificateInfo();
      } else {
        message.error(response.message || '证书生成失败');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      message.error('生成证书时发生错误');
    } finally {
      setGenerating(false);
    }
  };

  /**
   * 查看区块链详情
   */
  const handleViewDetails = () => {
    navigate(`/blockchain/transaction/${knowledgeId}`);
  };

  /**
   * 下载证书
   */
  const handleDownloadCertificate = async () => {
    if (!certInfo) return;

    try {
      await blockchainService.downloadCertificate(certInfo.certificate_id);
      message.success('证书下载成功');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      message.error('下载证书时发生错误');
    }
  };

  // 加载状态
  if (loading) {
    return (
      <Card
        title={
          <Space>
            <SafetyOutlined />
            <span>区块链存证</span>
          </Space>
        }
        className="blockchain-cert-card"
        size="small"
      >
        <div className="cert-loading">
          <Spin size="small" />
          <span>加载中...</span>
        </div>
      </Card>
    );
  }

  // 未存证状态
  if (!certInfo) {
    return (
      <Card
        title={
          <Space>
            <SafetyOutlined />
            <span>区块链存证</span>
          </Space>
        }
        className="blockchain-cert-card"
        size="small"
      >
        <div className="cert-status">
          <div className="status-info">
            <CloseCircleOutlined className="status-icon not-certified" />
            <div className="status-text">
              <div className="status-title">未存证</div>
              <div className="status-desc">该内容尚未进行区块链存证</div>
            </div>
          </div>
          <Button
            type="primary"
            size="small"
            icon={<SafetyOutlined />}
            loading={generating}
            onClick={handleGenerateCertificate}
            className="cert-action-btn"
          >
            立即存证
          </Button>
        </div>
      </Card>
    );
  }

  // 已存证状态
  return (
    <Card
      title={
        <Space>
          <SafetyOutlined />
          <span>区块链存证</span>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已存证
          </Tag>
        </Space>
      }
      className="blockchain-cert-card certified"
      size="small"
    >
      <div className="cert-status">
        <div className="status-info">
          <CheckCircleOutlined className="status-icon certified" />
          <div className="status-text">
            <div className="status-title">存证完成</div>
            <div className="status-desc">
              <Tooltip
                title={new Date(certInfo.timestamp).toLocaleString('zh-CN')}
              >
                <Space size={4}>
                  <ClockCircleOutlined />
                  <span>
                    {new Date(certInfo.timestamp).toLocaleDateString('zh-CN')}
                  </span>
                </Space>
              </Tooltip>
            </div>
            <div className="status-block">区块 #{certInfo.block_index}</div>
          </div>
        </div>

        <div className="cert-actions">
          <Space orientation="vertical" size={8}>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={handleViewDetails}
              className="cert-action-btn"
              block
            >
              查看详情
            </Button>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleDownloadCertificate}
              className="cert-action-btn"
              block
            >
              下载证书
            </Button>
          </Space>
        </div>
      </div>

      <div className="cert-notice">
        <SafetyOutlined />
        <span>内容已通过区块链技术存证，具有不可篡改性</span>
      </div>
    </Card>
  );
};

export default BlockchainCertInfo;
