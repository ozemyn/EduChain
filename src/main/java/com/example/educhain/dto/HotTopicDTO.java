package com.example.educhain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 热门话题DTO - 社区热门话题展示 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotTopicDTO {

  private String name;
  private Long count;
  private String color;
}
