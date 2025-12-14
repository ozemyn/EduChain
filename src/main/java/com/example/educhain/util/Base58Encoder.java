package com.example.educhain.util;

import org.springframework.stereotype.Component;

/**
 * Base58编码工具类
 * 用于将雪花算法生成的ID编码为可读字符串
 */
@Component
public class Base58Encoder {
    
    // Base58字符集（去除容易混淆的字符：0、O、I、l）
    private static final String ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    private static final int BASE = ALPHABET.length();
    
    /**
     * 编码长整型为Base58字符串
     */
    public String encode(long num) {
        if (num == 0) {
            return String.valueOf(ALPHABET.charAt(0));
        }
        
        StringBuilder sb = new StringBuilder();
        while (num > 0) {
            sb.insert(0, ALPHABET.charAt((int)(num % BASE)));
            num /= BASE;
        }
        return sb.toString();
    }
    
    /**
     * 解码Base58字符串为长整型
     */
    public long decode(String str) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException("输入字符串不能为空");
        }
        
        long result = 0;
        for (char c : str.toCharArray()) {
            int index = ALPHABET.indexOf(c);
            if (index == -1) {
                throw new IllegalArgumentException("无效的Base58字符: " + c);
            }
            result = result * BASE + index;
        }
        return result;
    }
    
    /**
     * 验证字符串是否为有效的Base58编码
     */
    public boolean isValidBase58(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        
        for (char c : str.toCharArray()) {
            if (ALPHABET.indexOf(c) == -1) {
                return false;
            }
        }
        return true;
    }
}