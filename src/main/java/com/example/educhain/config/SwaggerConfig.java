package com.example.educhain.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Swagger/OpenAPI 配置 */
@Configuration
public class SwaggerConfig implements WebMvcConfigurer {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("EduChain API 文档")
                .description("教育知识共享平台 REST API 接口文档")
                .version("1.0.0")
                .contact(new Contact().name("EduChain 开发团队").email("dev@educhain.com")))
        .servers(List.of(new Server().url("http://localhost:8080/api").description("本地开发环境")))
        .components(
            new Components()
                .addSecuritySchemes(
                    "bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT 认证令牌，格式：Bearer {token}")));
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 确保 Swagger UI 资源能被正确访问
    registry
        .addResourceHandler("/swagger-ui/**")
        .addResourceLocations("classpath:/META-INF/resources/webjars/swagger-ui/");

    registry
        .addResourceHandler("/webjars/**")
        .addResourceLocations("classpath:/META-INF/resources/webjars/");
  }
}
