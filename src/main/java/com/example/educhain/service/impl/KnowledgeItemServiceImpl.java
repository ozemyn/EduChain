package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.*;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.*;
import com.example.educhain.service.FileUploadService;
import com.example.educhain.service.KnowledgeItemService;
import com.example.educhain.util.PermissionChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.github.difflib.DiffUtils;
import com.github.difflib.patch.Patch;

/**
 * 知识内容服务实现类
 */
@Service
@Transactional
public class KnowledgeItemServiceImpl implements KnowledgeItemService {

    private static final Logger logger = LoggerFactory.getLogger(KnowledgeItemServiceImpl.class);

    @Autowired
    private KnowledgeItemRepository knowledgeItemRepository;

    @Autowired
    private KnowledgeStatsRepository knowledgeStatsRepository;

    @Autowired
    private KnowledgeVersionRepository knowledgeVersionRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserInteractionRepository userInteractionRepository;

    @Autowired
    private PermissionChecker permissionChecker;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @Override
    public KnowledgeItemDTO create(CreateKnowledgeRequest request, Long uploaderId) {
        validateCreateRequest(request, uploaderId);
        
        // 创建知识内容实体
        KnowledgeItem knowledgeItem = new KnowledgeItem();
        knowledgeItem.setTitle(request.getTitle());
        knowledgeItem.setContent(request.getContent());
        knowledgeItem.setType(request.getType());
        knowledgeItem.setLinkUrl(request.getLinkUrl());
        knowledgeItem.setUploaderId(uploaderId);
        knowledgeItem.setCategoryId(request.getCategoryId());
        knowledgeItem.setStatus(request.getStatus());
        
        // 处理媒体URL
        if (request.getMediaUrls() != null && !request.getMediaUrls().isEmpty()) {
            knowledgeItem.setMediaUrls(new ArrayList<>(request.getMediaUrls()));
        }
        
        // 处理标签
        String tags = processTagsFromRequest(request);
        knowledgeItem.setTags(tags);
        
        // 保存知识内容
        KnowledgeItem savedItem = knowledgeItemRepository.save(knowledgeItem);
        
        // 创建统计记录
        createKnowledgeStats(savedItem.getId());
        
        // 创建版本历史
        createVersionHistory(savedItem, uploaderId, KnowledgeVersion.ChangeType.CREATE, "创建知识内容");
        
        // 处理标签关联
        processTagAssociation(savedItem, null, tags);
        
        logger.info("Knowledge item created: {} by user {}", savedItem.getId(), uploaderId);
        
        return convertToDTO(savedItem);
    }

    @Override
    public KnowledgeItemDTO createWithFiles(CreateKnowledgeRequest request, List<MultipartFile> files, Long uploaderId) {
        // 先创建知识内容
        KnowledgeItemDTO knowledgeDTO = create(request, uploaderId);
        
        // 上传文件并关联到知识内容
        if (files != null && !files.isEmpty()) {
            List<FileUpload> uploadedFiles = fileUploadService.uploadFiles(files, uploaderId, knowledgeDTO.getId(), "知识内容附件");
            
            // 更新媒体URL
            List<String> mediaUrls = uploadedFiles.stream()
                    .map(FileUpload::getFileUrl)
                    .collect(Collectors.toList());
            
            if (knowledgeDTO.getMediaUrls() != null) {
                mediaUrls.addAll(knowledgeDTO.getMediaUrls());
            }
            
            // 更新知识内容的媒体URL
            KnowledgeItem knowledgeItem = knowledgeItemRepository.findById(knowledgeDTO.getId())
                    .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
            knowledgeItem.setMediaUrls(mediaUrls);
            knowledgeItemRepository.save(knowledgeItem);
            
            knowledgeDTO.setMediaUrls(mediaUrls);
        }
        
        return knowledgeDTO;
    }

    @Override
    public KnowledgeItemDTO update(Long id, UpdateKnowledgeRequest request, Long editorId) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findByIdAndStatus(id, 1)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        // 检查权限
        validateUpdatePermission(knowledgeItem, editorId);
        
        // 保存旧的标签信息用于后续处理
        String oldTags = knowledgeItem.getTags();
        
        // 更新字段
        boolean hasChanges = updateKnowledgeItemFields(knowledgeItem, request);
        
