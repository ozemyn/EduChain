'use client';

/**
 * 未保存更改提示 Hook
 * 用于表单页面离开时的提示
 */

import { useEffect, useCallback, useState } from 'react';

export function useUnsavedChanges(hasChanges: boolean, message: string) {
  const [showPrompt, setShowPrompt] = useState(false);

  // 浏览器原生离开提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, message]);

  const confirmLeave = useCallback((): boolean => {
    if (hasChanges) {
      return window.confirm(message);
    }
    return true;
  }, [hasChanges, message]);

  const triggerPrompt = useCallback(() => {
    if (hasChanges) {
      setShowPrompt(true);
    }
  }, [hasChanges]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
  }, []);

  return {
    showPrompt,
    confirmLeave,
    triggerPrompt,
    dismissPrompt,
  };
}
