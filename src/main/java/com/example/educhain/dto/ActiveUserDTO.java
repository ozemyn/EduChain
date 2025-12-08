package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 活跃用户DTO - 社区活跃用户展示 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActiveUserDTO {

  private Long id;
  private String name;
  private String avatar;
  private Integer posts;
  private Long likes;
  private String level;
  private Integer rank;
}
