package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 社区统计DTO - 社区整体统计数据 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityStatsDTO {

  private Long activeUsers;
  private Long totalDiscussions;
  private Long todayPosts;
  private Long todayComments;
}
