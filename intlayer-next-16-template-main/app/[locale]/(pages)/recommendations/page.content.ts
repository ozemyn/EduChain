import { t, type Dictionary } from 'intlayer';

const recommendationPageContent = {
  key: 'recommendation-page',
  content: {
    hero: {
      badge: t({
        'zh-CN': '✨ 智能推荐',
        en: '✨ Smart Recommendations',
      }),
      title: t({
        'zh-CN': '为您推荐',
        en: 'Recommended for You',
      }),
      subtitle: t({
        'zh-CN': '发现更多精彩内容',
        en: 'Discover More Amazing Content',
      }),
      description: t({
        'zh-CN': '基于您的兴趣和行为，为您精心挑选的优质内容，让学习更高效',
        en: 'Quality content curated based on your interests and behavior, making learning more efficient',
      }),
      exploreButton: t({
        'zh-CN': '浏览推荐',
        en: 'Explore Recommendations',
      }),
      personalizeButton: t({
        'zh-CN': '个性化设置',
        en: 'Personalize',
      }),
    },
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