        if (hasChanges) {
            // 保存更新
            KnowledgeItem updatedItem = knowledgeItemRepository.save(knowledgeItem);
            
            // 创建版本历史
            String changeSummary = request.getChangeSummary() != null ? request.getChangeSummary() : "更新知识内容";
            createVersionHistory(updatedItem, editorId, KnowledgeVersion.ChangeType.UPDATE, changeSummary);
            
            // 处理标签关联变更
            processTagAssociation(updatedItem, oldTags, updatedItem.getTags());
            
            logger.info("Knowledge item updated: {} by user {}", id, editorId);
        }
        
        return convertToDTO(knowledgeItem);
    }

    @Override
    public KnowledgeItemDTO updateWithFiles(Long id, UpdateKnowledgeRequest request, List<MultipartFile> files, Long editorId) {
        // 先更新知识内容
        KnowledgeItemDTO knowledgeDTO = update(id, request, editorId);
        
        // 上传新文件
        if (files != null && !files.isEmpty()) {
            List<FileUpload> uploadedFiles = fileUploadService.uploadFiles(files, editorId, id, "知识内容附件");
            
            // 更新媒体URL
            List<String> newMediaUrls = uploadedFiles.stream()
                    .map(FileUpload::getFileUrl)
                    .collect(Collectors.toList());
            
            List<String> existingUrls = knowledgeDTO.getMediaUrls() != null ? 
                    new ArrayList<>(knowledgeDTO.getMediaUrls()) : new ArrayList<>();
            existingUrls.addAll(newMediaUrls);
            
            // 更新知识内容的媒体URL
            KnowledgeItem knowledgeItem = knowledgeItemRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
            knowledgeItem.setMediaUrls(existingUrls);
            knowledgeItemRepository.save(knowledgeItem);
            
            knowledgeDTO.setMediaUrls(existingUrls);
        }
        
        return knowledgeDTO;
    }

    @Override
    public void delete(Long id, Long operatorId) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findByIdAndStatus(id, 1)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        // 检查权限
        validateDeletePermission(knowledgeItem, operatorId);
        
        // 软删除
        knowledgeItem.setStatus(0);
        knowledgeItemRepository.save(knowledgeItem);
        
        // 创建版本历史
        createVersionHistory(knowledgeItem, operatorId, KnowledgeVersion.ChangeType.DELETE, "删除知识内容");
        
        // 处理标签关联（减少使用次数）
        processTagAssociation(knowledgeItem, knowledgeItem.getTags(), null);
        
        logger.info("Knowledge item deleted: {} by user {}", id, operatorId);
    }

    @Override
    public void batchDelete(List<Long> ids, Long operatorId) {
        for (Long id : ids) {
            try {
                delete(id, operatorId);
            } catch (Exception e) {
                logger.error("Failed to delete knowledge item {}: {}", id, e.getMessage());
            }
        }
    }

    @Override
    public void restore(Long id, Long operatorId) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findById(id)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        if (knowledgeItem.getStatus() != 0) {
            throw new BusinessException("KNOWLEDGE_NOT_DELETED", "知识内容未被删除");
        }
        
        // 检查权限
        validateDeletePermission(knowledgeItem, operatorId);
        
        // 恢复
        knowledgeItem.setStatus(1);
        knowledgeItemRepository.save(knowledgeItem);
        
        // 创建版本历史
        createVersionHistory(knowledgeItem, operatorId, KnowledgeVersion.ChangeType.RESTORE, "恢复知识内容");
        
        // 处理标签关联（增加使用次数）
        processTagAssociation(knowledgeItem, null, knowledgeItem.getTags());
        
        logger.info("Knowledge item restored: {} by user {}", id, operatorId);
    }

    @Override
    @Transactional(readOnly = true)
    public KnowledgeItemDTO findById(Long id) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findByIdAndStatus(id, 1)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        return convertToDTO(knowledgeItem);
    }

    @Override
    @Transactional(readOnly = true)
    public KnowledgeItemDTO findByIdWithUserStatus(Long id, Long userId) {
        KnowledgeItemDTO dto = findById(id);
        
        if (userId != null) {
            enrichWithUserInteractionStatus(dto, userId);
        }
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> findAll(Pageable pageable, KnowledgeFilter filter) {
        Page<KnowledgeItem> knowledgeItems;
        
        if (filter != null && hasFilterConditions(filter)) {
            knowledgeItems = knowledgeItemRepository.findByMultipleConditions(
                    filter.getCategoryId(),
                    filter.getType(),
                    filter.getUploaderId(),
                    filter.getKeyword(),
                    filter.getStatus() != null ? filter.getStatus() : 1,
                    pageable
            );
        } else {
            // 使用findAll并手动过滤状态
            knowledgeItems = knowledgeItemRepository.findAll(pageable);
        }
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> findAllWithUserStatus(Pageable pageable, KnowledgeFilter filter, Long userId) {
        Page<KnowledgeItemDTO> result = findAll(pageable, filter);
        
        if (userId != null) {
            batchEnrichWithUserInteractionStatus(result.getContent(), userId);
        }
        
        return result;
    }

    // 继续实现其他方法...
    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> findByUploader(Long uploaderId, Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findByUploaderIdAndStatus(uploaderId, 1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> findByCategory(Long categoryId, Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findByCategoryIdAndStatus(categoryId, 1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> findByTag(String tag, Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findByTagsContainingAndStatus(tag, 1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> search(String keyword, Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.searchByKeywordAndStatus(keyword, 1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> advancedSearch(KnowledgeFilter filter, Pageable pageable) {
        return findAll(pageable, filter);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> getPopularContent(Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findPopularContent(1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> getLatestContent(Pageable pageable) {
        Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findPopularContent(1, pageable);
        
        List<KnowledgeItemDTO> dtos = knowledgeItems.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> getRecommendedContent(Long userId, Pageable pageable) {
        if (userId == null) {
            return getPopularContent(pageable);
        }
        
        try {
            // 1. 获取用户偏好标签
            List<String> userPreferredTags = getUserPreferredTags(userId);
            
            // 2. 基于标签的内容推荐 (60%)
            int contentBasedSize = (int) (pageable.getPageSize() * 0.6);
            List<KnowledgeItem> contentBasedRecommendations = getContentBasedRecommendations(userPreferredTags, contentBasedSize);
            
            // 3. 热门内容补充 (40%)
            int popularSize = pageable.getPageSize() - contentBasedRecommendations.size();
            List<KnowledgeItem> popularRecommendations = getPopularContentForRecommendation(popularSize);
            
            // 4. 合并结果并去重
            Set<Long> addedIds = new HashSet<>();
            List<KnowledgeItem> finalRecommendations = new ArrayList<>();
            
            // 先添加基于内容的推荐
            for (KnowledgeItem item : contentBasedRecommendations) {
                if (addedIds.add(item.getId())) {
                    finalRecommendations.add(item);
                }
            }
            
            // 再添加热门内容推荐
            for (KnowledgeItem item : popularRecommendations) {
                if (addedIds.add(item.getId()) && finalRecommendations.size() < pageable.getPageSize()) {
                    finalRecommendations.add(item);
                }
            }
            
            // 5. 转换为DTO
            List<KnowledgeItemDTO> result = finalRecommendations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            return new PageImpl<>(result, pageable, result.size());
            
        } catch (Exception e) {
            logger.warn("推荐算法执行失败，返回热门内容: " + e.getMessage());
            return getPopularContent(pageable);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<KnowledgeItemDTO> getRelatedContent(Long knowledgeId, int limit) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findByIdAndStatus(knowledgeId, 1)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        // 基于分类和标签查找相关内容
        List<KnowledgeItem> relatedItems = new ArrayList<>();
        
        // 同分类的内容
        List<KnowledgeItem> categoryItems = knowledgeItemRepository.findByCategoryIdAndStatus(
                knowledgeItem.getCategoryId(), 1, 
                org.springframework.data.domain.PageRequest.of(0, limit)
        ).getContent();
        
        relatedItems.addAll(categoryItems.stream()
                .filter(item -> !item.getId().equals(knowledgeId))
                .limit(limit)
                .collect(Collectors.toList()));
        
        return relatedItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void incrementViewCount(Long id, String ipAddress) {
        // 增加统计表中的浏览量
        knowledgeStatsRepository.incrementViewCount(id, LocalDateTime.now());
        
        logger.debug("Incremented view count for knowledge item: {}", id);
    }

    // 私有辅助方法
    private void validateCreateRequest(CreateKnowledgeRequest request, Long uploaderId) {
        if (request == null) {
            throw new BusinessException("INVALID_REQUEST", "请求参数不能为空");
        }
        
        if (uploaderId == null) {
            throw new BusinessException("INVALID_USER", "用户ID不能为空");
        }
        
        // 验证用户是否存在
        if (!userRepository.existsById(uploaderId)) {
            throw new BusinessException("USER_NOT_FOUND", "用户不存在");
        }
        
        // 验证分类是否存在
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new BusinessException("CATEGORY_NOT_FOUND", "分类不存在");
        }
    }

    private void validateUpdatePermission(KnowledgeItem knowledgeItem, Long editorId) {
        permissionChecker.validateEditPermission(knowledgeItem.getId(), editorId);
    }

    private void validateDeletePermission(KnowledgeItem knowledgeItem, Long operatorId) {
        permissionChecker.validateDeletePermission(knowledgeItem.getId(), operatorId);
    }

    private String processTagsFromRequest(CreateKnowledgeRequest request) {
        if (request.getTagList() != null && !request.getTagList().isEmpty()) {
            return String.join(",", request.getTagList());
        }
        return request.getTags();
    }

    private boolean updateKnowledgeItemFields(KnowledgeItem knowledgeItem, UpdateKnowledgeRequest request) {
        boolean hasChanges = false;
        
        if (request.getTitle() != null && !request.getTitle().equals(knowledgeItem.getTitle())) {
            knowledgeItem.setTitle(request.getTitle());
            hasChanges = true;
        }
        
        if (request.getContent() != null && !request.getContent().equals(knowledgeItem.getContent())) {
            knowledgeItem.setContent(request.getContent());
            hasChanges = true;
        }
        
        if (request.getType() != null && !request.getType().equals(knowledgeItem.getType())) {
            knowledgeItem.setType(request.getType());
            hasChanges = true;
        }
        
        if (request.getLinkUrl() != null && !request.getLinkUrl().equals(knowledgeItem.getLinkUrl())) {
            knowledgeItem.setLinkUrl(request.getLinkUrl());
            hasChanges = true;
        }
        
        if (request.getCategoryId() != null && !request.getCategoryId().equals(knowledgeItem.getCategoryId())) {
            knowledgeItem.setCategoryId(request.getCategoryId());
            hasChanges = true;
        }
        
        if (request.getMediaUrls() != null) {
            knowledgeItem.setMediaUrls(new ArrayList<>(request.getMediaUrls()));
            hasChanges = true;
        }
        
        String newTags = processTagsFromUpdateRequest(request);
        if (newTags != null && !newTags.equals(knowledgeItem.getTags())) {
            knowledgeItem.setTags(newTags);
            hasChanges = true;
        }
        
        if (request.getStatus() != null && !request.getStatus().equals(knowledgeItem.getStatus())) {
            knowledgeItem.setStatus(request.getStatus());
            hasChanges = true;
        }
        
        return hasChanges;
    }

    private String processTagsFromUpdateRequest(UpdateKnowledgeRequest request) {
        if (request.getTagList() != null && !request.getTagList().isEmpty()) {
            return String.join(",", request.getTagList());
        }
        return request.getTags();
    }

    private void createKnowledgeStats(Long knowledgeId) {
        com.example.educhain.entity.KnowledgeStats stats = new com.example.educhain.entity.KnowledgeStats(knowledgeId);
        knowledgeStatsRepository.save(stats);
    }

    private void createVersionHistory(KnowledgeItem knowledgeItem, Long editorId, 
                                    KnowledgeVersion.ChangeType changeType, String changeSummary) {
        // 获取下一个版本号
        Integer nextVersion = knowledgeVersionRepository.findMaxVersionNumberByKnowledgeId(knowledgeItem.getId())
                .orElse(0) + 1;
        
        KnowledgeVersion version = KnowledgeVersion.fromKnowledgeItem(
                knowledgeItem, nextVersion, editorId, changeType, changeSummary);
        
        knowledgeVersionRepository.save(version);
    }

    @Override
    public void processTagAssociation(KnowledgeItem knowledgeItem, String oldTags, String newTags) {
        Set<String> oldTagSet = parseTagsToSet(oldTags);
        Set<String> newTagSet = parseTagsToSet(newTags);
        
        // 找出需要减少使用次数的标签
        Set<String> tagsToDecrement = new HashSet<>(oldTagSet);
        tagsToDecrement.removeAll(newTagSet);
        
        // 找出需要增加使用次数的标签
        Set<String> tagsToIncrement = new HashSet<>(newTagSet);
        tagsToIncrement.removeAll(oldTagSet);
        
        LocalDateTime now = LocalDateTime.now();
        
        // 减少使用次数
        if (!tagsToDecrement.isEmpty()) {
            tagRepository.decrementUsageCountByNames(new ArrayList<>(tagsToDecrement));
        }
        
        // 增加使用次数（如果标签不存在则创建）
        if (!tagsToIncrement.isEmpty()) {
            for (String tagName : tagsToIncrement) {
                Optional<Tag> existingTag = tagRepository.findByNameAndStatus(tagName, 1);
                if (existingTag.isPresent()) {
                    tagRepository.incrementUsageCount(existingTag.get().getId(), now);
                } else {
                    // 创建新标签
                    Tag newTag = new Tag(tagName, null, "用户标签", knowledgeItem.getUploaderId());
                    newTag.setUsageCount(1L);
                    newTag.setLastUsedAt(now);
                    tagRepository.save(newTag);
                }
            }
        }
    }

    private Set<String> parseTagsToSet(String tags) {
        if (!StringUtils.hasText(tags)) {
            return new HashSet<>();
        }
        
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
    }

    private boolean hasFilterConditions(KnowledgeFilter filter) {
        return filter.getKeyword() != null ||
               filter.getCategoryId() != null ||
               filter.getType() != null ||
               filter.getUploaderId() != null ||
               filter.getTags() != null;
    }

    private KnowledgeItemDTO convertToDTO(KnowledgeItem knowledgeItem) {
        KnowledgeItemDTO dto = new KnowledgeItemDTO();
        dto.setId(knowledgeItem.getId());
        dto.setTitle(knowledgeItem.getTitle());
        dto.setContent(knowledgeItem.getContent());
        dto.setType(knowledgeItem.getType());
        dto.setMediaUrls(knowledgeItem.getMediaUrls());
        dto.setLinkUrl(knowledgeItem.getLinkUrl());
        dto.setUploaderId(knowledgeItem.getUploaderId());
        dto.setCategoryId(knowledgeItem.getCategoryId());
        dto.setTags(knowledgeItem.getTags());
        dto.setStatus(knowledgeItem.getStatus());
        dto.setCreatedAt(knowledgeItem.getCreatedAt());
        dto.setUpdatedAt(knowledgeItem.getUpdatedAt());
        
        // 设置状态文本
        dto.setStatusText(getStatusText(knowledgeItem.getStatus()));
        
        // 解析标签列表
        if (StringUtils.hasText(knowledgeItem.getTags())) {
            dto.setTagList(Arrays.asList(knowledgeItem.getTags().split(",")));
        }
        
        // 获取统计信息
        Optional<com.example.educhain.entity.KnowledgeStats> stats = knowledgeStatsRepository.findByKnowledgeId(knowledgeItem.getId());
        if (stats.isPresent()) {
            com.example.educhain.entity.KnowledgeStats s = stats.get();
            dto.setViewCount(s.getViewCount());
            dto.setLikeCount(s.getLikeCount());
            dto.setFavoriteCount(s.getFavoriteCount());
            dto.setCommentCount(s.getCommentCount());
            dto.setShareCount(s.getShareCount());
            dto.setQualityScore(s.getQualityScore());
        }
        
        // 获取上传者信息
        userRepository.findById(knowledgeItem.getUploaderId()).ifPresent(user -> {
            dto.setUploaderName(user.getFullName());
            dto.setUploaderAvatar(user.getAvatarUrl());
        });
        
        // 获取分类信息
        categoryRepository.findById(knowledgeItem.getCategoryId()).ifPresent(category -> {
            dto.setCategoryName(category.getName());
        });
        
        return dto;
    }

    private String getStatusText(Integer status) {
        switch (status) {
            case 0: return "已删除";
            case 1: return "正常";
            case 2: return "草稿";
            default: return "未知";
        }
    }

    // 其他方法的实现将在下一部分继续...
    
    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeVersion> getVersionHistory(Long knowledgeId, Pageable pageable) {
        return knowledgeVersionRepository.findByKnowledgeIdOrderByVersionNumberDesc(knowledgeId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public KnowledgeVersion getVersion(Long knowledgeId, Integer versionNumber) {
        return knowledgeVersionRepository.findByKnowledgeIdAndVersionNumber(knowledgeId, versionNumber)
                .orElseThrow(() -> new BusinessException("VERSION_NOT_FOUND", "版本不存在"));
    }

    @Override
    public KnowledgeItemDTO restoreToVersion(Long knowledgeId, Integer versionNumber, Long operatorId, String changeSummary) {
        KnowledgeVersion version = getVersion(knowledgeId, versionNumber);
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findByIdAndStatus(knowledgeId, 1)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        // 检查权限
        validateUpdatePermission(knowledgeItem, operatorId);
        
        // 保存旧标签信息
        String oldTags = knowledgeItem.getTags();
        
        // 恢复到指定版本
        knowledgeItem.setTitle(version.getTitle());
        knowledgeItem.setContent(version.getContent());
        knowledgeItem.setType(version.getType());
        knowledgeItem.setMediaUrls(new ArrayList<>(version.getMediaUrls()));
        knowledgeItem.setLinkUrl(version.getLinkUrl());
        knowledgeItem.setTags(version.getTags());
        
        KnowledgeItem updatedItem = knowledgeItemRepository.save(knowledgeItem);
        
        // 创建版本历史
        String summary = changeSummary != null ? changeSummary : "恢复到版本 " + versionNumber;
        createVersionHistory(updatedItem, operatorId, KnowledgeVersion.ChangeType.RESTORE, summary);
        
        // 处理标签关联变更
        processTagAssociation(updatedItem, oldTags, updatedItem.getTags());
        
        logger.info("Knowledge item {} restored to version {} by user {}", knowledgeId, versionNumber, operatorId);
        
        return convertToDTO(updatedItem);
    }

    @Override
    @Transactional(readOnly = true)
    public VersionDiff compareVersions(Long knowledgeId, Integer version1, Integer version2) {
        KnowledgeVersion v1 = getVersion(knowledgeId, version1);
        KnowledgeVersion v2 = getVersion(knowledgeId, version2);
        
        VersionDiff diff = new VersionDiff(v1, v2);
        
        // 标题差异
        diff.setTitleDiff(computeTextDiff(
            Optional.ofNullable(v1.getTitle()).orElse(""),
            Optional.ofNullable(v2.getTitle()).orElse("")
        ));
        
        // 内容差异
        diff.setContentDiff(computeTextDiff(
            Optional.ofNullable(v1.getContentSnapshot()).orElse(""),
            Optional.ofNullable(v2.getContentSnapshot()).orElse("")
        ));
        
        // 标签差异
        diff.setTagsDiff(computeTextDiff(
            Optional.ofNullable(v1.getTags()).orElse(""),
            Optional.ofNullable(v2.getTags()).orElse("")
        ));
        
        return diff;
    }

    @Override
    public KnowledgeItemDTO publishDraft(Long id, Long operatorId) {
        KnowledgeItem knowledgeItem = knowledgeItemRepository.findById(id)
                .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
        
        if (knowledgeItem.getStatus() != 2) {
            throw new BusinessException("NOT_DRAFT", "内容不是草稿状态");
        }
        
        // 检查权限
        validateUpdatePermission(knowledgeItem, operatorId);
        
        // 发布草稿
        knowledgeItem.setStatus(1);
        KnowledgeItem publishedItem = knowledgeItemRepository.save(knowledgeItem);
        
        // 创建版本历史
        createVersionHistory(publishedItem, operatorId, KnowledgeVersion.ChangeType.UPDATE, "发布草稿");
        
        logger.info("Draft published: {} by user {}", id, operatorId);
        
        return convertToDTO(publishedItem);
    }

    @Override
    public KnowledgeItemDTO saveDraft(CreateKnowledgeRequest request, Long uploaderId) {
        request.setStatus(2); // 设置为草稿状态
        return create(request, uploaderId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KnowledgeItemDTO> getUserDrafts(Long uploaderId, Pageable pageable) {
        Page<KnowledgeItem> drafts = knowledgeItemRepository.findByUploaderIdAndStatus(uploaderId, 2, pageable);
        
        List<KnowledgeItemDTO> dtos = drafts.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(dtos, pageable, drafts.getTotalElements());
    }

    @Override
    public void batchUpdateStatus(List<Long> ids, Integer status, Long operatorId) {
        knowledgeItemRepository.updateStatusByIds(ids, status);
        
        logger.info("Batch updated status to {} for {} items by user {}", status, ids.size(), operatorId);
    }

    @Override
    @Transactional(readOnly = true)
    public KnowledgeStats getKnowledgeStats() {
        try {
            String sql = """
                SELECT 
                    COUNT(*) as total_count,
                    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as published_count,
                    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as draft_count,
                    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as deleted_count,
                    COALESCE(SUM(ks.views_count), 0) as total_views,
                    COALESCE(SUM(ks.likes_count), 0) as total_likes,
                    COALESCE(SUM(ks.favorites_count), 0) as total_favorites,
                    COALESCE(SUM(ks.comments_count), 0) as total_comments
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                """;
            
            Object[] result = (Object[]) entityManager.createNativeQuery(sql).getSingleResult();
            
            return new KnowledgeStats(
                ((Number) result[0]).longValue(),
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue(),
                ((Number) result[3]).longValue(),
                ((Number) result[4]).longValue(),
                ((Number) result[5]).longValue(),
                ((Number) result[6]).longValue(),
                ((Number) result[7]).longValue()
            );
        } catch (Exception e) {
            logger.error("获取知识统计信息失败", e);
            return new KnowledgeStats(0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserKnowledgeStats getUserKnowledgeStats(Long userId) {
        try {
            String sql = """
                SELECT 
                    COUNT(CASE WHEN ki.status = 1 THEN 1 END) as published_count,
                    COUNT(CASE WHEN ki.status = 2 THEN 1 END) as draft_count,
                    COALESCE(SUM(ks.views_count), 0) as total_views,
                    COALESCE(SUM(ks.likes_count), 0) as total_likes,
                    COALESCE(SUM(ks.favorites_count), 0) as total_favorites,
                    COALESCE(SUM(ks.comments_count), 0) as total_comments,
                    COALESCE(AVG(ks.score), 0.0) as avg_quality_score
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                WHERE ki.uploader_id = ?
                """;
            
            Object[] result = (Object[]) entityManager.createNativeQuery(sql)
                .setParameter(1, userId)
                .getSingleResult();
            
            return new UserKnowledgeStats(
                ((Number) result[0]).longValue(),
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue(),
                ((Number) result[3]).longValue(),
                ((Number) result[4]).longValue(),
                ((Number) result[5]).longValue(),
                ((Number) result[6]).doubleValue()
            );
        } catch (Exception e) {
            logger.error("获取用户知识统计信息失败", e);
            return new UserKnowledgeStats(0L, 0L, 0L, 0L, 0L, 0L, 0.0);
        }
    }

    // ========== 辅助方法 ==========

    /**
     * 为单个知识内容DTO添加用户互动状态
     */
    private void enrichWithUserInteractionStatus(KnowledgeItemDTO dto, Long userId) {
        if (userId == null || dto == null) {
            return;
        }
        
        try {
            List<UserInteraction> interactions = userInteractionRepository
                .findByKnowledgeIdAndUserId(dto.getId(), userId);
            
            Map<UserInteraction.InteractionType, UserInteraction> interactionMap = 
                interactions.stream().collect(Collectors.toMap(
                    UserInteraction::getInteractionType, 
                    interaction -> interaction,
                    (existing, replacement) -> existing
                ));
            
            dto.setUserLiked(interactionMap.containsKey(UserInteraction.InteractionType.LIKE));
            dto.setUserFavorited(interactionMap.containsKey(UserInteraction.InteractionType.FAVORITE));
        } catch (Exception e) {
            logger.warn("获取用户互动状态失败: " + e.getMessage());
            dto.setUserLiked(false);
            dto.setUserFavorited(false);
        }
    }

    /**
     * 批量为知识内容DTO添加用户互动状态
     */
    private void batchEnrichWithUserInteractionStatus(List<KnowledgeItemDTO> dtos, Long userId) {
        if (userId == null || dtos == null || dtos.isEmpty()) {
            return;
        }
        
        try {
            List<Long> knowledgeIds = dtos.stream()
                .map(KnowledgeItemDTO::getId)
                .collect(Collectors.toList());
            
            // 一次查询获取所有互动状态
            List<UserInteraction> interactions = userInteractionRepository
                .findByKnowledgeIdInAndUserId(knowledgeIds, userId);
            
            // 按知识ID和互动类型分组
            Map<Long, Map<UserInteraction.InteractionType, Boolean>> statusMap = interactions.stream()
                .collect(Collectors.groupingBy(
                    UserInteraction::getKnowledgeId,
                    Collectors.toMap(
                        UserInteraction::getInteractionType,
                        interaction -> true,
                        (a, b) -> true
                    )
                ));
            
            // 设置状态
            dtos.forEach(dto -> {
                Map<UserInteraction.InteractionType, Boolean> userStatus = 
                    statusMap.getOrDefault(dto.getId(), new HashMap<>());
                dto.setUserLiked(userStatus.getOrDefault(UserInteraction.InteractionType.LIKE, false));
                dto.setUserFavorited(userStatus.getOrDefault(UserInteraction.InteractionType.FAVORITE, false));
            });
        } catch (Exception e) {
            logger.warn("批量获取用户互动状态失败: " + e.getMessage());
            // 设置默认值
            dtos.forEach(dto -> {
                dto.setUserLiked(false);
                dto.setUserFavorited(false);
            });
        }
    }

    /**
     * 获取用户偏好标签
     */
    private List<String> getUserPreferredTags(Long userId) {
        try {
            // 基于用户点赞和收藏的内容分析偏好标签
            String sql = """
                SELECT ki.tags
                FROM knowledge_items ki
                INNER JOIN user_interactions ui ON ki.id = ui.knowledge_id
                WHERE ui.user_id = ? AND ui.interaction_type IN ('LIKE', 'FAVORITE')
                AND ki.tags IS NOT NULL AND ki.tags != ''
                ORDER BY ui.created_at DESC
                LIMIT 50
                """;
            
            @SuppressWarnings("unchecked")
            List<String> tagStrings = entityManager.createNativeQuery(sql)
                .setParameter(1, userId)
                .getResultList();
            
            // 解析标签并统计频率
            Map<String, Integer> tagFrequency = new HashMap<>();
            for (String tagString : tagStrings) {
                if (tagString != null && !tagString.trim().isEmpty()) {
                    String[] tags = tagString.split(",");
                    for (String tag : tags) {
                        String cleanTag = tag.trim();
                        if (!cleanTag.isEmpty()) {
                            tagFrequency.put(cleanTag, tagFrequency.getOrDefault(cleanTag, 0) + 1);
                        }
                    }
                }
            }
            
            // 返回频率最高的前10个标签
            return tagFrequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            logger.warn("获取用户偏好标签失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 基于内容的推荐
     */
    private List<KnowledgeItem> getContentBasedRecommendations(List<String> preferredTags, int limit) {
        if (preferredTags.isEmpty() || limit <= 0) {
            return new ArrayList<>();
        }
        
        try {
            // 构建标签匹配的SQL查询
            StringBuilder tagConditions = new StringBuilder();
            for (int i = 0; i < preferredTags.size(); i++) {
                if (i > 0) {
                    tagConditions.append(" OR ");
                }
                tagConditions.append("ki.tags LIKE ?").append(i + 1);
            }
            
            String sql = String.format("""
                SELECT DISTINCT ki.*
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                WHERE ki.status = 1 AND (%s)
                ORDER BY COALESCE(ks.score, 0) DESC, ki.created_at DESC
                LIMIT %d
                """, tagConditions.toString(), limit);
            
            jakarta.persistence.Query query = entityManager.createNativeQuery(sql, KnowledgeItem.class);
            
            // 设置参数
            for (int i = 0; i < preferredTags.size(); i++) {
                query.setParameter(i + 1, "%" + preferredTags.get(i) + "%");
            }
            
            @SuppressWarnings("unchecked")
            List<KnowledgeItem> results = query.getResultList();
            return results;
            
        } catch (Exception e) {
            logger.warn("基于内容的推荐失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 获取热门内容用于推荐
     */
    private List<KnowledgeItem> getPopularContentForRecommendation(int limit) {
        if (limit <= 0) {
            return new ArrayList<>();
        }
        
        try {
            String sql = """
                SELECT ki.*
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                WHERE ki.status = 1
                ORDER BY COALESCE(ks.views_count, 0) + COALESCE(ks.likes_count, 0) * 2 + COALESCE(ks.favorites_count, 0) * 3 DESC,
                         ki.created_at DESC
                LIMIT ?
                """;
            
            @SuppressWarnings("unchecked")
            List<KnowledgeItem> results = entityManager.createNativeQuery(sql, KnowledgeItem.class)
                .setParameter(1, limit)
                .getResultList();
            return results;
            
        } catch (Exception e) {
            logger.warn("获取热门内容失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 计算文本差异
     */
    private List<String> computeTextDiff(String text1, String text2) {
        try {
            List<String> lines1 = Arrays.asList(text1.split("\n"));
            List<String> lines2 = Arrays.asList(text2.split("\n"));
            
            Patch<String> patch = DiffUtils.diff(lines1, lines2);
            
            return patch.getDeltas().stream()
                .map(delta -> {
                    switch (delta.getType()) {
                        case INSERT:
                            return "+ " + String.join("\n+ ", delta.getTarget().getLines());
                        case DELETE:
                            return "- " + String.join("\n- ", delta.getSource().getLines());
                        case CHANGE:
                            return "~ " + String.join("\n~ ", delta.getTarget().getLines());
                        default:
                            return "";
                    }
                })
                .filter(line -> !line.isEmpty())
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.warn("计算文本差异失败: " + e.getMessage());
            return Arrays.asList("差异计算失败: " + e.getMessage());
        }
    }
}