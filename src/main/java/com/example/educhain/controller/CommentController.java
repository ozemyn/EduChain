package com.example.educhain.controller;

import com.example.educhain.dto.CreateCommentRequest;
import com.example.educhain.entity.Comment;
import com.example.educhain.service.CommentService;
import com.example.educhain.util.JwtUtil;
import com.example.educhain.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** 评论控制器 提供知识内容的评论功能，包括创建评论、回复评论、删除评论、查询评论等 支持评论的层级结构、点赞、举报等互动功能 */
@RestController
@RequestMapping("/comments")
@Tag(name = "评论管理", description = "评论相关接口")
public class CommentController {

  private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

  @Autowired private CommentService commentService;

  @Autowired private JwtUtil jwtUtil;

  /**
   * 创建评论接口 用户对知识内容发表评论，支持创建顶级评论或回复其他评论
   *
   * @param request 创建评论请求，包含知识内容ID、评论内容、父评论ID（可选）
   * @param httpRequest HTTP请求对象，用于获取当前用户ID
   * @return 创建成功的评论信息
   */
  @PostMapping
  @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
  @Operation(summary = "创建评论", description = "用户对知识内容发表评论")
  public ResponseEntity<Result<Comment>> createComment(
      @Valid @RequestBody CreateCommentRequest request, HttpServletRequest httpRequest) {
    try {
      Long userId = jwtUtil.getUserIdFromRequest(httpRequest);
      Comment comment;

      if (request.getParentId() != null) {
        // 回复评论
        comment =
            commentService.replyComment(
                request.getKnowledgeId(), userId, request.getContent(), request.getParentId());
      } else {
        // 创建顶级评论
        comment =
            commentService.createComment(request.getKnowledgeId(), userId, request.getContent());
      }

      return ResponseEntity.ok(Result.success("评论发表成功", comment));
    } catch (Exception e) {
      logger.error("创建评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("CREATE_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 删除评论接口 用户删除自己发表的评论，需要验证评论的所有权
   *
   * @param commentId 评论ID
   * @param request HTTP请求对象，用于获取当前用户ID
   * @return 删除成功响应
   */
  @DeleteMapping("/{commentId}")
  @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
  @Operation(summary = "删除评论", description = "用户删除自己的评论")
  public ResponseEntity<Result<Void>> deleteComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId, HttpServletRequest request) {
    try {
      Long userId = jwtUtil.getUserIdFromRequest(request);
      commentService.deleteComment(commentId, userId);
      return ResponseEntity.ok(Result.<Void>success("评论删除成功", null));
    } catch (Exception e) {
      logger.error("删除评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("DELETE_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取评论详情接口 根据评论ID获取评论的详细信息，包括内容、作者、时间、回复等
   *
   * @param commentId 评论ID
   * @return 评论详细信息
   */
  @GetMapping("/{commentId}")
  @Operation(summary = "获取评论详情", description = "获取指定评论的详细信息")
  public ResponseEntity<Result<Comment>> getComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId) {
    try {
      Comment comment = commentService.getCommentById(commentId);
      return ResponseEntity.ok(Result.success(comment));
    } catch (Exception e) {
      logger.error("获取评论详情失败", e);
      return ResponseEntity.badRequest().body(Result.error("GET_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取知识内容的评论接口 获取指定知识内容的所有顶级评论（不包括回复）
   *
   * @param knowledgeId 知识内容ID
   * @param page 页码
   * @param size 每页大小
   * @return 评论列表（分页）
   */
  @GetMapping("/knowledge/{knowledgeId}")
  @Operation(summary = "获取知识内容的评论", description = "获取指定知识内容的顶级评论列表")
  public ResponseEntity<Result<Page<Comment>>> getKnowledgeComments(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
    try {
      Pageable pageable = PageRequest.of(page, size);
      Page<Comment> comments = commentService.getTopLevelComments(knowledgeId, pageable);
      return ResponseEntity.ok(Result.success(comments));
    } catch (Exception e) {
      logger.error("获取知识内容评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_KNOWLEDGE_COMMENTS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取评论的回复列表接口 返回指定评论的所有直接回复，不包括回复的回复
   *
   * @param commentId 评论ID
   * @return 回复列表
   */
  @GetMapping("/{commentId}/replies")
  @Operation(summary = "获取评论回复", description = "获取指定评论的回复列表")
  public ResponseEntity<Result<List<Comment>>> getCommentReplies(
      @Parameter(description = "评论ID") @PathVariable Long commentId) {
    try {
      List<Comment> replies = commentService.getCommentReplies(commentId);
      return ResponseEntity.ok(Result.success(replies));
    } catch (Exception e) {
      logger.error("获取评论回复失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_COMMENT_REPLIES_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取评论树结构接口 返回指定知识内容的完整评论树结构，包含所有评论及其层级关系
   *
   * @param knowledgeId 知识内容ID
   * @return 评论树结构列表
   */
  @GetMapping("/tree/{knowledgeId}")
  @Operation(summary = "获取评论树结构", description = "获取指定知识内容的完整评论树结构")
  public ResponseEntity<Result<List<Map<String, Object>>>> getCommentTree(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
    try {
      List<Map<String, Object>> commentTree = commentService.buildCommentTree(knowledgeId);
      return ResponseEntity.ok(Result.success(commentTree));
    } catch (Exception e) {
      logger.error("获取评论树结构失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_COMMENT_TREE_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取用户的评论列表接口 返回当前登录用户发表的所有评论，支持分页查询
   *
   * @param page 页码
   * @param size 每页大小
   * @param request HTTP请求对象，用于获取当前用户ID
   * @return 用户评论列表（分页）
   */
  @GetMapping("/user")
  @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
  @Operation(summary = "获取用户评论", description = "获取当前用户的评论列表")
  public ResponseEntity<Result<Page<Comment>>> getUserComments(
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
      HttpServletRequest request) {
    try {
      Long userId = jwtUtil.getUserIdFromRequest(request);
      Pageable pageable = PageRequest.of(page, size);
      Page<Comment> comments = commentService.getUserComments(userId, pageable);
      return ResponseEntity.ok(Result.success(comments));
    } catch (Exception e) {
      logger.error("获取用户评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_USER_COMMENTS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取热门评论接口 返回指定知识内容的热门评论列表，按点赞数或回复数排序
   *
   * @param knowledgeId 知识内容ID
   * @param limit 返回数量限制，默认10
   * @return 热门评论列表
   */
  @GetMapping("/popular/{knowledgeId}")
  @Operation(summary = "获取热门评论", description = "获取指定知识内容的热门评论")
  public ResponseEntity<Result<List<Map<String, Object>>>> getPopularComments(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
    try {
      List<Map<String, Object>> popularComments =
          commentService.getPopularComments(knowledgeId, limit);
      return ResponseEntity.ok(Result.success(popularComments));
    } catch (Exception e) {
      logger.error("获取热门评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_POPULAR_COMMENTS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取最近评论接口 返回指定知识内容的最近发表的评论列表，按时间倒序排列
   *
   * @param knowledgeId 知识内容ID
   * @param limit 返回数量限制，默认10
   * @return 最近评论列表
   */
  @GetMapping("/recent/{knowledgeId}")
  @Operation(summary = "获取最近评论", description = "获取指定知识内容的最近评论")
  public ResponseEntity<Result<List<Comment>>> getRecentComments(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
      @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
    try {
      List<Comment> recentComments = commentService.getRecentComments(knowledgeId, limit);
      return ResponseEntity.ok(Result.success(recentComments));
    } catch (Exception e) {
      logger.error("获取最近评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_RECENT_COMMENTS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取评论统计接口 返回指定知识内容的评论统计数据，包括总评论数等
   *
   * @param knowledgeId 知识内容ID
   * @return 评论统计数据
   */
  @GetMapping("/stats/{knowledgeId}")
  @Operation(summary = "获取评论统计", description = "获取指定知识内容的评论统计信息")
  public ResponseEntity<Result<Map<String, Long>>> getCommentStats(
      @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
    try {
      Map<String, Long> stats =
          Map.of("totalComments", commentService.getCommentCount(knowledgeId));
      return ResponseEntity.ok(Result.success(stats));
    } catch (Exception e) {
      logger.error("获取评论统计失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_COMMENT_STATS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取活跃评论者接口 返回指定时间范围内最活跃的评论者列表，按评论数量排序
   *
   * @param days 统计天数，默认7天
   * @param limit 返回数量限制，默认10
   * @return 活跃评论者列表
   */
  @GetMapping("/active-commenters")
  @Operation(summary = "获取活跃评论者", description = "获取最活跃的评论者列表")
  public ResponseEntity<Result<List<Map<String, Object>>>> getActiveCommenters(
      @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
      @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
    try {
      LocalDateTime startTime = LocalDateTime.now().minusDays(days);
      List<Map<String, Object>> activeCommenters =
          commentService.getActiveCommenters(startTime, limit);
      return ResponseEntity.ok(Result.success(activeCommenters));
    } catch (Exception e) {
      logger.error("获取活跃评论者失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_ACTIVE_COMMENTERS_FAILED", e.getMessage()));
    }
  }

  // 管理员接口

  /**
   * 管理员删除评论接口（管理员权限） 管理员可以删除任意评论，不需要验证评论所有权
   *
   * @param commentId 要删除的评论ID
   * @return 删除成功响应
   */
  @DeleteMapping("/admin/{commentId}")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "管理员删除评论", description = "管理员删除任意评论")
  public ResponseEntity<Result<Void>> adminDeleteComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId) {
    try {
      commentService.adminDeleteComment(commentId);
      return ResponseEntity.ok(Result.<Void>success("评论删除成功", null));
    } catch (Exception e) {
      logger.error("管理员删除评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("ADMIN_DELETE_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 审核通过评论接口（管理员权限） 管理员审核通过指定的评论，使其在平台上可见
   *
   * @param commentId 要审核通过的评论ID
   * @return 审核成功响应
   */
  @PutMapping("/admin/{commentId}/approve")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "审核通过评论", description = "管理员审核通过评论")
  public ResponseEntity<Result<Void>> approveComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId) {
    try {
      commentService.approveComment(commentId);
      return ResponseEntity.ok(Result.<Void>success("评论审核通过", null));
    } catch (Exception e) {
      logger.error("审核通过评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("APPROVE_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 拒绝评论接口（管理员权限） 管理员拒绝指定的评论，使其不在平台上显示
   *
   * @param commentId 要拒绝的评论ID
   * @return 拒绝成功响应
   */
  @PutMapping("/admin/{commentId}/reject")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "拒绝评论", description = "管理员拒绝评论")
  public ResponseEntity<Result<Void>> rejectComment(
      @Parameter(description = "评论ID") @PathVariable Long commentId) {
    try {
      commentService.rejectComment(commentId);
      return ResponseEntity.ok(Result.<Void>success("评论已拒绝", null));
    } catch (Exception e) {
      logger.error("拒绝评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("REJECT_COMMENT_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取待审核评论接口（管理员权限） 分页获取系统中所有待审核的评论列表
   *
   * @param page 页码
   * @param size 每页大小
   * @return 待审核评论列表（分页）
   */
  @GetMapping("/admin/pending")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "获取待审核评论", description = "管理员获取待审核的评论列表")
  public ResponseEntity<Result<Page<Comment>>> getPendingComments(
      @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
    try {
      Pageable pageable = PageRequest.of(page, size);
      Page<Comment> pendingComments = commentService.getPendingComments(pageable);
      return ResponseEntity.ok(Result.success(pendingComments));
    } catch (Exception e) {
      logger.error("获取待审核评论失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_PENDING_COMMENTS_FAILED", e.getMessage()));
    }
  }

  /**
   * 获取系统评论统计接口（管理员权限） 返回系统整体的评论统计数据，包括总评论数、待审核数等
   *
   * @return 系统评论统计数据
   */
  @GetMapping("/admin/stats")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "获取系统评论统计", description = "管理员获取系统评论统计信息")
  public ResponseEntity<Result<Map<String, Long>>> getSystemCommentStats() {
    try {
      Map<String, Long> stats = commentService.getCommentStats();
      return ResponseEntity.ok(Result.success(stats));
    } catch (Exception e) {
      logger.error("获取系统评论统计失败", e);
      return ResponseEntity.badRequest()
          .body(Result.error("GET_SYSTEM_COMMENT_STATS_FAILED", e.getMessage()));
    }
  }
}
