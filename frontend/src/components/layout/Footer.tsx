import React from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import {
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  WechatOutlined,
  TwitterOutlined,
  BookOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  HeartFilled,
} from '@ant-design/icons';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: '关于我们', href: '/about' },
    { title: '使用条款', href: '/terms' },
    { title: '隐私政策', href: '/privacy' },
    { title: '帮助中心', href: '/help' },
  ];

  const products = [
    { title: '知识库', href: '/knowledge', icon: <BookOutlined /> },
    { title: '智能搜索', href: '/search', icon: <SafetyCertificateOutlined /> },
    { title: '社区', href: '/community', icon: <TeamOutlined /> },
  ];

  const socialLinks = [
    {
      icon: <GithubOutlined />,
      href: 'https://github.com/educhain',
      label: 'GitHub',
    },
    { icon: <WechatOutlined />, href: '#', label: '微信' },
    { icon: <TwitterOutlined />, href: '#', label: 'Twitter' },
    {
      icon: <MailOutlined />,
      href: 'mailto:contact@educhain.com',
      label: '邮箱',
    },
  ];

  return (
    <AntFooter className="modern-footer glass-light animate-fade-in-up">
      <div className="footer-container">
        {/* 主要内容区域 */}
        <div className="footer-main">
          <Row gutter={[48, 32]}>
            {/* 品牌区域 */}
            <Col xs={24} md={8}>
              <div className="footer-brand">
                <div className="brand-logo">
                  <span className="logo-text gradient-text">EduChain</span>
                </div>
                <p className="brand-description">
                  构建去中心化的教育知识生态系统，让每一份知识都能发光发热，
                  为全球学习者提供无界限的学习体验。
                </p>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="social-link glass-button hover-lift active-scale"
                      title={social.label}
                      target={
                        social.href.startsWith('http') ? '_blank' : '_self'
                      }
                      rel={
                        social.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            {/* 产品链接 */}
            <Col xs={12} md={5}>
              <div className="footer-section">
                <h4 className="section-title">产品</h4>
                <ul className="link-list">
                  {products.map((product, index) => (
                    <li key={index}>
                      <Link
                        href={product.href}
                        className="footer-link hover-scale"
                      >
                        {product.icon}
                        <span>{product.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* 快速链接 */}
            <Col xs={12} md={5}>
              <div className="footer-section">
                <h4 className="section-title">快速链接</h4>
                <ul className="link-list">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="footer-link hover-scale"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* 联系信息 */}
            <Col xs={24} md={6}>
              <div className="footer-section">
                <h4 className="section-title">联系我们</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <PhoneOutlined />
                    <span>400-123-4567</span>
                  </div>
                  <div className="contact-item">
                    <MailOutlined />
                    <span>contact@educhain.com</span>
                  </div>
                </div>
                <div className="newsletter glass-light">
                  <p className="newsletter-title">订阅更新</p>
                  <p className="newsletter-desc">
                    获取最新的教育资讯和平台动态
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 底部版权区域 */}
        <div className="footer-bottom glass-medium">
          <div className="copyright-content">
            <div className="copyright-text">
              <Text>
                © {currentYear} EduChain. Made with{' '}
                <HeartFilled className="heart-icon" /> by EduChain Team
              </Text>
            </div>
            <div className="footer-links">
              <Link href="/terms" className="footer-bottom-link">
                使用条款
              </Link>
              <span className="separator">•</span>
              <Link href="/privacy" className="footer-bottom-link">
                隐私政策
              </Link>
              <span className="separator">•</span>
              <Link href="/cookies" className="footer-bottom-link">
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modern-footer {
          background: var(--bg-secondary);
          border-top: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
          margin-top: var(--spacing-3xl);
          position: relative;
          overflow: hidden;
        }

        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 10% 20%, var(--primary-50) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, var(--accent-secondary) 0%, transparent 50%);
          opacity: 0.1;
          z-index: -1;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .footer-main {
          padding: var(--spacing-3xl) 0 var(--spacing-2xl);
        }

        /* 品牌区域 */
        .footer-brand {
          margin-bottom: var(--spacing-lg);
        }

        .brand-logo {
          margin-bottom: var(--spacing-md);
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px var(--glass-shadow));
        }

        .brand-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          background: var(--glass-bg-light);
          backdrop-filter: var(--blur-sm);
          -webkit-backdrop-filter: var(--blur-sm);
          border: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast) var(--ease-ios);
          font-size: 1.1rem;
        }

        .social-link:hover {
          background: var(--glass-bg-medium);
          color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: var(--glass-shadow-sm);
        }

        /* 页脚区块 */
        .footer-section {
          margin-bottom: var(--spacing-lg);
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-md);
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-primary), transparent);
          border-radius: var(--radius-full);
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-list li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) 0;
          transition: all var(--transition-fast) var(--ease-ios);
          font-size: 0.95rem;
        }

        .footer-link:hover {
          color: var(--accent-primary);
          transform: translateX(4px);
        }

        /* 联系信息 */
        .contact-info {
          margin-bottom: var(--spacing-lg);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .contact-item .anticon {
          color: var(--accent-primary);
        }

        .newsletter {
          padding: var(--spacing-md);
          border-radius: var(--liquid-border-radius);
          border: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
        }

        .newsletter-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
          font-size: 0.95rem;
        }

        .newsletter-desc {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        /* 底部版权 */
        .footer-bottom {
          border-top: var(--glass-border-width) var(--glass-border-style) var(--glass-border);
          padding: var(--spacing-lg) 0;
          backdrop-filter: var(--blur-sm);
          -webkit-backdrop-filter: var(--blur-sm);
        }

        .copyright-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .copyright-text {
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        .heart-icon {
          color: var(--accent-error);
          margin: 0 2px;
          animation: heartbeat 2s ease-in-out infinite;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .footer-bottom-link {
          color: var(--text-tertiary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-fast) var(--ease-ios);
        }

        .footer-bottom-link:hover {
          color: var(--accent-primary);
        }

        .separator {
          color: var(--text-quaternary);
          font-size: 0.875rem;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .footer-main {
            padding: var(--spacing-2xl) 0 var(--spacing-xl);
          }

          .footer-container {
            padding: 0 var(--spacing-md);
          }

          .copyright-content {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-sm);
          }

          .footer-links {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .brand-description {
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .logo-text {
            font-size: 1.75rem;
          }

          .section-title {
            font-size: 1rem;
          }

          .footer-link,
          .contact-item {
            font-size: 0.875rem;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .social-link,
          .footer-link,
          .heart-icon {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </AntFooter>
  );
};

export default Footer;
