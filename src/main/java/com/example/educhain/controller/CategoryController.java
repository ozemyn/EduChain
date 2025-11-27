package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.CategoryService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类管理控制器
 */
@RestController
@RequestMapping("/api/categories")
@Tag(name = "分类管理", description = "分类的CRUD操作、层级管理、统计等功能")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @Operation(summary = "创建分类", description = "创建新的分类")
    public ResponseEntity<Result<CategoryDTO>> create(@Valid @RequestBody CreateCategoryRequest request) {
        CategoryDTO result = categoryService.create(request);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类", description = "更新指定的分类")
    public ResponseEntity<Result<CategoryDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        
        CategoryDTO result = categoryService.update(id, request);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类", description = "删除指定的分类（需要检查依赖关系）")
    public ResponseEntity<Result<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        
        return ResponseEntity.ok(Result.success());
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情", description = "根据ID获取分类的详细信息")
    public ResponseEntity<Result<CategoryDTO>> findById(@PathVariable Long id) {
        CategoryDTO result = categoryService.findById(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping
    @Operation(summary = "获取所有分类", description = "获取所有分类的列表")
    public ResponseEntity<Result<List<CategoryDTO>>> findAll() {
        List<CategoryDTO> result = categoryService.findAll();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/root")
    @Operation(summary = "获取根分类", description = "获取所有根级分类")
    public ResponseEntity<Result<List<CategoryDTO>>> findRootCategories() {
        List<CategoryDTO> result = categoryService.findRootCategories();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{parentId}/children")
    @Operation(summary = "获取子分类", description = "获取指定分类的所有子分类")
    public ResponseEntity<Result<List<CategoryDTO>>> findChildren(@PathVariable Long parentId) {
        List<CategoryDTO> result = categoryService.findChildren(parentId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/tree")
    @Operation(summary = "获取分类树", description = "获取完整的分类树结构")
    public ResponseEntity<Result<List<CategoryTreeDTO>>> getCategoryTree() {
        List<CategoryTreeDTO> result = categoryService.getCategoryTree();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{id}/subtree")
    @Operation(summary = "获取子树", description = "获取指定分类的子树结构")
    public ResponseEntity<Result<CategoryTreeDTO>> getCategorySubTree(@PathVariable Long id) {
        CategoryTreeDTO result = categoryService.getCategorySubTree(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{id}/path")
    @Operation(summary = "获取分类路径", description = "获取从根分类到指定分类的路径（面包屑导航）")
    public ResponseEntity<Result<List<CategoryDTO>>> getCategoryPath(@PathVariable Long id) {
        List<CategoryDTO> result = categoryService.getCategoryPath(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @PutMapping("/{id}/move")
    @Operation(summary = "移动分类", description = "将分类移动到新的父分类下")
    public ResponseEntity<Result<Void>> moveCategory(
            @PathVariable Long id,
            @RequestParam(required = false) Long newParentId) {
        
        categoryService.moveCategory(id, newParentId);
        
        return ResponseEntity.ok(Result.success());
    }

    @PutMapping("/{id}/sort")
    @Operation(summary = "调整排序", description = "调整分类的排序位置")
    public ResponseEntity<Result<Void>> updateSortOrder(
            @PathVariable Long id,
            @RequestParam Integer sortOrder) {
        
        categoryService.updateSortOrder(id, sortOrder);
        
        return ResponseEntity.ok(Result.success());
    }

    @PostMapping("/batch-sort")
    @Operation(summary = "批量调整排序", description = "批量调整多个分类的排序位置")
    public ResponseEntity<Result<Void>> batchUpdateSortOrder(
            @RequestBody List<CategoryService.CategorySortRequest> requests) {
        
        categoryService.batchUpdateSortOrder(requests);
        
        return ResponseEntity.ok(Result.success());
    }

    @GetMapping("/search")
    @Operation(summary = "搜索分类", description = "根据关键词搜索分类")
    public ResponseEntity<Result<List<CategoryDTO>>> searchCategories(@RequestParam String keyword) {
        List<CategoryDTO> result = categoryService.searchCategories(keyword);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/popular")
    @Operation(summary = "获取热门分类", description = "获取最受欢迎的分类（按内容数量排序）")
    public ResponseEntity<Result<List<CategoryService.CategoryStatsDTO>>> getPopularCategories(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<CategoryService.CategoryStatsDTO> result = categoryService.getPopularCategories(limit);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/recent")
    @Operation(summary = "获取最近使用的分类", description = "获取最近有内容发布的分类")
    public ResponseEntity<Result<List<CategoryDTO>>> getRecentlyUsedCategories(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<CategoryDTO> result = categoryService.getRecentlyUsedCategories(limit);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{id}/stats")
    @Operation(summary = "获取分类统计", description = "获取指定分类的统计信息")
    public ResponseEntity<Result<CategoryService.CategoryStatsDTO>> getCategoryStats(@PathVariable Long id) {
        CategoryService.CategoryStatsDTO result = categoryService.getCategoryStats(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/stats")
    @Operation(summary = "获取所有分类统计", description = "获取所有分类的统计信息")
    public ResponseEntity<Result<List<CategoryService.CategoryStatsDTO>>> getAllCategoryStats() {
        List<CategoryService.CategoryStatsDTO> result = categoryService.getAllCategoryStats();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{id}/can-delete")
    @Operation(summary = "检查是否可删除", description = "检查指定分类是否可以删除")
    public ResponseEntity<Result<Boolean>> canDelete(@PathVariable Long id) {
        boolean result = categoryService.canDelete(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/validate/name")
    @Operation(summary = "验证名称唯一性", description = "验证分类名称在同级别中是否唯一")
    public ResponseEntity<Result<Boolean>> validateName(
            @RequestParam String name,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) Long excludeId) {
        
        boolean result = categoryService.isNameUnique(name, parentId, excludeId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/validate/depth")
    @Operation(summary = "验证层级深度", description = "验证在指定父分类下创建子分类是否会超过深度限制")
    public ResponseEntity<Result<Boolean>> validateDepth(@RequestParam(required = false) Long parentId) {
        boolean result = categoryService.isValidDepth(parentId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/{id}/depth")
    @Operation(summary = "获取分类深度", description = "获取指定分类的层级深度")
    public ResponseEntity<Result<Integer>> getCategoryDepth(@PathVariable Long id) {
        int result = categoryService.getCategoryDepth(id);
        
        return ResponseEntity.ok(Result.success(result));
    }
}