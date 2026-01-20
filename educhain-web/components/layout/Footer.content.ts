import { type Dictionary, t } from 'intlayer';

const footerContent = {
  key: 'footer',
  content: {
    brand: {
      name: t({
        'zh-CN': 'EduChain',
        en: 'EduChain',
      }),
      description: t({
        'zh-CN': '连接全球学习者与教育者，构建去中心化的知识共享生态系统',
        en: 'Connecting global learners and educators, building a decentralized knowledge sharing ecosystem',
      }),
    },
    sections: {
      product: t({
        'zh-CN': '产品',
        en: 'Product',
      }),
      company: t({
        'zh-CN': '公司',
        en: 'Company',
      }),
      resources: t({
        'zh-CN': '资源',
        en: 'Resources',
      }),
      legal: t({
        'zh-CN': '法律',
        en: 'Legal',
      }),
    },
    links: {
      knowledge: t({ 'zh-CN': '知识库', en: 'Knowledge Base' }),
      search: t({ 'zh-CN': '智能搜索', en: 'Smart Search' }),
      recommendations: t({ 'zh-CN': '推荐系统', en: 'Recommendations' }),
      community: t({ 'zh-CN': '社区交流', en: 'Community' }),
      about: t({ 'zh-CN': '关于我们', en: 'About Us' }),
      contact: t({ 'zh-CN': '联系我们', en: 'Contact' }),
      careers: t({ 'zh-CN': '加入我们', en: 'Careers' }),
      partners: t({ 'zh-CN': '合作伙伴', en: 'Partners' }),
      help: t({ 'zh-CN': '帮助中心', en: 'Help Center' }),
      docs: t({ 'zh-CN': '开发文档', en: 'Documentation' }),
      api: t({ 'zh-CN': 'API 文档', en: 'API Docs' }),
      changelog: t({ 'zh-CN': '更新日志', en: 'Changelog' }),
      terms: t({ 'zh-CN': '服务条款', en: 'Terms of Service' }),
      privacy: t({ 'zh-CN': '隐私政策', en: 'Privacy Policy' }),
      copyright: t({ 'zh-CN': '版权声明', en: 'Copyright' }),
      disclaimer: t({ 'zh-CN': '免责声明', en: 'Disclaimer' }),
    },
    copyright: t({
      'zh-CN': '© {year} EduChain. 保留所有权利。',
      en: '© {year} EduChain. All rights reserved.',
    }),
    madeWith: t({
      'zh-CN': '由 EduChain 团队用心打造',
      en: 'Made with love by EduChain Team',
    }),
    icp: t({
      'zh-CN': 'ICP备案号：京ICP备12345678号',
      en: 'ICP License: 京ICP备12345678号',
    }),
  },
} satisfies Dictionary;

export default footerContent;
