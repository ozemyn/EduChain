package com.example.educhain.service;

import com.example.educhain.dto.ExternalContentDTO;
import com.example.educhain.dto.ExternalSourceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * 外部内容抓取服务接口
 */
public interface ExternalContentCrawlerService {

    /**
     * 创建外部数据源
     */
    ExternalSourceDTO createExternalSource(ExternalSourceDTO sourceDTO);

    /**
     * 更新外部数据源
     */
    ExternalSourceDTO updateExternalSource(Long sourceId, ExternalSourceDTO sourceDTO);

    /**
     * 删除外部数据源
     */
    void deleteExternalSource(Long sourceId);

    /**
     * 获取外部数据源
     */
    ExternalSourceDTO getExternalSource(Long sourceId);

    /**
     * 获取所有外部数据源
     */
    Page<ExternalSourceDTO> getAllExternalSources(Pageable pageable);

    /**
     * 获取启用的外部数据源
     */
    List<ExternalSourceDTO> getActiveExternalSources();

    /**
     * 手动抓取指定数据源
     */
    void crawlExternalSource(Long sourceId);

    /**
     * 抓取所有需要更新的数据源
     */
    void crawlAllSources();

    /**
     * 抓取单个URL的内容
     */
    ExternalContentDTO crawlSingleUrl(String url, Long sourceId);

    /**
     * 获取外部内容
     */
    ExternalContentDTO getExternalContent(Long contentId);

    /**
     * 搜索外部内容
     */
    Page<ExternalContentDTO> searchExternalContent(String keyword, Pageable pageable);

    /**
     * 根据数据源获取内容
     */
    Page<ExternalContentDTO> getContentBySource(Long sourceId, Pageable pageable);

    /**
     * 根据分类获取内容
     */
    Page<ExternalContentDTO> getContentByCategory(String category, Pageable pageable);

    /**
     * 获取高质量内容
     */
    Page<ExternalContentDTO> getHighQualityContent(Double minScore, Pageable pageable);

    /**
     * 获取最新内容
     */
    Page<ExternalContentDTO> getLatestContent(Pageable pageable);

    /**
     * 删除外部内容
     */
    void deleteExternalContent(Long contentId);

    /**
     * 批量删除重复内容
     */
    int removeDuplicateContent();

    /**
     * 更新内容质量分数
     */
    void updateContentQualityScores();

    /**
     * 获取抓取统计信息
     */
    Map<String, Object> getCrawlStatistics();

    /**
     * 获取内容统计信息
     */
    Map<String, Object> getContentStatistics();

    /**
     * 验证数据源配置
     */
    boolean validateSourceConfiguration(ExternalSourceDTO sourceDTO);

    /**
     * 测试数据源连接
     */
    boolean testSourceConnection(String url);

    /**
     * 启用/禁用数据源
     */
    void toggleSourceStatus(Long sourceId, boolean enabled);

    /**
     * 清理过期内容
     */
    int cleanupExpiredContent(int daysOld);
}