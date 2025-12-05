import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Divider, Tooltip, message, Typography } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { uploadFile } from '@/services/api';
import { useTextStats } from '@/hooks/useTextStats';

const { Text } = Typography;

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  showStats?: boolean; // 是否显示统计信息
  targetWords?: number; // 目标字数
  className?: string; // 支持自定义样式
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 300,
  disabled = false,
  showStats = true,
  targetWords = 1000,
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentContent, setCurrentContent] = useState(value);

  // 历史记录管理
  const [history, setHistory] = useState<string[]>([value || '']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 实时文本统计
  const { stats, isCalculating } = useTextStats(currentContent || '', {
    debounceMs: 300,
    useWorker: true,
    wordsPerMinute: 200,
  });

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const newValue = value || '';
      const currentHTML = editorRef.current.innerHTML;

      if (newValue !== currentHTML) {
        editorRef.current.innerHTML = newValue;
        setCurrentContent(newValue);
      }
    }
  }, [value]);

  // 确保初始内容正确设置和同步
  useEffect(() => {
    if (editorRef.current) {
      const initialValue = value || '';

      if (initialValue) {
        editorRef.current.innerHTML = initialValue;
        setCurrentContent(initialValue);
        // 初始化时也要触发 onChange
        onChange?.(initialValue);
      }

      // 立即同步当前内容到表单
      setTimeout(() => {
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          setCurrentContent(content);
          onChange?.(content);
        }
      }, 100);
    }
  }, [onChange, value]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  // 添加到历史记录
  const addToHistory = (content: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      // 限制历史记录数量，最多保留50条
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  // 防抖定时器引用
  const debounceTimeoutRef = useRef<number | null>(null);

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;

      setCurrentContent(content);
      onChange?.(content);

      // 防抖添加到历史记录
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = window.setTimeout(() => {
        addToHistory(content);
      }, 1000); // 1秒后添加到历史记录
    }
  };

  // 定期同步内容，确保不丢失
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (editorRef.current && onChange) {
        const content = editorRef.current.innerHTML;
        if (content !== currentContent) {
          setCurrentContent(content);
          onChange(content);
        }
      }
    }, 2000); // 每2秒同步一次

    return () => clearInterval(syncInterval);
  }, [currentContent, onChange]);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);
        const response = await uploadFile(file);

        if (response.success && response.data?.url) {
          const img = `<img src="${response.data.url}" alt="uploaded image" style="max-width: 100%; height: auto;" />`;
          handleCommand('insertHTML', img);
          message.success('图片上传成功');
        } else {
          throw new Error(response.message || '上传失败');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        message.error('图片上传失败');
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const handleLink = () => {
    const url = prompt('请输入链接地址:');
    if (url) {
      handleCommand('createLink', url);
    }
  };

  // 撤销功能
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentContent(content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
      onChange?.(content);
    }
  };

  // 清空功能（重做按钮）
  const handleClear = () => {
    const emptyContent = '';
    setCurrentContent(emptyContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = emptyContent;
    }
    onChange?.(emptyContent);
    addToHistory(emptyContent);
  };

  // 工具栏按钮类型
  interface ToolbarButton {
    icon?: React.ReactNode;
    title?: string;
    command?: string;
    value?: string;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    type?: 'divider';
  }

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <BoldOutlined />,
      title: '粗体',
      command: 'bold',
    },
    {
      icon: <ItalicOutlined />,
      title: '斜体',
      command: 'italic',
    },
    {
      icon: <UnderlineOutlined />,
      title: '下划线',
      command: 'underline',
    },
    {
      type: 'divider',
    },
    {
      icon: <OrderedListOutlined />,
      title: '有序列表',
      command: 'insertOrderedList',
    },
    {
      icon: <UnorderedListOutlined />,
      title: '无序列表',
      command: 'insertUnorderedList',
    },
    {
      type: 'divider',
    },
    {
      icon: <LinkOutlined />,
      title: '插入链接',
      onClick: handleLink,
    },
    {
      icon: <PictureOutlined />,
      title: '插入图片',
      onClick: handleImageUpload,
      loading: isUploading,
    },
    {
      icon: <CodeOutlined />,
      title: '代码块',
      command: 'formatBlock',
      value: 'pre',
    },
    {
      type: 'divider',
    },
    {
      icon: <UndoOutlined />,
      title: '撤销上一步操作',
      onClick: handleUndo,
      disabled: historyIndex <= 0,
    },
    {
      icon: <RedoOutlined />,
      title: '清空所有内容',
      onClick: handleClear,
      disabled: !currentContent || currentContent.trim() === '',
    },
  ];

  return (
    <div
      className={className}
      style={{ border: '1px solid var(--border-color)', borderRadius: 6 }}
    >
      {/* 工具栏 */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 左侧工具按钮 */}
        <Space size="small">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'divider') {
              return <Divider key={index} orientation="vertical" />;
            }

            return (
              <Tooltip key={index} title={button.title}>
                <Button
                  type="text"
                  size="small"
                  icon={button.icon}
                  disabled={disabled || button.disabled}
                  loading={button.loading}
                  onClick={() => {
                    if (button.onClick) {
                      button.onClick();
                    } else if (button.command) {
                      handleCommand(button.command, button.value);
                    }
                  }}
                />
              </Tooltip>
            );
          })}
        </Space>

        {/* 右侧统计信息 */}
        {showStats && (
          <div className="editor-stats">
            <Space size="middle" className="stats-container">
              <div className="stat-item">
                <EditOutlined className="stat-icon" />
                <Text className="stat-text">
                  {stats.words.toLocaleString()} 字
                  {isCalculating && <span className="calculating">...</span>}
                </Text>
              </div>
              <Divider orientation="vertical" />
              <div className="stat-item">
                <ClockCircleOutlined className="stat-icon" />
                <Text className="stat-text">
                  {stats.readingTime < 1 ? '< 1' : stats.readingTime} 分钟
                </Text>
              </div>
              {targetWords > 0 && (
                <>
                  <Divider orientation="vertical" />
                  <div className="stat-item">
                    <div
                      className="progress-ring"
                      style={
                        {
                          '--progress': Math.min(
                            (stats.words / targetWords) * 100,
                            100
                          ),
                          '--color':
                            stats.words >= targetWords
                              ? 'var(--accent-success)'
                              : stats.words >= targetWords * 0.7
                                ? 'var(--accent-warning)'
                                : 'var(--accent-error)',
                        } as React.CSSProperties
                      }
                    >
                      <Text className="progress-text">
                        {Math.round((stats.words / targetWords) * 100)}%
                      </Text>
                    </div>
                  </div>
                </>
              )}
            </Space>
          </div>
        )}
      </div>

      {/* 编辑器 */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        style={{
          minHeight: height,
          padding: '12px',
          outline: 'none',
          lineHeight: 1.6,
          fontSize: 14,
          color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
          backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-elevated)',
        }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>
        {`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: var(--text-placeholder);
            pointer-events: none;
          }
          
          [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 4px 0;
          }
          
          [contenteditable] pre {
            background-color: var(--code-bg);
            border-radius: 4px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            overflow-x: auto;
            color: var(--code-text);
            border: 1px solid var(--code-border);
          }
          
          [contenteditable] blockquote {
            border-left: 4px solid var(--border-color);
            margin: 8px 0;
            padding-left: 12px;
            color: var(--text-secondary);
          }
          
          [contenteditable] ul, [contenteditable] ol {
            padding-left: 24px;
            margin: 8px 0;
          }
          
          [contenteditable] li {
            margin: 4px 0;
          }
          
          [contenteditable] a {
            color: #1890ff;
            text-decoration: none;
          }
          
          [contenteditable] a:hover {
            text-decoration: underline;
          }

          /* 编辑器统计样式 */
          .editor-stats {
            user-select: none;
          }

          .stats-container {
            align-items: center;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .stat-icon {
            font-size: 12px;
            color: #666;
          }

          .stat-text {
            font-size: 12px;
            color: #666;
            font-weight: 500;
            white-space: nowrap;
          }

          .calculating {
            color: #1890ff;
            animation: blink 1s infinite;
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }

          /* 进度环 */
          .progress-ring {
            position: relative;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: conic-gradient(
              var(--color) calc(var(--progress) * 1%),
              var(--bg-tertiary) calc(var(--progress) * 1%)
            );
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .progress-ring::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--bg-tertiary);
          }

          .progress-text {
            position: relative;
            font-size: 10px;
            font-weight: 600;
            color: var(--color);
            z-index: 1;
          }

          /* 响应式调整 */
          @media (max-width: 768px) {
            .editor-stats {
              display: none;
            }
          }

          @media (max-width: 1024px) {
            .stat-item:last-child {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;
