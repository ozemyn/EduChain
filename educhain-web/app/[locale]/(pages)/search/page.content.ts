import { t, type DeclarationContent } from 'intlayer';

const searchPageContent = {
  key: 'search-page',
  content: {
    title: t({
      'zh-CN': '搜索知识',
      en: 'Search Knowledge',
    }),
    description: t({
      'zh-CN': '探索海量知识内容，找到你需要的答案',
      en: 'Explore vast knowledge content and find the answers you need',
    }),
    toggleFilter: t({
      'zh-CN': '筛选',
      en: 'Filter',
    }),
    hideFilter: t({
      'zh-CN': '隐藏筛选',
      en: 'Hide Filter',
    }),
    showFilter: t({
      'zh-CN': '显示筛选',
      en: 'Show Filter',
    }),
  },
} satisfies DeclarationContent;

export default searchPageContent;
