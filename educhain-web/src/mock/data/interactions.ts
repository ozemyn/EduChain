/**
 * 用户互动 Mock 数据
 * 包含点赞、收藏、浏览等互动数据
 */

export interface UserInteraction {
  id: number;
  knowledgeId: number;
  userId: number;
  interactionType: 'LIKE' | 'FAVORITE' | 'VIEW';
  ipAddress?: string;
  createdAt: string;
}

export interface InteractionStats {
  knowledgeId: number;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  commentCount: number;
  shareCount: number;
}

// 生成互动数据
export const mockInteractions: UserInteraction[] = [];
let interactionId = 1;

// 为每个知识条目生成随机互动数据
for (let knowledgeId = 1; knowledgeId <= 50; knowledgeId++) {
  // 生成点赞数据
  const likeCount = Math.floor(Math.random() * 50) + 20;
  for (let i = 0; i < likeCount; i++) {
    mockInteractions.push({
      id: interactionId++,
      knowledgeId,
      userId: Math.floor(Math.random() * 30) + 1,
      interactionType: 'LIKE',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  // 生成收藏数据
  const favoriteCount = Math.floor(Math.random() * 30) + 10;
  for (let i = 0; i < favoriteCount; i++) {
    mockInteractions.push({
      id: interactionId++,
      knowledgeId,
      userId: Math.floor(Math.random() * 30) + 1,
      interactionType: 'FAVORITE',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  // 生成浏览数据
  const viewCount = Math.floor(Math.random() * 200) + 100;
  for (let i = 0; i < viewCount; i++) {
    mockInteractions.push({
      id: interactionId++,
      knowledgeId,
      userId: Math.floor(Math.random() * 30) + 1,
      interactionType: 'VIEW',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }
}

// 生成互动统计数据
export const mockInteractionStats: Record<number, InteractionStats> = {};

for (let knowledgeId = 1; knowledgeId <= 50; knowledgeId++) {
  const likes = mockInteractions.filter(
    i => i.knowledgeId === knowledgeId && i.interactionType === 'LIKE'
  );
  const favorites = mockInteractions.filter(
    i => i.knowledgeId === knowledgeId && i.interactionType === 'FAVORITE'
  );
  const views = mockInteractions.filter(
    i => i.knowledgeId === knowledgeId && i.interactionType === 'VIEW'
  );

  mockInteractionStats[knowledgeId] = {
    knowledgeId,
    likeCount: likes.length,
    favoriteCount: favorites.length,
    viewCount: views.length,
    commentCount: Math.floor(Math.random() * 20) + 5,
    shareCount: Math.floor(Math.random() * 10) + 2,
  };
}

// 获取用户的互动记录
export const getUserInteractions = (
  userId: number,
  type?: 'LIKE' | 'FAVORITE' | 'VIEW'
) => {
  let interactions = mockInteractions.filter(i => i.userId === userId);
  if (type) {
    interactions = interactions.filter(i => i.interactionType === type);
  }
  return interactions;
};

// 检查用户是否对某个知识条目进行了特定互动
export const hasUserInteracted = (
  userId: number,
  knowledgeId: number,
  type: 'LIKE' | 'FAVORITE' | 'VIEW'
) => {
  return mockInteractions.some(
    i =>
      i.userId === userId &&
      i.knowledgeId === knowledgeId &&
      i.interactionType === type
  );
};
