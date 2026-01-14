import { type Dictionary, t } from 'intlayer';

const companyContent = {
  key: 'company',
  content: {
    // 关于我们
    about: {
      title: t({
        'zh-CN': '关于我们',
        en: 'About Us',
      }),
      description: t({
        'zh-CN': '了解 EduChain 的使命、愿景和团队',
        en: 'Learn about EduChain\'s mission, vision and team',
      }),
      mission: {
        title: t({
          'zh-CN': '我们的使命',
          en: 'Our Mission',
        }),
        content: t({
          'zh-CN': 'EduChain 致力于构建一个去中心化的教育知识共享生态系统，让每一份知识都能被永久保存、公平分享，让每一位学习者都能获得优质的教育资源。',
          en: 'EduChain is committed to building a decentralized educational knowledge sharing ecosystem, where every piece of knowledge can be permanently preserved and fairly shared, and every learner can access quality educational resources.',
        }),
      },
      vision: {
        title: t({
          'zh-CN': '我们的愿景',
          en: 'Our Vision',
        }),
        content: t({
          'zh-CN': '成为全球领先的区块链教育平台，连接全球学习者与教育者，推动教育公平化和知识民主化。',
          en: 'To become the world\'s leading blockchain education platform, connecting global learners and educators, promoting educational equity and knowledge democratization.',
        }),
      },
      values: {
        title: t({
          'zh-CN': '核心价值观',
          en: 'Core Values',
        }),
        items: [
          {
            icon: '🎯',
            title: t({ 'zh-CN': '创新驱动', en: 'Innovation Driven' }),
            description: t({ 'zh-CN': '持续探索前沿技术，为教育赋能', en: 'Continuously exploring cutting-edge technology to empower education' }),
          },
          {
            icon: '🤝',
            title: t({ 'zh-CN': '开放共享', en: 'Open Sharing' }),
            description: t({ 'zh-CN': '打破知识壁垒，促进资源共享', en: 'Breaking knowledge barriers and promoting resource sharing' }),
          },
          {
            icon: '🔒',
            title: t({ 'zh-CN': '安全可信', en: 'Secure & Trustworthy' }),
            description: t({ 'zh-CN': '区块链存证，保护知识产权', en: 'Blockchain certification to protect intellectual property' }),
          },
          {
            icon: '🌍',
            title: t({ 'zh-CN': '全球视野', en: 'Global Vision' }),
            description: t({ 'zh-CN': '连接全球教育资源，服务全球学习者', en: 'Connecting global educational resources to serve learners worldwide' }),
          },
        ],
      },
      team: {
        title: t({
          'zh-CN': '核心团队',
          en: 'Core Team',
        }),
        members: [
          {
            name: t({ 'zh-CN': '张明', en: 'Ming Zhang' }),
            role: t({ 'zh-CN': '创始人 & CEO', en: 'Founder & CEO' }),
            bio: t({ 'zh-CN': '前阿里巴巴技术专家，10年教育科技经验', en: 'Former Alibaba tech expert, 10 years in EdTech' }),
          },
          {
            name: t({ 'zh-CN': '李华', en: 'Hua Li' }),
            role: t({ 'zh-CN': '技术总监', en: 'CTO' }),
            bio: t({ 'zh-CN': '区块链技术专家，曾主导多个大型项目', en: 'Blockchain expert, led multiple large-scale projects' }),
          },
          {
            name: t({ 'zh-CN': '王芳', en: 'Fang Wang' }),
            role: t({ 'zh-CN': '产品总监', en: 'CPO' }),
            bio: t({ 'zh-CN': '资深产品经理，专注用户体验设计', en: 'Senior PM, focused on UX design' }),
          },
          {
            name: t({ 'zh-CN': '陈强', en: 'Qiang Chen' }),
            role: t({ 'zh-CN': '运营总监', en: 'COO' }),
            bio: t({ 'zh-CN': '互联网运营专家，擅长社区建设', en: 'Internet operations expert, skilled in community building' }),
          },
        ],
      },
    },

    // 联系我们
    contact: {
      title: t({
        'zh-CN': '联系我们',
        en: 'Contact Us',
      }),
      description: t({
        'zh-CN': '有任何问题或建议？我们随时为您服务',
        en: 'Have any questions or suggestions? We\'re here to help',
      }),
      messageSent: t({
        'zh-CN': '消息已发送！',
        en: 'Message sent!',
      }),
      form: {
        name: t({ 'zh-CN': '您的姓名', en: 'Your Name' }),
        email: t({ 'zh-CN': '邮箱地址', en: 'Email Address' }),
        subject: t({ 'zh-CN': '主题', en: 'Subject' }),
        message: t({ 'zh-CN': '留言内容', en: 'Message' }),
        submit: t({ 'zh-CN': '发送消息', en: 'Send Message' }),
        namePlaceholder: t({ 'zh-CN': '请输入您的姓名', en: 'Enter your name' }),
        emailPlaceholder: t({ 'zh-CN': '请输入您的邮箱', en: 'Enter your email' }),
        subjectPlaceholder: t({ 'zh-CN': '请输入主题', en: 'Enter subject' }),
        messagePlaceholder: t({ 'zh-CN': '请输入您的留言内容...', en: 'Enter your message...' }),
      },
      info: {
        title: t({ 'zh-CN': '联系方式', en: 'Contact Information' }),
        items: [
          {
            icon: '📧',
            title: t({ 'zh-CN': '邮箱', en: 'Email' }),
            content: 'contact@educhain.cc',
          },
          {
            icon: '📞',
            title: t({ 'zh-CN': '电话', en: 'Phone' }),
            content: '400-123-4567',
          },
          {
            icon: '📍',
            title: t({ 'zh-CN': '地址', en: 'Address' }),
            content: t({ 'zh-CN': '北京市海淀区中关村大街1号', en: '1 Zhongguancun Street, Haidian District, Beijing' }),
          },
          {
            icon: '⏰',
            title: t({ 'zh-CN': '工作时间', en: 'Working Hours' }),
            content: t({ 'zh-CN': '周一至周五 9:00-18:00', en: 'Mon-Fri 9:00-18:00' }),
          },
        ],
      },
    },

    // 加入我们
    careers: {
      title: t({
        'zh-CN': '加入我们',
        en: 'Join Us',
      }),
      description: t({
        'zh-CN': '与优秀的人一起，做有意义的事',
        en: 'Work with excellent people on meaningful things',
      }),
      why: {
        title: t({ 'zh-CN': '为什么加入 EduChain？', en: 'Why Join EduChain?' }),
        items: [
          {
            icon: '🚀',
            title: t({ 'zh-CN': '快速成长', en: 'Rapid Growth' }),
            description: t({ 'zh-CN': '与行业顶尖人才共事，快速提升专业能力', en: 'Work with top talents and rapidly improve your skills' }),
          },
          {
            icon: '💡',
            title: t({ 'zh-CN': '创新文化', en: 'Innovation Culture' }),
            description: t({ 'zh-CN': '鼓励创新思维，支持新想法的实践', en: 'Encourage innovative thinking and support new ideas' }),
          },
          {
            icon: '🎁',
            title: t({ 'zh-CN': '优厚福利', en: 'Great Benefits' }),
            description: t({ 'zh-CN': '有竞争力的薪资、股权激励、弹性工作', en: 'Competitive salary, equity, flexible work' }),
          },
          {
            icon: '🌱',
            title: t({ 'zh-CN': '社会价值', en: 'Social Impact' }),
            description: t({ 'zh-CN': '参与教育变革，创造社会价值', en: 'Participate in educational transformation and create social value' }),
          },
        ],
      },
      positions: {
        title: t({ 'zh-CN': '开放职位', en: 'Open Positions' }),
        jobs: [
          {
            title: t({ 'zh-CN': '高级前端工程师', en: 'Senior Frontend Engineer' }),
            department: t({ 'zh-CN': '技术部', en: 'Engineering' }),
            location: t({ 'zh-CN': '北京', en: 'Beijing' }),
            type: t({ 'zh-CN': '全职', en: 'Full-time' }),
          },
          {
            title: t({ 'zh-CN': '区块链开发工程师', en: 'Blockchain Developer' }),
            department: t({ 'zh-CN': '技术部', en: 'Engineering' }),
            location: t({ 'zh-CN': '北京/远程', en: 'Beijing/Remote' }),
            type: t({ 'zh-CN': '全职', en: 'Full-time' }),
          },
          {
            title: t({ 'zh-CN': '产品经理', en: 'Product Manager' }),
            department: t({ 'zh-CN': '产品部', en: 'Product' }),
            location: t({ 'zh-CN': '北京', en: 'Beijing' }),
            type: t({ 'zh-CN': '全职', en: 'Full-time' }),
          },
          {
            title: t({ 'zh-CN': '内容运营', en: 'Content Operations' }),
            department: t({ 'zh-CN': '运营部', en: 'Operations' }),
            location: t({ 'zh-CN': '北京/上海', en: 'Beijing/Shanghai' }),
            type: t({ 'zh-CN': '全职', en: 'Full-time' }),
          },
        ],
        apply: t({ 'zh-CN': '申请职位', en: 'Apply Now' }),
      },
    },

    // 合作伙伴
    partners: {
      title: t({
        'zh-CN': '合作伙伴',
        en: 'Partners',
      }),
      description: t({
        'zh-CN': '携手共建教育生态，共创美好未来',
        en: 'Building the education ecosystem together for a better future',
      }),
      types: {
        title: t({ 'zh-CN': '合作类型', en: 'Partnership Types' }),
        items: [
          {
            icon: '🏫',
            title: t({ 'zh-CN': '教育机构', en: 'Educational Institutions' }),
            description: t({ 'zh-CN': '高校、培训机构、在线教育平台', en: 'Universities, training institutions, online education platforms' }),
          },
          {
            icon: '🏢',
            title: t({ 'zh-CN': '企业合作', en: 'Enterprise Partners' }),
            description: t({ 'zh-CN': '技术合作、内容合作、市场推广', en: 'Technology, content, and marketing partnerships' }),
          },
          {
            icon: '🔗',
            title: t({ 'zh-CN': '技术伙伴', en: 'Technology Partners' }),
            description: t({ 'zh-CN': '区块链、云服务、AI技术提供商', en: 'Blockchain, cloud, and AI technology providers' }),
          },
          {
            icon: '📚',
            title: t({ 'zh-CN': '内容创作者', en: 'Content Creators' }),
            description: t({ 'zh-CN': '知名讲师、专家学者、优质创作者', en: 'Famous lecturers, experts, and quality creators' }),
          },
        ],
      },
      featured: {
        title: t({ 'zh-CN': '合作伙伴展示', en: 'Featured Partners' }),
        partners: [
          { name: t({ 'zh-CN': '清华大学', en: 'Tsinghua University' }), type: t({ 'zh-CN': '教育机构', en: 'Education' }) },
          { name: t({ 'zh-CN': '北京大学', en: 'Peking University' }), type: t({ 'zh-CN': '教育机构', en: 'Education' }) },
          { name: t({ 'zh-CN': '阿里云', en: 'Alibaba Cloud' }), type: t({ 'zh-CN': '技术伙伴', en: 'Technology' }) },
          { name: t({ 'zh-CN': '腾讯云', en: 'Tencent Cloud' }), type: t({ 'zh-CN': '技术伙伴', en: 'Technology' }) },
          { name: t({ 'zh-CN': '华为云', en: 'Huawei Cloud' }), type: t({ 'zh-CN': '技术伙伴', en: 'Technology' }) },
          { name: t({ 'zh-CN': '网易有道', en: 'NetEase Youdao' }), type: t({ 'zh-CN': '内容合作', en: 'Content' }) },
        ],
      },
      cta: {
        title: t({ 'zh-CN': '成为合作伙伴', en: 'Become a Partner' }),
        description: t({ 'zh-CN': '如果您有兴趣与我们合作，请联系我们的商务团队', en: 'If you\'re interested in partnering with us, please contact our business team' }),
        button: t({ 'zh-CN': '联系商务', en: 'Contact Business' }),
        email: 'business@educhain.cc',
      },
    },
  },
} satisfies Dictionary;



export default companyContent;
