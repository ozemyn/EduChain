package com.example.educhain.exception;

/** 验证异常类 用于处理数据验证相关的异常情况 */
public class ValidationException extends RuntimeException {

  private String field;
  private Object rejectedValue;

  public ValidationException(String message) {
    super(message);
  }

  public ValidationException(String field, String message) {
    super(message);
    this.field = field;
  }

  public ValidationException(String field, Object rejectedValue, String message) {
    super(message);
    this.field = field;
    this.rejectedValue = rejectedValue;
  }

  public ValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  public String getField() {
    return field;
  }

  public void setField(String field) {
    this.field = field;
  }

  public Object getRejectedValue() {
    return rejectedValue;
  }

  public void setRejectedValue(Object rejectedValue) {
    this.rejectedValue = rejectedValue;
  }

  // 常用验证异常静态方法
  public static ValidationException required(String field) {
    return new ValidationException(field, field + "不能为空");
  }

  public static ValidationException invalidFormat(String field) {
    return new ValidationException(field, field + "格式不正确");
  }

  public static ValidationException lengthExceeded(String field, int maxLength) {
    return new ValidationException(field, field + "长度不能超过" + maxLength + "个字符");
  }

  public static ValidationException lengthTooShort(String field, int minLength) {
    return new ValidationException(field, field + "长度不能少于" + minLength + "个字符");
  }

  public static ValidationException invalidValue(String field, Object value) {
    return new ValidationException(field, value, field + "的值无效: " + value);
  }

  public static ValidationException outOfRange(String field, Object min, Object max) {
    return new ValidationException(field, field + "的值必须在" + min + "和" + max + "之间");
  }

  public static ValidationException invalidEmail() {
    return new ValidationException("email", "邮箱格式不正确");
  }

  public static ValidationException passwordTooWeak() {
    return new ValidationException("password", "密码强度不够");
  }

  public static ValidationException fileTypeNotSupported(String fileType) {
    return new ValidationException("file", "不支持的文件类型: " + fileType);
  }

  public static ValidationException fileSizeExceeded(long maxSize) {
    return new ValidationException("file", "文件大小超过限制: " + maxSize + " bytes");
  }
}
