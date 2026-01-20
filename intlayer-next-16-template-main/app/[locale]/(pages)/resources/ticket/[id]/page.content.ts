import { t, type Dictionary } from 'intlayer';

const ticketDetailContent = {
  key: 'ticket-detail-page',
  content: {
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notFound: {
      title: t({
        'zh-CN': '工单不存在',
        en: 'Ticket Not Found',
      }),
      description: t({
        'zh-CN': '抱歉，您访问的工单不存在或已被删除',
        en: 'Sorry, the ticket you are looking for does not exist or has been deleted',
      }),
    },
    fields: {
      createdAt: t({
        'zh-CN': '创建时间',
        en: 'Created',
      }),
      updatedAt: t({
        'zh-CN': '更新时间',
        en: 'Updated',
      }),
    },
    sections: {
      description: t({
        'zh-CN': '问题描述',
        en: 'Description',
      }),
      comments: t({
        'zh-CN': '回复记录',
        en: 'Comments',
      }),
    },
    statuses: {
      open: t({
        'zh-CN': '待处理',
        en: 'Open',
      }),
      inprogress: t({
        'zh-CN': '处理中',
        en: 'In Progress',
      }),
      resolved: t({
        'zh-CN': '已解决',
        en: 'Resolved',
      }),
      closed: t({
        'zh-CN': '已关闭',
        en: 'Closed',
      }),
    },
    types: {
      bug: t({
        'zh-CN': 'Bug',
        en: 'Bug',
      }),
      feature: t({
        'zh-CN': '功能',
        en: 'Feature',
      }),
      question: t({
        'zh-CN': '咨询',
        en: 'Question',
      }),
      other: t({
        'zh-CN': '其他',
        en: 'Other',
      }),
    },
    priorities: {
      low: t({
        'zh-CN': '低',
        en: 'Low',
      }),
      medium: t({
        'zh-CN': '中',
        en: 'Medium',
      }),
      high: t({
        'zh-CN': '高',
        en: 'High',
      }),
      urgent: t({
        'zh-CN': '紧急',
        en: 'Urgent',
      }),
    },
    badges: {
      staff: t({
        'zh-CN': '客服',
        en: 'Staff',
      }),
    },
    placeholders: {
      comment: t({
        'zh-CN': '添加回复...',
        en: 'Add a comment...',
      }),
    },
    actions: {
      back: t({
        'zh-CN': '返回',
        en: 'Back',
      }),
      backToList: t({
        'zh-CN': '返回列表',
        en: 'Back to List',
      }),
      submitComment: t({
        'zh-CN': '发送回复',
        en: 'Submit Comment',
      }),
      submitting: t({
        'zh-CN': '发送中...',
        en: 'Submitting...',
      }),
    },
  },
} satisfies Dictionary;

export default ticketDetailContent;
