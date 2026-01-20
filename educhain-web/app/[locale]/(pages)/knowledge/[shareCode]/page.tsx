import { Suspense } from 'react';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import KnowledgeDetailClient from './KnowledgeDetailClient';
import './page.css';

// 静态路径生成（用于静态导出）
export async function generateStaticParams() {
  const { knowledgeStaticPaths, generateLocalizedPaths } = await import('@/../static-paths.config');
  return generateLocalizedPaths(knowledgeStaticPaths);
}

// 服务器组件 - 负责静态生成和 SEO
export default function KnowledgeDetailPage() {
  return (
    <>
      <Navbar />
      <div className="knowledge-detail-page">
        <Suspense fallback={
          <div className="page-content-narrow">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        }>
          <KnowledgeDetailClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
