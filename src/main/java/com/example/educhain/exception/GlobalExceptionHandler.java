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
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

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
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Result<Void>> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        logger.error("运行时异常: ", e);
        Result<Void> result = Result.internalError();
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Void>> handleException(Exception e, HttpServletRequest request) {
        logger.error("系统异常: ", e);
        Result<Void> result = Result.internalError();
        result.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}