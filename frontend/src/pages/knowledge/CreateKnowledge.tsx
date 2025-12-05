/* ===================================
   创建/编辑知识页面组件 - Create/Edit Knowledge Page Component
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 富文本编辑器
   - 草稿自动保存
   - 表单验证
   - 高性能优化
   
   ================================== */

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
  Space,
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  EyeOutlined,
  FileTextOutlined,
  BulbOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
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
import CertificationProgress, {
  CertificationStep,
  CertificationStatus,
} from '@/components/blockchain/CertificationProgress';
import { blockchainService } from '@/services/blockchain';
import './CreateKnowledge.css';

const { Title } = Typography;
const { Option } = Select;

interface FormValues extends CreateKnowledgeRequest {
  isDraft?: boolean;
}

/**
 * 创建/编辑知识页面组件
 */
const CreateKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [form] = Form.useForm<FormValues>();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  // 存证进度状态
  const [showProgress, setShowProgress] = useState(false);
  const [certStep, setCertStep] = useState<CertificationStep>(
    CertificationStep.UPLOADING
  );
  const [certStatus, setCertStatus] = useState<CertificationStatus>(
    CertificationStatus.PENDING
  );
  const [certError, setCertError] = useState<string>();
  const [createdKnowledgeId, setCreatedKnowledgeId] = useState<number>();

  // 使用草稿管理器 - 禁用自动保存
  const {
    saveDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
  } = useDraftManager({
    autoSave: false, // 禁用自动保存，避免性能问题
    showNotifications: false, // 禁用通知
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

  // 内容类型选项
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

  // 移除表单变化监听，完全避免重渲染

  // 手动保存草稿
  const handleSaveDraft = async () => {
    try {
      await form.validateFields();
    } catch {
      // 忽略验证错误
    }

    let values = form.getFieldsValue();

    // 尝试从编辑器获取内容
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
      setShowProgress(true);
      setCertStep(CertificationStep.UPLOADING);
      setCertStatus(CertificationStatus.IN_PROGRESS);
      setCertError(undefined);

      const submitData: CreateKnowledgeRequest = {
        title: values.title,
        content: values.content,
        type: values.type,
        categoryId: values.categoryId,
        mediaUrls: values.mediaUrls,
        linkUrl: values.linkUrl,
        tags: values.tags,
      };

      let knowledgeId: number;

      if (isEditing && knowledge) {
        await knowledgeService.updateKnowledge(knowledge.id, submitData);
        knowledgeId = knowledge.id;
        message.success('更新成功');
      } else {
        const response = await knowledgeService.createKnowledge(submitData);
        if (response.success && response.data) {
          knowledgeId = response.data.id;
          setCreatedKnowledgeId(knowledgeId);
        } else {
          throw new Error('创建失败');
        }
      }

      // 开始存证流程
      await performCertification(knowledgeId, values.title, values.content);

      clearDraft();
    } catch (error) {
      console.error('Submit failed:', error);
      setCertStatus(CertificationStatus.ERROR);
      setCertError(error instanceof Error ? error.message : '发布失败');
      message.error(isEditing ? '更新失败' : '发布失败');
    } finally {
      setLoading(false);
    }
  };

  // 执行存证流程
  const performCertification = async (
    knowledgeId: number,
    title: string,
    content: string
  ) => {
    try {
      // 步骤1: 计算哈希
      setCertStep(CertificationStep.HASHING);
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
      const contentHash = await calculateContentHash(content);

      // 步骤2: 区块链存证
      setCertStep(CertificationStep.CERTIFYING);
      await blockchainService.certifyContent({
        type: 'KNOWLEDGE_CERT',
        knowledge_id: knowledgeId,
        user_id: user!.id,
        content_hash: contentHash,
        metadata: {
          title: title,
          timestamp: new Date().toISOString(),
        },
      });

      // 步骤3: 生成证书
      setCertStep(CertificationStep.GENERATING);
      await blockchainService.createCertificate({
        knowledge_id: knowledgeId,
        knowledge_title: title,
        user_id: user!.id,
        user_name: user!.username || user!.email,
      });

      // 步骤4: 完成
      setCertStep(CertificationStep.COMPLETED);
      setCertStatus(CertificationStatus.SUCCESS);
      message.success('内容发布并存证成功！');
    } catch (error) {
      console.error('Certification failed:', error);
      setCertStatus(CertificationStatus.ERROR);
      setCertError(
        '存证失败：' + (error instanceof Error ? error.message : '未知错误')
      );
      throw error;
    }
  };

  // 计算内容哈希（简化版，实际应该在后端计算）
  const calculateContentHash = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  // 重试存证
  const handleRetryCertification = async () => {
    if (!createdKnowledgeId) return;

    const values = form.getFieldsValue();
    setCertStatus(CertificationStatus.IN_PROGRESS);
    setCertError(undefined);

    try {
      await performCertification(
        createdKnowledgeId,
        values.title,
        values.content
      );
    } catch {
      // 错误已在performCertification中处理
    }
  };

  // 下载证书
  const handleDownloadCertificate = async () => {
    if (!createdKnowledgeId) return;

    try {
      const response = await blockchainService.createCertificate({
        knowledge_id: createdKnowledgeId,
        knowledge_title: form.getFieldValue('title'),
        user_id: user!.id,
        user_name: user!.username || user!.email,
      });

      if (response.code === '200' && response.data) {
        await blockchainService.downloadCertificate(
          response.data.certificate_id
        );
      }
    } catch {
      message.error('下载证书失败');
    }
  };

  // 查看详情
  const handleViewDetail = () => {
    if (createdKnowledgeId) {
      navigate(`/knowledge/${createdKnowledgeId}`);
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

  // 初始化
  useEffect(() => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (isEditing) {
      loadKnowledgeDetail();
    }

    // 不启动自动保存，避免性能问题
    return () => {
      // 清理
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, startAutoSave, stopAutoSave]);

  // 加载状态
  if (loading && isEditing) {
    return (
      <div className="create-loading animate-fade-in">
        <div className="loading-card glass-card">
          <div className="loading-spinner animate-spin"></div>
          <p>加载内容中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-knowledge-page animate-fade-in">
      {/* 背景装饰 */}
      <div className="create-background">
        <div className="create-blob create-blob-1" />
        <div className="create-blob create-blob-2" />
        <div className="create-blob create-blob-3" />
      </div>

      <div className="create-content container">
        {/* ===================================
            面包屑导航 - Breadcrumb
            ================================== */}
        <div className="create-breadcrumb glass-light animate-fade-in-up">
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
                title: <span className="breadcrumb-current">{pageTitle}</span>,
              },
            ]}
          />
        </div>

        {/* ===================================
            页面头部 - Page Header
            ================================== */}
        <header className="create-header glass-light animate-fade-in-up delay-100">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <FileTextOutlined />
                {pageTitle}
              </h1>
              <p className="page-subtitle">
                {isEditing
                  ? '完善您的知识内容，让更多人受益'
                  : '分享您的知识，让智慧传播'}
              </p>
            </div>

            {/* 移除保存状态指示器，避免频繁更新 */}
          </div>
        </header>

        {/* ===================================
            表单区域 - Form Section
            ================================== */}
        <main className="create-main animate-fade-in-up delay-200">
          <div className="create-form-card glass-card">
            <div className="form-header">
              <h2 className="form-title">
                <BulbOutlined />
                内容编辑
              </h2>
              <Button
                icon={<HistoryOutlined />}
                onClick={handleRestoreDraft}
                className="glass-button hover-scale active-scale"
              >
                恢复草稿
              </Button>
            </div>

            {/* 存证进度 */}
            {showProgress && (
              <CertificationProgress
                currentStep={certStep}
                status={certStatus}
                errorMessage={certError}
                onRetry={handleRetryCertification}
                onDownloadCertificate={handleDownloadCertificate}
                onViewDetail={handleViewDetail}
              />
            )}

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
                    <Select placeholder="选择内容类型" size="large">
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
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* 外部链接 - 优化：只在 type 变化时重渲染 */}
              <Form.Item dependencies={['type']} noStyle>
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
                      <Input placeholder="https://example.com" size="large" />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>

              {/* 多媒体文件 - 优化：只在 type 变化时重渲染 */}
              <Form.Item dependencies={['type']} noStyle>
                {({ getFieldValue }) => {
                  const type = getFieldValue('type');
                  return ['IMAGE', 'VIDEO', 'PDF'].includes(type) ? (
                    <Form.Item
                      name="mediaUrls"
                      label={<span className="form-label">上传文件</span>}
                      valuePropName="value"
                      trigger="onChange"
                    >
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
                  className="editor-wrapper"
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
                  />
                </div>
              </Form.Item>

              <Divider className="form-divider" />

              {/* 操作按钮 */}
              <Form.Item className="form-actions">
                <Space size="middle" wrap>
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
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    size="large"
                    className="glass-button hover-scale active-scale"
                  >
                    预览
                  </Button>

                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/knowledge')}
                    size="large"
                    className="glass-button hover-scale active-scale"
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateKnowledge;
