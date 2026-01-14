'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../legal.css';

export default function CopyrightPage() {
  const content = useIntlayer('legal');
  const copyright = content.copyright;

  return (
    <>
      <Navbar />
      <div className="legal-page animate-fade-in">
        <div className="legal-content">
          {/* 页面头部 */}
          <header className="legal-header">
            <div className="legal-header-icon">©️</div>
            <h1>{copyright.title.value}</h1>
            <p className="legal-header-meta">{content.lastUpdated.value}</p>
          </header>

          <main className="legal-main">
            <article className="legal-card glass-light">
              {/* 引言 */}
              <h2>{copyright.title.value}</h2>
              <p>{copyright.intro.value}</p>

              <div className="legal-divider" />

              {/* 各章节 */}
              {copyright.sections.map((section, index) => (
                <section key={index}>
                  <h3>{section.title.value}</h3>
                  <p>{section.content.value}</p>
                </section>
              ))}

              <div className="legal-divider" />

              {/* 联系信息 */}
              <div className="legal-contact">
                <h4>{copyright.contact.title.value}</h4>
                <div className="legal-contact-item">
                  <span>📧</span>
                  <span>{copyright.contact.email}</span>
                </div>
                <div className="legal-contact-item">
                  <span>📞</span>
                  <span>{copyright.contact.phone}</span>
                </div>
              </div>

              {/* 页脚声明 */}
              <div className="legal-footer">
                <p>© 2026 EduChain. All rights reserved.</p>
              </div>
            </article>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
