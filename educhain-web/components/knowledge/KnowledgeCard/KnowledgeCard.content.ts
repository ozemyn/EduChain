import { type Dictionary, t } from 'intlayer';

const knowledgeCardContent = {
  key: 'knowledge-card',
  content: {
    actions: {
      edit: t({
        'zh-CN': '编辑',
        en: 'Edit',
      }),
      delete: t({
        'zh-CN': '删除',
        en: 'Delete',
      }),
    },
  },
} satisfies Dictionary;

export default knowledgeCardContent;
