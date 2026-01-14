'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../product.css';

export default function RecommendationPage() {
  const content = useIntlayer('product');
  const recommendation = content.recommendation;

  return (
    <>
      <Navbar />
      <div className="product-page animate-fade-in">
        <div className="product-content">
          {/* 页面头部 */}
          <header className="product-header">
            <div className="product-header-icon">✨</div>
            <h1>{recommendation.title.value}</h1>
            <p className="product-header-desc">{recommendation.description.value}</p>
          </header>

          <main className="product-main">
            {/* 核心特性 */}
            <section className="product-card glass-light">
              <h2>{recommendation.coreFeatures.value}</h2>
              <div className="product-features">
                {recommendation.features.map((feature, index) => (
                  <div key={index} className="product-feature glass-light hover-lift">
                    <div className="product-feature-icon">{feature.icon}</div>
                    <h4>{feature.title.value}</h4>
                    <p>{feature.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 工作原理 */}
            <section className="product-card glass-light">
              <h2>{recommendation.howItWorks.title.value}</h2>
              <div className="product-features">
                {recommendation.howItWorks.steps.map((step, index) => (
                  <div key={index} className="product-feature glass-light hover-lift">
                    <div className="product-feature-icon" style={{ background: 'linear-gradient(135deg, rgb(var(--color-accent)), rgb(var(--color-primary)))' }}>
                      {step.step.value}
                    </div>
                    <h4>{step.title.value}</h4>
                    <p>{step.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="product-cta">
              <h2>{recommendation.cta.title.value}</h2>
              <p>{recommendation.cta.description.value}</p>
              <a href="/auth/login" className="product-cta-btn hover-lift">
                {recommendation.cta.button.value}
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
