import { t, type Dictionary } from 'intlayer';

const profilePageContent = {
  key: 'profile-page',
  content: {
    // 页面元数据
    pageTitle: t({
      'zh-CN': '个人中心',
      en: 'Profile',
    }),

    // 用户信息
    level: t({
      'zh-CN': '等级',
      en: 'Level',
    }),
    admin: t({
      'zh-CN': '管理员',
      en: 'Admin',
    }),
    joinedAt: t({
      'zh-CN': '加入于',
      en: 'Joined',
    }),
    noBio: t({
      'zh-CN': '暂无简介',
      en: 'No bio yet',
    }),

    // 统计数据
    publishedContent: t({
      'zh-CN': '发布内容',
      en: 'Published',
    }),
    receivedLikes: t({
      'zh-CN': '获得点赞',
      en: 'Likes',
    }),
    totalViews: t({
      'zh-CN': '总浏览量',
      en: 'Views',
    }),
    followers: t({
      'zh-CN': '粉丝数量',
      en: 'Followers',
    }),
    following: t({
      'zh-CN': '关注数量',
      en: 'Following',
    }),
    favorites: t({
      'zh-CN': '收藏数量',
      en: 'Favorites',
    }),

    // 标签页
    tabOverview: t({
      'zh-CN': '概览',
      en: 'Overview',
    }),
    tabStats: t({
      'zh-CN': '统计',
      en: 'Statistics',
    }),
    tabSettings: t({
      'zh-CN': '设置',
      en: 'Settings',
    }),

    // 概览页面
    overviewTitle: t({
      'zh-CN': '个人概览',
      en: 'Overview',
    }),
    learningProgress: t({
      'zh-CN': '学习进度',
      en: 'Learning Progress',
    }),
    knowledgeMastery: t({
      'zh-CN': '知识掌握度',
      en: 'Knowledge Mastery',
    }),
    activityLevel: t({
      'zh-CN': '活跃度',
      en: 'Activity Level',
    }),
    recentActivity: t({
      'zh-CN': '最近活动',
      en: 'Recent Activity',
    }),
    publishedNewContent: t({
      'zh-CN': '发布了新的知识内容',
      en: 'Published new content',
    }),
    receivedLikesActivity: t({
      'zh-CN': '获得了5个点赞',
      en: 'Received 5 likes',
    }),
    newFollowers: t({
      'zh-CN': '新增了3个粉丝',
      en: 'Gained 3 new followers',
    }),

    // 统计详情
    detailedStats: t({
      'zh-CN': '详细统计',
      en: 'Detailed Statistics',
    }),
    contentStats: t({
      'zh-CN': '内容统计',
      en: 'Content Statistics',
    }),
    socialStats: t({
      'zh-CN': '社交统计',
      en: 'Social Statistics',
    }),

    // 设置页面
    settingsTitle: t({
      'zh-CN': '个人设置',
      en: 'Settings',
    }),
    basicInfo: t({
      'zh-CN': '基本信息',
      en: 'Basic Information',
    }),
    basicInfoDesc: t({
      'zh-CN': '管理您的个人资料信息',
      en: 'Manage your profile information',
    }),
    accountSecurity: t({
      'zh-CN': '账户安全',
      en: 'Account Security',
    }),
    accountSecurityDesc: t({
      'zh-CN': '修改密码和安全设置',
      en: 'Change password and security settings',
    }),

    // 操作按钮
    editProfile: t({
      'zh-CN': '编辑资料',
      en: 'Edit Profile',
    }),
    changePassword: t({
      'zh-CN': '修改密码',
      en: 'Change Password',
    }),
    edit: t({
      'zh-CN': '编辑',
      en: 'Edit',
    }),
    save: t({
      'zh-CN': '保存修改',
      en: 'Save Changes',
    }),
    cancel: t({
      'zh-CN': '取消',
      en: 'Cancel',
    }),
    confirm: t({
      'zh-CN': '确认修改',
      en: 'Confirm',
    }),

    // 表单字段
    fullName: t({
      'zh-CN': '真实姓名',
      en: 'Full Name',
    }),
    fullNamePlaceholder: t({
      'zh-CN': '请输入真实姓名',
      en: 'Enter your full name',
    }),
    email: t({
      'zh-CN': '邮箱',
      en: 'Email',
    }),
    emailPlaceholder: t({
      'zh-CN': '请输入邮箱地址',
      en: 'Enter your email',
    }),
    school: t({
      'zh-CN': '学校',
      en: 'School',
    }),
    schoolPlaceholder: t({
      'zh-CN': '请选择或输入学校名称',
      en: 'Select or enter school name',
    }),
    bio: t({
      'zh-CN': '个人简介',
      en: 'Bio',
    }),
    bioPlaceholder: t({
      'zh-CN': '介绍一下自己吧...',
      en: 'Tell us about yourself...',
    }),

    // 密码修改
    passwordModalTitle: t({
      'zh-CN': '修改密码',
      en: 'Change Password',
    }),
    currentPassword: t({
      'zh-CN': '原密码',
      en: 'Current Password',
    }),
    currentPasswordPlaceholder: t({
      'zh-CN': '请输入原密码',
      en: 'Enter current password',
    }),
    newPassword: t({
      'zh-CN': '新密码',
      en: 'New Password',
    }),
    newPasswordPlaceholder: t({
      'zh-CN': '请输入新密码',
      en: 'Enter new password',
    }),
    confirmPassword: t({
      'zh-CN': '确认新密码',
      en: 'Confirm Password',
    }),
    confirmPasswordPlaceholder: t({
      'zh-CN': '请再次输入新密码',
      en: 'Confirm new password',
    }),

    // 密码验证
    passwordRequirements: t({
      'zh-CN': '密码要求',
      en: 'Password Requirements',
    }),
    passwordMinLength: t({
      'zh-CN': '至少8个字符',
      en: 'At least 8 characters',
    }),
    passwordLowercase: t({
      'zh-CN': '包含小写字母',
      en: 'Contains lowercase letter',
    }),
    passwordUppercase: t({
      'zh-CN': '包含大写字母',
      en: 'Contains uppercase letter',
    }),
    passwordNumber: t({
      'zh-CN': '包含数字',
      en: 'Contains number',
    }),
    passwordSpecial: t({
      'zh-CN': '包含特殊字符',
      en: 'Contains special character',
    }),
    passwordMismatch: t({
      'zh-CN': '两次输入的密码不一致',
      en: 'Passwords do not match',
    }),

    // 状态
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    saving: t({
      'zh-CN': '保存中...',
      en: 'Saving...',
    }),

    // 时间单位
    timeUnits: {
      justNow: t({
        'zh-CN': '刚刚',
        en: 'Just now',
      }),
      minutesAgo: t({
        'zh-CN': '分钟前',
        en: 'minutes ago',
      }),
      hoursAgo: t({
        'zh-CN': '小时前',
        en: 'hours ago',
      }),
      daysAgo: t({
        'zh-CN': '天前',
        en: 'days ago',
      }),
      weeksAgo: t({
        'zh-CN': '周前',
        en: 'weeks ago',
      }),
      monthsAgo: t({
        'zh-CN': '个月前',
        en: 'months ago',
      }),
      yearsAgo: t({
        'zh-CN': '年前',
        en: 'years ago',
      }),
    },

    // 成功/错误消息
    messages: {
      profileUpdateSuccess: t({
        'zh-CN': '个人资料更新成功',
        en: 'Profile updated successfully',
      }),
      profileUpdateError: t({
        'zh-CN': '更新个人资料失败，请重试',
        en: 'Failed to update profile, please try again',
      }),
      passwordChangeSuccess: t({
        'zh-CN': '密码修改成功',
        en: 'Password changed successfully',
      }),
      passwordChangeError: t({
        'zh-CN': '密码修改失败，请检查原密码是否正确',
        en: 'Failed to change password, please check your current password',
      }),
      fetchStatsError: t({
        'zh-CN': '获取统计数据失败',
        en: 'Failed to fetch statistics',
      }),
      unsavedChanges: t({
        'zh-CN': '您有未保存的更改，确定要离开吗？',
        en: 'You have unsaved changes. Are you sure you want to leave?',
      }),
    },

    // 表单验证
    validation: {
      fullNameRequired: t({
        'zh-CN': '请输入真实姓名',
        en: 'Full name is required',
      }),
      fullNameTooLong: t({
        'zh-CN': '姓名不能超过50个字符',
        en: 'Full name cannot exceed 50 characters',
      }),
      bioTooLong: t({
        'zh-CN': '简介不能超过200个字符',
        en: 'Bio cannot exceed 200 characters',
      }),
      currentPasswordRequired: t({
        'zh-CN': '请输入原密码',
        en: 'Current password is required',
      }),
      newPasswordRequired: t({
        'zh-CN': '请输入新密码',
        en: 'New password is required',
      }),
      confirmPasswordRequired: t({
        'zh-CN': '请确认新密码',
        en: 'Please confirm your new password',
      }),
    },

    // 无障碍标签
    aria: {
      profileAvatar: t({
        'zh-CN': '用户头像',
        en: 'User avatar',
      }),
      editProfileButton: t({
        'zh-CN': '编辑个人资料',
        en: 'Edit profile',
      }),
      changePasswordButton: t({
        'zh-CN': '修改密码',
        en: 'Change password',
      }),
      closeModal: t({
        'zh-CN': '关闭弹窗',
        en: 'Close modal',
      }),
      tabNavigation: t({
        'zh-CN': '个人资料标签页导航',
        en: 'Profile tab navigation',
      }),
      statsSection: t({
        'zh-CN': '用户统计数据',
        en: 'User statistics',
      }),
    },
  },
} satisfies Dictionary;

export default profilePageContent;
