package com.example.educhain.service;

import com.example.educhain.dto.*;
import com.example.educhain.entity.KnowledgeItem;
import com.example.educhain.entity.KnowledgeVersion;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/** 知识内容服务接口 */
public interface KnowledgeItemService {

  /** 创建知识内容 */
  KnowledgeItemDTO create(CreateKnowledgeRequest request, Long uploaderId);

  /** 创建知识内容（带文件上传） */
  KnowledgeItemDTO createWithFiles(
      CreateKnowledgeRequest request, List<MultipartFile> files, Long uploaderId);

  /** 更新知识内容 */
  KnowledgeItemDTO update(Long id, UpdateKnowledgeRequest request, Long editorId);

  /** 更新知识内容（带文件上传） */
  KnowledgeItemDTO updateWithFiles(
      Long id, UpdateKnowledgeRequest request, List<MultipartFile> files, Long editorId);

  /** 删除知识内容（软删除） */
  void delete(Long id, Long operatorId);

  /** 批量删除知识内容 */
  void batchDelete(List<Long> ids, Long operatorId);

  /** 恢复已删除的知识内容 */
  void restore(Long id, Long operatorId);

  /** 根据ID获取知识内容详情 */
  KnowledgeItemDTO findById(Long id);

  /** 根据ID获取知识内容详情（包含用户互动状态） */
  KnowledgeItemDTO findByIdWithUserStatus(Long id, Long userId);

  /** 分页查询知识内容 */
  Page<KnowledgeItemDTO> findAll(Pageable pageable, KnowledgeFilter filter);

  /** 分页查询知识内容（包含用户互动状态） */
  Page<KnowledgeItemDTO> findAllWithUserStatus(
      Pageable pageable, KnowledgeFilter filter, Long userId);

  /** 获取用户的知识内容 */
  Page<KnowledgeItemDTO> findByUploader(Long uploaderId, Pageable pageable);

  /** 获取分类下的知识内容 */
  Page<KnowledgeItemDTO> findByCategory(Long categoryId, Pageable pageable);

  /** 根据标签获取知识内容 */
  Page<KnowledgeItemDTO> findByTag(String tag, Pageable pageable);

  /** 搜索知识内容 */
  Page<KnowledgeItemDTO> search(String keyword, Pageable pageable);

  /** 高级搜索知识内容 */
  Page<KnowledgeItemDTO> advancedSearch(KnowledgeFilter filter, Pageable pageable);

  /** 获取热门知识内容 */
  Page<KnowledgeItemDTO> getPopularContent(Pageable pageable);

  /** 获取最新知识内容 */
  Page<KnowledgeItemDTO> getLatestContent(Pageable pageable);

  /** 获取推荐知识内容 */
  Page<KnowledgeItemDTO> getRecommendedContent(Long userId, Pageable pageable);

  /** 获取相关知识内容 */
  List<KnowledgeItemDTO> getRelatedContent(Long knowledgeId, int limit);

  /** 增加浏览量 */
  void incrementViewCount(Long id, String ipAddress);

  /** 获取知识内容的版本历史 */
  Page<KnowledgeVersion> getVersionHistory(Long knowledgeId, Pageable pageable);

  /** 根据版本号获取特定版本 */
  KnowledgeVersion getVersion(Long knowledgeId, Integer versionNumber);

  /** 恢复到指定版本 */
  KnowledgeItemDTO restoreToVersion(
      Long knowledgeId, Integer versionNumber, Long operatorId, String changeSummary);

  /** 比较两个版本的差异 */
  VersionDiff compareVersions(Long knowledgeId, Integer version1, Integer version2);

  /** 发布草稿 */
  KnowledgeItemDTO publishDraft(Long id, Long operatorId);

  /** 保存为草稿 */
  KnowledgeItemDTO saveDraft(CreateKnowledgeRequest request, Long uploaderId);

  /** 获取用户的草稿列表 */
  Page<KnowledgeItemDTO> getUserDrafts(Long uploaderId, Pageable pageable);

  /** 批量更新状态 */
  void batchUpdateStatus(List<Long> ids, Integer status, Long operatorId);

  /** 获取知识内容统计信息 */
  KnowledgeStats getKnowledgeStats();

  /** 获取用户知识内容统计信息 */
  UserKnowledgeStats getUserKnowledgeStats(Long userId);

  /** 处理标签关联 */
  void processTagAssociation(KnowledgeItem knowledgeItem, String oldTags, String newTags);

  /** 版本差异DTO */
  class VersionDiff {
    private KnowledgeVersion version1;
    private KnowledgeVersion version2;
    private List<String> titleDiff;
    private List<String> contentDiff;
    private List<String> tagsDiff;

    // Constructors, getters and setters
    public VersionDiff() {}

    public VersionDiff(KnowledgeVersion version1, KnowledgeVersion version2) {
      this.version1 = version1;
      this.version2 = version2;
    }

