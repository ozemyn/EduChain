package com.example.educhain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 创建评论请求DTO
 */
public class CreateCommentRequest {

    @NotNull(message = "知识内容ID不能为空")
    private Long knowledgeId;

    @NotBlank(message = "评论内容不能为空")
    @Size(min = 1, max = 1000, message = "评论内容长度必须在1-1000个字符之间")
    private String content;

    private Long parentId; // 回复评论时的父评论ID

    // 默认构造函数
    public CreateCommentRequest() {}

    // 构造函数
    public CreateCommentRequest(Long knowledgeId, String content) {
        this.knowledgeId = knowledgeId;
        this.content = content;
    }

    public CreateCommentRequest(Long knowledgeId, String content, Long parentId) {
        this.knowledgeId = knowledgeId;
        this.content = content;
        this.parentId = parentId;
    }

    // Getters and Setters
    public Long getKnowledgeId() {
        return knowledgeId;
    }

    public void setKnowledgeId(Long knowledgeId) {
        this.knowledgeId = knowledgeId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}