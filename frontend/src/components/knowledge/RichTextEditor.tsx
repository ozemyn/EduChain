import React, { useRef, useEffect, useCallback } from 'react';
import { Button, Space, Tooltip, message } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { uploadFile } from '@/services/api';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  showStats?: boolean;
  targetWords?: number;
  className?: string;
}

/**
 * 高性能富文本编辑器
 * 核心优化：
 * 1. 使用原生 contenteditable，零依赖
 * 2. 1秒防抖 onChange，避免频繁更新
 * 3. 移除所有实时统计和复杂逻辑
 * 4. 使用 useCallback 缓存所有函数
 */
const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  ({
    value = '',
    onChange,
    placeholder = '请输入内容...',
    height = 300,
    disabled = false,
    className = '',
  }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const changeTimeoutRef = useRef<number | null>(null);
    const isComposingRef = useRef(false); // 处理中文输入法

    // 初始化内容（仅一次）
    useEffect(() => {
      if (editorRef.current && value && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    // 防抖的内容变化处理 - 1秒防抖
    const handleContentChange = useCallback(() => {
      if (isComposingRef.current) return; // 输入法输入中，不触发

      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }

      changeTimeoutRef.current = window.setTimeout(() => {
        if (editorRef.current && onChange) {
          const content = editorRef.current.innerHTML;
          onChange(content);
        }
      }, 1000); // 1秒防抖
    }, [onChange]);

    // 处理中文输入法
    const handleCompositionStart = useCallback(() => {
      isComposingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(() => {
      isComposingRef.current = false;
      handleContentChange();
    }, [handleContentChange]);

    // 清理定时器
    useEffect(() => {
      return () => {
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }
      };
    }, []);

    // 格式化命令
    const execCommand = useCallback((command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }, []);

    // 工具栏按钮
    const handleBold = useCallback(() => execCommand('bold'), [execCommand]);
    const handleItalic = useCallback(
      () => execCommand('italic'),
      [execCommand]
    );
    const handleUnderline = useCallback(
      () => execCommand('underline'),
      [execCommand]
    );
    const handleOrderedList = useCallback(
      () => execCommand('insertOrderedList'),
      [execCommand]
    );
    const handleUnorderedList = useCallback(
      () => execCommand('insertUnorderedList'),
      [execCommand]
    );
    const handleCode = useCallback(
      () => execCommand('formatBlock', '<pre>'),
      [execCommand]
    );

    const handleLink = useCallback(() => {
      const url = prompt('请输入链接地址:');
      if (url) {
        execCommand('createLink', url);
      }
    }, [execCommand]);

    const handleImageUpload = useCallback(async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const response = await uploadFile(file);
          if (response.success && response.data?.fileUrl) {
            const img = `<img src="${response.data.fileUrl}" alt="uploaded" style="max-width: 100%; height: auto;" />`;
            execCommand('insertHTML', img);
            message.success('图片上传成功');
          }
        } catch {
          message.error('图片上传失败');
        }
      };
      input.click();
    }, [execCommand]);

    return (
      <div className={`rich-text-editor ${className}`}>
        {/* 工具栏 */}
        <div
          className="editor-toolbar"
          style={{
            padding: '8px',
            borderBottom: '1px solid #d9d9d9',
            backgroundColor: '#fafafa',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <Space size={4}>
            <Tooltip title="粗体 (Ctrl+B)">
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={handleBold}
              />
            </Tooltip>
            <Tooltip title="斜体 (Ctrl+I)">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={handleItalic}
              />
            </Tooltip>
            <Tooltip title="下划线 (Ctrl+U)">
              <Button
                size="small"
                icon={<UnderlineOutlined />}
                onClick={handleUnderline}
              />
            </Tooltip>
            <Tooltip title="有序列表">
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                onClick={handleOrderedList}
              />
            </Tooltip>
            <Tooltip title="无序列表">
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={handleUnorderedList}
              />
            </Tooltip>
            <Tooltip title="代码块">
              <Button
                size="small"
                icon={<CodeOutlined />}
                onClick={handleCode}
              />
            </Tooltip>
            <Tooltip title="插入链接">
              <Button
                size="small"
                icon={<LinkOutlined />}
                onClick={handleLink}
              />
            </Tooltip>
            <Tooltip title="上传图片">
              <Button
                size="small"
                icon={<PictureOutlined />}
                onClick={handleImageUpload}
              />
            </Tooltip>
          </Space>
        </div>

        {/* 编辑区域 */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleContentChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          data-placeholder={placeholder}
          style={{
            minHeight: height,
            padding: '16px',
            outline: 'none',
            overflowY: 'auto',
            lineHeight: '1.8',
            fontSize: '14px',
          }}
          className="editor-content"
        />

        <style>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #bfbfbf;
          pointer-events: none;
        }
        .editor-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 8px 0;
        }
        .editor-content pre {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
        }
        .editor-content a {
          color: #1890ff;
          text-decoration: underline;
        }
      `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
