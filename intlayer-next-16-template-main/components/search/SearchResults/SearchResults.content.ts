import { t, type DeclarationContent } from 'intlayer';

const searchResultsContent = {
  key: 'search-results',
  content: {
    results: t({
      'zh-CN': '搜索结果',
      en: 'Search Results',
    }),
    found: t({
      'zh-CN': '找到',
      en: 'Found',
    }),
    items: t({
      'zh-CN': '条结果',
      en: 'results',
    }),
    viewMode: {
      grid: t({
        'zh-CN': '网格视图',
        en: 'Grid View',
      }),
      list: t({
        'zh-CN': '列表视图',
        en: 'List View',
      }),
    },
    loading: t({
      'zh-CN': '搜索中...',
      en: 'Searching...',
    }),
    empty: t({
      'zh-CN': '未找到相关结果',
      en: 'No results found',
    }),
    emptyDescription: t({
      'zh-CN': '尝试使用不同的关键词或调整筛选条件',
      en: 'Try different keywords or adjust filters',
    }),
    loadMore: t({
      'zh-CN': '加载更多',
      en: 'Load More',
    }),
  },
} satisfies DeclarationContent;

export default searchResultsContent;
