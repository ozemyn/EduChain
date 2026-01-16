import { t, type Dictionary } from 'intlayer';

const activityPageContent = {
  key: 'activity-page',
  content: {
    // 页面标题
    title: t({
      'zh-CN': '动态中心',
      en: 'Activity Center',
    }),
    subtitle: t({
      'zh-CN': '查看您关注的用户和您自己的最新动态',
      en: 'View the latest activities from users you follow and yourself',
    }),

    // 分类
    followingActivity: t({
      'zh-CN': '关注动态',
      en: 'Following',
    }),
    myActivity: t({
      'zh-CN': '我的动态',
      en: 'My Activity',
    }),

    // 操作
    refresh: t({
      'zh-CN': '刷新',
      en: 'Refresh',
    }),
    loadMore: t({
      'zh-CN': '加载更多',
      en: 'Load More',
    }),
    loadingMore: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),

    // 空状态
    noActivity: t({
      'zh-CN': '暂无动态',
      en: 'No activity yet',
    }),
    noActivityDesc: t({
      'zh-CN': '关注更多用户来查看他们的动态',
      en: 'Follow more users to see their activities',
    }),
    noMyActivity: t({
      'zh-CN': '暂无我的动态',
      en: 'No activity yet',
    }),
    noMyActivityDesc: t({
      'zh-CN': '开始发布内容来记录您的动态',
      en: 'Start publishing content to record your activities',
    }),

    // 动态类型
    activityTypes: {
      publish: t({
        'zh-CN': '发布',
        en: 'Published',
      }),
      like: t({
        'zh-CN': '点赞',
        en: 'Liked',
      }),
      comment: t({
        'zh-CN': '评论',
        en: 'Commented',
      }),
      follow: t({
        'zh-CN': '关注',
        en: 'Followed',
      }),
    },

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

    // 用户相关
    unknownUser: t({
      'zh-CN': '用户',
      en: 'User',
    }),

    // 消息
    messages: {
      refreshSuccess: t({
        'zh-CN': '刷新成功',
        en: 'Refreshed successfully',
      }),
      refreshError: t({
        'zh-CN': '刷新失败，请重试',
        en: 'Failed to refresh, please try again',
      }),
      loadMoreError: t({
        'zh-CN': '加载更多失败',
        en: 'Failed to load more',
      }),
    },

    // 无障碍
    aria: {
      activityList: t({
        'zh-CN': '动态列表',
        en: 'Activity list',
      }),
      refreshButton: t({
        'zh-CN': '刷新动态',
        en: 'Refresh activities',
      }),
      loadMoreButton: t({
        'zh-CN': '加载更多动态',
        en: 'Load more activities',
      }),
      activityTime: t({
        'zh-CN': '发布时间',
        en: 'Posted time',
      }),
    },
  },
} satisfies Dictionary;

export default activityPageContent;
