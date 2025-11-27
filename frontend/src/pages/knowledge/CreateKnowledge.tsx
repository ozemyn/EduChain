import React, { useState, useEffect } from 'react';
import {
  Card,
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
  Spin
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  EyeOutlined,
  HistoryOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { RichTextEditor, MediaUpload, CategorySelector, TagSelector } from '@/components/knowledge';
import type { KnowledgeItem, CreateKnowledgeRequest } from '@/types';
import { knowledgeService } from '@/services/knowledge';
import { useAuth } from '@/contexts/AuthContext';

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

    const existingDrafts = JSON.parse(localStorage.getItem('knowledge_drafts') || '[]');
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

      const existingDrafts = JSON.parse(localStorage.getItem('knowledge_drafts') || '[]');
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
    const existingDrafts = JSON.parse(localStorage.getItem('knowledge_drafts') || '[]');
    const newDrafts = existingDrafts.filter((d: DraftVersion) => d.id !== draftId);
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
    const savedDrafts = JSON.parse(localStorage.getItem('knowledge_drafts') || '[]');
    setDrafts(savedDrafts);

    // 设置自动保存
    const timer = setInterval(autoSaveDraft, 30000); // 30秒自动保存

    return () => {
      clearInterval(timer);
    };
  }, [id, user]);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
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
        <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col xs={24} lg={18}>
          <Card title={pageTitle}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                type: 'TEXT',
                isDraft: false,
              }}
            >
              {/* 标题 */}
              <Form.Item
                name="title"
                label="标题"
                rules={[
                  { required: true, message: '请输入标题' },
                  { max: 100, message: '标题不能超过100个字符' },
                ]}
              >
                <Input placeholder="请输入知识内容标题" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  {/* 内容类型 */}
                  <Form.Item
                    name="type"
                    label="内容类型"
                    rules={[{ required: true, message: '请选择内容类型' }]}
                  >
                    <Select placeholder="选择内容类型">
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
                  <Form.Item name="categoryId" label="分类">
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
                      label="链接地址"
                      rules={[
                        { required: true, message: '请输入链接地址' },
                        { type: 'url', message: '请输入有效的URL地址' },
                      ]}
                    >
                      <Input placeholder="https://example.com" />
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
                    <Form.Item name="mediaUrls" label="上传文件">
                      <MediaUpload
                        maxCount={type === 'IMAGE' ? 9 : 3}
                        accept={
                          type === 'IMAGE' ? 'image/*' :
                          type === 'VIDEO' ? 'video/*' :
                          '.pdf,.doc,.docx,.ppt,.pptx'
                        }
                      />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>

              {/* 内容编辑器 */}
              <Form.Item
                name="content"
                label="内容"
                rules={[
                  { required: true, message: '请输入内容' },
                  { min: 10, message: '内容不能少于10个字符' },
                ]}
              >
                <RichTextEditor height={400} />
              </Form.Item>

              {/* 标签管理 */}
              <Form.Item 
                name="tags" 
                label="标签"
                getValueFromEvent={(tags) => tags.join(',')}
                getValueProps={(value) => ({ value: value ? value.split(',').filter(Boolean) : [] })}
              >
                <TagSelector 
                  placeholder="选择或输入标签"
                  maxTags={10}
                  showPopular
                />
              </Form.Item>

              <Divider />

              {/* 操作按钮 */}
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={loading}
                    size="large"
                  >
                    {isEditing ? '更新' : '发布'}
                  </Button>
                  
                  <Button
                    icon={<SaveOutlined />}
                    onClick={saveDraft}
                    loading={saving}
                    size="large"
                  >
                    保存草稿
                  </Button>
                  
                  <Button
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    size="large"
                  >
                    预览
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/knowledge')}
                    size="large"
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          {/* 侧边栏 */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 草稿历史 */}
            {drafts.length > 0 && (
              <Card 
                title="草稿历史" 
                size="small"
                extra={
                  <Button 
                    type="link" 
                    size="small"
                    icon={<HistoryOutlined />}
                    onClick={() => setShowDrafts(true)}
                  >
                    查看全部
                  </Button>
                }
              >
                <List
                  size="small"
                  dataSource={drafts.slice(0, 3)}
                  renderItem={draft => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => loadDraft(draft)}
                        >
                          加载
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Text ellipsis style={{ width: 120 }}>
                            {draft.title}
                          </Text>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(draft.savedAt).toLocaleString()}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 发布提示 */}
            <Card title="发布提示" size="small">
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • 标题要简洁明了，突出重点
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • 内容要结构清晰，逻辑性强
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • 添加合适的标签便于搜索
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • 选择正确的分类和内容类型
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • 系统会自动保存草稿
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

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
                <Button 
                  type="link"
                  onClick={() => loadDraft(draft)}
                >
                  加载
                </Button>,
                <Button 
                  type="link" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteDraft(draft.id)}
                >
                  删除
                </Button>
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
                    <Text 
                      type="secondary" 
                      ellipsis
                      style={{ width: 400 }}
                    >
                      {draft.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default CreateKnowledge;
