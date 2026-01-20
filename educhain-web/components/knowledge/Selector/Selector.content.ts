import { type Dictionary, t } from 'intlayer';

const selectorContent = {
  key: 'selector',
  content: {
    placeholder: t({
      'zh-CN': '请选择',
      en: 'Please select',
    }),
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    tagsPlaceholder: t({
      'zh-CN': '输入标签并按回车',
      en: 'Type and press Enter',
    }),
    popularLabel: t({
      'zh-CN': '热门标签',
      en: 'Popular',
    }),
    limitMessage: t({
      'zh-CN': '最多添加 {max} 个标签',
      en: 'Maximum {max} tags',
    }),
  },
} satisfies Dictionary;

export default selectorContent;
