import React, { useState, useEffect, useRef } from 'react';
import { Input, AutoComplete, Button, Space } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HistoryOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  searchService,
  type SearchSuggestion,
  type HotKeyword,
  type SearchHistory,
} from '@/services/search';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './SearchInput.module.css';

const { Search } = Input;

interface SearchInputProps {
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  onSearch?: (value: string) => void;
  showAdvanced?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '搜索知识内容...',
  size = 'middle',
  onSearch,
  showAdvanced = true,
  className,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 300);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);

  // 获取搜索建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchValue && debouncedSearchValue.length > 1) {
        setLoading(true);
        try {
          const response =
            await searchService.getSuggestions(debouncedSearchValue);
          setSuggestions(response.data);
        } catch {
          console.error('获取搜索建议失败');
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchValue]);

  // 获取热门关键词和搜索历史
  useEffect(() => {
    Promise.all([
      searchService.getHotKeywords(8),
      searchService.getSearchHistory(10),
    ])
      .then(([hotResponse, historyResponse]) => {
        setHotKeywords(hotResponse.data);
        setSearchHistory(historyResponse.data);
      })
      .catch(() => {
        console.error('获取搜索数据失败');
      });
  }, []);

  const handleSearch = (value: string) => {
    if (!value.trim()) return;

    if (onSearch) {
      onSearch(value);
    } else {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
    setShowDropdown(false);
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchValue(keyword);
    handleSearch(keyword);
  };

  const handleClearHistory = async () => {
    try {
      await searchService.clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  };

  const handleDeleteHistoryItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await searchService.deleteSearchHistory(id);
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('删除搜索历史失败:', error);
    }
  };

  // 构建下拉菜单选项
  const getDropdownOptions = () => {
    const options: Array<{
      label: React.ReactNode;
      options: Array<{ value: string; label: React.ReactNode }>;
    }> = [];

    // 搜索建议
    if (suggestions.length > 0) {
      options.push({
        label: (
          <div className={styles.sectionHeader}>
            <SearchOutlined /> 搜索建议
          </div>
        ),
        options: suggestions.map(item => ({
          value: item.keyword,
          label: (
            <div className={styles.suggestionItem}>
              <span>{item.keyword}</span>
              <span className={styles.count}>{item.count} 个结果</span>
            </div>
          ),
        })),
      });
    }

    // 搜索历史
    if (searchHistory.length > 0 && !searchValue) {
      options.push({
        label: (
          <div className={styles.sectionHeader}>
            <HistoryOutlined /> 搜索历史
            <Button
              type="text"
              size="small"
              onClick={handleClearHistory}
              className={styles.clearBtn}
            >
              清除
            </Button>
          </div>
        ),
        options: searchHistory.map(item => ({
          value: item.keyword,
          label: (
            <div className={styles.historyItem}>
              <span>{item.keyword}</span>
              <Button
                type="text"
                size="small"
                onClick={e => handleDeleteHistoryItem(item.id, e)}
                className={styles.deleteBtn}
              >
                ×
              </Button>
            </div>
          ),
        })),
      });
    }

    // 热门关键词
    if (hotKeywords.length > 0 && !searchValue) {
      options.push({
        label: (
          <div className={styles.sectionHeader}>
            <FireOutlined /> 热门搜索
          </div>
        ),
        options: hotKeywords.map(item => ({
          value: item.keyword,
          label: (
            <div className={styles.hotKeywordItem}>
              <span>{item.keyword}</span>
              <span className={`${styles.trend} ${styles[item.trend]}`}>
                {item.trend === 'up'
                  ? '↗'
                  : item.trend === 'down'
                    ? '↘'
                    : '→'}
              </span>
            </div>
          ),
        })),
      });
    }

    return options;
  };

  return (
    <div className={`${styles.searchInput} ${className}`}>
      <AutoComplete
        value={searchValue}
        options={getDropdownOptions()}
        onSelect={handleKeywordClick}
        onChange={setSearchValue}
        open={showDropdown}
        onOpenChange={setShowDropdown}
        popupClassName={styles.dropdown}
        style={{ width: '100%' }}
      >
        <Search
          ref={inputRef}
          placeholder={placeholder}
          size={size}
          loading={loading}
          enterButton={
            <Space>
              <SearchOutlined />
              {showAdvanced && (
                <Button
                  type="text"
                  icon={<FilterOutlined />}
                  onClick={() => navigate('/search/advanced')}
                  title="高级搜索"
                />
              )}
            </Space>
          }
          onSearch={handleSearch}
          onFocus={() => setShowDropdown(true)}
          style={{ width: '100%' }}
        />
      </AutoComplete>
    </div>
  );
};

export default SearchInput;
