package com.example.educhain.util;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

/**
 * 统一响应结果类
 * @param <T> 数据类型
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> {
    
    private boolean success;
    private String code;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String path;

    // 私有构造函数
    private Result() {
        this.timestamp = LocalDateTime.now();
    }

    private Result(boolean success, String code, String message, T data) {
        this();
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 成功响应 - 带数据
    public static <T> Result<T> success(T data) {
        return new Result<>(true, "SUCCESS", "操作成功", data);
    }

    // 成功响应 - 不带数据
    public static <T> Result<T> success() {
        return new Result<>(true, "SUCCESS", "操作成功", null);
    }

    // 成功响应 - 自定义消息
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(true, "SUCCESS", message, data);
    }

    // 失败响应 - 带错误码和消息
    public static <T> Result<T> error(String code, String message) {
        return new Result<>(false, code, message, null);
    }

    // 失败响应 - 只带消息
    public static <T> Result<T> error(String message) {
        return new Result<>(false, "ERROR", message, null);
    }

    // 失败响应 - 带数据
    public static <T> Result<T> error(String code, String message, T data) {
        return new Result<>(false, code, message, data);
    }

    // 常用错误响应
    public static <T> Result<T> badRequest(String message) {
        return new Result<>(false, "BAD_REQUEST", message, null);
    }

    public static <T> Result<T> unauthorized() {
        return new Result<>(false, "UNAUTHORIZED", "未授权访问", null);
    }

    public static <T> Result<T> forbidden() {
        return new Result<>(false, "FORBIDDEN", "访问被禁止", null);
    }

    public static <T> Result<T> notFound(String message) {
        return new Result<>(false, "NOT_FOUND", message, null);
    }

    public static <T> Result<T> internalError() {
        return new Result<>(false, "INTERNAL_ERROR", "系统内部错误", null);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "Result{" +
                "success=" + success +
                ", code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", timestamp=" + timestamp +
                ", path='" + path + '\'' +
                '}';
    }
}