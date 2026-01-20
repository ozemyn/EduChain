import { t, type Dictionary } from 'intlayer';

const communityPageContent = {
  key: 'community-page',
  content: {
    // 英雄区域
    hero: {
      badge: t({
        'zh-CN': '学习社区',
        en: 'Learning Community',
      }),
      title: t({
        'zh-CN': '学习社区',
        en: 'Community',
      }),
      subtitle: t({
        'zh-CN': '与全球学习者互动交流，共同成长',
        en: 'Connect with Learners Worldwide',
      }),
      description: t({
        'zh-CN': '加入充满活力的学习社区，与志同道合的伙伴分享知识、交流经验、解决问题。在这里，每个问题都能得到解答，每个想法都值得讨论。',
        en: 'Join a vibrant learning community, share knowledge with like-minded partners, exchange experiences, and solve problems together. Here, every question gets answered, every idea deserves discussion.',
      }),
      startButton: t({
        'zh-CN': '开始讨论',
        en: 'Start Discussion',
      }),
      exploreButton: t({
        'zh-CN': '浏览话题',
        en: 'Explore Topics',
      }),
    },
    // 统计数据
    stats: {
      users: t({
        'zh-CN': '活跃用户',
        en: 'Active Users',
      }),
      discussions: t({
        'zh-CN': '讨论话题',
        en: 'Discussions',
      }),
      replies: t({
        'zh-CN': '回复总数',
        en: 'Total Replies',
      }),
    },
    // 原有内容
    statsUsers: t({
      'zh-CN': '活跃用户',
      en: 'Active Users',
    }),
    statsDiscussions: t({
      'zh-CN': '讨论话题',
      en: 'Discussions',
    }),
    tabHot: t({
      'zh-CN': '热门讨论',
      en: 'Hot',
    }),
    tabNew: t({
      'zh-CN': '最新发布',
      en: 'Latest',
    }),
    tabTrending: t({
      'zh-CN': '热门上升',
      en: 'Trending',
    }),
    loadMore: t({
      'zh-CN': '加载更多讨论',
      en: 'Load More',
    }),
    hotTopics: t({
      'zh-CN': '热门话题',
      en: 'Hot Topics',
    }),
    activeUsers: t({
      'zh-CN': '活跃用户',
      en: 'Active Users',
    }),
    quickLinks: t({
      'zh-CN': '快速入口',
      en: 'Quick Links',
    }),
    linkKnowledge: t({
      'zh-CN': '浏览知识库',
      en: 'Browse Knowledge',
    }),
    linkRecommendations: t({
      'zh-CN': '查看推荐',
      en: 'View Recommendations',
    }),
    linkSearch: t({
      'zh-CN': '搜索内容',
      en: 'Search Content',
    }),
    replies: t({
      'zh-CN': '回复',
      en: 'replies',
    }),
    views: t({
      'zh-CN': '浏览',
      en: 'views',
    }),
    likes: t({
      'zh-CN': '点赞',
      en: 'likes',
    }),
    posts: t({
      'zh-CN': '帖',
      en: 'posts',
    }),
    discussions: t({
      'zh-CN': '讨论',
      en: 'discussions',
    }),
  },
} satisfies Dictionary;

export default communityPageContent;
