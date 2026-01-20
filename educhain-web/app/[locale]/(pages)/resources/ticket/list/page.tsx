'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { useAuth } from '@/contexts/auth-context';
import { ticketService } from '@/services/ticket';
import './page.css';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketType = 'BUG' | 'FEATURE' | 'QUESTION' | 'OTHER';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Ticket {
  id: number;
  title: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export default function TicketListPage() {
  const content = useIntlayer('ticket-list-page');
  const { locale } = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<TicketType | 'ALL'>('ALL');

  // 加载工单列表
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const response = await ticketService.getMyTickets({
          page: 0,
          size: 100,
        });
        setTickets(response.data.content);
      } catch (error) {
        console.error('Failed to load tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user?.id]);

  // 筛选工单
  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== 'ALL' && ticket.status !== filterStatus) return false;
    if (filterType !== 'ALL' && ticket.type !== filterType) return false;
    return true;
  });

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
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return String(content.timeUnits.today);
    if (days === 1) return String(content.timeUnits.yesterday);
    if (days < 7) return `${days} ${content.timeUnits.daysAgo}`;
    return date.toLocaleDateString();
  };

  // 跳转到工单详情
  const handleTicketClick = (ticketId: number) => {
    router.push(getLocalizedUrl(`/resources/ticket/${ticketId}`, locale));
  };

  // 创建新工单
  const handleCreateTicket = () => {
    router.push(getLocalizedUrl('/resources/ticket/submit', locale));
  };

  return (
    <>
      <Navbar />

      <div className="ticket-list-page">
        <div className="page-content">
          {/* 页面头部 */}
          <div className="ticket-list-header motion-fade-in">
            <div className="header-content">
              <div className="header-icon glass-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="page-title">{content.title}</h1>
                <p className="page-description">{content.description}</p>
              </div>
            </div>
            <button
              onClick={handleCreateTicket}
              className="create-ticket-btn motion-hover-lift"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {content.createTicket}
            </button>
          </div>

          {/* 筛选器 */}
          <div className="ticket-filters glass-card motion-slide-in-up motion-delay-100">
            <div className="filter-group">
              <label className="filter-label">{content.filters.status}</label>
              <div className="filter-buttons">
                <button
                  onClick={() => setFilterStatus('ALL')}
                  className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                >
                  {content.filters.all}
                </button>
                <button
                  onClick={() => setFilterStatus('OPEN')}
                  className={`filter-btn ${filterStatus === 'OPEN' ? 'active' : ''}`}
                >
                  {content.statuses.open}
                </button>
                <button
                  onClick={() => setFilterStatus('IN_PROGRESS')}
                  className={`filter-btn ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
                >
                  {content.statuses.inprogress}
                </button>
                <button
                  onClick={() => setFilterStatus('RESOLVED')}
                  className={`filter-btn ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
                >
                  {content.statuses.resolved}
                </button>
                <button
                  onClick={() => setFilterStatus('CLOSED')}
                  className={`filter-btn ${filterStatus === 'CLOSED' ? 'active' : ''}`}
                >
                  {content.statuses.closed}
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">{content.filters.type}</label>
              <div className="filter-buttons">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
                >
                  {content.filters.all}
                </button>
                <button
                  onClick={() => setFilterType('BUG')}
                  className={`filter-btn ${filterType === 'BUG' ? 'active' : ''}`}
                >
                  {content.types.bug}
                </button>
                <button
                  onClick={() => setFilterType('FEATURE')}
                  className={`filter-btn ${filterType === 'FEATURE' ? 'active' : ''}`}
                >
                  {content.types.feature}
                </button>
                <button
                  onClick={() => setFilterType('QUESTION')}
                  className={`filter-btn ${filterType === 'QUESTION' ? 'active' : ''}`}
                >
                  {content.types.question}
                </button>
                <button
                  onClick={() => setFilterType('OTHER')}
                  className={`filter-btn ${filterType === 'OTHER' ? 'active' : ''}`}
                >
                  {content.types.other}
                </button>
              </div>
            </div>
          </div>

          {/* 工单列表 */}
          <div className="tickets-section motion-slide-in-up motion-delay-200">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>{content.loading}</p>
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="tickets-grid">
                {filteredTickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket.id)}
                    className="ticket-card glass-card motion-hover-lift"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="ticket-header">
                      <div className="ticket-badges">
                        <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                          {content.statuses[ticket.status.toLowerCase().replace('_', '') as 'open' | 'inprogress' | 'resolved' | 'closed']}
                        </span>
                        <span className={`ticket-priority ${getPriorityClass(ticket.priority)}`}>
                          {content.priorities[ticket.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent']}
                        </span>
                      </div>
                      <span className="ticket-type">
                        {content.types[ticket.type.toLowerCase() as 'bug' | 'feature' | 'question' | 'other']}
                      </span>
                    </div>

                    <h3 className="ticket-title">{ticket.title}</h3>
                    <p className="ticket-description">{ticket.description}</p>

                    <div className="ticket-footer">
                      <span className="ticket-id">#{ticket.id}</span>
                      <span className="ticket-time">{formatTime(ticket.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state glass-card">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>{content.empty.title}</h3>
                <p>{content.empty.description}</p>
                <button onClick={handleCreateTicket} className="empty-action-btn motion-hover-lift">
                  {content.createTicket}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
