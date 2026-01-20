'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import { blockchainService } from '@/services';
import type { CertificateVerifyResult } from '@/types/blockchain';

export default function CertificateVerifyClient() {
  const content = useIntlayer('certificate-verify-page');
  const params = useParams();
  const router = useRouter();
  const certificateId = params.certificateId as string;
  const [loading, setLoading] = useState(true);
  const [verifyData, setVerifyData] = useState<CertificateVerifyResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (certificateId) {
      verifyCertificate();
    }
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await blockchainService.verifyCertificate(certificateId);
      if (response.success && response.data) {
        setVerifyData(response.data);
      }
    } catch (error) {
      console.error('Failed to verify certificate:', error);
    } finally {
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
      await blockchainService.downloadCertificate(certificateId);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
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
      </>
    );
  }

  if (!verifyData) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
              <code className="detail-value">{verifyData.certificate_id}</code>
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
                {verifyData.verification_time ? new Date(verifyData.verification_time).toLocaleString() : '-'}
              </span>
            </div>
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
    </>
  );
}
