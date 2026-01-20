import { Suspense } from 'react';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import BlockDetailClient from './BlockDetailClient';
import './page.css';

// 静态路径生成（用于静态导出）
export async function generateStaticParams() {
  const { blockStaticPaths, generateLocalizedPaths } = await import('@/../static-paths.config');
  return generateLocalizedPaths(blockStaticPaths);
}

// 服务器组件 - 负责静态生成和 SEO
export default function BlockDetailPage() {
  return (
    <>
      <Navbar />
      <div className="block-detail-page">
        <Suspense fallback={
          <>
            <div className="block-background">
              <div className="block-blob block-blob-1" />
              <div className="block-blob block-blob-2" />
            </div>
            <div className="page-content-narrow">
              <div className="loading-state">
                <div className="loading-spinner motion-spin"></div>
                <p>Loading...</p>
              </div>
            </div>
          </>
        }>
          <BlockDetailClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
