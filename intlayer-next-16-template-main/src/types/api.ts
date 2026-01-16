// API响应基础类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  code?: string;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
  errorCode?: number;
}

// 分页响应类型（与Spring Data Page完全一致）
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

// 分页请求参数
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  school?: string;
  level: number;
  bio?: string;
  role: 'LEARNER' | 'ADMIN';
  status: number;
  createdAt: string;
  updatedAt: string;
  knowledgeCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export interface UserStats {
  userId: number;
  knowledgeCount: number;
  likeCount: number;
  favoriteCount: number;
  followingCount: number;
  followerCount: number;
  viewCount: number;
}

// 认证相关类型
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  school?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}


// 知识内容相关类型
export interface KnowledgeItem {
  id: number;
  shareCode: string;
  title: string;
  content: string;
  summary?: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  mediaUrls?: string[];
  linkUrl?: string;
  uploaderId: number;
  uploaderName?: string;
  uploaderAvatar?: string;
  uploader?: User;
  categoryId?: number;
  categoryName?: string;
  category?: Category;
  tags: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  stats?: KnowledgeStats;
  contentHash?: string;
}

export interface KnowledgeStats {
  knowledgeId: number;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  shareCount?: number;
  score: number;
}

export interface CreateKnowledgeRequest {
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  mediaUrls?: string[];
  linkUrl?: string;
  categoryId?: number;
  tags?: string;
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  sortOrder: number;
  createdAt: string;
  children?: Category[];
  knowledgeCount?: number;
}

export interface CategoryDetail extends Category {
  totalKnowledgeCount?: number;
  children?: CategoryDetail[];
}

// 评论相关类型
export interface Comment {
  id: number;
  knowledgeId: number;
  userId: number;
  user: User;
  parentId?: number;
  content: string;
  status: number;
  createdAt: string;
  children?: Comment[];
}

// 通知相关类型
export interface Notification {
  id: number;
  userId: number;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'SYSTEM';
  title: string;
  content: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
}

// 用户互动相关类型
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
  userLiked?: boolean;
  userFavorited?: boolean;
}

export interface CreateCommentRequest {
  knowledgeId: number;
  content: string;
  parentId?: number;
}

export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
  replyCount?: number;
}

// 关注相关类型
export interface UserFollow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
  follower?: User;
  following?: User;
  user: User;
  isFollowing: boolean;
  isMutual: boolean;
}

export interface FollowStats {
  userId: number;
  followingCount: number;
  followerCount: number;
  isFollowing?: boolean;
}

// 活动动态相关类型
export interface Activity {
  id: number;
  type: 'publish' | 'like' | 'comment' | 'follow';
  userId: number;
  user?: User;
  content: string;
  targetId?: number;
  targetTitle?: string;
  createdAt: string;
}

// 搜索相关类型
export interface SearchRequest {
  keyword: string;
  categoryId?: number;
  type?: string;
  sortBy?: 'RELEVANCE' | 'TIME' | 'POPULARITY';
  page?: number;
  size?: number;
}

export interface SearchResult {
  items: KnowledgeItem[];
  total: number;
  suggestions?: string[];
  hotKeywords?: string[];
}
