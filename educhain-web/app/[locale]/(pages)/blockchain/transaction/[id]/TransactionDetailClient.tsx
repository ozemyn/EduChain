'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { blockchainService } from '@/services';
import type { Transaction } from '@/types/blockchain';

export default function TransactionDetailClient() {
  const content = useIntlayer('transaction-detail-page');
  const params = useParams();
  const router = useRouter();
  const txId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (txId) {
      loadTransactionDetail();
    }
  }, [txId]);

  const loadTransactionDetail = async () => {
    try {
      setLoading(true);
      const response = await blockchainService.getTransaction(txId);
      if (response.success && response.data) {
        setTransaction(response.data);
      }
    } catch (error) {
      console.error('Failed to load transaction detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getTypeColor = (type: string) => {
    const colors = {
      KNOWLEDGE_CERTIFICATION: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)' },
      ACHIEVEMENT: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' },
      COPYRIGHT: { bg: 'rgba(168, 85, 247, 0.1)', color: 'rgb(168, 85, 247)' },
    };
    return colors[type as keyof typeof colors] || colors.KNOWLEDGE_CERTIFICATION;
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, { zh: string; en: string }> = {
      KNOWLEDGE_CERTIFICATION: { zh: '知识存证', en: 'Knowledge Certification' },
      ACHIEVEMENT: { zh: '成就认证', en: 'Achievement' },
      COPYRIGHT: { zh: '版权登记', en: 'Copyright' },
    };
    return typeMap[type] || typeMap.KNOWLEDGE_CERTIFICATION;
  };

  if (loading) {
    return (
      <>
        <div className="tx-background">
          <div className="tx-blob tx-blob-1" />
          <div className="tx-blob tx-blob-2" />
        </div>
        <div className="tx-container container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{content.loading}</p>
          </div>
        </div>
      </>
    );
  }

  if (!transaction) {
    return (
      <>
        <div className="tx-background">
          <div className="tx-blob tx-blob-1" />
          <div className="tx-blob tx-blob-2" />
        </div>
        <div className="tx-container container">
          <div className="empty-state glass-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>{content.notFound}</h3>
            <p>{content.notFoundDesc}</p>
            <button onClick={handleBack} className="back-btn glass-button hover-lift">
              {content.backBtn}
            </button>
          </div>
        </div>
      </>
    );
  }

  const typeStyle = getTypeColor(transaction.type);
  const typeText = getTypeText(transaction.type);

  return (
    <>
      {/* 背景装饰 */}
      <div className="tx-background">
        <div className="tx-blob tx-blob-1" />
        <div className="tx-blob tx-blob-2" />
      </div>

      <div className="tx-container container">
        {/* 返回按钮 */}
        <button onClick={handleBack} className="back-button glass-button hover-lift">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {content.back}
        </button>

        {/* 状态提示 */}
        {transaction.status === 'confirmed' && (
          <div className="status-alert success glass-card">
            <div className="alert-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="alert-content">
              <div className="alert-title">{content.statusAlert.title}</div>
              <div className="alert-message">{content.statusAlert.message}</div>
            </div>
          </div>
        )}

        {/* 交易信息卡片 */}
        <div className="tx-info-card glass-card">
          <div className="card-header">
            <div className="header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="header-content">
              <h1 className="tx-title">{content.title}</h1>
              <p className="tx-subtitle">{content.subtitle}</p>
            </div>
            <span
              className="type-badge"
              style={{ background: typeStyle.bg, color: typeStyle.color }}
            >
              {typeText.zh}
            </span>
          </div>

          <div className="tx-details">
            <div className="detail-row">
              <span className="detail-label">{content.details.txId}:</span>
              <code className="detail-value hash">{transaction.id}</code>
            </div>
            <div className="detail-row">
              <span className="detail-label">{content.details.status}:</span>
              <span className="detail-value">
                <span className="status-badge confirmed">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {content.confirmed}
                </span>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{content.details.timestamp}:</span>
              <span className="detail-value">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{content.details.block}:</span>
              <span className="detail-value">
                <Link href={`/blockchain/block/${transaction.blockIndex}`} className="link-btn">
                  #{transaction.blockIndex}
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </span>
            </div>
            {transaction.knowledgeId && (
              <div className="detail-row">
                <span className="detail-label">{content.details.knowledge}:</span>
                <span className="detail-value">
                  <Link href={`/knowledge/${transaction.knowledgeId}`} className="link-btn">
                    {(transaction.metadata?.title as string) || `Knowledge #${transaction.knowledgeId}`}
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </span>
              </div>
            )}
            {transaction.userId && (
              <div className="detail-row">
                <span className="detail-label">{content.details.user}:</span>
                <span className="detail-value">
                  {(transaction.metadata?.author as string) || `User #${transaction.userId}`}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">{content.details.contentHash}:</span>
              <code className="detail-value hash">{transaction.contentHash}</code>
            </div>
            <div className="detail-row">
              <span className="detail-label">{content.details.signature}:</span>
              <code className="detail-value hash">{transaction.signature}</code>
            </div>
            <div className="detail-row">
              <span className="detail-label">{content.details.publicKey}:</span>
              <code className="detail-value hash">{transaction.publicKey}</code>
            </div>
          </div>
        </div>

        {/* 元数据卡片 */}
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <div className="metadata-card glass-card">
            <div className="card-header">
              <div className="header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="header-content">
                <h2 className="card-title">{content.metadata.title}</h2>
                <p className="card-subtitle">{content.metadata.subtitle}</p>
              </div>
            </div>

            <div className="metadata-grid">
              {Object.entries(transaction.metadata).map(([key, value]) => (
                <div key={key} className="metadata-item">
                  <div className="metadata-label">{key}</div>
                  <div className="metadata-value">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
