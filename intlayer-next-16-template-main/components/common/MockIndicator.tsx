'use client';

/**
 * Mock 模式指示器
 * 在右下角显示当前是否为 Mock 模式
 */

export function MockIndicator() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (!useMock) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          padding: '6px 12px',
          borderRadius: '6px',
          backgroundColor: '#fff7e6',
          color: '#d46b08',
          border: '1px solid #ffd591',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        Mock 模式
      </span>
    </div>
  );
}

export default MockIndicator;
