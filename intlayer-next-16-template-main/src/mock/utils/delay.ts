/**
 * 网络延迟模拟
 */

import { MOCK_DELAY } from '../config';

/**
 * 延迟函数，模拟网络延迟
 */
export const delay = (ms: number = MOCK_DELAY): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 随机延迟，模拟真实网络波动
 */
export const randomDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
};
