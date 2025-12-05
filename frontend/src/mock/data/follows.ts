/**
 * 用户关注 Mock 数据
 * 包含关注关系数据
 */

export interface UserFollow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

// 生成关注数据
export const mockFollows: UserFollow[] = [
  { id: 1, followerId: 2, followingId: 3, createdAt: '2024-11-01T10:00:00Z' },
  { id: 2, followerId: 2, followingId: 4, createdAt: '2024-11-02T11:00:00Z' },
  { id: 3, followerId: 2, followingId: 5, createdAt: '2024-11-03T12:00:00Z' },
  { id: 4, followerId: 2, followingId: 15, createdAt: '2024-11-04T13:00:00Z' },
  { id: 5, followerId: 3, followingId: 2, createdAt: '2024-11-05T14:00:00Z' },
  { id: 6, followerId: 3, followingId: 5, createdAt: '2024-11-06T15:00:00Z' },
  { id: 7, followerId: 3, followingId: 8, createdAt: '2024-11-07T16:00:00Z' },
  { id: 8, followerId: 4, followingId: 2, createdAt: '2024-11-08T08:00:00Z' },
  { id: 9, followerId: 4, followingId: 3, createdAt: '2024-11-09T09:00:00Z' },
  { id: 10, followerId: 4, followingId: 6, createdAt: '2024-11-10T10:00:00Z' },
  { id: 11, followerId: 5, followingId: 2, createdAt: '2024-11-11T11:00:00Z' },
  { id: 12, followerId: 5, followingId: 10, createdAt: '2024-11-12T12:00:00Z' },
  { id: 13, followerId: 6, followingId: 2, createdAt: '2024-11-13T13:00:00Z' },
  { id: 14, followerId: 6, followingId: 4, createdAt: '2024-11-14T14:00:00Z' },
  { id: 15, followerId: 6, followingId: 7, createdAt: '2024-11-15T15:00:00Z' },
  { id: 16, followerId: 7, followingId: 3, createdAt: '2024-11-16T16:00:00Z' },
  { id: 17, followerId: 7, followingId: 15, createdAt: '2024-11-17T08:00:00Z' },
  { id: 18, followerId: 8, followingId: 2, createdAt: '2024-11-18T09:00:00Z' },
  { id: 19, followerId: 8, followingId: 5, createdAt: '2024-11-19T10:00:00Z' },
  { id: 20, followerId: 9, followingId: 4, createdAt: '2024-11-20T11:00:00Z' },
  { id: 21, followerId: 9, followingId: 27, createdAt: '2024-11-21T12:00:00Z' },
  { id: 22, followerId: 10, followingId: 2, createdAt: '2024-11-22T13:00:00Z' },
  { id: 23, followerId: 10, followingId: 5, createdAt: '2024-11-23T14:00:00Z' },
  {
    id: 24,
    followerId: 10,
    followingId: 25,
    createdAt: '2024-11-24T15:00:00Z',
  },
  {
    id: 25,
    followerId: 11,
    followingId: 13,
    createdAt: '2024-11-25T16:00:00Z',
  },
  { id: 26, followerId: 12, followingId: 2, createdAt: '2024-11-26T08:00:00Z' },
  { id: 27, followerId: 12, followingId: 4, createdAt: '2024-11-27T09:00:00Z' },
  { id: 28, followerId: 13, followingId: 8, createdAt: '2024-11-28T10:00:00Z' },
  { id: 29, followerId: 14, followingId: 5, createdAt: '2024-11-29T11:00:00Z' },
  { id: 30, followerId: 15, followingId: 3, createdAt: '2024-11-30T12:00:00Z' },
  { id: 31, followerId: 15, followingId: 7, createdAt: '2024-12-01T13:00:00Z' },
  {
    id: 32,
    followerId: 15,
    followingId: 30,
    createdAt: '2024-12-02T14:00:00Z',
  },
  { id: 33, followerId: 16, followingId: 9, createdAt: '2024-12-03T15:00:00Z' },
  { id: 34, followerId: 17, followingId: 3, createdAt: '2024-12-04T16:00:00Z' },
  { id: 35, followerId: 18, followingId: 5, createdAt: '2024-12-05T08:00:00Z' },
  { id: 36, followerId: 19, followingId: 2, createdAt: '2024-12-05T09:00:00Z' },
  { id: 37, followerId: 20, followingId: 4, createdAt: '2024-12-05T10:00:00Z' },
  { id: 38, followerId: 21, followingId: 5, createdAt: '2024-12-05T11:00:00Z' },
  {
    id: 39,
    followerId: 22,
    followingId: 10,
    createdAt: '2024-12-05T12:00:00Z',
  },
  { id: 40, followerId: 23, followingId: 3, createdAt: '2024-12-05T13:00:00Z' },
  { id: 41, followerId: 24, followingId: 2, createdAt: '2024-12-05T14:00:00Z' },
  {
    id: 42,
    followerId: 25,
    followingId: 10,
    createdAt: '2024-12-05T15:00:00Z',
  },
  { id: 43, followerId: 26, followingId: 9, createdAt: '2024-12-05T16:00:00Z' },
  { id: 44, followerId: 27, followingId: 4, createdAt: '2024-12-05T17:00:00Z' },
  {
    id: 45,
    followerId: 28,
    followingId: 16,
    createdAt: '2024-12-05T18:00:00Z',
  },
  {
    id: 46,
    followerId: 29,
    followingId: 15,
    createdAt: '2024-12-05T19:00:00Z',
  },
  {
    id: 47,
    followerId: 30,
    followingId: 15,
    createdAt: '2024-12-05T20:00:00Z',
  },
];

// 获取用户的关注列表
export const getFollowing = (userId: number) => {
  return mockFollows.filter(f => f.followerId === userId);
};

// 获取用户的粉丝列表
export const getFollowers = (userId: number) => {
  return mockFollows.filter(f => f.followingId === userId);
};

// 检查是否关注
export const isFollowing = (followerId: number, followingId: number) => {
  return mockFollows.some(
    f => f.followerId === followerId && f.followingId === followingId
  );
};

// 获取关注统计
export const getFollowStats = (userId: number) => {
  const followingCount = getFollowing(userId).length;
  const followerCount = getFollowers(userId).length;
  return { followingCount, followerCount };
};

// 获取互相关注的用户
export const getMutualFollows = (userId: number) => {
  const following = getFollowing(userId).map(f => f.followingId);
  const followers = getFollowers(userId).map(f => f.followerId);
  return following.filter(id => followers.includes(id));
};
