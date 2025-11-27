import React, { useState, useEffect } from 'react';
import {
  Card,
  Tag,
  Space,
  Typography,
  Input,
  Button,
  Row,
  Col,
  Statistic,
  Tooltip,
} from 'antd';
import { FireOutlined, TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface TagInfo {
  name: string;
  count: number;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

interface TagCloudProps {
  tags?: TagInfo[];
  onTagClick?: (tag: string) => void;
  onTagFilter?: (tags: string[]) => void;
  selectedTags?: string[];
  showSearch?: boolean;
  showStats?: boolean;
  maxTags?: number;
  title?: string;
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags = [],
  onTagClick,
  onTagFilter,
  selectedTags = [],
  showSearch = true,
  showStats = true,
  maxTags = 50,
  title = '标签云',
}) => {
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<TagInfo[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagInfo[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'cloud' | 'list'>('cloud');

  // 加载标签数据
  const loadTags = async () => {
    try {
      setLoading(true);

      // 如果没有传入tags，则使用模拟数据
      const mockTags: TagInfo[] =
        tags.length > 0
          ? tags
          : [
              {
                name: 'JavaScript',
                count: 156,
                color: 'gold',
                trend: 'up',
                trendValue: 12,
              },
              {
                name: 'React',
                count: 142,
                color: 'blue',
                trend: 'up',
                trendValue: 8,
              },
              {
                name: 'Vue',
                count: 98,
                color: 'green',
                trend: 'stable',
                trendValue: 0,
              },
              {
                name: 'Node.js',
                count: 87,
                color: 'lime',
                trend: 'up',
                trendValue: 15,
              },
              {
                name: 'Python',
                count: 76,
                color: 'orange',
                trend: 'down',
                trendValue: -3,
              },
              {
                name: 'Java',
                count: 65,
                color: 'red',
                trend: 'stable',
                trendValue: 1,
              },
              {
                name: 'Spring Boot',
                count: 54,
                color: 'cyan',
                trend: 'up',
                trendValue: 7,
              },
              {
                name: 'MySQL',
                count: 43,
                color: 'purple',
                trend: 'stable',
                trendValue: 2,
              },
              {
                name: 'Redis',
                count: 32,
                color: 'magenta',
                trend: 'up',
                trendValue: 5,
              },
              {
                name: '算法',
                count: 28,
                color: 'volcano',
                trend: 'up',
                trendValue: 4,
              },
              {
                name: '数据结构',
                count: 25,
                color: 'geekblue',
                trend: 'stable',
                trendValue: 0,
              },
              {
                name: '前端',
                count: 89,
                color: 'blue',
                trend: 'up',
                trendValue: 6,
              },
              {
                name: '后端',
                count: 76,
                color: 'green',
                trend: 'stable',
                trendValue: 1,
              },
              {
                name: '全栈',
                count: 45,
                color: 'purple',
                trend: 'up',
                trendValue: 9,
              },
              {
                name: '移动开发',
                count: 34,
                color: 'orange',
                trend: 'down',
                trendValue: -2,
              },
              {
                name: '人工智能',
                count: 23,
                color: 'red',
                trend: 'up',
                trendValue: 11,
              },
              {
                name: '机器学习',
                count: 19,
                color: 'volcano',
                trend: 'up',
                trendValue: 8,
              },
              {
                name: '深度学习',
                count: 15,
                color: 'magenta',
                trend: 'up',
                trendValue: 6,
              },
              {
                name: 'TypeScript',
                count: 67,
                color: 'blue',
                trend: 'up',
                trendValue: 13,
              },
              {
                name: 'Angular',
                count: 43,
                color: 'red',
                trend: 'down',
                trendValue: -4,
              },
              {
                name: 'Django',
                count: 32,
                color: 'green',
                trend: 'stable',
                trendValue: 1,
              },
              {
                name: 'Flask',
                count: 28,
                color: 'cyan',
                trend: 'up',
                trendValue: 3,
              },
              {
                name: 'MongoDB',
                count: 25,
                color: 'lime',
                trend: 'stable',
                trendValue: 0,
              },
              {
                name: 'PostgreSQL',
                count: 22,
                color: 'geekblue',
                trend: 'up',
                trendValue: 2,
              },
              {
                name: 'Docker',
                count: 38,
                color: 'blue',
                trend: 'up',
                trendValue: 10,
              },
              {
                name: 'Kubernetes',
                count: 29,
                color: 'purple',
                trend: 'up',
                trendValue: 7,
              },
              {
                name: 'AWS',
                count: 26,
                color: 'orange',
                trend: 'stable',
                trendValue: 1,
              },
              {
                name: '微服务',
                count: 24,
                color: 'gold',
                trend: 'up',
                trendValue: 5,
              },
              {
                name: '分布式',
                count: 21,
                color: 'volcano',
                trend: 'up',
                trendValue: 4,
              },
              {
                name: '高并发',
                count: 18,
                color: 'red',
                trend: 'stable',
                trendValue: 0,
              },
            ];

      // 按使用次数排序
      const sortedTags = mockTags
        .sort((a, b) => b.count - a.count)
        .slice(0, maxTags);
      setAllTags(sortedTags);
      setFilteredTags(sortedTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索过滤
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value) {
      const filtered = allTags.filter(tag =>
        tag.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(allTags);
    }
  };

  // 处理标签点击
  const handleTagClick = (tag: TagInfo) => {
    onTagClick?.(tag.name);
  };

  // 处理标签选择
  const handleTagSelect = (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];

    onTagFilter?.(newSelectedTags);
  };

  // 获取标签大小
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...filteredTags.map(t => t.count));
    const minCount = Math.min(...filteredTags.map(t => t.count));
    const ratio = (count - minCount) / (maxCount - minCount);

    if (ratio > 0.8) return 'large';
    if (ratio > 0.5) return 'middle';
    return 'small';
  };

  // 获取标签样式
  const getTagStyle = (tag: TagInfo) => {
    const size = getTagSize(tag.count);
    const fontSize = size === 'large' ? 16 : size === 'middle' ? 14 : 12;

    return {
      fontSize,
      margin: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };
  };

  // 渲染趋势图标
  const renderTrendIcon = (tag: TagInfo) => {
    if (!tag.trend || !tag.trendValue) return null;

    const color =
      tag.trend === 'up'
        ? '#52c41a'
        : tag.trend === 'down'
          ? '#ff4d4f'
          : '#666';
    const icon = tag.trend === 'up' ? '↗' : tag.trend === 'down' ? '↘' : '→';

    return (
      <span style={{ color, fontSize: 10, marginLeft: 4 }}>
        {icon}
        {Math.abs(tag.trendValue)}
      </span>
    );
  };

  // 渲染云模式
  const renderCloudMode = () => (
    <div style={{ textAlign: 'center', lineHeight: 2 }}>
      {filteredTags.map(tag => (
        <Tooltip
          key={tag.name}
          title={
            <div>
              <div>使用次数: {tag.count}</div>
              {tag.trend && tag.trendValue && (
                <div>
                  趋势:{' '}
                  {tag.trend === 'up'
                    ? '上升'
                    : tag.trend === 'down'
                      ? '下降'
                      : '稳定'}
                  {tag.trendValue !== 0 &&
                    ` (${tag.trendValue > 0 ? '+' : ''}${tag.trendValue})`}
                </div>
              )}
            </div>
          }
        >
          <Tag
            color={tag.color}
            style={getTagStyle(tag)}
            onClick={() => handleTagClick(tag)}
          >
            {tag.name} ({tag.count}){renderTrendIcon(tag)}
          </Tag>
        </Tooltip>
      ))}
    </div>
  );

  // 渲染列表模式
  const renderListMode = () => (
    <Row gutter={[16, 8]}>
      {filteredTags.map(tag => (
        <Col key={tag.name} xs={24} sm={12} md={8} lg={6}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleTagClick(tag)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.backgroundColor = '#f6ffed';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#f0f0f0';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Space>
              <Tag color={tag.color} style={{ margin: 0 }}>
                {tag.name}
              </Tag>
              {renderTrendIcon(tag)}
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {tag.count}
            </Text>
          </div>
        </Col>
      ))}
    </Row>
  );

  // 统计信息
  const totalTags = allTags.length;
  const totalUsage = allTags.reduce((sum, tag) => sum + tag.count, 0);
  const hotTags = allTags.filter(tag => tag.trend === 'up').length;

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  return (
    <Card
      title={
        <Space>
          <TagOutlined />
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Button
            type={viewMode === 'cloud' ? 'primary' : 'default'}
            size="small"
            onClick={() => setViewMode('cloud')}
          >
            云模式
          </Button>
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            size="small"
            onClick={() => setViewMode('list')}
          >
            列表模式
          </Button>
        </Space>
      }
      loading={loading}
    >
      {showSearch && (
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索标签..."
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            allowClear
          />
        </div>
      )}

      {showStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Statistic
              title="总标签数"
              value={totalTags}
              prefix={<TagOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic title="总使用次数" value={totalUsage} />
          </Col>
          <Col span={8}>
            <Statistic
              title="热门标签"
              value={hotTags}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
      )}

      {filteredTags.length > 0 ? (
        viewMode === 'cloud' ? (
          renderCloudMode()
        ) : (
          renderListMode()
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          {searchValue ? '没有找到匹配的标签' : '暂无标签数据'}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            已选择的标签：
          </Text>
          <Space wrap>
            {selectedTags.map(tagName => {
              const tag = allTags.find(t => t.name === tagName);
              return (
                <Tag
                  key={tagName}
                  color={tag?.color || 'default'}
                  closable
                  onClose={() => handleTagSelect(tagName)}
                >
                  {tagName}
                </Tag>
              );
            })}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default TagCloud;
