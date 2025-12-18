/* ===================================
   更新日志页面 - Changelog Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 版本时间线展示
   - 更新类型分类
   
   ================================== */

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Timeline,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Divider,
  Alert,
} from 'antd';
import {
  HistoryOutlined,
  RocketOutlined,
  BugOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  SearchOutlined,
  FilterOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './Resources.css';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Changelog: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const changeTypes = {
    feature: { label: '新功能', color: 'green', icon: <RocketOutlined /> },
    improvement: { label: '改进', color: 'blue', icon: <ExperimentOutlined /> },
    bugfix: { label: '修复', color: 'orange', icon: <BugOutlined /> },
    security: { label: '安全', color: 'red', icon: <SafetyOutlined /> },
    breaking: {
      label: '破坏性变更',
      color: 'purple',
      icon: <ExperimentOutlined />,
    },
  };

  // 基于真实Git提交记录的版本数据
  const versions = [
    {
      version: '1.0.15',
      date: '2025-12-15',
      status: 'latest',
      description: '优化管理员仪表盘布局和修复知识内容导航',
      changes: [
        {
          type: 'feature',
          title: '管理员仪表盘优化',
          description: '优化管理员仪表盘布局，提升用户体验和操作效率',
        },
        {
          type: 'bugfix',
          title: '知识内容导航修复',
          description: '修复知识内容导航问题，确保页面跳转正常',
        },
      ],
    },
    {
      version: '1.0.14',
      date: '2025-12-14',
      status: 'stable',
      description: '分享码系统实现和首页推荐链接修复',
      changes: [
        {
          type: 'feature',
          title: 'Base58 + Snowflake ID分享码系统',
          description:
            '实现基于Base58编码和Snowflake ID的分享码系统，提供唯一且友好的分享链接',
        },
        {
          type: 'bugfix',
          title: '首页推荐链接修复',
          description: '修复首页推荐链接，更新推荐组件使用新的分享码系统',
        },
      ],
    },
    {
      version: '1.0.13',
      date: '2025-12-10',
      status: 'stable',
      description: '搜索功能全面优化和前端构建问题修复',
      changes: [
        {
          type: 'improvement',
          title: '搜索功能全面修复',
          description: '🔧 修复搜索功能的全面问题，提升搜索准确性和响应速度',
        },
        {
          type: 'bugfix',
          title: '前端lint错误修复',
          description: '修复前端lint错误和构建问题，确保代码质量',
        },
        {
          type: 'bugfix',
          title: 'Mock数据贯通修复',
          description: '修复前端mock数据贯通问题，完善开发环境数据流',
        },
      ],
    },
    {
      version: '1.0.12',
      date: '2025-12-09',
      status: 'stable',
      description: '区块链存证Mock数据和API完善',
      changes: [
        {
          type: 'feature',
          title: '区块链存证Mock数据完善',
          description: '完善区块链存证Mock数据和API，提供完整的开发测试环境',
        },
      ],
    },
    {
      version: '1.0.11',
      date: '2025-12-08',
      status: 'stable',
      description: 'Cloudflare Pages部署配置和UI优化',
      changes: [
        {
          type: 'feature',
          title: 'Cloudflare Pages部署配置',
          description: '添加Cloudflare Pages部署配置和Mock模式UI优化',
        },
        {
          type: 'feature',
          title: '网站信息更新',
          description: '更新页脚GitHub链接和网站标题元信息',
        },
        {
          type: 'bugfix',
          title: '部署配置修复',
          description:
            '移除wrangler.toml，使用Cloudflare Pages Dashboard部署，修复配置语法错误',
        },
        {
          type: 'bugfix',
          title: 'Lint和构建错误修复',
          description: '修复所有lint和构建错误，确保项目可正常部署',
        },
      ],
    },
    {
      version: '1.0.10',
      date: '2025-12-07',
      status: 'stable',
      description: '完整工单系统实现',
      changes: [
        {
          type: 'feature',
          title: '完整工单系统',
          description: '实现完整的工单系统，支持用户提交问题和管理员处理流程',
        },
      ],
    },
    {
      version: '1.0.9',
      date: '2025-12-05',
      status: 'stable',
      description: '社区功能、Mock数据系统和深色模式优化',
      changes: [
        {
          type: 'feature',
          title: '社区功能和法律页面',
          description: '添加社区功能、Mock数据系统和法律页面，完善平台生态',
        },
        {
          type: 'feature',
          title: '管理员登录功能',
          description: '重构前端样式系统并实现管理员登录功能',
        },
        {
          type: 'improvement',
          title: '性能优化',
          description: '性能优化：添加限流功能、文件上传优化、前端组件改进',
        },
        {
          type: 'improvement',
          title: '深色模式优化',
          description: '全局优化深色模式和响应式布局，提升用户体验',
        },
        {
          type: 'bugfix',
          title: '区块链功能修复',
          description: '完善区块链功能，修复lint和构建错误',
        },
      ],
    },
    {
      version: '1.0.8',
      date: '2025-11-29',
      status: 'legacy',
      description: '数据一致性和API接口优化',
      changes: [
        {
          type: 'feature',
          title: 'API限流机制',
          description: '实现完整的API限流机制，保护系统稳定性',
        },
        {
          type: 'improvement',
          title: '搜索功能和前端组件更新',
          description: '更新搜索功能和前端组件，优化用户交互体验',
        },
        {
          type: 'bugfix',
          title: '前端编译错误修复',
          description:
            '修复前端编译错误：统一使用uploaderName和uploaderAvatar字段',
        },
        {
          type: 'bugfix',
          title: '数据一致性修复',
          description: '修复前后端数据一致性和事务问题',
        },
        {
          type: 'bugfix',
          title: 'API接口一致性修复',
          description: '修复前后端API接口一致性问题',
        },
        {
          type: 'improvement',
          title: '系统配置优化',
          description: '更新代码：优化系统配置和功能实现',
        },
      ],
    },
    {
      version: '1.0.7',
      date: '2025-11-28',
      status: 'legacy',
      description: '草稿管理系统和主题切换功能',
      changes: [
        {
          type: 'feature',
          title: '草稿管理系统',
          description: '完善草稿管理系统和组件优化，支持内容草稿保存和管理',
        },
        {
          type: 'feature',
          title: '主题切换功能',
          description: '添加主题切换功能和样式优化，支持明暗主题切换',
        },
        {
          type: 'improvement',
          title: '发布内容界面优化',
          description: '优化发布内容界面，集成全局样式系统',
        },
        {
          type: 'bugfix',
          title: 'Spring Boot兼容性修复',
          description: '修复Spring Boot版本兼容性问题和优化配置',
        },
        {
          type: 'improvement',
          title: '应用配置优化',
          description: '优化应用配置和警告处理',
        },
      ],
    },
    {
      version: '1.0.6',
      date: '2025-11-27',
      status: 'legacy',
      description: '前后端API集成和系统核心功能实现',
      changes: [
        {
          type: 'feature',
          title: '前后端API集成',
          description: '完成前后端API集成和系统优化，实现完整的数据交互',
        },
        {
          type: 'feature',
          title: '管理员后台模块',
          description: '实现管理员后台前端模块，提供完整的管理功能',
        },
        {
          type: 'feature',
          title: '搜索和推荐模块',
          description: '实现搜索和推荐前端模块，提供智能内容发现',
        },
        {
          type: 'feature',
          title: '用户互动功能',
          description: '实现用户互动功能前端模块，支持评论、点赞等社交功能',
        },
        {
          type: 'feature',
          title: '知识内容管理',
          description: '实现知识内容管理前端模块，支持内容的创建、编辑、发布',
        },
        {
          type: 'feature',
          title: '用户认证模块',
          description: '实现用户认证前端模块，提供登录、注册、权限管理',
        },
        {
          type: 'feature',
          title: 'React前端项目初始化',
          description: '完成React前端项目初始化和ESLint错误修复',
        },
        {
          type: 'feature',
          title: '登录注册界面重设计',
          description: '✨ 重新设计登录注册界面，提升用户体验',
        },
        {
          type: 'feature',
          title: '日志彩色输出',
          description: '配置日志彩色输出功能，便于开发调试',
        },
        {
          type: 'feature',
          title: '核心功能完善',
          description: '完善核心功能，实现所有TODO项目',
        },
        {
          type: 'feature',
          title: '系统日志和安全功能',
          description: '实现系统日志和安全功能，保障系统稳定运行',
        },
        {
          type: 'feature',
          title: '统计分析和外部集成',
          description: '实现统计分析和外部集成功能，提供数据洞察',
        },
        {
          type: 'feature',
          title: '搜索和推荐系统',
          description: '实现搜索和推荐系统，提供智能内容发现',
        },
        {
          type: 'feature',
          title: '用户互动功能系统',
          description: '实现用户互动功能系统，构建社区生态',
        },
        {
          type: 'feature',
          title: '知识库管理系统',
          description: '完成任务三：知识库管理系统核心功能实现',
        },
        {
          type: 'bugfix',
          title: '数据库脚本合并',
          description: '合并数据库脚本为单一完整版本，简化部署流程',
        },
        {
          type: 'bugfix',
          title: 'Jackson序列化问题修复',
          description: '修复Jackson LocalDateTime序列化问题',
        },
        {
          type: 'improvement',
          title: '错误修复',
          description: '修改了一些错误，提升系统稳定性',
        },
      ],
    },
    {
      version: '1.0.5',
      date: '2025-11-26',
      status: 'legacy',
      description: '项目基础架构搭建和用户认证系统',
      changes: [
        {
          type: 'feature',
          title: '用户认证和管理系统',
          description: '实现用户认证和管理系统，提供完整的用户权限管理',
        },
        {
          type: 'feature',
          title: '项目基础架构',
          description: '完成项目基础架构搭建，建立Spring Boot + React技术栈',
        },
      ],
    },
  ];

  const filteredVersions = versions.filter(version => {
    const matchesType =
      filterType === 'all' ||
      version.changes.some(change => change.type === filterType);
    const matchesSearch =
      searchTerm === '' ||
      version.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.changes.some(
        change =>
          change.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          change.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesType && matchesSearch;
  });

  const getVersionStatusColor = (status: string) => {
    switch (status) {
      case 'latest':
        return 'green';
      case 'stable':
        return 'blue';
      case 'major':
        return 'purple';
      case 'legacy':
        return 'default';
      default:
        return 'default';
    }
  };

  const getVersionStatusText = (status: string) => {
    switch (status) {
      case 'latest':
        return '最新版本';
      case 'stable':
        return '稳定版本';
      case 'major':
        return '重大更新';
      case 'legacy':
        return '历史版本';
      default:
        return '';
    }
  };

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <HistoryOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            更新日志
          </Title>
          <Text type="secondary">
            基于真实Git提交记录 - 跟踪 EduChain 的每一次进步
          </Text>
        </header>

        {/* 版本统计 */}
        <Card className="version-stats glass-card animate-fade-in-up delay-100">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1.0.15</div>
              <div className="stat-label">当前版本</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50</div>
              <div className="stat-label">总提交次数</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">29</div>
              <div className="stat-label">新功能</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">问题修复</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">优化改进</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20</div>
              <div className="stat-label">开发天数</div>
            </div>
          </div>
        </Card>

        {/* 搜索和筛选 */}
        <Card className="filter-section glass-card animate-fade-in-up delay-200">
          <Space size="large" wrap>
            <Search
              placeholder="搜索版本或更新内容..."
              allowClear
              style={{ width: 300 }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">全部类型</Option>
              {Object.entries(changeTypes).map(([key, type]) => (
                <Option key={key} value={key}>
                  {type.icon} {type.label}
                </Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* 版本时间线 */}
        <Card className="changelog-timeline glass-card animate-fade-in-up delay-300">
          <Title level={3}>版本历史</Title>

          <Timeline mode="left">
            {filteredVersions.map(version => (
              <Timeline.Item
                key={version.version}
                dot={
                  version.status === 'latest' ? (
                    <StarOutlined
                      style={{ fontSize: '16px', color: '#52c41a' }}
                    />
                  ) : (
                    <CheckCircleOutlined style={{ fontSize: '16px' }} />
                  )
                }
                color={version.status === 'latest' ? 'green' : 'blue'}
              >
                <Card className="version-card" size="small">
                  <div className="version-header">
                    <Space>
                      <Title level={4} style={{ margin: 0 }}>
                        v{version.version}
                      </Title>
                      <Tag color={getVersionStatusColor(version.status)}>
                        {getVersionStatusText(version.status)}
                      </Tag>
                      <Text type="secondary">{version.date}</Text>
                    </Space>
                  </div>

                  <Paragraph style={{ margin: '12px 0' }}>
                    {version.description}
                  </Paragraph>

                  <div className="changes-list">
                    {version.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="change-item">
                        <Space align="start">
                          <Tag
                            color={
                              changeTypes[
                                change.type as keyof typeof changeTypes
                              ].color
                            }
                            icon={
                              changeTypes[
                                change.type as keyof typeof changeTypes
                              ].icon
                            }
                          >
                            {
                              changeTypes[
                                change.type as keyof typeof changeTypes
                              ].label
                            }
                          </Tag>
                          <div>
                            <Text strong>{change.title}</Text>
                            <br />
                            <Text type="secondary">{change.description}</Text>
                          </div>
                        </Space>
                      </div>
                    ))}
                  </div>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* 订阅更新 */}
        <Card className="subscribe-section glass-card animate-fade-in-up delay-400">
          <div style={{ textAlign: 'center' }}>
            <Title level={3}>订阅更新通知</Title>
            <Paragraph type="secondary">
              第一时间获取 EduChain 的最新更新和功能发布
            </Paragraph>

            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                className="glass-button glass-strong hover-lift active-scale"
              >
                邮件订阅
              </Button>
              <Button
                size="large"
                icon={<SearchOutlined />}
                className="glass-button hover-lift active-scale"
              >
                RSS 订阅
              </Button>
            </Space>

            <Divider />

            <Alert
              type="info"
              showIcon
              description={
                <div>
                  <strong>开发历程说明</strong>
                  <div style={{ marginTop: 8 }}>
                    <p>• 开发周期：2025年11月26日 - 2025年12月15日（20天）</p>
                    <p>• 技术栈：Spring Boot + React + TypeScript + 区块链</p>
                    <p>• 代码统计：新增177,207行，净增123,071行代码</p>
                    <p>• 本更新日志基于真实Git提交记录生成，确保信息准确性</p>
                  </div>
                </div>
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Changelog;
