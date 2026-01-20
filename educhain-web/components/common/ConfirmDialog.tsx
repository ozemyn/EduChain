'use client';

import { useEffect, useRef } from 'react';
import type { ConfirmDialogState } from '@/hooks/use-confirm-dialog';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  state: ConfirmDialogState;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  state,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // 焦点管理
  useEffect(() => {
    if (state.isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [state.isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen, isLoading, onCancel]);

  // 焦点陷阱
  useEffect(() => {
    if (!state.isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={isLoading ? undefined : onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        ref={dialogRef}
        className={`confirm-dialog glass-card ${state.variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          {state.variant === 'danger' && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {state.variant === 'warning' && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {state.variant === 'info' && (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h3 id="confirm-dialog-title" className="confirm-dialog-title">
          {state.title}
        </h3>

        <p id="confirm-dialog-message" className="confirm-dialog-message">
          {state.message}
        </p>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-btn cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {state.cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`confirm-dialog-btn confirm ${state.variant}`}
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner-small" />
            ) : (
              state.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
