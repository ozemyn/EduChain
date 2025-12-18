/* ===================================
   开发文档页面 - Developer Documentation Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 代码高亮和示例
   - 侧边导航和锚点
   
   ================================== */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Menu,
  Tag,
  Space,
  Button,
  Divider,
  Alert,
} from 'antd';
import {
  CodeOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  RocketOutlined,
  BookOutlined,
  LinkOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import './Resources.css';

const { Title, Paragraph, Text } = Typography;

const DeveloperDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    {
      key: 'overview',
      icon: <BookOutlined />,
      label: '概述',
    },
    {
      key: 'getting-started',
      icon: <RocketOutlined />,
      label: '快速开始',
    },
    {
      key: 'api-reference',
      icon: <ApiOutlined />,
      label: 'API 参考',
      children: [
        { key: 'auth-api', label: '认证 API' },
        { key: 'content-api', label: '内容 API' },
        { key: 'blockchain-api', label: '区块链 API' },
        { key: 'user-api', label: '用户 API' },
      ],
    },
    {
      key: 'sdk',
      icon: <CodeOutlined />,
      label: 'SDK 文档',
      children: [
        { key: 'javascript-sdk', label: 'JavaScript SDK' },
        { key: 'python-sdk', label: 'Python SDK' },
        { key: 'java-sdk', label: 'Java SDK' },
      ],
    },
    {
      key: 'blockchain',
      icon: <SafetyOutlined />,
      label: '区块链集成',
    },
    {
      key: 'examples',
      icon: <DatabaseOutlined />,
      label: '示例代码',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <Title level={2}>EduChain 开发者文档</Title>
            <Paragraph>
              欢迎使用 EduChain 开发者文档！EduChain
              是一个基于区块链技术的教育知识共享平台， 为开发者提供了丰富的 API
              和 SDK，帮助您快速构建教育相关的应用程序。
            </Paragraph>

            <Alert
              type="info"
              showIcon
              style={{ margin: '24px 0' }}
              description={
                <div>
                  <strong>最新版本：v2.1.0</strong>
                  <br />
                  包含新的区块链存证 API 和增强的用户认证功能
                </div>
              }
            />

            <Title level={3}>核心功能</Title>
            <Paragraph>
              <ul>
                <li>
                  <strong>用户管理：</strong>完整的用户注册、登录、权限管理系统
                </li>
                <li>
                  <strong>内容管理：</strong>支持多媒体内容的上传、存储和检索
                </li>
                <li>
                  <strong>区块链存证：</strong>
                  内容哈希上链，提供不可篡改的版权保护
                </li>
                <li>
                  <strong>智能推荐：</strong>基于机器学习的个性化内容推荐
                </li>
                <li>
                  <strong>社交功能：</strong>评论、点赞、关注等社交互动功能
                </li>
              </ul>
            </Paragraph>

            <Title level={3}>技术架构</Title>
            <Paragraph>EduChain 采用现代化的微服务架构：</Paragraph>
            <Paragraph>
              <ul>
                <li>
                  <strong>前端：</strong>React + TypeScript + Ant Design
                </li>
                <li>
                  <strong>后端：</strong>Spring Boot + Spring Security + JPA
                </li>
                <li>
                  <strong>数据库：</strong>PostgreSQL + Redis
                </li>
                <li>
                  <strong>区块链：</strong>以太坊 + IPFS
                </li>
                <li>
                  <strong>部署：</strong>Docker + Kubernetes
                </li>
              </ul>
            </Paragraph>

            <Title level={3}>开发环境要求</Title>
            <Paragraph>
              <ul>
                <li>Node.js 16+ 或 Python 3.8+ 或 Java 11+</li>
                <li>现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）</li>
                <li>Git 版本控制工具</li>
                <li>API 测试工具（Postman, curl 等）</li>
              </ul>
            </Paragraph>
          </div>
        );

      case 'getting-started':
        return (
          <div>
            <Title level={2}>快速开始</Title>
            <Paragraph>
              按照以下步骤，您可以在几分钟内开始使用 EduChain API。
            </Paragraph>

            <Title level={3}>1. 获取 API 密钥</Title>
            <Paragraph>
              首先，您需要在 EduChain 开发者控制台创建应用并获取 API 密钥：
            </Paragraph>
            <div className="code-block">
              <pre>{`# 1. 注册开发者账户
# 2. 创建新应用
# 3. 获取 API Key 和 Secret
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here`}</pre>
            </div>

            <Title level={3}>2. 安装 SDK</Title>
            <Paragraph>选择您喜欢的编程语言安装对应的 SDK：</Paragraph>

            <div className="code-tabs">
              <Tag color="blue">JavaScript</Tag>
              <div className="code-block">
                <pre>{`npm install @educhain/sdk
# 或
yarn add @educhain/sdk`}</pre>
              </div>

              <Tag color="green">Python</Tag>
              <div className="code-block">
                <pre>{`pip install educhain-sdk`}</pre>
              </div>

              <Tag color="orange">Java</Tag>
              <div className="code-block">
                <pre>{`<dependency>
    <groupId>com.educhain</groupId>
    <artifactId>educhain-sdk</artifactId>
    <version>2.1.0</version>
</dependency>`}</pre>
              </div>
            </div>

            <Title level={3}>3. 初始化客户端</Title>
            <div className="code-block">
              <pre>{`import { EduChainClient } from '@educhain/sdk';

const client = new EduChainClient({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
  environment: 'production' // 或 'sandbox'
});`}</pre>
            </div>

            <Title level={3}>4. 第一个 API 调用</Title>
            <div className="code-block">
              <pre>{`// 获取用户信息
const user = await client.users.getCurrentUser();
console.log('当前用户:', user);

// 发布内容
const content = await client.content.create({
  title: '我的第一篇文章',
  content: '这是文章内容...',
  type: 'TEXT',
  tags: ['教育', '技术']
});
console.log('发布成功:', content);`}</pre>
            </div>
          </div>
        );

      case 'auth-api':
        return (
          <div>
            <Title level={2}>认证 API</Title>
            <Paragraph>
              EduChain 使用 OAuth 2.0 和 JWT 进行身份认证和授权。
            </Paragraph>

            <Title level={3}>获取访问令牌</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/auth/token</code>
            </div>
            <div className="code-block">
              <pre>{`curl -X POST https://api.educhain.cc/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret"
  }'`}</pre>
            </div>

            <Title level={4}>响应示例</Title>
            <div className="code-block">
              <pre>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}`}</pre>
            </div>

            <Title level={3}>用户登录</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/auth/login</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "email": "user@example.com",
  "password": "password123"
}`}</pre>
            </div>

            <Title level={3}>刷新令牌</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/auth/refresh</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "refresh_token": "your_refresh_token"
}`}</pre>
            </div>
          </div>
        );

      case 'blockchain-api':
        return (
          <div>
            <Title level={2}>区块链 API</Title>
            <Paragraph>
              EduChain 的区块链功能提供内容存证、版权保护和溯源验证服务。
            </Paragraph>

            <Title level={3}>内容存证</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/blockchain/certify</code>
            </div>
            <Paragraph>
              将内容哈希存储到区块链上，生成不可篡改的存证记录。
            </Paragraph>

            <div className="code-block">
              <pre>{`{
  "content_id": "12345",
  "content_hash": "0x1234567890abcdef...",
  "metadata": {
    "title": "文章标题",
    "author": "作者姓名",
    "created_at": "2025-12-07T10:00:00Z"
  }
}`}</pre>
            </div>

            <Title level={4}>响应示例</Title>
            <div className="code-block">
              <pre>{`{
  "certificate_id": "cert_67890",
  "transaction_hash": "0xabcdef1234567890...",
  "block_number": 18234567,
  "timestamp": "2025-12-07T10:01:23Z",
  "gas_used": 21000,
  "status": "confirmed"
}`}</pre>
            </div>

            <Title level={3}>验证存证</Title>
            <div className="api-endpoint">
              <Tag color="blue">GET</Tag>
              <code>/api/v1/blockchain/verify/&#123;certificate_id&#125;</code>
            </div>

            <Title level={3}>查询交易状态</Title>
            <div className="api-endpoint">
              <Tag color="blue">GET</Tag>
              <code>/api/v1/blockchain/transaction/&#123;tx_hash&#125;</code>
            </div>

            <Alert
              type="warning"
              showIcon
              style={{ margin: '16px 0' }}
              description={
                <div>
                  <strong>Gas 费用说明</strong>
                  <br />
                  区块链存证需要消耗少量 Gas
                  费用，平台会自动处理，费用从您的账户余额中扣除。
                </div>
              }
            />
          </div>
        );

      case 'javascript-sdk':
        return (
          <div>
            <Title level={2}>JavaScript SDK</Title>
            <Paragraph>
              EduChain JavaScript SDK 为前端开发者提供了完整的 API
              封装，支持现代浏览器和 Node.js 环境。
            </Paragraph>

            <Title level={3}>安装</Title>
            <div className="code-block">
              <pre>{`# 使用 npm
