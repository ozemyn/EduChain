import { t, type Dictionary } from 'intlayer';

const recommendationPageContent = {
  key: 'recommendation-page',
  content: {
    title: t({
      'zh-CN': '为您推荐',
      en: 'Recommended for You',
    }),
    description: t({
      'zh-CN': '基于您的兴趣和行为，为您精心挑选的优质内容',
      en: 'Quality content curated based on your interests and behavior',
    }),
    featureHot: t({
      'zh-CN': '热门推荐',
      en: 'Hot Picks',
    }),
    featureNew: t({
      'zh-CN': '最新内容',
      en: 'Latest',
    }),
    featurePremium: t({
      'zh-CN': '精选优质',
      en: 'Premium',
    }),
  },
} satisfies Dictionary;

export default recommendationPageContent;
