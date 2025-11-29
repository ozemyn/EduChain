package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.entity.KnowledgeVersion;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.KnowledgeItemService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** 知识内容控制器 提供知识内容的创建、查询、更新、删除、版本管理等完整的CRUD功能 支持文件上传、版本历史查询、草稿管理等高级功能 */
@RestController
@RequestMapping("/knowledge")
@Tag(name = "知识内容管理", description = "知识内容的CRUD操作、版本管理、文件上传等功能")
public class KnowledgeItemController {

  @Autowired private KnowledgeItemService knowledgeItemService;

  /**
   * 创建知识内容接口 创建新的知识内容，支持文本、链接、媒体等多种类型
   *
   * @param request 创建请求，包含标题、内容、类型、分类等必填信息
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 创建成功的知识内容信息
   */
  @PostMapping
  @Operation(summary = "创建知识内容", description = "创建新的知识内容")
  public ResponseEntity<Result<KnowledgeItemDTO>> create(
      @Valid @RequestBody CreateKnowledgeRequest request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.create(request, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/with-files")
  @Operation(summary = "创建知识内容（带文件上传）", description = "创建知识内容并上传相关文件")
  public ResponseEntity<Result<KnowledgeItemDTO>> createWithFiles(
      @Valid @RequestPart("request") CreateKnowledgeRequest request,
      @RequestPart(value = "files", required = false) List<MultipartFile> files,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.createWithFiles(request, files, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @PutMapping("/{id}")
  @Operation(summary = "更新知识内容", description = "更新指定的知识内容")
  public ResponseEntity<Result<KnowledgeItemDTO>> update(
      @PathVariable Long id,
      @Valid @RequestBody UpdateKnowledgeRequest request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.update(id, request, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @PutMapping("/{id}/with-files")
  @Operation(summary = "更新知识内容（带文件上传）", description = "更新知识内容并上传新文件")
  public ResponseEntity<Result<KnowledgeItemDTO>> updateWithFiles(
      @PathVariable Long id,
      @Valid @RequestPart("request") UpdateKnowledgeRequest request,
      @RequestPart(value = "files", required = false) List<MultipartFile> files,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.updateWithFiles(id, request, files, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "删除知识内容", description = "软删除指定的知识内容")
  public ResponseEntity<Result<Void>> delete(
      @PathVariable Long id,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    knowledgeItemService.delete(id, principal.getId());
    return ResponseEntity.ok(Result.success());
  }

  @PostMapping("/batch-delete")
  @Operation(summary = "批量删除知识内容", description = "批量软删除多个知识内容")
  public ResponseEntity<Result<Void>> batchDelete(
      @RequestBody List<Long> ids,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    knowledgeItemService.batchDelete(ids, principal.getId());
    return ResponseEntity.ok(Result.success());
  }

  @PutMapping("/{id}/restore")
  @Operation(summary = "恢复知识内容", description = "恢复已删除的知识内容")
  public ResponseEntity<Result<Void>> restore(
      @PathVariable Long id,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    knowledgeItemService.restore(id, principal.getId());
    return ResponseEntity.ok(Result.success());
  }

  @GetMapping("/{id}")
  @Operation(summary = "获取知识内容详情", description = "根据ID获取知识内容的详细信息")
  public ResponseEntity<Result<KnowledgeItemDTO>> findById(
      @PathVariable Long id,
      Authentication authentication,
      HttpServletRequest request) {

    Long userId = getUserId(authentication);
    KnowledgeItemDTO result = (userId != null)
        ? knowledgeItemService.findByIdWithUserStatus(id, userId)
        : knowledgeItemService.findById(id);

    // 增加浏览量
    knowledgeItemService.incrementViewCount(id, getClientIpAddress(request));
    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping
  @Operation(summary = "分页查询知识内容", description = "根据条件分页查询知识内容列表")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> findAll(
      @PageableDefault(size = 20) Pageable pageable,
      @Parameter(description = "筛选条件") KnowledgeFilter filter,
      Authentication authentication) {

    Long userId = getUserId(authentication);
    Page<KnowledgeItemDTO> result = (userId != null)
        ? knowledgeItemService.findAllWithUserStatus(pageable, filter, userId)
        : knowledgeItemService.findAll(pageable, filter);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/user/{userId}")
  @Operation(summary = "获取用户的知识内容", description = "获取指定用户发布的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> findByUploader(
      @PathVariable Long userId, @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.findByUploader(userId, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/category/{categoryId}")
  @Operation(summary = "获取分类下的知识内容", description = "获取指定分类下的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> findByCategory(
      @PathVariable Long categoryId, @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.findByCategory(categoryId, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/tag/{tag}")
  @Operation(summary = "根据标签获取知识内容", description = "获取包含指定标签的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> findByTag(
      @PathVariable String tag, @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.findByTag(tag, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/search")
  @Operation(summary = "搜索知识内容", description = "根据关键词搜索知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> search(
      @RequestParam String keyword, @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.search(keyword, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/advanced-search")
  @Operation(summary = "高级搜索", description = "根据多个条件进行高级搜索")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> advancedSearch(
      @RequestBody KnowledgeFilter filter, @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.advancedSearch(filter, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/popular")
  @Operation(summary = "获取热门内容", description = "获取热门的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> getPopularContent(
      @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.getPopularContent(pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/latest")
  @Operation(summary = "获取最新内容", description = "获取最新发布的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> getLatestContent(
      @PageableDefault(size = 20) Pageable pageable) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.getLatestContent(pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/recommended")
  @Operation(summary = "获取推荐内容", description = "获取个性化推荐的知识内容")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> getRecommendedContent(
      @PageableDefault(size = 20) Pageable pageable,
      Authentication authentication) {

    Long userId = getUserId(authentication);
    Page<KnowledgeItemDTO> result = knowledgeItemService.getRecommendedContent(userId, pageable);
    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/{id}/related")
  @Operation(summary = "获取相关内容", description = "获取与指定内容相关的其他内容")
  public ResponseEntity<Result<List<KnowledgeItemDTO>>> getRelatedContent(
      @PathVariable Long id, @RequestParam(defaultValue = "10") int limit) {

    List<KnowledgeItemDTO> result = knowledgeItemService.getRelatedContent(id, limit);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/{id}/versions")
  @Operation(summary = "获取版本历史", description = "获取知识内容的版本历史")
  public ResponseEntity<Result<Page<KnowledgeVersion>>> getVersionHistory(
      @PathVariable Long id, @PageableDefault(size = 10) Pageable pageable) {

    Page<KnowledgeVersion> result = knowledgeItemService.getVersionHistory(id, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/{id}/versions/{versionNumber}")
  @Operation(summary = "获取指定版本", description = "获取知识内容的指定版本")
  public ResponseEntity<Result<KnowledgeVersion>> getVersion(
      @PathVariable Long id, @PathVariable Integer versionNumber) {

    KnowledgeVersion result = knowledgeItemService.getVersion(id, versionNumber);

    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/{id}/restore-version")
  @Operation(summary = "恢复到指定版本", description = "将知识内容恢复到指定版本")
  public ResponseEntity<Result<KnowledgeItemDTO>> restoreToVersion(
      @PathVariable Long id,
      @RequestParam Integer versionNumber,
      @RequestParam(required = false) String changeSummary,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.restoreToVersion(
        id, versionNumber, principal.getId(), changeSummary);
    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/{id}/compare-versions")
  @Operation(summary = "比较版本差异", description = "比较两个版本之间的差异")
  public ResponseEntity<Result<KnowledgeItemService.VersionDiff>> compareVersions(
      @PathVariable Long id, @RequestParam Integer version1, @RequestParam Integer version2) {

    KnowledgeItemService.VersionDiff result =
        knowledgeItemService.compareVersions(id, version1, version2);

    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/drafts")
  @Operation(summary = "保存草稿", description = "保存知识内容为草稿")
  public ResponseEntity<Result<KnowledgeItemDTO>> saveDraft(
      @Valid @RequestBody CreateKnowledgeRequest request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.saveDraft(request, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/{id}/publish")
  @Operation(summary = "发布草稿", description = "将草稿发布为正式内容")
  public ResponseEntity<Result<KnowledgeItemDTO>> publishDraft(
      @PathVariable Long id,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    KnowledgeItemDTO result = knowledgeItemService.publishDraft(id, principal.getId());
    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/drafts")
  @Operation(summary = "获取用户草稿", description = "获取当前用户的草稿列表")
  public ResponseEntity<Result<Page<KnowledgeItemDTO>>> getUserDrafts(
      @PageableDefault(size = 20) Pageable pageable,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    Page<KnowledgeItemDTO> result = knowledgeItemService.getUserDrafts(principal.getId(), pageable);
    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/batch-update-status")
  @Operation(summary = "批量更新状态", description = "批量更新多个知识内容的状态")
  public ResponseEntity<Result<Void>> batchUpdateStatus(
      @RequestBody BatchUpdateStatusRequest request,
      @AuthenticationPrincipal CustomUserDetailsService.CustomUserPrincipal principal) {

    knowledgeItemService.batchUpdateStatus(request.getIds(), request.getStatus(), principal.getId());
    return ResponseEntity.ok(Result.success());
  }

  @GetMapping("/stats")
  @Operation(summary = "获取知识内容统计", description = "获取知识内容的统计信息")
  public ResponseEntity<Result<KnowledgeItemService.KnowledgeStats>> getKnowledgeStats() {
    KnowledgeItemService.KnowledgeStats result = knowledgeItemService.getKnowledgeStats();

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/user-stats/{userId}")
  @Operation(summary = "获取用户知识内容统计", description = "获取指定用户的知识内容统计信息")
  public ResponseEntity<Result<KnowledgeItemService.UserKnowledgeStats>> getUserKnowledgeStats(
      @PathVariable Long userId) {

    KnowledgeItemService.UserKnowledgeStats result =
        knowledgeItemService.getUserKnowledgeStats(userId);

    return ResponseEntity.ok(Result.success(result));
  }

  // 私有辅助方法 - 高性能获取用户ID（仅用于可选认证场景）
  private Long getUserId(Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
        return ((CustomUserDetailsService.CustomUserPrincipal) principal).getId();
      }
    }
    return null;
  }

  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      return xForwardedFor.split(",")[0].trim();
    }

    String xRealIp = request.getHeader("X-Real-IP");
    if (xRealIp != null && !xRealIp.isEmpty()) {
      return xRealIp;
    }

    return request.getRemoteAddr();
  }

  /** 批量更新状态请求DTO */
  public static class BatchUpdateStatusRequest {
    private List<Long> ids;
    private Integer status;

    public List<Long> getIds() {
      return ids;
    }

    public void setIds(List<Long> ids) {
      this.ids = ids;
    }

    public Integer getStatus() {
      return status;
    }

    public void setStatus(Integer status) {
      this.status = status;
    }
  }
}
