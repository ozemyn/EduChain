import { type Dictionary, t } from 'intlayer';

const resourcesContent = {
  key: 'resources',
  content: {
    // 帮助中心
    help: {
      title: t({
        'zh-CN': '帮助中心',
        en: 'Help Center',
      }),
      description: t({
        'zh-CN': '快速找到您需要的帮助和解答',
        en: 'Quickly find the help and answers you need',
      }),
      searchPlaceholder: t({
        'zh-CN': '搜索问题...',
        en: 'Search questions...',
      }),
      categories: [
        { key: 'all', label: t({ 'zh-CN': '全部', en: 'All' }) },
        { key: 'account', label: t({ 'zh-CN': '账户', en: 'Account' }) },
        { key: 'content', label: t({ 'zh-CN': '内容', en: 'Content' }) },
        { key: 'blockchain', label: t({ 'zh-CN': '区块链', en: 'Blockchain' }) },
        { key: 'payment', label: t({ 'zh-CN': '支付', en: 'Payment' }) },
      ],
      faqs: [
        {
          category: 'account',
          question: t({ 'zh-CN': '如何注册账户？', en: 'How to register an account?' }),
          answer: t({ 'zh-CN': '点击页面右上角的"注册"按钮，填写邮箱和密码，验证邮箱后即可完成注册。', en: 'Click the "Register" button in the top right corner, fill in your email and password, and verify your email to complete registration.' }),
        },
        {
          category: 'account',
          question: t({ 'zh-CN': '忘记密码怎么办？', en: 'What if I forgot my password?' }),
          answer: t({ 'zh-CN': '在登录页面点击"忘记密码"，输入注册邮箱，我们会发送重置链接到您的邮箱。', en: 'Click "Forgot Password" on the login page, enter your registered email, and we will send a reset link to your email.' }),
        },
        {
          category: 'content',
          question: t({ 'zh-CN': '如何发布内容？', en: 'How to publish content?' }),
          answer: t({ 'zh-CN': '登录后点击"发布"按钮，选择内容类型，填写标题和内容，添加标签后即可发布。', en: 'After logging in, click the "Publish" button, select content type, fill in title and content, add tags and publish.' }),
        },
        {
          category: 'blockchain',
          question: t({ 'zh-CN': '什么是区块链存证？', en: 'What is blockchain certification?' }),
          answer: t({ 'zh-CN': '区块链存证是将内容的哈希值存储在区块链上，确保内容的原创性和完整性，具有法律效力。', en: 'Blockchain certification stores the hash of content on the blockchain, ensuring originality and integrity with legal validity.' }),
        },
        {
          category: 'blockchain',
          question: t({ 'zh-CN': '存证需要多长时间？', en: 'How long does certification take?' }),
          answer: t({ 'zh-CN': '通常在1-3分钟内完成，具体时间取决于区块链网络状态。', en: 'Usually completed within 1-3 minutes, depending on blockchain network status.' }),
        },
        {
          category: 'payment',
          question: t({ 'zh-CN': '支持哪些支付方式？', en: 'What payment methods are supported?' }),
          answer: t({ 'zh-CN': '支持微信支付、支付宝、银行卡等多种支付方式。', en: 'We support WeChat Pay, Alipay, bank cards and other payment methods.' }),
        },
      ],
      contact: {
        title: t({ 'zh-CN': '还没找到答案？', en: 'Still need help?' }),
        description: t({ 'zh-CN': '提交工单或查看您的工单状态', en: 'Submit a ticket or check your ticket status' }),
        submitTicket: t({ 'zh-CN': '提交工单', en: 'Submit Ticket' }),
        myTickets: t({ 'zh-CN': '我的工单', en: 'My Tickets' }),
      },
    },

    // 开发文档
    docs: {
      title: t({
        'zh-CN': '开发文档',
        en: 'Developer Docs',
      }),
      description: t({
        'zh-CN': '完整的开发指南和技术文档',
        en: 'Complete development guides and technical documentation',
      }),
      quickStart: {
        title: t({ 'zh-CN': '快速开始', en: 'Quick Start' }),
        description: t({ 'zh-CN': '5分钟内开始使用 EduChain API', en: 'Start using EduChain API in 5 minutes' }),
      },
      apiReference: {
        title: t({ 'zh-CN': 'API 参考', en: 'API Reference' }),
        description: t({ 'zh-CN': '完整的接口文档', en: 'Complete API documentation' }),
      },
      sdks: {
        title: t({ 'zh-CN': 'SDK', en: 'SDKs' }),
        description: t({ 'zh-CN': '官方客户端库', en: 'Official client libraries' }),
      },
      installSdk: t({ 'zh-CN': '安装 SDK', en: 'Install SDK' }),
      nextSteps: {
        title: t({ 'zh-CN': '下一步', en: 'Next Steps' }),
        description: t({ 'zh-CN': '查看完整的 API 文档了解更多功能，或者浏览 SDK 文档开始集成。', en: 'Check out the complete API documentation for more features, or browse the SDK documentation to start integration.' }),
      },
      apiDocs: {
        title: t({ 'zh-CN': 'API 文档', en: 'API Docs' }),
        description: t({ 'zh-CN': '完整的接口说明', en: 'Complete API reference' }),
      },
      changelogLink: {
        title: t({ 'zh-CN': '更新日志', en: 'Changelog' }),
        description: t({ 'zh-CN': '了解最新变更', en: 'Learn about latest changes' }),
      },
      sections: [
        {
          title: t({ 'zh-CN': '入门指南', en: 'Getting Started' }),
          items: [
            { title: t({ 'zh-CN': '简介', en: 'Introduction' }), href: '#intro' },
            { title: t({ 'zh-CN': '快速开始', en: 'Quick Start' }), href: '#quickstart' },
            { title: t({ 'zh-CN': '认证', en: 'Authentication' }), href: '#auth' },
          ],
        },
        {
          title: t({ 'zh-CN': 'API 参考', en: 'API Reference' }),
          items: [
            { title: t({ 'zh-CN': '用户 API', en: 'User API' }), href: '#user-api' },
            { title: t({ 'zh-CN': '内容 API', en: 'Content API' }), href: '#content-api' },
            { title: t({ 'zh-CN': '区块链 API', en: 'Blockchain API' }), href: '#blockchain-api' },
          ],
        },
        {
          title: t({ 'zh-CN': 'SDK', en: 'SDKs' }),
          items: [
            { title: t({ 'zh-CN': 'JavaScript SDK', en: 'JavaScript SDK' }), href: '#js-sdk' },
            { title: t({ 'zh-CN': 'Python SDK', en: 'Python SDK' }), href: '#python-sdk' },
            { title: t({ 'zh-CN': 'Java SDK', en: 'Java SDK' }), href: '#java-sdk' },
          ],
        },
      ],
      codeExample: `// 安装 SDK
npm install @educhain/sdk

// 初始化
import { EduChain } from '@educhain/sdk';

const client = new EduChain({
  apiKey: 'your-api-key',
});

// 获取内容列表
const contents = await client.content.list({
  page: 1,
  limit: 10,
});`,
    },

    // API 文档
    apiDocs: {
      title: t({
        'zh-CN': 'API 文档',
        en: 'API Documentation',
      }),
      description: t({
        'zh-CN': '完整的 RESTful API 接口文档',
        en: 'Complete RESTful API documentation',
      }),
      baseUrl: 'https://api.educhain.cc/v1',
      exampleRequests: {
        title: t({ 'zh-CN': '示例请求', en: 'Example Requests' }),
        getContentList: t({ 'zh-CN': '获取内容列表', en: 'Get Content List' }),
        createContent: t({ 'zh-CN': '创建内容', en: 'Create Content' }),
        blockchainCertify: t({ 'zh-CN': '区块链存证', en: 'Blockchain Certification' }),
      },
      responseFormat: {
        title: t({ 'zh-CN': '响应格式', en: 'Response Format' }),
        description: t({ 'zh-CN': '所有 API 响应都采用 JSON 格式，包含以下字段：', en: 'All API responses are in JSON format with the following fields:' }),
        successMessage: t({ 'zh-CN': '操作成功', en: 'Operation successful' }),
        errorResponse: t({ 'zh-CN': '错误响应', en: 'Error Response' }),
        errorMessage: t({ 'zh-CN': '请求参数错误', en: 'Invalid request parameters' }),
      },
      endpoints: [
        {
          method: 'GET',
          path: '/content',
          description: t({ 'zh-CN': '获取内容列表', en: 'Get content list' }),
        },
        {
          method: 'POST',
          path: '/content',
          description: t({ 'zh-CN': '创建新内容', en: 'Create new content' }),
        },
        {
          method: 'GET',
          path: '/content/{id}',
          description: t({ 'zh-CN': '获取内容详情', en: 'Get content details' }),
        },
        {
          method: 'PUT',
          path: '/content/{id}',
          description: t({ 'zh-CN': '更新内容', en: 'Update content' }),
        },
        {
          method: 'DELETE',
          path: '/content/{id}',
          description: t({ 'zh-CN': '删除内容', en: 'Delete content' }),
        },
        {
          method: 'POST',
          path: '/blockchain/certify',
          description: t({ 'zh-CN': '区块链存证', en: 'Blockchain certification' }),
        },
        {
          method: 'GET',
          path: '/blockchain/verify/{hash}',
          description: t({ 'zh-CN': '验证存证', en: 'Verify certification' }),
        },
      ],
      authentication: {
        title: t({ 'zh-CN': '认证方式', en: 'Authentication' }),
        description: t({ 'zh-CN': '所有 API 请求需要在 Header 中携带 API Key', en: 'All API requests require an API Key in the Header' }),
        example: 'Authorization: Bearer your-api-key',
      },
    },

    // 更新日志
    changelog: {
      title: t({
        'zh-CN': '更新日志',
        en: 'Changelog',
      }),
      description: t({
        'zh-CN': '了解 EduChain 的最新更新和改进',
        en: 'Learn about the latest updates and improvements to EduChain',
      }),
      subscribe: {
        title: t({ 'zh-CN': '订阅更新通知', en: 'Subscribe to Updates' }),
        description: t({ 'zh-CN': '第一时间获取 EduChain 的最新更新和功能发布', en: 'Be the first to know about EduChain updates and new features' }),
        placeholder: t({ 'zh-CN': '输入您的邮箱', en: 'Enter your email' }),
        button: t({ 'zh-CN': '订阅', en: 'Subscribe' }),
      },
      versions: [
        {
          version: '2.1.0',
          date: '2026-01-10',
          type: 'minor',
          changes: [
            { type: 'new', text: t({ 'zh-CN': '新增多语言支持（中文、英文）', en: 'Added multi-language support (Chinese, English)' }) },
            { type: 'new', text: t({ 'zh-CN': '新增深色模式', en: 'Added dark mode' }) },
            { type: 'improved', text: t({ 'zh-CN': '优化搜索算法，提升搜索准确度', en: 'Optimized search algorithm for better accuracy' }) },
            { type: 'fixed', text: t({ 'zh-CN': '修复移动端显示问题', en: 'Fixed mobile display issues' }) },
          ],
        },
        {
          version: '2.0.0',
          date: '2025-12-01',
          type: 'major',
          changes: [
            { type: 'new', text: t({ 'zh-CN': '全新 UI 设计，采用玻璃态风格', en: 'New UI design with glassmorphism style' }) },
            { type: 'new', text: t({ 'zh-CN': '区块链存证功能上线', en: 'Blockchain certification feature launched' }) },
            { type: 'new', text: t({ 'zh-CN': '智能推荐系统', en: 'Smart recommendation system' }) },
            { type: 'improved', text: t({ 'zh-CN': '性能优化，页面加载速度提升 50%', en: 'Performance optimization, 50% faster page load' }) },
          ],
        },
        {
          version: '1.5.2',
          date: '2025-10-15',
          type: 'patch',
          changes: [
            { type: 'fixed', text: t({ 'zh-CN': '修复登录状态异常问题', en: 'Fixed login status issues' }) },
            { type: 'fixed', text: t({ 'zh-CN': '修复内容编辑器兼容性问题', en: 'Fixed content editor compatibility issues' }) },
            { type: 'improved', text: t({ 'zh-CN': '优化图片上传体验', en: 'Improved image upload experience' }) },
          ],
        },
      ],
      typeLabels: {
        new: t({ 'zh-CN': '新增', en: 'New' }),
        improved: t({ 'zh-CN': '优化', en: 'Improved' }),
        fixed: t({ 'zh-CN': '修复', en: 'Fixed' }),
      },
      versionLabels: {
        major: t({ 'zh-CN': '重大更新', en: 'Major' }),
        minor: t({ 'zh-CN': '功能更新', en: 'Minor' }),
        patch: t({ 'zh-CN': '问题修复', en: 'Patch' }),
      },
    },
  },
} satisfies Dictionary;



export default resourcesContent;
