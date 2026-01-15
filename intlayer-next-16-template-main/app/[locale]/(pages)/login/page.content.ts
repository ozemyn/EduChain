import { t, type Dictionary } from 'intlayer';

const loginPageContent = {
  key: 'login-page',
  content: {
    title: t({
      'zh-CN': '欢迎回来',
      en: 'Welcome Back',
    }),
    subtitle: t({
      'zh-CN': '登录您的账户继续学习之旅',
      en: 'Sign in to continue your learning journey',
    }),
    brandTitle: t({
      'zh-CN': '基于区块链存证的教育知识共享与智能检索系统',
      en: 'Blockchain-based Educational Knowledge Sharing Platform',
    }),
    brandDescription: t({
      'zh-CN': '连接学习者与教育者，构建知识分享的桥梁',
      en: 'Connecting learners and educators, building bridges of knowledge',
    }),
    featureSecurity: t({
      'zh-CN': '安全可靠',
      en: 'Secure & Reliable',
    }),
    featureSecurityDesc: t({
      'zh-CN': '企业级安全保障',
      en: 'Enterprise-grade security',
    }),
    featureSmart: t({
      'zh-CN': '高效学习',
      en: 'Smart Learning',
    }),
    featureSmartDesc: t({
      'zh-CN': '智能推荐系统',
      en: 'AI-powered recommendations',
    }),
    featureCommunity: t({
      'zh-CN': '活跃社区',
      en: 'Active Community',
    }),
    featureCommunityDesc: t({
      'zh-CN': '与优秀者同行',
      en: 'Learn with the best',
    }),
    brandFooter: t({
      'zh-CN': '在这里，每一份知识都有价值\n每一次分享都有意义',
      en: 'Here, every piece of knowledge matters\nEvery share makes a difference',
    }),
    usernamePlaceholder: t({
      'zh-CN': '用户名或邮箱',
      en: 'Username or Email',
    }),
    passwordPlaceholder: t({
      'zh-CN': '密码',
      en: 'Password',
    }),
    loginButton: t({
      'zh-CN': '登录',
      en: 'Sign In',
    }),
    loggingIn: t({
      'zh-CN': '登录中...',
      en: 'Signing in...',
    }),
    noAccount: t({
      'zh-CN': '还没有账号？',
      en: "Don't have an account?",
    }),
    registerNow: t({
      'zh-CN': '立即注册',
      en: 'Sign Up Now',
    }),
    termsText: t({
      'zh-CN': '登录即表示您同意我们的',
      en: 'By signing in, you agree to our',
    }),
    termsLink: t({
      'zh-CN': '服务条款',
      en: 'Terms of Service',
    }),
    andText: t({
      'zh-CN': '和',
      en: 'and',
    }),
    privacyLink: t({
      'zh-CN': '隐私政策',
      en: 'Privacy Policy',
    }),
    usernameRequired: t({
      'zh-CN': '请输入用户名或邮箱',
      en: 'Please enter username or email',
    }),
    passwordRequired: t({
      'zh-CN': '请输入密码',
      en: 'Please enter password',
    }),
    // Mock 模式相关
    mockModeTitle: t({
      'zh-CN': 'Mock 模式快速登录',
      en: 'Mock Mode Quick Login',
    }),
    mockModeSubtitle: t({
      'zh-CN': '开发测试模式 - 一键登录',
      en: 'Development mode - One-click login',
    }),
    mockUserLogin: t({
      'zh-CN': '普通用户登录 (张三)',
      en: 'User Login (Zhang San)',
    }),
    mockAdminLogin: t({
      'zh-CN': '跳转管理员登录页面',
      en: 'Go to Admin Login',
    }),
    mockSwitchPage: t({
      'zh-CN': '切换登录页面',
      en: 'Switch Login Page',
    }),
    mockGoAdmin: t({
      'zh-CN': '前往管理员登录页面',
      en: 'Go to Admin Login Page',
    }),
    mockNote: t({
      'zh-CN': '仅在Mock模式下可用，使用虚拟数据',
      en: 'Only available in Mock mode, using virtual data',
    }),
  },
} satisfies Dictionary;

export default loginPageContent;
