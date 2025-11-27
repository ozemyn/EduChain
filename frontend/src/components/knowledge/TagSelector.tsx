import React, { useState, useEffect } from 'react';
import { Select, Tag, Space, Input, Button, Divider, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface TagSelectorProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  size?: 'small' | 'middle' | 'large';
  showPopular?: boolean;
}

interface TagInfo {
  name: string;
  count: number;
  color?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  value = [],
  onChange,
  placeholder = '选择或输入标签',
  disabled = false,
  maxTags = 10,
  size = 'middle',
  showPopular = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<TagInfo[]>([]);
  const [popularTags, setPopularTags] = useState<TagInfo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);

  // 加载标签数据
  const loadTags = async () => {
    try {
      setLoading(true);
      
      // 模拟API调用
      const mockTags: TagInfo[] = [
        { name: 'JavaScript', count: 156, color: 'gold' },
        { name: 'React', count: 142, color: 'blue' },
        { name: 'Vue', count: 98, color: 'green' },
        { name: 'Node.js', count: 87, color: 'lime' },
        { name: 'Python', count: 76, color: 'orange' },
        { name: 'Java', count: 65, color: 'red' },
        { name: 'Spring Boot', count: 54, color: 'cyan' },
        { name: 'MySQL', count: 43, color: 'purple' },
        { name: 'Redis', count: 32, color: 'magenta' },
        { name: '算法', count: 28, color: 'volcano' },
        { name: '数据结构', count: 25, color: 'geekblue' },
        { name: '前端', count: 89, color: 'blue' },
        { name: '后端', count: 76, color: 'green' },
        { name: '全栈', count: 45, color: 'purple' },
        { name: '移动开发', count: 34, color: 'orange' },
        { name: '人工智能', count: 23, color: 'red' },
        { name: '机器学习', count: 19, color: 'volcano' },
        { name: '深度学习', count: 15, color: 'magenta' },
        { name: 'TypeScript', count: 67, color: 'blue' },
        { name: 'Angular', count: 43, color: 'red' },
        { name: 'Django', count: 32, color: 'green' },
        { name: 'Flask', count: 28, color: 'cyan' },
        { name: 'MongoDB', count: 25, color: 'lime' },
        { name: 'PostgreSQL', count: 22, color: 'geekblue' },
        { name: 'Docker', count: 38, color: 'blue' },
        { name: 'Kubernetes', count: 29, color: 'purple' },
        { name: 'AWS', count: 26, color: 'orange' },
        { name: '微服务', count: 24, color: 'gold' },
        { name: '分布式', count: 21, color: 'volcano' },
        { name: '高并发', count: 18, color: 'red' },
      ];

      setAllTags(mockTags);
      
      // 按使用次数排序，取前20个作为热门标签
      const popular = mockTags
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setPopularTags(popular);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加标签
  const addTag = (tag: string) => {
    if (!tag || value.includes(tag) || value.length >= maxTags) {
      return;
    }
    
    const newTags = [...value, tag];
    onChange?.(newTags);
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange?.(newTags);
  };

  // 处理输入确认
  const handleInputConfirm = () => {
    if (inputValue && !value.includes(inputValue) && value.length < maxTags) {
      addTag(inputValue);
    }
    setInputValue('');
    setInputVisible(false);
  };

  // 处理选择器变化
  const handleSelectChange = (selectedTags: string[]) => {
    if (selectedTags.length <= maxTags) {
      onChange?.(selectedTags);
    }
  };

  // 过滤选项
  const filterOption = (input: string, option: any) => {
    return option.children.toLowerCase().includes(input.toLowerCase());
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 主选择器 */}
      <Select
        mode="multiple"
        value={value}
        onChange={handleSelectChange}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        loading={loading}
        filterOption={filterOption}
        style={{ width: '100%' }}
        maxTagCount="responsive"
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          const tagInfo = allTags.find(tag => tag.name === label);
          return (
            <Tag
              color={tagInfo?.color || 'default'}
              closable={closable}
              onClose={onClose}
              style={{ marginRight: 3 }}
            >
              {label}
            </Tag>
          );
        }}
      >
        {allTags.map(tag => (
          <Option key={tag.name} value={tag.name}>
            <Space>
              <span>{tag.name}</span>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({tag.count})
              </Text>
            </Space>
          </Option>
        ))}
      </Select>

      {/* 已选标签显示 */}
      {value.length > 0 && (
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            已选择 {value.length}/{maxTags} 个标签：
          </Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              {value.map(tag => {
                const tagInfo = allTags.find(t => t.name === tag);
                return (
                  <Tag
                    key={tag}
                    color={tagInfo?.color || 'default'}
                    closable={!disabled}
                    onClose={() => removeTag(tag)}
                  >
                    {tag}
                  </Tag>
                );
              })}
            </Space>
          </div>
        </div>
      )}

      {/* 自定义标签输入 */}
      {!disabled && value.length < maxTags && (
        <div>
          {inputVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 200 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              placeholder="输入自定义标签"
              autoFocus
            />
          ) : (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setInputVisible(true)}
            >
              添加自定义标签
            </Button>
          )}
        </div>
      )}

      {/* 热门标签 */}
      {showPopular && popularTags.length > 0 && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          <div>
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
              热门标签（点击添加）：
            </Text>
            <Space wrap>
              {popularTags.map(tag => (
                <Tag.CheckableTag
                  key={tag.name}
                  checked={value.includes(tag.name)}
                  onChange={(checked) => {
                    if (checked) {
                      addTag(tag.name);
                    } else {
                      removeTag(tag.name);
                    }
                  }}
                  disabled={disabled || (!value.includes(tag.name) && value.length >= maxTags)}
                >
                  {tag.name} ({tag.count})
                </Tag.CheckableTag>
              ))}
            </Space>
          </div>
        </>
      )}
    </Space>
  );
};

export default TagSelector;