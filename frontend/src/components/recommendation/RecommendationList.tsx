import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin, Empty, Button, Alert, Tabs } from 'antd';
import {
  ReloadOutlined,
  FireOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import RecommendationCard from './RecommendationCard';
import { searchService } from '@/services/search';
import type { KnowledgeItem } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import styles from './RecommendationList.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface RecommendationListProps {
  title?: string;
  showTabs?: boolean;
  defaultTab?: string;
  limit?: number;
  compact?: boolean;
  className?: string;
}

interface RecommendationData {
  personalized: KnowledgeItem[];
  trending: KnowledgeItem[];
  general: KnowledgeItem[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  title = '推荐内容',
  showTabs = true,
  defaultTab = 'personalized',
  limit = 10,
  compact = false,
  className,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<RecommendationData>({
    personalized: [],
    trending: [],
    general: [],
  });
  const [loading, setLoading] = useState(true); // 初始设置为true，显示加载状态
  const [error, setError] = useState<string | null>(null);
  // 如果用户未登录，默认显示热门内容而不是个性化推荐
  const [activeTab, setActiveTab] = useState(user ? defaultTab : 'trending');
  const [currentPage, setCurrentPage] = useState(0); // 当前页面索引

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, limit]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = [
        // 个性化推荐（需要登录）
        user
          ? searchService.getPersonalizedRecommendations(8) // 固定获取8个
          : Promise.resolve({ data: [] }),
        // 热门内容
        searchService.getTrendingContent('week', 8), // 固定获取8个
        // 通用推荐
        searchService.getRecommendations(undefined, 8), // 固定获取8个
      ];

      const [personalizedRes, trendingRes, generalRes] =
        await Promise.all(promises);

      const newData = {
        personalized: personalizedRes.data || [],
        trending: trendingRes.data || [],
        general: generalRes.data || [],
      };

      setData(newData);

      // 如果当前标签没有数据，自动切换到有数据的标签
      const currentTabData = newData[activeTab as keyof RecommendationData];
      if (!currentTabData || currentTabData.length === 0) {
        // 按优先级查找有数据的标签
        if (newData.trending.length > 0) {
          setActiveTab('trending');
        } else if (newData.general.length > 0) {
          setActiveTab('general');
        } else if (newData.personalized.length > 0) {
          setActiveTab('personalized');
        }
      }
    } catch (err: unknown) {
      // 只有在真正的错误时才显示错误提示，数据为空不算错误
      console.warn('加载推荐内容失败:', err);
      // 不设置 error，让组件显示空状态而不是错误状态
      const fallbackData = {
        personalized: [],
        trending: [],
        general: [],
      };
      setData(fallbackData);

      // 切换到默认的热门内容标签
      setActiveTab('trending');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (itemId: number, feedback: string) => {
    // 从当前显示的列表中移除该项目（如果是不感兴趣）
    if (feedback === 'not_interested') {
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab as keyof RecommendationData].filter(
          item => item.id !== itemId
        ),
      }));
      // 重置页面索引，避免超出范围
      setCurrentPage(0);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof RecommendationData].filter(
        item => item.id !== itemId
      ),
    }));
    // 重置页面索引，避免超出范围
    setCurrentPage(0);
  };

  const getReasonText = (tab: string, index: number) => {
    const reasons = {
      personalized: [
        '基于您的浏览历史',
        '您可能感兴趣',
        '相似用户也喜欢',
        '基于您的收藏',
        '推荐给您',
      ],
      trending: ['本周热门', '正在流行', '热度上升', '用户热议', '趋势内容'],
      general: ['编辑推荐', '优质内容', '精选推荐', '值得一看', '热门推荐'],
    };

    const tabReasons = reasons[tab as keyof typeof reasons] || reasons.general;
    return tabReasons[index % tabReasons.length];
  };

  const renderContent = (items: KnowledgeItem[], tabKey: string) => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={loadRecommendations}>
              重试
            </Button>
          }
        />
      );
    }

    if (items.length === 0) {
      return (
        <Empty
          description={
            tabKey === 'personalized' && !user
              ? '登录后查看个性化推荐'
              : '暂无推荐内容'
          }
        />
      );
    }

    // 根据屏幕尺寸决定每页显示数量
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const itemsPerPage = isDesktop ? 4 : 1; // 桌面端4个，移动端1个

    // 计算当前页显示的项目
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return (
      <Row gutter={[16, 16]}>
        {currentItems.map((item, index) => (
          <Col
            key={item.id}
            xs={24} // 移动端：1列
            sm={24} // 小屏：1列
            md={12} // 桌面端：2列
            lg={12} // 大屏：2列
            xl={12} // 超大屏：2列
          >
            <RecommendationCard
              item={item}
              reason={getReasonText(tabKey, startIndex + index)}
              onFeedback={feedback => handleFeedback(item.id, feedback)}
              onRemove={() => handleRemoveItem(item.id)}
              compact={compact}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={`${styles.recommendationList} ${className}`}>
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          {title}
        </Title>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={() => {
            const currentTabData = data[activeTab as keyof RecommendationData];
            if (currentTabData.length > 0) {
              // 桌面端：每页4个，移动端：每页1个
              const isDesktop = window.innerWidth >= 768;
              const itemsPerPage = isDesktop ? 4 : 1;
              const totalPages = Math.ceil(
                currentTabData.length / itemsPerPage
              );
              setCurrentPage(prev => (prev + 1) % totalPages);
            } else {
              loadRecommendations();
            }
          }}
          loading={loading}
          className={styles.refreshBtn}
        >
          刷新
        </Button>
      </div>

      {showTabs ? (
        <Tabs
          activeKey={activeTab}
          onChange={key => {
            setActiveTab(key);
            setCurrentPage(0); // 切换标签时重置页面
          }}
          className={styles.tabs}
        >
          {user && (
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  个性化推荐
                </span>
              }
              key="personalized"
            >
              {renderContent(data.personalized, 'personalized')}
            </TabPane>
          )}

          <TabPane
            tab={
              <span>
                <FireOutlined />
                热门内容
              </span>
            }
            key="trending"
          >
            {renderContent(data.trending, 'trending')}
          </TabPane>

          <TabPane
            tab={
              <span>
                <ThunderboltOutlined />
                精选推荐
              </span>
            }
            key="general"
          >
            {renderContent(data.general, 'general')}
          </TabPane>
        </Tabs>
      ) : (
        renderContent(data[activeTab as keyof RecommendationData], activeTab)
      )}

      {!loading && data[activeTab as keyof RecommendationData].length > 0 && (
        <div className={styles.footer}>
          <Text type="secondary">推荐算法会根据您的反馈不断优化</Text>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
