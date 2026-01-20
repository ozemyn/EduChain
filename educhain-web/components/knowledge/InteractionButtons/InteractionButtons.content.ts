import { type Dictionary, t } from 'intlayer';

const interactionButtonsContent = {
  key: 'interaction-buttons',
  content: {
    like: {
      title: t({
        'zh-CN': '点赞',
        en: 'Like',
      }),
    },
    favorite: {
      title: t({
        'zh-CN': '收藏',
        en: 'Favorite',
      }),
    },
    comment: {
      title: t({
        'zh-CN': '评论',
        en: 'Comment',
      }),
    },
    share: {
      title: t({
        'zh-CN': '分享',
        en: 'Share',
      }),
    },
  },
} satisfies Dictionary;

export default interactionButtonsContent;
