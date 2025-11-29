package com.example.educhain.service.impl;

import com.example.educhain.entity.Comment;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.CommentRepository;
import com.example.educhain.service.CommentService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 评论服务实现类 */
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

  private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

  private static final int STATUS_NORMAL = 1;
  private static final int STATUS_DELETED = 0;
  private static final int STATUS_PENDING = 2;

  @Autowired private CommentRepository commentRepository;

  @Override
  public Comment createComment(Long knowledgeId, Long userId, String content) {
    if (knowledgeId == null || userId == null) {
      throw new BusinessException("INVALID_PARAMS", "知识内容ID和用户ID不能为空");
    }
    if (content == null || content.trim().isEmpty()) {
      throw new BusinessException("CONTENT_EMPTY", "评论内容不能为空");
    }

    try {
      Comment comment = new Comment(knowledgeId, userId, content.trim());
      comment.setStatus(STATUS_NORMAL); // 默认状态为正常，可根据需要改为待审核
      Comment savedComment = commentRepository.save(comment);
      logger.info("用户 {} 对知识内容 {} 发表了评论", userId, knowledgeId);
      return savedComment;
    } catch (Exception e) {
      logger.error("创建评论失败: knowledgeId={}, userId={}", knowledgeId, userId, e);
      throw new BusinessException("CREATE_COMMENT_FAILED", "发表评论失败，请稍后重试");
    }
  }

  @Override
  public Comment replyComment(Long knowledgeId, Long userId, String content, Long parentId) {
    if (knowledgeId == null || userId == null || parentId == null) {
      throw new BusinessException("INVALID_PARAMS", "知识内容ID、用户ID和父评论ID不能为空");
    }
    if (content == null || content.trim().isEmpty()) {
      throw new BusinessException("CONTENT_EMPTY", "回复内容不能为空");
    }

    // 检查父评论是否存在
    if (!commentExists(parentId)) {
      throw new BusinessException("PARENT_COMMENT_NOT_FOUND", "要回复的评论不存在");
    }

    try {
      Comment reply = new Comment(knowledgeId, userId, content.trim(), parentId);
      reply.setStatus(STATUS_NORMAL);
      Comment savedReply = commentRepository.save(reply);
      logger.info("用户 {} 回复了评论 {}", userId, parentId);
      return savedReply;
    } catch (Exception e) {
      logger.error(
          "回复评论失败: knowledgeId={}, userId={}, parentId={}", knowledgeId, userId, parentId, e);
      throw new BusinessException("REPLY_COMMENT_FAILED", "回复评论失败，请稍后重试");
    }
  }

  @Override
  public void deleteComment(Long commentId, Long userId) {
    if (commentId == null || userId == null) {
      throw new BusinessException("INVALID_PARAMS", "评论ID和用户ID不能为空");
    }

    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

    // 检查权限：只有评论作者可以删除自己的评论
    if (!comment.getUserId().equals(userId)) {
      throw new BusinessException("NO_PERMISSION", "您只能删除自己的评论");
    }

    try {
      comment.setStatus(STATUS_DELETED);
      commentRepository.save(comment);
      logger.info("用户 {} 删除了评论 {}", userId, commentId);
    } catch (Exception e) {
      logger.error("删除评论失败: commentId={}, userId={}", commentId, userId, e);
      throw new BusinessException("DELETE_COMMENT_FAILED", "删除评论失败，请稍后重试");
    }
  }

  @Override
  public void adminDeleteComment(Long commentId) {
    if (commentId == null) {
      throw new BusinessException("COMMENT_ID_NULL", "评论ID不能为空");
    }

    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

    try {
      comment.setStatus(STATUS_DELETED);
      commentRepository.save(comment);
      logger.info("管理员删除了评论 {}", commentId);
    } catch (Exception e) {
      logger.error("管理员删除评论失败: commentId={}", commentId, e);
      throw new BusinessException("ADMIN_DELETE_COMMENT_FAILED", "删除评论失败，请稍后重试");
    }
  }

  @Override
  public void approveComment(Long commentId) {
    if (commentId == null) {
      throw new BusinessException("COMMENT_ID_NULL", "评论ID不能为空");
    }

    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

    try {
      comment.setStatus(STATUS_NORMAL);
      commentRepository.save(comment);
      logger.info("评论 {} 已通过审核", commentId);
    } catch (Exception e) {
      logger.error("审核通过评论失败: commentId={}", commentId, e);
      throw new BusinessException("APPROVE_COMMENT_FAILED", "审核评论失败，请稍后重试");
    }
  }

  @Override
  public void rejectComment(Long commentId) {
    if (commentId == null) {
      throw new BusinessException("COMMENT_ID_NULL", "评论ID不能为空");
    }

    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

    try {
      comment.setStatus(STATUS_DELETED);
      commentRepository.save(comment);
      logger.info("评论 {} 已被拒绝", commentId);
    } catch (Exception e) {
      logger.error("拒绝评论失败: commentId={}", commentId, e);
      throw new BusinessException("REJECT_COMMENT_FAILED", "拒绝评论失败，请稍后重试");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Comment getCommentById(Long commentId) {
    if (commentId == null) {
      throw new BusinessException("COMMENT_ID_NULL", "评论ID不能为空");
    }
    return commentRepository
        .findById(commentId)
        .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Comment> getTopLevelComments(Long knowledgeId, Pageable pageable) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return commentRepository.findByKnowledgeIdAndParentIdIsNullAndStatusOrderByCreatedAtDesc(
        knowledgeId, STATUS_NORMAL, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Comment> getAllComments(Long knowledgeId, Pageable pageable) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return commentRepository.findByKnowledgeIdAndStatusOrderByCreatedAtDesc(
        knowledgeId, STATUS_NORMAL, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Comment> getCommentReplies(Long parentId) {
    if (parentId == null) {
      throw new BusinessException("PARENT_ID_NULL", "父评论ID不能为空");
    }
    return commentRepository.findByParentIdAndStatusOrderByCreatedAtAsc(parentId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Comment> getUserComments(Long userId, Pageable pageable) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return commentRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
        userId, STATUS_NORMAL, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Comment> getCommentTree(Long knowledgeId) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return commentRepository.findCommentTreeByKnowledgeId(knowledgeId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> buildCommentTree(Long knowledgeId) {
    List<Comment> allComments = getCommentTree(knowledgeId);

    // 按父子关系构建树结构
    Map<Long, List<Comment>> childrenMap = new HashMap<>();
    List<Comment> rootComments = new ArrayList<>();

    for (Comment comment : allComments) {
      if (comment.getParentId() == null) {
        rootComments.add(comment);
      } else {
        childrenMap.computeIfAbsent(comment.getParentId(), k -> new ArrayList<>()).add(comment);
      }
    }

    return rootComments.stream()
        .map(comment -> buildCommentNode(comment, childrenMap))
        .collect(Collectors.toList());
  }

  private Map<String, Object> buildCommentNode(
      Comment comment, Map<Long, List<Comment>> childrenMap) {
    Map<String, Object> node = new HashMap<>();
    node.put("comment", comment);

    List<Comment> children = childrenMap.get(comment.getId());
    if (children != null && !children.isEmpty()) {
      List<Map<String, Object>> childNodes =
          children.stream()
              .map(child -> buildCommentNode(child, childrenMap))
              .collect(Collectors.toList());
      node.put("replies", childNodes);
    } else {
      node.put("replies", new ArrayList<>());
    }

    return node;
  }

  @Override
  @Transactional(readOnly = true)
  public long getCommentCount(Long knowledgeId) {
    if (knowledgeId == null) {
      return 0;
    }
    return commentRepository.countByKnowledgeIdAndStatus(knowledgeId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public long getReplyCount(Long parentId) {
    if (parentId == null) {
      return 0;
    }
    return commentRepository.countByParentIdAndStatus(parentId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public long getUserCommentCount(Long userId) {
    if (userId == null) {
      return 0;
    }
    return commentRepository.countByUserIdAndStatus(userId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getPopularComments(Long knowledgeId, int limit) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }

    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results =
        commentRepository.findPopularCommentsByKnowledgeId(knowledgeId, STATUS_NORMAL, pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> item = new HashMap<>();
              item.put("comment", result[0]);
              item.put("replyCount", result[1]);
              return item;
            })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<Comment> getRecentComments(Long knowledgeId, int limit) {
    if (knowledgeId == null) {
      throw new BusinessException("KNOWLEDGE_ID_NULL", "知识内容ID不能为空");
    }
    return commentRepository.findTop10ByKnowledgeIdAndStatusOrderByCreatedAtDesc(
        knowledgeId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Comment> getRecentUserComments(Long userId, int limit) {
    if (userId == null) {
      throw new BusinessException("USER_ID_NULL", "用户ID不能为空");
    }
    return commentRepository.findTop10ByUserIdAndStatusOrderByCreatedAtDesc(userId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Comment> getPendingComments(Pageable pageable) {
    return commentRepository.findByStatusOrderByCreatedAtDesc(STATUS_PENDING, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Map<String, Object>> getActiveCommenters(LocalDateTime startTime, int limit) {
    if (startTime == null) {
      startTime = LocalDateTime.now().minusDays(7); // 默认最近7天
    }

    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> results =
        commentRepository.findActiveCommenters(STATUS_NORMAL, startTime, pageable);

    return results.stream()
        .map(
            result -> {
              Map<String, Object> user = new HashMap<>();
              user.put("userId", result[0]);
              user.put("commentCount", result[1]);
              return user;
            })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Long, Long> getBatchCommentCounts(List<Long> knowledgeIds) {
    if (knowledgeIds == null || knowledgeIds.isEmpty()) {
      return new HashMap<>();
    }

    Map<Long, Long> counts = new HashMap<>();
    for (Long knowledgeId : knowledgeIds) {
      counts.put(knowledgeId, getCommentCount(knowledgeId));
    }
    return counts;
  }

  @Override
  @Transactional(readOnly = true)
  public boolean canDeleteComment(Long commentId, Long userId) {
    if (commentId == null || userId == null) {
      return false;
    }

    Comment comment = commentRepository.findById(commentId).orElse(null);
    return comment != null
        && comment.getUserId().equals(userId)
        && comment.getStatus().equals(STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean commentExists(Long commentId) {
    if (commentId == null) {
      return false;
    }
    return commentRepository.existsByIdAndStatus(commentId, STATUS_NORMAL);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Long> getCommentStats() {
    Map<String, Long> stats = new HashMap<>();
    stats.put("total", commentRepository.countByStatus(STATUS_NORMAL));
    stats.put("pending", commentRepository.countByStatus(STATUS_PENDING));
    stats.put("deleted", commentRepository.countByStatus(STATUS_DELETED));
    return stats;
  }
}
