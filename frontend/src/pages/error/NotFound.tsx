/* ===================================
   404 页面组件 - 404 Not Found Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 创意动画效果
   - 友好的用户体验
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import {
  HomeOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

/**
 * 404 页面组件
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 生成星星位置（只在组件挂载时生成一次）
  const [stars] = useState(() =>
    [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }))
  );

  // 跟踪鼠标位置用于视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="not-found-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="not-found-background">
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
          <div className="shape shape-4" />
          <div className="shape shape-5" />
        </div>
        <div className="grid-pattern" />
      </div>

      <div className="not-found-content">
        {/* 主要内容区域 */}
        <div className="error-main glass-card animate-fade-in-up">
          {/* 404 大标题 - 带视差效果 */}
          <div
            className="error-number-container"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          >
            <h1 className="error-number gradient-text">
              <span className="number-digit">4</span>
              <span className="number-digit middle-digit">0</span>
              <span className="number-digit">4</span>
            </h1>
          </div>

          {/* 错误信息 */}
          <div className="error-message animate-fade-in-up delay-100">
            <h2 className="error-title">页面走丢了</h2>
            <p className="error-description">
              哎呀！您访问的页面似乎在宇宙中迷路了...
              <br />
              不过别担心，我们可以帮您找到回家的路！
            </p>
          </div>

          {/* 装饰性插图 */}
          <div className="error-illustration animate-fade-in-up delay-200">
            <div className="astronaut">
              <div className="astronaut-body glass-light">
                <div className="helmet">
                  <div className="face">
                    <div className="eyes">
                      <div className="eye left-eye" />
                      <div className="eye right-eye" />
                    </div>
                    <div className="mouth" />
                  </div>
                  <div className="helmet-shine" />
                </div>
                <div className="body-suit" />
              </div>
              <div className="flag">
                <div className="flag-pole" />
                <div className="flag-cloth">404</div>
              </div>
            </div>
            <div className="stars">
              {stars.map((star, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    animationDelay: `${star.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="error-actions animate-fade-in-up delay-300">
            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="glass-button glass-strong hover-lift active-scale primary-button"
              >
                返回首页
              </Button>
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="glass-button hover-scale active-scale"
              >
                返回上一页
              </Button>
            </Space>
          </div>

          {/* 快捷导航 */}
          <div className="quick-links animate-fade-in-up delay-400">
            <h3 className="quick-links-title">或者试试这些：</h3>
            <div className="quick-links-grid">
              <button
                className="quick-link-item glass-light hover-lift active-scale"
                onClick={() => navigate('/')}
              >
                <div className="quick-link-icon">
                  <HomeOutlined />
                </div>
                <span className="quick-link-label">返回首页</span>
              </button>
              <button
                className="quick-link-item glass-light hover-lift active-scale"
                onClick={() => navigate('/knowledge')}
              >
                <div className="quick-link-icon">
                  <SearchOutlined />
                </div>
                <span className="quick-link-label">搜索内容</span>
              </button>
              <button
                className="quick-link-item glass-light hover-lift active-scale"
                onClick={() => navigate('/knowledge')}
              >
                <div className="quick-link-icon">
                  <CompassOutlined />
                </div>
                <span className="quick-link-label">探索发现</span>
              </button>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="error-footer animate-fade-in-up delay-500">
          <p className="footer-text">
            如果您认为这是一个错误，请
            <a href="mailto:ozemyn@icloud.com" className="footer-link">
              联系我们
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
