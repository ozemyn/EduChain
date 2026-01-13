/**
 * Mock Handlers 统一导出 & MSW 初始化
 */

import { setupWorker } from 'msw/browser';
import { authHandlers } from './auth';
import { userHandlers } from './user';
import { knowledgeHandlers } from './knowledge';
import { categoryHandlers } from './category';
import { commentHandlers } from './comment';
import { notificationHandlers } from './notification';
import { interactionHandlers } from './interaction';
import { followHandlers } from './follow';
import { searchHandlers } from './search';
import { blockchainHandlers } from './blockchain';
import { recommendationHandlers } from './recommendation';
import { communityHandlers } from './community';

// 合并所有 handlers
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...knowledgeHandlers,
  ...categoryHandlers,
  ...commentHandlers,
  ...notificationHandlers,
  ...interactionHandlers,
  ...followHandlers,
  ...searchHandlers,
  ...blockchainHandlers,
  ...recommendationHandlers,
  ...communityHandlers,
];

// 设置 Mock Server
export const setupMockServer = async () => {
  const worker = setupWorker(...handlers);

  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  console.log('[MSW] Mock Service Worker 已启动');
  return worker;
};

// 导出各模块 handlers
export {
  authHandlers,
  userHandlers,
  knowledgeHandlers,
  categoryHandlers,
  commentHandlers,
  notificationHandlers,
  interactionHandlers,
  followHandlers,
  searchHandlers,
  blockchainHandlers,
  recommendationHandlers,
  communityHandlers,
};
