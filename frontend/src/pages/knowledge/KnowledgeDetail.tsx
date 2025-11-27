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
  LikeFilled,
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
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/format';

const { Title, Paragraph, Text } = Typography;
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
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={3}>知识内容不存在</Title>
        <Button type="primary" onClick={() => navigate('/knowledge')}>
          返回知识库
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to="/knowledge">知识库</Link>
        </Breadcrumb.Item>
        {knowledge.category && (
          <Breadcrumb.Item>
            <Link to={`/knowledge?categoryId=${knowledge.category.id}`}>
              {knowledge.category.name}
            </Link>
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{knowledge.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col xs={24} lg={18}>
          {/* 主要内容 */}
          <Card>
            {/* 标题和基本信息 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={1} style={{ marginBottom: 16 }}>
                {knowledge.title}
              </Title>

              <Space wrap>
                <Space>
                  <Avatar
                    src={knowledge.uploader.avatarUrl}
                    icon={<UserOutlined />}
                  />
                  <Text strong>{knowledge.uploader.fullName}</Text>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    {formatDate(knowledge.createdAt)}
                  </Text>
                </Space>
                {knowledge.category && (
                  <Space>
                    <FolderOutlined />
                    <Link to={`/knowledge?categoryId=${knowledge.category.id}`}>
                      {knowledge.category.name}
                    </Link>
                  </Space>
                )}
                <Tag color="blue">{knowledge.type}</Tag>
              </Space>
            </div>

            <Divider />

            {/* 媒体内容 */}
            {renderMediaContent()}

            {/* 链接内容 */}
            {renderLinkContent()}

            {/* 正文内容 */}
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
              dangerouslySetInnerHTML={{ __html: knowledge.content }}
            />

            {/* 标签 */}
            {knowledge.tags && (
              <div style={{ marginBottom: 24 }}>
                <Space>
                  <TagOutlined />
                  <Text type="secondary">标签：</Text>
                  {knowledge.tags.split(',').map(tag => (
                    <Tag key={tag.trim()} color="default">
                      {tag.trim()}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            <Divider />

            {/* 操作按钮 */}
            <Space size="large">
              <Button
                type={isLiked ? 'primary' : 'default'}
                icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                loading={actionLoading === 'like'}
                onClick={handleLike}
              >
                {knowledge.stats?.likeCount || 0}
              </Button>

              <Button
                type={isFavorited ? 'primary' : 'default'}
                icon={isFavorited ? <StarFilled /> : <StarOutlined />}
                loading={actionLoading === 'favorite'}
                onClick={handleFavorite}
              >
                {knowledge.stats?.favoriteCount || 0}
              </Button>

              <Button icon={<CommentOutlined />}>
                {knowledge.stats?.commentCount || 0}
              </Button>

              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                分享
              </Button>

              {user?.id === knowledge.uploaderId && (
                <>
                  <Button icon={<EditOutlined />} onClick={handleEdit}>
                    编辑
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                  >
                    删除
                  </Button>
                </>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          {/* 侧边栏 */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 统计信息 */}
            <Card title="统计信息" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="浏览"
                    value={knowledge.stats?.viewCount || 0}
                    prefix={<EyeOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="点赞"
                    value={knowledge.stats?.likeCount || 0}
                    prefix={<LikeOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="收藏"
                    value={knowledge.stats?.favoriteCount || 0}
                    prefix={<StarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="评论"
                    value={knowledge.stats?.commentCount || 0}
                    prefix={<CommentOutlined />}
                  />
                </Col>
              </Row>
            </Card>

            {/* 作者信息 */}
            <Card title="作者信息" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Avatar
                    size={48}
                    src={knowledge.uploader.avatarUrl}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <div>
                      <Text strong>{knowledge.uploader.fullName}</Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        @{knowledge.uploader.username}
                      </Text>
                    </div>
                  </div>
                </Space>

                {knowledge.uploader.bio && (
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 3 }}
                    style={{ margin: 0 }}
                  >
                    {knowledge.uploader.bio}
                  </Paragraph>
                )}

                {knowledge.uploader.school && (
                  <Text type="secondary">
                    来自：{knowledge.uploader.school}
                  </Text>
                )}

                <Button type="primary" size="small" block>
                  关注作者
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default KnowledgeDetail;
