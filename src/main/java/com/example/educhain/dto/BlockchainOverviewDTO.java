package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 区块链概览DTO */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainOverviewDTO {

  /** 总区块数 */
  private Integer totalBlocks;

  /** 总交易数 */
  private Integer totalTransactions;

  /** 最新区块信息 */
  private LatestBlockInfo latestBlock;

  /** 链是否有效 */
  private Boolean chainValid;

  /** 待处理交易数 */
  private Integer pendingTransactions;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class LatestBlockInfo {
    /** 区块索引 */
    private Integer index;

    /** 区块哈希 */
    private String hash;

    /** 时间戳 */
    private String timestamp;

    /** 交易数量 */
    private Integer transactionsCount;
  }
}
