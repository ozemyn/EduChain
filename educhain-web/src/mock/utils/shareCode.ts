/**
 * Mock 分享码生成工具
 */

// Base58 字符集
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const PREFIX = 'EK';

/**
 * 将数字编码为 Base58 字符串
 */
function encodeBase58(num: number): string {
  if (num === 0) return ALPHABET[0];

  let result = '';
  while (num > 0) {
    result = ALPHABET[num % ALPHABET.length] + result;
    num = Math.floor(num / ALPHABET.length);
  }
  return result;
}

/**
 * 为 Mock 数据生成分享码
 * 基于 ID 和时间戳生成确定性的分享码
 */
export function generateMockShareCode(id: number): string {
  const timestamp = 1704067200000; // 2024-01-01 的时间戳
  const combined = id * 1000 + (timestamp % 1000);
  const encoded = encodeBase58(combined);
  return PREFIX + encoded;
}

/**
 * 验证分享码格式
 */
export function isValidMockShareCode(shareCode: string): boolean {
  if (!shareCode || !shareCode.startsWith(PREFIX)) return false;

  const encoded = shareCode.substring(PREFIX.length);
  if (encoded.length === 0) return false;

  return encoded.split('').every(char => ALPHABET.includes(char));
}