npm install @educhain/js-sdk

# 使用 yarn
yarn add @educhain/js-sdk

# 使用 CDN
<script src="https://cdn.educhain.cc/sdk/js/latest/educhain.min.js"></script>`}</pre>
            </div>

            <Title level={3}>快速开始</Title>
            <div className="code-block">
              <pre>{`import EduChain from '@educhain/js-sdk';

// 初始化客户端
const client = new EduChain({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
  baseURL: 'https://api.educhain.cc/v1'
});

// 用户认证
await client.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// 获取用户信息
const user = await client.users.getCurrentUser();
console.log('当前用户:', user);`}</pre>
            </div>

            <Title level={3}>内容管理</Title>
            <div className="code-block">
              <pre>{`// 创建内容
const content = await client.content.create({
  title: '我的第一篇文章',
  content: '这是文章内容...',
  type: 'TEXT',
  tags: ['JavaScript', 'SDK'],
  isPublic: true
});

// 获取内容列表
const contentList = await client.content.list({
  page: 0,
  size: 20,
  category: 'technology'
});

// 更新内容
await client.content.update(content.id, {
  title: '更新后的标题',
  content: '更新后的内容...'
});`}</pre>
            </div>
          </div>
        );

      case 'python-sdk':
        return (
          <div>
            <Title level={2}>Python SDK</Title>
            <Paragraph>
              EduChain Python SDK 为后端开发者和数据科学家提供了强大的 API
              接口。
            </Paragraph>

            <Title level={3}>安装</Title>
            <div className="code-block">
              <pre>{`# 使用 pip
