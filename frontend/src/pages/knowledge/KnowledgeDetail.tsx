import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Button,
  Avatar,
  Tag,
  Divider,
  Image,
  Spin,
  message,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Modal,
} from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  StarFilled,
  CommentOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  FolderOutlined,
  BookOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/format';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Title, Text } = Typography;
const { confirm } = Modal;

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 加载知识详情
  const loadKnowledgeDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await knowledgeService.getKnowledgeById(Number(id));

      if (response.success && response.data) {
        setKnowledge(response.data);
        // TODO: 检查用户是否已点赞/收藏
        // setIsLiked(response.data.isLiked);
        // setIsFavorited(response.data.isFavorited);
      }
    } catch (error) {
      console.error('Failed to load knowledge detail:', error);
      message.error('加载知识详情失败');
      navigate('/knowledge');
    } finally {
      setLoading(false);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (!knowledge) return;

    try {
      setActionLoading('like');
      // 调用点赞/取消点赞API
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      // 更新统计数据
      if (knowledge.stats) {
        knowledge.stats.likeCount += newLikedState ? 1 : -1;
      }

      message.success(newLikedState ? '点赞成功' : '取消点赞');
    } catch (error) {
      console.error('Like action failed:', error);
      message.error('操作失败');
      setIsLiked(!isLiked); // 回滚状态
    } finally {
      setActionLoading(null);
    }
  };

  // 处理收藏
  const handleFavorite = async () => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (!knowledge) return;

    try {
      setActionLoading('favorite');
      // 调用收藏/取消收藏API
      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);

      // 更新统计数据
      if (knowledge.stats) {
        knowledge.stats.favoriteCount += newFavoritedState ? 1 : -1;
      }

      message.success(newFavoritedState ? '收藏成功' : '取消收藏');
    } catch (error) {
      console.error('Favorite action failed:', error);
      message.error('操作失败');
      setIsFavorited(!isFavorited); // 回滚状态
    } finally {
      setActionLoading(null);
    }
  };

  // 处理分享
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败');
      });
  };

  // 处理编辑
  const handleEdit = () => {
    if (knowledge) {
      navigate(`/knowledge/edit/${knowledge.id}`);
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (!knowledge) return;

    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除知识内容"${knowledge.title}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await knowledgeService.deleteKnowledge(knowledge.id);
          message.success('删除成功');
          navigate('/knowledge');
        } catch (error) {
          console.error('Delete failed:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 渲染媒体内容
  const renderMediaContent = () => {
    if (!knowledge?.mediaUrls || knowledge.mediaUrls.length === 0) {
      return null;
    }

    if (knowledge.type === 'IMAGE') {
      return (
        <div style={{ marginBottom: 24 }}>
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              {knowledge.mediaUrls.map((url, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Image
                    src={url}
                    alt={`image-${index}`}
                    style={{ width: '100%', borderRadius: 6 }}
                  />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </div>
      );
    }

    if (knowledge.type === 'VIDEO') {
      return (
        <div style={{ marginBottom: 24 }}>
          {knowledge.mediaUrls.map((url, index) => (
            <video
              key={index}
              width="100%"
              controls
              style={{ borderRadius: 6, marginBottom: 8 }}
            >
              <source src={url} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
          ))}
        </div>
      );
    }

    return null;
  };

  // 渲染链接内容
  const renderLinkContent = () => {
    if (knowledge?.type === 'LINK' && knowledge.linkUrl) {
      return (
        <Card size="small" style={{ marginBottom: 24 }}>
          <Space>
            <Text strong>相关链接：</Text>
            <a
              href={knowledge.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {knowledge.linkUrl}
            </a>
          </Space>
        </Card>
      );
    }
    return null;
  };

  useEffect(() => {
    loadKnowledgeDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="knowledge-detail-loading animate-fade-in">
        <div className="glass-card loading-card">
          <Spin size="large" />
          <p className="loading-text">加载知识内容中...</p>
        </div>
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="knowledge-detail-error animate-fade-in">
        <div className="glass-card error-card">
          <BookOutlined className="error-icon" />
          <Title level={3} className="error-title">
            知识内容不存在
          </Title>
          <p className="error-description">该内容可能已被删除或不存在</p>
          <Button
            type="primary"
            size="large"
            className="glass-button glass-strong hover-lift active-scale"
            onClick={() => navigate('/knowledge')}
          >
            返回知识库
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-detail-container animate-fade-in">
      {/* 背景装饰 */}
      <div className="detail-background">
        <div className="detail-blob detail-blob-1" />
        <div className="detail-blob detail-blob-2" />
      </div>

      <div className="detail-content">
        {/* 面包屑导航 */}
        <div className="detail-breadcrumb glass-light animate-fade-in-up">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/knowledge" className="breadcrumb-link hover-scale">
                知识库
              </Link>
            </Breadcrumb.Item>
            {knowledge.category && (
              <Breadcrumb.Item>
                <Link
                  to={`/knowledge?categoryId=${knowledge.category.id}`}
                  className="breadcrumb-link hover-scale"
                >
                  {knowledge.category.name}
                </Link>
              </Breadcrumb.Item>
            )}
            <Breadcrumb.Item className="breadcrumb-current">
              {knowledge.title}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            {/* 主要内容 */}
            <div className="detail-main-card glass-card animate-fade-in-up delay-100">
              {/* 标题和基本信息 */}
              <div className="detail-header">
                <h1 className="detail-title">{knowledge.title}</h1>

                <div className="detail-meta">
                  <div className="author-info glass-light hover-lift">
                    <Avatar
                      size={48}
                      src={knowledge.uploaderAvatar || undefined}
                      icon={<UserOutlined />}
                      className="author-avatar"
                    />
                    <div className="author-details">
                      <Text strong className="author-name">
                        {knowledge.uploaderName || `用户 ${knowledge.uploaderId}`}
                      </Text>
                      <Text type="secondary" className="author-username">
                        @{knowledge.uploaderId}
                      </Text>
                    </div>
                  </div>

                  <div className="meta-info">
                    <Space wrap className="meta-items">
                      <div className="meta-item">
                        <CalendarOutlined />
                        <Text type="secondary">
                          {formatDate(knowledge.createdAt)}
                        </Text>
                      </div>
                      {knowledge.category && (
                        <div className="meta-item">
                          <FolderOutlined />
                          <Link
                            to={`/knowledge?categoryId=${knowledge.category.id}`}
                            className="category-link hover-scale"
                          >
                            {knowledge.category.name}
                          </Link>
                        </div>
                      )}
                      <Tag color="blue" className="type-tag glass-badge">
                        {knowledge.type}
                      </Tag>
                    </Space>
                  </div>
                </div>
              </div>

              <Divider className="detail-divider" />

              {/* 媒体内容 */}
              <div className="media-content">{renderMediaContent()}</div>

              {/* 链接内容 */}
              <div className="link-content">{renderLinkContent()}</div>

              {/* 正文内容 */}
              <div
                className="detail-content-body"
                dangerouslySetInnerHTML={{ __html: knowledge.content }}
              />

              {/* 标签 */}
              {knowledge.tags && (
                <div className="detail-tags">
                  <div className="tags-header">
                    <TagOutlined />
                    <Text type="secondary">标签</Text>
                  </div>
                  <div className="tags-list">
                    {knowledge.tags.split(',').map(tag => (
                      <Tag
                        key={tag.trim()}
                        className="content-tag glass-badge hover-scale"
                      >
                        {tag.trim()}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <Divider className="detail-divider" />

              {/* 操作按钮 */}
              <div className="detail-actions">
                <div className="action-buttons">
                  <Button
                    type={isLiked ? 'primary' : 'default'}
                    icon={isLiked ? <HeartOutlined /> : <LikeOutlined />}
                    loading={actionLoading === 'like'}
                    onClick={handleLike}
                    className={`glass-button hover-lift active-scale ${isLiked ? 'liked' : ''}`}
                  >
                    {knowledge.stats?.likeCount || 0}
                  </Button>

                  <Button
                    type={isFavorited ? 'primary' : 'default'}
                    icon={isFavorited ? <StarFilled /> : <StarOutlined />}
                    loading={actionLoading === 'favorite'}
                    onClick={handleFavorite}
                    className={`glass-button hover-lift active-scale ${isFavorited ? 'favorited' : ''}`}
                  >
                    {knowledge.stats?.favoriteCount || 0}
                  </Button>

                  <Button
                    icon={<CommentOutlined />}
                    className="glass-button hover-lift active-scale"
                  >
                    {knowledge.stats?.commentCount || 0}
                  </Button>

                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                    className="glass-button hover-lift active-scale"
                  >
                    分享
                  </Button>
                </div>

                {user?.id === knowledge.uploaderId && (
                  <div className="owner-actions">
                    <Button
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      className="glass-button hover-scale active-scale"
                    >
                      编辑
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleDelete}
                      className="glass-button hover-scale active-scale danger-button"
                    >
                      删除
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={6}>
            {/* 侧边栏 */}
            <div className="detail-sidebar animate-fade-in-up delay-200">
              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                {/* 统计信息 */}
                <div className="sidebar-card glass-card">
                  <div className="sidebar-header">
                    <h3 className="sidebar-title">
                      <EyeOutlined />
                      统计信息
                    </h3>
                  </div>
                  <Row gutter={[16, 16]} className="stats-grid">
                    <Col span={12}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="浏览"
                          value={knowledge.stats?.viewCount || 0}
                          prefix={<EyeOutlined />}
                          valueStyle={{ color: 'var(--accent-info)' }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="点赞"
                          value={knowledge.stats?.likeCount || 0}
                          prefix={<LikeOutlined />}
                          valueStyle={{ color: 'var(--accent-error)' }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="收藏"
                          value={knowledge.stats?.favoriteCount || 0}
                          prefix={<StarOutlined />}
                          valueStyle={{ color: 'var(--accent-warning)' }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="stat-item glass-light hover-lift">
                        <Statistic
                          title="评论"
                          value={knowledge.stats?.commentCount || 0}
                          prefix={<CommentOutlined />}
                          valueStyle={{ color: 'var(--accent-success)' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* 作者信息 */}
                <div className="sidebar-card glass-card">
                  <div className="sidebar-header">
                    <h3 className="sidebar-title">
                      <UserOutlined />
                      作者信息
                    </h3>
                  </div>

                  <div className="author-card glass-light">
                    <div className="author-profile">
                      <Avatar
                        size={64}
                        src={knowledge.uploaderAvatar || undefined}
                        icon={<UserOutlined />}
                        className="profile-avatar"
                      />
                      <div className="profile-info">
                        <Text strong className="profile-name">
                          {knowledge.uploaderName || `用户 ${knowledge.uploaderId}`}
                        </Text>
                        <Text type="secondary" className="profile-username">
                          @{knowledge.uploaderId}
                        </Text>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      block
                      className="glass-button glass-strong hover-lift active-scale follow-button"
                    >
                      关注作者
                    </Button>
                  </div>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        /* ===== 知识详情页面样式 ===== */
        .knowledge-detail-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        /* 加载和错误状态 */
        .knowledge-detail-loading,
        .knowledge-detail-error {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }

        .loading-card,
        .error-card {
          text-align: center;
          padding: var(--spacing-3xl);
          border-radius: var(--liquid-border-radius-lg);
          max-width: 400px;
        }

        .loading-text {
          margin-top: var(--spacing-lg);
          color: var(--text-secondary);
        }

        .error-icon {
          font-size: 4rem;
          color: var(--text-quaternary);
          margin-bottom: var(--spacing-lg);
        }

        .error-title {
          color: var(--text-primary);
          margin-bottom: var(--spacing-md) !important;
        }

        .error-description {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
        }

        /* 背景装饰 */
        .detail-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }

        .detail-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: var(--blur-2xl);
          animation: float 10s ease-in-out infinite;
        }

        .detail-blob-1 {
          top: 10%;
          right: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .detail-blob-2 {
          bottom: 20%;
          left: 10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--accent-success) 0%, transparent 70%);
          animation-delay: 5s;
        }

        /* 主要内容 */
        .detail-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg);
        }

        .detail-breadcrumb {
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--liquid-border-radius);
          margin-bottom: var(--spacing-xl);
        }

        .breadcrumb-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast) var(--ease-ios);
        }

        .breadcrumb-link:hover {
          color: var(--accent-primary);
        }

        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 500;
        }

        /* 主卡片 */
        .detail-main-card {
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-lg);
          margin-bottom: var(--spacing-xl);
        }

        /* 详情头部 */
        .detail-header {
          margin-bottom: var(--spacing-2xl);
        }

        .detail-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xl);
          line-height: 1.2;
        }

        .detail-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--liquid-border-radius);
          transition: all var(--transition-fast) var(--ease-ios);
          width: fit-content;
        }

        .author-avatar {
          border: 2px solid var(--glass-border);
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .author-username {
          font-size: 0.875rem;
        }

        .meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .meta-items {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
        }

        .category-link {
          color: var(--accent-primary);
          text-decoration: none;
          transition: color var(--transition-fast) var(--ease-ios);
        }

        .category-link:hover {
          color: var(--accent-secondary);
        }

        .type-tag {
          font-weight: 500;
        }

        /* 内容区域 */
        .detail-divider {
          margin: var(--spacing-2xl) 0;
          border-color: var(--border-light);
        }

        .media-content,
        .link-content {
          margin-bottom: var(--spacing-xl);
        }

        .detail-content-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2xl);
        }

        .detail-content-body img {
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
        }

        /* 标签区域 */
        .detail-tags {
          margin-bottom: var(--spacing-2xl);
        }

        .tags-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .content-tag {
          font-size: 0.875rem;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        /* 操作按钮 */
        .detail-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .owner-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .liked {
          background: linear-gradient(135deg, var(--accent-error), #f56565) !important;
          color: white !important;
        }

        .favorited {
          background: linear-gradient(135deg, var(--accent-warning), #ed8936) !important;
          color: white !important;
        }

        .danger-button {
          background: linear-gradient(135deg, var(--accent-error), #f56565) !important;
          color: white !important;
        }

        /* 侧边栏 */
        .detail-sidebar {
          position: sticky;
          top: var(--spacing-lg);
        }

        .sidebar-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
          margin-bottom: var(--spacing-lg);
        }

        .sidebar-header {
          margin-bottom: var(--spacing-lg);
        }

        .sidebar-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* 统计网格 */
        .stats-grid {
          margin: 0;
        }

        .stat-item {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          text-align: center;
          transition: all var(--transition-fast) var(--ease-ios);
        }

        /* 作者卡片 */
        .author-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }

        .author-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .profile-avatar {
          border: 2px solid var(--glass-border);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .profile-username {
          font-size: 0.875rem;
        }

        .profile-bio {
          margin: var(--spacing-md) 0 !important;
          color: var(--text-secondary);
        }

        .profile-school {
          display: block;
          margin-bottom: var(--spacing-md);
          font-size: 0.875rem;
        }

        .follow-button {
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600)) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .detail-sidebar {
            position: static;
            margin-top: var(--spacing-xl);
          }
        }

        @media (max-width: 768px) {
          .detail-content {
            padding: var(--spacing-md);
          }

          .detail-main-card {
            padding: var(--spacing-xl);
          }

          .detail-title {
            font-size: 1.875rem;
          }

          .detail-meta {
            gap: var(--spacing-md);
          }

          .author-info {
            width: 100%;
          }

          .detail-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .action-buttons,
          .owner-actions {
            justify-content: center;
          }

          .sidebar-card {
            padding: var(--spacing-lg);
          }
        }

        @media (max-width: 640px) {
          .detail-title {
            font-size: 1.5rem;
          }

          .detail-content-body {
            font-size: 1rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .glass-button {
            width: 100%;
            justify-content: center;
          }

          .detail-blob {
            display: none;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .knowledge-detail-container,
          .detail-main-card,
          .detail-sidebar,
          .detail-blob,
          .author-info,
          .stat-item {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeDetail;
