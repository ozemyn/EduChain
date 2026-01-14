import { type Dictionary, t } from 'intlayer';

const richTextEditorContent = {
  key: 'rich-text-editor',
  content: {
    placeholder: t({
      'zh-CN': '开始输入内容...',
      en: 'Start typing...',
    }),
    toolbar: {
      bold: t({
        'zh-CN': '粗体',
        en: 'Bold',
      }),
      italic: t({
        'zh-CN': '斜体',
        en: 'Italic',
      }),
      underline: t({
        'zh-CN': '下划线',
        en: 'Underline',
      }),
      heading: t({
        'zh-CN': '标题',
        en: 'Heading',
      }),
      list: t({
        'zh-CN': '列表',
        en: 'List',
      }),
      link: t({
        'zh-CN': '链接',
        en: 'Link',
      }),
      code: t({
        'zh-CN': '代码',
        en: 'Code',
      }),
    },
  },
} satisfies Dictionary;

export default richTextEditorContent;
