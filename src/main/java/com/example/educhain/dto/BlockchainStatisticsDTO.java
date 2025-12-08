package com.example.educhain.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 区块链统计DTO */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainStatisticsDTO {

  /** 总区块数 */
  private Integer totalBlocks;

  /** 总交易数 */
  private Integer totalTransactions;

  /** 待处理交易数 */
  private Integer pendingTransactions;

  /** 交易类型分布 */
  private Map<String, Integer> transactionTypes;

  /** 链是否有效 */
  private Boolean isValid;
}
