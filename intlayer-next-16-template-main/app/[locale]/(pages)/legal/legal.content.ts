import { type Dictionary, t } from 'intlayer';

const legalContent = {
  key: 'legal',
  content: {
    lastUpdated: t({
      'zh-CN': '最后更新：2026年1月14日',
      en: 'Last Updated: January 14, 2026',
    }),

    // 服务条款
    terms: {
      title: t({
        'zh-CN': '服务条款',
        en: 'Terms of Service',
      }),
      intro: t({
        'zh-CN': '欢迎使用 EduChain。在使用我们的服务之前，请仔细阅读以下服务条款。使用本平台即表示您同意遵守这些条款。',
        en: 'Welcome to EduChain. Please read the following terms of service carefully before using our services. By using this platform, you agree to comply with these terms.',
      }),
      sections: [
        {
          title: t({ 'zh-CN': '1. 服务说明', en: '1. Service Description' }),
          content: t({
            'zh-CN': 'EduChain 是基于区块链存证的教育知识共享与智能检索系统，致力于为用户提供优质的教育内容分享和学习服务、基于区块链的内容存证和版权保护、智能推荐和个性化学习体验、社区交流和知识协作功能。',
            en: 'EduChain is a blockchain-based educational knowledge sharing and intelligent retrieval system, dedicated to providing users with quality educational content sharing and learning services, blockchain-based content certification and copyright protection, intelligent recommendations and personalized learning experiences, and community communication and knowledge collaboration features.',
          }),
        },
        {
          title: t({ 'zh-CN': '2. 用户账户', en: '2. User Account' }),
          content: t({
            'zh-CN': '您需要注册账户才能使用平台的完整功能。注册时，您必须提供真实、准确、完整的信息。您有责任维护账户的安全性和保密性。任何通过您的账户进行的活动都将被视为您本人的行为。您不得将账户转让、出售或以其他方式提供给第三方使用。',
            en: 'You need to register an account to use the full features of the platform. When registering, you must provide true, accurate, and complete information. You are responsible for maintaining the security and confidentiality of your account. Any activity conducted through your account will be considered your own actions. You may not transfer, sell, or otherwise provide your account to third parties.',
          }),
        },
        {
          title: t({ 'zh-CN': '3. 内容规范', en: '3. Content Guidelines' }),
          content: t({
            'zh-CN': '您发布的内容必须符合法律法规，不得包含违法、有害、虚假、侵权或不当信息。您对自己发布的内容拥有知识产权，但授予 EduChain 在平台上使用、展示和推广的权利。我们保留审核、编辑或删除不符合规范内容的权利。',
            en: 'The content you publish must comply with laws and regulations and must not contain illegal, harmful, false, infringing, or inappropriate information. You own the intellectual property rights to the content you publish, but grant EduChain the right to use, display, and promote it on the platform. We reserve the right to review, edit, or delete content that does not comply with the guidelines.',
          }),
        },
        {
          title: t({ 'zh-CN': '4. 区块链存证', en: '4. Blockchain Certification' }),
          content: t({
            'zh-CN': '平台使用区块链技术对知识内容进行存证，以保护内容的原创性和完整性。一旦内容被存证，相关记录将永久保存在区块链上，不可篡改。',
            en: 'The platform uses blockchain technology to certify knowledge content to protect its originality and integrity. Once content is certified, the relevant records will be permanently stored on the blockchain and cannot be tampered with.',
          }),
        },
        {
          title: t({ 'zh-CN': '5. 免责声明', en: '5. Disclaimer' }),
          content: t({
            'zh-CN': '平台提供的内容仅供参考和学习使用。我们不对内容的准确性、完整性或适用性做出保证。用户使用平台内容所产生的任何后果由用户自行承担。',
            en: 'The content provided by the platform is for reference and learning purposes only. We make no guarantees about the accuracy, completeness, or applicability of the content. Users are solely responsible for any consequences arising from the use of platform content.',
          }),
        },
      ],
      contact: {
        title: t({ 'zh-CN': '联系我们', en: 'Contact Us' }),
        email: 'legal@educhain.cc',
        phone: '400-123-4567',
        address: t({ 'zh-CN': '北京市海淀区中关村大街1号', en: '1 Zhongguancun Street, Haidian District, Beijing' }),
      },
      footer: t({
        'zh-CN': '本服务条款的最终解释权归 EduChain 所有',
        en: 'EduChain reserves the right to final interpretation of these terms of service',
      }),
    },

    // 隐私政策
    privacy: {
      title: t({
        'zh-CN': '隐私政策',
        en: 'Privacy Policy',
      }),
      intro: t({
        'zh-CN': 'EduChain 非常重视用户的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。',
        en: 'EduChain attaches great importance to user privacy protection. This privacy policy explains how we collect, use, store, and protect your personal information.',
      }),
      footer: t({
        'zh-CN': '我们承诺保护您的隐私，感谢您对 EduChain 的信任',
        en: 'We are committed to protecting your privacy. Thank you for trusting EduChain',
      }),
      sections: [
        {
          title: t({ 'zh-CN': '1. 信息收集', en: '1. Information Collection' }),
          content: t({
            'zh-CN': '我们收集的信息包括：您主动提供的信息（用户名、邮箱、手机号码、个人资料等）；自动收集的信息（设备信息、日志信息、使用数据等）。',
            en: 'The information we collect includes: information you actively provide (username, email, phone number, personal profile, etc.); automatically collected information (device information, log information, usage data, etc.).',
          }),
        },
        {
          title: t({ 'zh-CN': '2. 信息使用', en: '2. Information Use' }),
          content: t({
            'zh-CN': '我们收集的信息将用于：提供、维护和改进我们的服务；个性化推荐和内容展示；用户身份验证和账户安全；数据分析和服务优化；发送服务通知和更新信息。',
            en: 'The information we collect will be used to: provide, maintain, and improve our services; personalized recommendations and content display; user authentication and account security; data analysis and service optimization; send service notifications and updates.',
          }),
        },
        {
          title: t({ 'zh-CN': '3. 信息共享', en: '3. Information Sharing' }),
          content: t({
            'zh-CN': '我们承诺不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：经您同意；与服务提供商共享必要信息；根据法律要求；您在平台上公开发布的内容。',
            en: 'We promise not to sell your personal information. We may share your information in the following circumstances: with your consent; sharing necessary information with service providers; as required by law; content you publicly post on the platform.',
          }),
        },
        {
          title: t({ 'zh-CN': '4. 信息安全', en: '4. Information Security' }),
          content: t({
            'zh-CN': '我们采取多种安全措施保护您的信息：数据加密传输、访问控制、安全审计、备份机制、应急响应。',
            en: 'We take multiple security measures to protect your information: encrypted data transmission, access control, security audits, backup mechanisms, and emergency response.',
          }),
        },
        {
          title: t({ 'zh-CN': '5. 您的权利', en: '5. Your Rights' }),
          content: t({
            'zh-CN': '根据相关法律法规，您享有以下权利：访问权、更正权、删除权、撤回同意、数据导出、投诉权。',
            en: 'According to relevant laws and regulations, you have the following rights: access, correction, deletion, withdrawal of consent, data export, and the right to complain.',
          }),
        },
      ],
    },

    // 版权声明
    copyright: {
      title: t({
        'zh-CN': '版权声明',
        en: 'Copyright Notice',
      }),
      intro: t({
        'zh-CN': 'EduChain 尊重知识产权，致力于保护原创内容创作者的合法权益。',
        en: 'EduChain respects intellectual property rights and is committed to protecting the legitimate rights and interests of original content creators.',
      }),
      contact: {
        title: t({ 'zh-CN': '版权投诉联系方式', en: 'Copyright Complaint Contact' }),
        email: 'copyright@educhain.cc',
        phone: '400-123-4567',
      },
      sections: [
        {
          title: t({ 'zh-CN': '1. 平台内容版权', en: '1. Platform Content Copyright' }),
          content: t({
            'zh-CN': 'EduChain 平台上的所有原创内容（包括但不限于文字、图片、视频、音频、软件、界面设计等）的知识产权归 EduChain 或相关权利人所有。未经授权，任何人不得复制、转载、修改或用于商业目的。',
            en: 'All original content on the EduChain platform (including but not limited to text, images, videos, audio, software, interface design, etc.) is owned by EduChain or relevant rights holders. Without authorization, no one may copy, reprint, modify, or use it for commercial purposes.',
          }),
        },
        {
          title: t({ 'zh-CN': '2. 用户内容版权', en: '2. User Content Copyright' }),
          content: t({
            'zh-CN': '用户在平台上发布的原创内容，版权归用户所有。用户授予 EduChain 在平台上展示、推广和使用该内容的非独占性许可。用户保证其发布的内容不侵犯任何第三方的知识产权。',
            en: 'Original content published by users on the platform is owned by the users. Users grant EduChain a non-exclusive license to display, promote, and use the content on the platform. Users guarantee that the content they publish does not infringe on any third party\'s intellectual property rights.',
          }),
        },
        {
          title: t({ 'zh-CN': '3. 区块链存证', en: '3. Blockchain Certification' }),
          content: t({
            'zh-CN': '通过区块链存证的内容，其存证记录将永久保存在区块链上，作为内容原创性和创作时间的证明。存证记录可用于版权纠纷的证据支持。',
            en: 'Content certified through blockchain will have its certification records permanently stored on the blockchain as proof of originality and creation time. Certification records can be used as evidence support in copyright disputes.',
          }),
        },
        {
          title: t({ 'zh-CN': '4. 侵权投诉', en: '4. Infringement Complaints' }),
          content: t({
            'zh-CN': '如果您发现平台上存在侵犯您版权的内容，请通过以下方式联系我们，我们将在核实后及时处理。',
            en: 'If you find content on the platform that infringes your copyright, please contact us through the following methods, and we will handle it promptly after verification.',
          }),
        },
      ],
    },

    // 免责声明
    disclaimer: {
      title: t({
        'zh-CN': '免责声明',
        en: 'Disclaimer',
      }),
      intro: t({
        'zh-CN': '请仔细阅读以下免责声明。使用 EduChain 平台即表示您已阅读、理解并同意以下条款。',
        en: 'Please read the following disclaimer carefully. By using the EduChain platform, you acknowledge that you have read, understood, and agreed to the following terms.',
      }),
      importantNotice: t({
        'zh-CN': '重要提示：',
        en: 'Important Notice:',
      }),
      footer: t({
        'zh-CN': '如有任何疑问，请联系我们的法务团队：legal@educhain.cc',
        en: 'If you have any questions, please contact our legal team: legal@educhain.cc',
      }),
      sections: [
        {
          title: t({ 'zh-CN': '1. 内容免责', en: '1. Content Disclaimer' }),
          content: t({
            'zh-CN': '平台上的内容由用户自行发布，EduChain 不对用户发布内容的准确性、完整性、合法性或适用性做出任何保证。用户应自行判断内容的可靠性，并承担使用内容所产生的风险。',
            en: 'Content on the platform is published by users themselves. EduChain makes no guarantees about the accuracy, completeness, legality, or applicability of user-published content. Users should judge the reliability of content themselves and bear the risks arising from using the content.',
          }),
        },
        {
          title: t({ 'zh-CN': '2. 服务免责', en: '2. Service Disclaimer' }),
          content: t({
            'zh-CN': 'EduChain 将尽力提供稳定、安全的服务，但不保证服务不会中断或出现错误。因不可抗力、系统维护、网络故障等原因导致的服务中断，EduChain 不承担责任。',
            en: 'EduChain will strive to provide stable and secure services, but does not guarantee that services will not be interrupted or error-free. EduChain is not responsible for service interruptions caused by force majeure, system maintenance, network failures, etc.',
          }),
        },
        {
          title: t({ 'zh-CN': '3. 第三方链接', en: '3. Third-Party Links' }),
          content: t({
            'zh-CN': '平台可能包含指向第三方网站的链接。EduChain 不对第三方网站的内容、隐私政策或做法负责。用户访问第三方网站的风险由用户自行承担。',
            en: 'The platform may contain links to third-party websites. EduChain is not responsible for the content, privacy policies, or practices of third-party websites. Users access third-party websites at their own risk.',
          }),
        },
        {
          title: t({ 'zh-CN': '4. 区块链技术', en: '4. Blockchain Technology' }),
          content: t({
            'zh-CN': '区块链存证功能依赖于区块链网络的正常运行。EduChain 不对区块链网络的稳定性、安全性或任何技术问题负责。存证记录一旦写入区块链，将无法修改或删除。',
            en: 'The blockchain certification function depends on the normal operation of the blockchain network. EduChain is not responsible for the stability, security, or any technical issues of the blockchain network. Once certification records are written to the blockchain, they cannot be modified or deleted.',
          }),
        },
        {
          title: t({ 'zh-CN': '5. 责任限制', en: '5. Limitation of Liability' }),
          content: t({
            'zh-CN': '在法律允许的最大范围内，EduChain 及其关联方不对任何间接、附带、特殊、惩罚性或后果性损害承担责任，包括但不限于利润损失、数据丢失、业务中断等。',
            en: 'To the maximum extent permitted by law, EduChain and its affiliates are not liable for any indirect, incidental, special, punitive, or consequential damages, including but not limited to loss of profits, data loss, business interruption, etc.',
          }),
        },
      ],
    },
  },
} satisfies Dictionary;


export default legalContent;
