import { type Dictionary, t } from 'intlayer';

const mockProviderContent = {
  key: 'mock-provider',
  content: {
    loading: t({
      'zh-CN': '正在初始化 Mock 服务...',
      en: 'Initializing Mock Service...',
    }),
  },
} satisfies Dictionary;

export default mockProviderContent;
