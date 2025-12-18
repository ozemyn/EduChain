/* ===================================
   服务条款页面 - Terms of Service Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 清晰的内容结构
   
   ================================== */

import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import './Legal.css';

const { Title, Paragraph, Text } = Typography;

const TermsOfService: React.FC = () => {
  return (
    <div className="legal-page animate-fade-in">
      <div className="legal-container container">
        {/* 页面头部 */}
        <header className="legal-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <FileTextOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            服务条款
          </Title>
          <Text type="secondary">最后更新：2025年12月5日</Text>
        </header>

        {/* 内容区域 */}
        <Card className="legal-content glass-card animate-fade-in-up delay-200">
          <Typography>
            <Title level={2}>欢迎使用 EduChain</Title>
            <Paragraph>
              感谢您选择 EduChain
              教育知识共享平台。在使用我们的服务之前，请仔细阅读以下服务条款。
              使用本平台即表示您同意遵守这些条款。
            </Paragraph>

            <Divider />

            <Title level={3}>1. 服务说明</Title>
            <Paragraph>
              EduChain
              是一个基于区块链技术的教育知识共享平台，致力于为用户提供：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>优质的教育内容分享和学习服务</li>
                <li>基于区块链的内容存证和版权保护</li>
                <li>智能推荐和个性化学习体验</li>
                <li>社区交流和知识协作功能</li>
              </ul>
            </Paragraph>

            <Title level={3}>2. 用户账户</Title>
            <Paragraph>
              <strong>2.1 账户注册</strong>
              <br />
              您需要注册账户才能使用平台的完整功能。注册时，您必须提供真实、准确、完整的信息。
            </Paragraph>
            <Paragraph>
              <strong>2.2 账户安全</strong>
              <br />
              您有责任维护账户的安全性和保密性。任何通过您的账户进行的活动都将被视为您本人的行为。
            </Paragraph>
            <Paragraph>
              <strong>2.3 账户使用</strong>
              <br />
              您不得将账户转让、出售或以其他方式提供给第三方使用。
            </Paragraph>

            <Title level={3}>3. 内容规范</Title>
            <Paragraph>
              <strong>3.1 内容发布</strong>
              <br />
              您发布的内容必须符合法律法规，不得包含违法、有害、虚假、侵权或不当信息。
            </Paragraph>
            <Paragraph>
              <strong>3.2 知识产权</strong>
              <br />
              您对自己发布的内容拥有知识产权，但授予 EduChain
              在平台上使用、展示和推广的权利。
            </Paragraph>
            <Paragraph>
              <strong>3.3 内容审核</strong>
              <br />
              我们保留审核、编辑或删除不符合规范内容的权利。
            </Paragraph>

            <Title level={3}>4. 区块链存证</Title>
            <Paragraph>
              平台使用区块链技术对知识内容进行存证，以保护内容的原创性和完整性。
              一旦内容被存证，相关记录将永久保存在区块链上，不可篡改。
            </Paragraph>

            <Title level={3}>5. 用户行为规范</Title>
            <Paragraph>您在使用平台时，不得：</Paragraph>
            <Paragraph>
              <ul>
                <li>发布违法、有害、虚假或侵权内容</li>
                <li>侵犯他人的知识产权或隐私权</li>
                <li>进行恶意攻击、骚扰或欺诈行为</li>
                <li>使用自动化工具或机器人程序</li>
                <li>干扰或破坏平台的正常运行</li>
              </ul>
            </Paragraph>

            <Title level={3}>6. 服务变更与终止</Title>
            <Paragraph>
              我们保留随时修改、暂停或终止服务的权利。对于违反服务条款的用户，
              我们有权限制、暂停或终止其账户。
            </Paragraph>

            <Title level={3}>7. 免责声明</Title>
            <Paragraph>
              平台提供的内容仅供参考和学习使用。我们不对内容的准确性、完整性或适用性做出保证。
              用户使用平台内容所产生的任何后果由用户自行承担。
            </Paragraph>

            <Title level={3}>8. 法律适用</Title>
            <Paragraph>
              本服务条款受中华人民共和国法律管辖。因本条款引起的任何争议，
              应首先通过友好协商解决；协商不成的，应提交至平台所在地人民法院诉讼解决。
            </Paragraph>

            <Title level={3}>9. 联系我们</Title>
            <Paragraph>
              如果您对服务条款有任何疑问，请通过以下方式联系我们：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>邮箱：ozemyn@icloud.com</li>
                <li>电话：400-123-4567</li>
                <li>地址：北京市海淀区中关村大街1号</li>
              </ul>
            </Paragraph>

            <Divider />

            <Paragraph type="secondary" style={{ textAlign: 'center' }}>
              本服务条款的最终解释权归 EduChain 所有
            </Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
