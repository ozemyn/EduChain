import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Space,
  Dropdown,
  message,
  Popconfirm,
  Typography,
  Card,
} from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CommentWithReplies } from '@/types';
import { formatDate } from '@/utils/format';

const { TextArea } = Input;
const { Text } = Typography;

interface CommentItemProps {
  comment: CommentWithReplies;
  currentUserId?: number;
  onReply?: (parentId: number, content: string) => Promise<void>;
  onEdit?: (commentId: number, content: string) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onLoadReplies?: (commentId: number) => Promise<void>;
  level?: number;
  maxLevel?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onLoadReplies,
  level = 0,
  maxLevel = 3,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState({
    reply: false,
    edit: false,
    delete: false,
    loadReplies: false,
  });

  const isOwner = currentUserId === comment.userId;
  const canReply = level < maxLevel;

  // 处理回复
  const handleReply = async () => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }

    setLoading(prev => ({ ...prev, reply: true }));
    try {
      await onReply?.(comment.id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
      message.success('回复成功');
    } catch {
      message.error('回复失败');
    } finally {
      setLoading(prev => ({ ...prev, reply: false }));
    }
  };

  // 处理编辑
  const handleEdit = async () => {
    if (!editContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    setLoading(prev => ({ ...prev, edit: true }));
    try {
      await onEdit?.(comment.id, editContent);
      setShowEditInput(false);
      message.success('编辑成功');
    } catch {
      message.error('编辑失败');
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  // 处理删除
  const handleDelete = async () => {
    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await onDelete?.(comment.id);
      message.success('删除成功');
    } catch {
      message.error('删除失败');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // 加载回复
  const handleLoadReplies = async () => {
    setLoading(prev => ({ ...prev, loadReplies: true }));
    try {
      await onLoadReplies?.(comment.id);
    } catch {
      message.error('加载回复失败');
    } finally {
      setLoading(prev => ({ ...prev, loadReplies: false }));
    }
  };

  // 更多操作菜单
  const menuItems: MenuProps['items'] = [];

  if (isOwner) {
    menuItems.push(
      {
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />,
        onClick: () => setShowEditInput(true),
      },
      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
      }
    );
  }

  const actions = [
    <Button
      key="reply"
      type="text"
      size="small"
      onClick={() => setShowReplyInput(!showReplyInput)}
      disabled={!canReply}
    >
      回复
    </Button>,
  ];

  if (menuItems.length > 0) {
    actions.push(
      <Dropdown
        key="more"
        menu={{
          items: menuItems
            .filter(item => item !== null)
            .map(item =>
              item!.key === 'delete'
                ? {
                    ...item!,
                    label: (
                      <Popconfirm
                        title="确定要删除这条评论吗？"
                        onConfirm={handleDelete}
                        okText="确定"
                        cancelText="取消"
                      >
                        <span>删除</span>
                      </Popconfirm>
                    ),
                  }
                : item!
            ),
        }}
        trigger={['click']}
      >
        <Button type="text" size="small" icon={<MoreOutlined />} />
      </Dropdown>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Card size="small" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar src={comment.user.avatarUrl} alt={comment.user.fullName}>
            {comment.user.fullName?.charAt(0)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <Text strong>{comment.user.fullName}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDate(comment.createdAt)}
                </Text>
              </Space>
            </div>

            <div style={{ marginBottom: 12 }}>
              {showEditInput ? (
                <div>
                  <TextArea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3}
                    placeholder="编辑评论..."
                  />
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        loading={loading.edit}
                        onClick={handleEdit}
                      >
                        保存
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setShowEditInput(false);
                          setEditContent(comment.content);
                        }}
                      >
                        取消
                      </Button>
                    </Space>
                  </div>
                </div>
              ) : (
                <Text>{comment.content}</Text>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <Space>{actions}</Space>
            </div>
            {/* 回复输入框 */}
            {showReplyInput && (
              <div style={{ marginTop: 12 }}>
                <TextArea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  rows={3}
                  placeholder={`回复 ${comment.user.fullName}...`}
                />
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      loading={loading.reply}
                      onClick={handleReply}
                    >
                      回复
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setShowReplyInput(false);
                        setReplyContent('');
                      }}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 子评论 */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: 12, marginLeft: 40 }}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLoadReplies={onLoadReplies}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}

      {/* 加载更多回复按钮 */}
      {comment.replyCount &&
        comment.replyCount > (comment.replies?.length || 0) && (
          <Button
            type="link"
            size="small"
            loading={loading.loadReplies}
            onClick={handleLoadReplies}
            style={{ padding: 0, marginTop: 8, marginLeft: 40 }}
          >
            查看更多回复 ({comment.replyCount - (comment.replies?.length || 0)}{' '}
            条)
          </Button>
        )}
    </div>
  );
};

export default CommentItem;
