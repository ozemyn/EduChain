import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  message,
  Modal,
  Spin,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blockchainService } from '../../services/blockchain';
import type { CertificateInfo, VerifyResponse } from '../../types/blockchain';
import './BlockchainCertInfo.css';

interface BlockchainCertInfoProps {
  knowledgeId: number;
  knowledgeTitle: string;
  userId: number;
  userName: string;
  contentHash?: string;
}

/**
 * 区块链存证信息卡片组件
 * 显示知识内容的区块链存证状态和相关信息
 */
const BlockchainCertInfo: React.FC<BlockchainCertInfoProps> = ({
  knowledgeId,
  knowledgeTitle,
  userId,
  userName,
  contentHash,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [verifying, setVerifying] = useState(false);
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
      // 如果没有找到证书信息，不显示错误，只是不显示卡片
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
        // 重新加载证书信息
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
   * 下载证书
   */
  const handleDownloadCertificate = async () => {
    if (!certInfo) return;

    try {
      setDownloading(true);
      // 首先生成证书（如果还没有生成）
      const response = await blockchainService.createCertificate({
        knowledge_id: knowledgeId,
        knowledge_title: knowledgeTitle,
        user_id: userId,
        user_name: userName,
      });

      if (response.success && response.data) {
        // 下载证书
        await blockchainService.downloadCertificate(
          response.data.certificate_id
        );
        message.success('证书下载成功');
      } else {
        message.error(response.message || '下载证书失败');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      message.error('下载证书时发生错误');
    } finally {
      setDownloading(false);
    }
  };

  /**
   * 查看区块链详情
   */
  const handleViewBlockchain = () => {
    if (certInfo) {
      navigate(`/blockchain/transaction/${knowledgeId}`);
    }
  };

  /**
   * 验证内容
   */
  const handleVerifyContent = async () => {
    if (!certInfo || !contentHash) {
      message.warning('无法验证：缺少内容哈希');
      return;
    }

    try {
      setVerifying(true);
      const response = await blockchainService.verifyContent({
        knowledge_id: knowledgeId,
        content_hash: contentHash,
      });

      if (response.success && response.data) {
        const { is_valid } = response.data as VerifyResponse;

        Modal.success({
          title: is_valid ? '验证成功' : '验证失败',
          content: is_valid
            ? '内容哈希与区块链记录一致，内容未被篡改。'
            : '内容哈希与区块链记录不一致，内容可能已被修改。',
          icon: is_valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
        });
      } else {
        message.error(response.message || '验证失败');
      }
    } catch (error) {
      console.error('Error verifying content:', error);
      message.error('验证内容时发生错误');
    } finally {
      setVerifying(false);
    }
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <Card
        title={
          <Space>
            <SafetyOutlined />
            <span>区块链存证信息</span>
          </Space>
        }
        className="blockchain-cert-info-card"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
          <p style={{ marginTop: 10, color: '#999' }}>加载存证信息...</p>
        </div>
      </Card>
    );
  }

  // 如果没有证书信息，显示未存证状态
  if (!certInfo) {
    return (
      <Card
        title={
          <Space>
            <SafetyOutlined />
            <span>区块链存证信息</span>
          </Space>
        }
        className="blockchain-cert-info-card"
      >
        <div className="no-cert-info">
          <CloseCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          <p style={{ marginTop: 16, color: '#999' }}>
            该内容尚未进行区块链存证
          </p>
          <Button
            type="primary"
            icon={<SafetyOutlined />}
            loading={generating}
            onClick={handleGenerateCertificate}
            style={{ marginTop: 16 }}
          >
            立即存证
          </Button>
        </div>
      </Card>
    );
  }

  // 显示存证信息
  return (
    <Card
      title={
        <Space>
          <SafetyOutlined />
          <span>区块链存证信息</span>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已存证
          </Tag>
        </Space>
      }
      className="blockchain-cert-info-card"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={handleDownloadCertificate}
          >
            下载证书
          </Button>
        </Space>
      }
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span>存证状态</span>
            </Space>
          }
        >
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已存证
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <ClockCircleOutlined />
              <span>存证时间</span>
            </Space>
          }
        >
          {new Date(certInfo.timestamp).toLocaleString('zh-CN')}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <LinkOutlined />
              <span>区块索引</span>
            </Space>
          }
        >
          <Space>
            <Tag color="blue">#{certInfo.block_index}</Tag>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={handleViewBlockchain}
            >
              在区块链浏览器中查看
            </Button>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="内容哈希">
          <div className="hash-display">{certInfo.content_hash}</div>
        </Descriptions.Item>

        <Descriptions.Item label="区块哈希">
          <div className="hash-display">{certInfo.block_hash}</div>
        </Descriptions.Item>
      </Descriptions>

      <div className="cert-actions">
        <Space size="middle">
          <Button
            icon={<SafetyOutlined />}
            loading={verifying}
            onClick={handleVerifyContent}
          >
            验证内容
          </Button>
          <Button icon={<EyeOutlined />} onClick={handleViewBlockchain}>
            查看详情
          </Button>
        </Space>
      </div>

      <div className="cert-notice">
        <p>
          <SafetyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          此内容已通过区块链技术进行存证，内容哈希和时间戳已被永久记录，具有不可篡改性。
        </p>
      </div>
    </Card>
  );
};

export default BlockchainCertInfo;
