package com.example.educhain.config;

import java.io.File;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Web MVC 配置 配置静态资源映射，使上传的文件可以通过 HTTP 访问 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  @Value("${app.file.upload.path:uploads}")
  private String uploadPath;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 将相对路径转换为绝对路径
    File uploadDir = new File(uploadPath);
    String absolutePath = uploadDir.getAbsolutePath();

    // 映射 /uploads/** 路径到文件系统的 uploads 目录
    // 例如：访问 /api/uploads/2024/12/05/file.jpg 会映射到 uploads/2024/12/05/file.jpg
    registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + absolutePath + "/");

    System.out.println("Static resource mapping: /uploads/** -> " + absolutePath + "/");
  }
}
