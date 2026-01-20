import { Suspense } from 'react';
import Navbar from '../../../../../../components/layout/Navbar';
import Footer from '../../../../../../components/layout/Footer';
import CertificateVerifyClient from './CertificateVerifyClient';
import './page.css';

// 静态路径生成 - 生成一个示例证书ID用于静态导出
export async function generateStaticParams() {
  // 生成一个示例路径，实际使用时会在客户端动态加载
  return [
    { certificateId: 'example' },
  ];
}

// 服务器组件 - 证书验证页不需要预生成，但保持架构一致性
export default function CertificateVerifyPage() {
  return (
    <>
      <Navbar />
      <div className="certificate-verify-page">
        <Suspense fallback={
          <>
            <div className="verify-background">
              <div className="verify-blob verify-blob-1" />
              <div className="verify-blob verify-blob-2" />
            </div>
            <div className="verify-container container">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Verifying...</p>
              </div>
            </div>
          </>
        }>
          <CertificateVerifyClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
