import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error?: {
    code?: string;
    message?: string;
    path?: string;
  };
  title?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = '操作失败',
  showRetry = true,
  showHome = false,
  onRetry,
  onHome,
}) => {
  const getErrorMessage = () => {
    if (!error) return '发生了未知错误';

    // 根据错误代码提供用户友好的消息
    const errorMessages: Record<string, string> = {
      // 推荐系统错误
      REC_001: '用户信息无效，请重新登录',
      REC_002: '暂无足够数据生成推荐，请先浏览一些内容',
      REC_003: '推荐算法暂时不可用，请稍后重试',
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

    return errorMessages[error.code || ''] || error.message || '发生了未知错误';
  };

  const getErrorSeverity = () => {
    if (!error?.code) return 'destructive';

    // 根据错误类型确定严重程度
    if (error.code.startsWith('REC_002') || error.code.startsWith('REC_007')) {
      return 'default'; // 信息性错误
    }

    if (error.code.startsWith('DB_') || error.code === 'TRANSACTION_ROLLBACK') {
      return 'destructive'; // 严重错误
    }

    return 'default';
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Alert variant={getErrorSeverity()}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {getErrorMessage()}
          {error?.code && (
            <div className="text-xs text-muted-foreground mt-2">
              错误代码: {error.code}
            </div>
          )}
        </AlertDescription>

        {(showRetry || showHome) && (
          <div className="flex gap-2 mt-4">
            {showRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                重试
              </Button>
            )}
            {showHome && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleHome}
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" />
                返回首页
              </Button>
            )}
          </div>
        )}
      </Alert>
    </div>
  );
};

export default ErrorDisplay;
