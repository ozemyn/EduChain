import { type Dictionary, t } from 'intlayer';

const mediaUploadContent = {
  key: 'media-upload',
  content: {
    uploadText: t({
      'zh-CN': '点击上传',
      en: 'Click to Upload',
    }),
    hint: t({
      'zh-CN': '最多上传 {max} 个文件，单个文件不超过 {size}MB',
      en: 'Max {max} files, {size}MB each',
    }),
    errors: {
      maxCount: t({
        'zh-CN': '最多只能上传 {max} 个文件',
        en: 'Maximum {max} files allowed',
      }),
      maxSize: t({
        'zh-CN': '文件大小不能超过 {max}MB',
        en: 'File size cannot exceed {max}MB',
      }),
      uploadFailed: t({
        'zh-CN': '上传失败，请重试',
        en: 'Upload failed, please try again',
      }),
    },
  },
} satisfies Dictionary;

export default mediaUploadContent;
