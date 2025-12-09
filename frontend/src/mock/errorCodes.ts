/**
 * Mock错误码定义
 * 与后端错误码保持完全一致
 */

export const ERROR_CODES = {
  // 推荐系统错误
  REC_001: '用户信息无效，请重新登录',
  REC_002: '暂无足够数据生成推荐，请先浏览一些内容',
  REC_003: '推荐服务暂时不可用，请稍后重试',
  REC_004: '数据库连接异常，请稍后重试',
  REC_005: '请求参数有误，请检查后重试',
  REC_006: '内容不存在或已被删除',
  REC_007: '用户偏好分析失败，将为您推荐热门内容',
  REC_008: '相似度计算失败，请稍后重试',

  // 数据库错误
  DB_001: '数据库连接失败，请检查网络连接',
  DB_002: '数据查询失败，请稍后重试',
  DB_003: '数据操作失败，请重试',
  DB_004: '数据约束冲突，请检查输入信息',
  DB_005: '数据不存在',
  DB_006: '数据已存在，不能重复添加',
  DB_007: '关联数据不存在，操作失败',
  DB_008: '操作超时，请稍后重试',

  // SQL错误
  COLUMN_NOT_FOUND: '系统配置异常，请联系管理员',
  DUPLICATE_ENTRY: '数据已存在，不能重复添加',
  FOREIGN_KEY_ERROR: '关联数据不存在，操作失败',
  TABLE_NOT_FOUND: '系统配置错误，请联系管理员',

  // 事务错误
  TRANSACTION_ROLLBACK: '操作被取消，请检查数据后重试',

  // 通用错误
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  INVALID_CREDENTIALS: '用户名或密码错误',
  UNAUTHORIZED: '请先登录',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '请求的资源不存在',
  INTERNAL_ERROR: '系统内部错误，请稍后重试',

  // 搜索错误
  SEARCH_ERROR: '搜索失败，请稍后重试',
  SUGGESTION_ERROR: '获取搜索建议失败',
  HOT_KEYWORDS_ERROR: '获取热门关键词失败',
  TRENDING_KEYWORDS_ERROR: '获取趋势关键词失败',
  RELATED_KEYWORDS_ERROR: '获取相关关键词失败',

  // 互动错误
  LIKE_FAILED: '点赞失败',
  UNLIKE_FAILED: '取消点赞失败',
  FAVORITE_FAILED: '收藏失败',
  UNFAVORITE_FAILED: '取消收藏失败',
  GET_STATUS_FAILED: '获取互动状态失败',
  GET_STATS_FAILED: '获取互动统计失败',

  // 通知错误
  GET_USER_NOTIFICATIONS_FAILED: '获取用户通知失败',
  GET_UNREAD_NOTIFICATIONS_FAILED: '获取未读通知失败',
  MARK_AS_READ_FAILED: '标记通知为已读失败',
  DELETE_NOTIFICATION_FAILED: '删除通知失败',

  // 关注错误
  FOLLOW_FAILED: '关注失败',
  UNFOLLOW_FAILED: '取消关注失败',
  GET_FOLLOWING_FAILED: '获取关注列表失败',
  GET_FOLLOWERS_FAILED: '获取粉丝列表失败',

  // 请求错误
  INVALID_REQUEST: '请求参数无效',
  MISSING_PARAMETER: '缺少必要参数',
  PARAMETER_TYPE_ERROR: '参数类型错误',
};

/**
 * 根据错误码获取错误信息
 */
export const getErrorMessage = (code: string): string => {
  return ERROR_CODES[code as keyof typeof ERROR_CODES] || '发生了未知错误';
};

/**
 * 创建错误响应
 */
export const createErrorResponse = (code: string, customMessage?: string) => ({
  success: false,
  code,
  message: customMessage || getErrorMessage(code),
  data: null,
  timestamp: new Date().toISOString(),
});
