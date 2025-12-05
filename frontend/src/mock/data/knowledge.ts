/**
 * 知识条目 Mock 数据
 * 使用清晰格式的知识库数据
 */

import type { KnowledgeItem, KnowledgeStats } from '@/types/api';
import { cleanKnowledgeItems } from './knowledge-items';

// 生成内容哈希的辅助函数
const generateContentHash = (id: number): string => {
  // 使用知识ID生成一个固定的哈希值
  const hashBase = `knowledge_${id}_content`;
  const hash = Array.from(hashBase)
    .reduce((acc, char) => acc + char.charCodeAt(0), id * 1000)
    .toString(16)
    .padStart(64, '0')
    .substring(0, 64);
  return `0x${hash}`;
};

// 使用干净格式的知识库数据，并添加contentHash
export const mockKnowledgeItems: KnowledgeItem[] = cleanKnowledgeItems.map(
  item => ({
    ...item,
    contentHash: generateContentHash(item.id),
  })
) as KnowledgeItem[];

// 知识统计数据
export const mockKnowledgeStats: Record<number, KnowledgeStats> = {
  1: {
    knowledgeId: 1,
    viewCount: 4511,
    likeCount: 263,
    favoriteCount: 174,
    commentCount: 57,
    score: 92.5,
  },
  2: {
    knowledgeId: 2,
    viewCount: 3892,
    likeCount: 218,
    favoriteCount: 145,
    commentCount: 43,
    score: 89.3,
  },
  3: {
    knowledgeId: 3,
    viewCount: 3245,
    likeCount: 195,
    favoriteCount: 128,
    commentCount: 38,
    score: 87.1,
  },
  4: {
    knowledgeId: 4,
    viewCount: 2987,
    likeCount: 176,
    favoriteCount: 112,
    commentCount: 34,
    score: 85.7,
  },
  5: {
    knowledgeId: 5,
    viewCount: 2756,
    likeCount: 164,
    favoriteCount: 98,
    commentCount: 31,
    score: 84.2,
  },
  6: {
    knowledgeId: 6,
    viewCount: 2543,
    likeCount: 152,
    favoriteCount: 89,
    commentCount: 28,
    score: 82.8,
  },
  7: {
    knowledgeId: 7,
    viewCount: 2398,
    likeCount: 143,
    favoriteCount: 82,
    commentCount: 26,
    score: 81.5,
  },
  8: {
    knowledgeId: 8,
    viewCount: 2187,
    likeCount: 134,
    favoriteCount: 76,
    commentCount: 24,
    score: 80.1,
  },
  9: {
    knowledgeId: 9,
    viewCount: 2045,
    likeCount: 126,
    favoriteCount: 71,
    commentCount: 22,
    score: 78.9,
  },
  10: {
    knowledgeId: 10,
    viewCount: 1923,
    likeCount: 118,
    favoriteCount: 67,
    commentCount: 20,
    score: 77.6,
  },
  11: {
    knowledgeId: 11,
    viewCount: 1812,
    likeCount: 111,
    favoriteCount: 63,
    commentCount: 19,
    score: 76.4,
  },
  12: {
    knowledgeId: 12,
    viewCount: 1705,
    likeCount: 104,
    favoriteCount: 59,
    commentCount: 18,
    score: 75.2,
  },
  13: {
    knowledgeId: 13,
    viewCount: 1634,
    likeCount: 98,
    favoriteCount: 56,
    commentCount: 17,
    score: 74.1,
  },
  14: {
    knowledgeId: 14,
    viewCount: 1567,
    likeCount: 93,
    favoriteCount: 53,
    commentCount: 16,
    score: 73.0,
  },
  15: {
    knowledgeId: 15,
    viewCount: 1498,
    likeCount: 88,
    favoriteCount: 50,
    commentCount: 15,
    score: 71.9,
  },
};
