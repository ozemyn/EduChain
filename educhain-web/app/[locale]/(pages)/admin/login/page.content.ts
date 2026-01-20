import { t, type Dictionary } from 'intlayer';

const adminLoginPageContent = {
  key: 'admin-login-page',
  content: {
    title: t({
      'zh-CN': '管理员登录',
      en: 'Admin Login',
    }),
    subtitle: t({
      'zh-CN': '请使用管理员账号安全登录',
      en: 'Please login with admin account securely',
    }),
    brandTitle: t({
      'zh-CN': '管理员控制中心',
      en: 'Admin Control Center',
    }),
    brandDescription: t({
      'zh-CN': '安全登录，管理平台，维护秩序',
      en: 'Secure login, manage platform, maintain order',
    }),
    featureSecurity: t({
      'zh-CN': '安全防护',
      en: 'Security Protection',
    }),
    featureSecurityDesc: t({
      'zh-CN': '多重安全验证',
      en: 'Multi-layer security verification',
    }),
    featureMonitoring: t({
      'zh-CN': '数据监控',
      en: 'Data Monitoring',
    }),
    featureMonitoringDesc: t({
      'zh-CN': '实时系统状态',
      en: 'Real-time system status',
    }),
    featureManagement: t({
      'zh-CN': '系统管理',
      en: 'System Management',
    }),
    featureManagementDesc: t({
      'zh-CN': '全面控制权限',
      en: 'Full control permissions',
    }),
    brandFooter: t({
      'zh-CN': '守护平台安全\n维护用户体验',
      en: 'Protect platform security\nMaintain user experience',
    }),
    usernamePlaceholder: t({
      'zh-CN': '管理员用户名或邮箱',
      en: 'Admin username or email',
    }),
    passwordPlaceholder: t({
      'zh-CN': '管理员密码',
      en: 'Admin password',
    }),
    loginButton: t({
      'zh-CN': '安全登录',
      en: 'Secure Login',
    }),
    loggingIn: t({
      'zh-CN': '验证中...',
      en: 'Verifying...',
    }),
    needHelp: t({
      'zh-CN': '需要帮助？',
      en: 'Need help?',
    }),
    backToHome: t({
      'zh-CN': '返回首页',
      en: 'Back to Home',
    }),
    bottomText: t({
      'zh-CN': '管理员账号具有系统最高权限，请妥善保管登录凭证',
      en: 'Admin accounts have the highest system privileges, please keep login credentials safe',
    }),
    usernameRequired: t({
      'zh-CN': '请输入管理员用户名或邮箱',
      en: 'Please enter admin username or email',
    }),
    usernameMinLength: t({
      'zh-CN': '用户名至少需要3个字符',
      en: 'Username must be at least 3 characters',
    }),
    passwordRequired: t({
      'zh-CN': '请输入管理员密码',
      en: 'Please enter admin password',
    }),
    passwordMinLength: t({
      'zh-CN': '密码至少需要6个字符',
      en: 'Password must be at least 6 characters',
    }),
    // Mock 模式相关
    mockModeTitle: t({
      'zh-CN': 'Mock 模式快速登录',
      en: 'Mock Mode Quick Login',
    }),
    mockModeSubtitle: t({
      'zh-CN': '🔧 开发测试模式 - 管理员快速登录',
      en: '🔧 Development Test Mode - Admin Quick Login',
    }),
    mockAdminLogin: t({
      'zh-CN': '一键管理员登录 (admin)',
      en: 'One-Click Admin Login (admin)',
    }),
    mockSwitchPage: t({
      'zh-CN': '切换登录页面',
      en: 'Switch Login Page',
    }),
    mockGoUserLogin: t({
      'zh-CN': '前往普通用户登录页面 →',
      en: 'Go to User Login Page →',
    }),
    mockNote: t({
      'zh-CN': '仅在Mock模式下可用，拥有完整管理权限',
      en: 'Only available in Mock mode, with full admin privileges',
    }),
  },
} satisfies Dictionary;

export default adminLoginPageContent;
