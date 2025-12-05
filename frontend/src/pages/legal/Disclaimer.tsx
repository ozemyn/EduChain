/* ===================================
   免责声明页面 - Disclaimer Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 清晰的内容结构
   
   ================================== */

import React from 'react';
import { Card, Typography, Divider, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './Legal.css';

const { Title, Paragraph, Text } = Typography;

const Disclaimer: React.FC = () => {
  return (
    <div className="legal-page animate-fade-in">
      <div className="legal-container container">
        {/* 页面头部 */}
        <header className="legal-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <ExclamationCircleOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">免责声明</Title>
          <Text type="secondary">最后更新：2025年12月5日</Text>
        </header>

        {/* 内容区域 */}
        <Card className="legal-content glass-card animate-fade-in-up delay-200">
          <Alert
            message="重要提示"
            description="请仔细阅读本免责声明。使用 EduChain 平台即表示您已阅读、理解并同意本声明的所有内容。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Typography>
            <Title level={2}>EduChain 免责声明</Title>
            <Paragraph>
              本免责声明适用于 EduChain 教育知识共享平台（以下简称"本平台"）提供的所有服务和内容。
              请您在使用本平台前仔细阅读本声明。
            </Paragraph>

            <Divider />

            <Title level={3}>1. 服务性质</Title>
            <Paragraph>
              <strong>1.1 信息平台</strong>
              <br />
              本平台是一个教育知识共享平台，主要提供信息存储、展示和交流服务。
              我们不对平台上的内容进行实质性审查或背书。
            </Paragraph>
            <Paragraph>
              <strong>1.2 用户责任</strong>
              <br />
              平台上的内容由用户自行发布，用户应对其发布的内容负责。
              我们不对用户发布的内容的真实性、准确性、完整性或合法性承担责任。
            </Paragraph>

            <Title level={3}>2. 内容免责</Title>
            <Paragraph>
              <strong>2.1 内容准确性</strong>
              <br />
              平台上的教育内容仅供参考和学习使用。我们不保证内容的准确性、时效性或适用性。
              用户应自行判断内容的可靠性，并承担使用内容的风险。
            </Paragraph>
            <Paragraph>
              <strong>2.2 第三方内容</strong>
              <br />
              平台可能包含指向第三方网站或资源的链接。我们不对这些第三方内容负责，
              也不对因访问这些链接而产生的任何损失承担责任。
            </Paragraph>
            <Paragraph>
              <strong>2.3 用户观点</strong>
              <br />
              用户在平台上发表的观点和评论仅代表用户个人立场，不代表本平台的观点或立场。
            </Paragraph>

            <Title level={3}>3. 技术服务免责</Title>
            <Paragraph>
              <strong>3.1 服务可用性</strong>
              <br />
              我们努力确保服务的稳定性和可用性，但不保证服务不会中断或无错误。
              因以下原因导致的服务中断或数据丢失，我们不承担责任：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>系统维护、升级或故障</li>
                <li>网络通信故障</li>
                <li>不可抗力因素（如自然灾害、战争等）</li>
                <li>黑客攻击、病毒入侵等安全事件</li>
                <li>第三方服务提供商的问题</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <strong>3.2 数据备份</strong>
              <br />
              虽然我们会定期备份数据，但建议用户自行备份重要内容。
              我们不对因数据丢失造成的损失承担责任。
            </Paragraph>
            <Paragraph>
              <strong>3.3 区块链服务</strong>
              <br />
              区块链存证服务依赖于区块链网络的正常运行。我们不对区块链网络的故障、
              拥堵或其他问题导致的存证失败承担责任。
            </Paragraph>

            <Title level={3}>4. 用户行为免责</Title>
            <Paragraph>
              <strong>4.1 用户违规</strong>
              <br />
              用户在使用平台时应遵守法律法规和平台规则。因用户违规行为导致的任何法律责任，
              由用户自行承担。
            </Paragraph>
            <Paragraph>
              <strong>4.2 用户纠纷</strong>
              <br />
              用户之间因使用平台服务产生的纠纷，应由用户自行协商解决。
              我们可以提供必要的协助，但不承担调解或仲裁的义务。
            </Paragraph>
            <Paragraph>
              <strong>4.3 账户安全</strong>
              <br />
              用户应妥善保管账户信息。因用户泄露账户信息导致的损失，由用户自行承担。
            </Paragraph>

            <Title level={3}>5. 知识产权免责</Title>
            <Paragraph>
              <strong>5.1 侵权内容</strong>
              <br />
              如果用户发布的内容侵犯他人知识产权，我们在收到有效通知后会及时处理，
              但不对侵权行为本身承担责任。
            </Paragraph>
            <Paragraph>
              <strong>5.2 版权纠纷</strong>
              <br />
              因用户发布的内容引起的版权纠纷，由内容发布者承担全部法律责任。
            </Paragraph>

            <Title level={3}>6. 经济损失免责</Title>
            <Paragraph>
              在法律允许的最大范围内，我们不对以下损失承担责任：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>直接或间接的经济损失</li>
                <li>利润损失或业务中断</li>
                <li>数据丢失或损坏</li>
                <li>商誉或声誉损失</li>
                <li>任何特殊、间接、惩罚性或后果性损失</li>
              </ul>
            </Paragraph>

            <Title level={3}>7. 教育用途声明</Title>
            <Paragraph>
              <strong>7.1 学习参考</strong>
              <br />
              平台内容仅供学习和参考使用，不构成专业建议。用户在做出重要决策前，
              应咨询相关领域的专业人士。
            </Paragraph>
            <Paragraph>
              <strong>7.2 学术诚信</strong>
              <br />
              用户应遵守学术诚信原则，不得将平台内容用于抄袭、作弊等违反学术规范的行为。
            </Paragraph>

            <Title level={3}>8. 未成年人保护</Title>
            <Paragraph>
              未成年人使用本平台应在监护人的指导和监督下进行。
              监护人应对未成年人的网络行为负责。我们不对未成年人的不当使用行为承担责任。
            </Paragraph>

            <Title level={3}>9. 法律适用与争议解决</Title>
            <Paragraph>
              <strong>9.1 法律适用</strong>
              <br />
              本免责声明受中华人民共和国法律管辖。
            </Paragraph>
            <Paragraph>
              <strong>9.2 争议解决</strong>
              <br />
              因本声明引起的任何争议，应首先通过友好协商解决；
              协商不成的，任何一方可向本平台所在地人民法院提起诉讼。
            </Paragraph>

            <Title level={3}>10. 声明变更</Title>
            <Paragraph>
              我们保留随时修改本免责声明的权利。修改后的声明将在平台上公布，
              并自公布之日起生效。继续使用平台服务即表示您接受修改后的声明。
            </Paragraph>

            <Title level={3}>11. 联系我们</Title>
            <Paragraph>
              如果您对本免责声明有任何疑问，请通过以下方式联系我们：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>邮箱：legal@educhain.com</li>
                <li>电话：400-123-4567</li>
                <li>地址：北京市海淀区中关村大街1号</li>
              </ul>
            </Paragraph>

            <Divider />

            <Alert
              message="特别提醒"
              description="使用本平台即表示您已充分理解并接受本免责声明的所有内容。如果您不同意本声明的任何内容，请立即停止使用本平台。"
              type="info"
              showIcon
            />

            <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24 }}>
              本免责声明的最终解释权归 EduChain 所有
            </Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default Disclaimer;
