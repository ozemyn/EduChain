/**
 * 社区Mock数据
 */

import type {
  Discussion,
  ActiveUser,
  HotTopic,
  CommunityStats,
  CommunityFeed,
} from '../../services/community';

/**
 * 热门讨论数据
 */
export const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: 'React 18 新特性深度解析',
    author: '张三',
    authorAvatar: '',
    authorId: 1,
    replies: 45,
    views: 1234,
    likes: 89,
    time: '2小时前',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['React', '前端开发'],
    isHot: true,
  },
  {
    id: 2,
    title: 'TypeScript 类型体操实战技巧',
    author: '李四',
    authorAvatar: '',
    authorId: 2,
    replies: 32,
    views: 987,
    likes: 67,
    time: '5小时前',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tags: ['TypeScript', '前端开发'],
    isHot: true,
  },
  {
    id: 3,
    title: '如何优雅地处理异步错误？',
    author: '王五',
    authorAvatar: '',
    authorId: 3,
    replies: 28,
    views: 756,
    likes: 54,
    time: '8小时前',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tags: ['JavaScript', '最佳实践'],
    isHot: false,
  },
  {
    id: 4,
    title: 'Spring Boot 微服务架构设计',
    author: '赵六',
    authorAvatar: '',
    authorId: 4,
    replies: 23,
    views: 645,
    likes: 43,
    time: '1天前',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Spring Boot', '后端开发'],
    isHot: false,
  },
  {
    id: 5,
    title: 'Vue 3 Composition API 最佳实践',
    author: '钱七',
    authorAvatar: '',
    authorId: 5,
    replies: 38,
    views: 892,
    likes: 71,
    time: '3小时前',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    tags: ['Vue', '前端开发'],
    isHot: true,
  },
];

/**
 * 活跃用户数据
 */
export const mockActiveUsers: ActiveUser[] = [
  {
    id: 1,
    name: '张三',
    avatar: '',
    posts: 156,
    likes: 2341,
    level: 'LV.8',
    rank: 1,
  },
  {
    id: 2,
    name: '李四',
    avatar: '',
    posts: 134,
    likes: 1987,
    level: 'LV.7',
    rank: 2,
  },
  {
    id: 3,
    name: '王五',
    avatar: '',
    posts: 98,
    likes: 1654,
    level: 'LV.6',
    rank: 3,
  },
  {
    id: 4,
    name: '赵六',
    avatar: '',
    posts: 87,
    likes: 1432,
    level: 'LV.6',
    rank: 4,
  },
];

/**
 * 热门话题数据
 */
export const mockHotTopics: HotTopic[] = [
  { name: '前端开发', count: 1234, color: 'blue' },
  { name: 'React', count: 892, color: 'cyan' },
  { name: '后端开发', count: 756, color: 'green' },
  { name: 'TypeScript', count: 645, color: 'purple' },
  { name: '算法学习', count: 534, color: 'orange' },
  { name: '设计模式', count: 423, color: 'red' },
  { name: '机器学习', count: 389, color: 'magenta' },
  { name: 'Vue', count: 312, color: 'lime' },
];

/**
 * 社区统计数据
 */
export const mockCommunityStats: CommunityStats = {
  activeUsers: 12345,
  totalDiscussions: 8976,
  todayPosts: 234,
  todayComments: 567,
};

/**
 * 社区动态聚合数据
 */
export const mockCommunityFeed: CommunityFeed = {
  hotDiscussions: mockDiscussions,
  activeUsers: mockActiveUsers,
  hotTopics: mockHotTopics,
  stats: mockCommunityStats,
};
