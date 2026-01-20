'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../legal.css';

export default function PrivacyPage() {
  const content = useIntlayer('legal');
  const privacy = content.privacy;

  return (
    <>
      <Navbar />
      <div className="legal-page motion-fade-in">
        <div className="page-content-narrow">
          {/* 页面头部 */}
          <header className="legal-header">
            <div className="legal-header-icon">🔒</div>
            <h1>{privacy.title.value}</h1>
            <p className="legal-header-meta">{content.lastUpdated.value}</p>
          </header>

          <main className="legal-main">
            <article className="legal-card glass-light">
              {/* 引言 */}
              <h2>{privacy.title.value}</h2>
              <p>{privacy.intro.value}</p>

              <div className="legal-divider" />

              {/* 各章节 */}
              {privacy.sections.map((section, index) => (
                <section key={index}>
                  <h3>{section.title.value}</h3>
                  <p>{section.content.value}</p>
                </section>
              ))}

              <div className="legal-divider" />

              {/* 页脚声明 */}
              <div className="legal-footer">
                <p>{privacy.footer.value}</p>
              </div>
            </article>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
