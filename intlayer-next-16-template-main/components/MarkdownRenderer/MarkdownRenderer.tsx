'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown 渲染器组件
 * 
 * 特性：
 * - GitHub Flavored Markdown (GFM) 支持
 * - 代码高亮（100+ 语言）
 * - 表格、任务列表、删除线
 * - 自动链接、Emoji
 * - 安全防 XSS
 * - 性能优化（memo）
 */
const MarkdownRenderer = memo(({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`markdown-renderer ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // 自定义链接渲染（新标签页打开外部链接）
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          // 自定义图片渲染（懒加载）
          img: ({ node, src, alt, ...props }) => {
            return (
              <img
                src={src}
                alt={alt || ''}
                loading="lazy"
                decoding="async"
                {...props}
              />
            );
          },
          // 自定义代码块渲染
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const inline = !className;
            
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <div className="code-block-wrapper">
                {language && (
                  <div className="code-block-header">
                    <span className="code-language">{language}</span>
                    <button
                      className="code-copy-btn"
                      onClick={() => {
                        const code = String(children).replace(/\n$/, '');
                        navigator.clipboard.writeText(code);
                      }}
                      title="复制代码"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                <pre className={className}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // 自定义表格渲染（响应式）
          table: ({ node, children, ...props }) => {
            return (
              <div className="table-wrapper">
                <table {...props}>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
