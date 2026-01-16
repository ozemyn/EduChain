'use client';

/**
 * 确认对话框 Hook
 * 用于危险操作的二次确认
 */

import { useState, useCallback } from 'react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  variant: 'info',
  onConfirm: () => {},
};

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          title: options.title,
          message: options.message,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          variant: options.variant || 'info',
          onConfirm: () => resolve(true),
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await state.onConfirm();
    } finally {
      setIsLoading(false);
      setState(initialState);
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    dialogState: state,
    isLoading,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
