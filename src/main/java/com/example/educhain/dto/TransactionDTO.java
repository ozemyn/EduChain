package com.example.educhain.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 交易DTO */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

  /** 交易ID */
  private String id;

  /** 交易类型 */
  private String type;

  /** 知识内容ID */
  private Long knowledgeId;

  /** 用户ID */
  private Long userId;

  /** 内容哈希 */
  private String contentHash;

  /** 元数据 */
  private Map<String, Object> metadata;

  /** 时间戳 */
  private String timestamp;

  /** 数字签名（可选） */
  private String signature;

  /** 公钥（可选） */
  private String publicKey;

  /** 所在区块索引（可选） */
  private Integer blockIndex;

  /** 交易状态：pending-待确认, confirmed-已确认 */
  private String status;
}
