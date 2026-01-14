import { t, type DeclarationContent } from 'intlayer';

const blockchainExplorerContent = {
  key: 'blockchain-explorer-page',
  content: {
    title: t({
      'zh-CN': '区块链浏览器',
      en: 'Blockchain Explorer',
    }),
    subtitle: t({
      'zh-CN': '探索EduChain区块链，查看所有存证记录',
      en: 'Explore EduChain blockchain and view all certification records',
    }),
    tabs: {
      overview: t({
        'zh-CN': '概览',
        en: 'Overview',
      }),
      blocks: t({
        'zh-CN': '区块列表',
        en: 'Blocks',
      }),
      search: t({
        'zh-CN': '搜索',
        en: 'Search',
      }),
    },
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    stats: {
      totalBlocks: t({
        'zh-CN': '总区块数',
        en: 'Total Blocks',
      }),
      totalTransactions: t({
        'zh-CN': '总交易数',
        en: 'Total Transactions',
      }),
      totalCertificates: t({
        'zh-CN': '总存证数',
        en: 'Total Certificates',
      }),
      avgBlockTime: t({
        'zh-CN': '平均出块时间',
        en: 'Avg Block Time',
      }),
    },
    blockLabel: t({
      'zh-CN': '区块',
      en: 'Block',
    }),
    blockInfo: {
      hash: t({
        'zh-CN': '哈希',
        en: 'Hash',
      }),
      transactions: t({
        'zh-CN': '交易数',
        en: 'Transactions',
      }),
      miner: t({
        'zh-CN': '矿工',
        en: 'Miner',
      }),
    },
    search: {
      title: t({
        'zh-CN': '区块链搜索',
        en: 'Blockchain Search',
      }),
      description: t({
        'zh-CN': '通过区块编号、交易哈希或证书ID搜索区块链记录',
        en: 'Search blockchain records by block number, transaction hash, or certificate ID',
      }),
      types: {
        block: t({
          'zh-CN': '区块',
          en: 'Block',
        }),
        transaction: t({
          'zh-CN': '交易',
          en: 'Transaction',
        }),
        certificate: t({
          'zh-CN': '证书',
          en: 'Certificate',
        }),
      },
      placeholder: t({
        'zh-CN': '输入搜索内容...',
        en: 'Enter search query...',
      }),
      searchBtn: t({
        'zh-CN': '搜索',
        en: 'Search',
      }),
    },
  },
} satisfies DeclarationContent;

export default blockchainExplorerContent;
