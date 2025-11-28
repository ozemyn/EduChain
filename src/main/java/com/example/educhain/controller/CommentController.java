package com.example.educhain.controller;

import com.example.educhain.dto.CommentDTO;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 评论控制器
 */
@RestController
@RequestMapping("/comments")
@Tag(name = "评论管理", description = "评论相关接口")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 创建评论
     */
    @PostMapping
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "创建评论", description = "用户对知识内容发表评论")
    public ResponseEntity<Result<Comment>> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(httpRequest);
            Comment comment;
            
            if (request.getParentId() != null) {
                // 回复评论
                comment = commentService.replyComment(request.getKnowledgeId(), userId, 
                                                    request.getContent(), request.getParentId());
            } else {
                // 创建顶级评论
                comment = commentService.createComment(request.getKnowledgeId(), userId, request.getContent());
            }
            
            return ResponseEntity.ok(Result.success("评论发表成功", comment));
        } catch (Exception e) {
            logger.error("创建评论失败", e);
            return ResponseEntity.badRequest().body(Result.error("CREATE_COMMENT_FAILED", e.getMessage()));
        }
    }

    /**
     * 删除评论
     */
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    @Operation(summary = "删除评论", description = "用户删除自己的评论")
    public ResponseEntity<Result<Void>> deleteComment(
            @Parameter(description = "评论ID") @PathVariable Long commentId,
            HttpServletRequest request) {
        try {
            Long userId = jwtUtil.getUserIdFromRequest(request);
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Result.<Void>success("评论删除成功", null));
        } catch (Exception e) {
            logger.error("删除评论失败", e);
            return ResponseEntity.badRequest().body(Result.error("DELETE_COMMENT_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取评论详情
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
     * 获取知识内容的顶级评论
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
            return ResponseEntity.badRequest().body(Result.error("GET_KNOWLEDGE_COMMENTS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取评论的回复列表
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
            return ResponseEntity.badRequest().body(Result.error("GET_COMMENT_REPLIES_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取评论树结构
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
            return ResponseEntity.badRequest().body(Result.error("GET_COMMENT_TREE_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取用户的评论列表
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
            return ResponseEntity.badRequest().body(Result.error("GET_USER_COMMENTS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取热门评论
     */
    @GetMapping("/popular/{knowledgeId}")
    @Operation(summary = "获取热门评论", description = "获取指定知识内容的热门评论")
    public ResponseEntity<Result<List<Map<String, Object>>>> getPopularComments(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> popularComments = commentService.getPopularComments(knowledgeId, limit);
            return ResponseEntity.ok(Result.success(popularComments));
        } catch (Exception e) {
            logger.error("获取热门评论失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_POPULAR_COMMENTS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取最近评论
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
            return ResponseEntity.badRequest().body(Result.error("GET_RECENT_COMMENTS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取评论统计
     */
    @GetMapping("/stats/{knowledgeId}")
    @Operation(summary = "获取评论统计", description = "获取指定知识内容的评论统计信息")
    public ResponseEntity<Result<Map<String, Long>>> getCommentStats(
            @Parameter(description = "知识内容ID") @PathVariable Long knowledgeId) {
        try {
            Map<String, Long> stats = Map.of(
                    "totalComments", commentService.getCommentCount(knowledgeId)
            );
            return ResponseEntity.ok(Result.success(stats));
        } catch (Exception e) {
            logger.error("获取评论统计失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_COMMENT_STATS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取活跃评论者
     */
    @GetMapping("/active-commenters")
    @Operation(summary = "获取活跃评论者", description = "获取最活跃的评论者列表")
    public ResponseEntity<Result<List<Map<String, Object>>>> getActiveCommenters(
            @Parameter(description = "天数") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        try {
            LocalDateTime startTime = LocalDateTime.now().minusDays(days);
            List<Map<String, Object>> activeCommenters = commentService.getActiveCommenters(startTime, limit);
            return ResponseEntity.ok(Result.success(activeCommenters));
        } catch (Exception e) {
            logger.error("获取活跃评论者失败", e);
            return ResponseEntity.badRequest().body(Result.error("GET_ACTIVE_COMMENTERS_FAILED", e.getMessage()));
        }
    }

    // 管理员接口

    /**
     * 管理员删除评论
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
            return ResponseEntity.badRequest().body(Result.error("ADMIN_DELETE_COMMENT_FAILED", e.getMessage()));
        }
    }

    /**
     * 审核通过评论
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
            return ResponseEntity.badRequest().body(Result.error("APPROVE_COMMENT_FAILED", e.getMessage()));
        }
    }

    /**
     * 拒绝评论
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
            return ResponseEntity.badRequest().body(Result.error("REJECT_COMMENT_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取待审核评论
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
            return ResponseEntity.badRequest().body(Result.error("GET_PENDING_COMMENTS_FAILED", e.getMessage()));
        }
    }

    /**
     * 获取系统评论统计
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
            return ResponseEntity.badRequest().body(Result.error("GET_SYSTEM_COMMENT_STATS_FAILED", e.getMessage()));
        }
    }
}