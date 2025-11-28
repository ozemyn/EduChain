import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  message,
  Breadcrumb,
  Row,
  Col,
  Divider,
  Modal,
  List,
  Progress,
  Badge,
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  EyeOutlined,
  HistoryOutlined,
  DeleteOutlined,
  FileTextOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  RichTextEditor,
  MediaUpload,
  CategorySelector,
  TagSelector,
} from '@/components/knowledge';
import type { KnowledgeItem, CreateKnowledgeRequest } from '@/types';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface FormValues extends CreateKnowledgeRequest {
  isDraft?: boolean;
}

interface DraftVersion {
  id: string;
  title: string;
  content: string;
  savedAt: string;
  autoSaved: boolean;
}

const CreateKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [form] = Form.useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [drafts, setDrafts] = useState<DraftVersion[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  const isEditing = !!id;
  const pageTitle = isEditing ? '编辑内容' : '发布内容';

  const contentTypes = [
    { label: '文本', value: 'TEXT' },
    { label: '图片', value: 'IMAGE' },
    { label: '视频', value: 'VIDEO' },
    { label: 'PDF文档', value: 'PDF' },
    { label: '外部链接', value: 'LINK' },
  ];

  // 加载知识详情（编辑模式）
  const loadKnowledgeDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await knowledgeService.getKnowledgeById(Number(id));

      if (response.success && response.data) {
        const data = response.data;
        setKnowledge(data);

        // 设置表单值
        form.setFieldsValue({
          title: data.title,
          content: data.content,
          type: data.type,
          categoryId: data.categoryId,
          mediaUrls: data.mediaUrls || [],
          linkUrl: data.linkUrl,
          tags: data.tags,
        });
      }
    } catch (error) {
      console.error('Failed to load knowledge detail:', error);
      message.error('加载内容失败');
      navigate('/knowledge');
    } finally {
      setLoading(false);
    }
  };

  // 自动保存草稿
  const autoSaveDraft = () => {
    const values = form.getFieldsValue();
    if (!values.title && !values.content) return;

    const draft: DraftVersion = {
      id: Date.now().toString(),
      title: values.title || '未命名草稿',
      content: values.content || '',
      savedAt: new Date().toISOString(),
      autoSaved: true,
    };

    const existingDrafts = JSON.parse(
      localStorage.getItem('knowledge_drafts') || '[]'
    );
    const newDrafts = [draft, ...existingDrafts.slice(0, 9)]; // 保留最新10个草稿
    localStorage.setItem('knowledge_drafts', JSON.stringify(newDrafts));
    setDrafts(newDrafts);
  };

  // 手动保存草稿
  const saveDraft = async () => {
    try {
      setSaving(true);
      const values = form.getFieldsValue();

      const draft: DraftVersion = {
        id: Date.now().toString(),
        title: values.title || '未命名草稿',
        content: values.content || '',
        savedAt: new Date().toISOString(),
        autoSaved: false,
      };

      const existingDrafts = JSON.parse(
        localStorage.getItem('knowledge_drafts') || '[]'
      );
      const newDrafts = [draft, ...existingDrafts.slice(0, 9)];
      localStorage.setItem('knowledge_drafts', JSON.stringify(newDrafts));
      setDrafts(newDrafts);

      message.success('草稿保存成功');
    } catch (error) {
      console.error('Save draft failed:', error);
      message.error('保存草稿失败');
    } finally {
      setSaving(false);
    }
  };

  // 加载草稿
  const loadDraft = (draft: DraftVersion) => {
    form.setFieldsValue({
      title: draft.title,
      content: draft.content,
    });
    setShowDrafts(false);
    message.success('草稿加载成功');
  };

  // 删除草稿
  const deleteDraft = (draftId: string) => {
    const existingDrafts = JSON.parse(
      localStorage.getItem('knowledge_drafts') || '[]'
    );
    const newDrafts = existingDrafts.filter(
      (d: DraftVersion) => d.id !== draftId
    );
    localStorage.setItem('knowledge_drafts', JSON.stringify(newDrafts));
    setDrafts(newDrafts);
    message.success('草稿删除成功');
  };

  // 提交表单
  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const submitData: CreateKnowledgeRequest = {
        title: values.title,
        content: values.content,
        type: values.type,
        categoryId: values.categoryId,
        mediaUrls: values.mediaUrls,
        linkUrl: values.linkUrl,
        tags: values.tags,
      };

      if (isEditing && knowledge) {
        await knowledgeService.updateKnowledge(knowledge.id, submitData);
        message.success('更新成功');
      } else {
        await knowledgeService.createKnowledge(submitData);
        message.success('发布成功');
      }

      // 清除草稿
      localStorage.removeItem('knowledge_drafts');

      navigate('/knowledge');
    } catch (error) {
      console.error('Submit failed:', error);
      message.error(isEditing ? '更新失败' : '发布失败');
    } finally {
      setLoading(false);
    }
  };

  // 预览
  const handlePreview = () => {
    const values = form.getFieldsValue();
    Modal.info({
      title: '内容预览',
      width: 800,
      content: (
        <div>
          <Title level={3}>{values.title || '未命名'}</Title>
          <div dangerouslySetInnerHTML={{ __html: values.content || '' }} />
        </div>
      ),
    });
  };

  useEffect(() => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (isEditing) {
      loadKnowledgeDetail();
    }

    // 加载草稿列表
    const savedDrafts = JSON.parse(
      localStorage.getItem('knowledge_drafts') || '[]'
    );
    setDrafts(savedDrafts);

    // 设置自动保存
    const timer = setInterval(autoSaveDraft, 30000); // 30秒自动保存

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  if (loading) {
    return (
      <div className="create-loading animate-fade-in">
        <div className="glass-card">
          <div className="loading-content">
            <div className="loading-spinner animate-spin"></div>
            <p>加载内容中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-knowledge-container animate-fade-in">
      {/* 背景装饰 */}
      <div className="create-background">
        <div className="create-blob create-blob-1" />
        <div className="create-blob create-blob-2" />
        <div className="create-blob create-blob-3" />
      </div>

      {/* 页面头部 */}
      <section className="create-header glass-light animate-fade-in-up">
        <div className="create-header-content">
          <div className="create-breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/knowledge" className="breadcrumb-link hover-scale">
                  知识库
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-current">
                {pageTitle}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          
          <div className="create-title-section">
            <h1 className="create-title gradient-text">
              <FileTextOutlined />
              {pageTitle}
            </h1>
            <p className="create-subtitle">
              {isEditing ? '完善您的知识内容，让更多人受益' : '分享您的知识，让智慧传播'}
            </p>
          </div>

          {/* 进度指示器 */}
          <div className="create-progress glass-medium">
            <div className="progress-item">
              <CheckCircleOutlined className="progress-icon completed" />
              <span>基本信息</span>
            </div>
            <div className="progress-line" />
            <div className="progress-item">
              <ClockCircleOutlined className="progress-icon current" />
              <span>内容编辑</span>
            </div>
            <div className="progress-line" />
            <div className="progress-item">
              <SendOutlined className="progress-icon" />
              <span>发布完成</span>
            </div>
          </div>
        </div>
      </section>

      <div className="create-content animate-fade-in-up delay-100">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <div className="create-main-card glass-card">
              <div className="create-form-header">
                <h2 className="form-title">
                  <BulbOutlined />
                  内容编辑
                </h2>
                <div className="form-badges">
                  <Badge 
                    count={drafts.length} 
                    className="glass-badge"
                    title={`${drafts.length} 个草稿`}
                  >
                    <Button 
                      className="glass-button hover-scale active-scale"
                      icon={<HistoryOutlined />}
                      onClick={() => setShowDrafts(true)}
                    >
                      草稿历史
                    </Button>
                  </Badge>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  type: 'TEXT',
                  isDraft: false,
                }}
                className="create-form"
              >
              {/* 标题 */}
              <Form.Item
                name="title"
                label={<span className="form-label">标题</span>}
                rules={[
                  { required: true, message: '请输入标题' },
                  { max: 100, message: '标题不能超过100个字符' },
                ]}
              >
                <Input 
                  placeholder="请输入知识内容标题" 
                  size="large" 
                  className="create-input"
                  prefix={<FileTextOutlined />}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  {/* 内容类型 */}
                  <Form.Item
                    name="type"
                    label={<span className="form-label">内容类型</span>}
                    rules={[{ required: true, message: '请选择内容类型' }]}
                  >
                    <Select 
                      placeholder="选择内容类型" 
                      className="create-select"
                      size="large"
                    >
                      {contentTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  {/* 分类 */}
                  <Form.Item 
                    name="categoryId" 
                    label={<span className="form-label">分类</span>}
                  >
                    <CategorySelector
                      placeholder="选择分类（可选）"
                      allowClear
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* 外部链接 */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.type !== currentValues.type
                }
              >
                {({ getFieldValue }) => {
                  const type = getFieldValue('type');
                  return type === 'LINK' ? (
                    <Form.Item
                      name="linkUrl"
                      label={<span className="form-label">链接地址</span>}
                      rules={[
                        { required: true, message: '请输入链接地址' },
                        { type: 'url', message: '请输入有效的URL地址' },
                      ]}
                    >
                      <Input 
                        placeholder="https://example.com" 
                        className="create-input"
                        size="large"
                      />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>

              {/* 多媒体文件 */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.type !== currentValues.type
                }
              >
                {({ getFieldValue }) => {
                  const type = getFieldValue('type');
                  return ['IMAGE', 'VIDEO', 'PDF'].includes(type) ? (
                    <Form.Item 
                      name="mediaUrls" 
                      label={<span className="form-label">上传文件</span>}
                    >
                      <div className="media-upload-wrapper glass-light">
                        <MediaUpload
                          maxCount={type === 'IMAGE' ? 9 : 3}
                          accept={
                            type === 'IMAGE'
                              ? 'image/*'
                              : type === 'VIDEO'
                                ? 'video/*'
                                : '.pdf,.doc,.docx,.ppt,.pptx'
                          }
                        />
                      </div>
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>

              {/* 内容编辑器 */}
              <Form.Item
                name="content"
                label={<span className="form-label">内容</span>}
                rules={[
                  { required: true, message: '请输入内容' },
                  { min: 10, message: '内容不能少于10个字符' },
                ]}
              >
                <div className="editor-wrapper glass-light">
                  <RichTextEditor height={400} />
                </div>
              </Form.Item>

              {/* 标签管理 */}
              <Form.Item
                name="tags"
                label={<span className="form-label">标签</span>}
                getValueFromEvent={tags => tags.join(',')}
                getValueProps={value => ({
                  value: value ? value.split(',').filter(Boolean) : [],
                })}
              >
                <div className="tag-selector-wrapper glass-light">
                  <TagSelector
                    placeholder="选择或输入标签"
                    maxTags={10}
                    showPopular
                  />
                </div>
              </Form.Item>

              <Divider className="form-divider" />

              {/* 操作按钮 */}
              <Form.Item className="form-actions">
                <div className="action-buttons">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={loading}
                    size="large"
                    className="glass-button glass-strong hover-lift active-scale primary-button"
                  >
                    {isEditing ? '更新内容' : '发布内容'}
                  </Button>

                  <Button
                    icon={<SaveOutlined />}
                    onClick={saveDraft}
                    loading={saving}
                    size="large"
                    className="glass-button hover-scale active-scale"
                  >
                    保存草稿
                  </Button>

                  <Button
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    size="large"
                    className="glass-button hover-scale active-scale"
                  >
                    预览
                  </Button>

                  <Button 
                    onClick={() => navigate('/knowledge')} 
                    size="large"
                    className="glass-button hover-scale active-scale"
                  >
                    取消
                  </Button>
                </div>
              </Form.Item>
            </Form>
            </div>
          </Col>

          <Col xs={24} lg={6}>
            {/* 侧边栏 */}
            <div className="create-sidebar animate-fade-in-up delay-200">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 草稿历史 */}
                {drafts.length > 0 && (
                  <div className="sidebar-card glass-card">
                    <div className="sidebar-header">
                      <h3 className="sidebar-title">
                        <HistoryOutlined />
                        草稿历史
                      </h3>
                      <Badge count={drafts.length} className="glass-badge" />
                    </div>
                    
                    <List
                      size="small"
                      dataSource={drafts.slice(0, 3)}
                      className="draft-list"
                      renderItem={draft => (
                        <List.Item className="draft-item glass-light hover-lift">
                          <List.Item.Meta
                            title={
                              <Text ellipsis className="draft-title">
                                {draft.title}
                              </Text>
                            }
                            description={
                              <div className="draft-meta">
                                <Text type="secondary" className="draft-time">
                                  {new Date(draft.savedAt).toLocaleString()}
                                </Text>
                                {draft.autoSaved && (
                                  <Badge 
                                    text="自动保存" 
                                    status="processing" 
                                    className="auto-save-badge"
                                  />
                                )}
                              </div>
                            }
                          />
                          <Button
                            type="link"
                            size="small"
                            onClick={() => loadDraft(draft)}
                            className="draft-load-btn hover-scale"
                          >
                            加载
                          </Button>
                        </List.Item>
                      )}
                    />
                    
                    {drafts.length > 3 && (
                      <Button
                        type="link"
                        block
                        icon={<HistoryOutlined />}
                        onClick={() => setShowDrafts(true)}
                        className="view-all-btn hover-scale"
                      >
                        查看全部 ({drafts.length})
                      </Button>
                    )}
                  </div>
                )}

                {/* 发布提示 */}
                <div className="sidebar-card glass-card">
                  <div className="sidebar-header">
                    <h3 className="sidebar-title">
                      <BulbOutlined />
                      发布提示
                    </h3>
                  </div>
                  
                  <div className="tips-content">
                    <div className="tip-item">
                      <CheckCircleOutlined className="tip-icon" />
                      <span>标题要简洁明了，突出重点</span>
                    </div>
                    <div className="tip-item">
                      <CheckCircleOutlined className="tip-icon" />
                      <span>内容要结构清晰，逻辑性强</span>
                    </div>
                    <div className="tip-item">
                      <CheckCircleOutlined className="tip-icon" />
                      <span>添加合适的标签便于搜索</span>
                    </div>
                    <div className="tip-item">
                      <CheckCircleOutlined className="tip-icon" />
                      <span>选择正确的分类和内容类型</span>
                    </div>
                    <div className="tip-item">
                      <ClockCircleOutlined className="tip-icon" />
                      <span>系统会自动保存草稿</span>
                    </div>
                  </div>
                </div>

                {/* 发布统计 */}
                <div className="sidebar-card glass-card">
                  <div className="sidebar-header">
                    <h3 className="sidebar-title">
                      <FileTextOutlined />
                      内容统计
                    </h3>
                  </div>
                  
                  <div className="stats-content">
                    <div className="stat-item">
                      <span className="stat-label">字数统计</span>
                      <Progress 
                        percent={75} 
                        size="small" 
                        strokeColor="var(--accent-primary)"
                        showInfo={false}
                      />
                      <span className="stat-value">约 1,200 字</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">完成度</span>
                      <Progress 
                        percent={60} 
                        size="small" 
                        strokeColor="var(--accent-success)"
                        showInfo={false}
                      />
                      <span className="stat-value">60%</span>
                    </div>
                  </div>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* 草稿历史弹窗 */}
      <Modal
        title="草稿历史"
        open={showDrafts}
        onCancel={() => setShowDrafts(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={drafts}
          renderItem={draft => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => loadDraft(draft)}>
                  加载
                </Button>,
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteDraft(draft.id)}
                >
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={draft.title}
                description={
                  <Space direction="vertical" size="small">
                    <Text type="secondary">
                      {new Date(draft.savedAt).toLocaleString()}
                      {draft.autoSaved && ' (自动保存)'}
                    </Text>
                    <Text type="secondary" ellipsis style={{ width: 400 }}>
                      {draft.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                      ...
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      <style>{`
        /* ===== 发布内容页面样式 ===== */
        .create-knowledge-container {
          min-height: 100vh;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: var(--spacing-lg);
        }

        /* 背景装饰 */
        .create-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }

        .create-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: var(--blur-xl);
          animation: float 8s ease-in-out infinite;
        }

        .create-blob-1 {
          top: 10%;
          right: 5%;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .create-blob-2 {
          top: 50%;
          left: 10%;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, var(--accent-success) 0%, transparent 70%);
          animation-delay: 2s;
        }

        .create-blob-3 {
          bottom: 20%;
          right: 20%;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, var(--accent-warning) 0%, transparent 70%);
          animation-delay: 4s;
        }

        /* 加载状态 */
        .create-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }

        .loading-content {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent-primary);
          border-radius: 50%;
          margin: 0 auto var(--spacing-lg);
        }

        /* 页面头部 */
        .create-header {
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-xl);
        }

        .create-header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .create-breadcrumb {
          margin-bottom: var(--spacing-lg);
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

        .create-title-section {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .create-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .create-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* 进度指示器 */
        .create-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-radius: var(--liquid-border-radius);
          max-width: 600px;
          margin: 0 auto;
        }

        .progress-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        .progress-icon {
          font-size: 1.5rem;
          padding: var(--spacing-sm);
          border-radius: 50%;
          background: var(--glass-bg-light);
          border: 2px solid var(--border-color);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .progress-icon.completed {
          color: var(--accent-success);
          border-color: var(--accent-success);
          background: var(--success-bg);
        }

        .progress-icon.current {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          background: var(--primary-50);
          animation: pulse 2s infinite;
        }

        .progress-line {
          width: 60px;
          height: 2px;
          background: var(--border-color);
          border-radius: var(--radius-full);
        }

        /* 主要内容区域 */
        .create-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .create-main-card {
          padding: var(--spacing-2xl);
          border-radius: var(--liquid-border-radius-lg);
          margin-bottom: var(--spacing-xl);
        }

        .create-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-2xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--border-light);
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .form-badges {
          display: flex;
          gap: var(--spacing-sm);
        }

        /* 表单样式 */
        .create-form {
          max-width: 100%;
        }

        .form-label {
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .create-input,
        .create-select {
          border-radius: var(--radius-md) !important;
          border: 2px solid var(--border-color) !important;
          transition: all var(--transition-fast) var(--ease-ios);
          background: var(--bg-secondary) !important;
        }

        .create-input:hover,
        .create-select:hover {
          border-color: var(--accent-primary) !important;
        }

        .create-input:focus,
        .create-select:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px var(--primary-200) !important;
        }

        .media-upload-wrapper,
        .editor-wrapper,
        .tag-selector-wrapper {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }

        .form-divider {
          margin: var(--spacing-2xl) 0;
          border-color: var(--border-light);
        }

        /* 操作按钮 */
        .form-actions {
          margin-top: var(--spacing-xl);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .primary-button {
          background: linear-gradient(135deg, var(--accent-primary), var(--primary-600)) !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
        }

        /* 侧边栏 */
        .create-sidebar {
          position: sticky;
          top: var(--spacing-lg);
        }

        .sidebar-card {
          padding: var(--spacing-xl);
          border-radius: var(--liquid-border-radius);
          margin-bottom: var(--spacing-lg);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .sidebar-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        /* 草稿列表 */
        .draft-list {
          margin-bottom: var(--spacing-md);
        }

        .draft-item {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-sm);
          border: 1px solid var(--glass-border);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .draft-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .draft-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-xs);
        }

        .draft-time {
          font-size: 0.75rem;
        }

        .auto-save-badge {
          font-size: 0.75rem;
        }

        .draft-load-btn {
          color: var(--accent-primary);
          font-size: 0.75rem;
        }

        .view-all-btn {
          color: var(--accent-primary);
          font-size: 0.875rem;
          margin-top: var(--spacing-sm);
        }

        /* 提示内容 */
        .tips-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .tip-icon {
          color: var(--accent-success);
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* 统计内容 */
        .stats-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-align: right;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .create-header-content {
            text-align: center;
          }

          .create-progress {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .progress-line {
            width: 2px;
            height: 30px;
          }

          .create-sidebar {
            position: static;
            margin-top: var(--spacing-xl);
          }
        }

        @media (max-width: 768px) {
          .create-knowledge-container {
            padding: var(--spacing-md);
          }

          .create-header {
            padding: var(--spacing-xl);
          }

          .create-title {
            font-size: 2rem;
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .create-main-card {
            padding: var(--spacing-xl);
          }

          .create-form-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .glass-button {
            width: 100%;
            justify-content: center;
          }

          .sidebar-card {
            padding: var(--spacing-lg);
          }
        }

        @media (max-width: 640px) {
          .create-progress {
            display: none;
          }

          .draft-item {
            padding: var(--spacing-sm);
          }

          .tip-item {
            font-size: 0.8rem;
          }
        }

        /* 性能优化 */
        @media (prefers-reduced-motion: reduce) {
          .create-knowledge-container,
          .create-header,
          .create-content,
          .create-sidebar,
          .create-blob,
          .progress-icon {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateKnowledge;
