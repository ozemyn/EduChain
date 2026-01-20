'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../product.css';

export default function KnowledgePage() {
  const content = useIntlayer('product');
  const knowledge = content.knowledge;

  return (
    <>
      <Navbar />
      <div className="product-page motion-fade-in">
        <div className="product-content">
          {/* 页面头部 */}
          <header className="product-header">
            <div className="product-header-icon">📚</div>
            <h1>{knowledge.title.value}</h1>
            <p className="product-header-desc">{knowledge.description.value}</p>
          </header>

          <main className="product-main">
            {/* 数据亮点 */}
            <div className="product-highlights">
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">10,000+</div>
                <div className="product-highlight-label">{knowledge.stats.content.value}</div>
              </div>
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">50+</div>
                <div className="product-highlight-label">{knowledge.stats.categories.value}</div>
              </div>
              <div className="product-highlight glass-light">
                <div className="product-highlight-value">5,000+</div>
                <div className="product-highlight-label">{knowledge.stats.creators.value}</div>
              </div>
            </div>

            {/* 核心特性 */}
            <section className="product-card glass-light">
              <h2>{knowledge.coreFeatures.value}</h2>
              <div className="product-features">
                {knowledge.features.map((feature, index) => (
                  <div key={index} className="product-feature glass-light motion-hover-lift">
                    <div className="product-feature-icon">{feature.icon}</div>
                    <h4>{feature.title.value}</h4>
                    <p>{feature.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="product-cta">
              <h2>{knowledge.cta.title.value}</h2>
              <p>{knowledge.cta.description.value}</p>
              <a href="/knowledge" className="product-cta-btn motion-hover-lift">
                {knowledge.cta.button.value}
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