    public KnowledgeVersion getVersion1() {
      return version1;
    }

    public void setVersion1(KnowledgeVersion version1) {
      this.version1 = version1;
    }

    public KnowledgeVersion getVersion2() {
      return version2;
    }

    public void setVersion2(KnowledgeVersion version2) {
      this.version2 = version2;
    }

    public List<String> getTitleDiff() {
      return titleDiff;
    }

    public void setTitleDiff(List<String> titleDiff) {
      this.titleDiff = titleDiff;
    }

    public List<String> getContentDiff() {
      return contentDiff;
    }

    public void setContentDiff(List<String> contentDiff) {
      this.contentDiff = contentDiff;
    }

    public List<String> getTagsDiff() {
      return tagsDiff;
    }

    public void setTagsDiff(List<String> tagsDiff) {
      this.tagsDiff = tagsDiff;
    }
  }

  /** 知识内容统计信息 */
  class KnowledgeStats {
    private Long totalCount;
    private Long publishedCount;
    private Long draftCount;
    private Long deletedCount;
    private Long totalViews;
    private Long totalLikes;
    private Long totalFavorites;
    private Long totalComments;

    // Constructors, getters and setters
    public KnowledgeStats() {}

    public KnowledgeStats(
        Long totalCount,
        Long publishedCount,
        Long draftCount,
        Long deletedCount,
        Long totalViews,
        Long totalLikes,
        Long totalFavorites,
        Long totalComments) {
      this.totalCount = totalCount;
      this.publishedCount = publishedCount;
      this.draftCount = draftCount;
      this.deletedCount = deletedCount;
      this.totalViews = totalViews;
      this.totalLikes = totalLikes;
      this.totalFavorites = totalFavorites;
      this.totalComments = totalComments;
    }

    public Long getTotalCount() {
      return totalCount;
    }

    public void setTotalCount(Long totalCount) {
      this.totalCount = totalCount;
    }

    public Long getPublishedCount() {
      return publishedCount;
    }

    public void setPublishedCount(Long publishedCount) {
      this.publishedCount = publishedCount;
    }

    public Long getDraftCount() {
      return draftCount;
    }

    public void setDraftCount(Long draftCount) {
      this.draftCount = draftCount;
    }

    public Long getDeletedCount() {
      return deletedCount;
    }

    public void setDeletedCount(Long deletedCount) {
      this.deletedCount = deletedCount;
    }

    public Long getTotalViews() {
      return totalViews;
    }

    public void setTotalViews(Long totalViews) {
      this.totalViews = totalViews;
    }

    public Long getTotalLikes() {
      return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
      this.totalLikes = totalLikes;
    }

    public Long getTotalFavorites() {
      return totalFavorites;
    }

    public void setTotalFavorites(Long totalFavorites) {
      this.totalFavorites = totalFavorites;
    }

    public Long getTotalComments() {
      return totalComments;
    }

    public void setTotalComments(Long totalComments) {
      this.totalComments = totalComments;
    }
  }

  /** 用户知识内容统计信息 */
  class UserKnowledgeStats {
    private Long publishedCount;
    private Long draftCount;
    private Long totalViews;
    private Long totalLikes;
    private Long totalFavorites;
    private Long totalComments;
    private Double averageQualityScore;

    // Constructors, getters and setters
    public UserKnowledgeStats() {}

    public UserKnowledgeStats(
        Long publishedCount,
        Long draftCount,
        Long totalViews,
        Long totalLikes,
        Long totalFavorites,
        Long totalComments,
        Double averageQualityScore) {
      this.publishedCount = publishedCount;
      this.draftCount = draftCount;
      this.totalViews = totalViews;
      this.totalLikes = totalLikes;
      this.totalFavorites = totalFavorites;
      this.totalComments = totalComments;
      this.averageQualityScore = averageQualityScore;
    }

    public Long getPublishedCount() {
      return publishedCount;
    }

    public void setPublishedCount(Long publishedCount) {
      this.publishedCount = publishedCount;
    }

    public Long getDraftCount() {
      return draftCount;
    }

    public void setDraftCount(Long draftCount) {
      this.draftCount = draftCount;
    }

    public Long getTotalViews() {
      return totalViews;
    }

    public void setTotalViews(Long totalViews) {
      this.totalViews = totalViews;
    }

    public Long getTotalLikes() {
      return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
      this.totalLikes = totalLikes;
    }

    public Long getTotalFavorites() {
      return totalFavorites;
    }

    public void setTotalFavorites(Long totalFavorites) {
      this.totalFavorites = totalFavorites;
    }

    public Long getTotalComments() {
      return totalComments;
    }

    public void setTotalComments(Long totalComments) {
      this.totalComments = totalComments;
    }

    public Double getAverageQualityScore() {
      return averageQualityScore;
    }

    public void setAverageQualityScore(Double averageQualityScore) {
      this.averageQualityScore = averageQualityScore;
    }
  }
}
