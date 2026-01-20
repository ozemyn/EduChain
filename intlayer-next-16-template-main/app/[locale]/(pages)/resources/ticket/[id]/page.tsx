'use client';

import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter, useParams } from 'next/navigation';
import { getLocalizedUrl } from 'intlayer';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { useAuth } from '@/contexts/auth-context';
import { ticketService } from '@/services/ticket';
import './page.css';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketType = 'BUG' | 'FEATURE' | 'QUESTION' | 'OTHER';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface TicketComment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  isStaff: boolean;
}

interface TicketDetail {
  id: number;
  title: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  comments: TicketComment[];
}

export default function TicketDetailPage() {
  const content = useIntlayer('ticket-detail-page');
  const { locale } = useLocale();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const ticketId = Number(params.id);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // 加载工单详情
  useEffect(() => {
    const loadTicket = async () => {
      setLoading(true);
      try {
        const response = await ticketService.getTicketById(ticketId);
        setTicket(response.data);
      } catch (error) {
        console.error('Failed to load ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId, user?.id, user?.email]);

  // 提交评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await ticketService.addComment(ticketId, { content: commentText });
      
      setTicket(prev => prev ? {
        ...prev,
        comments: [...prev.comments, response.data],
      } : null);
      
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // 获取状态样式
  const getStatusClass = (status: TicketStatus) => {
    const classes = {
      OPEN: 'status-open',
      IN_PROGRESS: 'status-progress',
      RESOLVED: 'status-resolved',
      CLOSED: 'status-closed',
    };
    return classes[status];
  };

  // 获取优先级样式
  const getPriorityClass = (priority: TicketPriority) => {
    const classes = {
      LOW: 'priority-low',
      MEDIUM: 'priority-medium',
      HIGH: 'priority-high',
      URGENT: 'priority-urgent',
    };
    return classes[priority];
  };

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 返回列表
  const handleBack = () => {
    router.push(getLocalizedUrl('/resources/ticket/list', locale));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="ticket-detail-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{content.loading}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="ticket-detail-page">
          <div className="error-state glass-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>{content.notFound.title}</h3>
            <p>{content.notFound.description}</p>
            <button onClick={handleBack} className="back-btn motion-hover-lift">
              {content.actions.backToList}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="ticket-detail-page">
        <div className="ticket-detail-container container">
          {/* 返回按钮 */}
          <button onClick={handleBack} className="back-button motion-hover-scale">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {content.actions.back}
          </button>

          {/* 工单头部 */}
          <div className="ticket-header glass-card motion-fade-in">
            <div className="ticket-meta">
              <div className="ticket-badges">
                <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                  {content.statuses[ticket.status.toLowerCase().replace('_', '') as 'open' | 'inprogress' | 'resolved' | 'closed']}
                </span>
                <span className={`ticket-priority ${getPriorityClass(ticket.priority)}`}>
                  {content.priorities[ticket.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent']}
                </span>
                <span className="ticket-type">
                  {content.types[ticket.type.toLowerCase() as 'bug' | 'feature' | 'question' | 'other']}
                </span>
              </div>
              <span className="ticket-id">#{ticket.id}</span>
            </div>
            <h1 className="ticket-title">{ticket.title}</h1>
            <div className="ticket-info">
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{content.fields.createdAt}: {formatTime(ticket.createdAt)}</span>
              </div>
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{content.fields.updatedAt}: {formatTime(ticket.updatedAt)}</span>
              </div>
              <div className="info-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{ticket.email}</span>
              </div>
            </div>
          </div>

          {/* 工单描述 */}
          <div className="ticket-description glass-card motion-slide-in-up motion-delay-100">
            <h2 className="section-title">{content.sections.description}</h2>
            <div className="description-content">
              {ticket.description.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* 评论区 */}
          <div className="ticket-comments glass-card motion-slide-in-up motion-delay-200">
            <h2 className="section-title">
              {content.sections.comments} ({ticket.comments.length})
            </h2>

            {/* 评论列表 */}
            <div className="comments-list">
              {ticket.comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className={`comment-item ${comment.isStaff ? 'staff-comment' : ''} motion-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="comment-avatar">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt={comment.userName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.userName}
                        {comment.isStaff && (
                          <span className="staff-badge">{content.badges.staff}</span>
                        )}
                      </span>
                      <span className="comment-time">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 添加评论 */}
            {ticket.status !== 'CLOSED' && (
              <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={String(content.placeholders.comment)}
                  className="comment-textarea"
                  rows={4}
                  maxLength={1000}
                />
                <div className="comment-form-footer">
                  <span className="char-count">{commentText.length}/1000</span>
                  <button
                    type="submit"
                    className="submit-comment-btn motion-hover-lift"
                    disabled={!commentText.trim() || submittingComment}
                  >
                    {submittingComment ? (
                      <>
                        <span className="loading-spinner-small" />
                        {content.actions.submitting}
                      </>
                    ) : (
                      <>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {content.actions.submitComment}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
