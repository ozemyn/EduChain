package com.example.educhain.service.impl;

import com.example.educhain.dto.BlockchainVerifyResponse;
import com.example.educhain.service.BlockchainService;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

/**
 * 区块链服务实现类
 * 通过HTTP调用Python区块链服务
 */
@Service
public class BlockchainServiceImpl implements BlockchainService {

  private static final Logger log = LoggerFactory.getLogger(BlockchainServiceImpl.class);

  @Value("${blockchain.service.url:http://localhost:8000}")
  private String blockchainServiceUrl;

  @Value("${blockchain.service.timeout:5000}")
  private int timeout;

  private final RestTemplate restTemplate;

  public BlockchainServiceImpl() {
    this.restTemplate = new RestTemplate();
  }

  @Override
  @Async
  public String certifyKnowledge(Long knowledgeId, Long userId, String contentHash) {
    try {
      String url = blockchainServiceUrl + "/api/blockchain/certify";

      Map<String, Object> request = new HashMap<>();
      request.put("type", "KNOWLEDGE_CERT");
      request.put("knowledge_id", knowledgeId);
      request.put("user_id", userId);
      request.put("content_hash", contentHash);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

      ResponseEntity<Map> response =
          restTemplate.postForEntity(url, entity, Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        Map<String, Object> body = response.getBody();
        Object transactionId = body.get("transaction_id");
        log.info(
            "Knowledge certified successfully: knowledgeId={}, transactionId={}",
            knowledgeId,
            transactionId);
        return transactionId != null ? transactionId.toString() : null;
      }

      log.warn("Blockchain service returned non-2xx status: {}", response.getStatusCode());
      return null;
    } catch (RestClientException e) {
      // 记录日志，但不影响主流程
      log.error("Error calling blockchain service for knowledge certification: {}", e.getMessage());
      return null;
    } catch (Exception e) {
      log.error("Unexpected error in certifyKnowledge: {}", e.getMessage(), e);
      return null;
    }
  }

  @Override
  @Async
  public String certifyAchievement(Long userId, String achievementType, String achievementHash) {
    try {
      String url = blockchainServiceUrl + "/api/blockchain/certify";

      Map<String, Object> request = new HashMap<>();
      request.put("type", "ACHIEVEMENT");
      request.put("user_id", userId);
      request.put("content_hash", achievementHash);
      Map<String, Object> metadata = new HashMap<>();
      metadata.put("achievement_type", achievementType);
      request.put("metadata", metadata);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

      ResponseEntity<Map> response =
          restTemplate.postForEntity(url, entity, Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        Map<String, Object> body = response.getBody();
        Object transactionId = body.get("transaction_id");
        log.info(
            "Achievement certified successfully: userId={}, achievementType={}, transactionId={}",
            userId,
            achievementType,
            transactionId);
        return transactionId != null ? transactionId.toString() : null;
      }

      log.warn("Blockchain service returned non-2xx status: {}", response.getStatusCode());
      return null;
    } catch (RestClientException e) {
      log.error(
          "Error calling blockchain service for achievement certification: {}", e.getMessage());
      return null;
    } catch (Exception e) {
      log.error("Unexpected error in certifyAchievement: {}", e.getMessage(), e);
      return null;
    }
  }

  @Override
  public BlockchainVerifyResponse verifyKnowledge(Long knowledgeId, String contentHash) {
    try {
      String url = blockchainServiceUrl + "/api/blockchain/verify";

      Map<String, Object> request = new HashMap<>();
      request.put("knowledge_id", knowledgeId);
      request.put("content_hash", contentHash);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

      ResponseEntity<BlockchainVerifyResponse> response =
          restTemplate.postForEntity(url, entity, BlockchainVerifyResponse.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        return response.getBody();
      }

      log.warn("Blockchain service returned non-2xx status: {}", response.getStatusCode());
      return BlockchainVerifyResponse.builder().isValid(false).build();
    } catch (RestClientException e) {
      log.error("Error calling blockchain service for verification: {}", e.getMessage());
      return BlockchainVerifyResponse.builder().isValid(false).build();
    } catch (Exception e) {
      log.error("Unexpected error in verifyKnowledge: {}", e.getMessage(), e);
      return BlockchainVerifyResponse.builder().isValid(false).build();
    }
  }

  @Override
  public Object getTransaction(Long knowledgeId) {
    try {
      String url = blockchainServiceUrl + "/api/blockchain/transaction/" + knowledgeId;
      ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        return response.getBody();
      }

      return null;
    } catch (RestClientException e) {
      log.error("Error getting transaction: {}", e.getMessage());
      return null;
    } catch (Exception e) {
      log.error("Unexpected error in getTransaction: {}", e.getMessage(), e);
      return null;
    }
  }

  @Override
  public Object getChainInfo() {
    try {
      String url = blockchainServiceUrl + "/api/blockchain/chain";
      ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        return response.getBody();
      }

      return null;
    } catch (RestClientException e) {
      log.error("Error getting chain info: {}", e.getMessage());
      return null;
    } catch (Exception e) {
      log.error("Unexpected error in getChainInfo: {}", e.getMessage(), e);
      return null;
    }
  }
}

