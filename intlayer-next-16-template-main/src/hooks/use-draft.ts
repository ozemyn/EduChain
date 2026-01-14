'use client';

/**
 * 草稿管理 Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { draft, type Draft } from '@/lib';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface UseDraftOptions {
  autoSave?: boolean;
  onDraftLoaded?: (d: Draft) => void;
}

export function useDraft(options: UseDraftOptions = {}) {
  const { autoSave = true } = options;
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const getDataRef = useRef<(() => Record<string, unknown>) | null>(null);

  const saveDraft = useCallback(
    async (data: Record<string, unknown>, manual = false) => {
      setSaveStatus('saving');
      const result = draft.save(data, !manual);
      setSaveStatus(result.success ? 'saved' : 'unsaved');
      return result;
    },
    []
  );

  const loadDraft = useCallback(() => {
    return draft.get();
  }, []);

  const clearDraft = useCallback(() => {
    draft.clear();
    setSaveStatus('saved');
  }, []);

  const startAutoSave = useCallback(
    (getData: () => Record<string, unknown>) => {
      getDataRef.current = getData;
      if (autoSave) {
        draft.startAutoSave(getData, (result) => {
          setSaveStatus(result.success ? 'saved' : 'unsaved');
        });
      }
    },
    [autoSave]
  );

  const stopAutoSave = useCallback(() => {
    draft.stopAutoSave();
    getDataRef.current = null;
  }, []);

  const markUnsaved = useCallback(() => {
    setSaveStatus('unsaved');
  }, []);

  // 页面离开前保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (getDataRef.current) {
        draft.saveBeforeUnload(getDataRef.current);
        if (saveStatus === 'unsaved') {
          e.preventDefault();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && getDataRef.current) {
        draft.saveBeforeUnload(getDataRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveStatus]);

  // 清理
  useEffect(() => {
    return () => stopAutoSave();
  }, [stopAutoSave]);

  return {
    saveStatus,
    saveDraft,
    loadDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
    markUnsaved,
  };
}
