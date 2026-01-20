import { t, type Dictionary } from 'intlayer';

const ticketListContent = {
  key: 'ticket-list-page',
  content: {
    title: t({
      'zh-CN': '我的工单',
      en: 'My Tickets',
    }),
    description: t({
      'zh-CN': '查看和管理您提交的所有工单',
      en: 'View and manage all your submitted tickets',
    }),
    createTicket: t({
      'zh-CN': '创建工单',
      en: 'Create Ticket',
    }),
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    filters: {
      status: t({
        'zh-CN': '状态筛选',
        en: 'Filter by Status',
      }),
      type: t({
        'zh-CN': '类型筛选',
        en: 'Filter by Type',
      }),
      all: t({
        'zh-CN': '全部',
        en: 'All',
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
    timeUnits: {
      today: t({
        'zh-CN': '今天',
        en: 'Today',
      }),
      yesterday: t({
        'zh-CN': '昨天',
        en: 'Yesterday',
      }),
      daysAgo: t({
        'zh-CN': '天前',
        en: 'days ago',
      }),
    },
    empty: {
      title: t({
        'zh-CN': '暂无工单',
        en: 'No Tickets',
      }),
      description: t({
        'zh-CN': '您还没有提交任何工单',
        en: 'You have not submitted any tickets yet',
      }),
    },
  },
} satisfies Dictionary;

export default ticketListContent;
