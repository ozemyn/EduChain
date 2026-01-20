'use client';

import { useState } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useRouter } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../resources.css';

export default function HelpCenterPage() {
  const content = useIntlayer('resources');
  const help = content.help;
  const { locale } = useLocale();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = help.faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category.value === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.value.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="resources-page motion-fade-in">
        <div className="resources-content">
          {/* 页面头部 */}
          <header className="resources-header">
            <div className="resources-header-icon">❓</div>
            <h1>{help.title.value}</h1>
            <p className="resources-header-desc">{help.description.value}</p>
          </header>

          <main className="resources-main">
            {/* 搜索框 */}
            <div className="resources-search">
              <input
                type="text"
                className="resources-search-input"
                placeholder={help.searchPlaceholder.value}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 分类标签 */}
            <div className="category-tags">
              {help.categories.map((cat, index) => (
                <button
                  key={index}
                  className={`category-tag ${activeCategory === cat.key.value ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key.value)}
                >
                  {cat.label.value}
                </button>
              ))}
            </div>

            {/* FAQ 列表 */}
            <section className="resources-card glass-light">
              <div className="faq-list">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item ${openFaq === index ? 'open' : ''}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span>{faq.question.value}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-answer">
                      {faq.answer.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 工单支持 */}
            <section className="resources-card glass-light" style={{ textAlign: 'center' }}>
              <h2>{help.contact.title.value}</h2>
              <p>{help.contact.description.value}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => router.push(getLocalizedUrl('/resources/ticket/submit', locale))}
                  className="form-submit motion-hover-lift"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {help.contact.submitTicket.value}
                </button>
                <button
                  onClick={() => router.push(getLocalizedUrl('/resources/ticket/list', locale))}
                  className="form-submit motion-hover-lift"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {help.contact.myTickets.value}
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
