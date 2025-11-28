import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Breadcrumb,
  Row,
  Col,
  Divider,
  Modal,
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  EyeOutlined,
  FileTextOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
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
import { useDraftManager } from '@/hooks/useDraftManager';
import draftManager from '@/utils/draftManager';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/animations.css';
import '@/styles/glass-effects.css';

const { Title } = Typography;
const { Option } = Select;

interface FormValues extends CreateKnowledgeRequest {
  isDraft?: boolean;
}

const CreateKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [form] = Form.useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [editorKey, setEditorKey] = useState(0); // 用于强制重新渲染编辑器

  // 使用草稿管理器 Hook - 主要方式
  const {
    saveStatus,
    saveDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
    markUnsaved,
  } = useDraftManager({
    autoSave: true,
    showNotifications: true,
    onDraftLoaded: draft => {
      const formValues = {
        title: draft.title,
        content: draft.content,
        type: draft.type,
        categoryId: draft.categoryId,
        tags: draft.tags,
        linkUrl: draft.linkUrl,
      };

      form.setFieldsValue(formValues);
      setEditorKey(prev => prev + 1);
    },
  });

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

  // 表单字段变化时的处理 - 优先使用 Hook
  const handleFormChange = () => {
    // 标记为未保存状态
    markUnsaved();
  };

  // 手动保存草稿 - 优先使用 Hook
  const handleSaveDraft = async () => {
    // 强制触发表单验证，确保所有字段都已同步
    try {
      await form.validateFields();
    } catch {
      // 忽略验证错误，继续保存草稿
    }

    let values = form.getFieldsValue();

    // 如果 content 为 undefined 或空，尝试从编辑器直接获取
    if (!values.content || values.content.trim() === '') {
      const editorElement = document.querySelector(
        '[contenteditable="true"]'
      ) as HTMLElement;
      if (editorElement && editorElement.innerHTML) {
        const editorContent = editorElement.innerHTML;
        form.setFieldValue('content', editorContent);
        values = { ...values, content: editorContent };
      }
    }

    const success = await saveDraft(
      values as unknown as Record<string, unknown>,
      true
    );
    if (!success) {
      message.error('保存草稿失败，请检查内容');
    }
  };

  // 恢复草稿
  const handleRestoreDraft = () => {
    const draft = draftManager.getCurrentDraft();

    if (draft) {
      Modal.confirm({
        title: '恢复草稿',
        content: `发现草稿："${draft.title}"，是否恢复？`,
        okText: '恢复',
        cancelText: '取消',
        onOk: () => {
          form.setFieldsValue({
            title: draft.title,
            content: draft.content,
            type: draft.type,
            categoryId: draft.categoryId,
            tags: draft.tags,
            linkUrl: draft.linkUrl,
          });

          // 强制更新编辑器
          setEditorKey(prev => prev + 1);
          message.success('草稿已恢复');
        },
      });
    } else {
      message.info('没有找到草稿');
    }
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
      clearDraft();

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

    // 启动自动保存 - 使用 Hook 管理，确保能获取到编辑器内容
    startAutoSave(() => {
      let values = form.getFieldsValue();

      // 如果内容为空，尝试从编辑器直接获取
      if (!values.content || values.content.trim() === '') {
        const editorElement = document.querySelector(
          '[contenteditable="true"]'
        ) as HTMLElement;
        if (editorElement && editorElement.innerHTML) {
          values = { ...values, content: editorElement.innerHTML };
        }
      }

      return values as unknown as Record<string, unknown>;
    });

    return () => {
      stopAutoSave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, startAutoSave, stopAutoSave]);

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
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link
                      to="/knowledge"
                      className="breadcrumb-link hover-scale"
                    >
                      知识库
                    </Link>
                  ),
                },
                {
                  title: (
                    <span className="breadcrumb-current">{pageTitle}</span>
                  ),
                },
              ]}
            />
          </div>

          <div className="create-title-section">
            <h1 className="create-title gradient-text">
              <FileTextOutlined />
              {pageTitle}
            </h1>
            <p className="create-subtitle">
              {isEditing
                ? '完善您的知识内容，让更多人受益'
                : '分享您的知识，让智慧传播'}
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
          <Col xs={24}>
            <div className="create-main-card glass-card">
              <div className="create-form-header">
                <h2 className="form-title">
                  <BulbOutlined />
                  内容编辑
                </h2>
                <div className="form-badges">
                  {/* 保存状态指示器 */}
                  <div className="save-status">
                    {saveStatus === 'saving' && (
                      <span className="save-indicator saving">
                        <div className="save-dot" />
                        正在保存...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="save-indicator saved">
                        <CheckCircleOutlined />
                        已保存
                      </span>
                    )}
                    {saveStatus === 'unsaved' && (
                      <span className="save-indicator unsaved">
                        <ClockCircleOutlined />
                        有未保存更改
                      </span>
                    )}
                  </div>

                  <Button
                    icon={<HistoryOutlined />}
                    onClick={handleRestoreDraft}
                    className="glass-button hover-scale active-scale"
                    title="恢复草稿"
                  >
                    恢复草稿
                  </Button>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleFormChange}
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
                        size="large"
                        className="create-select"
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
                  <RichTextEditor
                    key={editorKey}
                    height={400}
                    showStats={true}
                    targetWords={1000}
                    className="editor-wrapper glass-light"
                  />
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
                      size="large"
                      className="create-select"
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
                      onClick={handleSaveDraft}
                      size="large"
                      className="glass-button hover-scale active-scale"
                    >
                      保存草稿
                    </Button>

                    <Button
                      icon={<HistoryOutlined />}
                      onClick={handleRestoreDraft}
                      size="large"
                      className="glass-button hover-scale active-scale"
                    >
                      恢复草稿
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
        </Row>
      </div>

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
          align-items: center;
          gap: var(--spacing-md);
        }

        /* 保存状态指示器 */
        .save-status {
          display: flex;
          align-items: center;
        }

        .save-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast) var(--ease-ios);
        }

        .save-indicator.saving {
          color: var(--accent-info);
          background: var(--info-bg);
          border: 1px solid var(--info-border);
        }

        .save-indicator.saved {
          color: var(--accent-success);
          background: var(--success-bg);
          border: 1px solid var(--success-border);
        }

        .save-indicator.unsaved {
          color: var(--accent-warning);
          background: var(--warning-bg);
          border: 1px solid var(--warning-border);
        }

        .save-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
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
        .create-select,
        .create-select .ant-select-selector,
        .create-select .ant-tree-select-selector {
          border-radius: var(--radius-md) !important;
          border: 2px solid var(--border-color) !important;
          transition: all var(--transition-fast) var(--ease-ios);
          background: var(--bg-secondary) !important;
        }

        .create-input:hover,
        .create-select:hover,
        .create-select:hover .ant-select-selector,
        .create-select:hover .ant-tree-select-selector {
          border-color: var(--accent-primary) !important;
        }

        .create-input:focus,
        .create-select:focus,
        .create-select.ant-select-focused .ant-select-selector,
        .create-select.ant-tree-select-focused .ant-tree-select-selector {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px var(--primary-200) !important;
        }

        /* 确保TreeSelect的选择器样式一致 */
        .create-select.ant-tree-select .ant-tree-select-selector {
          min-height: 40px;
          padding: 4px 11px;
        }

        .create-select.ant-tree-select-large .ant-tree-select-selector {
          min-height: 40px;
          padding: 6px 11px;
          font-size: 16px;
        }

        /* 确保多选Select的样式一致 */
        .create-select.ant-select-multiple .ant-select-selector {
          min-height: 40px;
          padding: 2px 4px;
        }

        .create-select.ant-select-large.ant-select-multiple .ant-select-selector {
          min-height: 40px;
          padding: 4px 6px;
        }

        /* 统一所有选择器的字体大小 */
        .create-select.ant-select-large .ant-select-selection-item,
        .create-select.ant-tree-select-large .ant-select-selection-item {
          font-size: 16px;
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
