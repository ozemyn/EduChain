/**
 * 工单系统 Mock 数据
 * 包含工单数据和相关配置
 */

export interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  createTime: string;
  updateTime: string;
  description: string;
  steps?: string;
  email: string;
  phone?: string;
  expectedResponse: string;
  attachments?: string[];
  response?: string;
  userId: number;
  assignedTo?: number;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketCategory {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface TicketPriority {
  value: string;
  label: string;
  color: string;
  desc: string;
  responseTime: string;
}

export interface TicketStatus {
  value: string;
  label: string;
  color: string;
  icon: string;
  description: string;
}

// 工单分类配置
export const ticketCategories: TicketCategory[] = [
  {
    value: 'account',
    label: '账户管理',
    icon: '👤',
    description: '登录、注册、密码重置等账户相关问题',
  },
  {
    value: 'content',
    label: '内容发布',
    icon: '📝',
    description: '内容上传、编辑、删除等发布相关问题',
  },
  {
    value: 'blockchain',
    label: '区块链存证',
    icon: '🔗',
    description: '存证失败、验证问题等区块链相关问题',
  },
  {
    value: 'settings',
    label: '系统设置',
    icon: '⚙️',
    description: '个人设置、通知配置等系统设置问题',
  },
  {
    value: 'technical',
    label: '技术问题',
    icon: '🔧',
    description: '页面错误、功能异常等技术相关问题',
  },
  {
    value: 'billing',
    label: '计费问题',
    icon: '💰',
    description: '充值、扣费、发票等计费相关问题',
  },
  {
    value: 'other',
    label: '其他问题',
    icon: '❓',
    description: '其他未分类的问题',
  },
];

// 优先级配置
export const ticketPriorities: TicketPriority[] = [
  {
    value: 'low',
    label: '普通',
    color: 'default',
    desc: '一般问题，3个工作日内回复',
    responseTime: '3个工作日',
  },
  {
    value: 'medium',
    label: '紧急',
    color: 'orange',
    desc: '影响使用，1个工作日内回复',
    responseTime: '1个工作日',
  },
  {
    value: 'high',
    label: '非常紧急',
    color: 'red',
    desc: '严重问题，4小时内回复',
    responseTime: '4小时',
  },
];

// 状态配置
export const ticketStatuses: TicketStatus[] = [
  {
    value: 'pending',
    label: '待处理',
    color: 'default',
    icon: 'ClockCircleOutlined',
    description: '工单已提交，等待客服处理',
  },
  {
    value: 'processing',
    label: '处理中',
    color: 'processing',
    icon: 'ExclamationCircleOutlined',
    description: '客服正在处理您的问题',
  },
  {
    value: 'resolved',
    label: '已解决',
    color: 'success',
    icon: 'CheckCircleOutlined',
    description: '问题已解决，等待用户确认',
  },
  {
    value: 'closed',
    label: '已关闭',
    color: 'error',
    icon: 'CloseCircleOutlined',
    description: '工单已关闭，问题处理完成',
  },
];

// Mock 工单数据
export const mockTickets: Ticket[] = [
  {
    id: 'TK20241207001',
    title: '无法上传PDF文件',
    category: 'technical',
    priority: 'medium',
    status: 'processing',
    createTime: '2025-12-07 10:30:00',
    updateTime: '2025-12-07 14:20:00',
    description:
      '尝试上传PDF文件时显示格式不支持的错误，文件大小为5MB，格式确认无误。已尝试多次上传，均显示相同错误信息。',
    steps:
      '1. 点击"发布内容"按钮\n2. 选择PDF文件\n3. 点击上传\n4. 显示"格式不支持"错误',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    expectedResponse: 'urgent',
    attachments: ['error-screenshot.png'],
    response:
      '我们已经收到您的问题，正在技术团队处理中。初步判断可能是服务器配置问题，预计今日内修复。',
    userId: 2,
    assignedTo: 1,
  },
  {
    id: 'TK20241206002',
    title: '区块链存证失败',
    category: 'blockchain',
    priority: 'high',
    status: 'resolved',
    createTime: '2025-12-06 15:45:00',
    updateTime: '2025-12-07 09:15:00',
    description:
      '提交存证后一直显示处理中状态，已经超过24小时。文档是重要的学术论文，急需完成存证。',
    email: 'lisi@example.com',
    expectedResponse: 'immediate',
    response:
      '问题已解决，存证服务已恢复正常。您的文件已成功存证，存证编号：BC20241207001。',
    userId: 3,
    assignedTo: 1,
    resolvedAt: '2025-12-07 09:15:00',
  },
  {
    id: 'TK20241205003',
    title: '账户余额显示异常',
    category: 'billing',
    priority: 'low',
    status: 'pending',
    createTime: '2025-12-05 09:20:00',
    updateTime: '2025-12-05 09:20:00',
    description:
      '充值后余额没有更新，但是扣费记录正常。充值金额为100元，支付宝支付成功。',
    email: 'wangwu@example.com',
    phone: '13800138003',
    expectedResponse: 'normal',
    userId: 4,
  },
  {
    id: 'TK20241204004',
    title: '忘记密码无法重置',
    category: 'account',
    priority: 'medium',
    status: 'resolved',
    createTime: '2025-12-04 16:30:00',
    updateTime: '2025-12-05 08:45:00',
    description:
      '点击忘记密码后，邮箱没有收到重置邮件。已检查垃圾邮件箱，确认邮箱地址正确。',
    email: 'zhaoliu@example.com',
    expectedResponse: 'urgent',
    response:
      '邮件服务已修复，重置邮件已重新发送。请检查您的邮箱并按照邮件指引重置密码。',
    userId: 5,
    assignedTo: 1,
    resolvedAt: '2025-12-05 08:45:00',
  },
  {
    id: 'TK20241203005',
    title: '页面加载缓慢',
    category: 'technical',
    priority: 'low',
    status: 'processing',
    createTime: '2025-12-03 14:15:00',
    updateTime: '2025-12-04 10:30:00',
    description:
      '最近几天发现页面加载速度明显变慢，特别是知识列表页面，需要等待10秒以上才能完全加载。',
    email: 'sunqi@example.com',
    expectedResponse: 'normal',
    response:
      '我们已经注意到这个问题，正在优化服务器性能和数据库查询。预计本周内完成优化。',
    userId: 6,
    assignedTo: 1,
  },
  {
    id: 'TK20241202006',
    title: '个人资料无法保存',
    category: 'settings',
    priority: 'medium',
    status: 'closed',
    createTime: '2025-12-02 11:00:00',
    updateTime: '2025-12-03 16:20:00',
    description:
      '修改个人资料后点击保存，显示保存成功，但刷新页面后发现修改没有生效。',
    email: 'zhouba@example.com',
    expectedResponse: 'urgent',
    response: '问题已修复，个人资料保存功能已恢复正常。感谢您的反馈。',
    userId: 7,
    assignedTo: 1,
    resolvedAt: '2025-12-03 15:30:00',
    closedAt: '2025-12-03 16:20:00',
  },
  {
    id: 'TK20241201007',
    title: '搜索功能返回结果不准确',
    category: 'technical',
    priority: 'low',
    status: 'resolved',
    createTime: '2025-12-01 09:45:00',
    updateTime: '2025-12-02 14:10:00',
    description:
      '使用搜索功能时，输入关键词返回的结果与预期不符，很多相关内容没有显示在结果中。',
    email: 'wujiu@example.com',
    expectedResponse: 'normal',
    response: '搜索算法已优化，相关性排序已改进。现在搜索结果应该更加准确。',
    userId: 8,
    assignedTo: 1,
    resolvedAt: '2025-12-02 14:10:00',
  },
  {
    id: 'TK20241130008',
    title: '移动端界面显示异常',
    category: 'technical',
    priority: 'medium',
    status: 'processing',
    createTime: '2025-12-30 20:30:00',
    updateTime: '2026-01-01 09:00:00',
    description:
      '在手机浏览器中访问网站，部分按钮和文字显示不完整，影响正常使用。使用的是iPhone Safari浏览器。',
    email: 'zhengshi@example.com',
    expectedResponse: 'urgent',
    response: '我们正在修复移动端兼容性问题，预计明天发布修复版本。',
    userId: 9,
    assignedTo: 1,
  },
  {
    id: 'TK20241129009',
    title: '通知设置无效',
    category: 'settings',
    priority: 'low',
    status: 'pending',
    createTime: '2025-12-29 13:20:00',
    updateTime: '2025-12-29 13:20:00',
    description:
      '已关闭邮件通知，但仍然收到系统邮件。希望能够完全关闭不必要的通知。',
    email: 'chenyi@example.com',
    expectedResponse: 'normal',
    userId: 10,
  },
  {
    id: 'TK20241128010',
    title: '内容审核时间过长',
    category: 'content',
    priority: 'medium',
    status: 'resolved',
    createTime: '2025-12-28 16:45:00',
    updateTime: '2025-12-30 10:15:00',
    description:
      '提交的内容已经等待审核3天了，希望能够加快审核速度。内容是原创技术文章。',
    email: 'huanger@example.com',
    expectedResponse: 'urgent',
    response:
      '您的内容已通过审核并发布。我们已优化审核流程，后续审核时间将缩短至24小时内。',
    userId: 11,
    assignedTo: 1,
    resolvedAt: '2025-12-30 10:15:00',
  },
  {
    id: 'TK20241127011',
    title: '发票申请功能找不到',
    category: 'billing',
    priority: 'low',
    status: 'resolved',
    createTime: '2025-12-27 14:30:00',
    updateTime: '2025-12-28 09:20:00',
    description: '需要申请充值发票，但在系统中找不到相关功能入口。',
    email: 'linsan@example.com',
    expectedResponse: 'normal',
    response:
      '发票申请功能位于"个人中心"->"账单管理"->"发票申请"。我们已在帮助文档中添加相关说明。',
    userId: 12,
    assignedTo: 1,
    resolvedAt: '2025-12-28 09:20:00',
  },
  {
    id: 'TK20241126012',
    title: '关注功能异常',
    category: 'technical',
    priority: 'medium',
    status: 'closed',
    createTime: '2025-12-26 11:15:00',
    updateTime: '2025-12-27 15:40:00',
    description:
      '点击关注其他用户后，关注列表中没有显示，但对方的粉丝数量增加了。',
    email: 'xusi@example.com',
    expectedResponse: 'urgent',
    response: '关注功能的显示问题已修复，您的关注列表已同步更新。',
    userId: 13,
    assignedTo: 1,
    resolvedAt: '2025-12-27 14:30:00',
    closedAt: '2025-12-27 15:40:00',
  },
];

// 工单统计数据
export const ticketStats = {
  total: mockTickets.length,
  pending: mockTickets.filter(t => t.status === 'pending').length,
  processing: mockTickets.filter(t => t.status === 'processing').length,
  resolved: mockTickets.filter(t => t.status === 'resolved').length,
  closed: mockTickets.filter(t => t.status === 'closed').length,
  avgResponseTime: '4.2小时',
  satisfactionRate: '96.8%',
};

// 根据用户ID获取工单
export const getTicketsByUserId = (userId: number): Ticket[] => {
  return mockTickets.filter(ticket => ticket.userId === userId);
};

// 根据状态获取工单
export const getTicketsByStatus = (status: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.status === status);
};

