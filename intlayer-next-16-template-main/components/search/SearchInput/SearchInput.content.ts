import { t, type DeclarationContent } from 'intlayer';

const searchInputContent = {
  key: 'search-input',
  content: {
    placeholder: t({
      'zh-CN': '搜索知识、标签、用户...',
      en: 'Search knowledge, tags, users...',
    }),
    search: t({
      'zh-CN': '搜索',
      en: 'Search',
    }),
    clear: t({
      'zh-CN': '清除',
      en: 'Clear',
    }),
  },
} satisfies DeclarationContent;

export default searchInputContent;
