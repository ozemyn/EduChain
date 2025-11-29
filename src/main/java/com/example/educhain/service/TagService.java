package com.example.educhain.service;

import com.example.educhain.dto.CreateTagRequest;
import com.example.educhain.dto.TagDTO;
import com.example.educhain.dto.UpdateTagRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 标签服务接口 */
public interface TagService {

  /** 创建标签 */
  TagDTO create(CreateTagRequest request, Long creatorId);

  /** 更新标签 */
  TagDTO update(Long id, UpdateTagRequest request);

  /** 删除标签 */
  void delete(Long id);

  /** 根据ID获取标签 */
  TagDTO findById(Long id);

  /** 根据名称获取标签 */
  TagDTO findByName(String name);

  /** 获取所有标签 */
  Page<TagDTO> findAll(Pageable pageable);

  /** 根据分类获取标签 */
  List<TagDTO> findByCategory(String category);

  /** 根据创建者获取标签 */
  Page<TagDTO> findByCreator(Long creatorId, Pageable pageable);

  /** 搜索标签 */
  Page<TagDTO> searchTags(String keyword, Pageable pageable);

  /** 获取热门标签 */
  List<TagDTO> getPopularTags(int limit);

  /** 获取最近使用的标签 */
  List<TagDTO> getRecentlyUsedTags(int limit);

  /** 获取标签建议 */
  List<TagDTO> getSuggestedTags(String keyword, int limit);

  /** 获取所有标签分类 */
  List<String> getAllCategories();

  /** 获取标签统计信息 */
  TagStats getTagStats();

  /** 获取分类统计信息 */
  List<CategoryStats> getCategoryStats();

  /** 增加标签使用次数 */
  void incrementUsageCount(Long tagId);

  /** 减少标签使用次数 */
  void decrementUsageCount(Long tagId);

  /** 批量增加标签使用次数 */
  void batchIncrementUsageCount(List<String> tagNames);

  /** 批量减少标签使用次数 */
  void batchDecrementUsageCount(List<String> tagNames);

  /** 清理未使用的标签 */
  int cleanupUnusedTags(int daysThreshold);

  /** 检查标签名称是否唯一 */
  boolean isNameUnique(String name, Long excludeId);

  /** 自动创建标签（如果不存在） */
  List<TagDTO> createTagsIfNotExist(List<String> tagNames, Long creatorId);

  /** 标签统计信息 */
  class TagStats {
    private Long totalTags;
    private Long activeTags;
    private Long inactiveTags;
    private Long totalUsageCount;
    private Double averageUsageCount;

    public TagStats() {}

    public TagStats(
        Long totalTags,
        Long activeTags,
        Long inactiveTags,
        Long totalUsageCount,
        Double averageUsageCount) {
      this.totalTags = totalTags;
      this.activeTags = activeTags;
      this.inactiveTags = inactiveTags;
      this.totalUsageCount = totalUsageCount;
      this.averageUsageCount = averageUsageCount;
    }

    public Long getTotalTags() {
      return totalTags;
    }

    public void setTotalTags(Long totalTags) {
      this.totalTags = totalTags;
    }

    public Long getActiveTags() {
      return activeTags;
    }

    public void setActiveTags(Long activeTags) {
      this.activeTags = activeTags;
    }

    public Long getInactiveTags() {
      return inactiveTags;
    }

    public void setInactiveTags(Long inactiveTags) {
      this.inactiveTags = inactiveTags;
    }

    public Long getTotalUsageCount() {
      return totalUsageCount;
    }

    public void setTotalUsageCount(Long totalUsageCount) {
      this.totalUsageCount = totalUsageCount;
    }

    public Double getAverageUsageCount() {
      return averageUsageCount;
    }

    public void setAverageUsageCount(Double averageUsageCount) {
      this.averageUsageCount = averageUsageCount;
    }
  }

  /** 分类统计信息 */
  class CategoryStats {
    private String category;
    private Long tagCount;

    public CategoryStats() {}

    public CategoryStats(String category, Long tagCount) {
      this.category = category;
      this.tagCount = tagCount;
    }

    public String getCategory() {
      return category;
    }

    public void setCategory(String category) {
      this.category = category;
    }

    public Long getTagCount() {
      return tagCount;
    }

    public void setTagCount(Long tagCount) {
      this.tagCount = tagCount;
    }
  }
}
