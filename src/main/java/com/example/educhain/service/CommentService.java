package com.example.educhain.service;

import com.example.educhain.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 评论服务接口
 */
public interface CommentService {

    /**
     * 创建评论
     */
    Comment createComment(Long knowledgeId, Long userId, String content);

    /**
     * 回复评论
     */
    Comment replyComment(Long knowledgeId, Long userId, String content, Long parentId);

    /**
     * 删除评论（软删除）
     */
    void deleteComment(Long commentId, Long userId);

    /**
     * 管理员删除评论
     */
    void adminDeleteComment(Long commentId);

    /**
     * 审核评论
     */
    void approveComment(Long commentId);

    /**
     * 拒绝评论
     */
    void rejectComment(Long commentId);

    /**
     * 获取评论详情
     */
    Comment getCommentById(Long commentId);

    /**
     * 获取知识内容的顶级评论（分页）
     */
    Page<Comment> getTopLevelComments(Long knowledgeId, Pageable pageable);

    /**
     * 获取知识内容的所有评论（分页）
     */
    Page<Comment> getAllComments(Long knowledgeId, Pageable pageable);

    /**
     * 获取评论的回复列表
     */
    List<Comment> getCommentReplies(Long parentId);

    /**
     * 获取用户的评论列表
     */
    Page<Comment> getUserComments(Long userId, Pageable pageable);

    /**
     * 获取评论树结构
     */
    List<Comment> getCommentTree(Long knowledgeId);

    /**
     * 构建评论树结构（包含回复层级）
     */
    List<Map<String, Object>> buildCommentTree(Long knowledgeId);

    /**
     * 统计知识内容的评论数量
     */
    long getCommentCount(Long knowledgeId);

    /**
     * 统计评论的回复数量
     */
    long getReplyCount(Long parentId);

    /**
     * 统计用户的评论数量
     */
    long getUserCommentCount(Long userId);

    /**
     * 获取热门评论
     */
    List<Map<String, Object>> getPopularComments(Long knowledgeId, int limit);

    /**
     * 获取最近评论
     */
    List<Comment> getRecentComments(Long knowledgeId, int limit);

    /**
     * 获取用户最近评论
     */
    List<Comment> getRecentUserComments(Long userId, int limit);

    /**
     * 获取待审核评论
     */
    Page<Comment> getPendingComments(Pageable pageable);

    /**
     * 获取活跃评论者
     */
    List<Map<String, Object>> getActiveCommenters(LocalDateTime startTime, int limit);

    /**
     * 批量获取评论统计
     */
    Map<Long, Long> getBatchCommentCounts(List<Long> knowledgeIds);

    /**
     * 检查用户是否可以删除评论
     */
    boolean canDeleteComment(Long commentId, Long userId);

    /**
     * 检查评论是否存在
     */
    boolean commentExists(Long commentId);

    /**
     * 获取评论统计信息
     */
    Map<String, Long> getCommentStats();
}