'use client';

import { useState, useCallback } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import { useAuth } from '@/contexts/auth-context';
import { ticketService } from '@/services/ticket';
import './page.css';

type TicketType = 'BUG' | 'FEATURE' | 'QUESTION' | 'OTHER';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export default function TicketSubmitPage() {
  const content = useIntlayer('ticket-submit-page');
  const { locale } = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: 'QUESTION' as TicketType,
    priority: 'MEDIUM' as TicketPriority,
    description: '',
    email: user?.email || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // 表单验证
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = String(content.errors.titleRequired);
    } else if (formData.title.length > 100) {
      newErrors.title = String(content.errors.titleTooLong);
    }

    if (!formData.description.trim()) {
      newErrors.description = String(content.errors.descriptionRequired);
    } else if (formData.description.length < 10) {
      newErrors.description = String(content.errors.descriptionTooShort);
    } else if (formData.description.length > 2000) {
      newErrors.description = String(content.errors.descriptionTooLong);
    }

    if (!formData.email.trim()) {
      newErrors.email = String(content.errors.emailRequired);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = String(content.errors.emailInvalid);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, content.errors]);

  // 提交工单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await ticketService.createTicket(formData);

      // 成功后跳转到工单列表
      router.push(getLocalizedUrl('/resources/ticket/list', locale));
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      setErrors({ submit: String(content.errors.submitFailed) });
    } finally {
      setSubmitting(false);
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: TicketType) => {
    switch (type) {
      case 'BUG':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'FEATURE':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'QUESTION':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };

  return (
    <>
      <Navbar />

      <div className="ticket-submit-page">
        <div className="page-content-narrow">
          {/* 页面头部 */}
          <div className="ticket-submit-header motion-fade-in">
            <div className="header-icon glass-card">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h1 className="page-title">{content.title}</h1>
            <p className="page-description">{content.description}</p>
          </div>

          {/* 表单卡片 */}
          <div className="ticket-form-card glass-card motion-slide-in-up motion-delay-100">
            <form onSubmit={handleSubmit} className="ticket-form">
              {/* 工单标题 */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  {content.fields.title}
                  <span className="required-mark">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={content.placeholders.title.value}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  maxLength={100}
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
                <p className="form-hint">{formData.title.length}/100</p>
              </div>

              {/* 工单类型和优先级 */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    {content.fields.type}
                    <span className="required-mark">*</span>
                  </label>
                  <div className="type-selector">
                    {(['BUG', 'FEATURE', 'QUESTION', 'OTHER'] as TicketType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`type-option glass-button ${formData.type === type ? 'active' : ''}`}
                      >
                        <span className="type-icon">{getTypeIcon(type)}</span>
                        <span className="type-label">{content.types[type.toLowerCase() as 'bug' | 'feature' | 'question' | 'other']}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="priority" className="form-label">
                    {content.fields.priority}
                    <span className="required-mark">*</span>
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                    className="form-select glass-input"
                  >
                    <option value="LOW">{content.priorities.low}</option>
                    <option value="MEDIUM">{content.priorities.medium}</option>
                    <option value="HIGH">{content.priorities.high}</option>
                    <option value="URGENT">{content.priorities.urgent}</option>
                  </select>
                </div>
              </div>

              {/* 问题描述 */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  {content.fields.description}
                  <span className="required-mark">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={content.placeholders.description.value}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows={8}
                  maxLength={2000}
                />
                {errors.description && <p className="form-error">{errors.description}</p>}
                <p className="form-hint">{formData.description.length}/2000</p>
              </div>

              {/* 联系邮箱 */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {content.fields.email}
                  <span className="required-mark">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={content.placeholders.email.value}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
                <p className="form-hint">{content.hints.email}</p>
              </div>

              {/* 提交错误 */}
              {errors.submit && (
                <div className="submit-error glass-card motion-shake">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* 表单操作 */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="form-btn form-btn-secondary glass-button motion-hover-scale"
                  disabled={submitting}
                >
                  {content.actions.cancel}
                </button>
                <button
                  type="submit"
                  className="form-btn form-btn-primary motion-hover-lift"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="loading-spinner-small" />
                      {content.actions.submitting}
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {content.actions.submit}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 提示信息 */}
          <div className="ticket-tips glass-card motion-fade-in motion-delay-200">
            <h3 className="tips-title">{content.tips.title}</h3>
            <ul className="tips-list">
              <li>{content.tips.tip1}</li>
              <li>{content.tips.tip2}</li>
              <li>{content.tips.tip3}</li>
              <li>{content.tips.tip4}</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
