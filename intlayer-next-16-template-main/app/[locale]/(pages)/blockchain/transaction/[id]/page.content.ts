import { t, type DeclarationContent } from 'intlayer';

const transactionDetailContent = {
  key: 'transaction-detail-page',
  content: {
    loading: t({
      'zh-CN': '加载中...',
      en: 'Loading...',
    }),
    notFound: t({
      'zh-CN': '交易不存在',
      en: 'Transaction Not Found',
    }),
    notFoundDesc: t({
      'zh-CN': '未找到该交易记录，请检查交易ID是否正确',
      en: 'Transaction record not found, please check the transaction ID',
    }),
    backBtn: t({
      'zh-CN': '返回浏览器',
      en: 'Back to Explorer',
    }),
    back: t({
      'zh-CN': '返回',
      en: 'Back',
    }),
    title: t({
      'zh-CN': '交易详情',
      en: 'Transaction Details',
    }),
    subtitle: t({
      'zh-CN': '区块链交易记录信息',
      en: 'Blockchain transaction record information',
    }),
    confirmed: t({
      'zh-CN': '已确认',
      en: 'Confirmed',
    }),
    statusAlert: {
      title: t({
        'zh-CN': '交易已确认',
        en: 'Transaction Confirmed',
      }),
      message: t({
        'zh-CN': '此交易已被打包到区块链中，具有不可篡改性',
        en: 'This transaction has been included in the blockchain with immutability',
      }),
    },
    details: {
      txId: t({
        'zh-CN': '交易ID',
        en: 'Transaction ID',
      }),
      status: t({
        'zh-CN': '状态',
        en: 'Status',
      }),
      timestamp: t({
        'zh-CN': '时间戳',
        en: 'Timestamp',
      }),
      block: t({
        'zh-CN': '所在区块',
        en: 'Block',
      }),
      knowledge: t({
        'zh-CN': '关联知识',
        en: 'Related Knowledge',
      }),
      user: t({
        'zh-CN': '用户',
        en: 'User',
      }),
      contentHash: t({
        'zh-CN': '内容哈希',
        en: 'Content Hash',
      }),
      signature: t({
        'zh-CN': '数字签名',
        en: 'Signature',
      }),
      publicKey: t({
        'zh-CN': '公钥',
        en: 'Public Key',
      }),
    },
    metadata: {
      title: t({
        'zh-CN': '元数据',
        en: 'Metadata',
      }),
      subtitle: t({
        'zh-CN': '交易附加信息',
        en: 'Additional transaction information',
      }),
    },
  },
} satisfies DeclarationContent;

export default transactionDetailContent;
