package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 区块链浏览器控制器
 * 提供区块链浏览器相关的API接口，包括区块查询、交易查询、搜索等功能
 */
@RestController
@RequestMapping("/blockchain")
@Tag(name = "区块链浏览器", description = "区块链浏览器相关API，提供区块、交易查询和搜索功能")
public class BlockchainController {

  private static final Logger log = LoggerFactory.getLogger(BlockchainController.class);

  @Value("${blockchain.service.url:http://localhost:8000}")
  private String blockchainServiceUrl;

  private final RestTemplate restTemplate;

  public BlockchainController() {
    this.restTemplate = new RestTemplate();
  }

  /**
   * 获取区块链概览信息
   * 返回区块链的总体统计信息，包括总区块数、总交易数、最新区块信息等
   *
   * @return 区块链概览信息
   */
  @GetMapping("/overview")
  @Operation(
      summary = "获取区块链概览",
      description = "获取区块链的总体统计信息，包括总区块数、总交易数、最新区块信息等"
  )
  public ResponseEntity<Result<BlockchainOverviewDTO>> getOverview() {
    try {
      // 获取区块链信息
      String chainUrl = blockchainServiceUrl + "/api/blockchain/chain";
      Map<String, Object> chainInfo = restTemplate.getForObject(chainUrl, Map.class);

      // 获取统计信息
      String statsUrl = blockchainServiceUrl + "/api/blockchain/stats";
      Map<String, Object> stats = restTemplate.getForObject(statsUrl, Map.class);

      if (chainInfo == null || stats == null) {
        return ResponseEntity.ok(Result.error("BC001", "无法获取区块链信息"));
      }

      // 构建概览信息
      BlockchainOverviewDTO overview = BlockchainOverviewDTO.builder()
          .totalBlocks((Integer) stats.get("total_blocks"))
          .totalTransactions((Integer) stats.get("total_transactions"))
          .chainValid((Boolean) chainInfo.get("is_valid"))
          .pendingTransactions((Integer) stats.get("pending_transactions"))
          .build();

      // 获取最新区块信息
      Integer latestBlockIndex = (Integer) chainInfo.get("latest_block_index");
      if (latestBlockIndex != null && latestBlockIndex >= 0) {
        String blockUrl = blockchainServiceUrl + "/api/blockchain/block/" + latestBlockIndex;
        Map<String, Object> latestBlock = restTemplate.getForObject(blockUrl, Map.class);

        if (latestBlock != null) {
          List<Map<String, Object>> transactions = 
              (List<Map<String, Object>>) latestBlock.get("transactions");
          
          BlockchainOverviewDTO.LatestBlockInfo latestBlockInfo = 
              BlockchainOverviewDTO.LatestBlockInfo.builder()
                  .index((Integer) latestBlock.get("index"))
                  .hash((String) latestBlock.get("hash"))
                  .timestamp((String) latestBlock.get("timestamp"))
                  .transactionsCount(transactions != null ? transactions.size() : 0)
                  .build();

          overview.setLatestBlock(latestBlockInfo);
        }
      }

      return ResponseEntity.ok(Result.success(overview));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getOverview: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "获取区块链概览失败"));
    }
  }

  /**
   * 获取区块列表
   * 支持分页和排序，返回区块的基本信息列表
   *
   * @param pageable 分页参数
   * @return 区块列表
   */
  @GetMapping("/blocks")
  @Operation(
      summary = "获取区块列表",
      description = "分页获取区块列表，支持按索引排序"
  )
  public ResponseEntity<Result<Page<BlockDTO>>> getBlocks(
      @PageableDefault(size = 20, sort = "index") Pageable pageable) {
    try {
      // 获取统计信息以确定总数
      String statsUrl = blockchainServiceUrl + "/api/blockchain/stats";
      Map<String, Object> stats = restTemplate.getForObject(statsUrl, Map.class);

      if (stats == null) {
        return ResponseEntity.ok(Result.error("BC001", "无法获取区块链统计信息"));
      }

      Integer totalBlocks = (Integer) stats.get("total_blocks");
      if (totalBlocks == null || totalBlocks == 0) {
        return ResponseEntity.ok(Result.success(Page.empty(pageable)));
      }

      // 计算分页参数
      int pageNumber = pageable.getPageNumber();
      int pageSize = pageable.getPageSize();
      int start = pageNumber * pageSize;
      int end = Math.min(start + pageSize, totalBlocks);

      // 获取区块数据（倒序，最新的在前面）
      List<BlockDTO> blocks = new ArrayList<>();
      for (int i = totalBlocks - 1 - start; i >= totalBlocks - end && i >= 0; i--) {
        String blockUrl = blockchainServiceUrl + "/api/blockchain/block/" + i;
        try {
          Map<String, Object> blockData = restTemplate.getForObject(blockUrl, Map.class);
          if (blockData != null) {
            BlockDTO block = convertToBlockDTO(blockData, false);
            blocks.add(block);
          }
        } catch (Exception e) {
          log.warn("Error fetching block {}: {}", i, e.getMessage());
        }
      }

      Page<BlockDTO> page = new PageImpl<>(blocks, pageable, totalBlocks);
      return ResponseEntity.ok(Result.success(page));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getBlocks: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "获取区块列表失败"));
    }
  }

  /**
   * 获取区块详情
   * 根据区块索引获取区块的完整信息，包括所有交易
   *
   * @param index 区块索引
   * @return 区块详情
   */
  @GetMapping("/blocks/{index}")
  @Operation(
      summary = "获取区块详情",
      description = "根据区块索引获取区块的完整信息，包括所有交易"
  )
  public ResponseEntity<Result<BlockDTO>> getBlockByIndex(
      @Parameter(description = "区块索引") @PathVariable Integer index) {
    try {
      String blockUrl = blockchainServiceUrl + "/api/blockchain/block/" + index;
      Map<String, Object> blockData = restTemplate.getForObject(blockUrl, Map.class);

      if (blockData == null) {
        return ResponseEntity.ok(Result.error("BC001", "区块不存在"));
      }

      BlockDTO block = convertToBlockDTO(blockData, true);
      return ResponseEntity.ok(Result.success(block));

    } catch (RestClientException e) {
      if (e.getMessage() != null && e.getMessage().contains("404")) {
        return ResponseEntity.ok(Result.error("BC001", "区块不存在"));
      }
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getBlockByIndex: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "获取区块详情失败"));
    }
  }

  /**
   * 获取交易详情
   * 根据知识ID获取交易的完整信息
   *
   * @param knowledgeId 知识ID
   * @return 交易详情
   */
  @GetMapping("/transactions/{knowledgeId}")
  @Operation(
      summary = "获取交易详情",
      description = "根据知识ID获取交易的完整信息"
  )
  public ResponseEntity<Result<Map<String, Object>>> getTransaction(
      @Parameter(description = "知识ID") @PathVariable Long knowledgeId) {
    try {
      String transactionUrl = blockchainServiceUrl + "/api/blockchain/transaction/" + knowledgeId;
      Map<String, Object> transactionData = restTemplate.getForObject(transactionUrl, Map.class);

      if (transactionData == null) {
        return ResponseEntity.ok(Result.error("BC002", "交易不存在"));
      }

      return ResponseEntity.ok(Result.success(transactionData));

    } catch (RestClientException e) {
      if (e.getMessage() != null && e.getMessage().contains("404")) {
        return ResponseEntity.ok(Result.error("BC002", "交易不存在"));
      }
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC002", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getTransaction: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC002", "获取交易详情失败"));
    }
  }

  /**
   * 搜索区块链
   * 支持按区块索引、交易ID、知识ID搜索
   *
   * @param searchType 搜索类型: block, transaction, knowledge
   * @param keyword 搜索关键词
   * @return 搜索结果
   */
  @GetMapping("/search")
  @Operation(
      summary = "搜索区块链",
      description = "支持按区块索引、知识ID搜索区块链数据"
  )
  public ResponseEntity<Result<Map<String, Object>>> search(
      @Parameter(description = "搜索类型: block, knowledge") 
      @RequestParam String searchType,
      @Parameter(description = "搜索关键词") 
      @RequestParam String keyword) {
    try {
      Map<String, Object> result = new HashMap<>();

      if ("block".equals(searchType)) {
        // 按区块索引搜索
        try {
          Integer blockIndex = Integer.parseInt(keyword);
          String blockUrl = blockchainServiceUrl + "/api/blockchain/block/" + blockIndex;
          Map<String, Object> blockData = restTemplate.getForObject(blockUrl, Map.class);

          if (blockData != null) {
            result.put("type", "block");
            result.put("data", convertToBlockDTO(blockData, true));
          } else {
            return ResponseEntity.ok(Result.error("BC001", "未找到匹配的区块"));
          }
        } catch (NumberFormatException e) {
          return ResponseEntity.ok(Result.error("BC001", "区块索引必须是数字"));
        }

      } else if ("knowledge".equals(searchType)) {
        // 按知识ID搜索
        try {
          Long knowledgeId = Long.parseLong(keyword);
          String transactionUrl = blockchainServiceUrl + "/api/blockchain/transaction/" + knowledgeId;
          Map<String, Object> transactionData = restTemplate.getForObject(transactionUrl, Map.class);

          if (transactionData != null) {
            result.put("type", "transaction");
            result.put("data", transactionData);
          } else {
            return ResponseEntity.ok(Result.error("BC002", "未找到匹配的交易"));
          }
        } catch (NumberFormatException e) {
          return ResponseEntity.ok(Result.error("BC002", "知识ID必须是数字"));
        }

      } else {
        return ResponseEntity.ok(Result.error("BC001", "不支持的搜索类型"));
      }

      return ResponseEntity.ok(Result.success(result));

    } catch (RestClientException e) {
      if (e.getMessage() != null && e.getMessage().contains("404")) {
        return ResponseEntity.ok(Result.error("BC001", "未找到匹配的结果"));
      }
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in search: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "搜索失败"));
    }
  }

  /**
   * 获取区块链统计信息
   * 返回区块链的统计数据，包括总区块数、总交易数、交易类型分布等
   *
   * @return 统计信息
   */
  @GetMapping("/statistics")
  @Operation(
      summary = "获取区块链统计信息",
      description = "获取区块链的统计数据，包括总区块数、总交易数、交易类型分布等"
  )
  public ResponseEntity<Result<BlockchainStatisticsDTO>> getStatistics() {
    try {
      String statsUrl = blockchainServiceUrl + "/api/blockchain/stats";
      Map<String, Object> stats = restTemplate.getForObject(statsUrl, Map.class);

      if (stats == null) {
        return ResponseEntity.ok(Result.error("BC001", "无法获取统计信息"));
      }

      BlockchainStatisticsDTO statistics = BlockchainStatisticsDTO.builder()
          .totalBlocks((Integer) stats.get("total_blocks"))
          .totalTransactions((Integer) stats.get("total_transactions"))
          .pendingTransactions((Integer) stats.get("pending_transactions"))
          .transactionTypes((Map<String, Integer>) stats.get("transaction_types"))
          .isValid((Boolean) stats.get("is_valid"))
          .build();

      return ResponseEntity.ok(Result.success(statistics));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getStatistics: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "获取统计信息失败"));
    }
  }

  /**
   * 验证内容
   * 验证知识内容的哈希值是否与区块链中存储的一致
   *
   * @param request 验证请求
   * @return 验证结果
   */
  @PostMapping("/verify")
  @Operation(
      summary = "验证内容",
      description = "验证知识内容的哈希值是否与区块链中存储的一致"
  )
  public ResponseEntity<Result<BlockchainVerifyResponse>> verifyContent(
      @RequestBody BlockchainVerifyResponse request) {
    try {
      String verifyUrl = blockchainServiceUrl + "/api/blockchain/verify";
      
      Map<String, Object> verifyRequest = new HashMap<>();
      verifyRequest.put("knowledge_id", request.getBlockIndex());
      verifyRequest.put("content_hash", request.getMessage());

      BlockchainVerifyResponse response = restTemplate.postForObject(
          verifyUrl, verifyRequest, BlockchainVerifyResponse.class);

      if (response == null) {
        return ResponseEntity.ok(Result.error("BC004", "验证失败"));
      }

      return ResponseEntity.ok(Result.success(response));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC004", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in verifyContent: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC004", "验证失败"));
    }
  }

  /**
   * 转换区块数据为DTO
   *
   * @param blockData 区块数据
   * @param includeTransactions 是否包含交易详情
   * @return BlockDTO
   */
  private BlockDTO convertToBlockDTO(Map<String, Object> blockData, boolean includeTransactions) {
    List<Map<String, Object>> transactionsData = 
        (List<Map<String, Object>>) blockData.get("transactions");

    List<TransactionDTO> transactions = null;
    if (includeTransactions && transactionsData != null) {
      transactions = transactionsData.stream()
          .map(this::convertToTransactionDTO)
          .collect(Collectors.toList());
    }

    return BlockDTO.builder()
        .index((Integer) blockData.get("index"))
        .timestamp((String) blockData.get("timestamp"))
        .transactions(transactions)
        .previousHash((String) blockData.get("previous_hash"))
        .hash((String) blockData.get("hash"))
        .merkleRoot((String) blockData.get("merkle_root"))
        .transactionsCount(transactionsData != null ? transactionsData.size() : 0)
        .build();
  }

  /**
   * 转换交易数据为DTO
   *
   * @param transactionData 交易数据
   * @return TransactionDTO
   */
  private TransactionDTO convertToTransactionDTO(Map<String, Object> transactionData) {
    Object knowledgeIdObj = transactionData.get("knowledge_id");
    Long knowledgeId = null;
    if (knowledgeIdObj instanceof Integer) {
      knowledgeId = ((Integer) knowledgeIdObj).longValue();
    } else if (knowledgeIdObj instanceof Long) {
      knowledgeId = (Long) knowledgeIdObj;
    }

    Object userIdObj = transactionData.get("user_id");
    Long userId = null;
    if (userIdObj instanceof Integer) {
      userId = ((Integer) userIdObj).longValue();
    } else if (userIdObj instanceof Long) {
      userId = (Long) userIdObj;
    }

    return TransactionDTO.builder()
        .type((String) transactionData.get("type"))
        .knowledgeId(knowledgeId)
        .userId(userId)
        .contentHash((String) transactionData.get("content_hash"))
        .metadata((Map<String, Object>) transactionData.get("metadata"))
        .timestamp((String) transactionData.get("timestamp"))
        .signature((String) transactionData.get("signature"))
        .publicKey((String) transactionData.get("public_key"))
        .build();
  }

  /**
   * 生成存证证书
   * 为已存证的知识内容生成PDF证书
   *
   * @param request 证书生成请求
   * @return 证书信息
   */
  @PostMapping("/certificates")
  @Operation(
      summary = "生成存证证书",
      description = "为已存证的知识内容生成PDF证书"
  )
  public ResponseEntity<Result<Map<String, Object>>> createCertificate(
      @RequestBody Map<String, Object> request) {
    try {
      String certificateUrl = blockchainServiceUrl + "/api/blockchain/certificates";
      Map<String, Object> response = restTemplate.postForObject(
          certificateUrl, request, Map.class);

      if (response == null) {
        return ResponseEntity.ok(Result.error("BC003", "证书生成失败"));
      }

      return ResponseEntity.ok(Result.success(response));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC003", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in createCertificate: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC003", "证书生成失败"));
    }
  }

  /**
   * 下载存证证书
   * 下载指定证书的PDF文件
   *
   * @param certificateId 证书ID
   * @return PDF文件
   */
  @GetMapping("/certificates/{certificateId}/download")
  @Operation(
      summary = "下载存证证书",
      description = "下载指定证书的PDF文件"
  )
  public ResponseEntity<?> downloadCertificate(
      @Parameter(description = "证书ID") @PathVariable String certificateId) {
    try {
      String downloadUrl = blockchainServiceUrl + "/api/blockchain/certificates/" 
          + certificateId + "/download";
      
      // 使用RestTemplate获取文件
      byte[] pdfBytes = restTemplate.getForObject(downloadUrl, byte[].class);

      if (pdfBytes == null || pdfBytes.length == 0) {
        return ResponseEntity.ok(Result.error("BC003", "证书文件不存在"));
      }

      return ResponseEntity.ok()
          .header("Content-Type", "application/pdf")
          .header("Content-Disposition", "attachment; filename=" + certificateId + ".pdf")
          .body(pdfBytes);

    } catch (RestClientException e) {
      if (e.getMessage() != null && e.getMessage().contains("404")) {
        return ResponseEntity.ok(Result.error("BC003", "证书不存在"));
      }
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC003", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in downloadCertificate: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC003", "下载证书失败"));
    }
  }

  /**
   * 验证证书
   * 验证证书的有效性
   *
   * @param certificateId 证书ID
   * @return 验证结果
   */
  @GetMapping("/certificates/{certificateId}/verify")
  @Operation(
      summary = "验证证书",
      description = "验证证书的有效性"
  )
  public ResponseEntity<Result<Map<String, Object>>> verifyCertificate(
      @Parameter(description = "证书ID") @PathVariable String certificateId) {
    try {
      String verifyUrl = blockchainServiceUrl + "/api/blockchain/certificates/" 
          + certificateId + "/verify";
      Map<String, Object> response = restTemplate.getForObject(verifyUrl, Map.class);

      if (response == null) {
        return ResponseEntity.ok(Result.error("BC003", "验证失败"));
      }

      return ResponseEntity.ok(Result.success(response));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC003", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in verifyCertificate: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC003", "验证证书失败"));
    }
  }

  /**
   * 根据知识ID获取证书信息
   * 查询指定知识内容的证书信息
   *
   * @param knowledgeId 知识ID
   * @return 证书信息
   */
  @GetMapping("/certificates/knowledge/{knowledgeId}")
  @Operation(
      summary = "根据知识ID获取证书信息",
      description = "查询指定知识内容的证书信息"
  )
  public ResponseEntity<Result<Map<String, Object>>> getCertificateByKnowledge(
      @Parameter(description = "知识ID") @PathVariable Long knowledgeId) {
    try {
      String certificateUrl = blockchainServiceUrl + "/api/blockchain/certificates/knowledge/" 
          + knowledgeId;
      Map<String, Object> response = restTemplate.getForObject(certificateUrl, Map.class);

      if (response == null) {
        return ResponseEntity.ok(Result.error("BC003", "未找到证书信息"));
      }

      return ResponseEntity.ok(Result.success(response));

    } catch (RestClientException e) {
      if (e.getMessage() != null && e.getMessage().contains("404")) {
        return ResponseEntity.ok(Result.error("BC003", "未找到证书信息"));
      }
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC003", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in getCertificateByKnowledge: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC003", "获取证书信息失败"));
    }
  }

  /**
   * 存证内容
   * 将知识内容存证到区块链
   *
   * @param request 存证请求
   * @return 存证结果
   */
  @PostMapping("/certify")
  @Operation(
      summary = "存证内容",
      description = "将知识内容存证到区块链"
  )
  public ResponseEntity<Result<Map<String, Object>>> certifyContent(
      @RequestBody Map<String, Object> request) {
    try {
      String certifyUrl = blockchainServiceUrl + "/api/blockchain/certify";
      Map<String, Object> response = restTemplate.postForObject(
          certifyUrl, request, Map.class);

      if (response == null) {
        return ResponseEntity.ok(Result.error("BC001", "存证失败"));
      }

      return ResponseEntity.ok(Result.success(response));

    } catch (RestClientException e) {
      log.error("Error calling blockchain service: {}", e.getMessage());
      return ResponseEntity.ok(Result.error("BC001", "区块链服务暂时不可用"));
    } catch (Exception e) {
      log.error("Unexpected error in certifyContent: {}", e.getMessage(), e);
      return ResponseEntity.ok(Result.error("BC001", "存证失败"));
    }
  }
}
