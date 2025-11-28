package com.example.educhain.exception;

/**
 * 数据库操作异常
 */
public class DatabaseException extends BusinessException {
    
    public static final String CONNECTION_FAILED = "DB_001";
    public static final String QUERY_FAILED = "DB_002";
    public static final String TRANSACTION_FAILED = "DB_003";
    public static final String CONSTRAINT_VIOLATION = "DB_004";
    public static final String DATA_NOT_FOUND = "DB_005";
    public static final String DUPLICATE_KEY = "DB_006";
    public static final String FOREIGN_KEY_VIOLATION = "DB_007";
    public static final String TIMEOUT = "DB_008";
    
    public DatabaseException(String code, String message) {
        super(code, message);
    }
    
    public DatabaseException(String code, String message, Throwable cause) {
        super(code, message, cause);
    }
    
    // 静态工厂方法
    public static DatabaseException connectionFailed(Throwable cause) {
        return new DatabaseException(CONNECTION_FAILED, "数据库连接失败", cause);
    }
    
    public static DatabaseException queryFailed(String query, Throwable cause) {
        return new DatabaseException(QUERY_FAILED, 
            String.format("数据库查询失败: %s", query), cause);
    }
    
    public static DatabaseException transactionFailed(String operation, Throwable cause) {
        return new DatabaseException(TRANSACTION_FAILED, 
            String.format("事务操作失败: %s", operation), cause);
    }
    
    public static DatabaseException constraintViolation(String constraint, Throwable cause) {
        return new DatabaseException(CONSTRAINT_VIOLATION, 
            String.format("数据约束违反: %s", constraint), cause);
    }
    
    public static DatabaseException dataNotFound(String entity, Object id) {
        return new DatabaseException(DATA_NOT_FOUND, 
            String.format("数据不存在: %s[id=%s]", entity, id));
    }
    
    public static DatabaseException duplicateKey(String key, Object value) {
        return new DatabaseException(DUPLICATE_KEY, 
            String.format("数据重复: %s=%s", key, value));
    }
    
    public static DatabaseException foreignKeyViolation(String table, String key, Throwable cause) {
        return new DatabaseException(FOREIGN_KEY_VIOLATION, 
            String.format("外键约束违反: %s.%s", table, key), cause);
    }
    
    public static DatabaseException timeout(String operation) {
        return new DatabaseException(TIMEOUT, 
            String.format("数据库操作超时: %s", operation));
    }
}