pip install educhain-sdk

# 使用 conda
conda install -c educhain educhain-sdk

# 从源码安装
git clone https://github.com/educhain/python-sdk.git
cd python-sdk
pip install -e .`}</pre>
            </div>

            <Title level={3}>快速开始</Title>
            <div className="code-block">
              <pre>{`from educhain import EduChainClient

# 初始化客户端
client = EduChainClient(
    api_key='your_api_key',
    api_secret='your_api_secret',
    base_url='https://api.educhain.cc/v1'
)

# 用户认证
client.auth.login(
    email='user@example.com',
    password='password123'
)

# 获取用户信息
user = client.users.get_current_user()
print(f'当前用户: {user.name}')`}</pre>
            </div>

            <Title level={3}>数据分析</Title>
            <div className="code-block">
              <pre>{`import pandas as pd
import matplotlib.pyplot as plt

# 获取学习数据
learning_data = client.analytics.get_learning_data(
    user_id='12345',
    start_date='2024-01-01',
    end_date='2024-12-31'
)

# 转换为 DataFrame
df = pd.DataFrame(learning_data)

# 数据可视化
plt.figure(figsize=(12, 6))
plt.plot(df['date'], df['study_time'])
plt.title('学习时间趋势')
plt.xlabel('日期')
plt.ylabel('学习时间(小时)')
plt.show()`}</pre>
            </div>
          </div>
        );

      case 'java-sdk':
        return (
          <div>
            <Title level={2}>Java SDK</Title>
            <Paragraph>
              EduChain Java SDK 为企业级应用开发提供了稳定可靠的 API 接口。
            </Paragraph>

            <Title level={3}>Maven 依赖</Title>
            <div className="code-block">
              <pre>{`<dependency>
    <groupId>com.educhain</groupId>
    <artifactId>educhain-sdk</artifactId>
    <version>2.1.0</version>
</dependency>`}</pre>
            </div>

            <Title level={3}>Gradle 依赖</Title>
            <div className="code-block">
              <pre>{`implementation 'com.educhain:educhain-sdk:2.1.0'`}</pre>
            </div>

            <Title level={3}>快速开始</Title>
            <div className="code-block">
              <pre>{`import com.educhain.sdk.EduChainClient;
import com.educhain.sdk.model.User;

// 初始化客户端
EduChainClient client = EduChainClient.builder()
    .apiKey("your_api_key")
    .apiSecret("your_api_secret")
    .baseUrl("https://api.educhain.cc/v1")
    .build();

// 用户认证
client.auth().login("user@example.com", "password123");

// 获取用户信息
User user = client.users().getCurrentUser();
System.out.println("当前用户: " + user.getName());`}</pre>
            </div>

            <Title level={3}>Spring Boot 集成</Title>
            <div className="code-block">
              <pre>{`@Configuration
public class EduChainConfig {
    
