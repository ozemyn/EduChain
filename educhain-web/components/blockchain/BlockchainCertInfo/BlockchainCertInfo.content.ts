import { t, type DeclarationContent } from 'intlayer';

const blockchainCertInfoContent = {
  key: 'blockchain-cert-info',
  content: {
    title: t({
      'zh-CN': '区块链存证',
      en: 'Blockchain Certificate',
    }),
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notCertified: t({
      'zh-CN': '未存证',
      en: 'Not Certified',
    }),
    notCertifiedDesc: t({
      'zh-CN': '该内容尚未进行区块链存证',
      en: 'This content has not been certified on blockchain',
    }),
    generateBtn: t({
      'zh-CN': '立即存证',
      en: 'Certify Now',
    }),
    generating: t({
      'zh-CN': '生成中...',
      en: 'Generating...',
    }),
    certified: t({
      'zh-CN': '已存证',
      en: 'Certified',
    }),
    certifiedComplete: t({
      'zh-CN': '存证完成',
      en: 'Certification Complete',
    }),
    blockNumber: t({
      'zh-CN': '区块',
      en: 'Block',
    }),
    viewDetails: t({
      'zh-CN': '查看详情',
      en: 'View Details',
    }),
    download: t({
      'zh-CN': '下载证书',
      en: 'Download',
    }),
    notice: t({
      'zh-CN': '内容已通过区块链技术存证，具有不可篡改性',
      en: 'Content certified on blockchain with immutability',
    }),
  },
} satisfies DeclarationContent;

export default blockchainCertInfoContent;
