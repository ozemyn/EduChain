package com.example.educhain.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 哈希工具类
 * 用于计算内容哈希值，用于区块链存证
 */
public class HashUtil {

  private static final String ALGORITHM = "SHA-256";

  /**
   * 计算字符串的SHA-256哈希值
   *
   * @param input 输入字符串
   * @return 十六进制哈希值
   */
  public static String sha256(String input) {
    try {
      MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
      byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
      return bytesToHex(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("SHA-256 algorithm not found", e);
    }
  }

  /**
   * 计算知识内容的哈希值
   *
   * @param title 标题
   * @param content 内容
   * @return 内容哈希值
   */
  public static String calculateKnowledgeHash(String title, String content) {
    String combined = (title != null ? title : "") + (content != null ? content : "");
    return sha256(combined);
  }

  /**
   * 将字节数组转换为十六进制字符串
   *
   * @param bytes 字节数组
   * @return 十六进制字符串
   */
  private static String bytesToHex(byte[] bytes) {
    StringBuilder result = new StringBuilder();
    for (byte b : bytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}

