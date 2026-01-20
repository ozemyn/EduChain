import { t, type Dictionary } from 'intlayer';

const knowledgeEditContent = {
  key: 'knowledge-edit-page',
  content: {
    title: t({
      'zh-CN': '编辑知识',
      en: 'Edit Knowledge',
    }),
    description: t({
      'zh-CN': '更新你的知识内容',
      en: 'Update your knowledge content',
    }),
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
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
      updateFailed: t({
        'zh-CN': '更新失败，请重试',
        en: 'Failed to update, please try again',
      }),
    },
    actions: {
      cancel: t({
        'zh-CN': '取消',
        en: 'Cancel',
      }),
      update: t({
        'zh-CN': '更新',
        en: 'Update',
      }),
      updating: t({
        'zh-CN': '更新中...',
        en: 'Updating...',
      }),
    },
  },
} satisfies Dictionary;

export default knowledgeEditContent;
