package com.example.educhain.util;

/** 系统常量类 */
public final class Constants {

  // 私有构造函数，防止实例化
  private Constants() {}

  // 用户状态
  public static final class UserStatus {
    public static final int ACTIVE = 1; // 正常
    public static final int DISABLED = 0; // 禁用
  }

  // 知识内容状态
  public static final class KnowledgeStatus {
    public static final int PUBLISHED = 1; // 已发布
    public static final int DELETED = 0; // 已删除
    public static final int DRAFT = 2; // 草稿
  }

  // 评论状态
  public static final class CommentStatus {
    public static final int NORMAL = 1; // 正常
    public static final int DELETED = 0; // 已删除
    public static final int PENDING = 2; // 待审核
  }

  // JWT 相关
  public static final class JWT {
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_NAME = "Authorization";
    public static final String CLAIM_USER_ID = "userId";
    public static final String CLAIM_USERNAME = "username";
    public static final String CLAIM_ROLE = "role";
  }

  // 缓存键前缀
  public static final class CacheKeys {
    public static final String USER_PREFIX = "user:";
    public static final String KNOWLEDGE_PREFIX = "knowledge:";
    public static final String CATEGORY_PREFIX = "category:";
    public static final String HOT_KEYWORDS = "hot:keywords";
    public static final String USER_STATS = "stats:user:";
    public static final String KNOWLEDGE_STATS = "stats:knowledge:";
  }

  // 文件上传相关
  public static final class FileUpload {
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"jpg", "jpeg", "png", "gif"};
    public static final String[] ALLOWED_DOCUMENT_TYPES = {"pdf", "doc", "docx", "ppt", "pptx"};
    public static final String[] ALLOWED_VIDEO_TYPES = {"mp4", "avi", "mov"};
    public static final String UPLOAD_PATH = "./uploads/";
  }

  // 分页相关
  public static final class Pagination {
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";
  }

  // 搜索相关
  public static final class Search {
    public static final int MAX_KEYWORD_LENGTH = 100;
    public static final int SUGGESTION_LIMIT = 10;
    public static final int HOT_KEYWORDS_LIMIT = 20;
  }

  // 用户等级相关
  public static final class UserLevel {
    public static final int[] LEVEL_POINTS = {
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500
    };
    public static final String[] LEVEL_NAMES = {
      "新手", "初学者", "学习者", "进阶者", "熟练者",
      "专家", "大师", "导师", "学者", "权威"
    };
  }

  // 积分规则
  public static final class Points {
    public static final int REGISTER = 10; // 注册
    public static final int LOGIN_DAILY = 5; // 每日登录
    public static final int PUBLISH_KNOWLEDGE = 20; // 发布知识
    public static final int RECEIVE_LIKE = 2; // 获得点赞
    public static final int RECEIVE_FAVORITE = 5; // 获得收藏
    public static final int COMMENT = 3; // 发表评论
    public static final int FOLLOW = 1; // 关注他人
    public static final int BE_FOLLOWED = 5; // 被他人关注
  }

  // 通知类型
  public static final class NotificationType {
    public static final String LIKE = "LIKE"; // 点赞通知
    public static final String COMMENT = "COMMENT"; // 评论通知
    public static final String FOLLOW = "FOLLOW"; // 关注通知
    public static final String SYSTEM = "SYSTEM"; // 系统通知
    public static final String ACHIEVEMENT = "ACHIEVEMENT"; // 成就通知
  }

  // 正则表达式
  public static final class Regex {
    public static final String USERNAME = "^[a-zA-Z0-9_]{3,20}$";
    public static final String EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String PASSWORD =
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,20}$";
    public static final String PHONE = "^1[3-9]\\d{9}$";
  }

  // 错误码
  public static final class ErrorCode {
    // 用户相关
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String ACCOUNT_DISABLED = "ACCOUNT_DISABLED";

    // 知识内容相关
    public static final String KNOWLEDGE_NOT_FOUND = "KNOWLEDGE_NOT_FOUND";
    public static final String CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND";

    // 权限相关
    public static final String ACCESS_DENIED = "ACCESS_DENIED";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";

    // 文件相关
    public static final String FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED";
    public static final String FILE_TYPE_NOT_SUPPORTED = "FILE_TYPE_NOT_SUPPORTED";
    public static final String FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED";

    // 系统相关
    public static final String SYSTEM_ERROR = "SYSTEM_ERROR";
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String DUPLICATE_OPERATION = "DUPLICATE_OPERATION";
  }
}
