'use client';

import { useState, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import { useParams } from 'next/navigation';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import { InteractionButtons } from '../../../../../components/knowledge';
import { MarkdownRenderer } from '../../../../../components/MarkdownRenderer';
import { knowledgeService } from '@/services';
import type { KnowledgeItem } from '@/types';
import './page.css';

export default function KnowledgeDetailPage() {
  const content = useIntlayer('knowledge-detail-page');
  const params = useParams();
  const shareCode = params.shareCode as string;
  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);

  useEffect(() => {
    if (shareCode) {
      loadKnowledge();
    }
  }, [shareCode]);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.getKnowledgeByShareCode(shareCode);
      if (response.success && response.data) {
        setKnowledge(response.data);
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="knowledge-detail-page">
          <div className="detail-container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{content.loading}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!knowledge) {
    return (
      <>
        <Navbar />
        <div className="knowledge-detail-page">
          <div className="detail-container">
            <div className="empty-state glass-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>{content.notFound}</h3>
              <p>{content.notFoundDescription}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getTypeColor = (type: string) => {
    const colors = {
      TEXT: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)' },
      IMAGE: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' },
      VIDEO: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)' },
      PDF: { bg: 'rgba(251, 146, 60, 0.1)', color: 'rgb(251, 146, 60)' },
      LINK: { bg: 'rgba(168, 85, 247, 0.1)', color: 'rgb(168, 85, 247)' },
    };
    return colors[type as keyof typeof colors] || colors.TEXT;
  };

  const typeStyle = getTypeColor(knowledge.type || 'TEXT');

  return (
    <>
      <Navbar />

      <div className="knowledge-detail-page">
        <div className="detail-container container">
          <div className="knowledge-content-card glass-card">
            {/* 头部信息 */}
            <div className="knowledge-header">
              <h1 className="knowledge-title">{knowledge.title}</h1>

              <div className="knowledge-meta">
                <div className="author-section">
                  <div className="author-avatar">
                    {knowledge.uploaderAvatar ? (
                      <img src={knowledge.uploaderAvatar} alt={knowledge.uploaderName || 'User'} />
                    ) : (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="author-info">
                    <div className="author-name">
                      {knowledge.uploaderName || `User ${knowledge.uploaderId}`}
                    </div>
                    <div className="publish-time">
                      {new Date(knowledge.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="knowledge-tags">
                  <span
                    className="type-badge"
                    style={{ background: typeStyle.bg, color: typeStyle.color }}
                  >
                    {knowledge.type}
                  </span>
                  {knowledge.categoryName && (
                    <span className="tag">{knowledge.categoryName}</span>
                  )}
                  {knowledge.tags &&
                    knowledge.tags.split(',').map((tag) => (
                      <span key={tag.trim()} className="tag">
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* 内容 */}
            <MarkdownRenderer content={knowledge.content} className="knowledge-content" />

            {/* 交互区域 */}
            <div className="knowledge-interactions">
              <div className="stats-section">
                <div className="stat-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{knowledge.stats?.viewCount || 0} {content.views}</span>
                </div>
              </div>

              <InteractionButtons
                initialStats={{
                  likeCount: knowledge.stats?.likeCount || 0,
                  favoriteCount: knowledge.stats?.favoriteCount || 0,
                  commentCount: knowledge.stats?.commentCount || 0,
                }}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
