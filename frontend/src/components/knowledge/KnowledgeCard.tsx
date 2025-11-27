import React from 'react';
import { Card, Avatar, Tag, Space, Typography, Image, Button, Tooltip } from 'antd';
import { 
  EditOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { KnowledgeItem } from '@/types';
import { formatDate } from '@/utils/format';
import InteractionButtons from './InteractionButtons';

const { Text, Paragraph } = Typography;
const { Meta } = Card;

interface KnowledgeCardProps {
  knowledge: KnowledgeItem;
  showActions?: boolean;
  onEdit?: (knowledge: KnowledgeItem) => void;
  onDelete?: (knowledge: KnowledgeItem) => void;
  onCommentClick?: (knowledge: KnowledgeItem) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  knowledge,
  showActions = false,
  onEdit,
  onDelete,
  onCommentClick,
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      TEXT: 'blue',
      IMAGE: 'green',
      VIDEO: 'red',
      PDF: 'orange',
      LINK: 'purple',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const renderMediaPreview = () => {
    if (knowledge.type === 'IMAGE' && knowledge.mediaUrls && knowledge.mediaUrls.length > 0) {
      return (
        <div style={{ marginBottom: 12 }}>
          <Image
            width="100%"
            height={200}
            src={knowledge.mediaUrls[0]}
            style={{ objectFit: 'cover', borderRadius: 6 }}
            preview={{
              src: knowledge.mediaUrls[0],
            }}
          />
        </div>
      );
    }
    
    if (knowledge.type === 'VIDEO' && knowledge.mediaUrls && knowledge.mediaUrls.length > 0) {
      return (
        <div style={{ marginBottom: 12 }}>
          <video
            width="100%"
            height={200}
            controls
            style={{ borderRadius: 6 }}
            poster={knowledge.mediaUrls[1]} // 假设第二个URL是封面图
          >
            <source src={knowledge.mediaUrls[0]} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>
      );
    }

    return null;
  };

  const actions = [];
  
  if (showActions) {
    actions.push(
      <Tooltip title="编辑">
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit?.(knowledge)}
        />
      </Tooltip>,
      <Tooltip title="删除">
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => onDelete?.(knowledge)}
        />
      </Tooltip>
    );
  }

  return (
    <Card
      hoverable
      actions={actions.length > 0 ? actions : undefined}
      cover={renderMediaPreview()}
    >
      <Meta
        avatar={
          <Avatar 
            src={knowledge.uploader.avatarUrl} 
            alt={knowledge.uploader.fullName}
          >
            {knowledge.uploader.fullName?.charAt(0)}
          </Avatar>
        }
        title={
          <Link to={`/knowledge/${knowledge.id}`}>
            <Text strong ellipsis={{ tooltip: knowledge.title }}>
              {knowledge.title}
            </Text>
          </Link>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">
              {knowledge.uploader.fullName} · {formatDate(knowledge.createdAt)}
            </Text>
            
            <Paragraph 
              ellipsis={{ rows: 3, tooltip: knowledge.content }}
              style={{ margin: 0 }}
            >
              {knowledge.content}
            </Paragraph>
            
            <Space wrap>
              <Tag color={getTypeColor(knowledge.type)}>
                {knowledge.type}
              </Tag>
              {knowledge.category && (
                <Tag>{knowledge.category.name}</Tag>
              )}
              {knowledge.tags && knowledge.tags.split(',').map(tag => (
                <Tag key={tag.trim()} color="default">
                  {tag.trim()}
                </Tag>
              ))}
            </Space>
            
            <div onClick={(e) => e.preventDefault()}>
              <InteractionButtons
                knowledgeId={knowledge.id}
                initialStats={knowledge.stats ? {
                  knowledgeId: knowledge.id,
                  likeCount: knowledge.stats.likeCount,
                  favoriteCount: knowledge.stats.favoriteCount,
                  viewCount: knowledge.stats.viewCount,
                  commentCount: knowledge.stats.commentCount,
                } : undefined}
                size="small"
                onCommentClick={() => onCommentClick?.(knowledge)}
              />
            </div>
          </Space>
        }
      />
    </Card>
  );
};

export default KnowledgeCard;