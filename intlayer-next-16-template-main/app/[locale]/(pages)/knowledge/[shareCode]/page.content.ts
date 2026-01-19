import { t, type DeclarationContent } from 'intlayer';

const knowledgeDetailContent = {
  key: 'knowledge-detail-page',
  content: {
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notFound: t({
      'zh-CN': '知识不存在',
      en: 'Knowledge Not Found',
    }),
    notFoundDescription: t({
      'zh-CN': '该知识可能已被删除或不存在',
      en: 'This knowledge may have been deleted or does not exist',
    }),
    views: t({
      'zh-CN': '次浏览',
      en: 'views',
    }),
    share: t({
      'zh-CN': '分享',
      en: 'Share',
    }),
    edit: t({
      'zh-CN': '编辑',
      en: 'Edit',
    }),
    delete: t({
      'zh-CN': '删除',
      en: 'Delete',
    }),
    deleteConfirmTitle: t({
      'zh-CN': '确认删除？',
      en: 'Delete Knowledge?',
    }),
    deleteConfirmMessage: t({
      'zh-CN': '此操作无法撤销，确定要删除这篇知识吗？',
      en: 'This action cannot be undone. Are you sure you want to delete this knowledge?',
    }),
    cancel: t({
      'zh-CN': '取消',
      en: 'Cancel',
    }),
    confirmDelete: t({
      'zh-CN': '确认删除',
      en: 'Confirm Delete',
    }),
    deleting: t({
      'zh-CN': '删除中...',
      en: 'Deleting...',
    }),
    deleteError: t({
      'zh-CN': '删除失败，请重试',
      en: 'Failed to delete, please try again',
    }),
    shareCopied: t({
      'zh-CN': '链接已复制到剪贴板！',
      en: 'Link copied to clipboard!',
    }),
  },
} satisfies DeclarationContent;

export default knowledgeDetailContent;
