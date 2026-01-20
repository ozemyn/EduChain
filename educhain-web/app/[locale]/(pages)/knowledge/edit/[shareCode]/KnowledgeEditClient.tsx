'use client';

import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { useParams, useRouter } from 'next/navigation';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import {
  RichTextEditor,
  CategorySelector,
  TagSelector,
  MediaUpload,
} from '../../../../../../components/knowledge';
import { knowledgeService } from '@/services';

export default function KnowledgeEditClient() {
  const content = useIntlayer('knowledge-edit-page');
  const { locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const shareCode = params.shareCode as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    content: '',
    type: 'TEXT',
    categoryId: undefined as number | undefined,
    tags: [] as string[],
    mediaUrls: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shareCode) {
      loadKnowledge();
    }
  }, [shareCode]);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.getKnowledgeByShareCode(shareCode);
      if (response.success && response.data) {
        const knowledge = response.data;
        setFormData({
          id: knowledge.id,
          title: knowledge.title,
          content: knowledge.content,
          type: knowledge.type || 'TEXT',
          categoryId: knowledge.categoryId,
          tags: knowledge.tags ? knowledge.tags.split(',').map(t => t.trim()) : [],
          mediaUrls: [],
        });
      } else {
        alert('Failed to load knowledge');
        router.push(getLocalizedUrl('/knowledge', locale));
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
      alert('Failed to load knowledge');
      router.push(getLocalizedUrl('/knowledge', locale));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = String(content.errors.titleRequired.value || content.errors.titleRequired);
    }
    if (!formData.content.trim()) {
      newErrors.content = String(content.errors.contentRequired.value || content.errors.contentRequired);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const response = await knowledgeService.updateKnowledge(formData.id, {
        title: formData.title,
        content: formData.content,
        type: formData.type as 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK',
        categoryId: formData.categoryId,
        tags: formData.tags.join(','),
      });

      if (response.success && response.data) {
        router.push(getLocalizedUrl(`/knowledge/${response.data.shareCode}`, locale));
      }
    } catch (error) {
      console.error('Failed to update knowledge:', error);
      const errorMessage = String((content.errors as any).updateFailed?.value || (content.errors as any).updateFailed || 'Failed to update knowledge');
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="edit-container container">
        <div className="loading-state glass-card motion-fade-in">
          <div className="loading-spinner"></div>
          <p>{content.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container container">
      {/* 页面头部 */}
      <div className="edit-header motion-slide-in-up">
        <h1 className="edit-title">{content.title}</h1>
        <p className="edit-description">{content.description}</p>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="edit-form glass-card motion-slide-in-up motion-delay-100">
        {/* 标题 */}
        <div className="form-section">
          <label className="form-label">
            {content.fields.title}
            <span className="required-mark">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors({ ...errors, title: '' });
            }}
            placeholder={String(content.placeholders.title.value || content.placeholders.title)}
            className="form-input glass-input"
            disabled={submitting}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        {/* 类型和分类 */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label">{content.fields.type}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="form-input glass-input"
              disabled={submitting}
            >
              <option value="TEXT">{content.types.text}</option>
              <option value="IMAGE">{content.types.image}</option>
              <option value="VIDEO">{content.types.video}</option>
              <option value="PDF">{content.types.pdf}</option>
              <option value="LINK">{content.types.link}</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">{content.fields.category}</label>
            <CategorySelector
              value={formData.categoryId}
              onChange={(value) =>
                setFormData({ ...formData, categoryId: value as number })
              }
              placeholder={String(content.placeholders.category.value || content.placeholders.category)}
              disabled={submitting}
            />
          </div>
        </div>

        {/* 标签 */}
        <div className="form-section">
          <label className="form-label">{content.fields.tags}</label>
          <TagSelector
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value as string[] })}
            placeholder={String(content.placeholders.tags.value || content.placeholders.tags)}
            maxTags={10}
            showPopular
            popularTags={['JavaScript', 'React', 'Vue', 'Node.js', 'Python']}
            disabled={submitting}
          />
          <p className="form-hint">{String(content.hints.tags.value || content.hints.tags)}</p>
        </div>

        {/* 内容 */}
        <div className="form-section">
          <label className="form-label">
            {content.fields.content}
            <span className="required-mark">*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => {
              setFormData({ ...formData, content: value });
              setErrors({ ...errors, content: '' });
            }}
            placeholder={String(content.placeholders.content.value || content.placeholders.content)}
            height={400}
          />
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>

        {/* 媒体上传 */}
        <div className="form-section">
          <label className="form-label">{content.fields.media}</label>
          <MediaUpload
            value={formData.mediaUrls}
            onChange={(urls) => setFormData({ ...formData, mediaUrls: urls })}
            maxCount={9}
            accept="image/*"
            maxSize={10}
          />
          <p className="form-hint">{String(content.hints.media.value || content.hints.media)}</p>
        </div>

        {/* 操作按钮 */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="form-btn form-btn-cancel glass-button"
            disabled={submitting}
          >
            {content.actions.cancel}
          </button>
          <button
            type="submit"
            className="form-btn form-btn-submit motion-hover-lift"
            disabled={submitting}
          >
            {submitting ? content.actions.updating : content.actions.update}
          </button>
        </div>
      </form>
    </div>
  );
}
