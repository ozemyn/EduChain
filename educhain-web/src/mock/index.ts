/**
 * Mock 数据配置入口
 * 通过环境变量控制是否启用 mock 数据
 */

import { USE_MOCK, isBrowser } from './config';

export const initMock = async () => {
  if (!USE_MOCK) {
    console.log('🌐 使用真实后端服务');
    return;
  }

  if (!isBrowser) {
    console.log('⚠️ Mock 服务仅在浏览器环境中运行');
    return;
  }

  console.log('🎭 Mock 服务已启用');

  const { setupMockServer } = await import('./handlers');
  await setupMockServer();
};

export { USE_MOCK };
export * from './config';
export * from './errors';
export * from './utils';
