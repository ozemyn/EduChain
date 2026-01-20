import { t, type DeclarationContent } from 'intlayer';

const blockDetailContent = {
  key: 'block-detail-page',
  content: {
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notFound: t({
      'zh-CN': '区块不存在',
      en: 'Block Not Found',
    }),
    notFoundDesc: t({
      'zh-CN': '未找到该区块记录，请检查区块编号是否正确',
      en: 'Block record not found, please check the block number',
    }),
    backBtn: t({
      'zh-CN': '返回浏览器',
      en: 'Back to Explorer',
    }),
    back: t({
      'zh-CN': '返回',
      en: 'Back',
    }),
    blockTitle: t({
      'zh-CN': '区块',
      en: 'Block',
    }),
    blockSubtitle: t({
      'zh-CN': '区块详细信息',
      en: 'Block Details',
    }),
    confirmed: t({
      'zh-CN': '已确认',
      en: 'Confirmed',
    }),
    details: {
      hash: t({
        'zh-CN': '区块哈希',
        en: 'Block Hash',
      }),
      previousHash: t({
        'zh-CN': '前一区块哈希',
        en: 'Previous Hash',
      }),
      timestamp: t({
        'zh-CN': '时间戳',
        en: 'Timestamp',
      }),
      nonce: t({
        'zh-CN': '随机数',
        en: 'Nonce',
      }),
      difficulty: t({
        'zh-CN': '难度',
        en: 'Difficulty',
      }),
      miner: t({
        'zh-CN': '矿工',
        en: 'Miner',
      }),
      size: t({
        'zh-CN': '大小',
        en: 'Size',
      }),
    },
    transactions: {
      title: t({
        'zh-CN': '交易列表',
        en: 'Transactions',
      }),
      subtitle: t({
        'zh-CN': '该区块包含的所有交易记录',
        en: 'All transactions included in this block',
      }),
      contentHash: t({
        'zh-CN': '内容哈希',
        en: 'Content Hash',
      }),
      timestamp: t({
        'zh-CN': '时间',
        en: 'Time',
      }),
      knowledgeId: t({
        'zh-CN': '知识ID',
        en: 'Knowledge ID',
      }),
    },
  },
} satisfies DeclarationContent;

export default blockDetailContent;
