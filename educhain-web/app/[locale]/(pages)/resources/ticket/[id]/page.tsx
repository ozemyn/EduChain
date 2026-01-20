import { Suspense } from 'react';
import Navbar from '@/../components/layout/Navbar';
import Footer from '@/../components/layout/Footer';
import TicketDetailClient from './TicketDetailClient';
import './page.css';

// 静态路径生成 - 生成一个示例工单ID用于静态导出
export async function generateStaticParams() {
  // 生成一个示例路径，实际使用时会在客户端动态加载
  return [
    { id: '1' },
  ];
}

// 服务器组件 - 工单详情页不需要预生成，但保持架构一致性
export default function TicketDetailPage() {
  return (
    <>
      <Navbar />
      <div className="ticket-detail-page">
        <Suspense fallback={
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        }>
          <TicketDetailClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
