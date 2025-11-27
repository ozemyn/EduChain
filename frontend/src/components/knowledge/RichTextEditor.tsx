import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Divider, Tooltip, message } from 'antd';
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
} from '@ant-design/icons';
import { uploadFile } from '@/services/api';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 300,
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange?.(content);
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
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

  const toolbarButtons = [
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
      title: '撤销',
      command: 'undo',
    },
    {
      icon: <RedoOutlined />,
      title: '重做',
      command: 'redo',
    },
  ];

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
      {/* 工具栏 */}
      <div style={{ 
        padding: '8px 12px', 
        borderBottom: '1px solid #d9d9d9',
        backgroundColor: '#fafafa'
      }}>
        <Space size="small">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'divider') {
              return <Divider key={index} type="vertical" />;
            }

            return (
              <Tooltip key={index} title={button.title}>
                <Button
                  type="text"
                  size="small"
                  icon={button.icon}
                  disabled={disabled}
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
          color: disabled ? '#999' : '#000',
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
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
            color: #999;
            pointer-events: none;
          }
          
          [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 4px 0;
          }
          
          [contenteditable] pre {
            background-color: #f6f8fa;
            border-radius: 4px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            overflow-x: auto;
          }
          
          [contenteditable] blockquote {
            border-left: 4px solid #ddd;
            margin: 8px 0;
            padding-left: 12px;
            color: #666;
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
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;