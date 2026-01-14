'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../resources.css';

export default function ApiDocsPage() {
  const content = useIntlayer('resources');
  const apiDocs = content.apiDocs;

  return (
    <>
      <Navbar />
      <div className="resources-page animate-fade-in">
        <div className="resources-content">
          {/* 页面头部 */}
          <header className="resources-header">
            <div className="resources-header-icon">📡</div>
            <h1>{apiDocs.title.value}</h1>
            <p className="resources-header-desc">{apiDocs.description.value}</p>
          </header>

          <main className="resources-main">
            {/* Base URL */}
            <section className="resources-card glass-light">
              <h2>Base URL</h2>
              <div className="code-block">
                <pre><code>{String(apiDocs.baseUrl.value || apiDocs.baseUrl)}</code></pre>
              </div>
            </section>

            {/* 认证 */}
            <section className="resources-card glass-light">
              <h2>{apiDocs.authentication.title.value}</h2>
              <p>{apiDocs.authentication.description.value}</p>
              <div className="code-block">
                <pre><code>{String(apiDocs.authentication.example.value || apiDocs.authentication.example)}</code></pre>
              </div>
            </section>

            {/* API 端点 */}
            <section className="resources-card glass-light">
              <h2>API Endpoints</h2>
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                {apiDocs.endpoints.map((endpoint, index) => (
                  <div key={index} className="api-endpoint glass-light">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span className={`api-method ${String(endpoint.method.value || endpoint.method).toLowerCase()}`}>
                        {String(endpoint.method.value || endpoint.method)}
                      </span>
                      <span className="api-path">{String(endpoint.path.value || endpoint.path)}</span>
                    </div>
                    <p className="api-desc">{endpoint.description.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 示例请求 */}
            <section className="resources-card glass-light">
              <h2>{apiDocs.exampleRequests.title.value}</h2>
              <h3>{apiDocs.exampleRequests.getContentList.value}</h3>
              <div className="code-block">
                <pre><code>{`curl -X GET "${String(apiDocs.baseUrl.value || apiDocs.baseUrl)}/content" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json"`}</code></pre>
              </div>

              <h3>{apiDocs.exampleRequests.createContent.value}</h3>
              <div className="code-block">
                <pre><code>{`curl -X POST "${String(apiDocs.baseUrl.value || apiDocs.baseUrl)}/content" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Content",
    "content": "Content body...",
    "tags": ["tag1", "tag2"]
  }'`}</code></pre>
              </div>

              <h3>{apiDocs.exampleRequests.blockchainCertify.value}</h3>
              <div className="code-block">
                <pre><code>{`curl -X POST "${String(apiDocs.baseUrl.value || apiDocs.baseUrl)}/blockchain/certify" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_id": 12345
  }'`}</code></pre>
              </div>
            </section>

            {/* 响应格式 */}
            <section className="resources-card glass-light">
              <h2>{apiDocs.responseFormat.title.value}</h2>
              <p>{apiDocs.responseFormat.description.value}</p>
              <div className="code-block">
                <pre><code>{`{
  "success": true,
  "data": { ... },
  "message": "${apiDocs.responseFormat.successMessage.value}",
  "timestamp": "2026-01-14T10:00:00Z"
}`}</code></pre>
              </div>

              <h3>{apiDocs.responseFormat.errorResponse.value}</h3>
              <div className="code-block">
                <pre><code>{`{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "${apiDocs.responseFormat.errorMessage.value}"
  },
  "timestamp": "2026-01-14T10:00:00Z"
}`}</code></pre>
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
