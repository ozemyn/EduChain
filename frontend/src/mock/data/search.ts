/**
 * 搜索相关 Mock 数据
 * 包含搜索历史、热门关键词等
 */

export interface SearchHistory {
  id: number;
  userId?: number;
  keyword: string;
  resultCount: number;
  categoryId?: number;
  searchTime: string;
}

export interface HotKeyword {
  id: number;
  keyword: string;
  searchCount: number;
  trend: 'up' | 'down' | 'stable';
  trendScore: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
}

// 热门关键词数据
export const mockHotKeywords: HotKeyword[] = [
  {
    id: 1,
    keyword: 'React',
    searchCount: 1256,
    trend: 'up',
    trendScore: 8.5,
    dailyCount: 45,
    weeklyCount: 289,
    monthlyCount: 1256,
  },
  {
    id: 2,
    keyword: 'Vue',
    searchCount: 1134,
    trend: 'up',
    trendScore: 7.8,
    dailyCount: 38,
    weeklyCount: 256,
    monthlyCount: 1134,
  },
  {
    id: 3,
    keyword: 'Spring Boot',
    searchCount: 1089,
    trend: 'stable',
    trendScore: 6.5,
    dailyCount: 35,
    weeklyCount: 245,
    monthlyCount: 1089,
  },
  {
    id: 4,
    keyword: 'Docker',
    searchCount: 987,
    trend: 'up',
    trendScore: 9.2,
    dailyCount: 42,
    weeklyCount: 234,
    monthlyCount: 987,
  },
  {
    id: 5,
    keyword: 'Python',
    searchCount: 1345,
    trend: 'stable',
    trendScore: 7.2,
    dailyCount: 48,
    weeklyCount: 312,
    monthlyCount: 1345,
  },
  {
    id: 6,
    keyword: 'MySQL',
    searchCount: 876,
    trend: 'down',
    trendScore: 5.8,
    dailyCount: 28,
    weeklyCount: 198,
    monthlyCount: 876,
  },
  {
    id: 7,
    keyword: '机器学习',
    searchCount: 1198,
    trend: 'up',
    trendScore: 8.9,
    dailyCount: 52,
    weeklyCount: 298,
    monthlyCount: 1198,
  },
  {
    id: 8,
    keyword: 'Kubernetes',
    searchCount: 765,
    trend: 'up',
    trendScore: 8.1,
    dailyCount: 32,
    weeklyCount: 187,
    monthlyCount: 765,
  },
  {
    id: 9,
    keyword: 'TypeScript',
    searchCount: 934,
    trend: 'up',
    trendScore: 7.6,
    dailyCount: 36,
    weeklyCount: 221,
    monthlyCount: 934,
  },
  {
    id: 10,
    keyword: 'Node.js',
    searchCount: 823,
    trend: 'stable',
    trendScore: 6.8,
    dailyCount: 30,
    weeklyCount: 195,
    monthlyCount: 823,
  },
  {
    id: 11,
    keyword: 'Redis',
    searchCount: 712,
    trend: 'stable',
    trendScore: 6.2,
    dailyCount: 26,
    weeklyCount: 168,
    monthlyCount: 712,
  },
  {
    id: 12,
    keyword: 'Flutter',
    searchCount: 654,
    trend: 'up',
    trendScore: 7.9,
    dailyCount: 29,
    weeklyCount: 156,
    monthlyCount: 654,
  },
  {
    id: 13,
    keyword: '深度学习',
    searchCount: 891,
    trend: 'up',
    trendScore: 8.3,
    dailyCount: 38,
    weeklyCount: 213,
    monthlyCount: 891,
  },
  {
    id: 14,
    keyword: 'Go',
    searchCount: 598,
    trend: 'up',
    trendScore: 7.4,
    dailyCount: 25,
    weeklyCount: 142,
    monthlyCount: 598,
  },
  {
    id: 15,
    keyword: '微服务',
    searchCount: 743,
    trend: 'stable',
    trendScore: 6.9,
    dailyCount: 28,
    weeklyCount: 176,
    monthlyCount: 743,
  },
  {
    id: 16,
    keyword: 'MongoDB',
    searchCount: 567,
    trend: 'stable',
    trendScore: 5.9,
    dailyCount: 22,
    weeklyCount: 134,
    monthlyCount: 567,
  },
  {
    id: 17,
    keyword: 'Angular',
    searchCount: 489,
    trend: 'down',
    trendScore: 4.8,
    dailyCount: 18,
    weeklyCount: 115,
    monthlyCount: 489,
  },
  {
    id: 18,
    keyword: 'Django',
    searchCount: 512,
    trend: 'stable',
    trendScore: 5.5,
    dailyCount: 20,
    weeklyCount: 121,
    monthlyCount: 512,
  },
  {
    id: 19,
    keyword: 'AWS',
    searchCount: 678,
    trend: 'up',
    trendScore: 7.7,
    dailyCount: 27,
    weeklyCount: 161,
    monthlyCount: 678,
  },
  {
    id: 20,
    keyword: '区块链',
    searchCount: 534,
    trend: 'stable',
    trendScore: 6.1,
    dailyCount: 21,
    weeklyCount: 127,
    monthlyCount: 534,
  },
];

// 搜索历史数据
export const mockSearchHistory: SearchHistory[] = [];
let historyId = 1;

// 为每个用户生成一些搜索历史
for (let userId = 1; userId <= 30; userId++) {
  const historyCount = Math.floor(Math.random() * 10) + 5;
  for (let i = 0; i < historyCount; i++) {
    const keyword =
      mockHotKeywords[Math.floor(Math.random() * mockHotKeywords.length)]
        .keyword;
    mockSearchHistory.push({
      id: historyId++,
      userId,
      keyword,
      resultCount: Math.floor(Math.random() * 50) + 10,
      categoryId: Math.floor(Math.random() * 8) + 1,
      searchTime: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }
}

// 获取用户搜索历史
export const getUserSearchHistory = (userId: number, limit: number = 20) => {
  return mockSearchHistory
    .filter(h => h.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.searchTime).getTime() - new Date(a.searchTime).getTime()
    )
    .slice(0, limit);
};

// 获取搜索建议
export const getSearchSuggestions = (keyword: string, limit: number = 10) => {
  const lowerKeyword = keyword.toLowerCase();
  return mockHotKeywords
    .filter(k => k.keyword.toLowerCase().includes(lowerKeyword))
    .slice(0, limit)
    .map(k => ({
      keyword: k.keyword,
      count: k.searchCount,
    }));
};
