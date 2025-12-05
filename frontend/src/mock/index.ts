/**
 * Mock 数据配置入口
 * 通过环境变量控制是否启用 mock 数据
 */

import { setupMockServer } from './server';

// 从环境变量读取配置
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const initMock = () => {
  if (USE_MOCK) {
    console.log('🎭 Mock 服务已启用');
    setupMockServer();
  } else {
    console.log('🌐 使用真实后端服务');
  }
};

export { USE_MOCK };
