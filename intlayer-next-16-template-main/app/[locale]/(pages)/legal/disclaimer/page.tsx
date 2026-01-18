'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../legal.css';

export default function DisclaimerPage() {
  const content = useIntlayer('legal');
  const disclaimer = content.disclaimer;

  return (
    <>
      <Navbar />
      <div className="legal-page motion-fade-in">
        <div className="legal-content">
          {/* 页面头部 */}
          <header className="legal-header">
            <div className="legal-header-icon">⚠️</div>
            <h1>{disclaimer.title.value}</h1>
            <p className="legal-header-meta">{content.lastUpdated.value}</p>
          </header>

          <main className="legal-main">
            <article className="legal-card glass-light">
              {/* 警告框 */}
              <div className="legal-alert warning">
                <span className="legal-alert-icon">⚠️</span>
                <div className="legal-alert-content">
                  <p><strong>{disclaimer.importantNotice.value}</strong>{disclaimer.intro.value}</p>
                </div>
              </div>

              <div className="legal-divider" />

              {/* 各章节 */}
              {disclaimer.sections.map((section, index) => (
                <section key={index}>
                  <h3>{section.title.value}</h3>
                  <p>{section.content.value}</p>
                </section>
              ))}

              <div className="legal-divider" />

              {/* 页脚声明 */}
              <div className="legal-footer">
                <p>{disclaimer.footer.value}</p>
              </div>
            </article>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
