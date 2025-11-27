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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab);

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
          ? searchService.getPersonalizedRecommendations(limit)
          : Promise.resolve({ data: [] }),
        // 热门内容
        searchService.getTrendingContent('week', limit),
        // 通用推荐
        searchService.getRecommendations(undefined, limit),
      ];

      const [personalizedRes, trendingRes, generalRes] =
        await Promise.all(promises);

      setData({
        personalized: personalizedRes.data,
        trending: trendingRes.data,
        general: generalRes.data,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载推荐内容失败');
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
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab as keyof RecommendationData].filter(
        item => item.id !== itemId
      ),
    }));
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

    return (
      <Row gutter={[16, 16]}>
        {items.map((item, index) => (
          <Col
            key={item.id}
            xs={24}
            sm={compact ? 12 : 24}
            md={compact ? 8 : 12}
            lg={compact ? 6 : 8}
          >
            <RecommendationCard
              item={item}
              reason={getReasonText(tabKey, index)}
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
          onClick={loadRecommendations}
          loading={loading}
          className={styles.refreshBtn}
        >
          刷新
        </Button>
      </div>

      {showTabs ? (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
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
