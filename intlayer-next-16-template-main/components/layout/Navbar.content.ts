import { type Dictionary, t } from 'intlayer';

const navbarContent = {
  key: 'navbar',
  content: {
    home: t({
      'zh-CN': '首页',
      en: 'Home',
    }),
    knowledge: t({
      'zh-CN': '知识库',
      en: 'Knowledge',
    }),
    blockchain: t({
      'zh-CN': '区块链',
      en: 'Blockchain',
    }),
    search: t({
      'zh-CN': '搜索',
      en: 'Search',
    }),
    searchPlaceholder: t({
      'zh-CN': '搜索知识、用户...',
      en: 'Search...',
    }),
    recommendations: t({
      'zh-CN': '推荐',
      en: 'Picks',
    }),
    community: t({
      'zh-CN': '社区',
      en: 'Hub',
    }),
    publish: t({
      'zh-CN': '发布',
      en: 'Publish',
    }),
    login: t({
      'zh-CN': '登录',
      en: 'Login',
    }),
    profile: t({
      'zh-CN': '个人中心',
      en: 'Profile',
    }),
    logout: t({
      'zh-CN': '退出登录',
      en: 'Logout',
    }),
    theme: t({
      'zh-CN': '主题',
      en: 'Theme',
    }),
    notifications: t({
      'zh-CN': '通知',
      en: 'Notifications',
    }),
  },
} satisfies Dictionary;

export default navbarContent;
