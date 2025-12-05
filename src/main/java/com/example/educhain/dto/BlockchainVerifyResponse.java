package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 区块链验证响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainVerifyResponse {

  /** 验证是否通过 */
  private Boolean isValid;

  /** 区块索引 */
  private Integer blockIndex;

  /** 交易时间戳 */
  private String transactionTimestamp;

  /** 消息 */
  private String message;
}

