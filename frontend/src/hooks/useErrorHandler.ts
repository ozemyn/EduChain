import { useCallback } from 'react';
import { toast } from 'sonner';

interface ApiError {
  code?: string;
  message?: string;
  path?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown) => {
    console.error('API Error:', error);

    let errorInfo: ApiError = {};

    // 处理不同类型的错误响应
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: {
            code?: string;
            message?: string;
            path?: string;
            error?: { code?: string; message?: string; path?: string };
          };
        };
      };
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        errorInfo = {
          code: data.code || data.error?.code,
          message: data.message || data.error?.message,
          path: data.path || data.error?.path,
        };
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string };
      errorInfo = {
        message: errorWithMessage.message,
      };
    }

    // 根据错误代码显示不同的提示
    const showErrorToast = (errorInfo: ApiError) => {
      const errorMessages: Record<string, string> = {
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
      };

      const message =
        errorMessages[errorInfo.code || ''] ||
        errorInfo.message ||
        '发生了未知错误';

      // 根据错误类型选择不同的提示方式
      if (
        errorInfo.code?.startsWith('REC_002') ||
        errorInfo.code?.startsWith('REC_007')
      ) {
        // 信息性错误，使用普通提示
        toast.info(message);
      } else if (
        errorInfo.code?.startsWith('DB_') ||
        errorInfo.code === 'TRANSACTION_ROLLBACK'
      ) {
        // 严重错误，使用错误提示
        toast.error(message);
      } else {
        // 默认警告提示
        toast.warning(message);
      }
    };

    showErrorToast(errorInfo);
    return errorInfo;
  }, []);

  const handleSuccess = useCallback((message: string = '操作成功') => {
    toast.success(message);
  }, []);

  const handleWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  const handleInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
};

export default useErrorHandler;
