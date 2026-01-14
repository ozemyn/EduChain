'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import './page.css';

interface CertificateVerifyData {
  valid: boolean;
  certificateId: string;
  message: string;
  verificationTime: string;
  blockIndex?: number;
  transactionHash?: string;
  timestamp?: string;
  knowledgeTitle?: string;
  userName?: string;
  contentHash?: string;
}

export default function CertificateVerifyPage() {
  const content = useIntlayer('certificate-verify-page');
  const params = useParams();
  const router = useRouter();
  const certificateId = params.certificateId as string;
  const [loading, setLoading] = useState(true);
  const [verifyData, setVerifyData] = useState<CertificateVerifyData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (certificateId) {
      verifyCertificate();
    }
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      // TODO: 调用实际API
      // 模拟数据
      setTimeout(() => {
        const isValid = Math.random() > 0.2; // 80% 概率有效
        
        setVerifyData({
          valid: isValid,
          certificateId: certificateId,
          message: isValid 
            ? '证书有效，内容已通过区块链存证验证' 
            : '证书无效或已过期',
          verificationTime: new Date().toISOString(),
          ...(isValid && {
            blockIndex: Math.floor(Math.random() * 10000) + 1000,
            transactionHash: '0x' + Math.random().toString(36).substring(2, 15),
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            knowledgeTitle: 'React Hooks 完全指南',
            userName: 'John Doe',
            contentHash: '0x' + Math.random().toString(36).substring(2, 15),
          }),
        });
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDownload = async () => {
    if (!verifyData?.valid) return;
    
    try {
      setDownloading(true);
      // TODO: 调用实际API下载证书
      console.log('Downloading certificate:', certificateId);
      setTimeout(() => {
        setDownloading(false);
      }, 100);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="certificate-verify-page">
          <div className="verify-background">
            <div className="verify-blob verify-blob-1" />
            <div className="verify-blob verify-blob-2" />
          </div>
          <div className="verify-container container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{content.verifying}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!verifyData) {
    return (
      <>
        <Navbar />
        <div className="certificate-verify-page">
          <div className="verify-background">
            <div className="verify-blob verify-blob-1" />
            <div className="verify-blob verify-blob-2" />
          </div>
          <div className="verify-container container">
            <div className="empty-state glass-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>{content.verifyFailed}</h3>
              <p>{content.verifyFailedDesc}</p>
              <button onClick={handleBack} className="back-btn glass-button hover-lift">
                {content.backBtn}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="certificate-verify-page">
        {/* 背景装饰 */}
        <div className="verify-background">
          <div className="verify-blob verify-blob-1" />
          <div className="verify-blob verify-blob-2" />
        </div>

        <div className="verify-container container">
          {/* 返回按钮 */}
          <button onClick={handleBack} className="back-button glass-button hover-lift">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {content.back}
          </button>

          {/* 验证结果卡片 */}
          <div className={`verify-result-card glass-card ${verifyData.valid ? 'valid' : 'invalid'}`}>
            <div className="result-icon">
              {verifyData.valid ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h1 className="result-title">
              {verifyData.valid ? content.valid : content.invalid}
            </h1>
            <p className="result-message">{verifyData.message}</p>
            
            {verifyData.valid && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="download-btn glass-button hover-lift"
              >
                {downloading ? (
                  <>
                    <div className="btn-spinner"></div>
                    {content.downloading}
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {content.download}
                  </>
                )}
              </button>
            )}
          </div>

          {/* 证书信息卡片 */}
          <div className="cert-info-card glass-card">
            <div className="card-header">
              <div className="header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="header-content">
                <h2 className="card-title">{content.certInfo.title}</h2>
                <p className="card-subtitle">{content.certInfo.subtitle}</p>
              </div>
            </div>

            <div className="cert-details">
              <div className="detail-row">
                <span className="detail-label">{content.certInfo.certificateId}:</span>
                <code className="detail-value">{verifyData.certificateId}</code>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.certInfo.status}:</span>
                <span className="detail-value">
                  <span className={`status-badge ${verifyData.valid ? 'valid' : 'invalid'}`}>
                    {verifyData.valid ? (
                      <>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {content.valid}
                      </>
                    ) : (
                      <>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {content.invalid}
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{content.certInfo.verificationTime}:</span>
                <span className="detail-value">
                  {new Date(verifyData.verificationTime).toLocaleString()}
                </span>
              </div>
              
              {verifyData.valid && (
                <>
                  {verifyData.blockIndex && (
                    <div className="detail-row">
                      <span className="detail-label">{content.certInfo.blockIndex}:</span>
                      <span className="detail-value">#{verifyData.blockIndex}</span>
                    </div>
                  )}
                  {verifyData.timestamp && (
                    <div className="detail-row">
                      <span className="detail-label">{content.certInfo.certTime}:</span>
                      <span className="detail-value">
                        {new Date(verifyData.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {verifyData.knowledgeTitle && (
                    <div className="detail-row">
                      <span className="detail-label">{content.certInfo.knowledge}:</span>
                      <span className="detail-value">{verifyData.knowledgeTitle}</span>
                    </div>
                  )}
                  {verifyData.userName && (
                    <div className="detail-row">
                      <span className="detail-label">{content.certInfo.author}:</span>
                      <span className="detail-value">{verifyData.userName}</span>
                    </div>
                  )}
                  {verifyData.contentHash && (
                    <div className="detail-row">
                      <span className="detail-label">{content.certInfo.contentHash}:</span>
                      <code className="detail-value hash">{verifyData.contentHash}</code>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 法律声明 */}
          {verifyData.valid && (
            <div className="legal-notice-card glass-card">
              <div className="notice-header">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>{content.legal.title}</h3>
              </div>
              <div className="notice-content">
                <p><strong>{content.legal.statement1}</strong></p>
                <p>{content.legal.statement2}</p>
                <p>{content.legal.statement3}</p>
                <p className="notice-footer">{content.legal.footer}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
