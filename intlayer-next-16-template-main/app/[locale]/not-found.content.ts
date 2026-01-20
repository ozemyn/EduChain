import { t, type Dictionary } from 'intlayer';

const notFoundContent = {
  key: 'not-found-page',
  content: {
    title: t({
      'zh-CN': '页面走丢了',
      en: 'Page Not Found',
    }),
    description: t({
      'zh-CN': '抱歉，您访问的页面不存在或已被移除。让我们帮您找到正确的方向吧！',
      en: "Sorry, the page you're looking for doesn't exist or has been removed. Let us help you find the right direction!",
    }),
    goHome: t({
      'zh-CN': '返回首页',
      en: 'Go Home',
    }),
    goBack: t({
      'zh-CN': '返回上页',
      en: 'Go Back',
    }),
    suggestionsTitle: t({
      'zh-CN': '您可能想去这些地方',
      en: 'You might want to visit',
    }),
    exploreKnowledge: t({
      'zh-CN': '浏览知识',
      en: 'Explore Knowledge',
    }),
    searchContent: t({
      'zh-CN': '搜索内容',
      en: 'Search Content',
    }),
    visitCommunity: t({
      'zh-CN': '访问社区',
      en: 'Visit Community',
    }),
  },
} satisfies Dictionary;

export default notFoundContent;
