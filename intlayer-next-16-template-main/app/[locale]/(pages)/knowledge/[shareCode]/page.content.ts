import { t, type DeclarationContent } from 'intlayer';

const knowledgeDetailContent = {
  key: 'knowledge-detail-page',
  content: {
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notFound: t({
      'zh-CN': '知识不存在',
      en: 'Knowledge Not Found',
    }),
    notFoundDescription: t({
      'zh-CN': '该知识可能已被删除或不存在',
      en: 'This knowledge may have been deleted or does not exist',
    }),
    views: t({
      'zh-CN': '次浏览',
      en: 'views',
    }),
  },
} satisfies DeclarationContent;

export default knowledgeDetailContent;
