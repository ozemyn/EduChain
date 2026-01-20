import { t, type Dictionary } from 'intlayer';

const registerPageContent = {
  key: 'register-page',
  content: {
    title: t({
      'zh-CN': '创建账户',
      en: 'Create Account',
    }),
    subtitle: t({
      'zh-CN': '填写信息开始您的学习之旅',
      en: 'Fill in your details to start your learning journey',
    }),
    brandTitle: t({
      'zh-CN': '加入我们的学习社区',
      en: 'Join Our Learning Community',
    }),
    brandDescription: t({
      'zh-CN': '与全球学习者一起分享知识，共同成长',
      en: 'Share knowledge and grow together with learners worldwide',
    }),
    featureCommunity: t({
      'zh-CN': '活跃社区',
      en: 'Active Community',
    }),
    featureCommunityDesc: t({
      'zh-CN': '12,000+ 学习者',
      en: '12,000+ learners',
    }),
    featureContent: t({
      'zh-CN': '优质内容',
      en: 'Quality Content',
    }),
    featureContentDesc: t({
      'zh-CN': '8,000+ 知识分享',
      en: '8,000+ knowledge shares',
    }),
    featureSmart: t({
      'zh-CN': '智能推荐',
      en: 'Smart Recommendations',
    }),
    featureSmartDesc: t({
      'zh-CN': '个性化学习路径',
      en: 'Personalized learning paths',
    }),
    brandFooter: t({
      'zh-CN': '开启您的知识分享之旅\n让学习变得更有意义',
      en: 'Start your knowledge sharing journey\nMake learning more meaningful',
    }),
    usernameLabel: t({
      'zh-CN': '用户名',
      en: 'Username',
    }),
    usernamePlaceholder: t({
      'zh-CN': '请输入用户名',
      en: 'Enter your username',
    }),
    emailLabel: t({
      'zh-CN': '邮箱',
      en: 'Email',
    }),
    emailPlaceholder: t({
      'zh-CN': '请输入邮箱地址',
      en: 'Enter your email address',
    }),
    fullNameLabel: t({
      'zh-CN': '真实姓名',
      en: 'Full Name',
    }),
    fullNamePlaceholder: t({
      'zh-CN': '请输入真实姓名',
      en: 'Enter your full name',
    }),
    passwordLabel: t({
      'zh-CN': '密码',
      en: 'Password',
    }),
    passwordPlaceholder: t({
      'zh-CN': '请输入密码',
      en: 'Enter your password',
    }),
    confirmPasswordLabel: t({
      'zh-CN': '确认密码',
      en: 'Confirm Password',
    }),
    confirmPasswordPlaceholder: t({
      'zh-CN': '请再次输入密码',
      en: 'Enter your password again',
    }),
    registerButton: t({
      'zh-CN': '创建账户',
      en: 'Create Account',
    }),
    registering: t({
      'zh-CN': '注册中...',
      en: 'Creating account...',
    }),
    hasAccount: t({
      'zh-CN': '已有账号？',
      en: 'Already have an account?',
    }),
    loginNow: t({
      'zh-CN': '立即登录',
      en: 'Sign In Now',
    }),
    termsText: t({
      'zh-CN': '注册即表示您同意我们的',
      en: 'By signing up, you agree to our',
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
      'zh-CN': '请输入用户名',
      en: 'Please enter username',
    }),
    usernameLength: t({
      'zh-CN': '用户名长度应在3-20个字符之间',
      en: 'Username must be 3-20 characters',
    }),
    emailRequired: t({
      'zh-CN': '请输入邮箱',
      en: 'Please enter email',
    }),
    emailInvalid: t({
      'zh-CN': '请输入有效的邮箱地址',
      en: 'Please enter a valid email address',
    }),
    fullNameRequired: t({
      'zh-CN': '请输入真实姓名',
      en: 'Please enter your full name',
    }),
    passwordRequired: t({
      'zh-CN': '请输入密码',
      en: 'Please enter password',
    }),
    passwordLength: t({
      'zh-CN': '密码长度应在6-20个字符之间',
      en: 'Password must be 6-20 characters',
    }),
    confirmPasswordRequired: t({
      'zh-CN': '请确认密码',
      en: 'Please confirm your password',
    }),
    passwordMismatch: t({
      'zh-CN': '两次输入的密码不一致',
      en: 'Passwords do not match',
    }),
  },
} satisfies Dictionary;

export default registerPageContent;
