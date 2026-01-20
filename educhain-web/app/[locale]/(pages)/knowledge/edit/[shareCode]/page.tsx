import { Suspense } from 'react';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import KnowledgeEditClient from './KnowledgeEditClient';
import './page.css';

// 静态路径生成 - 生成一个示例shareCode用于静态导出
export async function generateStaticParams() {
  // 生成一个示例路径，实际使用时会在客户端动态加载
  return [
    { shareCode: 'example' },
  ];
}

// 服务器组件 - 编辑页面不需要预生成，但保持架构一致性
export default function EditKnowledgePage() {
  return (
    <>
      <Navbar />
      <div className="knowledge-edit-page">
        <Suspense fallback={
          <div className="page-content-narrow">
            <div className="loading-state glass-card motion-fade-in">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        }>
          <KnowledgeEditClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
