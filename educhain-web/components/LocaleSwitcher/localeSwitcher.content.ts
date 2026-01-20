import { type Dictionary, t } from 'intlayer';

const localeSwitcherContent = {
  key: 'locale-switcher',
  content: {
    localeSwitcherLabel: t({
      'zh-CN': '语言切换器',
      en: 'Language switcher',
    }),

    searchInput: {
      text: t({
        'zh-CN': '搜索语言',
        en: 'Search Locale',
      }),
      placeholder: t({
        'zh-CN': '搜索语言',
        en: 'Search a locale',
      }),
      ariaLabel: t({
        'zh-CN': '语言搜索',
        en: 'Language search',
      }),
    },
  },
} satisfies Dictionary;

export default localeSwitcherContent;
