package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * 区块DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockDTO {

  /** 区块索引 */
  private Integer index;

  /** 时间戳 */
  private String timestamp;

  /** 交易列表 */
  private List<TransactionDTO> transactions;

  /** 前一个区块哈希 */
  private String previousHash;

  /** 当前区块哈希 */
  private String hash;

  /** Merkle根（可选） */
  private String merkleRoot;

  /** 交易数量 */
  private Integer transactionsCount;
}
