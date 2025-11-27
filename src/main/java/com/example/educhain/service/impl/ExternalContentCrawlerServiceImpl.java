package com.example.educhain.service.impl;

import com.example.educhain.dto.ExternalContentDTO;
import com.example.educhain.dto.ExternalSourceDTO;
import com.example.educhain.entity.ExternalContent;
import com.example.educhain.entity.ExternalSource;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.ExternalContentRepository;
import com.example.educhain.repository.ExternalSourceRepository;
import com.example.educhain.service.ExternalContentCrawlerService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 外部内容抓取服务实现类
 */
@Service
@Transactional
public class ExternalContentCrawlerServiceImpl implements ExternalContentCrawlerService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalContentCrawlerServiceImpl.class);
    
    private static final int CONNECT_TIMEOUT = 10000; // 10秒连接超时
    private static final int READ_TIMEOUT = 30000; // 30秒读取超时
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

    @Autowired
    private ExternalSourceRepository externalSourceRepository;

    @Autowired
    private ExternalContentRepository externalContentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public ExternalSourceDTO createExternalSource(ExternalSourceDTO sourceDTO) {
        logger.info("创建外部数据源: {}", sourceDTO.getName());
        
        // 检查URL是否已存在
        if (externalSourceRepository.existsBySourceUrl(sourceDTO.getSourceUrl())) {
            throw new BusinessException("DUPLICATE_SOURCE_URL", "数据源URL已存在");
        }
        
        ExternalSource source = new ExternalSource();
        source.setName(sourceDTO.getName());
        source.setSourceUrl(sourceDTO.getSourceUrl());
        source.setSourceType(sourceDTO.getSourceType());
        source.setDescription(sourceDTO.getDescription());
        source.setCrawlFrequency(sourceDTO.getCrawlFrequency());
        source.setSelectorConfig(sourceDTO.getSelectorConfig());
        source.setHeadersConfig(sourceDTO.getHeadersConfig());
        source.setStatus(sourceDTO.getStatus());
        
        source = externalSourceRepository.save(source);
        return ExternalSourceDTO.fromEntity(source);
    }

    @Override
    public ExternalSourceDTO updateExternalSource(Long sourceId, ExternalSourceDTO sourceDTO) {
        logger.info("更新外部数据源: {}", sourceId);
        
        ExternalSource source = externalSourceRepository.findById(sourceId)
                .orElseThrow(() -> new BusinessException("SOURCE_NOT_FOUND", "数据源不存在"));
        
        source.setName(sourceDTO.getName());
        source.setDescription(sourceDTO.getDescription());
        source.setCrawlFrequency(sourceDTO.getCrawlFrequency());
        source.setSelectorConfig(sourceDTO.getSelectorConfig());
        source.setHeadersConfig(sourceDTO.getHeadersConfig());
        source.setStatus(sourceDTO.getStatus());
        
        source = externalSourceRepository.save(source);
        return ExternalSourceDTO.fromEntity(source);
    }

    @Override
    public void deleteExternalSource(Long sourceId) {
        logger.info("删除外部数据源: {}", sourceId);
        
        ExternalSource source = externalSourceRepository.findById(sourceId)
                .orElseThrow(() -> new BusinessException("SOURCE_NOT_FOUND", "数据源不存在"));
        
        // 删除相关的外部内容
        // 这里可以选择软删除或硬删除
        source.setStatus(0); // 禁用数据源
        externalSourceRepository.save(source);
    }

    @Override
    @Transactional(readOnly = true)
    public ExternalSourceDTO getExternalSource(Long sourceId) {
        ExternalSource source = externalSourceRepository.findById(sourceId)
                .orElseThrow(() -> new BusinessException("SOURCE_NOT_FOUND", "数据源不存在"));
        
        return ExternalSourceDTO.fromEntity(source);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalSourceDTO> getAllExternalSources(Pageable pageable) {
        Page<ExternalSource> sources = externalSourceRepository.findAll(pageable);
        return sources.map(ExternalSourceDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExternalSourceDTO> getActiveExternalSources() {
        List<ExternalSource> sources = externalSourceRepository.findByStatus(1);
        return sources.stream().map(ExternalSourceDTO::fromEntity).toList();
    }

    @Override
    @Async
    public void crawlExternalSource(Long sourceId) {
        logger.info("开始抓取外部数据源: {}", sourceId);
        
        ExternalSource source = externalSourceRepository.findById(sourceId)
                .orElseThrow(() -> new BusinessException("SOURCE_NOT_FOUND", "数据源不存在"));
        
        if (source.getStatus() != 1) {
            logger.warn("数据源已禁用，跳过抓取: {}", sourceId);
            return;
        }
        
        try {
            crawlSourceContent(source);
            source.recordCrawlSuccess();
            logger.info("数据源抓取成功: {}", sourceId);
        } catch (Exception e) {
            logger.error("数据源抓取失败: " + sourceId, e);
            source.recordCrawlFailure(e.getMessage());
        } finally {
            externalSourceRepository.save(source);
        }
    }

    @Override
    @Async
    public void crawlAllSources() {
        logger.info("开始抓取所有需要更新的数据源");
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(1); // 默认1小时检查一次
        List<ExternalSource> sourcesToCrawl = externalSourceRepository.findSourcesNeedingCrawl(cutoffTime);
        
        logger.info("找到 {} 个需要抓取的数据源", sourcesToCrawl.size());
        
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        
        for (ExternalSource source : sourcesToCrawl) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                crawlExternalSource(source.getId());
            });
            futures.add(future);
        }
        
        // 等待所有抓取任务完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        logger.info("所有数据源抓取任务完成");
    }

    @Override
    public ExternalContentDTO crawlSingleUrl(String url, Long sourceId) {
        logger.info("抓取单个URL: {}", url);
        
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(READ_TIMEOUT)
                    .get();
            
            ExternalContent content = extractContentFromDocument(doc, url, sourceId);
            if (content != null) {
                // 检查是否已存在
                if (!externalContentRepository.existsByContentHash(content.getContentHash())) {
                    content = externalContentRepository.save(content);
                    return ExternalContentDTO.fromEntity(content);
                } else {
                    logger.info("内容已存在，跳过保存: {}", url);
                }
            }
        } catch (Exception e) {
            logger.error("抓取URL失败: " + url, e);
            throw new BusinessException("CRAWL_FAILED", "抓取内容失败: " + e.getMessage());
        }
        
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public ExternalContentDTO getExternalContent(Long contentId) {
        ExternalContent content = externalContentRepository.findById(contentId)
                .orElseThrow(() -> new BusinessException("CONTENT_NOT_FOUND", "内容不存在"));
        
        return ExternalContentDTO.fromEntity(content);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalContentDTO> searchExternalContent(String keyword, Pageable pageable) {
        Page<ExternalContent> contents = externalContentRepository.searchByKeyword(keyword, 1, pageable);
        return contents.map(ExternalContentDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalContentDTO> getContentBySource(Long sourceId, Pageable pageable) {
        Page<ExternalContent> contents = externalContentRepository.findBySourceIdAndStatus(sourceId, 1, pageable);
        return contents.map(ExternalContentDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalContentDTO> getContentByCategory(String category, Pageable pageable) {
        Page<ExternalContent> contents = externalContentRepository.findByCategoryAndStatus(category, 1, pageable);
        return contents.map(ExternalContentDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalContentDTO> getHighQualityContent(Double minScore, Pageable pageable) {
        Page<ExternalContent> contents = externalContentRepository.findHighQualityContent(minScore, 1, pageable);
        return contents.map(ExternalContentDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExternalContentDTO> getLatestContent(Pageable pageable) {
        Page<ExternalContent> contents = externalContentRepository.findLatestContent(1, pageable);
        return contents.map(ExternalContentDTO::fromEntity);
    }

    @Override
    public void deleteExternalContent(Long contentId) {
        logger.info("删除外部内容: {}", contentId);
        
        ExternalContent content = externalContentRepository.findById(contentId)
                .orElseThrow(() -> new BusinessException("CONTENT_NOT_FOUND", "内容不存在"));
        
        content.setStatus(-1); // 标记为删除
        externalContentRepository.save(content);
    }

    @Override
    public int removeDuplicateContent() {
        logger.info("开始清理重复内容");
        
        List<ExternalContent> duplicates = externalContentRepository.findDuplicateContent(1);
        int removedCount = 0;
        
        Map<String, ExternalContent> uniqueContents = new HashMap<>();
        
        for (ExternalContent content : duplicates) {
            String key = content.getTitle() + "|" + content.getAuthor();
            
            if (uniqueContents.containsKey(key)) {
                // 保留质量分数更高的内容
                ExternalContent existing = uniqueContents.get(key);
                if (content.getQualityScore() > existing.getQualityScore()) {
                    existing.setStatus(-1);
                    externalContentRepository.save(existing);
                    uniqueContents.put(key, content);
                } else {
                    content.setStatus(-1);
                    externalContentRepository.save(content);
                }
                removedCount++;
            } else {
                uniqueContents.put(key, content);
            }
        }
        
        logger.info("清理重复内容完成，删除了 {} 条重复内容", removedCount);
        return removedCount;
    }

    @Override
    public void updateContentQualityScores() {
        logger.info("开始更新内容质量分数");
        
        int pageSize = 100;
        int pageNumber = 0;
        Page<ExternalContent> page;
        
        do {
            page = externalContentRepository.findByStatus(1, PageRequest.of(pageNumber, pageSize));
            
            for (ExternalContent content : page.getContent()) {
                content.calculateQualityScore();
            }
            
            externalContentRepository.saveAll(page.getContent());
            pageNumber++;
            
        } while (page.hasNext());
        
        logger.info("内容质量分数更新完成");
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCrawlStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // 数据源统计
        Object[] sourceStats = externalSourceRepository.getSourceStatistics();
        if (sourceStats != null && sourceStats.length >= 4) {
            stats.put("totalSources", sourceStats[0]);
            stats.put("totalCrawled", sourceStats[1]);
            stats.put("totalSuccess", sourceStats[2]);
            stats.put("totalFailed", sourceStats[3]);
        }
        
        // 按类型统计数据源
        List<Object[]> sourceTypeStats = externalSourceRepository.countBySourceType();
        Map<String, Long> sourceTypeMap = new HashMap<>();
        for (Object[] stat : sourceTypeStats) {
            sourceTypeMap.put((String) stat[0], (Long) stat[1]);
        }
        stats.put("sourcesByType", sourceTypeMap);
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getContentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // 内容统计
        Object[] contentStats = externalContentRepository.getContentStatistics(1);
        if (contentStats != null && contentStats.length >= 4) {
            stats.put("totalContent", contentStats[0]);
            stats.put("avgQualityScore", contentStats[1]);
            stats.put("totalWords", contentStats[2]);
            stats.put("avgReadingTime", contentStats[3]);
        }
        
        // 按分类统计内容
        List<Object[]> categoryStats = externalContentRepository.countByCategory(1);
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] stat : categoryStats) {
            if (stat[0] != null) {
                categoryMap.put((String) stat[0], (Long) stat[1]);
            }
        }
        stats.put("contentByCategory", categoryMap);
        
        // 按语言统计内容
        List<Object[]> languageStats = externalContentRepository.countByLanguage(1);
        Map<String, Long> languageMap = new HashMap<>();
        for (Object[] stat : languageStats) {
            if (stat[0] != null) {
                languageMap.put((String) stat[0], (Long) stat[1]);
            }
        }
        stats.put("contentByLanguage", languageMap);
        
        return stats;
    }

    @Override
    public boolean validateSourceConfiguration(ExternalSourceDTO sourceDTO) {
        try {
            // 验证URL格式
            if (sourceDTO.getSourceUrl() == null || !sourceDTO.getSourceUrl().startsWith("http")) {
                return false;
            }
            
            // 验证选择器配置
            if (sourceDTO.getSelectorConfig() != null) {
                objectMapper.readTree(sourceDTO.getSelectorConfig());
            }
            
            // 验证请求头配置
            if (sourceDTO.getHeadersConfig() != null) {
                objectMapper.readTree(sourceDTO.getHeadersConfig());
            }
            
            return true;
        } catch (Exception e) {
            logger.error("数据源配置验证失败", e);
            return false;
        }
    }

    @Override
    public boolean testSourceConnection(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(CONNECT_TIMEOUT)
                    .get();
            
            return doc != null && doc.title() != null;
        } catch (Exception e) {
            logger.error("测试数据源连接失败: " + url, e);
            return false;
        }
    }

    @Override
    public void toggleSourceStatus(Long sourceId, boolean enabled) {
        ExternalSource source = externalSourceRepository.findById(sourceId)
                .orElseThrow(() -> new BusinessException("SOURCE_NOT_FOUND", "数据源不存在"));
        
        source.setStatus(enabled ? 1 : 0);
        externalSourceRepository.save(source);
        
        logger.info("数据源状态已更新: {} -> {}", sourceId, enabled ? "启用" : "禁用");
    }

    @Override
    public int cleanupExpiredContent(int daysOld) {
        logger.info("开始清理 {} 天前的过期内容", daysOld);
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(daysOld);
        List<ExternalContent> expiredContents = externalContentRepository
                .findContentNeedingUpdate(1, cutoffTime);
        
        int cleanedCount = 0;
        for (ExternalContent content : expiredContents) {
            content.setStatus(-1);
            cleanedCount++;
        }
        
        if (cleanedCount > 0) {
            externalContentRepository.saveAll(expiredContents);
        }
        
        logger.info("清理过期内容完成，删除了 {} 条过期内容", cleanedCount);
        return cleanedCount;
    }

    /**
     * 抓取数据源内容
     */
    private void crawlSourceContent(ExternalSource source) throws IOException {
        logger.info("开始抓取数据源内容: {}", source.getName());
        
        Document doc = Jsoup.connect(source.getSourceUrl())
                .userAgent(USER_AGENT)
                .timeout(READ_TIMEOUT)
                .get();
        
        // 解析选择器配置
        Map<String, String> selectors = parseSelectorsConfig(source.getSelectorConfig());
        
        // 提取内容链接
        Elements linkElements = doc.select(selectors.getOrDefault("links", "a[href]"));
        
        int crawledCount = 0;
        for (Element linkElement : linkElements) {
            try {
                String href = linkElement.absUrl("href");
                if (href != null && !href.isEmpty() && !externalContentRepository.existsByOriginalUrl(href)) {
                    ExternalContent content = crawlSingleContent(href, source.getId());
                    if (content != null) {
                        externalContentRepository.save(content);
                        crawledCount++;
                    }
                }
                
                // 限制每次抓取的数量
                if (crawledCount >= 50) {
                    break;
                }
            } catch (Exception e) {
                logger.warn("抓取单个内容失败: {}", e.getMessage());
            }
        }
        
        logger.info("数据源内容抓取完成: {}，成功抓取 {} 条内容", source.getName(), crawledCount);
    }

    /**
     * 抓取单个内容
     */
    private ExternalContent crawlSingleContent(String url, Long sourceId) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(READ_TIMEOUT)
                    .get();
            
            return extractContentFromDocument(doc, url, sourceId);
        } catch (Exception e) {
            logger.warn("抓取单个内容失败: {} - {}", url, e.getMessage());
            return null;
        }
    }

    /**
     * 从文档中提取内容
     */
    private ExternalContent extractContentFromDocument(Document doc, String url, Long sourceId) {
        try {
            ExternalContent content = new ExternalContent();
            content.setSourceId(sourceId);
            content.setOriginalUrl(url);
            
            // 提取标题
            String title = doc.title();
            if (title == null || title.trim().isEmpty()) {
                Element h1 = doc.selectFirst("h1");
                title = h1 != null ? h1.text() : "无标题";
            }
            content.setTitle(title.length() > 200 ? title.substring(0, 200) : title);
            
            // 提取正文内容
            String bodyText = extractMainContent(doc);
            content.setContent(bodyText);
            
            // 提取作者
            String author = extractAuthor(doc);
            content.setAuthor(author);
            
            // 提取图片
            String imageUrl = extractMainImage(doc);
            content.setImageUrl(imageUrl);
            
            // 提取发布时间
            LocalDateTime publishedAt = extractPublishTime(doc);
            content.setPublishedAt(publishedAt);
            
            // 生成内容哈希
            content.setContentHash(content.generateContentHash());
            
            // 计算相关指标
            content.calculateWordCount();
            content.calculateReadingTime();
            content.generateSummary();
            content.calculateQualityScore();
            
            return content;
        } catch (Exception e) {
            logger.error("提取内容失败: " + url, e);
            return null;
        }
    }

    /**
     * 提取主要内容
     */
    private String extractMainContent(Document doc) {
        // 尝试多种选择器提取正文
        String[] contentSelectors = {
            "article", ".content", ".post-content", ".entry-content",
            ".article-content", "main", ".main-content", "#content"
        };
        
        for (String selector : contentSelectors) {
            Element contentElement = doc.selectFirst(selector);
            if (contentElement != null) {
                return contentElement.text();
            }
        }
        
        // 如果没有找到特定的内容区域，使用body
        Element body = doc.body();
        return body != null ? body.text() : "";
    }

    /**
     * 提取作者信息
     */
    private String extractAuthor(Document doc) {
        String[] authorSelectors = {
            ".author", ".by-author", ".post-author", "[rel=author]",
            ".article-author", ".writer", ".byline"
        };
        
        for (String selector : authorSelectors) {
            Element authorElement = doc.selectFirst(selector);
            if (authorElement != null) {
                return authorElement.text();
            }
        }
        
        // 尝试从meta标签提取
        Element metaAuthor = doc.selectFirst("meta[name=author]");
        if (metaAuthor != null) {
            return metaAuthor.attr("content");
        }
        
        return null;
    }

    /**
     * 提取主图片
     */
    private String extractMainImage(Document doc) {
        // 尝试从meta标签提取
        Element ogImage = doc.selectFirst("meta[property=og:image]");
        if (ogImage != null) {
            return ogImage.attr("content");
        }
        
        // 尝试从文章中的第一张图片
        Element firstImg = doc.selectFirst("article img, .content img, .post-content img");
        if (firstImg != null) {
            return firstImg.absUrl("src");
        }
        
        return null;
    }

    /**
     * 提取发布时间
     */
    private LocalDateTime extractPublishTime(Document doc) {
        // 尝试从meta标签提取
        Element publishedTime = doc.selectFirst("meta[property=article:published_time]");
        if (publishedTime != null) {
            return parseDateTime(publishedTime.attr("content"));
        }
        
        // 尝试从time标签提取
        Element timeElement = doc.selectFirst("time[datetime]");
        if (timeElement != null) {
            return parseDateTime(timeElement.attr("datetime"));
        }
        
        // 尝试从class名称中提取
        Element dateElement = doc.selectFirst(".date, .publish-date, .post-date");
        if (dateElement != null) {
            return parseDateTime(dateElement.text());
        }
        
        return null;
    }

    /**
     * 解析日期时间
     */
    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        try {
            // 尝试多种日期格式
            String[] patterns = {
                "yyyy-MM-dd'T'HH:mm:ss",
                "yyyy-MM-dd HH:mm:ss",
                "yyyy-MM-dd",
                "yyyy/MM/dd",
                "MM/dd/yyyy"
            };
            
            for (String pattern : patterns) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
                    return LocalDateTime.parse(dateStr, formatter);
                } catch (Exception ignored) {
                    // 继续尝试下一个格式
                }
            }
        } catch (Exception e) {
            logger.warn("解析日期失败: {}", dateStr);
        }
        
        return null;
    }

    /**
     * 解析选择器配置
     */
    private Map<String, String> parseSelectorsConfig(String selectorConfig) {
        Map<String, String> selectors = new HashMap<>();
        
        if (selectorConfig != null && !selectorConfig.trim().isEmpty()) {
            try {
                JsonNode configNode = objectMapper.readTree(selectorConfig);
                configNode.fields().forEachRemaining(entry -> {
                    selectors.put(entry.getKey(), entry.getValue().asText());
                });
            } catch (Exception e) {
                logger.warn("解析选择器配置失败: {}", e.getMessage());
            }
        }
        
        return selectors;
    }
}