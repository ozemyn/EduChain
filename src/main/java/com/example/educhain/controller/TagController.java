package com.example.educhain.controller;

import com.example.educhain.dto.*;
import com.example.educhain.service.TagService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签管理控制器
 */
@RestController
@RequestMapping("/api/tags")
@Tag(name = "标签管理", description = "标签的CRUD操作、统计、热门标签等功能")
public class TagController {

    @Autowired
    private TagService tagService;

    @PostMapping
    @Operation(summary = "创建标签", description = "创建新的标签")
    public ResponseEntity<Result<TagDTO>> create(
            @Valid @RequestBody CreateTagRequest request,
            Authentication authentication) {
        
        Long userId = getUserId(authentication);
        TagDTO result = tagService.create(request, userId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新标签", description = "更新指定的标签")
    public ResponseEntity<Result<TagDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTagRequest request) {
        
        TagDTO result = tagService.update(id, request);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签", description = "删除指定的标签（需要检查是否在使用中）")
    public ResponseEntity<Result<Void>> delete(@PathVariable Long id) {
        tagService.delete(id);
        
        return ResponseEntity.ok(Result.success());
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取标签详情", description = "根据ID获取标签的详细信息")
    public ResponseEntity<Result<TagDTO>> findById(@PathVariable Long id) {
        TagDTO result = tagService.findById(id);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "根据名称获取标签", description = "根据标签名称获取标签信息")
    public ResponseEntity<Result<TagDTO>> findByName(@PathVariable String name) {
        TagDTO result = tagService.findByName(name);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping
    @Operation(summary = "分页获取标签", description = "分页获取所有标签列表")
    public ResponseEntity<Result<Page<TagDTO>>> findAll(@PageableDefault(size = 20) Pageable pageable) {
        Page<TagDTO> result = tagService.findAll(pageable);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "根据分类获取标签", description = "获取指定分类下的所有标签")
    public ResponseEntity<Result<List<TagDTO>>> findByCategory(@PathVariable String category) {
        List<TagDTO> result = tagService.findByCategory(category);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "获取用户创建的标签", description = "获取指定用户创建的标签列表")
    public ResponseEntity<Result<Page<TagDTO>>> findByCreator(
            @PathVariable Long creatorId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<TagDTO> result = tagService.findByCreator(creatorId, pageable);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/search")
    @Operation(summary = "搜索标签", description = "根据关键词搜索标签")
    public ResponseEntity<Result<Page<TagDTO>>> searchTags(
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<TagDTO> result = tagService.searchTags(keyword, pageable);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/popular")
    @Operation(summary = "获取热门标签", description = "获取使用次数最多的热门标签")
    public ResponseEntity<Result<List<TagDTO>>> getPopularTags(
            @RequestParam(defaultValue = "20") int limit) {
        
        List<TagDTO> result = tagService.getPopularTags(limit);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/recent")
    @Operation(summary = "获取最近使用的标签", description = "获取最近使用过的标签")
    public ResponseEntity<Result<List<TagDTO>>> getRecentlyUsedTags(
            @RequestParam(defaultValue = "20") int limit) {
        
        List<TagDTO> result = tagService.getRecentlyUsedTags(limit);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/suggestions")
    @Operation(summary = "获取标签建议", description = "根据关键词获取标签建议")
    public ResponseEntity<Result<List<TagDTO>>> getSuggestedTags(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<TagDTO> result = tagService.getSuggestedTags(keyword, limit);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/categories")
    @Operation(summary = "获取所有标签分类", description = "获取所有标签分类的列表")
    public ResponseEntity<Result<List<String>>> getAllCategories() {
        List<String> result = tagService.getAllCategories();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/stats")
    @Operation(summary = "获取标签统计", description = "获取标签的统计信息")
    public ResponseEntity<Result<TagService.TagStats>> getTagStats() {
        TagService.TagStats result = tagService.getTagStats();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @GetMapping("/category-stats")
    @Operation(summary = "获取分类统计", description = "获取各个标签分类的统计信息")
    public ResponseEntity<Result<List<TagService.CategoryStats>>> getCategoryStats() {
        List<TagService.CategoryStats> result = tagService.getCategoryStats();
        
        return ResponseEntity.ok(Result.success(result));
    }

    @PostMapping("/{id}/increment-usage")
    @Operation(summary = "增加使用次数", description = "增加指定标签的使用次数")
    public ResponseEntity<Result<Void>> incrementUsageCount(@PathVariable Long id) {
        tagService.incrementUsageCount(id);
        
        return ResponseEntity.ok(Result.success());
    }

    @PostMapping("/{id}/decrement-usage")
    @Operation(summary = "减少使用次数", description = "减少指定标签的使用次数")
    public ResponseEntity<Result<Void>> decrementUsageCount(@PathVariable Long id) {
        tagService.decrementUsageCount(id);
        
        return ResponseEntity.ok(Result.success());
    }

    @PostMapping("/batch-increment-usage")
    @Operation(summary = "批量增加使用次数", description = "批量增加多个标签的使用次数")
    public ResponseEntity<Result<Void>> batchIncrementUsageCount(@RequestBody List<String> tagNames) {
        tagService.batchIncrementUsageCount(tagNames);
        
        return ResponseEntity.ok(Result.success());
    }

    @PostMapping("/batch-decrement-usage")
    @Operation(summary = "批量减少使用次数", description = "批量减少多个标签的使用次数")
    public ResponseEntity<Result<Void>> batchDecrementUsageCount(@RequestBody List<String> tagNames) {
        tagService.batchDecrementUsageCount(tagNames);
        
        return ResponseEntity.ok(Result.success());
    }

    @PostMapping("/cleanup")
    @Operation(summary = "清理未使用的标签", description = "清理长时间未使用的标签")
    public ResponseEntity<Result<Integer>> cleanupUnusedTags(
            @RequestParam(defaultValue = "90") int daysThreshold) {
        
        int cleanedCount = tagService.cleanupUnusedTags(daysThreshold);
        
        return ResponseEntity.ok(Result.success(cleanedCount));
    }

    @GetMapping("/validate/name")
    @Operation(summary = "验证名称唯一性", description = "验证标签名称是否唯一")
    public ResponseEntity<Result<Boolean>> validateName(
            @RequestParam String name,
            @RequestParam(required = false) Long excludeId) {
        
        boolean result = tagService.isNameUnique(name, excludeId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    @PostMapping("/create-if-not-exist")
    @Operation(summary = "自动创建标签", description = "如果标签不存在则自动创建")
    public ResponseEntity<Result<List<TagDTO>>> createTagsIfNotExist(
            @RequestBody List<String> tagNames,
            Authentication authentication) {
        
        Long userId = getUserId(authentication);
        List<TagDTO> result = tagService.createTagsIfNotExist(tagNames, userId);
        
        return ResponseEntity.ok(Result.success(result));
    }

    // 私有辅助方法
    private Long getUserId(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return Long.parseLong(authentication.getName());
        }
        return null;
    }
}