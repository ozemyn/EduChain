/**
 * 关注相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import { mockFollows, getFollowing, getFollowers, isFollowing } from '../data/follows';
import { mockUsers } from '../data/users';

export const followHandlers = [
  // 关注用户
  http.post(`${API_BASE}/users/follow`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as { userId: number };
    const { userId } = body;
    const newFollow = {
      id: mockFollows.length + 1,
      followerId: 2,
      followingId: userId,
      createdAt: new Date().toISOString(),
    };
    mockFollows.push(newFollow);
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 取消关注
  http.delete(`${API_BASE}/users/follow`, async ({ request }) => {
    await delay();
    const body = (await request.json()) as { userId: number };
    const { userId } = body;
    const index = mockFollows.findIndex(
      f => f.followerId === 2 && f.followingId === userId
    );
    if (index !== -1) {
      mockFollows.splice(index, 1);
    }
    return HttpResponse.json(createSuccessResponse({ success: true }));
  }),

  // 获取关注列表
  http.get(`${API_BASE}/users/following`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get('userId')) || 2;
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const following = getFollowing(userId).map(f => ({
      ...f,
      following: mockUsers.find(u => u.id === f.followingId),
    }));

    const pageData = createPageResponse(following, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取粉丝列表
  http.get(`${API_BASE}/users/followers`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get('userId')) || 2;
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const followers = getFollowers(userId).map(f => ({
      ...f,
      follower: mockUsers.find(u => u.id === f.followerId),
    }));

    const pageData = createPageResponse(followers, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 检查是否关注
  http.get(`${API_BASE}/users/follow/status/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const following = isFollowing(2, Number(id));
    return HttpResponse.json(createSuccessResponse(following));
  }),

  // 获取关注统计
  http.get(`${API_BASE}/users/follow/stats/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const userId = Number(id);
    const followerCount = getFollowers(userId).length;
    const followingCount = getFollowing(userId).length;
    return HttpResponse.json(createSuccessResponse({ followerCount, followingCount }));
  }),

  // 获取互相关注的用户
  http.get(`${API_BASE}/users/follow/mutual`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const following = getFollowing(2).map(f => f.followingId);
    const followers = getFollowers(2).map(f => f.followerId);
    const mutualIds = following.filter(id => followers.includes(id));
    const mutualUsers = mockUsers.filter(u => mutualIds.includes(u.id));

    const pageData = createPageResponse(mutualUsers, page, size);
    return HttpResponse.json(createSuccessResponse(pageData));
  }),

  // 获取推荐关注用户
  http.get(`${API_BASE}/users/follow/recommendations`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const following = getFollowing(2).map(f => f.followingId);
    const recommendedUsers = mockUsers
      .filter(u => u.id !== 2 && !following.includes(u.id))
      .slice(0, limit);

    return HttpResponse.json(createSuccessResponse(recommendedUsers));
  }),
];
