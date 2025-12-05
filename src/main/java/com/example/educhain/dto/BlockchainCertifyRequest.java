package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 区块链存证请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainCertifyRequest {

  /** 交易类型 */
  private String type;

  /** 知识内容ID */
  private Long knowledgeId;

  /** 用户ID */
  private Long userId;

  /** 内容哈希值 */
  private String contentHash;

  /** 元数据 */
  private java.util.Map<String, Object> metadata;
}

