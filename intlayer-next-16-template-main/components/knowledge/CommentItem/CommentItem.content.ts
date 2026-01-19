import { t, type Dictionary } from 'intlayer';

const commentItemContent = {
  key: 'comment-item',
  content: {
    justNow: t({
      'zh-CN': '刚刚',
      en: 'Just now',
    }),
    minutesAgo: t({
      'zh-CN': '{n} 分钟前',
      en: '{n} minutes ago',
    }),
    hoursAgo: t({
      'zh-CN': '{n} 小时前',
      en: '{n} hours ago',
    }),
    daysAgo: t({
      'zh-CN': '{n} 天前',
      en: '{n} days ago',
    }),
    like: t({
      'zh-CN': '赞',
      en: 'Like',
    }),
    reply: t({
      'zh-CN': '回复',
      en: 'Reply',
    }),
    delete: t({
      'zh-CN': '删除',
      en: 'Delete',
    }),
    deleteConfirm: t({
      'zh-CN': '确定要删除这条评论吗？',
      en: 'Are you sure you want to delete this comment?',
    }),
    replyPlaceholder: t({
      'zh-CN': '写下你的回复...',
      en: 'Write your reply...',
    }),
    cancel: t({
      'zh-CN': '取消',
      en: 'Cancel',
    }),
    submit: t({
      'zh-CN': '发送',
      en: 'Send',
    }),
    submitting: t({
      'zh-CN': '发送中...',
      en: 'Sending...',
    }),
    loginRequired: t({
      'zh-CN': '请先登录',
      en: 'Please login first',
    }),
  },
} satisfies Dictionary;

export default commentItemContent;