// 根据分类获取工单
export const getTicketsByCategory = (category: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.category === category);
};

// 根据优先级获取工单
export const getTicketsByPriority = (priority: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.priority === priority);
};

// 搜索工单
export const searchTickets = (query: string): Ticket[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockTickets.filter(
    ticket =>
      ticket.id.toLowerCase().includes(lowercaseQuery) ||
      ticket.title.toLowerCase().includes(lowercaseQuery) ||
      ticket.description.toLowerCase().includes(lowercaseQuery)
  );
};

// 生成新工单ID
export const generateTicketId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.getTime().toString().slice(-3);
  return `TK${dateStr}${timeStr}`;
};

// 创建新工单
export const createTicket = (
  ticketData: Omit<Ticket, 'id' | 'createTime' | 'updateTime' | 'status'>
): Ticket => {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const newTicket: Ticket = {
    ...ticketData,
    id: generateTicketId(),
    status: 'pending',
    createTime: now,
    updateTime: now,
  };

  mockTickets.unshift(newTicket);
  return newTicket;
};

// 更新工单状态
export const updateTicketStatus = (
  ticketId: string,
  status: string,
  response?: string
): boolean => {
  const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) return false;

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  mockTickets[ticketIndex].status = status;
  mockTickets[ticketIndex].updateTime = now;

  if (response) {
    mockTickets[ticketIndex].response = response;
  }

  if (status === 'resolved') {
    mockTickets[ticketIndex].resolvedAt = now;
  }

  if (status === 'closed') {
    mockTickets[ticketIndex].closedAt = now;
  }

  return true;
};
