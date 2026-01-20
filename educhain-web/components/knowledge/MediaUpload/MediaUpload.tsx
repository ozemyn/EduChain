'use client';

import { useState } from 'react';
import { useIntlayer } from 'next-intlayer';
import { uploadFile } from '@/services/api';
import './MediaUpload.css';

interface MediaUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  accept?: string;
  maxSize?: number; // MB
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  value = [],
  onChange,
  maxCount = 9,
  accept = 'image/*',
  maxSize = 10,
}) => {
  const content = useIntlayer('media-upload');
  const [files, setFiles] = useState<string[]>(value);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (files.length + selectedFiles.length > maxCount) {
      alert(String(content.errors.maxCount.value || content.errors.maxCount).replace('{max}', String(maxCount)));
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(String(content.errors.maxSize.value || content.errors.maxSize).replace('{max}', String(maxSize)));
        continue;
      }

      try {
        setUploading(true);
        const response = await uploadFile(file, (percent) => {
          setProgress(percent);
        });

        if (response.success && response.data) {
          const newFiles = [...files, response.data.fileUrl || response.data.url || ''];
          setFiles(newFiles);
          onChange?.(newFiles);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert(String(content.errors.uploadFailed.value || content.errors.uploadFailed));
      } finally {
        setUploading(false);
        setProgress(0);
      }
    }

    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  return (
    <div className="media-upload">
      <div className="upload-list">
        {files.map((file, index) => (
          <div key={index} className="upload-item glass-card">
            {accept.includes('image') ? (
              <img src={file} alt={`Upload ${index + 1}`} className="upload-preview" />
            ) : (
              <div className="upload-file-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <button
              onClick={() => handleRemove(index)}
              className="remove-btn glass-button"
              type="button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {files.length < maxCount && (
          <label className="upload-trigger glass-card">
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="upload-input"
              multiple={maxCount > 1}
            />
            <div className="upload-content">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>{uploading ? `${progress}%` : String(content.uploadText.value || content.uploadText)}</span>
            </div>
          </label>
        )}
      </div>

      <p className="upload-hint">
        {String(content.hint.value || content.hint)
          .replace('{max}', String(maxCount))
          .replace('{size}', String(maxSize))}
      </p>
    </div>
  );
};
