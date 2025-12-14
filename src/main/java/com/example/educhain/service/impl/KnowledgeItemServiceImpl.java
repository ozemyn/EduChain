package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.*;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.*;
import com.example.educhain.service.FileUploadService;
import com.example.educhain.service.KnowledgeItemService;
import com.example.educhain.util.HashUtil;
import com.example.educhain.util.PermissionChecker;
import com.github.difflib.DiffUtils;
import com.github.difflib.patch.Patch;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
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

/** 知识内容服务实现类 提供知识内容的完整生命周期管理功能 支持创建、更新、删除、查询、版本管理、文件上传、权限控制等核心功能 包含版本历史追踪、标签管理、统计信息更新等高级特性 */
@Service
public class KnowledgeItemServiceImpl implements KnowledgeItemService {

  private static final Logger logger = LoggerFactory.getLogger(KnowledgeItemServiceImpl.class);

  @Autowired private KnowledgeItemRepository knowledgeItemRepository;

  @Autowired private KnowledgeStatsRepository knowledgeStatsRepository;

  @Autowired private KnowledgeVersionRepository knowledgeVersionRepository;

  @Autowired private TagRepository tagRepository;

  @Autowired private UserRepository userRepository;

  @Autowired private CategoryRepository categoryRepository;

  @Autowired private FileUploadService fileUploadService;

  @Autowired private UserInteractionRepository userInteractionRepository;

  @Autowired private PermissionChecker permissionChecker;

  @Autowired private com.example.educhain.service.ShareCodeService shareCodeService;

  @Autowired private jakarta.persistence.EntityManager entityManager;

  @Autowired(required = false)
  private com.example.educhain.service.BlockchainService blockchainService;

  /**
   * 创建新的知识内容 验证请求参数，创建知识内容实体，初始化统计信息和版本历史 处理标签关联和媒体文件
   *
   * @param request 创建请求参数
   * @param uploaderId 上传者ID
   * @return 创建成功的知识内容DTO
   * @throws BusinessException 参数验证失败或创建过程出错时抛出
   */
  @Override
  public KnowledgeItemDTO create(CreateKnowledgeRequest request, Long uploaderId) {
    validateCreateRequest(request, uploaderId);

    // 创建知识内容实体
    KnowledgeItem knowledgeItem = new KnowledgeItem();
    knowledgeItem.setShareCode(shareCodeService.generateShareCode()); // 生成分享码
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

    // 区块链存证（异步，不阻塞主流程）
    if (blockchainService != null && savedItem.getStatus() == 1) {
      try {
        String contentHash =
            HashUtil.calculateKnowledgeHash(savedItem.getTitle(), savedItem.getContent());
        blockchainService.certifyKnowledge(savedItem.getId(), uploaderId, contentHash);
        logger.info(
            "Knowledge item certified on blockchain: {} by user {}", savedItem.getId(), uploaderId);
      } catch (Exception e) {
        // 区块链存证失败不影响主流程，只记录日志
        logger.warn(
            "Failed to certify knowledge on blockchain: knowledgeId={}, error={}",
            savedItem.getId(),
            e.getMessage());
      }
    }

    logger.info("Knowledge item created: {} by user {}", savedItem.getId(), uploaderId);

    return convertToDTO(savedItem);
  }

