import { type Dictionary, t } from 'intlayer';

const homeContent = {
  key: 'home',
  content: {
    hero: {
      badge: t({
        'zh-CN': '全新体验',
        en: 'New Experience',
      }),
      title: t({
        'zh-CN': 'EduChain',
        en: 'EduChain',
      }),
      subtitle: t({
        'zh-CN': '基于区块链存证的教育知识共享与智能检索系统',
        en: 'Blockchain-based Educational Knowledge Sharing and Intelligent Retrieval System',
      }),
      description: t({
        'zh-CN': '连接全球学习者与教育者，构建去中心化的知识共享生态系统。让每一份知识都能发光发热，让每一次学习都更加高效。',
        en: 'Connecting global learners and educators, building a decentralized knowledge sharing ecosystem. Making every piece of knowledge shine and every learning experience more efficient.',
      }),
      searchPlaceholder: t({
        'zh-CN': '搜索知识内容、课程、专家...',
        en: 'Search knowledge, courses, experts...',
      }),
      searchButton: t({
        'zh-CN': '探索',
        en: 'Explore',
      }),
      startLearning: t({
        'zh-CN': '开始学习',
        en: 'Start Learning',
      }),
      shareKnowledge: t({
        'zh-CN': '分享知识',
        en: 'Share Knowledge',
      }),
    },
    stats: {
      knowledge: t({
        'zh-CN': '知识条目',
        en: 'Knowledge Items',
      }),
      users: t({
        'zh-CN': '活跃用户',
        en: 'Active Users',
      }),
      views: t({
        'zh-CN': '总浏览量',
        en: 'Total Views',
      }),
    },
    features: {
      title: t({
        'zh-CN': '核心功能',
        en: 'Core Features',
      }),
      description: t({
        'zh-CN': '为您提供全方位的学习和知识分享体验',
        en: 'Providing comprehensive learning and knowledge sharing experience',
      }),
      knowledge: {
        title: t({
          'zh-CN': '知识库',
          en: 'Knowledge Base',
        }),
        description: t({
          'zh-CN': '海量优质教育内容，涵盖各个学科领域，支持多媒体资源展示',
          en: 'Massive quality educational content covering all disciplines with multimedia support',
        }),
      },
      search: {
        title: t({
          'zh-CN': '智能搜索',
          en: 'Smart Search',
        }),
        description: t({
          'zh-CN': '强大的AI驱动搜索引擎，精准匹配您的学习需求',
          en: 'Powerful AI-driven search engine matching your learning needs precisely',
        }),
      },
      profile: {
        title: t({
          'zh-CN': '个人中心',
          en: 'Profile',
        }),
        description: t({
          'zh-CN': '个性化学习空间，记录您的学习轨迹和成长历程',
          en: 'Personalized learning space tracking your learning journey and growth',
        }),
      },
      community: {
        title: t({
          'zh-CN': '社区交流',
          en: 'Community',
        }),
        description: t({
          'zh-CN': '与全球学习者互动交流，分享知识与经验',
          en: 'Interact with global learners, share knowledge and experience',
        }),
      },
    },
    recommendations: {
      title: t({
        'zh-CN': '热门推荐',
        en: 'Trending',
      }),
    },
  },
} satisfies Dictionary;

export default homeContent;