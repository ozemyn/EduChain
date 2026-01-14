import { t, type DeclarationContent } from 'intlayer';

const knowledgeListContent = {
  key: 'knowledge-list-page',
  content: {
    title: t({
      'zh-CN': '知识库',
      en: 'Knowledge Base',
    }),
    description: t({
      'zh-CN': '探索无限知识，分享智慧结晶',
      en: 'Explore and Share Knowledge',
    }),
    createButton: t({
      'zh-CN': '发布知识',
      en: 'Publish',
    }),
    showFilter: t({
      'zh-CN': '显示筛选',
      en: 'Show Filters',
    }),
    hideFilter: t({
      'zh-CN': '隐藏筛选',
      en: 'Hide Filters',
    }),
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
