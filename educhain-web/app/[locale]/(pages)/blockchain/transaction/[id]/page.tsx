import { Suspense } from 'react';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import TransactionDetailClient from './TransactionDetailClient';
import './page.css';

// 静态路径生成 - 生成一个示例交易ID用于静态导出
export async function generateStaticParams() {
  // 生成一个示例路径，实际使用时会在客户端动态加载
  return [
    { id: 'example' },
  ];
}

// 服务器组件 - 交易详情页不需要预生成，但保持架构一致性
export default function TransactionDetailPage() {
  return (
    <>
      <Navbar />
      <div className="transaction-detail-page">
        <Suspense fallback={
          <>
            <div className="tx-background">
              <div className="tx-blob tx-blob-1" />
              <div className="tx-blob tx-blob-2" />
            </div>
            <div className="page-content-narrow">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            </div>
          </>
        }>
          <TransactionDetailClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
