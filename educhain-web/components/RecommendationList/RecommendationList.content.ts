import { type Dictionary, t } from 'intlayer';

const recommendationListContent = {
  key: 'recommendation-list',
  content: {
    title: t({
      'zh-CN': '热门推荐',
      en: 'Trending Recommendations',
    }),
    refresh: t({
      'zh-CN': '刷新',
      en: 'Refresh',
    }),
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    empty: t({
      'zh-CN': '暂无推荐内容',
      en: 'No recommendations available',
    }),
    tabTrending: t({
      'zh-CN': '热门内容',
      en: 'Trending',
    }),
    tabPersonalized: t({
      'zh-CN': '个性化推荐',
      en: 'For You',
    }),
    tabGeneral: t({
      'zh-CN': '精选推荐',
      en: 'Featured',
    }),
    reasonPersonalized1: t({
      'zh-CN': '基于您的浏览历史',
      en: 'Based on your history',
    }),
    reasonPersonalized2: t({
      'zh-CN': '您可能感兴趣',
      en: 'You might like',
    }),
    reasonPersonalized3: t({
      'zh-CN': '相似用户也喜欢',
      en: 'Similar users liked',
    }),
    reasonPersonalized4: t({
      'zh-CN': '基于您的收藏',
      en: 'Based on your favorites',
    }),
    reasonPersonalized5: t({
      'zh-CN': '推荐给您',
      en: 'Recommended for you',
    }),
    reasonTrending1: t({
      'zh-CN': '本周热门',
      en: 'Trending this week',
    }),
    reasonTrending2: t({
      'zh-CN': '正在流行',
      en: 'Popular now',
    }),
    reasonTrending3: t({
      'zh-CN': '热度上升',
      en: 'Rising trend',
    }),
    reasonTrending4: t({
      'zh-CN': '用户热议',
      en: 'Hot discussion',
    }),
    reasonTrending5: t({
      'zh-CN': '趋势内容',
      en: 'Trending content',
    }),
    reasonGeneral1: t({
      'zh-CN': '编辑推荐',
      en: "Editor's pick",
    }),
    reasonGeneral2: t({
      'zh-CN': '优质内容',
      en: 'Quality content',
    }),
    reasonGeneral3: t({
      'zh-CN': '精选推荐',
      en: 'Featured',
    }),
    reasonGeneral4: t({
      'zh-CN': '值得一看',
      en: 'Worth reading',
    }),
    reasonGeneral5: t({
      'zh-CN': '热门推荐',
      en: 'Popular',
    }),
    footer: t({
      'zh-CN': '推荐算法会根据您的反馈不断优化',
      en: 'Recommendations improve based on your feedback',
    }),
    feedbackLike: t({
      'zh-CN': '喜欢',
      en: 'Like',
    }),
    feedbackDislike: t({
      'zh-CN': '不喜欢',
      en: 'Dislike',
    }),
    feedbackNotInterested: t({
      'zh-CN': '不感兴趣',
      en: 'Not interested',
    }),
    feedbackLiked: t({
      'zh-CN': '已标记为喜欢',
      en: 'Marked as liked',
    }),
    feedbackDisliked: t({
      'zh-CN': '已标记为不喜欢',
      en: 'Marked as disliked',
    }),
    feedbackRemoved: t({
      'zh-CN': '已标记为不感兴趣',
      en: 'Marked as not interested',
    }),
  },
} satisfies Dictionary;

export default recommendationListContent;
