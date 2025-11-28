/**
 * 草稿管理工具 - 简化版，只保存一个草稿
 */

export interface DraftData {
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
  categoryId?: number;
  tags?: string;
  linkUrl?: string;
  savedAt: string;
  autoSaved: boolean;
}

export interface DraftManagerOptions {
  autoSaveInterval?: number;
  draftKey?: string;
}

class DraftManager {
  private options: Required<DraftManagerOptions>;
  private autoSaveTimer: number | null = null;

  constructor(options: DraftManagerOptions = {}) {
    this.options = {
      autoSaveInterval: options.autoSaveInterval || 30000,
      draftKey: options.draftKey || 'knowledge_draft',
    };
  }

  /**
   * 验证草稿数据是否有效
   */
  private isValidDraft(data: Record<string, unknown>): boolean {
    if (!data || typeof data !== 'object') return false;

    const title = String(data.title || '').trim();
    const content = String(data.content || '').trim();
    const plainContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';

    return title.length > 0 || plainContent.length > 0;
  }

  /**
   * 创建草稿数据对象
   */
  private createDraftData(
    formData: Record<string, unknown>,
    autoSaved: boolean = true
  ): DraftData {
    const now = new Date().toISOString();
    const title = String(formData.title || '未命名草稿');
    const content = String(formData.content || '');

    return {
      title,
      content,
      type: (formData.type as DraftData['type']) || 'TEXT',
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      tags: String(formData.tags || ''),
      linkUrl: String(formData.linkUrl || ''),
      savedAt: now,
      autoSaved,
    };
  }

  /**
   * 保存草稿到存储
   */
  private saveDraftToStorage(draft: DraftData): void {
    try {
      localStorage.setItem(this.options.draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  /**
   * 保存草稿
   */
  saveDraft(
    formData: Record<string, unknown>,
    autoSaved: boolean = true
  ): { success: boolean; message: string } {
    try {
      if (!this.isValidDraft(formData)) {
        return { success: false, message: '草稿内容为空' };
      }

      const draftData = this.createDraftData(formData, autoSaved);
      this.saveDraftToStorage(draftData);

      const message = autoSaved ? '草稿已自动保存' : '草稿保存成功';
      return { success: true, message };
    } catch (error) {
      console.error('Failed to save draft:', error);
      return { success: false, message: '保存草稿失败' };
    }
  }

  /**
   * 获取当前草稿
   */
  getCurrentDraft(): DraftData | null {
    try {
      const draftJson = localStorage.getItem(this.options.draftKey);
      return draftJson ? JSON.parse(draftJson) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }

  /**
   * 启动自动保存
   */
  startAutoSave(
    getFormData: () => Record<string, unknown>,
    onSave?: (result: { success: boolean; message: string }) => void
  ): void {
    this.stopAutoSave();

    this.autoSaveTimer = window.setInterval(() => {
      try {
        const formData = getFormData();

        const result = this.saveDraft(formData, true);
        onSave?.(result);
      } catch (error) {
        console.error('自动保存失败:', error);
      }
    }, this.options.autoSaveInterval);
  }

  /**
   * 停止自动保存
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * 页面离开前保存
   */
  saveBeforeUnload(getFormData: () => Record<string, unknown>): void {
    try {
      const formData = getFormData();
      if (this.isValidDraft(formData)) {
        this.saveDraft(formData, true);
      }
    } catch (error) {
      console.error('Failed to save before unload:', error);
    }
  }

  /**
   * 清除草稿
   */
  clearDraft(): void {
    try {
      localStorage.removeItem(this.options.draftKey);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }
}

// 创建单例实例
export const draftManager = new DraftManager();

export { DraftManager };
export default draftManager;
