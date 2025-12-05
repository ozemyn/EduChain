package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 讨论DTO - 社区讨论展示
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionDTO {
    
    private Long id;
    private String title;
    private String author;
    private String authorAvatar;
    private Long authorId;
    private Integer replies;
    private Long views;
    private Long likes;
    private String time;
    private LocalDateTime createdAt;
    private List<String> tags;
    private Boolean isHot;
}
