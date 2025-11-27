import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Button, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { CategorySelector } from '@/components/knowledge';


const { Search } = Input;
const { Option } = Select;

interface KnowledgeFilterProps {
  onFilter: (filters: FilterValues) => void;
  loading?: boolean;
}

export interface FilterValues {
  keyword?: string;
  categoryId?: number;
  type?: string;
  sortBy?: string;
  tags?: string[];
}

const KnowledgeFilter: React.FC<KnowledgeFilterProps> = ({
  onFilter,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const contentTypes = [
    { label: '全部类型', value: '' },
    { label: '文本', value: 'TEXT' },
    { label: '图片', value: 'IMAGE' },
    { label: '视频', value: 'VIDEO' },
    { label: 'PDF', value: 'PDF' },
    { label: '链接', value: 'LINK' },
  ];

  const sortOptions = [
    { label: '最新发布', value: 'TIME' },
    { label: '最受欢迎', value: 'POPULARITY' },
    { label: '相关性', value: 'RELEVANCE' },
  ];

  const popularTags = [
    'JavaScript', 'React', 'Vue', 'Node.js', 'Python', 'Java',
    'Spring Boot', 'MySQL', 'Redis', '算法', '数据结构', '前端',
    '后端', '全栈', '移动开发', '人工智能', '机器学习', '深度学习'
  ];

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    handleFilterChange('tags', newTags);
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    setSelectedTags([]);
    onFilter(clearedFilters);
  };



  useEffect(() => {
    // 自动搜索当关键词变化时
    if (filters.keyword !== undefined) {
      const timer = setTimeout(() => {
        onFilter(filters);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.keyword]);

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索知识内容..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              onSearch={handleSearch}
              loading={loading}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <CategorySelector
              placeholder="选择分类"
              value={filters.categoryId}
              onChange={(value) => handleFilterChange('categoryId', value)}
              allowClear
              showCount
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="内容类型"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
            >
              {contentTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="排序方式"
              value={filters.sortBy || 'TIME'}
              onChange={(value) => handleFilterChange('sortBy', value)}
              style={{ width: '100%' }}
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#666', fontSize: '14px' }}>热门标签：</span>
          </div>
          <Space wrap>
            {popularTags.map(tag => (
              <Tag.CheckableTag
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>

        <Row justify="end">
          <Space>
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
            >
              清空筛选
            </Button>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              loading={loading}
            >
              搜索
            </Button>
          </Space>
        </Row>
      </Space>
    </Card>
  );
};

export default KnowledgeFilter;