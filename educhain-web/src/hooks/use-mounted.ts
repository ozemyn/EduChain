'use client';

/**
 * 组件挂载状态 Hook
 * 用于避免 SSR hydration 问题
 */

import { useState, useEffect } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
