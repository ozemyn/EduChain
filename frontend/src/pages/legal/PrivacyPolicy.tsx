/* ===================================
   隐私政策页面 - Privacy Policy Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 清晰的内容结构
   
   ================================== */

import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import './Legal.css';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-page animate-fade-in">
      <div className="legal-container container">
        {/* 页面头部 */}
        <header className="legal-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <SafetyOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            隐私政策
          </Title>
          <Text type="secondary">最后更新：2025年12月5日</Text>
        </header>

        {/* 内容区域 */}
        <Card className="legal-content glass-card animate-fade-in-up delay-200">
          <Typography>
            <Title level={2}>EduChain 隐私政策</Title>
            <Paragraph>
              EduChain（以下简称"我们"）非常重视用户的隐私保护。本隐私政策说明了我们如何收集、
              使用、存储和保护您的个人信息。请仔细阅读本政策，以了解我们对您个人信息的处理方式。
            </Paragraph>

            <Divider />

            <Title level={3}>1. 信息收集</Title>
            <Paragraph>
              <strong>1.1 您主动提供的信息</strong>
              <br />
              当您注册账户、使用服务或与我们联系时，我们可能收集以下信息：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>基本信息：用户名、邮箱地址、手机号码</li>
                <li>个人资料：姓名、学校、个人简介、头像</li>
                <li>内容信息：您发布的知识内容、评论、互动记录</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <strong>1.2 自动收集的信息</strong>
              <br />
              在您使用我们的服务时，我们可能自动收集以下信息：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>设备信息：设备型号、操作系统、浏览器类型</li>
                <li>日志信息：IP地址、访问时间、访问页面</li>
                <li>使用数据：浏览记录、搜索历史、互动行为</li>
              </ul>
            </Paragraph>

            <Title level={3}>2. 信息使用</Title>
            <Paragraph>我们收集的信息将用于以下目的：</Paragraph>
            <Paragraph>
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>个性化推荐和内容展示</li>
                <li>用户身份验证和账户安全</li>
                <li>数据分析和服务优化</li>
                <li>发送服务通知和更新信息</li>
                <li>防止欺诈和滥用行为</li>
                <li>遵守法律法规要求</li>
              </ul>
            </Paragraph>

            <Title level={3}>3. 信息共享</Title>
            <Paragraph>
              我们承诺不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：
            </Paragraph>
            <Paragraph>
              <strong>3.1 经您同意</strong>
              <br />
              在获得您明确同意的情况下，我们会与第三方共享您的信息。
            </Paragraph>
            <Paragraph>
              <strong>3.2 服务提供商</strong>
              <br />
              我们可能与为我们提供服务的第三方共享必要信息，如云存储、数据分析等服务商。
            </Paragraph>
            <Paragraph>
              <strong>3.3 法律要求</strong>
              <br />
              根据法律法规、法律程序或政府要求，我们可能需要披露您的信息。
            </Paragraph>
            <Paragraph>
              <strong>3.4 公开信息</strong>
              <br />
              您在平台上公开发布的内容（如知识分享、评论）将对其他用户可见。
            </Paragraph>

            <Title level={3}>4. 信息存储</Title>
            <Paragraph>
              <strong>4.1 存储位置</strong>
              <br />
              您的信息将存储在中华人民共和国境内的服务器上。
            </Paragraph>
            <Paragraph>
              <strong>4.2 存储期限</strong>
              <br />
              我们将在实现收集目的所需的期限内保留您的信息。当您注销账户或要求删除信息时，
              我们将在合理期限内删除或匿名化处理您的信息。
            </Paragraph>
            <Paragraph>
              <strong>4.3 区块链存储</strong>
              <br />
              通过区块链存证的内容哈希和元数据将永久保存在区块链上，无法删除或修改。
            </Paragraph>

            <Title level={3}>5. 信息安全</Title>
            <Paragraph>我们采取多种安全措施保护您的信息：</Paragraph>
            <Paragraph>
              <ul>
                <li>数据加密：使用SSL/TLS加密传输数据</li>
                <li>访问控制：严格限制员工访问权限</li>
                <li>安全审计：定期进行安全评估和审计</li>
                <li>备份机制：定期备份数据以防丢失</li>
                <li>应急响应：建立数据泄露应急响应机制</li>
              </ul>
            </Paragraph>

            <Title level={3}>6. 您的权利</Title>
            <Paragraph>根据相关法律法规，您享有以下权利：</Paragraph>
            <Paragraph>
              <ul>
                <li>访问权：查看我们持有的您的个人信息</li>
                <li>更正权：更正不准确或不完整的信息</li>
                <li>删除权：要求删除您的个人信息</li>
                <li>撤回同意：撤回您之前给予的同意</li>
                <li>数据导出：以结构化格式获取您的数据</li>
                <li>投诉权：向监管机构投诉我们的数据处理行为</li>
              </ul>
            </Paragraph>

            <Title level={3}>7. Cookie 和类似技术</Title>
            <Paragraph>
              我们使用 Cookie
              和类似技术来改善用户体验、分析使用情况和提供个性化服务。
              您可以通过浏览器设置管理 Cookie，但这可能影响某些功能的使用。
            </Paragraph>

            <Title level={3}>8. 未成年人保护</Title>
            <Paragraph>
              我们非常重视未成年人的隐私保护。如果您是未成年人，请在监护人的陪同下使用我们的服务。
              我们不会故意收集未满14周岁儿童的个人信息。
            </Paragraph>

            <Title level={3}>9. 政策更新</Title>
            <Paragraph>
              我们可能会不时更新本隐私政策。重大变更时，我们会通过平台通知或邮件方式告知您。
              继续使用服务即表示您接受更新后的政策。
            </Paragraph>

            <Title level={3}>10. 联系我们</Title>
            <Paragraph>
              如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>邮箱：privacy@educhain.com</li>
                <li>电话：400-123-4567</li>
                <li>地址：北京市海淀区中关村大街1号</li>
              </ul>
            </Paragraph>

            <Divider />

            <Paragraph type="secondary" style={{ textAlign: 'center' }}>
              我们承诺保护您的隐私，感谢您对 EduChain 的信任
            </Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
