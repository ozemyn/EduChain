'use client';

/**
 * Mock Provider 组件
 * 用于在客户端初始化 Mock 服务
 */

import { useEffect, useState } from 'react';
import { useIntlayer } from 'next-intlayer';

interface MockProviderProps {
  children: React.ReactNode;
}

// 全局标记，确保 MSW 只初始化一次
let mswInitialized = false;
let mswPromise: Promise<void> | null = null;

export function MockProvider({ children }: MockProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const content = useIntlayer('mock-provider');

  useEffect(() => {
    const initMockService = async () => {
      if (!useMock) {
        setIsReady(true);
        return;
      }

      // 如果已经初始化过，直接返回
      if (mswInitialized) {
        setIsReady(true);
        return;
      }

      // 如果正在初始化，等待完成
      if (mswPromise) {
        await mswPromise;
        setIsReady(true);
        return;
      }

      // 开始初始化
      mswPromise = (async () => {
        try {
          const { initMock } = await import('@/mock');
          await initMock();
          mswInitialized = true;
          console.log('[MockProvider] MSW 初始化完成');
        } catch (error) {
          console.error('[MockProvider] MSW 初始化失败:', error);
        }
      })();

      await mswPromise;
      setIsReady(true);
    };

    initMockService();
  }, [useMock]);

  // 在 Mock 服务初始化完成前显示加载状态
  if (!isReady && useMock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{content.loading.value}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default MockProvider;
