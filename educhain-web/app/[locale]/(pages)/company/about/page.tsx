'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../company.css';

export default function AboutPage() {
  const content = useIntlayer('company');
  const about = content.about;

  return (
    <>
      <Navbar />
      <div className="company-page motion-fade-in">
        <div className="company-content">
          {/* 页面头部 */}
          <header className="company-header">
            <div className="company-header-icon">🏢</div>
            <h1>{about.title.value}</h1>
            <p className="company-header-desc">{about.description.value}</p>
          </header>

          <main className="company-main">
            {/* 使命 */}
            <section className="company-card glass-light">
              <h2>{about.mission.title.value}</h2>
              <p>{about.mission.content.value}</p>
            </section>

            {/* 愿景 */}
            <section className="company-card glass-light">
              <h2>{about.vision.title.value}</h2>
              <p>{about.vision.content.value}</p>
            </section>

            {/* 核心价值观 */}
            <section className="company-card glass-light">
              <h2>{about.values.title.value}</h2>
              <div className="company-grid">
                {about.values.items.map((item, index) => (
                  <div key={index} className="company-grid-item glass-light motion-hover-lift">
                    <div className="company-grid-icon">{item.icon}</div>
                    <h4>{item.title.value}</h4>
                    <p>{item.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 核心团队 */}
            <section className="company-card glass-light">
              <h2>{about.team.title.value}</h2>
              <div className="team-grid">
                {about.team.members.map((member, index) => (
                  <div key={index} className="team-member glass-light motion-hover-lift">
                    <div className="team-avatar">👤</div>
                    <h4>{member.name.value}</h4>
                    <p className="team-role">{member.role.value}</p>
                    <p>{member.bio.value}</p>
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
