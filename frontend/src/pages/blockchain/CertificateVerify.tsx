import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Result, Button, Descriptions, Tag, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { blockchainService } from '../../services/blockchain';
import './CertificateVerify.css';

interface CertificateVerifyData {
  valid: boolean;
  certificate_id: string;
  message: string;
  verification_time?: string;
}

/**
 * 证书验证页面
 * 通过证书ID验证证书的有效性，并显示证书相关信息
 */
const CertificateVerify: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verifyData, setVerifyData] = useState<CertificateVerifyData | null>(
    null
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (certificateId) {
      verifyCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificateId]);

  /**
   * 验证证书
   */
  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await blockchainService.verifyCertificate(
        certificateId!
      );

      if (response.code === '200' && response.data) {
        setVerifyData(response.data);

        // 如果证书有效，尝试获取更多信息
        if (response.data.valid) {
          // 这里可以根据需要获取更多证书信息
          // 暂时不实现，因为需要知识ID
        }
      } else {
        message.error(response.message || '验证失败');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      message.error('验证证书时发生错误');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 下载证书
   */
  const handleDownload = async () => {
    try {
      setDownloading(true);
      await blockchainService.downloadCertificate(certificateId!);
      message.success('证书下载成功');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      message.error('下载证书失败');
    } finally {
      setDownloading(false);
    }
  };

  /**
   * 返回上一页
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="certificate-verify-container">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 20 }}>正在验证证书...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!verifyData) {
    return (
      <div className="certificate-verify-container">
        <Card>
          <Result
            status="error"
            title="验证失败"
            subTitle="无法验证该证书，请检查证书ID是否正确"
            extra={
              <Button type="primary" onClick={handleGoBack}>
                返回
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="certificate-verify-container">
      <Card
        title={
          <div className="certificate-verify-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              style={{ marginRight: 16 }}
            >
              返回
            </Button>
            <span>证书验证</span>
          </div>
        }
        extra={
          verifyData.valid && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={downloading}
              onClick={handleDownload}
            >
              下载证书
            </Button>
          )
        }
      >
        {/* 验证结果 */}
        <Result
          status={verifyData.valid ? 'success' : 'error'}
          icon={
            verifyData.valid ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )
          }
          title={
            <div className="verify-result-title">
              {verifyData.valid ? '证书有效' : '证书无效'}
            </div>
          }
          subTitle={verifyData.message}
        />

        {/* 证书信息 */}
        <Card
          type="inner"
          title="证书信息"
          style={{ marginTop: 24 }}
          className="certificate-info-card"
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="证书编号">
              <Tag color="blue">{verifyData.certificate_id}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="验证状态">
              {verifyData.valid ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  有效
                </Tag>
              ) : (
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  无效
                </Tag>
              )}
            </Descriptions.Item>

            {verifyData.verification_time && (
              <Descriptions.Item label="验证时间">
                {new Date(verifyData.verification_time).toLocaleString('zh-CN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* 法律声明 */}
        {verifyData.valid && (
          <Card
            type="inner"
            title="法律声明"
            style={{ marginTop: 24 }}
            className="legal-notice-card"
          >
            <div className="legal-notice">
              <p>
                <strong>此证书证明该内容已存证于EduChain区块链</strong>
              </p>
              <p>
                本证书由EduChain教育知识共享平台区块链存证系统自动生成，
                证明相关内容的哈希值和时间戳已被永久记录在区块链上，具有不可篡改性。
              </p>
              <p>
                本证书可作为内容所有权和创建时间的证明，但不代表对内容本身的质量、
                准确性或合法性的认可。内容的版权归原作者所有。
              </p>
              <p className="legal-notice-footer">
                EduChain平台 - 教育内容区块链存证系统
              </p>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default CertificateVerify;
