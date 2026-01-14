'use client';

/**
 * 错误处理 Hook
 */

import { useCallback } from 'react';
import { parseApiError, getErrorMessage } from '@/lib/error';
import { useToast } from './use-toast';

export function useErrorHandler() {
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      const { code, message } = parseApiError(error);
      const displayMessage = getErrorMessage(code, message);

      // 根据错误类型选择提示方式
      if (code?.startsWith('DB_')) {
        toast.error(displayMessage);
      } else if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') {
        toast.warning(displayMessage);
      } else {
        toast.error(displayMessage);
      }

      return { code, message: displayMessage };
    },
    [toast]
  );

  const handleSuccess = useCallback(
    (message = '操作成功') => {
      toast.success(message);
    },
    [toast]
  );

  const handleWarning = useCallback(
    (message: string) => {
      toast.warning(message);
    },
    [toast]
  );

  const handleInfo = useCallback(
    (message: string) => {
      toast.info(message);
    },
    [toast]
  );

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
}
