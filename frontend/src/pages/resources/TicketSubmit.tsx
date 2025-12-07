/* ===================================
   工单提交页面 - Ticket Submit Page
   ===================================
   
   特性：
   - 分步骤表单设计
   - 智能FAQ推荐
   - 实时草稿保存
   - 文件上传支持
   
   ================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ticketCategories, 
  ticketPriorities, 
  createTicket
} from '@/mock/data/tickets';
import {
  Card,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Space,
  Steps,
  Divider,
  Alert,
  Tag,
  List,
  message,
  Row,
  Col,
} from 'antd';
import {
  FileTextOutlined,
  InboxOutlined,
  SendOutlined,
  SaveOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import './Resources.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface TicketForm {
  category: string;
  priority: string;
  title: string;
  description: string;
  steps: string;
  email: string;
  phone: string;
  expectedResponse: string;
  attachments: any[];
}

const TicketSubmit: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<TicketForm>>({});
  const [recommendedFAQ, setRecommendedFAQ] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 使用mock数据中的配置
  const categories = ticketCategories;

  const priorities = ticketPriorities;

  // 相关FAQ数据（简化版）
  const faqData = [
    {
      category: 'account',
      question: '如何重置密码？',
      answer: '在登录页面点击"忘记密码"，输入邮箱地址...',
      tags: ['密码', '重置', '登录'],
    },
    {
      category: 'content',
      question: '支持哪些文件格式？',
      answer: '支持图片、视频、文档等多种格式...',
      tags: ['格式', '上传', '文件'],
    },
    {
      category: 'blockchain',
      question: '区块链存证需要多长时间？',
      answer: '通常需要1-3分钟完成存证...',
      tags: ['时间', '存证', '区块链'],
    },
  ];

  // 步骤配置
  const steps = [
    {
      title: '问题分类',
      description: '选择问题类型',
    },
    {
      title: '详细描述',
      description: '描述具体问题',
    },
    {
      title: '联系信息',
      description: '确认联系方式',
    },
  ];

  // 监听表单变化，推荐相关FAQ
  useEffect(() => {
    const { category, title, description } = formData;
    if (category || title || description) {
      const keywords = [title, description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const related = faqData
        .filter(faq => {
          const matchCategory = faq.category === category;
          const matchKeywords =
            keywords &&
            (faq.question.toLowerCase().includes(keywords) ||
              faq.answer.toLowerCase().includes(keywords) ||
              faq.tags.some(tag => keywords.includes(tag.toLowerCase())));
          return matchCategory || matchKeywords;
        })
        .slice(0, 3);

      setRecommendedFAQ(related);
    }
  }, [formData]);

  // 表单值变化处理
  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormData({ ...formData, ...changedValues });

    // 自动保存草稿
    localStorage.setItem('ticket_draft', JSON.stringify(allValues));
  };

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem('ticket_draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        form.setFieldsValue(draftData);
        setFormData(draftData);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [form]);

  // 文件上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    beforeUpload: (file: File) => {
      const isValidSize = file.size / 1024 / 1024 < 10; // 10MB限制
      if (!isValidSize) {
        message.error('文件大小不能超过10MB');
      }
      return false; // 阻止自动上传
    },
    onChange: (info: any) => {
      const { fileList } = info;
      setFormData({ ...formData, attachments: fileList });
    },
  };

  // 下一步
  const nextStep = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 保存草稿
  const saveDraft = () => {
    const values = form.getFieldsValue();
    localStorage.setItem('ticket_draft', JSON.stringify(values));
    message.success('草稿已保存');
  };

  // 提交工单
  const submitTicket = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 创建工单数据
      const ticketData = {
        title: values.title,
        category: values.category,
        priority: values.priority,
        description: values.description,
        steps: values.steps,
        email: values.email,
        phone: values.phone,
        expectedResponse: values.expectedResponse || 'normal',
        attachments: values.attachments?.map((file: any) => file.name) || [],
        userId: 2 // 模拟当前用户ID
      };

      // 使用mock数据创建工单
      const newTicket = createTicket(ticketData);

      // 清除草稿
      localStorage.removeItem('ticket_draft');

      message.success(`工单提交成功！工单号：${newTicket.id}`);

      // 重置表单
      form.resetFields();
      setCurrentStep(0);
      setFormData({});

      // 跳转到工单列表
      setTimeout(() => {
        navigate('/tickets');
      }, 2000);
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Form.Item
              name="category"
              label="问题类型"
              rules={[{ required: true, message: '请选择问题类型' }]}
            >
              <Select
                placeholder="请选择您遇到的问题类型"
                size="large"
                onChange={value =>
                  handleFormChange(
                    { category: value },
                    { ...formData, category: value }
                  )
                }
                className="glass-select"
              >
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    <Space>
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="紧急程度"
              rules={[{ required: true, message: '请选择紧急程度' }]}
            >
              <Select
                placeholder="请选择问题的紧急程度"
                size="large"
                onChange={value =>
                  handleFormChange(
                    { priority: value },
                    { ...formData, priority: value }
                  )
                }
                className="glass-select"
              >
                {priorities.map(priority => (
                  <Option key={priority.value} value={priority.value}>
                    <div>
                      <Tag className="priority-tag">{priority.label}</Tag>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {priority.desc}
                      </Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="问题标题"
              rules={[
                { required: true, message: '请输入问题标题' },
                { min: 5, message: '标题至少5个字符' },
                { max: 100, message: '标题不能超过100个字符' },
              ]}
            >
              <Input
                placeholder="请简要描述您的问题（5-100字符）"
                size="large"
                showCount
                maxLength={100}
                onChange={e =>
                  handleFormChange(
                    { title: e.target.value },
                    { ...formData, title: e.target.value }
                  )
                }
                className="glass-input"
              />
            </Form.Item>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Form.Item
              name="description"
              label="问题描述"
              rules={[
                { required: true, message: '请详细描述您的问题' },
                { min: 20, message: '描述至少20个字符' },
              ]}
            >
              <TextArea
                placeholder="请详细描述您遇到的问题，包括具体的错误信息、操作步骤等..."
                rows={6}
                showCount
                maxLength={2000}
                onChange={e =>
                  handleFormChange(
                    { description: e.target.value },
                    { ...formData, description: e.target.value }
                  )
                }
                className="glass-textarea"
              />
            </Form.Item>

            <Form.Item name="steps" label="复现步骤（可选）">
              <TextArea
                placeholder="如果是技术问题，请描述复现步骤：&#10;1. 打开某个页面&#10;2. 点击某个按钮&#10;3. 出现错误..."
                rows={4}
                maxLength={1000}
                className="glass-textarea"
              />
            </Form.Item>

            <Form.Item name="attachments" label="相关附件">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持截图、日志文件、文档等，单个文件不超过10MB，最多5个文件
                </p>
              </Dragger>
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Form.Item
              name="email"
              label="联系邮箱"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
              initialValue="user@example.com" // 实际应用中从用户信息获取
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="用于接收工单处理进度通知"
                size="large"
                className="glass-input"
              />
            </Form.Item>

            <Form.Item name="phone" label="联系电话（可选）">
              <Input
                prefix={<PhoneOutlined />}
                placeholder="紧急情况下的联系电话"
                size="large"
                className="glass-input"
              />
            </Form.Item>

            <Form.Item
              name="expectedResponse"
              label="期望回复时间"
              initialValue="normal"
            >
              <Select size="large" className="glass-select">
                <Option value="normal">正常工作时间内（1-3个工作日）</Option>
                <Option value="urgent">尽快回复（24小时内）</Option>
                <Option value="immediate">立即处理（4小时内）</Option>
              </Select>
            </Form.Item>

            {/* 工单预览 */}
            <Card title="工单预览" className="glass-light">
              <Space
                direction="vertical"
                size="small"
                style={{ width: '100%' }}
              >
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    问题类型：
                  </Text>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    {categories.find(c => c.value === formData.category)?.label}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    紧急程度：
                  </Text>
                  <Tag className="priority-tag">
                    {priorities.find(p => p.value === formData.priority)?.label}
                  </Tag>
                </div>
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    问题标题：
                  </Text>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    {formData.title}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    问题描述：
                  </Text>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    {formData.description?.substring(0, 100)}...
                  </Text>
                </div>
              </Space>
            </Card>
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <FileTextOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            提交工单
          </Title>
          <Text style={{ color: 'var(--text-tertiary)' }}>
            描述您的问题，我们将尽快为您解决
          </Text>
        </header>

        <Row gutter={24}>
          {/* 左侧主要内容 */}
          <Col xs={24} lg={16}>
            {/* 步骤指示器 */}
            <Card className="glass-card animate-fade-in-up delay-100">
              <Steps current={currentStep} items={steps} />
            </Card>

            {/* 表单内容 */}
            <Card
              className="glass-card animate-fade-in-up delay-200"
              style={{ marginTop: 24 }}
            >
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormChange}
                size="large"
              >
                {renderStepContent()}
              </Form>

              {/* 操作按钮 */}
              <Divider />
              <div style={{ textAlign: 'center' }}>
                <Space size="large">
                  {currentStep > 0 && (
                    <Button onClick={prevStep} size="large">
                      上一步
                    </Button>
                  )}

                  <Button
                    icon={<SaveOutlined />}
                    onClick={saveDraft}
                    className="glass-button"
                  >
                    保存草稿
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="primary"
                      onClick={nextStep}
                      size="large"
                      className="glass-button glass-strong"
                    >
                      下一步
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={submitTicket}
                      loading={loading}
                      size="large"
                      className="glass-button glass-strong"
                    >
                      提交工单
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          </Col>

          {/* 右侧帮助区域 */}
          <Col xs={24} lg={8}>
            {/* 相关FAQ推荐 */}
            {recommendedFAQ.length > 0 && (
              <Card
                title={
                  <Space>
                    <BulbOutlined />
                    <span>相关帮助</span>
                  </Space>
                }
                className="glass-card animate-fade-in-up delay-300"
              >
                <Alert
                  message="在提交工单前，请先查看这些相关问题是否能解决您的疑问"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <List
                  dataSource={recommendedFAQ}
                  renderItem={item => (
                    <List.Item>
                      <div>
                        <Text
                          strong
                          style={{
                            display: 'block',
                            marginBottom: 4,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {item.question}
                        </Text>
                        <Text
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          {item.answer.substring(0, 60)}...
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          {item.tags.map((tag: string) => (
                            <Tag key={tag} className="glass-tag">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 联系信息 */}
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>其他联系方式</span>
                </Space>
              }
              className="glass-card animate-fade-in-up delay-400"
              style={{ marginTop: 24 }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    在线客服
                  </Text>
                  <br />
                  <Text style={{ color: 'var(--text-tertiary)' }}>
                    工作时间：9:00-18:00
                  </Text>
                  <br />
                  <Button type="link" size="small" className="glass-button">
                    立即咨询
                  </Button>
                </div>

                <Divider
                  style={{
                    margin: '12px 0',
                    borderColor: 'var(--border-color)',
                  }}
                />

                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    邮箱支持
                  </Text>
                  <br />
                  <Text style={{ color: 'var(--text-tertiary)' }}>
                    support@educhain.com
                  </Text>
                </div>

                <div>
                  <Text strong style={{ color: 'var(--text-primary)' }}>
                    电话支持
                  </Text>
                  <br />
                  <Text style={{ color: 'var(--text-tertiary)' }}>
                    400-123-4567
                  </Text>
                </div>
              </Space>
            </Card>

            {/* 响应时间说明 */}
            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  <span>响应时间</span>
                </Space>
              }
              className="glass-card animate-fade-in-up delay-500"
              style={{ marginTop: 24 }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: '100%' }}
              >
                <div>
                  <Tag className="priority-tag">普通</Tag>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    3个工作日内回复
                  </Text>
                </div>
                <div>
                  <Tag className="priority-tag">紧急</Tag>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    1个工作日内回复
                  </Text>
                </div>
                <div>
                  <Tag className="priority-tag">非常紧急</Tag>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    4小时内回复
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TicketSubmit;
