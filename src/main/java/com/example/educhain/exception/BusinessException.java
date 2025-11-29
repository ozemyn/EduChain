package com.example.educhain.exception;

/** 业务异常类 用于处理业务逻辑相关的异常情况 */
public class BusinessException extends RuntimeException {

  private String code;

  public BusinessException(String message) {
    super(message);
    this.code = "BUSINESS_ERROR";
  }

  public BusinessException(String code, String message) {
    super(message);
    this.code = code;
  }

  public BusinessException(String message, Throwable cause) {
    super(message, cause);
    this.code = "BUSINESS_ERROR";
  }

  public BusinessException(String code, String message, Throwable cause) {
    super(message, cause);
    this.code = code;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  // 常用业务异常静态方法
  public static BusinessException userNotFound() {
    return new BusinessException("USER_NOT_FOUND", "用户不存在");
  }

  public static BusinessException userAlreadyExists() {
    return new BusinessException("USER_ALREADY_EXISTS", "用户已存在");
  }

  public static BusinessException invalidCredentials() {
    return new BusinessException("INVALID_CREDENTIALS", "用户名或密码错误");
  }

  public static BusinessException accountDisabled() {
    return new BusinessException("ACCOUNT_DISABLED", "账户已被禁用");
  }

  public static BusinessException knowledgeNotFound() {
    return new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在");
  }

  public static BusinessException categoryNotFound() {
    return new BusinessException("CATEGORY_NOT_FOUND", "分类不存在");
  }

  public static BusinessException accessDenied() {
    return new BusinessException("ACCESS_DENIED", "访问被拒绝");
  }

  public static BusinessException operationNotAllowed() {
    return new BusinessException("OPERATION_NOT_ALLOWED", "操作不被允许");
  }

  public static BusinessException duplicateOperation() {
    return new BusinessException("DUPLICATE_OPERATION", "重复操作");
  }

  public static BusinessException resourceNotFound(String resource) {
    return new BusinessException("RESOURCE_NOT_FOUND", resource + "不存在");
  }
}
