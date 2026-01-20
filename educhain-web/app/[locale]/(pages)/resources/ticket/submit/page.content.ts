import { t, type Dictionary } from 'intlayer';

const ticketSubmitContent = {
  key: 'ticket-submit-page',
  content: {
    title: t({
      'zh-CN': '提交工单',
      en: 'Submit Ticket',
    }),
    description: t({
      'zh-CN': '遇到问题或有建议？告诉我们，我们会尽快回复您',
      en: 'Have a problem or suggestion? Let us know and we will get back to you soon',
    }),
    fields: {
      title: t({
        'zh-CN': '工单标题',
        en: 'Ticket Title',
      }),
      type: t({
        'zh-CN': '工单类型',
        en: 'Ticket Type',
      }),
      priority: t({
        'zh-CN': '优先级',
        en: 'Priority',
      }),
      description: t({
        'zh-CN': '问题描述',
        en: 'Description',
      }),
      email: t({
        'zh-CN': '联系邮箱',
        en: 'Contact Email',
      }),
    },
    placeholders: {
      title: t({
        'zh-CN': '请简要描述您的问题',
        en: 'Briefly describe your issue',
      }),
      description: t({
        'zh-CN': '请详细描述您遇到的问题，包括复现步骤、截图等信息...',
        en: 'Please describe your issue in detail, including steps to reproduce, screenshots, etc...',
      }),
      email: t({
        'zh-CN': '用于接收工单回复',
        en: 'For receiving ticket replies',
      }),
    },
    types: {
      bug: t({
        'zh-CN': 'Bug 报告',
        en: 'Bug Report',
      }),
      feature: t({
        'zh-CN': '功能建议',
        en: 'Feature Request',
      }),
      question: t({
        'zh-CN': '使用咨询',
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
    hints: {
      email: t({
        'zh-CN': '我们会通过此邮箱与您联系',
        en: 'We will contact you via this email',
      }),
    },
    errors: {
      titleRequired: t({
        'zh-CN': '请输入工单标题',
        en: 'Please enter ticket title',
      }),
      titleTooLong: t({
        'zh-CN': '标题不能超过100个字符',
        en: 'Title cannot exceed 100 characters',
      }),
      descriptionRequired: t({
        'zh-CN': '请输入问题描述',
        en: 'Please enter description',
      }),
      descriptionTooShort: t({
        'zh-CN': '描述至少需要10个字符',
        en: 'Description must be at least 10 characters',
      }),
      descriptionTooLong: t({
        'zh-CN': '描述不能超过2000个字符',
        en: 'Description cannot exceed 2000 characters',
      }),
      emailRequired: t({
        'zh-CN': '请输入联系邮箱',
        en: 'Please enter contact email',
      }),
      emailInvalid: t({
        'zh-CN': '请输入有效的邮箱地址',
        en: 'Please enter a valid email address',
      }),
      submitFailed: t({
        'zh-CN': '提交失败，请稍后重试',
        en: 'Submission failed, please try again later',
      }),
    },
    actions: {
      cancel: t({
        'zh-CN': '取消',
        en: 'Cancel',
      }),
      submit: t({
        'zh-CN': '提交工单',
        en: 'Submit Ticket',
      }),
      submitting: t({
        'zh-CN': '提交中...',
        en: 'Submitting...',
      }),
    },
    tips: {
      title: t({
        'zh-CN': '提交提示',
        en: 'Submission Tips',
      }),
      tip1: t({
        'zh-CN': '请尽可能详细地描述问题，这将帮助我们更快地解决',
        en: 'Please describe the issue in as much detail as possible to help us resolve it faster',
      }),
      tip2: t({
        'zh-CN': '如果是 Bug 报告，请提供复现步骤和截图',
        en: 'For bug reports, please provide steps to reproduce and screenshots',
      }),
      tip3: t({
        'zh-CN': '我们通常会在 24 小时内回复您的工单',
        en: 'We typically respond to tickets within 24 hours',
      }),
      tip4: t({
        'zh-CN': '您可以在"我的工单"页面查看工单处理进度',
        en: 'You can check ticket status on the "My Tickets" page',
      }),
    },
  },
} satisfies Dictionary;

export default ticketSubmitContent;
