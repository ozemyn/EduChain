'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../product.css';

export default function CommunityPage() {
  const content = useIntlayer('product');
  const community = content.community;

  return (
    <>
      <Navbar />
      <div className="product-page animate-fade-in">
        <div className="product-content">
          {/* 页面头部 */}
          <header className="product-header">
            <div className="product-header-icon">👥</div>
            <h1>{community.title.value}</h1>
            <p className="product-header-desc">{community.description.value}</p>
          </header>

          <main className="product-main">
            {/* 数据亮点 */}
            <div className="product-highlights">
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">50,000+</div>
                <div className="product-highlight-label">{community.stats.users.value}</div>
              </div>
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">10,000+</div>
                <div className="product-highlight-label">{community.stats.discussions.value}</div>
              </div>
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">100,000+</div>
                <div className="product-highlight-label">{community.stats.answers.value}</div>
              </div>
            </div>

            {/* 核心特性 */}
            <section className="product-card glass-light">
              <h2>{community.communityFeatures.value}</h2>
              <div className="product-features">
                {community.features.map((feature, index) => (
                  <div key={index} className="product-feature glass-light hover-lift">
                    <div className="product-feature-icon">{feature.icon}</div>
                    <h4>{feature.title.value}</h4>
                    <p>{feature.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="product-cta">
              <h2>{community.cta.title.value}</h2>
              <p>{community.cta.description.value}</p>
              <a href="/community" className="product-cta-btn hover-lift">
                {community.cta.button.value}
                <span>→</span>
              </a>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
