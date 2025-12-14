/**
 * Spring Boot 微服务开发实战
 */

import { generateMockShareCode } from '../../utils/shareCodeGenerator';

export const springBootKnowledge = {
  id: 5,
  shareCode: generateMockShareCode(5),
  title: 'Spring Boot 微服务开发实战',
  content: `Spring Boot 是基于 Spring 框架的快速开发脚手架，简化了 Spring 应用的初始搭建和开发过程。

核心特性：

1. 自动配置
Spring Boot 根据添加的依赖自动配置 Spring 应用，大大减少了配置工作。

2. 起步依赖
通过 starter 依赖简化 Maven 配置，一个 starter 包含了一组相关的依赖。

3. 内嵌服务器
内置 Tomcat、Jetty 或 Undertow，无需部署 WAR 文件。

4. 生产就绪特性
提供了健康检查、指标收集、应用监控等生产环境所需的功能。

常用注解：

应用配置：
• @SpringBootApplication - 标注主类
• @Configuration - 配置类
• @Bean - 定义 Bean
• @Value - 注入配置值
• @ConfigurationProperties - 绑定配置属性

Web 开发：
• @RestController - REST 控制器
• @RequestMapping - 请求映射
• @GetMapping、@PostMapping 等 - HTTP 方法映射
• @PathVariable - 路径变量
• @RequestParam - 请求参数
• @RequestBody - 请求体

数据访问：
• @Repository - 数据访问层
• @Transactional - 事务管理
• @Entity - JPA 实体
• @Table - 数据库表映射

依赖注入：
• @Autowired - 自动装配
• @Component - 组件
• @Service - 服务层
• @Qualifier - 指定注入的 Bean

微服务架构：

1. 服务注册与发现
使用 Eureka、Consul 或 Nacos 实现服务注册与发现。

2. 配置中心
使用 Spring Cloud Config 或 Nacos 实现配置集中管理。

3. 负载均衡
使用 Ribbon 或 Spring Cloud LoadBalancer 实现客户端负载均衡。

4. 服务调用
使用 Feign 或 RestTemplate 实现服务间调用。

5. 熔断降级
使用 Hystrix 或 Sentinel 实现服务熔断和降级。

6. API 网关
使用 Spring Cloud Gateway 或 Zuul 实现 API 网关。

最佳实践：
• 合理划分微服务边界
• 使用统一的异常处理
• 实现完善的日志记录
• 做好接口文档（Swagger）
• 编写单元测试和集成测试
• 使用 Docker 容器化部署`,
  type: 'TEXT',
  uploaderId: 4,
  uploaderName: '赵六',
  uploaderAvatar: '',
  categoryId: 21,
  categoryName: 'Spring Boot',
  tags: 'Spring Boot,微服务,Java,后端开发',
  status: 1,
  createdAt: '2024-11-06T09:00:00Z',
  updatedAt: '2024-11-19T15:30:00Z',
  contentHash: 'hash_spring_boot_microservices',
};
