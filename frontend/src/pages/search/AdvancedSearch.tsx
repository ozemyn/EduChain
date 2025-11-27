import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
} from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Category } from '@/types/api';
import { categoryService } from '@/services';
import styles from './AdvancedSearch.module.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface AdvancedSearchForm {
  keyword?: string;
  title?: string;
  content?: string;
  author?: string;
  categoryId?: number;
  type?: string;
  tags?: string[];
  dateRange?: [string, string];
  sortBy?: string;
}

const CONTENT_TYPES = [
  { label: '文本', value: 'TEXT' },
  { label: '图片', value: 'IMAGE' },
  { label: '视频', value: 'VIDEO' },
  { label: 'PDF', value: 'PDF' },
  { label: '链接', value: 'LINK' },
];

const SORT_OPTIONS = [
  { label: '相关性', value: 'RELEVANCE' },
  { label: '发布时间（最新）', value: 'TIME_DESC' },
  { label: '发布时间（最早）', value: 'TIME_ASC' },
  { label: '热度（最高）', value: 'POPULARITY_DESC' },
  { label: '热度（最低）', value: 'POPULARITY_ASC' },
];

const POPULAR_TAGS = [
  'JavaScript',
  'React',
  'Vue',
  'Node.js',
  'Python',
  'Java',
  '前端开发',
  '后端开发',
  '数据库',
  '算法',
  '设计模式',
  '机器学习',
  'HTML',
  'CSS',
  'TypeScript',
  'Angular',
  'Spring',
  'Django',
  '数据结构',
  '网络安全',
  '人工智能',
  '区块链',
  '云计算',
  '微服务',
];

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<AdvancedSearchForm>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    form.setFieldValue('tags', newTags);
  };

  const handleSearch = (values: AdvancedSearchForm) => {
    setLoading(true);

    // 构建搜索参数
    const searchParams = new URLSearchParams();

    // 组合关键词搜索
    const keywords = [];
    if (values.keyword) keywords.push(values.keyword);
    if (values.title) keywords.push(`title:${values.title}`);
    if (values.content) keywords.push(`content:${values.content}`);
    if (values.author) keywords.push(`author:${values.author}`);

    if (keywords.length > 0) {
      searchParams.set('q', keywords.join(' '));
    }

    if (values.categoryId) {
      searchParams.set('categoryId', values.categoryId.toString());
    }

    if (values.type) {
      searchParams.set('type', values.type);
    }

    if (values.tags && values.tags.length > 0) {
      searchParams.set('tags', values.tags.join(','));
    }

    if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
      searchParams.set('startDate', values.dateRange[0]);
      searchParams.set('endDate', values.dateRange[1]);
    }

    if (values.sortBy) {
      searchParams.set('sortBy', values.sortBy);
    }

    // 跳转到搜索结果页
    navigate(`/search?${searchParams.toString()}`);
    setLoading(false);
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedTags([]);
  };

  const renderCategoryOptions = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <Option value={category.id}>
          {'　'.repeat(level)}
          {category.name}
        </Option>
        {category.children &&
          renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.advancedSearch}>
      <div className={styles.header}>
        <Title level={2}>高级搜索</Title>
        <Text type="secondary">使用更精确的条件来搜索您需要的内容</Text>
      </div>

      <Card className={styles.searchCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          initialValues={{
            sortBy: 'RELEVANCE',
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="关键词"
                name="keyword"
                tooltip="在标题和内容中搜索关键词"
              >
                <Input placeholder="输入搜索关键词" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="标题" name="title" tooltip="仅在标题中搜索">
                <Input placeholder="搜索标题中的关键词" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="内容" name="content" tooltip="仅在内容中搜索">
                <TextArea placeholder="搜索内容中的关键词" rows={3} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="作者"
                name="author"
                tooltip="搜索特定作者的内容"
              >
                <Input placeholder="输入作者用户名或姓名" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="分类" name="categoryId">
                <Select placeholder="选择分类" size="large" allowClear>
                  {renderCategoryOptions(categories)}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="内容类型" name="type">
                <Select placeholder="选择内容类型" size="large" allowClear>
                  {CONTENT_TYPES.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="排序方式" name="sortBy">
                <Select size="large">
                  {SORT_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="发布时间" name="dateRange">
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="标签"
                name="tags"
                tooltip="选择相关标签来精确搜索"
              >
                <div className={styles.tagSection}>
                  <div className={styles.tagContainer}>
                    {POPULAR_TAGS.map(tag => (
                      <Tag
                        key={tag}
                        color={selectedTags.includes(tag) ? 'blue' : 'default'}
                        onClick={() => handleTagToggle(tag)}
                        className={styles.tagItem}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className={styles.selectedTags}>
                      <Text strong>已选择的标签：</Text>
                      {selectedTags.map(tag => (
                        <Tag
                          key={tag}
                          color="blue"
                          closable
                          onClose={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.actions}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                size="large"
                loading={loading}
              >
                开始搜索
              </Button>
              <Button
                icon={<ClearOutlined />}
                size="large"
                onClick={handleReset}
              >
                重置条件
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
