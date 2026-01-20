/**
 * Mock 响应构造器
 */

import type { ApiResponse, PageResponse } from '../../types/api';

/**
 * 创建成功响应
 */
export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: '操作成功',
  data,
  timestamp: new Date().toISOString(),
});

/**
 * 创建分页响应（与 Spring Data Page 格式一致）
 */
export const createPageResponse = <T>(
  items: T[],
  page: number = 0,
  size: number = 10
): PageResponse<T> => {
  const start = page * size;
  const end = start + size;
  const content = items.slice(start, end);

  return {
    content,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    size,
    number: page,
    first: page === 0,
    last: end >= items.length,
    empty: items.length === 0,
    numberOfElements: content.length,
    pageable: {
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
      pageNumber: page,
      pageSize: size,
      offset: start,
      paged: true,
      unpaged: false,
    },
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
  };
};
