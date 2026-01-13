/**
 * Spring Boot 微服务开发实战
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const springBootKnowledge = {
  id: 5,
  shareCode: generateMockShareCode(5),
  title: 'Spring Boot 微服务开发实战 - 企业级应用架构',
  content: `# Spring Boot 微服务开发实战 - 企业级应用架构

## 🚀 引言

Spring Boot 是基于 Spring 框架的快速开发脚手架，它简化了 Spring 应用的初始搭建和开发过程，让开发者能够快速构建生产级别的应用程序。

### Spring Boot 的优势

✅ **约定优于配置** - 减少配置工作
✅ **快速启动** - 内嵌服务器，快速运行
✅ **生产就绪** - 内置监控、健康检查
✅ **微服务友好** - 完美支持微服务架构
✅ **丰富的生态** - Spring Cloud 全家桶

---

## 📚 核心特性

### 1. 自动配置

Spring Boot 根据添加的依赖自动配置 Spring 应用。

\`\`\`java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

**自定义自动配置：**

\`\`\`java
@Configuration
@ConditionalOnClass(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(DataSourceProperties properties) {
        return DataSourceBuilder
            .create()
            .url(properties.getUrl())
            .username(properties.getUsername())
            .password(properties.getPassword())
            .build();
    }
}
\`\`\`

### 2. 起步依赖

通过 starter 依赖简化 Maven 配置。

\`\`\`xml
<dependencies>
    <!-- Web 开发 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- 数据访问 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- 安全 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
</dependencies>
\`\`\`

### 3. 配置管理

**application.yml：**

\`\`\`yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: user-service
  
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    
logging:
  level:
    root: INFO
    com.example: DEBUG
  file:
    name: logs/application.log
\`\`\`

**配置类：**

\`\`\`java
@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private String name;
    private String version;
    private Security security = new Security();
    
    @Data
    public static class Security {
        private String jwtSecret;
        private long jwtExpiration;
    }
}
\`\`\`

---

## 🎯 Web 开发

### REST API 开发

\`\`\`java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDTO> users = userService.getUsers(
            PageRequest.of(page, size)
        );
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.getUser(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity
            .created(URI.create("/api/users/" + user.getId()))
            .body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.updateUser(id, request)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

### 统一异常处理

\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message("Validation failed")
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
        Exception ex
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message("Internal server error")
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }
}
\`\`\`

---

## 💾 数据访问

### JPA Repository

\`\`\`java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :date")
    List<User> findRecentUsers(@Param("date") LocalDateTime date);
}
\`\`\`

### Service 层

\`\`\`java
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    @Transactional(readOnly = true)
    public Page<UserDTO> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(userMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUser(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toDTO);
    }
    
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists");
        }
        
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();
        
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    
    public Optional<UserDTO> updateUser(Long id, UpdateUserRequest request) {
        return userRepository.findById(id)
            .map(user -> {
                user.setEmail(request.getEmail());
                return userMapper.toDTO(userRepository.save(user));
            });
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
\`\`\`

---

## 🔐 安全认证

### JWT 认证

\`\`\`java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    @Value("\${app.security.jwt-secret}")
    private String jwtSecret;
    
    @Value("\${app.security.jwt-expiration}")
    private long jwtExpiration;
    
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .setSubject(Long.toString(userPrincipal.getId()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        
        return Long.parseLong(claims.getSubject());
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserById(userId);
                
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                
                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication", ex);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
\`\`\`

---

## 🌐 微服务架构

### 服务注册与发现（Nacos）

\`\`\`yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: dev
        group: DEFAULT_GROUP
\`\`\`

### 服务调用（OpenFeign）

\`\`\`java
@FeignClient(name = "order-service", fallback = OrderServiceFallback.class)
public interface OrderServiceClient {
    
    @GetMapping("/api/orders/{id}")
    OrderDTO getOrder(@PathVariable Long id);
    
    @PostMapping("/api/orders")
    OrderDTO createOrder(@RequestBody CreateOrderRequest request);
}

@Component
public class OrderServiceFallback implements OrderServiceClient {
    
    @Override
    public OrderDTO getOrder(Long id) {
        return OrderDTO.builder()
            .id(id)
            .status("UNAVAILABLE")
            .build();
    }
    
    @Override
    public OrderDTO createOrder(CreateOrderRequest request) {
        throw new ServiceUnavailableException("Order service is unavailable");
    }
}
\`\`\`

### API 网关（Spring Cloud Gateway）

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: orderServiceCircuitBreaker
                fallbackUri: forward:/fallback/orders
\`\`\`

---

## 📋 最佳实践

1. **分层架构**
   - Controller 层：处理 HTTP 请求
   - Service 层：业务逻辑
   - Repository 层：数据访问
   - DTO/Entity：数据传输对象

2. **异常处理**
   - 使用 @RestControllerAdvice 统一处理
   - 自定义业务异常
   - 返回统一的错误响应格式

3. **日志记录**
   - 使用 SLF4J + Logback
   - 合理设置日志级别
   - 记录关键业务操作

4. **接口文档**
   - 使用 Swagger/OpenAPI
   - 详细的接口说明
   - 示例请求和响应

5. **测试**
   - 单元测试（JUnit + Mockito）
   - 集成测试（@SpringBootTest）
   - API 测试（MockMvc）

---

## 🎓 总结

Spring Boot 为企业级应用开发提供了强大的支持，结合 Spring Cloud 可以轻松构建微服务架构。通过本指南，你应该已经了解了：

- Spring Boot 的核心特性和配置
- Web 开发和数据访问
- 安全认证和授权
- 微服务架构实践

继续实践，你会发现 Spring Boot 让 Java 开发变得更加高效！

---

**参考资源：**
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud)
- [Baeldung Spring 教程](https://www.baeldung.com/spring-boot)`,
  type: 'TEXT' as const,
  uploaderId: 5,
  uploaderName: '赵六',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu2',
  categoryId: 21,
  categoryName: 'Spring Boot',
  tags: 'Spring Boot,微服务,Java,后端开发',
  status: 1,
  createdAt: '2025-12-02T09:30:00Z',
  updatedAt: '2025-12-20T16:00:00Z',
  contentHash: 'hash_spring_boot_microservices',
};
