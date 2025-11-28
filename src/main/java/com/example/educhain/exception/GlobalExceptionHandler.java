package com.example.educhain.exception;

import com.example.educhain.util.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.sql.SQLException;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Result<Void>> handleBusinessException(BusinessException e, HttpServletRequest request) {
        logger.warn("业务异常: {}", e.getMessage());
        Result<Void> result = Result.error(e.getCode(), e.getMessage());
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理验证异常
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Result<Void>> handleValidationException(ValidationException e, HttpServletRequest request) {
        logger.warn("验证异常: {}", e.getMessage());
        Result<Void> result = Result.error("VALIDATION_ERROR", e.getMessage());
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理方法参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        logger.warn("参数验证异常: {}", message);
        Result<Void> result = Result.error("VALIDATION_ERROR", message);
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理绑定异常
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<Result<Void>> handleBindException(BindException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        logger.warn("绑定异常: {}", message);
        Result<Void> result = Result.error("VALIDATION_ERROR", message);
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Result<Void>> handleConstraintViolationException(ConstraintViolationException e, HttpServletRequest request) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        logger.warn("约束违反异常: {}", message);
        Result<Void> result = Result.error("VALIDATION_ERROR", message);
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理认证异常
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Result<Void>> handleAuthenticationException(AuthenticationException e, HttpServletRequest request) {
        logger.warn("认证异常: {}", e.getMessage());
        Result<Void> result = Result.unauthorized();
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    
    /**
     * 处理凭据错误异常
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Result<Void>> handleBadCredentialsException(BadCredentialsException e, HttpServletRequest request) {
        logger.warn("凭据错误: {}", e.getMessage());
        Result<Void> result = Result.error("INVALID_CREDENTIALS", "用户名或密码错误");
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    
    /**
     * 处理访问拒绝异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Result<Void>> handleAccessDeniedException(AccessDeniedException e, HttpServletRequest request) {
        logger.warn("访问拒绝: {}", e.getMessage());
        Result<Void> result = Result.forbidden();
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    }
    
    /**
     * 处理数据完整性违反异常
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Result<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException e, HttpServletRequest request) {
        logger.warn("数据完整性违反: {}", e.getMessage());
        String message = "数据操作失败，可能存在重复数据或违反约束条件";
        if (e.getMessage() != null) {
            if (e.getMessage().contains("Duplicate entry")) {
                message = "数据已存在，不能重复添加";
            } else if (e.getMessage().contains("foreign key constraint")) {
                message = "关联数据不存在或已被删除";
            }
        }
        Result<Void> result = Result.error("DATA_INTEGRITY_ERROR", message);
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理文件上传大小超限异常
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Result<Void>> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e, HttpServletRequest request) {
        logger.warn("文件上传大小超限: {}", e.getMessage());
        Result<Void> result = Result.error("FILE_SIZE_EXCEEDED", "上传文件大小超过限制");
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理非法参数异常
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Result<Void>> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        logger.warn("非法参数异常: {}", e.getMessage());
        Result<Void> result = Result.badRequest(e.getMessage());
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理推荐系统异常
     */
    @ExceptionHandler(RecommendationException.class)
    public ResponseEntity<Result<Void>> handleRecommendationException(RecommendationException e, HttpServletRequest request) {
        logger.warn("推荐系统异常: code={}, message={}", e.getCode(), e.getMessage());
        Result<Void> result = Result.error(e.getCode(), e.getMessage());
        result.setPath(request.getRequestURI());
        return ResponseEntity.badRequest().body(result);
    }
    
    /**
     * 处理数据库异常
     */
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<Result<Void>> handleDatabaseException(DatabaseException e, HttpServletRequest request) {
        logger.error("数据库异常: code={}, message={}", e.getCode(), e.getMessage(), e);
        Result<Void> result = Result.error(e.getCode(), e.getMessage());
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理事务回滚异常
     */
    @ExceptionHandler(org.springframework.transaction.UnexpectedRollbackException.class)
    public ResponseEntity<Result<Void>> handleUnexpectedRollbackException(
            org.springframework.transaction.UnexpectedRollbackException e, HttpServletRequest request) {
        logger.error("事务意外回滚异常: {}", e.getMessage(), e);
        
        String userMessage = "操作失败，数据处理过程中发生错误";
        String errorCode = "TRANSACTION_ROLLBACK";
        
        // 根据异常信息提供更具体的错误描述
        if (e.getMessage() != null) {
            if (e.getMessage().contains("rollback-only")) {
                userMessage = "操作被取消，请检查数据完整性后重试";
            }
        }
        
        Result<Void> result = Result.error(errorCode, userMessage);
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理SQL异常
     */
    @ExceptionHandler(java.sql.SQLException.class)
    public ResponseEntity<Result<Void>> handleSQLException(java.sql.SQLException e, HttpServletRequest request) {
        logger.error("SQL异常: SQLState={}, ErrorCode={}, Message={}", 
                e.getSQLState(), e.getErrorCode(), e.getMessage(), e);
        
        String userMessage = "数据库操作失败";
        String errorCode = "SQL_ERROR";
        
        // 根据SQL错误码提供更具体的错误信息
        switch (e.getErrorCode()) {
            case 1054: // Unknown column
                userMessage = "数据结构不匹配，请联系管理员";
                errorCode = "COLUMN_NOT_FOUND";
                break;
            case 1062: // Duplicate entry
                userMessage = "数据已存在，不能重复添加";
                errorCode = "DUPLICATE_ENTRY";
                break;
            case 1452: // Foreign key constraint
                userMessage = "关联数据不存在，操作失败";
                errorCode = "FOREIGN_KEY_ERROR";
                break;
            case 1146: // Table doesn't exist
                userMessage = "系统配置错误，请联系管理员";
                errorCode = "TABLE_NOT_FOUND";
                break;
            default:
                userMessage = "数据库操作失败，请稍后重试";
                break;
        }
        
        Result<Void> result = Result.error(errorCode, userMessage);
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理JPA异常
     */
    @ExceptionHandler(jakarta.persistence.PersistenceException.class)
    public ResponseEntity<Result<Void>> handlePersistenceException(
            jakarta.persistence.PersistenceException e, HttpServletRequest request) {
        logger.error("JPA持久化异常: {}", e.getMessage(), e);
        
        String userMessage = "数据持久化失败";
        String errorCode = "PERSISTENCE_ERROR";
        
        // 检查是否是SQL异常的包装
        Throwable cause = e.getCause();
        if (cause instanceof java.sql.SQLException) {
            return handleSQLException((java.sql.SQLException) cause, request);
        }
        
        Result<Void> result = Result.error(errorCode, userMessage);
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Result<Void>> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        // 跳过Swagger相关请求的异常处理
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/v3/api-docs") || requestURI.contains("/swagger-ui") || 
            requestURI.contains("/swagger-resources") || requestURI.contains("/webjars")) {
            // 重新抛出异常，让Spring Boot默认处理
            throw e;
        }
        
        logger.error("运行时异常: type={}, message={}", e.getClass().getSimpleName(), e.getMessage(), e);
        
        String userMessage = "系统内部错误，请稍后重试";
        String errorCode = "RUNTIME_ERROR";
        
        // 根据异常类型提供更具体的错误信息
        if (e instanceof NullPointerException) {
            userMessage = "系统数据异常，请联系管理员";
            errorCode = "NULL_POINTER_ERROR";
        } else if (e instanceof IllegalStateException) {
            userMessage = "系统状态异常，请刷新页面后重试";
            errorCode = "ILLEGAL_STATE_ERROR";
        } else if (e instanceof ClassCastException) {
            userMessage = "数据类型错误，请联系管理员";
            errorCode = "CLASS_CAST_ERROR";
        }
        
        Result<Void> result = Result.error(errorCode, userMessage);
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Void>> handleException(Exception e, HttpServletRequest request) {
        // 跳过Swagger相关请求的异常处理
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/v3/api-docs") || requestURI.contains("/swagger-ui") || 
            requestURI.contains("/swagger-resources") || requestURI.contains("/webjars")) {
            // 对于Swagger相关请求，返回简单的错误响应，避免递归异常
            Result<Void> result = Result.error("SWAGGER_ERROR", "API文档访问错误");
            result.setPath(request.getRequestURI());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
        
        logger.error("系统异常: ", e);
        Result<Void> result = Result.internalError();
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}