package com.example.educhain.controller;

import com.example.educhain.annotation.RateLimit;
import com.example.educhain.entity.FileUpload;
import com.example.educhain.enums.RateLimitType;
import com.example.educhain.service.FileUploadService;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** 文件上传控制器 提供文件的上传、下载、查询、删除等完整功能 支持单文件上传、批量上传、文件类型验证、大小限制等 包含文件下载统计和访问控制 */
@RestController
@RequestMapping("/files")
@Tag(name = "文件管理", description = "文件上传、下载、管理等功能")
public class FileUploadController {

  @Autowired private FileUploadService fileUploadService;

  /**
   * 上传单个文件接口 上传单个文件到服务器，支持图片、视频、文档等多种文件类型 自动生成文件哈希值，避免重复上传相同文件
   *
   * @param file 要上传的文件
   * @param knowledgeId 关联的知识内容ID（可选）
   * @param description 文件描述（可选）
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 上传成功的文件信息
   */
  @PostMapping("/upload")
  @Operation(summary = "上传单个文件", description = "上传单个文件到服务器")
  @RateLimit(
      key = "file:upload",
      limit = 20,
      timeWindow = 60,
      type = RateLimitType.USER,
      algorithm = "token_bucket",
      message = "文件上传过于频繁，请稍后再试")
  public ResponseEntity<Result<FileUpload>> uploadFile(
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "knowledgeId", required = false) Long knowledgeId,
      @RequestParam(value = "description", required = false) String description,
      Authentication authentication) {

    Long userId = getUserId(authentication);
    FileUpload result = fileUploadService.uploadFile(file, userId, knowledgeId, description);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 批量上传文件接口 一次性上传多个文件，支持不同类型的文件混合上传
   *
   * @param files 要上传的文件列表
   * @param knowledgeId 关联的知识内容ID（可选）
   * @param description 文件描述（可选）
   * @param authentication Spring Security认证信息，用于获取当前用户ID
   * @return 上传成功的文件信息列表
   */
  @PostMapping("/upload-multiple")
  @Operation(summary = "上传多个文件", description = "批量上传多个文件到服务器")
  @RateLimit(
      key = "file:upload-multiple",
      limit = 10,
      timeWindow = 60,
      type = RateLimitType.USER,
      algorithm = "token_bucket",
      message = "批量上传过于频繁，请稍后再试")
  public ResponseEntity<Result<List<FileUpload>>> uploadFiles(
      @RequestParam("files") List<MultipartFile> files,
      @RequestParam(value = "knowledgeId", required = false) Long knowledgeId,
      @RequestParam(value = "description", required = false) String description,
      Authentication authentication) {

    Long userId = getUserId(authentication);
    List<FileUpload> result =
        fileUploadService.uploadFiles(files, userId, knowledgeId, description);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 获取文件信息接口 根据文件ID获取文件的详细信息，包括文件名、大小、类型、上传时间等
   *
   * @param fileId 文件ID
   * @return 文件详细信息
   */
  @GetMapping("/{fileId}")
  @Operation(summary = "获取文件信息", description = "根据文件ID获取文件详细信息")
  public ResponseEntity<Result<FileUpload>> getFileInfo(@PathVariable Long fileId) {
    FileUpload result = fileUploadService.getFileById(fileId);

    return ResponseEntity.ok(Result.success(result));
  }

  /**
   * 下载文件接口 根据文件ID下载文件，自动增加下载次数统计
   *
   * @param fileId 文件ID
   * @return 文件资源，可直接下载
   * @throws MalformedURLException 文件路径无效时抛出
   */
  @GetMapping("/{fileId}/download")
  @Operation(summary = "下载文件", description = "根据文件ID下载文件")
  public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId)
      throws MalformedURLException {
    FileUpload fileUpload = fileUploadService.getFileById(fileId);

    // 增加下载次数
    fileUploadService.incrementDownloadCount(fileId);

    Path filePath = Paths.get(fileUpload.getFilePath());
    Resource resource = new UrlResource(filePath.toUri());

    if (!resource.exists() || !resource.isReadable()) {
      throw new RuntimeException("文件不存在或无法读取");
    }

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(fileUpload.getMimeType()))
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + fileUpload.getOriginalName() + "\"")
        .body(resource);
  }

  @GetMapping("/{fileId}/view")
  @Operation(summary = "在线查看文件", description = "在浏览器中直接查看文件（适用于图片、PDF等）")
  public ResponseEntity<Resource> viewFile(@PathVariable Long fileId) throws MalformedURLException {
    FileUpload fileUpload = fileUploadService.getFileById(fileId);

    Path filePath = Paths.get(fileUpload.getFilePath());
    Resource resource = new UrlResource(filePath.toUri());

    if (!resource.exists() || !resource.isReadable()) {
      throw new RuntimeException("文件不存在或无法读取");
    }

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(fileUpload.getMimeType()))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
        .body(resource);
  }

  @DeleteMapping("/{fileId}")
  @Operation(summary = "删除文件", description = "软删除指定的文件")
  public ResponseEntity<Result<Void>> deleteFile(
      @PathVariable Long fileId, Authentication authentication) {

    Long userId = getUserId(authentication);
    fileUploadService.deleteFile(fileId, userId);

    return ResponseEntity.ok(Result.success());
  }

  @PostMapping("/batch-delete")
  @Operation(summary = "批量删除文件", description = "批量软删除多个文件")
  public ResponseEntity<Result<Void>> batchDeleteFiles(
      @RequestBody List<Long> fileIds, Authentication authentication) {

    Long userId = getUserId(authentication);
    fileUploadService.deleteFiles(fileIds, userId);

    return ResponseEntity.ok(Result.success());
  }

  @GetMapping("/user/{userId}")
  @Operation(summary = "获取用户文件列表", description = "获取指定用户上传的文件列表")
  public ResponseEntity<Result<Page<FileUpload>>> getUserFiles(
      @PathVariable Long userId, @PageableDefault(size = 20) Pageable pageable) {

    Page<FileUpload> result = fileUploadService.getUserFiles(userId, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/knowledge/{knowledgeId}")
  @Operation(summary = "获取知识内容关联文件", description = "获取指定知识内容关联的文件列表")
  public ResponseEntity<Result<List<FileUpload>>> getKnowledgeFiles(
      @PathVariable Long knowledgeId) {
    List<FileUpload> result = fileUploadService.getKnowledgeFiles(knowledgeId);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/type/{fileType}")
  @Operation(summary = "根据类型获取文件", description = "根据文件类型获取文件列表")
  public ResponseEntity<Result<Page<FileUpload>>> getFilesByType(
      @PathVariable String fileType, @PageableDefault(size = 20) Pageable pageable) {

    Page<FileUpload> result = fileUploadService.getFilesByType(fileType, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/search")
  @Operation(summary = "搜索文件", description = "根据文件名搜索文件")
  public ResponseEntity<Result<Page<FileUpload>>> searchFiles(
      @RequestParam String keyword, @PageableDefault(size = 20) Pageable pageable) {

    Page<FileUpload> result = fileUploadService.searchFiles(keyword, pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/popular")
  @Operation(summary = "获取热门文件", description = "获取下载次数最多的文件")
  public ResponseEntity<Result<Page<FileUpload>>> getPopularFiles(
      @PageableDefault(size = 20) Pageable pageable) {

    Page<FileUpload> result = fileUploadService.getPopularFiles(pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/recent")
  @Operation(summary = "获取最近上传的文件", description = "获取最近上传的文件列表")
  public ResponseEntity<Result<Page<FileUpload>>> getRecentFiles(
      @PageableDefault(size = 20) Pageable pageable) {

    Page<FileUpload> result = fileUploadService.getRecentFiles(pageable);

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/stats")
  @Operation(summary = "获取文件统计信息", description = "获取文件上传的统计信息")
  public ResponseEntity<Result<FileUploadService.FileUploadStats>> getFileStats() {
    FileUploadService.FileUploadStats result = fileUploadService.getFileStats();

    return ResponseEntity.ok(Result.success(result));
  }

  @GetMapping("/user-stats/{userId}")
  @Operation(summary = "获取用户文件统计", description = "获取指定用户的文件统计信息")
  public ResponseEntity<Result<FileUploadService.UserFileStats>> getUserFileStats(
      @PathVariable Long userId) {
    FileUploadService.UserFileStats result = fileUploadService.getUserFileStats(userId);

    return ResponseEntity.ok(Result.success(result));
  }

  @PostMapping("/cleanup/orphan")
  @Operation(summary = "清理孤儿文件", description = "清理未关联到知识内容的文件")
  public ResponseEntity<Result<Integer>> cleanupOrphanFiles(
      @RequestParam(defaultValue = "30") int daysThreshold) {

    int cleanedCount = fileUploadService.cleanupOrphanFiles(daysThreshold);

    return ResponseEntity.ok(Result.success(cleanedCount));
  }

  @PostMapping("/cleanup/duplicate")
  @Operation(summary = "清理重复文件", description = "清理重复上传的文件")
  public ResponseEntity<Result<Integer>> cleanupDuplicateFiles() {
    int cleanedCount = fileUploadService.cleanupDuplicateFiles();

    return ResponseEntity.ok(Result.success(cleanedCount));
  }

  @GetMapping("/validate/type")
  @Operation(summary = "验证文件类型", description = "验证指定的MIME类型是否被允许")
  public ResponseEntity<Result<Boolean>> validateFileType(@RequestParam String mimeType) {
    boolean isValid = fileUploadService.isValidFileType(mimeType);

    return ResponseEntity.ok(Result.success(isValid));
  }

  @GetMapping("/validate/size")
  @Operation(summary = "验证文件大小", description = "验证指定的文件大小是否在允许范围内")
  public ResponseEntity<Result<Boolean>> validateFileSize(@RequestParam long fileSize) {
    boolean isValid = fileUploadService.isValidFileSize(fileSize);

    return ResponseEntity.ok(Result.success(isValid));
  }

  // 私有辅助方法
  private Long getUserId(Authentication authentication) {
    if (authentication != null && authentication.isAuthenticated()) {
      return Long.parseLong(authentication.getName());
    }
    return null;
  }
}
