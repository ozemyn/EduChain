import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// 懒加载页面组件
const HomePage = React.lazy(() => import('../pages/Home'));
const LoginPage = React.lazy(() => import('../pages/auth/Login'));
const RegisterPage = React.lazy(() => import('../pages/auth/Register'));
const ProfilePage = React.lazy(() => import('../pages/user/Profile'));
const KnowledgeListPage = React.lazy(
  () => import('../pages/knowledge/KnowledgeList')
);
const KnowledgeDetailPage = React.lazy(
  () => import('../pages/knowledge/KnowledgeDetail')
);
const CreateKnowledgePage = React.lazy(
  () => import('../pages/knowledge/CreateKnowledge')
);
const SearchPage = React.lazy(() => import('../pages/search/Search'));
const RecommendationsPage = React.lazy(
  () => import('../pages/recommendation/Recommendations')
);
const CommunityPage = React.lazy(() => import('../pages/community/Community'));
const BlockchainExplorerPage = React.lazy(
  () => import('../pages/blockchain/BlockchainExplorer')
);
const BlockDetailPage = React.lazy(
  () => import('../pages/blockchain/BlockDetail')
);
const TransactionDetailPage = React.lazy(
  () => import('../pages/blockchain/TransactionDetail')
);
const CertificateVerifyPage = React.lazy(
  () => import('../pages/blockchain/CertificateVerify')
);
const NotFoundPage = React.lazy(() => import('../pages/error/NotFound'));

// 法律页面
const TermsOfServicePage = React.lazy(() => import('../pages/legal/TermsOfService'));
const PrivacyPolicyPage = React.lazy(() => import('../pages/legal/PrivacyPolicy'));
const CopyrightPage = React.lazy(() => import('../pages/legal/Copyright'));
const DisclaimerPage = React.lazy(() => import('../pages/legal/Disclaimer'));

// 管理员页面
const AdminLoginPage = React.lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboardPage = React.lazy(
  () => import('../pages/admin/AdminDashboard')
);
const UserManagementPage = React.lazy(
  () => import('../pages/admin/UserManagement')
);
const ContentManagementPage = React.lazy(
  () => import('../pages/admin/ContentManagement')
);
const SystemMonitoringPage = React.lazy(
  () => import('../pages/admin/SystemMonitoring')
);
const SystemLogsPage = React.lazy(() => import('../pages/admin/SystemLogs'));

// 加载组件包装器
// eslint-disable-next-line react-refresh/only-export-components
const LoadingWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Suspense
    fallback={
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <Spin size="large" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <LoadingWrapper>
            <HomePage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'knowledge',
        children: [
          {
            index: true,
            element: (
              <LoadingWrapper>
                <KnowledgeListPage />
              </LoadingWrapper>
            ),
          },
          {
            path: ':id',
            element: (
              <LoadingWrapper>
                <KnowledgeDetailPage />
              </LoadingWrapper>
            ),
          },
          {
            path: 'create',
            element: (
              <ProtectedRoute>
                <LoadingWrapper>
                  <CreateKnowledgePage />
                </LoadingWrapper>
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'search',
        element: (
          <LoadingWrapper>
            <SearchPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'recommendations',
        element: (
          <LoadingWrapper>
            <RecommendationsPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'community',
        element: (
          <LoadingWrapper>
            <CommunityPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'blockchain',
        children: [
          {
            index: true,
            element: (
              <LoadingWrapper>
                <BlockchainExplorerPage />
              </LoadingWrapper>
            ),
          },
          {
            path: 'block/:index',
            element: (
              <LoadingWrapper>
                <BlockDetailPage />
              </LoadingWrapper>
            ),
          },
          {
            path: 'transaction/:id',
            element: (
              <LoadingWrapper>
                <TransactionDetailPage />
              </LoadingWrapper>
            ),
          },
          {
            path: 'certificates/:certificateId/verify',
            element: (
              <LoadingWrapper>
                <CertificateVerifyPage />
              </LoadingWrapper>
            ),
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LoadingWrapper>
              <ProfilePage />
            </LoadingWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'terms',
        element: (
          <LoadingWrapper>
            <TermsOfServicePage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'privacy',
        element: (
          <LoadingWrapper>
            <PrivacyPolicyPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'copyright',
        element: (
          <LoadingWrapper>
            <CopyrightPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'disclaimer',
        element: (
          <LoadingWrapper>
            <DisclaimerPage />
          </LoadingWrapper>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <LoadingWrapper>
        <LoginPage />
      </LoadingWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <LoadingWrapper>
        <RegisterPage />
      </LoadingWrapper>
    ),
  },
  // 管理员路由
  {
    path: '/admin/login',
    element: (
      <LoadingWrapper>
        <AdminLoginPage />
      </LoadingWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LoadingWrapper>
            <AdminDashboardPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <LoadingWrapper>
            <UserManagementPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'knowledge',
        element: (
          <LoadingWrapper>
            <ContentManagementPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'categories',
        element: (
          <LoadingWrapper>
            <div style={{ padding: '24px' }}>分类管理页面开发中...</div>
          </LoadingWrapper>
        ),
      },
      {
        path: 'comments',
        element: (
          <LoadingWrapper>
            <div style={{ padding: '24px' }}>评论管理页面开发中...</div>
          </LoadingWrapper>
        ),
      },
      {
        path: 'statistics',
        element: (
          <LoadingWrapper>
            <SystemMonitoringPage />
          </LoadingWrapper>
        ),
      },
      {
        path: 'logs',
        element: (
          <LoadingWrapper>
            <SystemLogsPage />
          </LoadingWrapper>
        ),
      },
    ],
  },
  {
    path: '/404',
    element: (
      <LoadingWrapper>
        <NotFoundPage />
      </LoadingWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
