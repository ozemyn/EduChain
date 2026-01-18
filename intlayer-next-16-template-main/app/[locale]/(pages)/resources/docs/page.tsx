'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../resources.css';

export default function DocsPage() {
  const content = useIntlayer('resources');
  const docs = content.docs;

  return (
    <>
      <Navbar />
      <div className="resources-page motion-fade-in">
        <div className="resources-content">
          {/* 页面头部 */}
          <header className="resources-header">
            <div className="resources-header-icon">📖</div>
            <h1>{docs.title.value}</h1>
            <p className="resources-header-desc">{docs.description.value}</p>
          </header>

          <main className="resources-main">
            {/* 快速链接 */}
            <div className="quick-links">
              <a href="#quickstart" className="quick-link glass-light motion-hover-lift">
                <div className="quick-link-icon">🚀</div>
                <div>
                  <h4>{docs.quickStart.title.value}</h4>
                  <p>{docs.quickStart.description.value}</p>
                </div>
              </a>
              <a href="/api-docs" className="quick-link glass-light motion-hover-lift">
                <div className="quick-link-icon">📡</div>
                <div>
                  <h4>{docs.apiReference.title.value}</h4>
                  <p>{docs.apiReference.description.value}</p>
                </div>
              </a>
              <a href="#sdk" className="quick-link glass-light motion-hover-lift">
                <div className="quick-link-icon">📦</div>
                <div>
                  <h4>{docs.sdks.title.value}</h4>
                  <p>{docs.sdks.description.value}</p>
                </div>
              </a>
            </div>

            {/* 文档导航 */}
            <div className="docs-nav">
              <aside className="docs-sidebar">
                <nav className="docs-menu glass-light" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-xl)' }}>
                  {docs.sections.map((section, sIndex) => (
                    <div key={sIndex} style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'rgb(var(--color-text-tertiary))', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase' }}>
                        {section.title.value}
                      </h4>
                      {section.items.map((item, iIndex) => (
                        <a key={iIndex} href={item.href.value} className="docs-menu-item">
                          {item.title.value}
                        </a>
                      ))}
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="docs-body">
                {/* 快速开始 */}
                <section id="quickstart" className="resources-card glass-light">
                  <h2>{docs.quickStart.title.value}</h2>
                  <p>{docs.quickStart.description.value}</p>
                  
                  <h3>{docs.installSdk.value}</h3>
                  <div className="code-block">
                    <pre><code>{docs.codeExample.value}</code></pre>
                  </div>
                </section>

                {/* 更多文档内容 */}
                <section className="resources-card glass-light">
                  <h2>{docs.nextSteps.title.value}</h2>
                  <p>{docs.nextSteps.description.value}</p>
                  <div className="quick-links" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <a href="/api-docs" className="quick-link glass-light motion-hover-lift">
                      <div className="quick-link-icon">📡</div>
                      <div>
                        <h4>{docs.apiDocs.title.value}</h4>
                        <p>{docs.apiDocs.description.value}</p>
                      </div>
                    </a>
                    <a href="/changelog" className="quick-link glass-light motion-hover-lift">
                      <div className="quick-link-icon">📋</div>
                      <div>
                        <h4>{docs.changelogLink.title.value}</h4>
                        <p>{docs.changelogLink.description.value}</p>
                      </div>
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
