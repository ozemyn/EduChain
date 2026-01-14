'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../company.css';

export default function CareersPage() {
  const content = useIntlayer('company');
  const careers = content.careers;

  return (
    <>
      <Navbar />
      <div className="company-page animate-fade-in">
        <div className="company-content">
          {/* 页面头部 */}
          <header className="company-header">
            <div className="company-header-icon">💼</div>
            <h1>{careers.title.value}</h1>
            <p className="company-header-desc">{careers.description.value}</p>
          </header>

          <main className="company-main">
            {/* 为什么加入 */}
            <section className="company-card glass-light">
              <h2>{careers.why.title.value}</h2>
              <div className="company-grid">
                {careers.why.items.map((item, index) => (
                  <div key={index} className="company-grid-item glass-light hover-lift">
                    <div className="company-grid-icon">{item.icon}</div>
                    <h4>{item.title.value}</h4>
                    <p>{item.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 开放职位 */}
            <section className="company-card glass-light">
              <h2>{careers.positions.title.value}</h2>
              <div className="job-list">
                {careers.positions.jobs.map((job, index) => (
                  <div key={index} className="job-card glass-light">
                    <div className="job-info">
                      <h4>{job.title.value}</h4>
                      <div className="job-meta">
                        <span className="job-tag">{job.department.value}</span>
                        <span className="job-tag">{job.location.value}</span>
                        <span className="job-tag">{job.type.value}</span>
                      </div>
                    </div>
                    <button className="job-apply hover-lift">
                      {careers.positions.apply.value}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
