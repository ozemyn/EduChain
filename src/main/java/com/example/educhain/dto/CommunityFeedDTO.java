package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 社区动态聚合DTO
 * 用于社区页面一次性获取所有需要的数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityFeedDTO {
    
    /**
     * 热门讨论列表
     */
    private List<DiscussionDTO> hotDiscussions;
    
    /**
     * 活跃用户列表
     */
    private List<ActiveUserDTO> activeUsers;
    
    /**
     * 热门话题标签
     */
    private List<HotTopicDTO> hotTopics;
    
    /**
     * 社区统计数据
     */
    private CommunityStatsDTO stats;
}
