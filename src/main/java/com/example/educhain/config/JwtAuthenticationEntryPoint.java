package com.example.educhain.config;

import com.example.educhain.util.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/** JWT认证入口点 - 处理未认证的请求 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Autowired private ObjectMapper objectMapper;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    Result<Object> result = Result.error("UNAUTHORIZED", "请先登录");

    String jsonResponse = objectMapper.writeValueAsString(result);
    response.getWriter().write(jsonResponse);
  }
}
