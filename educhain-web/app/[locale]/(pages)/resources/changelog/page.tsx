'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../resources.css';

export default function ChangelogPage() {
  const content = useIntlayer('resources');
  const changelog = content.changelog;

  return (
    <>
      <Navbar />
      <div className="resources-page motion-fade-in">
        <div className="page-content">
          {/* 页面头部 */}
          <header className="resources-header">
            <div className="resources-header-icon">📋</div>
            <h1>{changelog.title.value}</h1>
            <p className="resources-header-desc">{changelog.description.value}</p>
          </header>

          <main className="resources-main">
            {/* 版本列表 */}
            <div className="changelog-list">
              {changelog.versions.map((version, index) => {
                const versionType = version.type.value as 'major' | 'minor' | 'patch';
                return (
                  <article key={index} className="changelog-item glass-light">
                    <div className="changelog-version">
                      <h3>v{version.version.value}</h3>
                      <span className="changelog-date">{version.date.value}</span>
                      <span className={`changelog-tag ${versionType}`}>
                        {changelog.versionLabels[versionType].value}
                      </span>
                    </div>
                    <ul className="changelog-changes">
                      {version.changes.map((change, cIndex) => {
                        const changeType = change.type.value as 'new' | 'improved' | 'fixed';
                        return (
                          <li key={cIndex}>
                            <span className={`change-type ${changeType}`}>
                              {changelog.typeLabels[changeType].value}
                            </span>
                            {change.text.value}
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                );
              })}
            </div>

            {/* 订阅更新 */}
            <section className="resources-card glass-light" style={{ textAlign: 'center' }}>
              <h2>{changelog.subscribe.title.value}</h2>
              <p>{changelog.subscribe.description.value}</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginTop: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder={changelog.subscribe.placeholder.value}
                  className="form-input"
                  style={{ maxWidth: '300px' }}
                />
                <button className="form-submit motion-hover-lift" style={{ whiteSpace: 'nowrap' }}>
                  {changelog.subscribe.button.value}
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
