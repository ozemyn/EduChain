/* ===================================
   现代化页脚组件 - Modern Footer Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 玻璃态效果
   - 简洁优雅
   
   ================================== */

import React, { useCallback, useMemo, useEffect } from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
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

// 优化的链接组件，使用 React.memo 避免不必要的重渲染
interface FooterLinkProps {
  path: string;
  label: string;
  onClick: (path: string) => void;
}

const FooterLink: React.FC<FooterLinkProps> = React.memo(
  ({ path, label, onClick }) => {
    // 使用 useCallback 缓存点击处理函数
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(path);
      },
      [path, onClick]
    );

    return (
      <li>
        <a
          onClick={handleClick}
          className="footer-link hover-lift"
          style={{ cursor: 'pointer' }}
        >
          {label}
        </a>
      </li>
    );
  }
);

// 优化的社交链接组件
interface SocialLinkProps {
  url: string;
  label: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = React.memo(
  ({ url, label, icon }) => {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link glass-button hover-scale active-scale"
        aria-label={label}
      >
        {icon}
      </a>
    );
  }
);

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();

  // 防抖和节流处理，避免快速点击导致的性能问题
  const debounceTimeoutRef = React.useRef<number | null>(null);
  const lastClickTimeRef = React.useRef<number>(0);
  const isNavigatingRef = React.useRef<boolean>(false);

  // 使用 useCallback 优化性能，避免每次渲染都创建新函数
  const handleLinkClick = useCallback(
    (path: string) => {
      const now = Date.now();

      // 节流：如果距离上次点击时间小于100ms，则忽略
      if (now - lastClickTimeRef.current < 100) {
        return;
      }

      // 如果正在导航中，则忽略新的点击
      if (isNavigatingRef.current) {
        return;
      }

      lastClickTimeRef.current = now;
      isNavigatingRef.current = true;

      // 清除之前的定时器
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // 立即导航
      navigate(path);

      // 使用防抖机制优化滚动，并重置导航状态
      debounceTimeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // 滚动完成后重置导航状态
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 300); // 等待滚动动画完成
        });
      }, 50); // 50ms 防抖延迟
    },
    [navigate]
  );

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // 使用 useMemo 缓存静态数据，避免每次渲染都重新创建
  const footerLinks = useMemo(
    () => ({
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
    }),
    []
  );

  const socialLinks = useMemo(
    () => [
      { icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com/ozemyn/EduChain' },
      {
        icon: <TwitterOutlined />,
        label: 'Twitter',
        url: 'https://twitter.com',
      },
      { icon: <WechatOutlined />, label: '微信', url: '#' },
      {
        icon: <MailOutlined />,
        label: '邮箱',
        url: 'mailto:contact@educhain.com',
      },
    ],
    []
  );

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
                    <SocialLink
                      key={social.label}
                      url={social.url}
                      label={social.label}
                      icon={social.icon}
                    />
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
                    <FooterLink
                      key={link.path}
                      path={link.path}
                      label={link.label}
                      onClick={handleLinkClick}
                    />
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
                    <FooterLink
                      key={link.path}
                      path={link.path}
                      label={link.label}
                      onClick={handleLinkClick}
                    />
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
                    <FooterLink
                      key={link.path}
                      path={link.path}
                      label={link.label}
                      onClick={handleLinkClick}
                    />
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
                    <FooterLink
                      key={link.path}
                      path={link.path}
                      label={link.label}
                      onClick={handleLinkClick}
                    />
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
