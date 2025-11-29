package com.example.educhain.service.impl;

import com.example.educhain.dto.*;
import com.example.educhain.entity.Tag;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.TagRepository;
import com.example.educhain.repository.UserRepository;
import com.example.educhain.service.TagService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 标签服务实现类 */
@Service
@Transactional
public class TagServiceImpl implements TagService {

  private static final Logger logger = LoggerFactory.getLogger(TagServiceImpl.class);

  @Autowired private TagRepository tagRepository;

  @Autowired private UserRepository userRepository;

  @Override
  public TagDTO create(CreateTagRequest request, Long creatorId) {
    validateCreateRequest(request, creatorId);

    // 检查名称唯一性
    if (!isNameUnique(request.getName(), null)) {
      throw new BusinessException("TAG_NAME_EXISTS", "标签名称已存在");
    }

    // 创建标签
    Tag tag = new Tag();
    tag.setName(request.getName());
    tag.setDescription(request.getDescription());
    tag.setCategory(request.getCategory());
    tag.setColor(request.getColor());
    tag.setCreatorId(creatorId);
    tag.setStatus(1); // 默认为正常状态

    Tag savedTag = tagRepository.save(tag);

    logger.info(
        "Tag created: {} (ID: {}) by user {}", savedTag.getName(), savedTag.getId(), creatorId);

    return convertToDTO(savedTag);
  }

