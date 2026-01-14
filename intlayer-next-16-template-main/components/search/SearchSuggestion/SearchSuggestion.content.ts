import { t, type DeclarationContent } from 'intlayer';

const searchSuggestionContent = {
  key: 'search-suggestion',
  content: {
    suggestions: t({
      'zh-CN': '搜索建议',
      en: 'Suggestions',
    }),
    history: t({
      'zh-CN': '搜索历史',
      en: 'Search History',
    }),
    hotSearches: t({
      'zh-CN': '热门搜索',
      en: 'Hot Searches',
    }),
    clearHistory: t({
      'zh-CN': '清空',
      en: 'Clear',
    }),
    empty: t({
      'zh-CN': '暂无搜索建议',
      en: 'No suggestions',
    }),
  },
} satisfies DeclarationContent;

export default searchSuggestionContent;
