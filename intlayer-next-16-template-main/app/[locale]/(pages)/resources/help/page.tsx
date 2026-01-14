'use client';

import { useState } from 'react';
import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../resources.css';

export default function HelpCenterPage() {
  const content = useIntlayer('resources');
  const help = content.help;
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
      <div className="resources-page animate-fade-in">
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

            {/* 联系客服 */}
            <section className="resources-card glass-light" style={{ textAlign: 'center' }}>
              <h2>{help.contact.title.value}</h2>
              <p>{help.contact.description.value}</p>
              <a
                href="/contact"
                className="form-submit hover-lift"
                style={{ display: 'inline-block', marginTop: 'var(--spacing-lg)', textDecoration: 'none' }}
              >
                {help.contact.button.value}
              </a>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