    @Bean
    public EduChainClient eduChainClient() {
        return EduChainClient.builder()
            .apiKey("\${educhain.api.key}")
            .apiSecret("\${educhain.api.secret}")
            .build();
    }
}

@Service
public class ContentService {
    
    @Autowired
    private EduChainClient eduChainClient;
    
    public Content createContent(CreateContentRequest request) {
        return eduChainClient.content().create(request);
    }
}`}</pre>
            </div>
          </div>
        );

      case 'content-api':
        return (
          <div>
            <Title level={2}>内容 API</Title>
            <Paragraph>
              内容 API
              提供了完整的内容管理功能，包括创建、编辑、删除、搜索等操作。
            </Paragraph>

            <Title level={3}>创建内容</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/content</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "title": "深度学习入门指南",
  "content": "本文将介绍深度学习的基础概念...",
  "type": "TEXT",
  "category_id": 5,
  "tags": ["深度学习", "AI", "机器学习"],
  "is_public": true,
  "allow_comments": true,
  "metadata": {
    "difficulty": "beginner",
    "estimated_time": 30
  }
}`}</pre>
            </div>

            <Title level={3}>获取内容详情</Title>
            <div className="api-endpoint">
              <Tag color="blue">GET</Tag>
              <code>/api/v1/content/&#123;id&#125;</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "id": 12345,
  "title": "深度学习入门指南",
  "content": "本文将介绍深度学习的基础概念...",
  "author": {
    "id": 67890,
    "name": "张教授",
    "avatar": "https://example.com/avatar.jpg"
  },
  "stats": {
    "view_count": 1520,
    "like_count": 89,
    "comment_count": 23,
    "share_count": 15
  },
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T15:30:00Z"
}`}</pre>
            </div>

            <Title level={3}>搜索内容</Title>
            <div className="api-endpoint">
              <Tag color="blue">GET</Tag>
              <code>/api/v1/content/search</code>
            </div>
            <Paragraph>支持多种搜索参数：</Paragraph>
            <div className="code-block">
              <pre>{`GET /api/v1/content/search?q=深度学习&category=AI&difficulty=beginner&sort=popularity&page=0&size=20`}</pre>
            </div>
          </div>
        );

      case 'user-api':
        return (
          <div>
            <Title level={2}>用户 API</Title>
            <Paragraph>
              用户 API 提供了用户管理、个人资料、关注关系等功能。
            </Paragraph>

            <Title level={3}>获取用户信息</Title>
            <div className="api-endpoint">
              <Tag color="blue">GET</Tag>
              <code>/api/v1/users/&#123;id&#125;</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "id": 12345,
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "full_name": "张三",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "资深AI研究员，专注深度学习领域",
  "location": "北京",
  "website": "https://zhangsan.com",
  "stats": {
    "followers_count": 1520,
    "following_count": 89,
    "content_count": 156,
    "total_likes": 8920
  },
  "created_at": "2023-01-15T08:30:00Z"
}`}</pre>
            </div>

            <Title level={3}>更新用户资料</Title>
            <div className="api-endpoint">
              <Tag color="orange">PUT</Tag>
              <code>/api/v1/users/profile</code>
            </div>
            <div className="code-block">
              <pre>{`{
  "full_name": "张三教授",
  "bio": "清华大学计算机系教授，AI领域专家",
  "location": "北京",
  "website": "https://zhangsan-prof.com",
  "social_links": {
    "github": "https://github.com/zhangsan",
    "twitter": "https://twitter.com/zhangsan"
  }
}`}</pre>
            </div>

            <Title level={3}>关注用户</Title>
            <div className="api-endpoint">
              <Tag color="green">POST</Tag>
              <code>/api/v1/users/&#123;id&#125;/follow</code>
            </div>

            <Title level={3}>取消关注</Title>
            <div className="api-endpoint">
              <Tag color="red">DELETE</Tag>
              <code>/api/v1/users/&#123;id&#125;/follow</code>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div>
            <Title level={2}>示例代码</Title>
            <Paragraph>这里提供了一些常见场景的完整示例代码。</Paragraph>

            <Title level={3}>完整的内容发布流程</Title>
            <div className="code-block">
              <pre>{`// JavaScript 示例
async function publishContent() {
  try {
    // 1. 用户登录
    await client.auth.login({
      email: 'author@example.com',
      password: 'password123'
    });

    // 2. 上传图片
    const imageFile = document.getElementById('image').files[0];
    const uploadResult = await client.upload.image(imageFile);

    // 3. 创建内容
    const content = await client.content.create({
      title: '机器学习实战教程',
      content: \`# 机器学习实战教程
      
本教程将带你从零开始学习机器学习...

![示例图片](\${uploadResult.url})
      \`,
      type: 'TEXT',
      category_id: 5,
      tags: ['机器学习', '教程', '实战'],
      cover_image: uploadResult.url
    });

    // 4. 区块链存证
    const certificate = await client.blockchain.certify({
      contentId: content.id,
      metadata: {
        title: content.title,
        author: 'AI教程作者',
        type: 'educational_content'
      }
    });

    console.log('发布成功！', {
      contentId: content.id,
      certificateId: certificate.id
    });

  } catch (error) {
    console.error('发布失败:', error);
  }
}`}</pre>
            </div>

            <Title level={3}>批量数据处理</Title>
            <div className="code-block">
              <pre>{`# Python 示例
import asyncio
from educhain import EduChainClient

async def batch_process_content():
    client = EduChainClient(
        api_key='your_api_key',
        api_secret='your_api_secret'
    )
    
    # 获取待处理的内容列表
    content_list = await client.content.list(
        status='draft',
        limit=100
    )
    
    # 批量处理
    tasks = []
    for content in content_list:
        task = process_single_content(client, content)
        tasks.append(task)
    
    # 并发执行
    results = await asyncio.gather(*tasks)
    
    print(f'处理完成，共处理 {len(results)} 个内容')

async def process_single_content(client, content):
    try:
        # 内容审核
        audit_result = await client.content.audit(content.id)
        
        if audit_result.approved:
            # 发布内容
            await client.content.publish(content.id)
            
            # 自动存证
            await client.blockchain.certify({
                'content_id': content.id
            })
            
        return {'id': content.id, 'status': 'success'}
        
    except Exception as e:
        return {'id': content.id, 'status': 'error', 'error': str(e)}

# 运行批量处理
asyncio.run(batch_process_content())`}</pre>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Title level={2}>内容开发中...</Title>
            <Paragraph>该部分文档正在完善中，敬请期待。</Paragraph>
          </div>
        );
    }
  };

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <CodeOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            开发文档
          </Title>
          <Text type="secondary">完整的 API 文档和开发指南</Text>
        </header>

        {/* 快速链接 */}
        <Card className="quick-links glass-card animate-fade-in-up delay-100">
          <Space wrap size="large">
            <Button
              type="primary"
              icon={<RocketOutlined />}
              size="large"
              className="glass-button glass-strong hover-lift active-scale"
            >
              快速开始
            </Button>
            <Button
              icon={<ApiOutlined />}
              size="large"
              className="glass-button hover-lift active-scale"
            >
              API 参考
            </Button>
            <Button
              icon={<DownloadOutlined />}
              size="large"
              className="glass-button hover-lift active-scale"
            >
              下载 SDK
            </Button>
            <Button
              icon={<LinkOutlined />}
              size="large"
              className="glass-button hover-lift active-scale"
            >
              在线测试
            </Button>
          </Space>
        </Card>

        {/* 主要内容区域 */}
        <div className="docs-layout">
          {/* 侧边导航 */}
          <Card className="docs-sidebar glass-card animate-fade-in-up delay-200">
            <Menu
              mode="inline"
              selectedKeys={[activeSection]}
              openKeys={['api-reference', 'sdk']}
              items={menuItems}
              onClick={({ key }) => setActiveSection(key)}
              className="docs-menu"
            />
          </Card>

          {/* 文档内容 */}
          <Card className="docs-content glass-card animate-fade-in-up delay-300">
            {renderContent()}
          </Card>
        </div>

        {/* 底部信息 */}
        <Card className="docs-footer glass-card animate-fade-in-up delay-400">
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>需要帮助？</Title>
            <Paragraph type="secondary">
              如果您在开发过程中遇到问题，可以通过以下方式获取支持
            </Paragraph>

            <Space size="large" wrap>
              <Button
                icon={<BookOutlined />}
                className="glass-button hover-lift active-scale"
              >
                查看示例
              </Button>
              <Button
                icon={<ApiOutlined />}
                className="glass-button hover-lift active-scale"
              >
                API 测试
              </Button>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                className="glass-button glass-strong hover-lift active-scale"
              >
                联系技术支持
              </Button>
            </Space>

            <Divider />

            <Space size="small" style={{ flexDirection: 'column' }}>
              <Text type="secondary">开发者社区：</Text>
              <Text>GitHub: github.com/educhain/sdk</Text>
              <Text>技术支持：ozemyn@icloud.com</Text>
              <Text>文档更新：每周三发布</Text>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperDocs;
