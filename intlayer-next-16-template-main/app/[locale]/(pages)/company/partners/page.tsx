'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../company.css';

export default function PartnersPage() {
  const content = useIntlayer('company');
  const partners = content.partners;

  return (
    <>
      <Navbar />
      <div className="company-page animate-fade-in">
        <div className="company-content">
          {/* 页面头部 */}
          <header className="company-header">
            <div className="company-header-icon">🤝</div>
            <h1>{partners.title.value}</h1>
            <p className="company-header-desc">{partners.description.value}</p>
          </header>

          <main className="company-main">
            {/* 合作类型 */}
            <section className="company-card glass-light">
              <h2>{partners.types.title.value}</h2>
              <div className="company-grid">
                {partners.types.items.map((item, index) => (
                  <div key={index} className="company-grid-item glass-light hover-lift">
                    <div className="company-grid-icon">{item.icon}</div>
                    <h4>{item.title.value}</h4>
                    <p>{item.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 合作伙伴展示 */}
            <section className="company-card glass-light">
              <h2>{partners.featured.title.value}</h2>
              <div className="partner-grid">
                {partners.featured.partners.map((partner, index) => (
                  <div key={index} className="partner-card glass-light hover-lift">
                    <div className="partner-logo">🏛️</div>
                    <h4>{partner.name.value}</h4>
                    <p>{partner.type.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 成为合作伙伴 */}
            <section className="company-card glass-light" style={{ textAlign: 'center' }}>
              <h2>{partners.cta.title.value}</h2>
              <p>{partners.cta.description.value}</p>
              <a
                href={`mailto:${partners.cta.email}`}
                className="form-submit hover-lift"
                style={{ display: 'inline-block', marginTop: 'var(--spacing-lg)', textDecoration: 'none' }}
              >
                {partners.cta.button.value}
              </a>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
