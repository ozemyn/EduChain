'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../legal.css';

export default function TermsPage() {
  const content = useIntlayer('legal');
  const terms = content.terms;

  return (
    <>
      <Navbar />
      <div className="legal-page motion-fade-in">
        <div className="legal-content">
          {/* 页面头部 */}
          <header className="legal-header">
            <div className="legal-header-icon">📜</div>
            <h1>{terms.title.value}</h1>
            <p className="legal-header-meta">{content.lastUpdated.value}</p>
          </header>

          <main className="legal-main">
            <article className="legal-card glass-light">
              {/* 引言 */}
              <h2>{terms.title.value}</h2>
              <p>{terms.intro.value}</p>

              <div className="legal-divider" />

              {/* 各章节 */}
              {terms.sections.map((section, index) => (
                <section key={index}>
                  <h3>{section.title.value}</h3>
                  <p>{section.content.value}</p>
                </section>
              ))}

              <div className="legal-divider" />

              {/* 联系信息 */}
              <div className="legal-contact">
                <h4>{terms.contact.title.value}</h4>
                <div className="legal-contact-item">
                  <span>📧</span>
                  <span>{terms.contact.email}</span>
                </div>
                <div className="legal-contact-item">
                  <span>📞</span>
                  <span>{terms.contact.phone}</span>
                </div>
                <div className="legal-contact-item">
                  <span>📍</span>
                  <span>{terms.contact.address.value}</span>
                </div>
              </div>

              {/* 页脚声明 */}
              <div className="legal-footer">
                <p>{terms.footer.value}</p>
              </div>
            </article>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