  /**
   * 创建带文件的知识内容 先创建知识内容，然后上传文件并关联到知识内容 文件上传成功后更新知识内容的媒体URL列表
   *
   * @param request 创建请求参数
   * @param files 要上传的文件列表
   * @param uploaderId 上传者ID
   * @return 创建成功的知识内容DTO
   * @throws BusinessException 创建过程出错时抛出
   */
  @Override
  public KnowledgeItemDTO createWithFiles(
      CreateKnowledgeRequest request, List<MultipartFile> files, Long uploaderId) {
    // 先创建知识内容
    KnowledgeItemDTO knowledgeDTO = create(request, uploaderId);

    // 上传文件并关联到知识内容
    if (files != null && !files.isEmpty()) {
      List<FileUpload> uploadedFiles =
          fileUploadService.uploadFiles(files, uploaderId, knowledgeDTO.getId(), "知识内容附件");

      // 更新媒体URL
      List<String> mediaUrls =
          uploadedFiles.stream().map(FileUpload::getFileUrl).collect(Collectors.toList());

      if (knowledgeDTO.getMediaUrls() != null) {
        mediaUrls.addAll(knowledgeDTO.getMediaUrls());
      }

      // 更新知识内容的媒体URL
      KnowledgeItem knowledgeItem =
          knowledgeItemRepository
              .findById(knowledgeDTO.getId())
              .orElseThrow(
                  () -> {
                    logger.error(
                        "创建知识内容失败: 知识内容不存在, knowledgeId={}, uploaderId={}",
                        knowledgeDTO.getId(),
                        uploaderId);
                    return new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在");
                  });
      knowledgeItem.setMediaUrls(mediaUrls);
      knowledgeItemRepository.save(knowledgeItem);

      knowledgeDTO.setMediaUrls(mediaUrls);
    }

    return knowledgeDTO;
  }

