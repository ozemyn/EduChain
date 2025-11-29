package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.CategoryService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** 分类管理控制器 提供分类的完整CRUD操作、层级管理、树结构查询、统计信息等功能的API接口 支持分类的创建、更新、删除、查询、移动、排序等操作 */
@RestController
@RequestMapping("/categories")
@Tag(name = "分类管理", description = "分类的CRUD操作、层级管理、统计等功能")
public class CategoryController {

  @Autowired private CategoryService categoryService;

  /**
   * 创建分类接口 创建新的分类，验证名称唯一性和层级深度限制
   *
   * @param request 创建请求，包含分类名称、描述、父分类ID等信息
   * @return 创建成功的分类信息
   */
  @PostMapping
  @Operation(summary = "创建分类", description = "创建新的分类")
  public ResponseEntity<Result<CategoryDTO>> create(
      @Valid @RequestBody CreateCategoryRequest request) {
    CategoryDTO result = categoryService.create(request);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 更新分类接口 更新指定分类的信息，包括名称、描述、父分类、排序号等
   *
   * @param id 分类ID
   * @param request 更新请求，包含要更新的字段
   * @return 更新后的分类信息
   */
  @PutMapping("/{id}")
  @Operation(summary = "更新分类", description = "更新指定的分类")
  public ResponseEntity<Result<CategoryDTO>> update(
      @PathVariable Long id, @Valid @RequestBody UpdateCategoryRequest request) {

    CategoryDTO result = categoryService.update(id, request);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 删除分类接口 删除指定的分类，会检查是否有子分类或关联的知识内容
   *
   * @param id 分类ID
   * @return 删除成功响应
   */
  @DeleteMapping("/{id}")
  @Operation(summary = "删除分类", description = "删除指定的分类（需要检查依赖关系）")
  public ResponseEntity<Result<Void>> delete(@PathVariable Long id) {
    categoryService.delete(id);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 获取分类详情接口 根据分类ID获取分类的详细信息
   *
   * @param id 分类ID
   * @return 分类详细信息
   */
  @GetMapping("/{id}")
  @Operation(summary = "获取分类详情", description = "根据ID获取分类的详细信息")
  public ResponseEntity<Result<CategoryDTO>> findById(@PathVariable Long id) {
    CategoryDTO result = categoryService.findById(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取所有分类接口 返回系统中所有分类的列表
   *
   * @return 所有分类的列表
   */
  @GetMapping
  @Operation(summary = "获取所有分类", description = "获取所有分类的列表")
  public ResponseEntity<Result<List<CategoryDTO>>> findAll() {
    List<CategoryDTO> result = categoryService.findAll();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取根分类接口 返回所有没有父分类的根级分类列表
   *
   * @return 根分类列表
   */
  @GetMapping("/root")
  @Operation(summary = "获取根分类", description = "获取所有根级分类")
  public ResponseEntity<Result<List<CategoryDTO>>> findRootCategories() {
    List<CategoryDTO> result = categoryService.findRootCategories();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取子分类接口 获取指定分类的所有直接子分类
   *
   * @param parentId 父分类ID
   * @return 子分类列表
   */
  @GetMapping("/{parentId}/children")
  @Operation(summary = "获取子分类", description = "获取指定分类的所有子分类")
  public ResponseEntity<Result<List<CategoryDTO>>> findChildren(@PathVariable Long parentId) {
    List<CategoryDTO> result = categoryService.findChildren(parentId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取分类树接口 返回完整的分类树结构，包含所有分类及其层级关系
   *
   * @return 分类树结构列表
   */
  @GetMapping("/tree")
  @Operation(summary = "获取分类树", description = "获取完整的分类树结构")
  public ResponseEntity<Result<List<CategoryTreeDTO>>> getCategoryTree() {
    List<CategoryTreeDTO> result = categoryService.getCategoryTree();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取子树接口 获取指定分类及其所有子分类构成的子树结构
   *
   * @param id 分类ID
   * @return 子树结构
   */
  @GetMapping("/{id}/subtree")
  @Operation(summary = "获取子树", description = "获取指定分类的子树结构")
  public ResponseEntity<Result<CategoryTreeDTO>> getCategorySubTree(@PathVariable Long id) {
    CategoryTreeDTO result = categoryService.getCategorySubTree(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取分类路径接口 获取从根分类到指定分类的完整路径，用于面包屑导航
   *
   * @param id 分类ID
   * @return 分类路径列表（从根到当前分类）
   */
  @GetMapping("/{id}/path")
  @Operation(summary = "获取分类路径", description = "获取从根分类到指定分类的路径（面包屑导航）")
  public ResponseEntity<Result<List<CategoryDTO>>> getCategoryPath(@PathVariable Long id) {
    List<CategoryDTO> result = categoryService.getCategoryPath(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 移动分类接口 将分类移动到新的父分类下，更新分类的层级关系
   *
   * @param id 要移动的分类ID
   * @param newParentId 新的父分类ID（null表示移动到根级）
   * @return 移动成功响应
   */
  @PutMapping("/{id}/move")
  @Operation(summary = "移动分类", description = "将分类移动到新的父分类下")
  public ResponseEntity<Result<Void>> moveCategory(
      @PathVariable Long id, @RequestParam(required = false) Long newParentId) {

    categoryService.moveCategory(id, newParentId);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 调整分类排序接口 更新指定分类的排序号，用于控制分类的显示顺序
   *
   * @param id 分类ID
   * @param sortOrder 新的排序号
   * @return 更新成功响应
   */
  @PutMapping("/{id}/sort")
  @Operation(summary = "调整排序", description = "调整分类的排序位置")
  public ResponseEntity<Result<Void>> updateSortOrder(
      @PathVariable Long id, @RequestParam Integer sortOrder) {

    categoryService.updateSortOrder(id, sortOrder);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 批量调整排序接口 一次性更新多个分类的排序号
   *
   * @param requests 包含分类ID和新排序号的请求列表
   * @return 更新成功响应
   */
  @PostMapping("/batch-sort")
  @Operation(summary = "批量调整排序", description = "批量调整多个分类的排序位置")
  public ResponseEntity<Result<Void>> batchUpdateSortOrder(
      @RequestBody List<CategoryService.CategorySortRequest> requests) {

    categoryService.batchUpdateSortOrder(requests);

    return ResponseEntity.ok(Result.success());
  }

  /**
   * 搜索分类接口 根据关键词搜索分类，支持分类名称的模糊匹配
   *
   * @param keyword 搜索关键词
   * @return 匹配的分类列表
   */
  @GetMapping("/search")
  @Operation(summary = "搜索分类", description = "根据关键词搜索分类")
  public ResponseEntity<Result<List<CategoryDTO>>> searchCategories(@RequestParam String keyword) {
    List<CategoryDTO> result = categoryService.searchCategories(keyword);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取热门分类接口 返回最受欢迎的分类列表，按关联的知识内容数量排序
   *
   * @param limit 返回数量限制，默认10
   * @return 热门分类统计列表
   */
  @GetMapping("/popular")
  @Operation(summary = "获取热门分类", description = "获取最受欢迎的分类（按内容数量排序）")
  public ResponseEntity<Result<List<CategoryService.CategoryStatsDTO>>> getPopularCategories(
      @RequestParam(defaultValue = "10") int limit) {

    List<CategoryService.CategoryStatsDTO> result = categoryService.getPopularCategories(limit);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取最近使用的分类接口 返回最近有知识内容发布的分类列表，按最后使用时间排序
   *
   * @param limit 返回数量限制，默认10
   * @return 最近使用的分类列表
   */
  @GetMapping("/recent")
  @Operation(summary = "获取最近使用的分类", description = "获取最近有内容发布的分类")
  public ResponseEntity<Result<List<CategoryDTO>>> getRecentlyUsedCategories(
      @RequestParam(defaultValue = "10") int limit) {

    List<CategoryDTO> result = categoryService.getRecentlyUsedCategories(limit);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取分类统计接口 返回指定分类的统计信息，包括关联的知识内容数量、子分类数量等
   *
   * @param id 分类ID
   * @return 分类统计数据
   */
  @GetMapping("/{id}/stats")
  @Operation(summary = "获取分类统计", description = "获取指定分类的统计信息")
  public ResponseEntity<Result<CategoryService.CategoryStatsDTO>> getCategoryStats(
      @PathVariable Long id) {
    CategoryService.CategoryStatsDTO result = categoryService.getCategoryStats(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取所有分类统计接口 返回系统中所有分类的统计信息列表
   *
   * @return 所有分类的统计数据列表
   */
  @GetMapping("/stats")
  @Operation(summary = "获取所有分类统计", description = "获取所有分类的统计信息")
  public ResponseEntity<Result<List<CategoryService.CategoryStatsDTO>>> getAllCategoryStats() {
    List<CategoryService.CategoryStatsDTO> result = categoryService.getAllCategoryStats();

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 检查分类是否可删除接口 检查指定分类是否可以安全删除，需要确保没有子分类和关联的知识内容
   *
   * @param id 分类ID
   * @return 是否可以删除（true表示可以删除，false表示不能删除）
   */
  @GetMapping("/{id}/can-delete")
  @Operation(summary = "检查是否可删除", description = "检查指定分类是否可以删除")
  public ResponseEntity<Result<Boolean>> canDelete(@PathVariable Long id) {
    boolean result = categoryService.canDelete(id);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 验证分类名称唯一性接口 验证分类名称在同级别中是否唯一，用于创建或更新分类时的验证
   *
   * @param name 分类名称
   * @param parentId 父分类ID，可选
   * @param excludeId 排除的分类ID（用于更新时排除自身），可选
   * @return 名称是否唯一（true表示唯一，false表示已存在）
   */
  @GetMapping("/validate/name")
  @Operation(summary = "验证名称唯一性", description = "验证分类名称在同级别中是否唯一")
  public ResponseEntity<Result<Boolean>> validateName(
      @RequestParam String name,
      @RequestParam(required = false) Long parentId,
      @RequestParam(required = false) Long excludeId) {

    boolean result = categoryService.isNameUnique(name, parentId, excludeId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 验证层级深度接口 验证在指定父分类下创建子分类是否会超过系统允许的最大深度限制
   *
   * @param parentId 父分类ID，可选（null表示根级）
   * @return 深度是否有效（true表示有效，false表示超过限制）
   */
  @GetMapping("/validate/depth")
  @Operation(summary = "验证层级深度", description = "验证在指定父分类下创建子分类是否会超过深度限制")
  public ResponseEntity<Result<Boolean>> validateDepth(
      @RequestParam(required = false) Long parentId) {
    boolean result = categoryService.isValidDepth(parentId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取分类深度接口 返回指定分类在分类树中的层级深度，根分类深度为0
   *
   * @param id 分类ID
   * @return 分类的层级深度（整数）
   */
  @GetMapping("/{id}/depth")
  @Operation(summary = "获取分类深度", description = "获取指定分类的层级深度")
  public ResponseEntity<Result<Integer>> getCategoryDepth(@PathVariable Long id) {
    int result = categoryService.getCategoryDepth(id);

    return ResponseEntity.ok(Result.success(result));
  }
}
