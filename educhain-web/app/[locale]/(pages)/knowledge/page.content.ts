import { t, type DeclarationContent } from 'intlayer';

const knowledgeListContent = {
  key: 'knowledge-list-page',
  content: {
    // 英雄区域
    hero: {
      badge: t({
        'zh-CN': '知识共享',
        en: 'Knowledge Sharing',
      }),
      title: t({
        'zh-CN': '知识库',
        en: 'Knowledge Base',
      }),
      subtitle: t({
        'zh-CN': '探索无限知识，分享智慧结晶',
        en: 'Explore Infinite Knowledge, Share Wisdom',
      }),
      description: t({
        'zh-CN': '汇聚全球学习者的智慧，构建开放共享的知识生态系统。在这里，每一份知识都值得被看见，每一次分享都创造价值。',
        en: 'Gathering wisdom from global learners, building an open knowledge ecosystem. Here, every piece of knowledge deserves to be seen, every share creates value.',
      }),
      searchPlaceholder: t({
        'zh-CN': '搜索知识、课程、文档...',
        en: 'Search knowledge, courses, docs...',
      }),
      searchButton: t({
        'zh-CN': '搜索',
        en: 'Search',
      }),
      exploreButton: t({
        'zh-CN': '浏览全部',
        en: 'Explore All',
      }),
      createButton: t({
        'zh-CN': '发布知识',
        en: 'Publish Knowledge',
      }),
    },
    // 统计数据
    stats: {
      total: t({
        'zh-CN': '知识总量',
        en: 'Total Knowledge',
      }),
      contributors: t({
        'zh-CN': '贡献者',
        en: 'Contributors',
      }),
      categories: t({
        'zh-CN': '分类',
        en: 'Categories',
      }),
    },
    // 热门分类
    popularCategories: {
      title: t({
        'zh-CN': '热门分类',
        en: 'Popular Categories',
      }),
    },
    // 列表区域
    listSection: {
      title: t({
        'zh-CN': '全部知识',
        en: 'All Knowledge',
      }),
      showFilter: t({
        'zh-CN': '显示筛选',
        en: 'Show Filters',
      }),
      hideFilter: t({
        'zh-CN': '隐藏筛选',
        en: 'Hide Filters',
      }),
    },
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    empty: t({
      'zh-CN': '暂无知识内容',
      en: 'No knowledge found',
    }),
    emptyDescription: t({
      'zh-CN': '尝试调整筛选条件或发布第一个知识',
      en: 'Try adjusting filters or publish the first knowledge',
    }),
  },
} satisfies DeclarationContent;

export default knowledgeListContent;
