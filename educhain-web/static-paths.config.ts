/**
 * 静态路径配置
 * 用于 Next.js 静态导出时预生成重要页面
 */

// 从 Mock 数据导入
import { mockKnowledgeItems } from './src/mock/data/knowledge';
import { mockBlocks } from './src/mock/data/blockchain';

/**
 * 需要预生成的知识详情页面
 * 只预生成前 30 个知识页面（最重要的内容）
 */
export const knowledgeStaticPaths = mockKnowledgeItems
  .slice(0, 30)
  .map((item) => ({
    shareCode: item.shareCode,
  }));

/**
 * 需要预生成的区块详情页面
 * 只预生成前 20 个区块（展示区块链功能）
 */
export const blockStaticPaths = mockBlocks
  .slice(0, 20)
  .map((block) => ({
    id: String(block.index),
  }));

/**
 * 支持的语言列表
 */
export const locales = ['zh-CN', 'en'] as const;

/**
 * 生成所有语言的路径
 */
export function generateLocalizedPaths<T extends Record<string, string>>(
  paths: T[]
): Array<T & { locale: string }> {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      ...path,
      locale,
    }))
  );
}
