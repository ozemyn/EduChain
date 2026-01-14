import { type Dictionary, t } from 'intlayer';

const knowledgeFilterContent = {
  key: 'knowledge-filter',
  content: {
    title: t({
      'zh-CN': '筛选条件',
      en: 'Filters',
    }),
    labels: {
      search: t({
        'zh-CN': '搜索内容',
        en: 'Search',
      }),
      category: t({
        'zh-CN': '选择分类',
        en: 'Select Category',
      }),
      type: t({
        'zh-CN': '内容类型',
        en: 'Content Type',
      }),
      sort: t({
        'zh-CN': '排序方式',
        en: 'Sort By',
      }),
      tags: t({
        'zh-CN': '热门标签',
        en: 'Popular Tags',
      }),
    },
    placeholders: {
      search: t({
        'zh-CN': '搜索知识内容...',
        en: 'Search knowledge...',
      }),
    },
    types: {
      all: t({
        'zh-CN': '全部类型',
        en: 'All Types',
      }),
      text: t({
        'zh-CN': '文本',
        en: 'Text',
      }),
      image: t({
        'zh-CN': '图片',
        en: 'Image',
      }),
      video: t({
        'zh-CN': '视频',
        en: 'Video',
      }),
      pdf: t({
        'zh-CN': 'PDF',
        en: 'PDF',
      }),
      link: t({
        'zh-CN': '链接',
        en: 'Link',
      }),
    },
    sort: {
      latest: t({
        'zh-CN': '最新发布',
        en: 'Latest',
      }),
      popular: t({
        'zh-CN': '最受欢迎',
        en: 'Popular',
      }),
      relevant: t({
        'zh-CN': '相关性',
        en: 'Relevant',
      }),
    },
    actions: {
      clear: t({
        'zh-CN': '清空',
        en: 'Clear',
      }),
      search: t({
        'zh-CN': '搜索',
        en: 'Search',
      }),
    },
    tags: {
      algorithm: t({
        'zh-CN': '算法',
        en: 'Algorithm',
      }),
      dataStructure: t({
        'zh-CN': '数据结构',
        en: 'Data Structure',
      }),
      frontend: t({
        'zh-CN': '前端',
        en: 'Frontend',
      }),
      backend: t({
        'zh-CN': '后端',
        en: 'Backend',
      }),
      fullstack: t({
        'zh-CN': '全栈',
        en: 'Full Stack',
      }),
      mobile: t({
        'zh-CN': '移动开发',
        en: 'Mobile Development',
      }),
      ai: t({
        'zh-CN': '人工智能',
        en: 'Artificial Intelligence',
      }),
      ml: t({
        'zh-CN': '机器学习',
        en: 'Machine Learning',
      }),
      dl: t({
        'zh-CN': '深度学习',
        en: 'Deep Learning',
      }),
    },
  },
} satisfies Dictionary;

export default knowledgeFilterContent;
