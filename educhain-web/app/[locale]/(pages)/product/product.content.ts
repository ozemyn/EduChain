import { type Dictionary, t } from 'intlayer';

const productContent = {
  key: 'product',
  content: {
    // 知识库
    knowledge: {
      title: t({
        'zh-CN': '知识库',
        en: 'Knowledge Base',
      }),
      description: t({
        'zh-CN': '海量优质教育内容，涵盖各个学科领域，支持多媒体资源展示',
        en: 'Massive quality educational content covering all disciplines with multimedia support',
      }),
      coreFeatures: t({
        'zh-CN': '核心特性',
        en: 'Core Features',
      }),
      features: [
        {
          icon: '📚',
          title: t({ 'zh-CN': '海量内容', en: 'Massive Content' }),
          description: t({ 'zh-CN': '涵盖编程、设计、商业、语言等数十个学科领域的优质内容', en: 'Quality content covering dozens of disciplines including programming, design, business, languages, etc.' }),
        },
        {
          icon: '🎬',
          title: t({ 'zh-CN': '多媒体支持', en: 'Multimedia Support' }),
          description: t({ 'zh-CN': '支持文本、图片、视频、音频、PDF等多种格式', en: 'Support for text, images, video, audio, PDF and other formats' }),
        },
        {
          icon: '🏷️',
          title: t({ 'zh-CN': '智能分类', en: 'Smart Classification' }),
          description: t({ 'zh-CN': '自动标签和分类系统，快速定位所需内容', en: 'Automatic tagging and classification system for quick content location' }),
        },
        {
          icon: '⭐',
          title: t({ 'zh-CN': '质量保证', en: 'Quality Assurance' }),
          description: t({ 'zh-CN': '专业审核团队，确保内容质量和准确性', en: 'Professional review team ensuring content quality and accuracy' }),
        },
      ],
      stats: {
        content: t({ 'zh-CN': '知识条目', en: 'Knowledge Items' }),
        categories: t({ 'zh-CN': '学科分类', en: 'Categories' }),
        creators: t({ 'zh-CN': '内容创作者', en: 'Content Creators' }),
      },
      cta: {
        title: t({ 'zh-CN': '开始探索知识库', en: 'Start Exploring Knowledge Base' }),
        description: t({ 'zh-CN': '发现海量优质学习资源，开启您的学习之旅', en: 'Discover massive quality learning resources and start your learning journey' }),
        button: t({ 'zh-CN': '立即探索', en: 'Explore Now' }),
      },
    },

    // 智能搜索
    search: {
      title: t({
        'zh-CN': '智能搜索',
        en: 'Smart Search',
      }),
      description: t({
        'zh-CN': '强大的AI驱动搜索引擎，精准匹配您的学习需求',
        en: 'Powerful AI-driven search engine matching your learning needs precisely',
      }),
      coreFeatures: t({
        'zh-CN': '核心特性',
        en: 'Core Features',
      }),
      useCases: t({
        'zh-CN': '使用场景',
        en: 'Use Cases',
      }),
      features: [
        {
          icon: '🤖',
          title: t({ 'zh-CN': 'AI 语义理解', en: 'AI Semantic Understanding' }),
          description: t({ 'zh-CN': '理解搜索意图，而不仅仅是关键词匹配', en: 'Understand search intent, not just keyword matching' }),
        },
        {
          icon: '⚡',
          title: t({ 'zh-CN': '毫秒级响应', en: 'Millisecond Response' }),
          description: t({ 'zh-CN': '高性能搜索引擎，即时返回搜索结果', en: 'High-performance search engine with instant results' }),
        },
        {
          icon: '🎯',
          title: t({ 'zh-CN': '精准匹配', en: 'Precise Matching' }),
          description: t({ 'zh-CN': '多维度相关性排序，最相关的内容优先展示', en: 'Multi-dimensional relevance ranking, most relevant content first' }),
        },
        {
          icon: '🔍',
          title: t({ 'zh-CN': '高级筛选', en: 'Advanced Filtering' }),
          description: t({ 'zh-CN': '按时间、类型、难度、评分等多维度筛选', en: 'Filter by time, type, difficulty, rating and more' }),
        },
      ],
      scenarios: [
        {
          icon: '💡',
          title: t({ 'zh-CN': '学习新技能', en: 'Learn New Skills' }),
          description: t({ 'zh-CN': '搜索"Python入门"，获取从零开始的完整学习路径', en: 'Search "Python basics" to get a complete learning path from scratch' }),
        },
        {
          icon: '🔧',
          title: t({ 'zh-CN': '解决问题', en: 'Solve Problems' }),
          description: t({ 'zh-CN': '遇到技术难题？搜索错误信息，快速找到解决方案', en: 'Technical problem? Search error messages to quickly find solutions' }),
        },
        {
          icon: '📖',
          title: t({ 'zh-CN': '深入研究', en: 'Deep Research' }),
          description: t({ 'zh-CN': '搜索特定主题，获取相关论文、教程和讨论', en: 'Search specific topics to get related papers, tutorials and discussions' }),
        },
      ],
      cta: {
        title: t({ 'zh-CN': '体验智能搜索', en: 'Experience Smart Search' }),
        description: t({ 'zh-CN': '让AI帮你找到最需要的学习资源', en: 'Let AI help you find the learning resources you need most' }),
        button: t({ 'zh-CN': '开始搜索', en: 'Start Searching' }),
      },
    },

    // 推荐系统
    recommendation: {
      title: t({
        'zh-CN': '推荐系统',
        en: 'Recommendation System',
      }),
      description: t({
        'zh-CN': '基于AI的个性化推荐，为您量身定制学习内容',
        en: 'AI-based personalized recommendations, tailored learning content for you',
      }),
      coreFeatures: t({
        'zh-CN': '核心特性',
        en: 'Core Features',
      }),
      features: [
        {
          icon: '🧠',
          title: t({ 'zh-CN': '智能学习', en: 'Smart Learning' }),
          description: t({ 'zh-CN': '系统持续学习您的偏好，推荐越来越精准', en: 'System continuously learns your preferences for increasingly accurate recommendations' }),
        },
        {
          icon: '📊',
          title: t({ 'zh-CN': '多维分析', en: 'Multi-dimensional Analysis' }),
          description: t({ 'zh-CN': '分析浏览历史、学习进度、兴趣标签等多维数据', en: 'Analyze browsing history, learning progress, interest tags and more' }),
        },
        {
          icon: '🎨',
          title: t({ 'zh-CN': '个性化展示', en: 'Personalized Display' }),
          description: t({ 'zh-CN': '首页、搜索结果、相关推荐全面个性化', en: 'Fully personalized homepage, search results, and related recommendations' }),
        },
        {
          icon: '🔄',
          title: t({ 'zh-CN': '实时更新', en: 'Real-time Updates' }),
          description: t({ 'zh-CN': '推荐内容实时更新，紧跟您的学习节奏', en: 'Recommendations update in real-time, keeping pace with your learning' }),
        },
      ],
      howItWorks: {
        title: t({ 'zh-CN': '工作原理', en: 'How It Works' }),
        steps: [
          {
            step: '1',
            title: t({ 'zh-CN': '数据收集', en: 'Data Collection' }),
            description: t({ 'zh-CN': '收集您的浏览、学习、互动行为数据', en: 'Collect your browsing, learning, and interaction behavior data' }),
          },
          {
            step: '2',
            title: t({ 'zh-CN': '特征分析', en: 'Feature Analysis' }),
            description: t({ 'zh-CN': 'AI分析您的学习偏好和知识图谱', en: 'AI analyzes your learning preferences and knowledge graph' }),
          },
          {
            step: '3',
            title: t({ 'zh-CN': '智能匹配', en: 'Smart Matching' }),
            description: t({ 'zh-CN': '匹配最适合您的学习内容和路径', en: 'Match the most suitable learning content and paths for you' }),
          },
          {
            step: '4',
            title: t({ 'zh-CN': '持续优化', en: 'Continuous Optimization' }),
            description: t({ 'zh-CN': '根据反馈不断优化推荐效果', en: 'Continuously optimize recommendations based on feedback' }),
          },
        ],
      },
      cta: {
        title: t({ 'zh-CN': '获取个性化推荐', en: 'Get Personalized Recommendations' }),
        description: t({ 'zh-CN': '登录后即可享受专属于您的学习推荐', en: 'Log in to enjoy learning recommendations tailored just for you' }),
        button: t({ 'zh-CN': '立即登录', en: 'Log In Now' }),
      },
    },

    // 社区交流
    community: {
      title: t({
        'zh-CN': '社区交流',
        en: 'Community',
      }),
      description: t({
        'zh-CN': '与全球学习者互动交流，分享知识与经验',
        en: 'Interact with global learners, share knowledge and experience',
      }),
      communityFeatures: t({
        'zh-CN': '社区功能',
        en: 'Community Features',
      }),
      features: [
        {
          icon: '💬',
          title: t({ 'zh-CN': '实时讨论', en: 'Real-time Discussion' }),
          description: t({ 'zh-CN': '在内容下方评论讨论，与作者和其他学习者互动', en: 'Comment and discuss under content, interact with authors and other learners' }),
        },
        {
          icon: '👥',
          title: t({ 'zh-CN': '学习小组', en: 'Study Groups' }),
          description: t({ 'zh-CN': '加入或创建学习小组，与志同道合的人一起学习', en: 'Join or create study groups to learn with like-minded people' }),
        },
        {
          icon: '🏆',
          title: t({ 'zh-CN': '排行榜', en: 'Leaderboards' }),
          description: t({ 'zh-CN': '查看活跃贡献者排行，激励持续学习', en: 'View active contributor rankings to motivate continuous learning' }),
        },
        {
          icon: '🎯',
          title: t({ 'zh-CN': '问答专区', en: 'Q&A Section' }),
          description: t({ 'zh-CN': '提出问题，获得社区专家的解答', en: 'Ask questions and get answers from community experts' }),
        },
      ],
      stats: {
        users: t({ 'zh-CN': '活跃用户', en: 'Active Users' }),
        discussions: t({ 'zh-CN': '讨论话题', en: 'Discussions' }),
        answers: t({ 'zh-CN': '问题解答', en: 'Answers' }),
      },
      cta: {
        title: t({ 'zh-CN': '加入学习社区', en: 'Join the Learning Community' }),
        description: t({ 'zh-CN': '与全球学习者一起成长，分享您的知识和经验', en: 'Grow with global learners, share your knowledge and experience' }),
        button: t({ 'zh-CN': '加入社区', en: 'Join Community' }),
      },
    },
  },
} satisfies Dictionary;


export default productContent;
