'use client';

/**
 * 分页 Hook
 */

import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '@/config';

interface UsePaginationProps {
  total: number;
  defaultPageSize?: number;
  defaultPage?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onChange: (page: number, size?: number) => void;
  reset: () => void;
}

export function usePagination({
  total,
  defaultPageSize = PAGINATION.defaultPageSize,
  defaultPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const onChange = useCallback((newPage: number, newSize?: number) => {
    setPage(newPage);
    if (newSize) setPageSize(newSize);
  }, []);

  const reset = useCallback(() => {
    setPage(defaultPage);
    setPageSize(defaultPageSize);
  }, [defaultPage, defaultPageSize]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize,
    onChange,
    reset,
  };
}
