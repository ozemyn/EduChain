import { t, type DeclarationContent } from 'intlayer';

const certificationProgressContent = {
  key: 'certification-progress',
  content: {
    title: t({
      'zh-CN': '区块链存证进度',
      en: 'Blockchain Certification Progress',
    }),
    processing: t({
      'zh-CN': '正在处理...',
      en: 'Processing...',
    }),
    success: t({
      'zh-CN': '存证成功',
      en: 'Success',
    }),
    error: t({
      'zh-CN': '存证失败',
      en: 'Failed',
    }),
    steps: {
      uploading: {
        title: t({
          'zh-CN': '内容上传',
          en: 'Content Upload',
        }),
        desc: t({
          'zh-CN': '正在上传知识内容...',
          en: 'Uploading knowledge content...',
        }),
      },
      hashing: {
        title: t({
          'zh-CN': '计算哈希',
          en: 'Hash Calculation',
        }),
        desc: t({
          'zh-CN': '正在计算内容哈希值...',
          en: 'Calculating content hash...',
        }),
      },
      certifying: {
        title: t({
          'zh-CN': '区块链存证',
          en: 'Blockchain Certification',
        }),
        desc: t({
          'zh-CN': '正在将哈希记录到区块链...',
          en: 'Recording hash to blockchain...',
        }),
      },
      generating: {
        title: t({
          'zh-CN': '生成证书',
          en: 'Certificate Generation',
        }),
        desc: t({
          'zh-CN': '正在生成存证证书...',
          en: 'Generating certificate...',
        }),
      },
      completed: {
        title: t({
          'zh-CN': '完成',
          en: 'Completed',
        }),
        desc: t({
          'zh-CN': '存证完成！',
          en: 'Certification completed!',
        }),
      },
    },
    errorTitle: t({
      'zh-CN': '存证失败',
      en: 'Certification Failed',
    }),
    retry: t({
      'zh-CN': '重试',
      en: 'Retry',
    }),
    successTitle: t({
      'zh-CN': '存证成功',
      en: 'Certification Successful',
    }),
    successMessage: t({
      'zh-CN': '您的内容已成功存证到区块链，内容哈希和时间戳已被永久记录。',
      en: 'Your content has been successfully certified on blockchain with permanent hash and timestamp.',
    }),
    downloadCert: t({
      'zh-CN': '下载存证证书',
      en: 'Download Certificate',
    }),
    viewDetail: t({
      'zh-CN': '查看详情',
      en: 'View Details',
    }),
    infoText: t({
      'zh-CN': '区块链存证可以证明您的内容创作时间和原创性，具有法律效力。',
      en: 'Blockchain certification proves content creation time and originality with legal validity.',
    }),
  },
} satisfies DeclarationContent;

export default certificationProgressContent;
