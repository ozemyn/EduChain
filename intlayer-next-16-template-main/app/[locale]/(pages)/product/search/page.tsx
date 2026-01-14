'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../product.css';

export default function SearchPage() {
  const content = useIntlayer('product');
  const search = content.search;

  return (
    <>
      <Navbar />
      <div className="product-page animate-fade-in">
        <div className="product-content">
          {/* 页面头部 */}
          <header className="product-header">
            <div className="product-header-icon">🔍</div>
            <h1>{search.title.value}</h1>
            <p className="product-header-desc">{search.description.value}</p>
          </header>

          <main className="product-main">
            {/* 核心特性 */}
            <section className="product-card glass-light">
              <h2>{search.coreFeatures.value}</h2>
              <div className="product-features">
                {search.features.map((feature, index) => (
                  <div key={index} className="product-feature glass-light hover-lift">
                    <div className="product-feature-icon">{feature.icon}</div>
                    <h4>{feature.title.value}</h4>
                    <p>{feature.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 使用场景 */}
            <section className="product-card glass-light">
              <h2>{search.useCases.value}</h2>
              <div className="product-scenarios">
                {search.scenarios.map((scenario, index) => (
                  <div key={index} className="product-scenario glass-light">
                    <div className="product-scenario-icon">{scenario.icon}</div>
                    <div className="product-scenario-content">
                      <h4>{scenario.title.value}</h4>
                      <p>{scenario.description.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="product-cta">
              <h2>{search.cta.title.value}</h2>
              <p>{search.cta.description.value}</p>
              <a href="/search" className="product-cta-btn hover-lift">
                {search.cta.button.value}
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
