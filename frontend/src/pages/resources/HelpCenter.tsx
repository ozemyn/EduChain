/* ===================================
   帮助中心页面 - Help Center Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 清晰的内容结构
   - 搜索和分类功能
   
   ================================== */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Input,
  Collapse,
  Tag,
  Space,
  Button,
  Divider,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  QuestionCircleOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyOutlined,
  RocketOutlined,
  BulbOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './Resources.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: '全部', icon: <BookOutlined />, color: 'blue' },
    {
      key: 'account',
      label: '账户管理',
      icon: <UserOutlined />,
      color: 'green',
    },
    {
      key: 'content',
      label: '内容发布',
      icon: <RocketOutlined />,
      color: 'orange',
    },
    {
      key: 'blockchain',
      label: '区块链存证',
      icon: <SafetyOutlined />,
      color: 'purple',
    },
    {
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
      color: 'cyan',
    },
    { key: 'tips', label: '使用技巧', icon: <BulbOutlined />, color: 'gold' },
  ];

  const faqData = [
    {
      category: 'account',
      question: '如何注册 EduChain 账户？',
      answer: `注册 EduChain 账户非常简单：
      
1. 点击页面右上角的"注册"按钮
2. 填写您的邮箱地址和密码
3. 验证邮箱（检查您的邮箱收件箱）
4. 完善个人资料信息
5. 开始使用平台功能

注册完成后，您可以立即开始浏览和学习平台上的优质内容。`,
      tags: ['注册', '账户', '新手'],
    },
    {
      category: 'account',
      question: '忘记密码怎么办？',
      answer: `如果您忘记了密码，可以通过以下步骤重置：

1. 在登录页面点击"忘记密码"
2. 输入您注册时使用的邮箱地址
3. 检查邮箱中的重置密码邮件
4. 点击邮件中的重置链接
5. 设置新密码并确认

为了账户安全，建议您设置一个包含字母、数字和特殊字符的强密码。`,
      tags: ['密码', '重置', '安全'],
    },
    {
      category: 'content',
      question: '如何发布知识内容？',
      answer: `发布知识内容的步骤：

1. 登录您的账户
2. 点击"发布内容"按钮
3. 选择内容类型（文本、图片、视频、PDF等）
4. 填写标题和详细描述
5. 添加相关标签和分类
6. 选择是否进行区块链存证
7. 预览并发布

发布前请确保内容符合平台规范，原创内容将获得更好的推荐机会。`,
      tags: ['发布', '内容', '创作'],
    },
    {
      category: 'blockchain',
      question: '什么是区块链存证？',
      answer: `区块链存证是 EduChain 的核心功能之一：

**功能特点：**
- 永久保存：内容哈希值存储在区块链上，永不丢失
- 防篡改：任何修改都会被检测到
- 时间戳证明：精确记录内容创建时间
- 法律效力：可作为版权保护的有力证据

**使用场景：**
- 原创文章和研究成果
- 教学课件和学习资料
- 创意作品和设计方案
- 重要的学术论文

存证费用极低，但价值巨大，强烈建议为重要内容进行存证。`,
      tags: ['区块链', '存证', '版权', '原创'],
    },
    {
      category: 'settings',
      question: '如何设置个人偏好？',
      answer: `个性化设置让您的使用体验更佳：

**推荐设置：**
- 选择感兴趣的学科领域
- 设置内容难度偏好
- 配置推送通知频率

**隐私设置：**
- 控制个人信息可见性
- 管理关注和粉丝列表
- 设置内容互动权限

**界面设置：**
- 选择浅色/深色主题
- 调整字体大小
- 自定义布局偏好

进入"设置"页面即可进行详细配置。`,
      tags: ['设置', '个性化', '隐私'],
    },
    {
      category: 'tips',
      question: '如何提高内容曝光度？',
      answer: `提高内容曝光度的实用技巧：

**内容质量：**
- 确保内容原创且有价值
- 使用清晰的标题和描述
- 添加合适的标签和分类

**互动参与：**
- 积极回复评论和私信
- 关注其他优质创作者
- 参与社区讨论和活动

**发布策略：**
- 选择合适的发布时间
- 保持定期更新频率
- 利用热门话题和趋势

**技术优化：**
- 使用高质量的图片和视频
- 优化内容结构和排版
- 进行区块链存证提升可信度

坚持创作优质内容是最重要的成功因素。`,
      tags: ['技巧', '曝光', '推广', '创作'],
    },
    {
      category: 'account',
      question: '如何修改个人资料？',
      answer: `修改个人资料的详细步骤：

1. 登录账户后，点击右上角头像
2. 选择"个人中心"
3. 点击"编辑资料"按钮
4. 修改以下信息：
   - 昵称和真实姓名
   - 个人简介和专业领域
   - 联系方式（邮箱、电话）
   - 头像和背景图片
   - 社交媒体链接
5. 点击"保存"完成修改

修改后的信息会在24小时内生效，部分敏感信息可能需要重新验证。`,
      tags: ['资料', '修改', '个人中心'],
    },
    {
      category: 'account',
      question: '如何绑定第三方账户？',
      answer: `EduChain 支持多种第三方账户绑定：

**支持的平台：**
- 微信、QQ、微博
- GitHub、Google
- 钉钉、企业微信

**绑定步骤：**
1. 进入"账户设置" > "第三方绑定"
2. 选择要绑定的平台
3. 点击"立即绑定"
4. 在弹出窗口中完成授权
5. 确认绑定信息

**绑定好处：**
- 快速登录，无需输入密码
- 同步头像和基本信息
- 一键分享内容到社交平台`,
      tags: ['绑定', '第三方', '快速登录'],
    },
    {
      category: 'account',
      question: '如何注销账户？',
      answer: `账户注销是不可逆操作，请谨慎考虑：

**注销前准备：**
- 备份重要的学习资料和创作内容
- 处理未完成的交易和订单
- 取消所有订阅服务

**注销步骤：**
1. 进入"账户设置" > "账户安全"
2. 点击"注销账户"
3. 阅读注销须知和影响说明
4. 输入密码和验证码确认
5. 等待7天冷静期
6. 系统自动完成注销

**注意事项：**
- 注销后所有数据将被永久删除
- 已存证的区块链记录无法删除
- 注销期间可以取消操作`,
      tags: ['注销', '删除', '账户安全'],
    },
    {
      category: 'content',
      question: '支持哪些内容格式？',
      answer: `EduChain 支持丰富的内容格式：

**文本内容：**
- Markdown 格式文档
- 富文本编辑器内容
- 纯文本和代码片段
- LaTeX 数学公式

**图片格式：**
- JPG、PNG、GIF、WebP
- SVG 矢量图形
- 最大支持 10MB 单文件

**视频格式：**
- MP4、AVI、MOV、WMV
- 最大支持 500MB 单文件
- 自动生成多种清晰度

**文档格式：**
- PDF、Word、Excel、PPT
- 自动转换为在线预览格式
- 支持全文搜索

**其他格式：**
- 音频文件（MP3、WAV、AAC）
- 压缩包（ZIP、RAR）
- 代码文件（支持语法高亮）`,
      tags: ['格式', '上传', '文件类型'],
    },
    {
      category: 'content',
      question: '如何编辑已发布的内容？',
      answer: `编辑已发布内容的完整指南：

**编辑权限：**
- 内容作者可以随时编辑
- 协作者需要相应权限
- 管理员可以编辑所有内容

**编辑步骤：**
1. 进入内容详情页
2. 点击"编辑"按钮
3. 在编辑器中修改内容
4. 添加编辑说明（可选）
5. 选择是否重新存证
6. 保存并发布修改

**版本管理：**
- 系统自动保存历史版本
- 可以查看修改记录
- 支持回滚到任意版本
- 显示修改时间和编辑者

**注意事项：**
- 重大修改建议重新存证
- 编辑会更新最后修改时间
- 可能影响搜索排名`,
      tags: ['编辑', '修改', '版本管理'],
    },
    {
      category: 'content',
      question: '如何删除内容？',
      answer: `删除内容的详细说明：

**删除类型：**
- 软删除：隐藏内容，可以恢复
- 硬删除：永久删除，无法恢复

**删除步骤：**
1. 进入内容管理页面
2. 选择要删除的内容
3. 点击"删除"按钮
4. 选择删除类型
5. 确认删除操作

**删除影响：**
- 相关评论和互动数据
- 推荐算法中的权重
- 搜索索引中的记录
- 区块链存证记录（无法删除）

**恢复机制：**
- 软删除内容30天内可恢复
- 进入"回收站"查看已删除内容
- 点击"恢复"即可重新发布

**批量操作：**
- 支持批量选择删除
- 可以按时间范围删除
- 提供删除预览功能`,
      tags: ['删除', '恢复', '批量操作'],
    },
    {
      category: 'blockchain',
      question: '区块链存证需要多长时间？',
      answer: `区块链存证的时间说明：

**存证流程时间：**
- 内容哈希计算：1-3秒
- 区块链写入：10-30秒
- 确认完成：1-3分钟
- 生成证书：30秒内

**影响因素：**
- 网络拥堵程度
- 文件大小和复杂度
- 区块链网络状态
- 系统负载情况

**加速方法：**
- 选择网络空闲时段
- 优化文件大小
- 使用批量存证功能
- 升级到高级账户

**状态查询：**
- 实时查看存证进度
- 接收完成通知
- 下载存证证书
- 查看区块链交易记录

存证完成后，您将获得具有法律效力的数字证书。`,
      tags: ['时间', '流程', '状态查询'],
    },
    {
      category: 'blockchain',
      question: '存证费用如何计算？',
      answer: `区块链存证费用详细说明：

**计费方式：**
- 按文件大小计费
- 基础费用：0.01元/MB
- 最低收费：0.05元/次

**费用构成：**
- 区块链网络费用（Gas费）
- 存储服务费用
- 证书生成费用
- 平台服务费用

**优惠政策：**
- 新用户首次存证免费
- 批量存证享受折扣
- VIP用户专享优惠
- 学术机构特殊价格

**付费方式：**
- 账户余额扣费
- 微信/支付宝支付
- 银行卡绑定支付
- 企业对公转账

**费用查询：**
- 存证前预估费用
- 实时查看消费记录
- 月度账单统计
- 发票申请服务`,
      tags: ['费用', '计费', '优惠', '付费'],
    },
    {
      category: 'blockchain',
      question: '如何验证存证的真实性？',
      answer: `验证区块链存证真实性的方法：

**在线验证：**
1. 访问 EduChain 验证页面
2. 输入存证编号或上传文件
3. 系统自动计算文件哈希
4. 对比区块链上的记录
5. 显示验证结果和详情

**第三方验证：**
- 使用区块链浏览器查询
- 通过交易哈希验证
- 下载原始区块链数据
- 使用开源验证工具

**验证信息包含：**
- 存证时间戳
- 文件哈希值
- 区块链交易ID
- 存证者信息
- 数字签名

**法律效力：**
- 符合《电子签名法》
- 可作为法庭证据
- 支持司法鉴定
- 国际认可标准

**验证报告：**
- 生成详细验证报告
- 包含技术参数说明
- 提供法律条文依据
- 支持多语言版本`,
      tags: ['验证', '真实性', '法律效力'],
    },
    {
      category: 'settings',
      question: '如何设置通知偏好？',
      answer: `详细的通知设置指南：

**通知类型：**
- 系统通知：更新、维护、公告
- 互动通知：评论、点赞、关注
- 内容通知：推荐、订阅更新
- 安全通知：登录、密码修改

**通知渠道：**
- 站内消息：实时推送
- 邮件通知：重要事件
- 短信通知：安全相关
- 微信推送：订阅号消息

**设置步骤：**
1. 进入"设置" > "通知偏好"
2. 选择通知类型和频率
3. 设置免打扰时间段
4. 配置紧急通知例外
5. 保存设置并测试

**高级设置：**
- 按内容分类设置
- 关键词过滤
- 发送频率限制
- 批量操作设置

**移动端设置：**
- 推送权限管理
- 声音和震动设置
- 锁屏显示控制
- 应用角标管理`,
      tags: ['通知', '设置', '推送', '偏好'],
    },
    {
      category: 'settings',
      question: '如何管理隐私设置？',
      answer: `全面的隐私保护设置：

**个人信息可见性：**
- 公开：所有用户可见
- 好友：仅关注的用户可见
- 私密：仅自己可见
- 自定义：指定用户群体

**内容隐私设置：**
- 发布内容的默认可见性
- 评论和互动权限
- 搜索引擎收录设置
- 内容分享权限

**社交隐私：**
- 关注列表可见性
- 粉丝列表显示设置
- 在线状态显示
- 最后活跃时间

**数据使用授权：**
- 个性化推荐数据使用
- 学习行为分析
- 第三方数据共享
- 广告个性化设置

**安全设置：**
- 两步验证
- 登录设备管理
- 异常登录提醒
- 账户冻结保护

**数据导出：**
- 个人数据下载
- 内容备份导出
- 学习记录导出
- 互动数据导出`,
      tags: ['隐私', '安全', '数据保护'],
    },
    {
      category: 'settings',
      question: '如何自定义界面主题？',
      answer: `个性化界面主题设置：

**预设主题：**
- 浅色模式：经典白色主题
- 深色模式：护眼黑色主题
- 自动模式：跟随系统设置
- 定时模式：按时间自动切换

**自定义选项：**
- 主色调选择（10种颜色）
- 字体大小调节（12-20px）
- 行间距设置
- 页面布局密度

**高级定制：**
- 自定义CSS样式
- 组件显示/隐藏
- 快捷键设置
- 工具栏配置

**无障碍设置：**
- 高对比度模式
- 大字体模式
- 屏幕阅读器支持
- 键盘导航优化

**移动端适配：**
- 手势操作设置
- 屏幕方向锁定
- 触摸反馈强度
- 单手操作模式

**主题同步：**
- 多设备同步设置
- 云端备份恢复
- 导入/导出主题
- 分享主题配置`,
      tags: ['主题', '界面', '个性化', '自定义'],
    },
    {
      category: 'tips',
      question: '如何高效搜索内容？',
      answer: `掌握高效搜索技巧：

**基础搜索：**
- 关键词搜索：输入核心词汇
- 短语搜索：使用引号包围
- 模糊搜索：使用通配符*
- 排除搜索：使用减号-

**高级搜索：**
- 作者搜索：author:用户名
- 时间范围：date:2024-01-01..2024-12-31
- 文件类型：type:pdf,video,image
- 标签搜索：tag:编程,算法

**搜索过滤：**
- 按学科分类筛选
- 按难度等级过滤
- 按评分排序
- 按时间排序

**搜索技巧：**
- 使用同义词扩展搜索
- 组合多个关键词
- 利用自动补全功能
- 保存常用搜索条件

**搜索历史：**
- 查看搜索记录
- 快速重复搜索
- 删除搜索历史
- 导出搜索数据

**个性化搜索：**
- 基于学习历史推荐
- 关注领域优先显示
- 个人偏好权重调整
- 智能搜索建议`,
      tags: ['搜索', '技巧', '高效', '过滤'],
    },
    {
      category: 'tips',
      question: '如何建立学习计划？',
      answer: `制定有效学习计划的方法：

**目标设定：**
- SMART原则：具体、可测量、可达成
- 短期目标：1-4周完成
- 中期目标：1-3个月完成
- 长期目标：半年以上

**计划制定：**
1. 评估当前知识水平
2. 确定学习目标和时间线
3. 分解大目标为小任务
4. 安排每日学习时间
5. 设置里程碑和检查点

**学习方法：**
- 番茄工作法：25分钟专注学习
- 间隔重复：定期复习巩固
- 主动学习：做笔记、提问题
- 实践应用：项目练习

**进度跟踪：**
- 学习时长统计
- 完成任务记录
- 知识点掌握度
- 学习效果评估

**调整优化：**
- 定期回顾计划执行情况
- 根据实际情况调整目标
- 优化学习方法和时间安排
- 寻求反馈和建议

**工具推荐：**
- 学习日历和提醒
- 进度可视化图表
- 学习伙伴和小组
- 在线学习社区`,
      tags: ['学习计划', '目标设定', '进度跟踪'],
    },
    {
      category: 'tips',
      question: '如何参与社区互动？',
      answer: `积极参与社区的完整指南：

**互动方式：**
- 评论：对内容发表看法和建议
- 点赞：表达认同和支持
- 分享：推荐优质内容给他人
- 收藏：保存有价值的内容

**社区参与：**
- 加入兴趣小组和专业社群
- 参与话题讨论和辩论
- 发起问答和求助
- 组织线上/线下活动

**内容贡献：**
- 分享原创学习心得
- 整理知识点总结
- 制作教程和案例
- 翻译优质外文资料

**建立影响力：**
- 持续输出高质量内容
- 积极回应用户互动
- 建立个人品牌形象
- 成为领域专家

**社区规范：**
- 遵守社区行为准则
- 尊重他人观点和隐私
- 避免恶意攻击和骚扰
- 举报不当行为

**获得认可：**
- 获得社区徽章和认证
- 提升用户等级和权限
- 成为版主或管理员
- 获得平台推荐和奖励

**网络礼仪：**
- 使用礼貌用语
- 提供建设性反馈
- 承认错误和道歉
- 感谢他人帮助`,
      tags: ['社区', '互动', '参与', '影响力'],
    },
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <QuestionCircleOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            帮助中心
          </Title>
          <Text type="secondary">快速找到您需要的帮助和解答</Text>
        </header>

        {/* 搜索区域 */}
        <Card className="search-section glass-card animate-fade-in-up delay-100">
          <Space
            size="large"
            style={{ width: '100%', flexDirection: 'column' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={3}>有什么可以帮助您的？</Title>
              <Paragraph type="secondary">
                搜索常见问题或浏览分类查找答案
              </Paragraph>
            </div>

            <Input.Search
              placeholder="搜索问题、关键词或标签..."
              allowClear
              size="large"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onSearch={value => setSearchTerm(value)}
              enterButton
              style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}
            />
          </Space>
        </Card>

        {/* 分类筛选 */}
        <Card className="category-section glass-card animate-fade-in-up delay-200">
          <Title level={4} style={{ marginBottom: 16 }}>
            问题分类
          </Title>
          <Space wrap>
            {categories.map(category => (
              <Button
                key={category.key}
                type={activeCategory === category.key ? 'primary' : 'default'}
                icon={category.icon}
                onClick={() => setActiveCategory(category.key)}
                className="category-btn glass-button hover-lift active-scale"
              >
                {category.label}
              </Button>
            ))}
          </Space>
        </Card>

        {/* FAQ 内容 */}
        <Card className="faq-section glass-card animate-fade-in-up delay-300">
          <Title level={3} style={{ marginBottom: 24 }}>
            常见问题 ({filteredFAQ.length})
          </Title>

          {filteredFAQ.length > 0 ? (
            <Collapse ghost className="faq-collapse">
              {filteredFAQ.map((item, index) => (
                <Panel
                  key={index}
                  header={
                    <div className="faq-header">
                      <Title level={5} style={{ margin: 0 }}>
                        {item.question}
                      </Title>
                      <Space wrap style={{ marginTop: 8 }}>
                        {item.tags.map(tag => (
                          <Tag key={tag} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  }
                  className="faq-panel"
                >
                  <div className="faq-answer">
                    <Paragraph style={{ whiteSpace: 'pre-line' }}>
                      {item.answer}
                    </Paragraph>
                  </div>
                </Panel>
              ))}
            </Collapse>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Paragraph type="secondary">
                没有找到相关问题，请尝试其他关键词或联系客服
              </Paragraph>
            </div>
          )}
        </Card>

        {/* 联系支持 */}
        <Card className="contact-section glass-card animate-fade-in-up delay-400">
          <div style={{ textAlign: 'center' }}>
            <Title level={3}>还没找到答案？</Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              我们的客服团队随时为您提供帮助
            </Paragraph>

            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                icon={<UserOutlined />}
                className="glass-button glass-strong hover-lift active-scale"
              >
                在线客服
              </Button>
              <Button
                size="large"
                icon={<QuestionCircleOutlined />}
                className="glass-button hover-lift active-scale"
                onClick={() => navigate('/ticket')}
              >
                提交工单
              </Button>
              <Button
                size="large"
                icon={<FileTextOutlined />}
                className="glass-button hover-lift active-scale"
                onClick={() => navigate('/tickets')}
              >
                我的工单
              </Button>
            </Space>

            <Divider />

            <Space size="small" style={{ flexDirection: 'column' }}>
              <Text type="secondary">其他联系方式：</Text>
              <Text>邮箱：ozemyn@icloud.com</Text>
              <Text>电话：400-123-4567</Text>
              <Text>工作时间：周一至周五 9:00-18:00</Text>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
