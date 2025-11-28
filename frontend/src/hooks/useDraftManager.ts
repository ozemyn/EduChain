import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import draftManager, { type DraftData } from '@/utils/draftManager';

export interface UseDraftManagerOptions {
  autoSave?: boolean;
  showNotifications?: boolean;
  onDraftLoaded?: (draft: DraftData) => void;
}

export interface UseDraftManagerReturn {
  saveStatus: 'saved' | 'saving' | 'unsaved';
  saveDraft: (
    formData: Record<string, unknown>,
    manual?: boolean
  ) => Promise<boolean>;
  clearDraft: () => void;
  startAutoSave: (getFormData: () => Record<string, unknown>) => void;
  stopAutoSave: () => void;
  markUnsaved: () => void;
}

export const useDraftManager = (
  options: UseDraftManagerOptions = {}
): UseDraftManagerReturn => {
  const { autoSave = true, showNotifications = true } = options;

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved'
  );
  const getFormDataRef = useRef<(() => Record<string, unknown>) | null>(null);

  // 保存草稿
  const saveDraft = useCallback(
    async (
      formData: Record<string, unknown>,
      manual: boolean = false
    ): Promise<boolean> => {
      setSaveStatus('saving');

      try {
        const result = draftManager.saveDraft(formData, !manual);

        if (result.success) {
          if (showNotifications && manual) {
            message.success(result.message);
          }
          setSaveStatus('saved');
          return true;
        } else {
          if (showNotifications) {
            message.error(result.message);
          }
          setSaveStatus('unsaved');
          return false;
        }
      } catch {
        if (showNotifications) {
          message.error('保存草稿失败');
        }
        setSaveStatus('unsaved');
        return false;
      }
    },
    [showNotifications]
  );

  // 清除草稿
  const clearDraft = useCallback(() => {
    try {
      draftManager.clearDraft();
      setSaveStatus('saved');

      if (showNotifications) {
        message.success('草稿已清除');
      }
    } catch (error) {
      console.error('Clear draft failed:', error);
      if (showNotifications) {
        message.error('清除草稿失败');
      }
    }
  }, [showNotifications]);

  // 启动自动保存
  const startAutoSave = useCallback(
    (getFormData: () => Record<string, unknown>) => {
      getFormDataRef.current = getFormData;

      if (autoSave) {
        draftManager.startAutoSave(getFormData, result => {
          if (result.success) {
            setSaveStatus('saved');
          }
        });
      }
    },
    [autoSave]
  );

  // 停止自动保存
  const stopAutoSave = useCallback(() => {
    draftManager.stopAutoSave();
    getFormDataRef.current = null;
  }, []);

  // 标记为未保存状态
  const markUnsaved = useCallback(() => {
    setSaveStatus('unsaved');
  }, []);

  // 页面离开前保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (getFormDataRef.current) {
        const formData = getFormDataRef.current();
        draftManager.saveBeforeUnload(() => formData);

        if (saveStatus === 'unsaved') {
          e.preventDefault();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && getFormDataRef.current) {
        const formData = getFormDataRef.current();
        draftManager.saveBeforeUnload(() => formData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveStatus]);

  // 清理函数
  useEffect(() => {
    return () => {
      stopAutoSave();
    };
  }, [stopAutoSave]);

  return {
    saveStatus,
    saveDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
    markUnsaved,
  };
};

export default useDraftManager;
