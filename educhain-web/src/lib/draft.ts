/**
 * 草稿管理工具
 */

import { storage } from './storage';
import { STORAGE_KEY } from '@/config';

export interface Draft {
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  categoryId?: number;
  tags?: string;
  linkUrl?: string;
  savedAt: string;
  autoSaved: boolean;
}

type FormData = Record<string, unknown>;

class DraftManager {
  private autoSaveTimer: number | null = null;
  private autoSaveInterval = 30000; // 30秒

  /** 验证草稿是否有效 */
  private isValid(data: FormData): boolean {
    if (!data || typeof data !== 'object') return false;
    const title = String(data.title || '').trim();
    const content = String(data.content || '')
      .replace(/<[^>]*>/g, '')
      .trim();
    return title.length > 0 || content.length > 0;
  }

  /** 保存草稿 */
  save(data: FormData, autoSaved = true): { success: boolean; message: string } {
    if (!this.isValid(data)) {
      return { success: false, message: '草稿内容为空' };
    }

    const draft: Draft = {
      title: String(data.title || '未命名草稿'),
      content: String(data.content || ''),
      type: (data.type as Draft['type']) || 'TEXT',
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      tags: String(data.tags || ''),
      linkUrl: String(data.linkUrl || ''),
      savedAt: new Date().toISOString(),
      autoSaved,
    };

    storage.set(STORAGE_KEY.DRAFT, draft);
    return { success: true, message: autoSaved ? '草稿已自动保存' : '草稿保存成功' };
  }

  /** 获取草稿 */
  get(): Draft | null {
    return storage.get<Draft>(STORAGE_KEY.DRAFT);
  }

  /** 清除草稿 */
  clear(): void {
    storage.remove(STORAGE_KEY.DRAFT);
  }

  /** 启动自动保存 */
  startAutoSave(
    getData: () => FormData,
    onSave?: (result: { success: boolean; message: string }) => void
  ): void {
    this.stopAutoSave();
    this.autoSaveTimer = window.setInterval(() => {
      const result = this.save(getData(), true);
      onSave?.(result);
    }, this.autoSaveInterval);
  }

  /** 停止自动保存 */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /** 页面离开前保存 */
  saveBeforeUnload(getData: () => FormData): void {
    const data = getData();
    if (this.isValid(data)) {
      this.save(data, true);
    }
  }
}

export const draft = new DraftManager();