  @Override
  public TagDTO update(Long id, UpdateTagRequest request) {
    Tag tag =
        tagRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));

    boolean hasChanges = false;

    // 更新名称
    if (request.getName() != null && !request.getName().equals(tag.getName())) {
      if (!isNameUnique(request.getName(), id)) {
        throw new BusinessException("TAG_NAME_EXISTS", "标签名称已存在");
      }
      tag.setName(request.getName());
      hasChanges = true;
    }

    // 更新描述
    if (request.getDescription() != null
        && !request.getDescription().equals(tag.getDescription())) {
      tag.setDescription(request.getDescription());
      hasChanges = true;
    }

    // 更新分类
    if (request.getCategory() != null && !request.getCategory().equals(tag.getCategory())) {
      tag.setCategory(request.getCategory());
      hasChanges = true;
    }

    // 更新颜色
    if (request.getColor() != null && !request.getColor().equals(tag.getColor())) {
      tag.setColor(request.getColor());
      hasChanges = true;
    }

    // 更新状态
    if (request.getStatus() != null && !request.getStatus().equals(tag.getStatus())) {
      tag.setStatus(request.getStatus());
      hasChanges = true;
    }

    if (hasChanges) {
      Tag updatedTag = tagRepository.save(tag);
      logger.info("Tag updated: {} (ID: {})", updatedTag.getName(), updatedTag.getId());
    }

    return convertToDTO(tag);
  }

  @Override
  public void delete(Long id) {
    Tag tag =
        tagRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));

    // 检查是否还在使用中
    if (tag.getUsageCount() > 0) {
      throw new BusinessException("TAG_IN_USE", "标签正在使用中，不能删除");
    }

    tagRepository.delete(tag);

    logger.info("Tag deleted: {} (ID: {})", tag.getName(), tag.getId());
  }

  @Override
  @Transactional(readOnly = true)
  public TagDTO findById(Long id) {
    Tag tag =
        tagRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));

    return convertToDTO(tag);
  }

  @Override
  @Transactional(readOnly = true)
  public TagDTO findByName(String name) {
    Tag tag =
        tagRepository
            .findByNameAndStatus(name, 1)
            .orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));

    return convertToDTO(tag);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<TagDTO> findAll(Pageable pageable) {
    Page<Tag> tags = tagRepository.findAll(pageable);

    List<TagDTO> dtos =
        tags.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, tags.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public List<TagDTO> findByCategory(String category) {
    List<Tag> tags = tagRepository.findByCategoryAndStatus(category, 1);

    return tags.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public Page<TagDTO> findByCreator(Long creatorId, Pageable pageable) {
    Page<Tag> tags = tagRepository.findByCreatorIdAndStatus(creatorId, 1, pageable);

    List<TagDTO> dtos =
        tags.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, tags.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public Page<TagDTO> searchTags(String keyword, Pageable pageable) {
    Page<Tag> tags = tagRepository.findByNameContainingIgnoreCaseAndStatus(keyword, 1, pageable);

    List<TagDTO> dtos =
        tags.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, tags.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public List<TagDTO> getPopularTags(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    Page<Tag> tags = tagRepository.findPopularTags(1, pageable);

    return tags.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<TagDTO> getRecentlyUsedTags(int limit) {
    LocalDateTime since = LocalDateTime.now().minusDays(30); // 最近30天
    Pageable pageable = PageRequest.of(0, limit);
    Page<Tag> tags = tagRepository.findRecentlyUsedTags(1, since, pageable);

    return tags.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<TagDTO> getSuggestedTags(String keyword, int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    List<Tag> tags = tagRepository.findSuggestedTags(keyword, 1, pageable);

    return tags.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getAllCategories() {
    return tagRepository.findAllCategories(1);
  }

  @Override
  @Transactional(readOnly = true)
  public TagStats getTagStats() {
    Long totalTags = tagRepository.count();
    Long totalUsageCount = tagRepository.getTotalUsageCount(1);
    Double averageUsageCount = tagRepository.getAverageUsageCount(1);

    // 计算活跃和非活跃标签数量
    LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
    Long activeTags =
        tagRepository
            .findRecentlyUsedTags(1, thirtyDaysAgo, PageRequest.of(0, Integer.MAX_VALUE))
            .getTotalElements();
    Long inactiveTags = totalTags - activeTags;

    return new TagStats(
        totalTags,
        activeTags,
        inactiveTags,
        totalUsageCount != null ? totalUsageCount : 0L,
        averageUsageCount != null ? averageUsageCount : 0.0);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CategoryStats> getCategoryStats() {
    List<Object[]> results = tagRepository.countTagsByCategory(1);

    return results.stream()
        .map(row -> new CategoryStats((String) row[0], (Long) row[1]))
        .collect(Collectors.toList());
  }

  @Override
  public void incrementUsageCount(Long tagId) {
    tagRepository.incrementUsageCount(tagId, LocalDateTime.now());
    logger.debug("Incremented usage count for tag: {}", tagId);
  }

  @Override
  public void decrementUsageCount(Long tagId) {
    tagRepository.decrementUsageCount(tagId);
    logger.debug("Decremented usage count for tag: {}", tagId);
  }

  @Override
  public void batchIncrementUsageCount(List<String> tagNames) {
    if (tagNames != null && !tagNames.isEmpty()) {
      tagRepository.incrementUsageCountByNames(tagNames, LocalDateTime.now());
      logger.debug("Batch incremented usage count for {} tags", tagNames.size());
    }
  }

  @Override
  public void batchDecrementUsageCount(List<String> tagNames) {
    if (tagNames != null && !tagNames.isEmpty()) {
      tagRepository.decrementUsageCountByNames(tagNames);
      logger.debug("Batch decremented usage count for {} tags", tagNames.size());
    }
  }

  @Override
  public int cleanupUnusedTags(int daysThreshold) {
    LocalDateTime before = LocalDateTime.now().minusDays(daysThreshold);
    int cleanedCount = tagRepository.cleanupUnusedTags(before);

    logger.info("Cleaned up {} unused tags older than {} days", cleanedCount, daysThreshold);

    return cleanedCount;
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isNameUnique(String name, Long excludeId) {
    Optional<Tag> existingTag = tagRepository.findByName(name);

    if (existingTag.isEmpty()) {
      return true;
    }

    return excludeId != null && existingTag.get().getId().equals(excludeId);
  }

  @Override
  public List<TagDTO> createTagsIfNotExist(List<String> tagNames, Long creatorId) {
    List<TagDTO> result = new ArrayList<>();

    for (String tagName : tagNames) {
      tagName = tagName.trim();
      if (tagName.isEmpty()) {
        continue;
      }

      Optional<Tag> existingTag = tagRepository.findByNameAndStatus(tagName, 1);
      if (existingTag.isPresent()) {
        result.add(convertToDTO(existingTag.get()));
      } else {
        // 创建新标签
        CreateTagRequest request = new CreateTagRequest();
        request.setName(tagName);
        request.setCategory("用户标签");

        try {
          TagDTO newTag = create(request, creatorId);
          result.add(newTag);
        } catch (Exception e) {
          logger.error("Failed to create tag: {}", tagName, e);
        }
      }
    }

    return result;
  }

  // 私有辅助方法
  private void validateCreateRequest(CreateTagRequest request, Long creatorId) {
    if (request == null) {
      throw new BusinessException("INVALID_REQUEST", "请求参数不能为空");
    }

    if (request.getName() == null || request.getName().trim().isEmpty()) {
      throw new BusinessException("TAG_NAME_REQUIRED", "标签名称不能为空");
    }

    if (creatorId == null) {
      throw new BusinessException("INVALID_USER", "用户ID不能为空");
    }

    // 验证用户是否存在
    if (!userRepository.existsById(creatorId)) {
      throw new BusinessException("USER_NOT_FOUND", "用户不存在");
    }
  }

  private TagDTO convertToDTO(Tag tag) {
    TagDTO dto = new TagDTO();
    dto.setId(tag.getId());
    dto.setName(tag.getName());
    dto.setDescription(tag.getDescription());
    dto.setUsageCount(tag.getUsageCount());
    dto.setCategory(tag.getCategory());
    dto.setColor(tag.getColor());
    dto.setStatus(tag.getStatus());
    dto.setCreatorId(tag.getCreatorId());
    dto.setLastUsedAt(tag.getLastUsedAt());
    dto.setCreatedAt(tag.getCreatedAt());
    dto.setUpdatedAt(tag.getUpdatedAt());

    // 设置状态文本
    dto.setStatusText(getStatusText(tag.getStatus()));

    // 设置创建者名称
    if (tag.getCreatorId() != null) {
      userRepository
          .findById(tag.getCreatorId())
          .ifPresent(
              user -> {
                dto.setCreatorName(user.getFullName());
              });
    }

    return dto;
  }

  private String getStatusText(Integer status) {
    switch (status) {
      case 0:
        return "禁用";
      case 1:
        return "正常";
      default:
        return "未知";
    }
  }
}
