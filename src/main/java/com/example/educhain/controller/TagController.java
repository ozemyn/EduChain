package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.CustomUserDetailsService;
import com.example.educhain.service.TagService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** 标签管理控制器 提供标签的完整CRUD操作、统计信息、热门标签查询等功能 支持标签的分类管理、使用统计、搜索等功能 */
@RestController
@RequestMapping("/tags")
@Tag(name = "标签管理", description = "标签的CRUD操作、统计、热门标签等功能")
public class TagController {

  @Autowired private TagService tagService;

  /**
   * 创建标签接口 创建新的标签，验证标签名称唯一性
   *
   * @param request 创建标签请求，包含标签名称、分类等信息
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 创建成功的标签信息
   */
  @PostMapping
  @Operation(summary = "创建标签", description = "创建新的标签")
  public ResponseEntity<Result<TagDTO>> create(
      @Valid @RequestBody CreateTagRequest request, Authentication authentication) {

    Long userId = getUserId(authentication);
    TagDTO result = tagService.create(request, userId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 更新标签接口 更新指定标签的信息，包括名称、描述、分类等
   *
   * @param id 标签ID
   * @param request 更新请求，包含要更新的字段
   * @return 更新后的标签信息
   */
  @PutMapping("/{id}")
  @Operation(summary = "更新标签", description = "更新指定的标签")
  public ResponseEntity<Result<TagDTO>> update(
      @PathVariable Long id, @Valid @RequestBody UpdateTagRequest request) {

    TagDTO result = tagService.update(id, request);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 删除标签接口 删除指定的标签，会检查标签是否被知识内容使用
   *
   * @param id 标签ID
   * @return 删除成功响应
   */
  @DeleteMapping("/{id}")
  @Operation(summary = "删除标签", description = "删除指定的标签（需要检查是否在使用中）")
  public ResponseEntity<Result<Void>> delete(@PathVariable Long id) {
    tagService.delete(id);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 获取标签详情接口 根据标签ID获取标签的详细信息，包括名称、分类、使用次数等
   *
   * @param id 标签ID
   * @return 标签详细信息
   */
  @GetMapping("/{id}")
  @Operation(summary = "获取标签详情", description = "根据ID获取标签的详细信息")
  public ResponseEntity<Result<TagDTO>> findById(@PathVariable Long id) {
    TagDTO result = tagService.findById(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 根据名称获取标签接口 根据标签名称精确匹配获取标签信息
   *
   * @param name 标签名称
   * @return 标签信息
   */
  @GetMapping("/name/{name}")
  @Operation(summary = "根据名称获取标签", description = "根据标签名称获取标签信息")
  public ResponseEntity<Result<TagDTO>> findByName(@PathVariable String name) {
    TagDTO result = tagService.findByName(name);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 分页获取标签接口 分页获取系统中所有标签列表
   *
   * @param pageable 分页参数
   * @return 标签列表（分页）
   */
  @GetMapping
  @Operation(summary = "分页获取标签", description = "分页获取所有标签列表")
  public ResponseEntity<Result<Page<TagDTO>>> findAll(
      @PageableDefault(size = 20) Pageable pageable) {
    Page<TagDTO> result = tagService.findAll(pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 根据分类获取标签接口 获取指定分类下的所有标签列表
   *
   * @param category 标签分类名称
   * @return 该分类下的标签列表
   */
  @GetMapping("/category/{category}")
  @Operation(summary = "根据分类获取标签", description = "获取指定分类下的所有标签")
  public ResponseEntity<Result<List<TagDTO>>> findByCategory(@PathVariable String category) {
    List<TagDTO> result = tagService.findByCategory(category);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取用户创建的标签接口 获取指定用户创建的所有标签，支持分页查询
   *
   * @param creatorId 创建者用户ID
   * @param pageable 分页参数
   * @return 用户创建的标签列表（分页）
   */
  @GetMapping("/creator/{creatorId}")
  @Operation(summary = "获取用户创建的标签", description = "获取指定用户创建的标签列表")
  public ResponseEntity<Result<Page<TagDTO>>> findByCreator(
      @PathVariable Long creatorId, @PageableDefault(size = 20) Pageable pageable) {

    Page<TagDTO> result = tagService.findByCreator(creatorId, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 搜索标签接口 根据关键词搜索标签，支持标签名称的模糊匹配
   *
   * @param keyword 搜索关键词
   * @param pageable 分页参数
   * @return 匹配的标签列表（分页）
   */
  @GetMapping("/search")
  @Operation(summary = "搜索标签", description = "根据关键词搜索标签")
  public ResponseEntity<Result<Page<TagDTO>>> searchTags(
      @RequestParam String keyword, @PageableDefault(size = 20) Pageable pageable) {

    Page<TagDTO> result = tagService.searchTags(keyword, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取热门标签接口 返回使用次数最多的热门标签列表，按使用次数降序排列
   *
   * @param limit 返回数量限制，默认20
   * @return 热门标签列表
   */
  @GetMapping("/popular")
  @Operation(summary = "获取热门标签", description = "获取使用次数最多的热门标签")
  public ResponseEntity<Result<List<TagDTO>>> getPopularTags(
      @RequestParam(defaultValue = "20") int limit) {

    List<TagDTO> result = tagService.getPopularTags(limit);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取最近使用的标签接口 返回最近使用过的标签列表，按最后使用时间倒序排列
   *
   * @param limit 返回数量限制，默认20
   * @return 最近使用的标签列表
   */
  @GetMapping("/recent")
  @Operation(summary = "获取最近使用的标签", description = "获取最近使用过的标签")
  public ResponseEntity<Result<List<TagDTO>>> getRecentlyUsedTags(
      @RequestParam(defaultValue = "20") int limit) {

    List<TagDTO> result = tagService.getRecentlyUsedTags(limit);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取标签建议接口 根据关键词获取标签建议，用于自动完成功能
   *
   * @param keyword 关键词
   * @param limit 返回数量限制，默认10
   * @return 标签建议列表
   */
  @GetMapping("/suggestions")
  @Operation(summary = "获取标签建议", description = "根据关键词获取标签建议")
  public ResponseEntity<Result<List<TagDTO>>> getSuggestedTags(
      @RequestParam String keyword, @RequestParam(defaultValue = "10") int limit) {

    List<TagDTO> result = tagService.getSuggestedTags(keyword, limit);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取所有标签分类接口 返回系统中所有标签分类的列表
   *
   * @return 标签分类列表
   */
  @GetMapping("/categories")
  @Operation(summary = "获取所有标签分类", description = "获取所有标签分类的列表")
  public ResponseEntity<Result<List<String>>> getAllCategories() {
    List<String> result = tagService.getAllCategories();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取标签统计接口 返回标签系统的统计数据，包括总标签数、分类数等
   *
   * @return 标签统计数据
   */
  @GetMapping("/stats")
  @Operation(summary = "获取标签统计", description = "获取标签的统计信息")
  public ResponseEntity<Result<TagService.TagStats>> getTagStats() {
    TagService.TagStats result = tagService.getTagStats();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取分类统计接口 返回各个标签分类的统计信息，包括每个分类的标签数量
   *
   * @return 分类统计数据列表
   */
  @GetMapping("/category-stats")
  @Operation(summary = "获取分类统计", description = "获取各个标签分类的统计信息")
  public ResponseEntity<Result<List<TagService.CategoryStats>>> getCategoryStats() {
    List<TagService.CategoryStats> result = tagService.getCategoryStats();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 增加使用次数接口 增加指定标签的使用次数统计
   *
   * @param id 标签ID
   * @return 操作成功响应
   */
  @PostMapping("/{id}/increment-usage")
  @Operation(summary = "增加使用次数", description = "增加指定标签的使用次数")
  public ResponseEntity<Result<Void>> incrementUsageCount(@PathVariable Long id) {
    tagService.incrementUsageCount(id);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 减少使用次数接口 减少指定标签的使用次数统计
   *
   * @param id 标签ID
   * @return 操作成功响应
   */
  @PostMapping("/{id}/decrement-usage")
  @Operation(summary = "减少使用次数", description = "减少指定标签的使用次数")
  public ResponseEntity<Result<Void>> decrementUsageCount(@PathVariable Long id) {
    tagService.decrementUsageCount(id);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 批量增加使用次数接口 批量增加多个标签的使用次数统计
   *
   * @param tagNames 标签名称列表
   * @return 操作成功响应
   */
  @PostMapping("/batch-increment-usage")
  @Operation(summary = "批量增加使用次数", description = "批量增加多个标签的使用次数")
  public ResponseEntity<Result<Void>> batchIncrementUsageCount(@RequestBody List<String> tagNames) {
    tagService.batchIncrementUsageCount(tagNames);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 批量减少使用次数接口 批量减少多个标签的使用次数统计
   *
   * @param tagNames 标签名称列表
   * @return 操作成功响应
   */
  @PostMapping("/batch-decrement-usage")
  @Operation(summary = "批量减少使用次数", description = "批量减少多个标签的使用次数")
  public ResponseEntity<Result<Void>> batchDecrementUsageCount(@RequestBody List<String> tagNames) {
    tagService.batchDecrementUsageCount(tagNames);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 清理未使用的标签接口 清理指定天数内未使用的标签
   *
   * @param daysThreshold 未使用天数阈值，默认90天
   * @return 清理的标签数量
   */
  @PostMapping("/cleanup")
  @Operation(summary = "清理未使用的标签", description = "清理长时间未使用的标签")
  public ResponseEntity<Result<Integer>> cleanupUnusedTags(
      @RequestParam(defaultValue = "90") int daysThreshold) {

    int cleanedCount = tagService.cleanupUnusedTags(daysThreshold);

    return ResponseEntity.ok(Result.success(cleanedCount));
  }

  /**
   * 验证名称唯一性接口 验证标签名称是否唯一，用于创建或更新标签时的验证
   *
   * @param name 标签名称
   * @param excludeId 排除的标签ID（用于更新时排除自身），可选
   * @return 名称是否唯一（true表示唯一，false表示已存在）
   */
  @GetMapping("/validate/name")
  @Operation(summary = "验证名称唯一性", description = "验证标签名称是否唯一")
  public ResponseEntity<Result<Boolean>> validateName(
      @RequestParam String name, @RequestParam(required = false) Long excludeId) {

    boolean result = tagService.isNameUnique(name, excludeId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 自动创建标签接口 如果标签不存在则自动创建，用于批量处理标签时避免重复创建
   *
   * @param tagNames 标签名称列表
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 创建或已存在的标签列表
   */
  @PostMapping("/create-if-not-exist")
  @Operation(summary = "自动创建标签", description = "如果标签不存在则自动创建")
  public ResponseEntity<Result<List<TagDTO>>> createTagsIfNotExist(
      @RequestBody List<String> tagNames, Authentication authentication) {

    Long userId = getUserId(authentication);
    List<TagDTO> result = tagService.createTagsIfNotExist(tagNames, userId);

    return ResponseEntity.ok(Result.success(result));
  }

  // 私有辅助方法
  private Long getUserId(Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof CustomUserDetailsService.CustomUserPrincipal) {
        CustomUserDetailsService.CustomUserPrincipal userPrincipal =
            (CustomUserDetailsService.CustomUserPrincipal) principal;
        return userPrincipal.getId();
      }
    }
    return null;
  }
}
