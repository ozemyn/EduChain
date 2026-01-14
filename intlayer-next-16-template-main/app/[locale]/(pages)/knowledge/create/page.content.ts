import { t, type DeclarationContent } from 'intlayer';

const knowledgeCreateContent = {
  key: 'knowledge-create-page',
  content: {
    title: t({
      'zh-CN': '发布知识',
      en: 'Publish Knowledge',
    }),
    description: t({
      'zh-CN': '分享你的知识和经验',
      en: 'Share your knowledge and experience',
    }),
    fields: {
      title: t({
        'zh-CN': '标题',
        en: 'Title',
      }),
      type: t({
        'zh-CN': '类型',
        en: 'Type',
      }),
      category: t({
        'zh-CN': '分类',
        en: 'Category',
      }),
      tags: t({
        'zh-CN': '标签',
        en: 'Tags',
      }),
      content: t({
        'zh-CN': '内容',
        en: 'Content',
      }),
      media: t({
        'zh-CN': '媒体文件',
        en: 'Media Files',
      }),
    },
    placeholders: {
      title: t({
        'zh-CN': '请输入标题',
        en: 'Enter title',
      }),
      category: t({
        'zh-CN': '选择分类',
        en: 'Select category',
      }),
      tags: t({
        'zh-CN': '输入标签，按回车添加',
        en: 'Enter tags, press Enter to add',
      }),
      content: t({
        'zh-CN': '开始编写内容...',
        en: 'Start writing content...',
      }),
    },
    types: {
      text: t({
        'zh-CN': '文本',
        en: 'Text',
      }),
      image: t({
        'zh-CN': '图片',
        en: 'Image',
      }),
      video: t({
        'zh-CN': '视频',
        en: 'Video',
      }),
      pdf: t({
        'zh-CN': 'PDF',
        en: 'PDF',
      }),
      link: t({
        'zh-CN': '链接',
        en: 'Link',
      }),
    },
    hints: {
      tags: t({
        'zh-CN': '最多添加 10 个标签',
        en: 'Add up to 10 tags',
      }),
      media: t({
        'zh-CN': '支持上传图片，最多 9 张，每张不超过 10MB',
        en: 'Support image upload, up to 9 images, max 10MB each',
      }),
    },
    errors: {
      titleRequired: t({
        'zh-CN': '请输入标题',
        en: 'Title is required',
      }),
      contentRequired: t({
        'zh-CN': '请输入内容',
        en: 'Content is required',
      }),
      createFailed: t({
        'zh-CN': '发布失败，请重试',
        en: 'Failed to publish, please try again',
      }),
    },
    actions: {
      cancel: t({
        'zh-CN': '取消',
        en: 'Cancel',
      }),
      submit: t({
        'zh-CN': '发布',
        en: 'Publish',
      }),
      submitting: t({
        'zh-CN': '发布中...',
        en: 'Publishing...',
      }),
    },
  },
} satisfies DeclarationContent;

export default knowledgeCreateContent;
