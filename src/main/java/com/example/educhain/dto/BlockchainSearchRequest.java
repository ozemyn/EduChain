package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 区块链搜索请求DTO */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainSearchRequest {

  /** 搜索类型: block, transaction, knowledge */
  private String searchType;

  /** 搜索关键词 */
  private String keyword;

  /** 区块索引（用于按区块索引搜索） */
  private Integer blockIndex;

  /** 交易ID（用于按交易ID搜索） */
  private String transactionId;

  /** 知识ID（用于按知识ID搜索） */
  private Long knowledgeId;
}
