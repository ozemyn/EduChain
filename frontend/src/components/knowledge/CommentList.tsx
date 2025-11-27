import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Space, 
  Divider, 
  Empty, 
  Spin, 
  message,
  Pagination,
  Typography 
} from 'antd';
import { CommentOutlined, SendOutlined } from '@ant-design/icons';
import { interactionService } from '@/services';
import type { CommentWithReplies, CreateCommentRequest } from '@/types';
import CommentItem from './CommentItem';
import { useAuth } from '@/contexts/AuthContext';

const { TextArea } = Input;
const { Title } = Typography;

interface CommentListProps {
  knowledgeId: number;
  onCommentCountChange?: (count: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  knowledgeId,
  onCommentCountChange,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取评论列表
  const fetchComments = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await interactionService.getComments(knowledgeId, {
        page: page - 1, // 后端从0开始
        size,
      });
      
      setComments(response.data.content);
      setPagination({
        current: page,
        pageSize: size,
        total: response.data.totalElements,
      });
      
      onCommentCountChange?.(response.data.totalElements);
    } catch (error) {
      message.error('获取评论失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [knowledgeId]);

  // 提交新评论
  const handleSubmitComment = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    if (!newComment.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setSubmitting(true);
    try {
      const commentData: CreateCommentRequest = {
        knowledgeId,
        content: newComment.trim(),
      };

      await interactionService.createComment(commentData);
      setNewComment('');
      message.success('评论成功');
      
      // 重新获取评论列表
      await fetchComments(1, pagination.pageSize);
    } catch (error) {
      message.error('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理回复
  const handleReply = async (parentId: number, content: string) => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    const commentData: CreateCommentRequest = {
      knowledgeId,
      content: content.trim(),
      parentId,
    };

    await interactionService.createComment(commentData);
    
    // 重新获取评论列表
    await fetchComments(pagination.current, pagination.pageSize);
  };

  // 处理编辑
  const handleEdit = async (commentId: number, content: string) => {
    await interactionService.updateComment(commentId, content);
    
    // 更新本地评论内容
    const updateCommentContent = (comments: CommentWithReplies[]): CommentWithReplies[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentContent(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(updateCommentContent(comments));
  };

  // 处理删除
  const handleDelete = async (commentId: number) => {
    await interactionService.deleteComment(commentId);
    
    // 重新获取评论列表
    await fetchComments(pagination.current, pagination.pageSize);
  };

  // 加载回复
  const handleLoadReplies = async (commentId: number) => {
    try {
      const response = await interactionService.getCommentReplies(commentId, {
        page: 0,
        size: 20,
      });

      // 更新评论的回复列表
      const updateCommentReplies = (comments: CommentWithReplies[]): CommentWithReplies[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: response.data.content,
            };
          }
          return comment;
        });
      };

      setComments(updateCommentReplies(comments));
    } catch (error) {
      throw error;
    }
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    fetchComments(page, pageSize || pagination.pageSize);
  };

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>
          <CommentOutlined /> 评论 ({pagination.total})
        </Title>
      </div>

      {/* 评论输入框 */}
      {user ? (
        <div style={{ marginBottom: 24 }}>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            rows={4}
            maxLength={1000}
            showCount
          />
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => setNewComment('')}
                disabled={!newComment.trim()}
              >
                清空
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={submitting}
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                发表评论
              </Button>
            </Space>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 24, textAlign: 'center', padding: 24 }}>
          <Empty
            description="请登录后发表评论"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}

      <Divider />

      {/* 评论列表 */}
      <Spin spinning={loading}>
        {comments.length > 0 ? (
          <div>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLoadReplies={handleLoadReplies}
              />
            ))}

            {/* 分页 */}
            {pagination.total > pagination.pageSize && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条评论`
                  }
                />
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <Empty
              description="暂无评论"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        )}
      </Spin>
    </Card>
  );
};

export default CommentList;