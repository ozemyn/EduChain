import { t, type Dictionary } from 'intlayer';

const followPageContent = {
  key: 'follow-page',
  content: {
    // 页面标题
    followingTitle: t({
      'zh-CN': '我的关注',
      en: 'Following',
    }),
    followersTitle: t({
      'zh-CN': '我的粉丝',
      en: 'Followers',
    }),
    followingSubtitle: t({
      'zh-CN': '查看您关注的所有用户',
      en: 'View all users you follow',
    }),
    followersSubtitle: t({
      'zh-CN': '查看关注您的所有用户',
      en: 'View all users who follow you',
    }),

    // 标签
    following: t({
      'zh-CN': '关注',
      en: 'Following',
    }),
    followers: t({
      'zh-CN': '粉丝',
      en: 'Followers',
    }),

    // 操作按钮
    follow: t({
      'zh-CN': '关注',
      en: 'Follow',
    }),
    unfollow: t({
      'zh-CN': '取消关注',
      en: 'Unfollow',
    }),
    mutual: t({
      'zh-CN': '互相关注',
      en: 'Mutual',
    }),

    // 统计
    posts: t({
      'zh-CN': '内容',
      en: 'Posts',
    }),
    followersCount: t({
      'zh-CN': '粉丝',
      en: 'Followers',
    }),

    // 空状态
    noFollowing: t({
      'zh-CN': '暂无关注',
      en: 'Not following anyone',
    }),
    noFollowingDesc: t({
      'zh-CN': '去发现更多优秀的创作者吧',
      en: 'Discover more great creators',
    }),
    noFollowers: t({
      'zh-CN': '暂无粉丝',
      en: 'No followers yet',
    }),
    noFollowersDesc: t({
      'zh-CN': '分享更多优质内容来吸引粉丝',
      en: 'Share more quality content to attract followers',
    }),
    noSearchResults: t({
      'zh-CN': '未找到匹配的用户',
      en: 'No matching users found',
    }),

    // 搜索
    searchPlaceholder: t({
      'zh-CN': '搜索用户...',
      en: 'Search users...',
    }),

    // 用户信息
    noBio: t({
      'zh-CN': '暂无简介',
      en: 'No bio yet',
    }),

    // 确认对话框
    confirmUnfollow: {
      title: t({
        'zh-CN': '取消关注',
        en: 'Unfollow',
      }),
      message: t({
        'zh-CN': '确定要取消关注该用户吗？',
        en: 'Are you sure you want to unfollow this user?',
      }),
      confirm: t({
        'zh-CN': '确定',
        en: 'Confirm',
      }),
      cancel: t({
        'zh-CN': '取消',
        en: 'Cancel',
      }),
    },

    // 消息
    messages: {
      followSuccess: t({
        'zh-CN': '关注成功',
        en: 'Followed successfully',
      }),
      unfollowSuccess: t({
        'zh-CN': '已取消关注',
        en: 'Unfollowed successfully',
      }),
      followError: t({
        'zh-CN': '操作失败，请重试',
        en: 'Operation failed, please try again',
      }),
    },

    // 无障碍
    aria: {
      userList: t({
        'zh-CN': '用户列表',
        en: 'User list',
      }),
      searchInput: t({
        'zh-CN': '搜索用户',
        en: 'Search users',
      }),
      tabNavigation: t({
        'zh-CN': '关注/粉丝切换',
        en: 'Following/Followers tabs',
      }),
      followButton: t({
        'zh-CN': '关注用户',
        en: 'Follow user',
      }),
      unfollowButton: t({
        'zh-CN': '取消关注用户',
        en: 'Unfollow user',
      }),
      userAvatar: t({
        'zh-CN': '用户头像',
        en: 'User avatar',
      }),
    },
  },
} satisfies Dictionary;

export default followPageContent;
