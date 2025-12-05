/* ===================================
   现代化页脚组件 - Modern Footer Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 玻璃态效果
   - 简洁优雅
   
   ================================== */

import React from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { Link } from 'react-router-dom';
import {
  GithubOutlined,
  TwitterOutlined,
  WechatOutlined,
  MailOutlined,
  HeartFilled,
  BookOutlined,
} from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: '知识库', path: '/knowledge' },
      { label: '智能搜索', path: '/search' },
      { label: '推荐系统', path: '/recommendations' },
      { label: '社区交流', path: '/community' },
    ],
    company: [
      { label: '关于我们', path: '/about' },
      { label: '联系我们', path: '/contact' },
      { label: '加入我们', path: '/careers' },
      { label: '合作伙伴', path: '/partners' },
    ],
    resources: [
      { label: '帮助中心', path: '/help' },
      { label: '开发文档', path: '/docs' },
      { label: 'API 文档', path: '/api' },
      { label: '更新日志', path: '/changelog' },
    ],
    legal: [
      { label: '服务条款', path: '/terms' },
      { label: '隐私政策', path: '/privacy' },
      { label: '版权声明', path: '/copyright' },
      { label: '免责声明', path: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com' },
    { icon: <TwitterOutlined />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <WechatOutlined />, label: '微信', url: '#' },
    {
      icon: <MailOutlined />,
      label: '邮箱',
      url: 'mailto:contact@educhain.com',
    },
  ];

  return (
    <AntFooter className="modern-footer glass-light">
      <div className="footer-container container">
        {/* 主要内容区 */}
        <div className="footer-main">
          <Row gutter={[32, 32]}>
            {/* 品牌信息 */}
            <Col xs={24} sm={24} md={24} lg={6}>
              <div className="footer-brand">
                <div className="brand-logo">
                  <div className="logo-icon glass-badge">
                    <BookOutlined />
                  </div>
                  <span className="logo-text gradient-text">EduChain</span>
                </div>
                <p className="brand-description">
                  连接全球学习者与教育者，构建去中心化的知识共享生态系统
                </p>
                <Space size="middle" className="social-links">
                  {socialLinks.map(social => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link glass-button hover-scale active-scale"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </Space>
              </div>
            </Col>

            {/* 产品链接 */}
            <Col xs={12} sm={12} md={6} lg={4}>
              <div className="footer-section">
                <h3 className="section-title">产品</h3>
                <ul className="link-list">
                  {footerLinks.product.map(link => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link hover-lift">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* 公司链接 */}
            <Col xs={12} sm={12} md={6} lg={4}>
              <div className="footer-section">
                <h3 className="section-title">公司</h3>
                <ul className="link-list">
                  {footerLinks.company.map(link => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link hover-lift">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* 资源链接 */}
            <Col xs={12} sm={12} md={6} lg={5}>
              <div className="footer-section">
                <h3 className="section-title">资源</h3>
                <ul className="link-list">
                  {footerLinks.resources.map(link => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link hover-lift">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* 法律链接 */}
            <Col xs={12} sm={12} md={6} lg={5}>
              <div className="footer-section">
                <h3 className="section-title">法律</h3>
                <ul className="link-list">
                  {footerLinks.legal.map(link => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link hover-lift">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        {/* 底部版权信息 */}
        <div className="footer-bottom">
          <div className="copyright">
            <span>© {currentYear} EduChain. All rights reserved.</span>
            <span className="divider">|</span>
            <span className="made-with">
              Made with <HeartFilled className="heart-icon" /> by EduChain Team
            </span>
          </div>
          <div className="footer-meta">
            <span>ICP备案号：京ICP备12345678号</span>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
