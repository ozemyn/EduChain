'use client';

import { useRef, useEffect } from 'react';
import { useIntlayer } from 'next-intlayer';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder,
  height = 400,
  className = '',
}) => {
  const content = useIntlayer('rich-text-editor');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    // 使用 execCommand (虽然已弃用，但仍是最简单的跨浏览器方案)
    // 未来可以考虑迁移到 Selection API 或第三方库
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className={`rich-text-editor glass-card ${className}`}>
      <div className="editor-toolbar">
        <button
          onClick={() => execCommand('bold')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.bold.value || content.toolbar.bold)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.italic.value || content.toolbar.italic)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.underline.value || content.toolbar.underline)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h10M7 4v8a5 5 0 0010 0V4" />
          </svg>
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.heading.value || content.toolbar.heading)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.list.value || content.toolbar.list)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="toolbar-divider" />

        <button
          onClick={insertLink}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.link.value || content.toolbar.link)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <button
          onClick={() => execCommand('formatBlock', '<pre>')}
          className="toolbar-btn"
          type="button"
          title={String(content.toolbar.code.value || content.toolbar.code)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="editor-content"
        style={{ minHeight: height }}
        data-placeholder={String(placeholder || content.placeholder.value || content.placeholder)}
      />
    </div>
  );
};
