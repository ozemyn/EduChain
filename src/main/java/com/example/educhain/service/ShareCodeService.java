package com.example.educhain.service;

import com.example.educhain.util.Base58Encoder;
import com.example.educhain.util.SnowflakeIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 分享码生成和解析服务
 */
@Service
public class ShareCodeService {
    
    @Autowired
    private SnowflakeIdGenerator idGenerator;
    
    @Autowired
    private Base58Encoder base58Encoder;
    
    // 业务前缀，标识EduChain平台
    private static final String PREFIX = "EK";
    
    /**
     * 生成分享码
     * 格式: EK + Base58编码的雪花算法ID
     */
    public String generateShareCode() {
        long id = idGenerator.nextId();
        String encoded = base58Encoder.encode(id);
        return PREFIX + encoded;
    }
    
    /**
     * 解析分享码获取原始ID
     */
    public Long parseShareCode(String shareCode) {
        if (shareCode == null || !shareCode.startsWith(PREFIX)) {
            throw new IllegalArgumentException("无效的分享码格式");
        }
        
        String encoded = shareCode.substring(PREFIX.length());
        if (encoded.isEmpty()) {
            throw new IllegalArgumentException("分享码不能为空");
        }
        
        try {
            return base58Encoder.decode(encoded);
        } catch (Exception e) {
            throw new IllegalArgumentException("无效的分享码: " + shareCode, e);
        }
    }
    
    /**
     * 验证分享码格式是否正确
     */
    public boolean isValidShareCode(String shareCode) {
        if (shareCode == null || !shareCode.startsWith(PREFIX)) {
            return false;
        }
        
        String encoded = shareCode.substring(PREFIX.length());
        if (encoded.isEmpty()) {
            return false;
        }
        
        return base58Encoder.isValidBase58(encoded);
    }
    
    /**
     * 获取分享码前缀
     */
    public String getPrefix() {
        return PREFIX;
    }
}