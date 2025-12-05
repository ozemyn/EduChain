/* ===================================
   社区页面组件 - Community Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 热门讨论展示
   - 活跃用户展示
   - 热门话题标签
   - 快速入口导航
   - 高性能优化
   
   ================================== */

import React, { useState } from 'react';
import { Row, Col, Space, Tag, Button, Avatar } from 'antd';
import {
  TeamOutlined,
  MessageOutlined,
  FireOutlined,
  UserOutlined,
  CompassOutlined,
  SearchOutlined,
  BookOutlined,
  StarOutlined,
  HeartOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Community.css';

/**
 * 社区页面组件
 */
const Community: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'trending'>('hot');

  // 热门话题数据
  const hotTopics = [
    { name: '前端开发', count: 1234, color: 'blue' },
    { name: 'React', count: 892, color: 'cyan' },
    { name: '后端开发', count: 756, color: 'green' },
    { name: 'TypeScript', count: 645, color: 'purple' },
    { name: '算法学习', count: 534, color: 'orange' },
    { name: '设计模式', count: 423, color: 'red' },
    { name: '机器学习', count: 389, color: 'magenta' },
    { name: 'Vue', count: 312, color: 'lime' },
  ];

  // 活跃用户数据
  const activeUsers = [
    {
      id: 1,
      name: '张三',
      avatar: '',
      posts: 156,
      likes: 2341,
      level: 'LV.8',
    },
    {
      id: 2,
      name: '李四',
      avatar: '',
      posts: 134,
      likes: 1987,
      level: 'LV.7',
    },
    {
      id: 3,
      name: '王五',
      avatar: '',
      posts: 98,
      likes: 1654,
      level: 'LV.6',
    },
    {
      id: 4,
      name: '赵六',
      avatar: '',
      posts: 87,
      likes: 1432,
      level: 'LV.6',
    },
  ];

  // 讨论数据
  const discussions = [
    {
      id: 1,
      title: 'React 18 新特性深度解析',
      author: '张三',
      avatar: '',
      replies: 45,
      views: 1234,
      likes: 89,
      time: '2小时前',
      tags: ['React', '前端开发'],
      isHot: true,
    },
    {
      id: 2,
      title: 'TypeScript 类型体操实战技巧',
      author: '李四',
      avatar: '',
      replies: 32,
      views: 987,
      likes: 67,
      time: '5小时前',
      tags: ['TypeScript', '前端开发'],
      isHot: true,
    },
    {
      id: 3,
      title: '如何优雅地处理异步错误？',
      author: '王五',
      avatar: '',
      replies: 28,
      views: 756,
      likes: 54,
      time: '8小时前',
      tags: ['JavaScript', '最佳实践'],
      isHot: false,
    },
    {
      id: 4,
      title: 'Spring Boot 微服务架构设计',
      author: '赵六',
      avatar: '',
      replies: 23,
      views: 645,
      likes: 43,
      time: '1天前',
      tags: ['Spring Boot', '后端开发'],
      isHot: false,
    },
  ];

  // 快速入口
  const quickLinks = [
    {
      icon: <BookOutlined />,
      label: '浏览知识库',
      path: '/knowledge',
      color: 'blue',
    },
    {
      icon: <CompassOutlined />,
      label: '查看推荐',
      path: '/recommendations',
      color: 'green',
    },
    {
      icon: <SearchOutlined />,
      label: '搜索内容',
      path: '/search',
      color: 'orange',
    },
  ];

  return (
    <div className="community-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="community-background">
        <div className="community-blob community-blob-1" />
        <div className="community-blob community-blob-2" />
        <div className="community-blob community-blob-3" />
      </div>

      <div className="community-content container">
        {/* ===================================
            页面头部 - Page Header
            ================================== */}
        <header className="community-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <TeamOutlined />
                学习社区
              </h1>
              <p className="page-subtitle">
                与全球学习者互动交流，分享知识与经验，共同成长
              </p>
            </div>

            <div className="header-stats">
              <div className="stat-item glass-light">
                <UserOutlined className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">12,345</span>
                  <span className="stat-label">活跃用户</span>
                </div>
              </div>
              <div className="stat-item glass-light">
                <MessageOutlined className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">8,976</span>
                  <span className="stat-label">讨论话题</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================
            主要内容区域 - Main Content
            ================================== */}
        <Row gutter={[24, 24]} className="community-main">
          {/* 左侧：讨论列表 */}
          <Col xs={24} lg={16}>
            <div className="discussions-section animate-fade-in-up delay-100">
              {/* 标签页 */}
              <div className="discussions-tabs glass-light">
                <button
                  className={`tab-item ${activeTab === 'hot' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hot')}
                >
                  <FireOutlined />
                  热门讨论
                </button>
                <button
                  className={`tab-item ${activeTab === 'new' ? 'active' : ''}`}
                  onClick={() => setActiveTab('new')}
                >
                  <ClockCircleOutlined />
                  最新发布
                </button>
                <button
                  className={`tab-item ${activeTab === 'trending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('trending')}
                >
                  <TrophyOutlined />
                  热门上升
                </button>
              </div>

              {/* 讨论列表 */}
              <div className="discussions-list">
                {discussions.map((discussion, index) => (
                  <div
                    key={discussion.id}
                    className="discussion-item glass-card hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="discussion-header">
                      <Avatar
                        src={discussion.avatar}
                        icon={<UserOutlined />}
                        size={48}
                        className="author-avatar"
                      />
                      <div className="discussion-info">
                        <h3 className="discussion-title">
                          {discussion.isHot && (
                            <span className="hot-badge">
                              <FireOutlined />
                            </span>
                          )}
                          {discussion.title}
                        </h3>
                        <div className="discussion-meta">
                          <span className="author-name">
                            {discussion.author}
                          </span>
                          <span className="meta-divider">·</span>
                          <span className="discussion-time">
                            {discussion.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="discussion-tags">
                      {discussion.tags.map(tag => (
                        <Tag key={tag} className="glass-badge">
                          {tag}
                        </Tag>
                      ))}
                    </div>

                    <div className="discussion-stats">
                      <span className="stat">
                        <MessageOutlined />
                        {discussion.replies}
                      </span>
                      <span className="stat">
                        <EyeOutlined />
                        {discussion.views}
                      </span>
                      <span className="stat">
                        <HeartOutlined />
                        {discussion.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 加载更多 */}
              <div className="load-more">
                <Button
                  size="large"
                  className="glass-button hover-scale active-scale"
                >
                  加载更多讨论
                </Button>
              </div>
            </div>
          </Col>

          {/* 右侧：侧边栏 */}
          <Col xs={24} lg={8}>
            <Space
              direction="vertical"
              size="large"
              style={{ width: '100%' }}
              className="community-sidebar"
            >
              {/* 热门话题 */}
              <div className="sidebar-card glass-card animate-fade-in-up delay-200">
                <div className="card-header">
                  <h3 className="card-title">
                    <FireOutlined />
                    热门话题
                  </h3>
                </div>
                <div className="topics-list">
                  {hotTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="topic-item glass-light hover-scale"
                    >
                      <span className="topic-name">{topic.name}</span>
                      <span className="topic-count">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 活跃用户 */}
              <div className="sidebar-card glass-card animate-fade-in-up delay-300">
                <div className="card-header">
                  <h3 className="card-title">
                    <UserOutlined />
                    活跃用户
                  </h3>
                </div>
                <div className="users-list">
                  {activeUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className="user-item glass-light hover-lift"
                    >
                      <div className="user-rank">{index + 1}</div>
                      <Avatar
                        src={user.avatar}
                        icon={<UserOutlined />}
                        size={40}
                      />
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-stats">
                          <span className="user-level">{user.level}</span>
                          <span className="user-posts">{user.posts}帖</span>
                        </div>
                      </div>
                      <div className="user-likes">
                        <StarOutlined />
                        {user.likes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 快速入口 */}
              <div className="sidebar-card glass-card animate-fade-in-up delay-400">
                <div className="card-header">
                  <h3 className="card-title">
                    <CompassOutlined />
                    快速入口
                  </h3>
                </div>
                <div className="quick-links">
                  {quickLinks.map((link, index) => (
                    <button
                      key={index}
                      className="quick-link-btn glass-light hover-lift active-scale"
                      onClick={() => navigate(link.path)}
                    >
                      <div className="link-icon">{link.icon}</div>
                      <span className="link-label">{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Community;
