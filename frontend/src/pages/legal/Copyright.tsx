/* ===================================
   版权声明页面 - Copyright Notice Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 清晰的内容结构
   
   ================================== */

import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import './Legal.css';

const { Title, Paragraph, Text } = Typography;

const Copyright: React.FC = () => {
  return (
    <div className="legal-page animate-fade-in">
      <div className="legal-container container">
        {/* 页面头部 */}
        <header className="legal-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <CopyrightOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            版权声明
          </Title>
          <Text type="secondary">最后更新：2025年12月5日</Text>
        </header>

        {/* 内容区域 */}
        <Card className="legal-content glass-card animate-fade-in-up delay-200">
          <Typography>
            <Title level={2}>EduChain 版权声明</Title>
            <Paragraph>
              本声明适用于 EduChain
              教育知识共享平台（以下简称"本平台"）的所有内容和服务。
              请仔细阅读以下版权声明，以了解您在使用本平台时的权利和义务。
            </Paragraph>

            <Divider />

            <Title level={3}>1. 平台版权</Title>
            <Paragraph>
              <strong>1.1 平台所有权</strong>
              <br />
              本平台的整体设计、功能、代码、图标、界面、文字、图片等所有内容的知识产权归
              EduChain 所有， 受中华人民共和国著作权法及国际版权公约的保护。
            </Paragraph>
            <Paragraph>
              <strong>1.2 商标权</strong>
              <br />
              "EduChain"及相关标识、图标均为我们的注册商标或商标，未经授权不得使用。
            </Paragraph>
            <Paragraph>
              <strong>1.3 技术保护</strong>
              <br />
              本平台采用的区块链技术、算法、数据结构等技术方案受知识产权法保护，
              未经许可不得复制、模仿或用于商业目的。
            </Paragraph>

            <Title level={3}>2. 用户内容版权</Title>
            <Paragraph>
              <strong>2.1 内容所有权</strong>
              <br />
              用户在本平台上传、发布的原创内容（包括但不限于文字、图片、视频、音频等），
              其知识产权归用户本人所有。
            </Paragraph>
            <Paragraph>
              <strong>2.2 授权许可</strong>
              <br />
              用户在发布内容时，授予本平台以下权利：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>在平台上展示、传播和推广该内容</li>
                <li>为提供服务而对内容进行必要的技术处理</li>
                <li>在合理范围内使用内容进行平台宣传</li>
                <li>将内容存证到区块链以保护版权</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <strong>2.3 内容责任</strong>
              <br />
              用户应确保其发布的内容不侵犯他人的知识产权。如因用户发布的内容引起版权纠纷，
              由用户承担全部法律责任。
            </Paragraph>

            <Title level={3}>3. 区块链存证</Title>
            <Paragraph>
              <strong>3.1 存证服务</strong>
              <br />
              本平台提供基于区块链的内容存证服务，将内容的哈希值和元数据记录在区块链上，
              以证明内容的原创性和发布时间。
            </Paragraph>
            <Paragraph>
              <strong>3.2 存证效力</strong>
              <br />
              区块链存证记录具有不可篡改性，可作为版权归属和侵权取证的重要依据。
            </Paragraph>
            <Paragraph>
              <strong>3.3 证书生成</strong>
              <br />
              用户可以为已存证的内容生成数字证书，证书包含区块链存证信息和二维码验证功能。
            </Paragraph>

            <Title level={3}>4. 内容使用规范</Title>
            <Paragraph>
              <strong>4.1 合理使用</strong>
              <br />
              用户可以在以下情况下使用平台内容：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>个人学习和研究目的</li>
                <li>课堂教学和学术交流</li>
                <li>新闻报道和评论引用</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <strong>4.2 禁止行为</strong>
              <br />
              未经授权，不得：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>复制、修改、传播平台内容用于商业目的</li>
                <li>删除或修改内容的版权标识</li>
                <li>将平台内容用于创建衍生作品</li>
                <li>通过技术手段批量下载或抓取内容</li>
              </ul>
            </Paragraph>

            <Title level={3}>5. 侵权处理</Title>
            <Paragraph>
              <strong>5.1 侵权投诉</strong>
              <br />
              如果您认为平台上的内容侵犯了您的版权，请提供以下信息：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>权利人的身份证明</li>
                <li>权属证明材料</li>
                <li>侵权内容的具体位置</li>
                <li>联系方式</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <strong>5.2 处理流程</strong>
              <br />
              收到有效投诉后，我们将在3个工作日内进行审核，并采取必要措施，
              包括删除侵权内容、暂停侵权用户账户等。
            </Paragraph>
            <Paragraph>
              <strong>5.3 反通知</strong>
              <br />
              如果您认为被错误删除的内容不构成侵权，可以提交反通知，
              我们将根据实际情况进行处理。
            </Paragraph>

            <Title level={3}>6. 开源许可</Title>
            <Paragraph>
              本平台使用的部分开源软件和库遵循各自的开源许可协议。
              我们尊重并遵守这些许可协议的条款。
            </Paragraph>

            <Title level={3}>7. 免责声明</Title>
            <Paragraph>
              <ul>
                <li>
                  平台仅提供信息存储和展示服务，不对用户发布的内容承担版权审查义务
                </li>
                <li>用户应自行判断内容的合法性和准确性</li>
                <li>因用户违反版权法律法规造成的损失，由用户自行承担</li>
              </ul>
            </Paragraph>

            <Title level={3}>8. 法律适用</Title>
            <Paragraph>
              本版权声明受中华人民共和国著作权法及相关法律法规管辖。
              因版权问题引起的争议，应首先通过协商解决；协商不成的，
              可向平台所在地人民法院提起诉讼。
            </Paragraph>

            <Title level={3}>9. 联系我们</Title>
            <Paragraph>
              如果您对版权问题有任何疑问或需要投诉侵权，请通过以下方式联系我们：
            </Paragraph>
            <Paragraph>
              <ul>
                <li>版权投诉邮箱：copyright@educhain.com</li>
                <li>客服电话：400-123-4567</li>
                <li>通信地址：北京市海淀区中关村大街1号</li>
              </ul>
            </Paragraph>

            <Divider />

            <Paragraph type="secondary" style={{ textAlign: 'center' }}>
              © 2025 EduChain. All Rights Reserved.
              <br />
              我们尊重并保护知识产权，共同营造良好的知识分享环境
            </Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default Copyright;
