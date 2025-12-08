package com.example.educhain.service;

import com.example.educhain.dto.BlockchainVerifyResponse;

/** 区块链服务接口 用于与Python区块链服务进行交互 */
public interface BlockchainService {

  /**
   * 知识内容存证
   *
   * @param knowledgeId 知识内容ID
   * @param userId 用户ID
   * @param contentHash 内容哈希值
   * @return 交易ID（如果存证成功）
   */
  String certifyKnowledge(Long knowledgeId, Long userId, String contentHash);

  /**
   * 用户成就认证
   *
   * @param userId 用户ID
   * @param achievementType 成就类型
   * @param achievementHash 成就哈希值
   * @return 交易ID（如果认证成功）
   */
  String certifyAchievement(Long userId, String achievementType, String achievementHash);

  /**
   * 验证知识内容
   *
   * @param knowledgeId 知识内容ID
   * @param contentHash 内容哈希值
   * @return 验证结果
   */
  BlockchainVerifyResponse verifyKnowledge(Long knowledgeId, String contentHash);

  /**
   * 获取交易信息
   *
   * @param knowledgeId 知识内容ID
   * @return 交易信息（JSON格式）
   */
  Object getTransaction(Long knowledgeId);

  /**
   * 获取区块链信息
   *
   * @return 区块链信息（JSON格式）
   */
  Object getChainInfo();
}
