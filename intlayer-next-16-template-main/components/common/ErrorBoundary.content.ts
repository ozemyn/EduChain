import { type Dictionary, t } from 'intlayer';

const errorBoundaryContent = {
  key: 'error-boundary',
  content: {
    title: t({
      'zh-CN': '哎呀，出了点问题',
      en: 'Oops, something went wrong',
    }),
    subtitle: t({
      'zh-CN': '别担心，这不是你的错',
      en: "Don't worry, it's not your fault",
    }),
    message: t({
      'zh-CN': '页面遇到了一些技术问题，我们正在努力修复。请尝试刷新页面或返回首页。',
      en: 'The page encountered a technical issue. We are working to fix it. Please try refreshing or go back to the homepage.',
    }),
    refreshButton: t({
      'zh-CN': '刷新页面',
      en: 'Refresh Page',
    }),
    homeButton: t({
      'zh-CN': '返回首页',
      en: 'Back to Home',
    }),
    errorCode: t({
      'zh-CN': '错误代码',
      en: 'Error Code',
    }),
  },
} satisfies Dictionary;

export default errorBoundaryContent;
