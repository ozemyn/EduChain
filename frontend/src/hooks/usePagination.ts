import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '@/constants/app';

interface UsePaginationProps {
  total: number;
  defaultPageSize?: number;
  defaultCurrent?: number;
}

interface UsePaginationReturn {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  pageSizeOptions: readonly string[];
  onChange: (page: number, size?: number) => void;
  onShowSizeChange: (current: number, size: number) => void;
}

/**
 * 分页hook
 */
export function usePagination({
  total,
  defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  defaultCurrent = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const onChange = useCallback((page: number, size?: number) => {
    setCurrent(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  }, [pageSize]);

  const onShowSizeChange = useCallback((current: number, size: number) => {
    setCurrent(current);
    setPageSize(size);
  }, []);

  const paginationConfig = useMemo(
    () => ({
      current,
      pageSize,
      total,
      showSizeChanger: PAGINATION.SHOW_SIZE_CHANGER,
      showQuickJumper: PAGINATION.SHOW_QUICK_JUMPER,
      pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS,
      onChange,
      onShowSizeChange,
    }),
    [current, pageSize, total, onChange, onShowSizeChange]
  );

  return paginationConfig;
}
