/* ===================================
   知识详情页面组件 - Knowledge Detail Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 内容展示和交互
   - 统计数据可视化
   - 高性能优化
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Avatar,
  Tag,
  Spin,
  message,
  Statistic,
  Space,
  Breadcrumb,
  Modal,
} from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  CommentOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/format';
import BlockchainCertInfo from '@/components/blockchain/BlockchainCertInfo';
import './KnowledgeDetail.css';

const { confirm } = Modal;

/**
 * 知识详情页面组件
 */
const KnowledgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 加载知识详情
  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await knowledgeService.getKnowledgeById(Number(id));

        if (response.success && response.data) {
          setKnowledge(response.data);
          // TODO: 加载用户的点赞和收藏状态
        } else {
          message.error('内容不存在');
          navigate('/knowledge');
        }
      } catch (error) {
        console.error('Failed to load knowledge detail:', error);
        message.error('加载失败');
        navigate('/knowledge');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id, navigate]);

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (!knowledge) return;

    try {
      setActionLoading(true);
      // TODO: 调用点赞 API
      setIsLiked(!isLiked);
      message.success(isLiked ? '已取消点赞' : '点赞成功');
    } catch (error) {
      console.error('Like failed:', error);
      message.error('操作失败');
    } finally {
      setActionLoading(false);
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
      setActionLoading(true);
      // TODO: 调用收藏 API
      setIsFavorited(!isFavorited);
      message.success(isFavorited ? '已取消收藏' : '收藏成功');
    } catch (error) {
      console.error('Favorite failed:', error);
      message.error('操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 处理分享
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      message.success('链接已复制到剪贴板');
    } else {
      message.info('请手动复制链接');
    }
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
      content: `确定要删除知识内容"${knowledge.title}"吗？此操作不可恢复。`,
      okText: '确定删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
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

  // 加载状态
  if (loading) {
    return (
      <div className="detail-loading animate-fade-in">
        <div className="loading-card glass-card">
          <Spin size="large" />
          <p>加载内容中...</p>
        </div>
      </div>
    );
  }

  // 内容不存在
  if (!knowledge) {
    return (
      <div className="detail-error animate-fade-in">
        <div className="error-card glass-card">
          <h3>内容不存在</h3>
          <p>您访问的内容可能已被删除或不存在</p>
          <Button
            onClick={() => navigate('/knowledge')}
            className="glass-button glass-strong hover-lift active-scale"
            size="large"
          >
            返回知识库
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === knowledge.uploaderId;

  return (
    <div className="knowledge-detail-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="detail-background">
        <div className="detail-blob detail-blob-1" />
        <div className="detail-blob detail-blob-2" />
      </div>

      <div className="detail-content container">
        {/* ===================================
            面包屑导航 - Breadcrumb
            ================================== */}
        <div className="detail-breadcrumb glass-light animate-fade-in-up">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/knowledge" className="breadcrumb-link hover-scale">
                    知识库
                  </Link>
                ),
              },
              {
                title: (
                  <span className="breadcrumb-current">{knowledge.title}</span>
                ),
              },
            ]}
          />
        </div>

        <div className="detail-layout">
          {/* ===================================
              主要内容区域 - Main Content
              ================================== */}
          <main className="detail-main">
            <article className="detail-article glass-card animate-fade-in-up delay-100">
              {/* 文章头部 */}
              <header className="article-header">
                <h1 className="article-title">{knowledge.title}</h1>

                <div className="article-meta">
                  <div className="meta-author">
                    <Avatar
                      src={knowledge.uploaderAvatar || undefined}
                      icon={<UserOutlined />}
                      size={40}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <span className="author-name">
                        {knowledge.uploaderName}
                      </span>
                      <div className="meta-details">
                        <span className="meta-item">
                          <CalendarOutlined />
                          {formatDate(knowledge.createdAt)}
                        </span>
                        {knowledge.updatedAt !== knowledge.createdAt && (
                          <span className="meta-item">
                            <ClockCircleOutlined />
                            更新于 {formatDate(knowledge.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="meta-tags">
                    <Tag color="blue" className="type-tag">
                      {knowledge.type}
                    </Tag>
                  </div>
                </div>
              </header>

              {/* 文章内容 */}
              <div className="article-body">
                {knowledge.content.split('\n').map((paragraph, index) => {
                  // 跳过空行
                  if (!paragraph.trim()) {
                    return <br key={index} />;
                  }
                  return (
                    <p key={index} style={{ marginBottom: '1em' }}>
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* 标签 */}
              {knowledge.tags && (
                <div className="article-tags">
                  {knowledge.tags.split(',').map(tag => (
                    <Tag
                      key={tag}
                      className="glass-badge hover-scale active-scale"
                    >
                      {tag.trim()}
                    </Tag>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="article-actions">
                <Space size="middle" wrap>
                  <Button
                    icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleLike}
                    loading={actionLoading}
                    className={`glass-button hover-lift active-scale ${
                      isLiked ? 'liked' : ''
                    }`}
                    size="large"
                  >
                    {knowledge.stats?.likeCount || 0}
                  </Button>

                  <Button
                    icon={isFavorited ? <StarFilled /> : <StarOutlined />}
                    onClick={handleFavorite}
                    loading={actionLoading}
                    className={`glass-button hover-lift active-scale ${
                      isFavorited ? 'favorited' : ''
                    }`}
                    size="large"
                  >
                    {knowledge.stats?.favoriteCount || 0}
                  </Button>

                  <Button
                    icon={<CommentOutlined />}
                    className="glass-button hover-lift active-scale"
                    size="large"
                  >
                    {knowledge.stats?.commentCount || 0}
                  </Button>

                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                    className="glass-button hover-lift active-scale"
                    size="large"
                  >
                    分享
                  </Button>

                  {isAuthor && (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                        className="glass-button hover-scale active-scale"
                        size="large"
                      >
                        编辑
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        className="glass-button hover-scale active-scale"
                        size="large"
                      >
                        删除
                      </Button>
                    </>
                  )}
                </Space>
              </div>
            </article>

            {/* 返回按钮 */}
            <div className="detail-back animate-fade-in-up delay-200">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/knowledge')}
                className="glass-button hover-scale active-scale"
                size="large"
              >
                返回知识库
              </Button>
            </div>
          </main>

          {/* ===================================
              侧边栏 - Sidebar
              ================================== */}
          <aside className="detail-sidebar animate-fade-in-up delay-200">
            {/* 作者信息 */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">作者信息</h3>
              <div className="author-card glass-light">
                <Avatar
                  src={knowledge.uploaderAvatar || undefined}
                  icon={<UserOutlined />}
                  size={64}
                  className="author-avatar-large"
                />
                <h4 className="author-name-large">{knowledge.uploaderName}</h4>
                <p className="author-bio">分享知识，传播智慧</p>
                <Button
                  type="primary"
                  className="glass-button glass-strong hover-lift active-scale"
                  block
                >
                  关注作者
                </Button>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">统计信息</h3>
              <div className="stats-grid">
                <div className="stat-item glass-light hover-lift">
                  <Statistic
                    title="浏览量"
                    value={knowledge.stats?.viewCount || 0}
                    prefix={<EyeOutlined />}
                  />
                </div>
                <div className="stat-item glass-light hover-lift">
                  <Statistic
                    title="点赞数"
                    value={knowledge.stats?.likeCount || 0}
                    prefix={<LikeOutlined />}
                  />
                </div>
                <div className="stat-item glass-light hover-lift">
                  <Statistic
                    title="收藏数"
                    value={knowledge.stats?.favoriteCount || 0}
                    prefix={<StarOutlined />}
                  />
                </div>
                <div className="stat-item glass-light hover-lift">
                  <Statistic
                    title="评论数"
                    value={knowledge.stats?.commentCount || 0}
                    prefix={<CommentOutlined />}
                  />
                </div>
              </div>
            </div>

            {/* 区块链存证信息 */}
            <BlockchainCertInfo
              knowledgeId={knowledge.id}
              knowledgeTitle={knowledge.title}
              userId={knowledge.uploaderId}
              userName={knowledge.uploaderName || '未知用户'}
              contentHash={knowledge.contentHash}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetail;
