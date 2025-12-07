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

  const versions = [
    {
      version: '2.1.0',
      date: '2025-12-07',
      status: 'latest',
      description: '重大功能更新，新增区块链存证 2.0 和智能推荐系统',
      changes: [
        {
          type: 'feature',
          title: '区块链存证 2.0',
          description:
            '全新的区块链存证系统，支持批量存证和智能合约验证，存证速度提升 300%，新增法律级别证书',
        },
        {
          type: 'feature',
          title: '智能推荐系统',
          description:
            '基于深度学习的个性化内容推荐，推荐准确率提升至 85%，支持多维度兴趣建模',
        },
        {
          type: 'feature',
          title: '多语言支持',
          description:
            '新增英语、日语、韩语界面支持，覆盖更多国际用户，支持实时翻译功能',
        },
        {
          type: 'feature',
          title: '高级搜索引擎',
          description:
            '全新的搜索引擎，支持语义搜索、图像搜索、语音搜索，搜索结果更精准',
        },
        {
          type: 'feature',
          title: '协作编辑器',
          description:
            '实时协作编辑功能，支持多人同时编辑文档，类似 Google Docs 的体验',
        },
        {
          type: 'feature',
          title: 'AI 内容助手',
          description:
            '集成 GPT-4 的智能写作助手，帮助用户生成高质量内容，支持多种写作风格',
        },
        {
          type: 'improvement',
          title: '搜索性能优化',
          description:
            '搜索响应时间减少 60%，支持更复杂的查询语法，新增搜索建议和自动补全',
        },
        {
          type: 'improvement',
          title: '移动端体验优化',
          description:
            '重新设计移动端界面，提升触摸操作体验，支持手势导航和离线阅读',
        },
        {
          type: 'improvement',
          title: '视频播放器升级',
          description:
            '全新的视频播放器，支持 4K 播放、倍速播放、字幕显示、画中画模式',
        },
        {
          type: 'improvement',
          title: '通知系统重构',
          description:
            '重新设计通知系统，支持实时推送、智能分类、批量操作，减少打扰',
        },
        {
          type: 'bugfix',
          title: '修复文件上传问题',
          description: '解决大文件上传时的内存溢出问题，支持断点续传和并发上传',
        },
        {
          type: 'bugfix',
          title: '修复评论系统 Bug',
          description: '修复评论嵌套显示错误、表情符号显示异常等问题',
        },
        {
          type: 'security',
          title: '安全性增强',
          description:
            '升级加密算法，增强用户数据安全保护，新增异常登录检测和自动风控',
        },
        {
          type: 'security',
          title: '隐私保护升级',
          description:
            '符合 GDPR 和国内数据保护法规，用户可完全控制个人数据的使用和删除',
        },
      ],
    },
    {
      version: '2.0.8',
      date: '2025-11-30',
      status: 'stable',
      description: '稳定性更新和用户体验优化',
      changes: [
        {
          type: 'feature',
          title: '内容模板系统',
          description:
            '新增内容模板功能，提供论文、教程、笔记等多种模板，提高创作效率',
        },
        {
          type: 'feature',
          title: '学习路径规划',
          description: '智能学习路径推荐，根据用户水平和目标制定个性化学习计划',
        },
        {
          type: 'improvement',
          title: '编辑器功能增强',
          description:
            '富文本编辑器新增表格编辑、代码高亮、数学公式、流程图等功能',
        },
        {
          type: 'improvement',
          title: '社区功能优化',
          description: '优化讨论区界面，新增话题标签、热门排序、专家认证等功能',
        },
        {
          type: 'bugfix',
          title: '修复同步问题',
          description: '解决多设备间数据同步延迟和冲突问题',
        },
        {
          type: 'bugfix',
          title: '修复导出功能',
          description: '修复 PDF 导出格式错误、图片丢失等问题',
        },
      ],
    },
    {
      version: '2.0.5',
      date: '2025-11-28',
      status: 'stable',
      description: '稳定性更新和性能优化',
      changes: [
        {
          type: 'improvement',
          title: '数据库性能优化',
          description: '优化数据库查询，整体响应速度提升 40%',
        },
        {
          type: 'improvement',
          title: '缓存机制优化',
          description: '改进 Redis 缓存策略，减少数据库压力',
        },
        {
          type: 'bugfix',
          title: '修复评论显示问题',
          description: '解决长评论内容显示不完整的问题',
        },
        {
          type: 'bugfix',
          title: '修复通知推送',
          description: '修复部分用户收不到系统通知的问题',
        },
      ],
    },
    {
      version: '2.0.0',
      date: '2025-11-15',
      status: 'major',
      description: '重大版本更新，全新的用户界面和核心功能重构',
      changes: [
        {
          type: 'breaking',
          title: 'API v2.0 发布',
          description: '全新的 API 架构，不兼容 v1.x 版本，请参考迁移指南',
        },
        {
          type: 'feature',
          title: '全新用户界面',
          description:
            '采用 Material Design 3.0 设计语言，提供更现代的用户体验',
        },
        {
          type: 'feature',
          title: '实时协作功能',
          description: '支持多人实时编辑文档，类似 Google Docs 的协作体验',
        },
        {
          type: 'feature',
          title: '高级搜索',
          description: '支持全文搜索、标签筛选、时间范围等高级搜索功能',
        },
        {
          type: 'improvement',
          title: '性能大幅提升',
          description: '页面加载速度提升 200%，支持更大规模的并发访问',
        },
        {
          type: 'security',
          title: '双因素认证',
          description: '新增 2FA 支持，提供更高级别的账户安全保护',
        },
      ],
    },
    {
      version: '1.9.8',
      date: '2025-10-30',
      status: 'legacy',
      description: '最后一个 1.x 版本，主要包含安全更新和关键修复',
      changes: [
        {
          type: 'security',
          title: '安全漏洞修复',
          description: '修复 XSS 和 CSRF 相关安全漏洞',
        },
        {
          type: 'bugfix',
          title: '修复数据同步问题',
          description: '解决多设备间数据同步不一致的问题',
        },
        {
          type: 'improvement',
          title: '兼容性改进',
          description: '提升对旧版浏览器的兼容性支持',
        },
      ],
    },
    {
      version: '1.9.5',
      date: '2025-10-15',
      status: 'legacy',
      description: '性能优化和新功能发布',
      changes: [
        {
          type: 'feature',
          title: '直播功能上线',
          description: '支持在线直播教学，包括屏幕共享、白板、互动问答等功能',
        },
        {
          type: 'feature',
          title: '作业系统',
          description: '教师可发布作业，学生在线提交，支持自动批改和人工评分',
        },
        {
          type: 'improvement',
          title: '数据库性能优化',
          description: '优化数据库查询，整体响应速度提升 40%，支持更大并发量',
        },
        {
          type: 'improvement',
          title: '缓存机制优化',
          description: '改进 Redis 缓存策略，减少数据库压力，提升用户体验',
        },
        {
          type: 'bugfix',
          title: '修复评论显示问题',
          description: '解决长评论内容显示不完整、表情符号错位等问题',
        },
        {
          type: 'bugfix',
          title: '修复通知推送',
          description: '修复部分用户收不到系统通知、推送延迟等问题',
        },
      ],
    },
    {
      version: '1.9.0',
      date: '2025-10-01',
      status: 'legacy',
      description: '功能增强版本，新增社区功能和内容管理工具',
      changes: [
        {
          type: 'feature',
          title: '社区功能上线',
          description:
            '新增用户社区、讨论组和话题功能，支持创建兴趣小组和专业社群',
        },
        {
          type: 'feature',
          title: '内容管理工具',
          description:
            '为创作者提供更强大的内容管理和分析工具，包括数据统计、收益分析等',
        },
        {
          type: 'feature',
          title: '知识图谱',
          description: '构建学科知识图谱，帮助用户理解知识点之间的关联关系',
        },
        {
          type: 'improvement',
          title: '通知系统优化',
          description: '重新设计通知系统，支持更细粒度的通知设置和智能推送',
        },
        {
          type: 'improvement',
          title: '搜索算法优化',
          description: '改进搜索排序算法，提高搜索结果的相关性和准确性',
        },
        {
          type: 'bugfix',
          title: '修复权限问题',
          description: '修复部分用户权限异常、无法访问付费内容等问题',
        },
      ],
    },
    {
      version: '1.8.5',
      date: '2025-09-20',
      status: 'legacy',
      description: '用户体验优化和 Bug 修复',
      changes: [
        {
          type: 'feature',
          title: '离线阅读',
          description: '支持内容离线下载，无网络环境下也能学习',
        },
        {
          type: 'feature',
          title: '学习笔记',
          description: '集成笔记功能，支持在内容中添加个人笔记和标注',
        },
        {
          type: 'improvement',
          title: '界面响应式优化',
          description: '优化各种屏幕尺寸下的显示效果，提升移动端体验',
        },
        {
          type: 'improvement',
          title: '加载速度优化',
          description: '优化资源加载策略，首屏加载时间减少 35%',
        },
        {
          type: 'bugfix',
          title: '修复视频播放问题',
          description: '解决某些浏览器下视频无法播放、卡顿等问题',
        },
        {
          type: 'bugfix',
          title: '修复数据统计错误',
          description: '修复用户数据统计不准确、重复计算等问题',
        },
      ],
    },
    {
      version: '1.8.0',
      date: '2025-09-01',
      status: 'legacy',
      description: '重要功能更新，新增付费内容和会员系统',
      changes: [
        {
          type: 'feature',
          title: '付费内容系统',
          description: '支持创作者发布付费内容，多种定价模式和分成机制',
        },
        {
          type: 'feature',
          title: '会员订阅',
          description: '推出会员订阅服务，享受专属内容和特权功能',
        },
        {
          type: 'feature',
          title: '内容推荐算法',
          description: '基于用户行为的智能推荐算法，提高内容发现效率',
        },
        {
          type: 'feature',
          title: '多媒体支持增强',
          description: '支持更多文件格式，包括 3D 模型、交互式内容等',
        },
        {
          type: 'improvement',
          title: '安全性提升',
          description: '加强账户安全验证，新增二次验证和设备管理功能',
        },
        {
          type: 'improvement',
          title: 'API 性能优化',
          description: 'API 响应时间优化，支持更高并发访问',
        },
        {
          type: 'bugfix',
          title: '修复内存泄漏',
          description: '解决长时间使用导致的内存泄漏问题',
        },
      ],
    },
    {
      version: '1.7.2',
      date: '2025-08-15',
      status: 'legacy',
      description: '稳定性更新和小功能改进',
      changes: [
        {
          type: 'feature',
          title: '内容版本控制',
          description: '支持内容版本管理，可查看历史版本和变更记录',
        },
        {
          type: 'improvement',
          title: '编辑器性能优化',
          description: '优化富文本编辑器性能，支持更大文档的流畅编辑',
        },
        {
          type: 'improvement',
          title: '图片处理优化',
          description: '自动图片压缩和格式转换，减少存储空间和加载时间',
        },
        {
          type: 'bugfix',
          title: '修复导入导出问题',
          description: '解决从其他平台导入内容时的格式兼容性问题',
        },
        {
          type: 'bugfix',
          title: '修复搜索索引',
          description: '修复搜索索引更新延迟导致的搜索结果不准确问题',
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
          <Text type="secondary">跟踪 EduChain 的每一次进步</Text>
        </header>

        {/* 版本统计 */}
        <Card className="version-stats glass-card animate-fade-in-up delay-100">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2.1.0</div>
              <div className="stat-label">当前版本</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">287</div>
              <div className="stat-label">总更新次数</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">156</div>
              <div className="stat-label">新功能</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">423</div>
              <div className="stat-label">问题修复</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">89</div>
              <div className="stat-label">性能优化</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">67</div>
              <div className="stat-label">安全更新</div>
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
                  <strong>版本支持政策</strong>
                  <div style={{ marginTop: 8 }}>
                    <p>• 最新版本：持续更新和技术支持</p>
                    <p>• 稳定版本：安全更新和关键修复</p>
                    <p>• 历史版本：仅提供安全更新</p>
                    <p>• 建议用户及时升级到最新版本以获得最佳体验</p>
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
