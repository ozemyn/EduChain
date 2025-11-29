package com.example.educhain.exception;

/** 限流异常 */
public class RateLimitException extends RuntimeException {

  private final String message;
  private final long retryAfter;

  public RateLimitException(String message) {
    super(message);
    this.message = message;
    this.retryAfter = 0;
  }

  public RateLimitException(String message, long retryAfter) {
    super(message);
    this.message = message;
    this.retryAfter = retryAfter;
  }

  public String getMessage() {
    return message;
  }

  public long getRetryAfter() {
    return retryAfter;
  }
}
