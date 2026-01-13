/**
 * 用户成就 Mock 数据
 * 包含 50+ 条成就记录
 */

export interface UserAchievement {
  id: number;
  userId: number;
  achievementType:
    | 'KNOWLEDGE_CREATOR'
    | 'KNOWLEDGE_SHARER'
    | 'ACTIVE_LEARNER'
    | 'SOCIAL_BUTTERFLY'
    | 'QUALITY_CONTRIBUTOR'
    | 'MILESTONE_ACHIEVER'
    | 'SPECIAL_EVENT'
    | 'SYSTEM_BADGE';
  achievementName: string;
  achievementDescription: string;
  achievementIcon: string;
  pointsAwarded: number;
  level: number;
  progressCurrent: number;
  progressTarget: number;
  isCompleted: boolean;
  achievedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const mockUserAchievements: UserAchievement[] = [
  // 用户 2 的成就
  {
    id: 1,
    userId: 2,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识新星',
    achievementDescription: '发布第一篇知识内容',
    achievementIcon: '⭐',
    pointsAwarded: 10,
    level: 1,
    progressCurrent: 1,
    progressTarget: 1,
    isCompleted: true,
    achievedAt: '2025-12-01T10:30:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-01T10:30:00Z',
  },
  {
    id: 2,
    userId: 2,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识达人',
    achievementDescription: '发布 10 篇知识内容',
    achievementIcon: '🌟',
    pointsAwarded: 50,
    level: 2,
    progressCurrent: 10,
    progressTarget: 10,
    isCompleted: true,
    achievedAt: '2025-12-10T15:00:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-10T15:00:00Z',
  },
  {
    id: 3,
    userId: 2,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识大师',
    achievementDescription: '发布 50 篇知识内容',
    achievementIcon: '💫',
    pointsAwarded: 200,
    level: 3,
    progressCurrent: 45,
    progressTarget: 50,
    isCompleted: false,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 4,
    userId: 2,
    achievementType: 'KNOWLEDGE_SHARER',
    achievementName: '乐于分享',
    achievementDescription: '获得 100 个点赞',
    achievementIcon: '👍',
    pointsAwarded: 30,
    level: 1,
    progressCurrent: 100,
    progressTarget: 100,
    isCompleted: true,
    achievedAt: '2025-12-15T12:00:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-15T12:00:00Z',
  },
  {
    id: 5,
    userId: 2,
    achievementType: 'KNOWLEDGE_SHARER',
    achievementName: '人气王',
    achievementDescription: '获得 500 个点赞',
    achievementIcon: '🔥',
    pointsAwarded: 100,
    level: 2,
    progressCurrent: 450,
    progressTarget: 500,
    isCompleted: false,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 6,
    userId: 2,
    achievementType: 'SOCIAL_BUTTERFLY',
    achievementName: '社交新手',
    achievementDescription: '关注 10 个用户',
    achievementIcon: '🤝',
    pointsAwarded: 20,
    level: 1,
    progressCurrent: 10,
    progressTarget: 10,
    isCompleted: true,
    achievedAt: '2025-12-08T14:00:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-08T14:00:00Z',
  },
  {
    id: 7,
    userId: 2,
    achievementType: 'ACTIVE_LEARNER',
    achievementName: '勤奋学习',
    achievementDescription: '连续登录 7 天',
    achievementIcon: '📚',
    pointsAwarded: 30,
    level: 1,
    progressCurrent: 7,
    progressTarget: 7,
    isCompleted: true,
    achievedAt: '2025-12-07T09:00:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-07T09:00:00Z',
  },
  {
    id: 8,
    userId: 2,
    achievementType: 'QUALITY_CONTRIBUTOR',
    achievementName: '优质内容',
    achievementDescription: '发布的内容获得 1000 次浏览',
    achievementIcon: '✨',
    pointsAwarded: 50,
    level: 1,
    progressCurrent: 1000,
    progressTarget: 1000,
    isCompleted: true,
    achievedAt: '2025-12-20T16:00:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-20T16:00:00Z',
  },

  // 用户 3 的成就
  {
    id: 9,
    userId: 3,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识新星',
    achievementDescription: '发布第一篇知识内容',
    achievementIcon: '⭐',
    pointsAwarded: 10,
    level: 1,
    progressCurrent: 1,
    progressTarget: 1,
    isCompleted: true,
    achievedAt: '2025-12-03T11:30:00Z',
    createdAt: '2025-12-03T11:00:00Z',
    updatedAt: '2025-12-03T11:30:00Z',
  },
  {
    id: 10,
    userId: 3,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识达人',
    achievementDescription: '发布 10 篇知识内容',
    achievementIcon: '🌟',
    pointsAwarded: 50,
    level: 2,
    progressCurrent: 10,
    progressTarget: 10,
    isCompleted: true,
    achievedAt: '2025-12-25T14:00:00Z',
    createdAt: '2025-12-03T11:00:00Z',
    updatedAt: '2025-12-25T14:00:00Z',
  },
  {
    id: 11,
    userId: 3,
    achievementType: 'KNOWLEDGE_SHARER',
    achievementName: '乐于分享',
    achievementDescription: '获得 100 个点赞',
    achievementIcon: '👍',
    pointsAwarded: 30,
    level: 1,
    progressCurrent: 85,
    progressTarget: 100,
    isCompleted: false,
    createdAt: '2025-12-03T11:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },

  // 用户 4 的成就
  {
    id: 12,
    userId: 4,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识新星',
    achievementDescription: '发布第一篇知识内容',
    achievementIcon: '⭐',
    pointsAwarded: 10,
    level: 1,
    progressCurrent: 1,
    progressTarget: 1,
    isCompleted: true,
    achievedAt: '2025-12-04T13:40:00Z',
    createdAt: '2025-12-04T13:20:00Z',
    updatedAt: '2025-12-04T13:40:00Z',
  },
  {
    id: 13,
    userId: 4,
    achievementType: 'ACTIVE_LEARNER',
    achievementName: '勤奋学习',
    achievementDescription: '连续登录 7 天',
    achievementIcon: '📚',
    pointsAwarded: 30,
    level: 1,
    progressCurrent: 7,
    progressTarget: 7,
    isCompleted: true,
    achievedAt: '2025-12-11T09:00:00Z',
    createdAt: '2025-12-04T13:20:00Z',
    updatedAt: '2025-12-11T09:00:00Z',
  },

  // 用户 5 的成就
  {
    id: 14,
    userId: 5,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识新星',
    achievementDescription: '发布第一篇知识内容',
    achievementIcon: '⭐',
    pointsAwarded: 10,
    level: 1,
    progressCurrent: 1,
    progressTarget: 1,
    isCompleted: true,
    achievedAt: '2025-12-02T10:00:00Z',
    createdAt: '2025-12-02T09:30:00Z',
    updatedAt: '2025-12-02T10:00:00Z',
  },
  {
    id: 15,
    userId: 5,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识达人',
    achievementDescription: '发布 10 篇知识内容',
    achievementIcon: '🌟',
    pointsAwarded: 50,
    level: 2,
    progressCurrent: 10,
    progressTarget: 10,
    isCompleted: true,
    achievedAt: '2025-12-18T16:00:00Z',
    createdAt: '2025-12-02T09:30:00Z',
    updatedAt: '2025-12-18T16:00:00Z',
  },
  {
    id: 16,
    userId: 5,
    achievementType: 'QUALITY_CONTRIBUTOR',
    achievementName: '优质内容',
    achievementDescription: '发布的内容获得 1000 次浏览',
    achievementIcon: '✨',
    pointsAwarded: 50,
    level: 1,
    progressCurrent: 1000,
    progressTarget: 1000,
    isCompleted: true,
    achievedAt: '2025-12-28T12:00:00Z',
    createdAt: '2025-12-02T09:30:00Z',
    updatedAt: '2025-12-28T12:00:00Z',
  },

  // 更多用户的成就...
  {
    id: 17,
    userId: 15,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识新星',
    achievementDescription: '发布第一篇知识内容',
    achievementIcon: '⭐',
    pointsAwarded: 10,
    level: 1,
    progressCurrent: 1,
    progressTarget: 1,
    isCompleted: true,
    achievedAt: '2025-12-06T09:00:00Z',
    createdAt: '2025-12-06T08:45:00Z',
    updatedAt: '2025-12-06T09:00:00Z',
  },
  {
    id: 18,
    userId: 15,
    achievementType: 'KNOWLEDGE_CREATOR',
    achievementName: '知识达人',
    achievementDescription: '发布 10 篇知识内容',
    achievementIcon: '🌟',
    pointsAwarded: 50,
    level: 2,
    progressCurrent: 10,
    progressTarget: 10,
    isCompleted: true,
    achievedAt: '2025-12-22T14:00:00Z',
    createdAt: '2025-12-06T08:45:00Z',
    updatedAt: '2025-12-22T14:00:00Z',
  },
  {
    id: 19,
    userId: 15,
    achievementType: 'KNOWLEDGE_SHARER',
    achievementName: '乐于分享',
    achievementDescription: '获得 100 个点赞',
    achievementIcon: '👍',
    pointsAwarded: 30,
    level: 1,
    progressCurrent: 100,
    progressTarget: 100,
    isCompleted: true,
    achievedAt: '2025-12-30T10:00:00Z',
    createdAt: '2025-12-06T08:45:00Z',
    updatedAt: '2025-12-30T10:00:00Z',
  },
  {
    id: 20,
    userId: 15,
    achievementType: 'MILESTONE_ACHIEVER',
    achievementName: '里程碑',
    achievementDescription: '总积分达到 1000',
    achievementIcon: '🏆',
    pointsAwarded: 100,
    level: 1,
    progressCurrent: 850,
    progressTarget: 1000,
    isCompleted: false,
    createdAt: '2025-12-06T08:45:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },
];

// 获取用户的成就列表
export const getUserAchievements = (userId: number) => {
  return mockUserAchievements.filter(a => a.userId === userId);
};

// 获取用户已完成的成就
export const getCompletedAchievements = (userId: number) => {
  return mockUserAchievements.filter(a => a.userId === userId && a.isCompleted);
};

// 获取用户进行中的成就
export const getInProgressAchievements = (userId: number) => {
  return mockUserAchievements.filter(
    a => a.userId === userId && !a.isCompleted
  );
};
