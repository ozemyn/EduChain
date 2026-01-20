import { t, type DeclarationContent } from 'intlayer';

const searchFilterContent = {
  key: 'search-filter',
  content: {
    title: t({
      'zh-CN': '筛选条件',
      en: 'Filters',
    }),
    category: t({
      'zh-CN': '分类',
      en: 'Category',
    }),
    type: t({
      'zh-CN': '类型',
      en: 'Type',
    }),
    sort: t({
      'zh-CN': '排序',
      en: 'Sort',
    }),
    date: t({
      'zh-CN': '时间',
      en: 'Date',
    }),
    allCategories: t({
      'zh-CN': '全部分类',
      en: 'All Categories',
    }),
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
    sortOptions: {
      relevance: t({
        'zh-CN': '相关性',
        en: 'Relevance',
      }),
      latest: t({
        'zh-CN': '最新发布',
        en: 'Latest',
      }),
      popular: t({
        'zh-CN': '最受欢迎',
        en: 'Popular',
      }),
    },
    dateOptions: {
      all: t({
        'zh-CN': '全部时间',
        en: 'All Time',
      }),
      today: t({
        'zh-CN': '今天',
        en: 'Today',
      }),
      week: t({
        'zh-CN': '本周',
        en: 'This Week',
      }),
      month: t({
        'zh-CN': '本月',
        en: 'This Month',
      }),
      year: t({
        'zh-CN': '今年',
        en: 'This Year',
      }),
    },
    reset: t({
      'zh-CN': '重置',
      en: 'Reset',
    }),
  },
} satisfies DeclarationContent;

export default searchFilterContent;