  /**
   * 更新知识内容 验证权限，更新字段，创建版本历史，处理标签关联变更 只有具有编辑权限的用户才能更新内容
   *
   * @param id 知识内容ID
   * @param request 更新请求参数
   * @param editorId 编辑者ID
   * @return 更新后的知识内容DTO
   * @throws BusinessException 内容不存在、权限不足或更新过程出错时抛出
   */
  @Override
  public KnowledgeItemDTO update(Long id, UpdateKnowledgeRequest request, Long editorId) {
    try {
      KnowledgeItem knowledgeItem =
          knowledgeItemRepository
              .findByIdAndStatus(id, 1)
              .orElseThrow(
                  () -> {
                    logger.warn("更新知识内容失败: 知识内容不存在或已删除, knowledgeId={}, editorId={}", id, editorId);
                    return new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在");
                  });

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
        String changeSummary =
            request.getChangeSummary() != null ? request.getChangeSummary() : "更新知识内容";
        createVersionHistory(
            updatedItem, editorId, KnowledgeVersion.ChangeType.UPDATE, changeSummary);

        // 处理标签关联变更
        processTagAssociation(updatedItem, oldTags, updatedItem.getTags());

        logger.info("Knowledge item updated: {} by user {}", id, editorId);
      }

      return convertToDTO(knowledgeItem);
    } catch (BusinessException e) {
      throw e;
    } catch (Exception e) {
      logger.error(
          "更新知识内容失败: knowledgeId={}, editorId={}, error={}", id, editorId, e.getMessage(), e);
      throw new BusinessException("UPDATE_KNOWLEDGE_FAILED", "更新知识内容失败");
    }
  }

  /**
   * 更新带文件的知识内容 先更新知识内容基本信息，然后上传新文件并更新媒体URL列表
   *
   * @param id 知识内容ID
   * @param request 更新请求参数
   * @param files 要上传的新文件列表
   * @param editorId 编辑者ID
   * @return 更新后的知识内容DTO
   * @throws BusinessException 更新过程出错时抛出
   */
  @Override
  public KnowledgeItemDTO updateWithFiles(
      Long id, UpdateKnowledgeRequest request, List<MultipartFile> files, Long editorId) {
    // 先更新知识内容
    KnowledgeItemDTO knowledgeDTO = update(id, request, editorId);

    // 上传新文件
    if (files != null && !files.isEmpty()) {
      List<FileUpload> uploadedFiles = fileUploadService.uploadFiles(files, editorId, id, "知识内容附件");

      // 更新媒体URL
      List<String> newMediaUrls =
          uploadedFiles.stream().map(FileUpload::getFileUrl).collect(Collectors.toList());

      List<String> existingUrls =
          knowledgeDTO.getMediaUrls() != null
              ? new ArrayList<>(knowledgeDTO.getMediaUrls())
              : new ArrayList<>();
      existingUrls.addAll(newMediaUrls);

      // 更新知识内容的媒体URL
      KnowledgeItem knowledgeItem =
          knowledgeItemRepository
              .findById(id)
              .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));
      knowledgeItem.setMediaUrls(existingUrls);
      knowledgeItemRepository.save(knowledgeItem);

      knowledgeDTO.setMediaUrls(existingUrls);
    }

    return knowledgeDTO;
  }

  /**
   * 删除知识内容（软删除） 将知识内容状态设置为已删除，创建版本历史，处理标签关联 只有具有删除权限的用户才能执行删除操作
   *
   * @param id 知识内容ID
   * @param operatorId 操作者ID
   * @throws BusinessException 内容不存在、权限不足或删除过程出错时抛出
   */
  @Override
  public void delete(Long id, Long operatorId) {
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findByIdAndStatus(id, 1)
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

  /**
   * 批量删除知识内容 逐个删除指定ID的知识内容，单个删除失败不影响其他内容的删除
   *
   * @param ids 要删除的知识内容ID列表
   * @param operatorId 操作者ID
   */
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

  /**
   * 恢复已删除的知识内容 将已删除的知识内容状态恢复为正常，创建版本历史，处理标签关联 只有具有删除权限的用户才能执行恢复操作
   *
   * @param id 知识内容ID
   * @param operatorId 操作者ID
   * @throws BusinessException 内容不存在、未被删除或权限不足时抛出
   */
  @Override
  public void restore(Long id, Long operatorId) {
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findById(id)
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

  /**
   * 根据分享码查找知识内容
   *
   * @param shareCode 分享码
   * @return 知识内容DTO
   * @throws BusinessException 内容不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeItemDTO findByShareCode(String shareCode) {
    if (!shareCodeService.isValidShareCode(shareCode)) {
      throw new BusinessException("INVALID_SHARE_CODE", "无效的分享码");
    }

    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findByShareCodeAndStatus(shareCode, 1)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));

    return convertToDTO(knowledgeItem);
  }

  /**
   * 根据分享码查找知识内容并包含用户状态
   *
   * @param shareCode 分享码
   * @param userId 用户ID
   * @return 包含用户状态的知识内容DTO
   * @throws BusinessException 内容不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeItemDTO findByShareCodeWithUserStatus(String shareCode, Long userId) {
    KnowledgeItemDTO dto = findByShareCode(shareCode);

    if (userId != null) {
      enrichWithUserInteractionStatus(dto, userId);
    }

    return dto;
  }

  /**
   * 根据ID查找知识内容 只返回状态为正常的知识内容
   *
   * @param id 知识内容ID
   * @return 知识内容DTO
   * @throws BusinessException 内容不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeItemDTO findById(Long id) {
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findByIdAndStatus(id, 1)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));

    return convertToDTO(knowledgeItem);
  }

  /**
   * 根据ID查找知识内容并包含用户状态 在基础信息基础上添加用户点赞和收藏状态
   *
   * @param id 知识内容ID
   * @param userId 用户ID
   * @return 包含用户状态的知识内容DTO
   * @throws BusinessException 内容不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeItemDTO findByIdWithUserStatus(Long id, Long userId) {
    KnowledgeItemDTO dto = findById(id);

    if (userId != null) {
      enrichWithUserInteractionStatus(dto, userId);
    }

    return dto;
  }

  /**
   * 分页查询所有知识内容 支持多种筛选条件，包括分类、类型、上传者、关键词等
   *
   * @param pageable 分页参数
   * @param filter 筛选条件
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> findAll(Pageable pageable, KnowledgeFilter filter) {
    Page<KnowledgeItem> knowledgeItems;

    if (filter != null && hasFilterConditions(filter)) {
      knowledgeItems =
          knowledgeItemRepository.findByMultipleConditions(
              filter.getCategoryId(),
              filter.getType(),
              filter.getUploaderId(),
              filter.getKeyword(),
              filter.getStatus() != null ? filter.getStatus() : 1,
              pageable);
    } else {
      // 使用findAll并手动过滤状态
      knowledgeItems = knowledgeItemRepository.findAll(pageable);
    }

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 分页查询所有知识内容并包含用户状态 在基础查询结果基础上批量添加用户互动状态
   *
   * @param pageable 分页参数
   * @param filter 筛选条件
   * @param userId 用户ID
   * @return 包含用户状态的知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> findAllWithUserStatus(
      Pageable pageable, KnowledgeFilter filter, Long userId) {
    Page<KnowledgeItemDTO> result = findAll(pageable, filter);

    if (userId != null) {
      batchEnrichWithUserInteractionStatus(result.getContent(), userId);
    }

    return result;
  }

  // 继续实现其他方法...
  /**
   * 根据上传者ID分页查询知识内容 只返回状态为正常的知识内容
   *
   * @param uploaderId 上传者ID
   * @param pageable 分页参数
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> findByUploader(Long uploaderId, Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems =
        knowledgeItemRepository.findByUploaderIdAndStatus(uploaderId, 1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 根据分类ID分页查询知识内容 只返回状态为正常的知识内容
   *
   * @param categoryId 分类ID
   * @param pageable 分页参数
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> findByCategory(Long categoryId, Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems =
        knowledgeItemRepository.findByCategoryIdAndStatus(categoryId, 1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 根据标签分页查询知识内容 只返回状态为正常的知识内容
   *
   * @param tag 标签
   * @param pageable 分页参数
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> findByTag(String tag, Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems =
        knowledgeItemRepository.findByTagsContainingAndStatus(tag, 1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 根据关键词搜索知识内容 在标题和内容中搜索匹配的关键词
   *
   * @param keyword 搜索关键词
   * @param pageable 分页参数
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> search(String keyword, Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems =
        knowledgeItemRepository.searchByKeywordAndStatus(keyword, 1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 高级搜索知识内容 使用复杂的筛选条件进行搜索
   *
   * @param filter 筛选条件
   * @param pageable 分页参数
   * @return 知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> advancedSearch(KnowledgeFilter filter, Pageable pageable) {
    return findAll(pageable, filter);
  }

  /**
   * 获取热门知识内容 根据浏览量、点赞数、收藏数等统计信息排序
   *
   * @param pageable 分页参数
   * @return 热门知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> getPopularContent(Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findPopularContent(1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 获取最新知识内容 按创建时间倒序排列
   *
   * @param pageable 分页参数
   * @return 最新知识内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> getLatestContent(Pageable pageable) {
    Page<KnowledgeItem> knowledgeItems = knowledgeItemRepository.findPopularContent(1, pageable);

    List<KnowledgeItemDTO> dtos =
        knowledgeItems.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, knowledgeItems.getTotalElements());
  }

  /**
   * 获取推荐知识内容 基于用户偏好和热门内容进行个性化推荐 如果用户未登录则返回热门内容
   *
   * @param userId 用户ID
   * @param pageable 分页参数
   * @return 推荐知识内容DTO分页结果
   */
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
      List<KnowledgeItem> contentBasedRecommendations =
          getContentBasedRecommendations(userPreferredTags, contentBasedSize);

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
      List<KnowledgeItemDTO> result =
          finalRecommendations.stream().map(this::convertToDTO).collect(Collectors.toList());

      return new PageImpl<>(result, pageable, result.size());

    } catch (Exception e) {
      logger.warn("推荐算法执行失败，返回热门内容: " + e.getMessage());
      return getPopularContent(pageable);
    }
  }

  /**
   * 获取相关内容 基于相同分类查找相关内容
   *
   * @param knowledgeId 知识内容ID
   * @param limit 返回结果数量限制
   * @return 相关知识内容DTO列表
   * @throws BusinessException 内容不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public List<KnowledgeItemDTO> getRelatedContent(Long knowledgeId, int limit) {
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findByIdAndStatus(knowledgeId, 1)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));

    // 基于分类和标签查找相关内容
    List<KnowledgeItem> relatedItems = new ArrayList<>();

    // 同分类的内容
    List<KnowledgeItem> categoryItems =
        knowledgeItemRepository
            .findByCategoryIdAndStatus(
                knowledgeItem.getCategoryId(),
                1,
                org.springframework.data.domain.PageRequest.of(0, limit))
            .getContent();

    relatedItems.addAll(
        categoryItems.stream()
            .filter(item -> !item.getId().equals(knowledgeId))
            .limit(limit)
            .collect(Collectors.toList()));

    return relatedItems.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  /**
   * 增加知识内容浏览量 更新统计表中的浏览次数
   *
   * @param id 知识内容ID
   * @param ipAddress 访问者IP地址
   */
  @Override
  @Transactional
  public void incrementViewCount(Long id, String ipAddress) {
    // 增加统计表中的浏览量
    knowledgeStatsRepository.incrementViewCount(id, LocalDateTime.now());

    logger.debug("Incremented view count for knowledge item: {}", id);
  }

  /**
   * 通过分享码增加浏览量
   *
   * @param shareCode 分享码
   * @param ipAddress IP地址
   */
  @Override
  @Transactional
  public void incrementViewCountByShareCode(String shareCode, String ipAddress) {
    if (!shareCodeService.isValidShareCode(shareCode)) {
      logger.warn("Invalid share code for view count increment: {}", shareCode);
      return;
    }

    KnowledgeItem knowledgeItem = knowledgeItemRepository
        .findByShareCodeAndStatus(shareCode, 1)
        .orElse(null);

    if (knowledgeItem != null) {
      incrementViewCount(knowledgeItem.getId(), ipAddress);
    }
  }

  // 私有辅助方法
  private void validateCreateRequest(CreateKnowledgeRequest request, Long uploaderId) {
    if (request == null) {
      logger.warn("创建知识内容失败: 请求参数为空, uploaderId={}", uploaderId);
      throw new BusinessException("INVALID_REQUEST", "请求参数不能为空");
    }

    if (uploaderId == null) {
      logger.warn("创建知识内容失败: 用户ID为空");
      throw new BusinessException("INVALID_USER", "用户ID不能为空");
    }

    // 验证用户是否存在
    if (!userRepository.existsById(uploaderId)) {
      logger.warn("创建知识内容失败: 用户不存在, uploaderId={}", uploaderId);
      throw new BusinessException("USER_NOT_FOUND", "用户不存在");
    }

    // 验证分类是否存在
    if (request.getCategoryId() != null
        && !categoryRepository.existsById(request.getCategoryId())) {
      logger.warn(
          "创建知识内容失败: 分类不存在, categoryId={}, uploaderId={}", request.getCategoryId(), uploaderId);
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

  private boolean updateKnowledgeItemFields(
      KnowledgeItem knowledgeItem, UpdateKnowledgeRequest request) {
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

    if (request.getCategoryId() != null
        && !request.getCategoryId().equals(knowledgeItem.getCategoryId())) {
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
    com.example.educhain.entity.KnowledgeStats stats =
        new com.example.educhain.entity.KnowledgeStats(knowledgeId);
    knowledgeStatsRepository.save(stats);
  }

  private void createVersionHistory(
      KnowledgeItem knowledgeItem,
      Long editorId,
      KnowledgeVersion.ChangeType changeType,
      String changeSummary) {
    // 获取下一个版本号
    Integer nextVersion =
        knowledgeVersionRepository
                .findMaxVersionNumberByKnowledgeId(knowledgeItem.getId())
                .orElse(0)
            + 1;

    KnowledgeVersion version =
        KnowledgeVersion.fromKnowledgeItem(
            knowledgeItem, nextVersion, editorId, changeType, changeSummary);

    knowledgeVersionRepository.save(version);
  }

  /**
   * 处理标签关联 根据标签变更情况更新标签使用次数 对于新增标签，如果不存在则创建新标签
   *
   * @param knowledgeItem 知识内容实体
   * @param oldTags 旧标签
   * @param newTags 新标签
   */
  @Override
  @Transactional
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
    return filter.getKeyword() != null
        || filter.getCategoryId() != null
        || filter.getType() != null
        || filter.getUploaderId() != null
        || filter.getTags() != null;
  }

  private KnowledgeItemDTO convertToDTO(KnowledgeItem knowledgeItem) {
    KnowledgeItemDTO dto = new KnowledgeItemDTO();
    dto.setId(knowledgeItem.getId());
    dto.setShareCode(knowledgeItem.getShareCode());
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
    Optional<com.example.educhain.entity.KnowledgeStats> stats =
        knowledgeStatsRepository.findByKnowledgeId(knowledgeItem.getId());
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
    userRepository
        .findById(knowledgeItem.getUploaderId())
        .ifPresent(
            user -> {
              dto.setUploaderName(user.getFullName());
              dto.setUploaderAvatar(user.getAvatarUrl());
            });

    // 获取分类信息
    categoryRepository
        .findById(knowledgeItem.getCategoryId())
        .ifPresent(
            category -> {
              dto.setCategoryName(category.getName());
            });

    return dto;
  }

  private String getStatusText(Integer status) {
    switch (status) {
      case 0:
        return "已删除";
      case 1:
        return "正常";
      case 2:
        return "草稿";
      default:
        return "未知";
    }
  }

  // 其他方法的实现将在下一部分继续...

  /**
   * 获取知识内容版本历史 按版本号倒序排列
   *
   * @param knowledgeId 知识内容ID
   * @param pageable 分页参数
   * @return 版本历史分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeVersion> getVersionHistory(Long knowledgeId, Pageable pageable) {
    return knowledgeVersionRepository.findByKnowledgeIdOrderByVersionNumberDesc(
        knowledgeId, pageable);
  }

  /**
   * 获取指定版本的知识内容
   *
   * @param knowledgeId 知识内容ID
   * @param versionNumber 版本号
   * @return 知识内容版本
   * @throws BusinessException 版本不存在时抛出
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeVersion getVersion(Long knowledgeId, Integer versionNumber) {
    return knowledgeVersionRepository
        .findByKnowledgeIdAndVersionNumber(knowledgeId, versionNumber)
        .orElseThrow(() -> new BusinessException("VERSION_NOT_FOUND", "版本不存在"));
  }

  /**
   * 恢复到指定版本 将当前知识内容恢复到指定版本的状态 创建新的版本历史记录
   *
   * @param knowledgeId 知识内容ID
   * @param versionNumber 要恢复的版本号
   * @param operatorId 操作者ID
   * @param changeSummary 变更摘要
   * @return 恢复后的知识内容DTO
   * @throws BusinessException 内容不存在、权限不足或版本不存在时抛出
   */
  @Override
  public KnowledgeItemDTO restoreToVersion(
      Long knowledgeId, Integer versionNumber, Long operatorId, String changeSummary) {
    KnowledgeVersion version = getVersion(knowledgeId, versionNumber);
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findByIdAndStatus(knowledgeId, 1)
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

    logger.info(
        "Knowledge item {} restored to version {} by user {}",
        knowledgeId,
        versionNumber,
        operatorId);

    return convertToDTO(updatedItem);
  }

  /**
   * 比较两个版本的差异 计算标题、内容、标签的差异
   *
   * @param knowledgeId 知识内容ID
   * @param version1 版本号1
   * @param version2 版本号2
   * @return 版本差异信息
   */
  @Override
  @Transactional(readOnly = true)
  public VersionDiff compareVersions(Long knowledgeId, Integer version1, Integer version2) {
    KnowledgeVersion v1 = getVersion(knowledgeId, version1);
    KnowledgeVersion v2 = getVersion(knowledgeId, version2);

    VersionDiff diff = new VersionDiff(v1, v2);

    // 标题差异
    diff.setTitleDiff(
        computeTextDiff(
            Optional.ofNullable(v1.getTitle()).orElse(""),
            Optional.ofNullable(v2.getTitle()).orElse("")));

    // 内容差异
    diff.setContentDiff(
        computeTextDiff(
            Optional.ofNullable(v1.getContentSnapshot()).orElse(""),
            Optional.ofNullable(v2.getContentSnapshot()).orElse("")));

    // 标签差异
    diff.setTagsDiff(
        computeTextDiff(
            Optional.ofNullable(v1.getTags()).orElse(""),
            Optional.ofNullable(v2.getTags()).orElse("")));

    return diff;
  }

  /**
   * 发布草稿 将草稿状态的知识内容发布为正常内容 创建版本历史记录
   *
   * @param id 知识内容ID
   * @param operatorId 操作者ID
   * @return 发布后的知识内容DTO
   * @throws BusinessException 内容不存在、不是草稿状态或权限不足时抛出
   */
  @Override
  public KnowledgeItemDTO publishDraft(Long id, Long operatorId) {
    KnowledgeItem knowledgeItem =
        knowledgeItemRepository
            .findById(id)
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

  /**
   * 保存草稿 将请求内容保存为草稿状态
   *
   * @param request 创建请求参数
   * @param uploaderId 上传者ID
   * @return 保存的草稿DTO
   */
  @Override
  public KnowledgeItemDTO saveDraft(CreateKnowledgeRequest request, Long uploaderId) {
    request.setStatus(2); // 设置为草稿状态
    return create(request, uploaderId);
  }

  /**
   * 获取用户草稿 分页查询指定用户的草稿内容
   *
   * @param uploaderId 上传者ID
   * @param pageable 分页参数
   * @return 草稿内容DTO分页结果
   */
  @Override
  @Transactional(readOnly = true)
  public Page<KnowledgeItemDTO> getUserDrafts(Long uploaderId, Pageable pageable) {
    Page<KnowledgeItem> drafts =
        knowledgeItemRepository.findByUploaderIdAndStatus(uploaderId, 2, pageable);

    List<KnowledgeItemDTO> dtos =
        drafts.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, drafts.getTotalElements());
  }

  /**
   * 批量更新状态 批量更新多个知识内容的状态
   *
   * @param ids 知识内容ID列表
   * @param status 新状态
   * @param operatorId 操作者ID
   */
  @Override
  public void batchUpdateStatus(List<Long> ids, Integer status, Long operatorId) {
    knowledgeItemRepository.updateStatusByIds(ids, status);

    logger.info(
        "Batch updated status to {} for {} items by user {}", status, ids.size(), operatorId);
  }

  /**
   * 获取知识内容统计信息 包括总数、发布数、草稿数、删除数以及浏览、点赞等统计数据
   *
   * @return 知识内容统计信息
   */
  @Override
  @Transactional(readOnly = true)
  public KnowledgeStats getKnowledgeStats() {
    try {
      String sql =
          """
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
          ((Number) result[7]).longValue());
    } catch (Exception e) {
      logger.error("获取知识统计信息失败", e);
      return new KnowledgeStats(0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L);
    }
  }

  /**
   * 获取用户知识内容统计信息 包括用户发布的数量、草稿数以及浏览、点赞等统计数据
   *
   * @param userId 用户ID
   * @return 用户知识内容统计信息
   */
  @Override
  @Transactional(readOnly = true)
  public UserKnowledgeStats getUserKnowledgeStats(Long userId) {
    try {
      String sql =
          """
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

      Object[] result =
          (Object[]) entityManager.createNativeQuery(sql).setParameter(1, userId).getSingleResult();

      return new UserKnowledgeStats(
          ((Number) result[0]).longValue(),
          ((Number) result[1]).longValue(),
          ((Number) result[2]).longValue(),
          ((Number) result[3]).longValue(),
          ((Number) result[4]).longValue(),
          ((Number) result[5]).longValue(),
          ((Number) result[6]).doubleValue());
    } catch (Exception e) {
      logger.error("获取用户知识统计信息失败", e);
      return new UserKnowledgeStats(0L, 0L, 0L, 0L, 0L, 0L, 0.0);
    }
  }

  // ========== 辅助方法 ==========

  /** 为单个知识内容DTO添加用户互动状态 */
  private void enrichWithUserInteractionStatus(KnowledgeItemDTO dto, Long userId) {
    if (userId == null || dto == null) {
      return;
    }

    try {
      List<UserInteraction> interactions =
          userInteractionRepository.findByKnowledgeIdAndUserId(dto.getId(), userId);

      Map<UserInteraction.InteractionType, UserInteraction> interactionMap =
          interactions.stream()
              .collect(
                  Collectors.toMap(
                      UserInteraction::getInteractionType,
                      interaction -> interaction,
                      (existing, replacement) -> existing));

      dto.setUserLiked(interactionMap.containsKey(UserInteraction.InteractionType.LIKE));
      dto.setUserFavorited(interactionMap.containsKey(UserInteraction.InteractionType.FAVORITE));
    } catch (Exception e) {
      logger.warn("获取用户互动状态失败: " + e.getMessage());
      dto.setUserLiked(false);
      dto.setUserFavorited(false);
    }
  }

  /** 批量为知识内容DTO添加用户互动状态 */
  private void batchEnrichWithUserInteractionStatus(List<KnowledgeItemDTO> dtos, Long userId) {
    if (userId == null || dtos == null || dtos.isEmpty()) {
      return;
    }

    try {
      List<Long> knowledgeIds =
          dtos.stream().map(KnowledgeItemDTO::getId).collect(Collectors.toList());

      // 一次查询获取所有互动状态
      List<UserInteraction> interactions =
          userInteractionRepository.findByKnowledgeIdInAndUserId(knowledgeIds, userId);

      // 按知识ID和互动类型分组
      Map<Long, Map<UserInteraction.InteractionType, Boolean>> statusMap =
          interactions.stream()
              .collect(
                  Collectors.groupingBy(
                      UserInteraction::getKnowledgeId,
                      Collectors.toMap(
                          UserInteraction::getInteractionType,
                          interaction -> true,
                          (a, b) -> true)));

      // 设置状态
      dtos.forEach(
          dto -> {
            Map<UserInteraction.InteractionType, Boolean> userStatus =
                statusMap.getOrDefault(dto.getId(), new HashMap<>());
            dto.setUserLiked(userStatus.getOrDefault(UserInteraction.InteractionType.LIKE, false));
            dto.setUserFavorited(
                userStatus.getOrDefault(UserInteraction.InteractionType.FAVORITE, false));
          });
    } catch (Exception e) {
      logger.warn("批量获取用户互动状态失败: " + e.getMessage());
      // 设置默认值
      dtos.forEach(
          dto -> {
            dto.setUserLiked(false);
            dto.setUserFavorited(false);
          });
    }
  }

  /** 获取用户偏好标签 */
  private List<String> getUserPreferredTags(Long userId) {
    try {
      // 基于用户点赞和收藏的内容分析偏好标签
      String sql =
          """
                SELECT ki.tags
                FROM knowledge_items ki
                INNER JOIN user_interactions ui ON ki.id = ui.knowledge_id
                WHERE ui.user_id = ? AND ui.interaction_type IN ('LIKE', 'FAVORITE')
                AND ki.tags IS NOT NULL AND ki.tags != ''
                ORDER BY ui.created_at DESC
                LIMIT 50
                """;

      @SuppressWarnings("unchecked")
      List<String> tagStrings =
          entityManager.createNativeQuery(sql).setParameter(1, userId).getResultList();

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

  /** 基于内容的推荐 */
  private List<KnowledgeItem> getContentBasedRecommendations(
      List<String> preferredTags, int limit) {
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

      String sql =
          String.format(
              """
                SELECT DISTINCT ki.*
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                WHERE ki.status = 1 AND (%s)
                ORDER BY COALESCE(ks.score, 0) DESC, ki.created_at DESC
                LIMIT %d
                """,
              tagConditions.toString(), limit);

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

  /** 获取热门内容用于推荐 */
  private List<KnowledgeItem> getPopularContentForRecommendation(int limit) {
    if (limit <= 0) {
      return new ArrayList<>();
    }

    try {
      String sql =
          """
                SELECT ki.*
                FROM knowledge_items ki
                LEFT JOIN knowledge_stats ks ON ki.id = ks.knowledge_id
                WHERE ki.status = 1
                ORDER BY COALESCE(ks.views_count, 0) + COALESCE(ks.likes_count, 0) * 2 + COALESCE(ks.favorites_count, 0) * 3 DESC,
                         ki.created_at DESC
                LIMIT ?
                """;

      @SuppressWarnings("unchecked")
      List<KnowledgeItem> results =
          entityManager
              .createNativeQuery(sql, KnowledgeItem.class)
              .setParameter(1, limit)
              .getResultList();
      return results;

    } catch (Exception e) {
      logger.warn("获取热门内容失败: " + e.getMessage());
      return new ArrayList<>();
    }
  }

  /** 计算文本差异 */
  private List<String> computeTextDiff(String text1, String text2) {
    try {
      List<String> lines1 = Arrays.asList(text1.split("\n"));
      List<String> lines2 = Arrays.asList(text2.split("\n"));

      Patch<String> patch = DiffUtils.diff(lines1, lines2);

      return patch.getDeltas().stream()
          .map(
              delta -> {
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
