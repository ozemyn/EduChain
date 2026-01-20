import { t, type Dictionary } from 'intlayer';

const commentListContent = {
  key: 'comment-list',
  content: {
    title: t({
      'zh-CN': '评论',
      en: 'Comments',
    }),
    sortLatest: t({
      'zh-CN': '最新',
      en: 'Latest',
    }),
    sortHottest: t({
      'zh-CN': '最热',
      en: 'Hottest',
    }),
    placeholder: t({
      'zh-CN': '写下你的评论...',
      en: 'Write your comment...',
    }),
    submit: t({
      'zh-CN': '发表评论',
      en: 'Post Comment',
    }),
    submitting: t({
      'zh-CN': '发表中...',
      en: 'Posting...',
    }),
    loginPrompt: t({
      'zh-CN': '登录后即可发表评论',
      en: 'Login to post comments',
    }),
    loading: t({
      'zh-CN': '加载评论中...',
      en: 'Loading comments...',
    }),
    emptyTitle: t({
      'zh-CN': '暂无评论',
      en: 'No comments yet',
    }),
    emptyDescription: t({
      'zh-CN': '成为第一个发表评论的人吧',
      en: 'Be the first to comment',
    }),
    submitError: t({
      'zh-CN': '发表失败，请重试',
      en: 'Failed to post, please try again',
    }),
    replyError: t({
      'zh-CN': '回复失败，请重试',
      en: 'Failed to reply, please try again',
    }),
    deleteError: t({
      'zh-CN': '删除失败，请重试',
      en: 'Failed to delete, please try again',
    }),
  },
} satisfies Dictionary;

export default commentListContent;
