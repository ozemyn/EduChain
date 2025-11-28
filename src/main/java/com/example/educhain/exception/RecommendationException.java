package com.example.educhain.exception;

/**
 * 推荐系统异常
 */
public class RecommendationException extends BusinessException {
    
    public static final String USER_NOT_FOUND = "REC_001";
    public static final String INSUFFICIENT_DATA = "REC_002";
    public static final String ALGORITHM_ERROR = "REC_003";
    public static final String DATABASE_ERROR = "REC_004";
    public static final String INVALID_PARAMETERS = "REC_005";
    public static final String CONTENT_NOT_FOUND = "REC_006";
    public static final String PREFERENCE_ANALYSIS_FAILED = "REC_007";
    public static final String SIMILARITY_CALCULATION_FAILED = "REC_008";
    
    public RecommendationException(String code, String message) {
        super(code, message);
    }
    
    public RecommendationException(String code, String message, Throwable cause) {
        super(code, message, cause);
    }
    
    // 静态工厂方法
    public static RecommendationException userNotFound(Long userId) {
        return new RecommendationException(USER_NOT_FOUND, 
            String.format("用户不存在或无效: userId=%d", userId));
    }
    
    public static RecommendationException insufficientData(String dataType) {
        return new RecommendationException(INSUFFICIENT_DATA, 
            String.format("数据不足，无法生成推荐: %s", dataType));
    }
    
    public static RecommendationException algorithmError(String algorithm, Throwable cause) {
        return new RecommendationException(ALGORITHM_ERROR, 
            String.format("推荐算法执行失败: %s", algorithm), cause);
    }
    
    public static RecommendationException databaseError(String operation, Throwable cause) {
        return new RecommendationException(DATABASE_ERROR, 
            String.format("数据库操作失败: %s", operation), cause);
    }
    
    public static RecommendationException invalidParameters(String paramName, Object paramValue) {
        return new RecommendationException(INVALID_PARAMETERS, 
            String.format("参数无效: %s=%s", paramName, paramValue));
    }
    
    public static RecommendationException contentNotFound(Long knowledgeId) {
        return new RecommendationException(CONTENT_NOT_FOUND, 
            String.format("内容不存在: knowledgeId=%d", knowledgeId));
    }
    
    public static RecommendationException preferenceAnalysisFailed(Long userId, Throwable cause) {
        return new RecommendationException(PREFERENCE_ANALYSIS_FAILED, 
            String.format("用户偏好分析失败: userId=%d", userId), cause);
    }
    
    public static RecommendationException similarityCalculationFailed(String type, Throwable cause) {
        return new RecommendationException(SIMILARITY_CALCULATION_FAILED, 
            String.format("相似度计算失败: %s", type), cause);
    }
}