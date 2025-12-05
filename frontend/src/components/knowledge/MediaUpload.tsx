import React, { useState } from 'react';
import {
  Upload,
  Button,
  message,
  Progress,
  Image,
  Card,
  Space,
  Typography,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadFile } from '@/services/api';

const { Text } = Typography;

interface MediaUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  disabled?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  value = [],
  onChange,
  maxCount = 5,
  accept = 'image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx',
  listType = 'picture-card',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImageOutlined />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <VideoCameraOutlined />;
      case 'pdf':
        return <FilePdfOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const isImageFile = (url: string) => {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const ext = url.toLowerCase().split('.').pop();
    return imageExts.includes(ext || '');
  };

  const isVideoFile = (url: string) => {
    const videoExts = ['mp4', 'avi', 'mov', 'wmv'];
    const ext = url.toLowerCase().split('.').pop();
    return videoExts.includes(ext || '');
  };

  const handleUpload: UploadProps['customRequest'] = async options => {
    const { file, onSuccess, onError } = options;

    if (!file || typeof file === 'string') {
      onError?.(new Error('Invalid file'));
      return;
    }

    const uploadFile_ = file as File;
    const fileId = `${uploadFile_.name}_${Date.now()}`;

    try {
      setUploading(true);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      const response = await uploadFile(uploadFile_, percent => {
        setUploadProgress(prev => ({ ...prev, [fileId]: percent }));
      });

      // 检查响应是否成功
      if (response.success && response.data) {
        // 后端返回的是 fileUrl 字段，不是 url
        const fileUrl = response.data.fileUrl || response.data.url;

        if (fileUrl) {
          const newUrls = [...value, fileUrl];
          onChange?.(newUrls);
          onSuccess?.(response.data);
          message.success('文件上传成功');
        } else {
          throw new Error('上传成功但未返回文件URL');
        }
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('文件上传失败');
      onError?.(error as Error);
    } finally {
      setUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const handleRemove = (url: string) => {
    const newUrls = value.filter(u => u !== url);
    onChange?.(newUrls);
  };

  const handlePreview = (url: string) => {
    if (isImageFile(url)) {
      // 图片预览由 Image 组件处理
      return;
    }

    if (isVideoFile(url)) {
      // 视频在新窗口打开
      window.open(url, '_blank');
      return;
    }

    // 其他文件类型下载
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileList = () => {
    if (listType === 'picture-card') {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map(url => (
            <Card
              key={url}
              size="small"
              style={{ width: 104, height: 104 }}
              styles={{ body: { padding: 4 } }}
              cover={
                isImageFile(url) ? (
                  <Image
                    src={url}
                    alt="uploaded file"
                    style={{ width: '100%', height: 80, objectFit: 'cover' }}
                    preview={{
                      src: url,
                    }}
                  />
                ) : isVideoFile(url) ? (
                  <div
                    style={{
                      width: '100%',
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handlePreview(url)}
                  >
                    <VideoCameraOutlined
                      style={{ fontSize: 24, color: '#666' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handlePreview(url)}
                  >
                    {getFileIcon(url)}
                  </div>
                )
              }
              actions={[
                <EyeOutlined
                  key="preview"
                  onClick={() => handlePreview(url)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleRemove(url)}
                />,
              ]}
            />
          ))}
        </div>
      );
    }

    return (
      <div>
        {value.map(url => (
          <Card key={url} size="small" style={{ marginBottom: 8 }}>
            <Space>
              {getFileIcon(url)}
              <Text ellipsis style={{ flex: 1 }}>
                {url.split('/').pop()}
              </Text>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handlePreview(url)}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(url)}
              />
            </Space>
          </Card>
        ))}
      </div>
    );
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>上传文件</div>
    </div>
  );

  return (
    <div>
      {renderFileList()}

      {value.length < maxCount && (
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept={accept}
          disabled={disabled || uploading}
          multiple
        >
          {listType === 'picture-card' ? (
            <div
              style={{
                width: 104,
                height: 104,
                border: '1px dashed var(--border-color)',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-tertiary)',
              }}
            >
              {uploadButton}
            </div>
          ) : (
            <Button icon={<UploadOutlined />} loading={uploading}>
              选择文件
            </Button>
          )}
        </Upload>
      )}

      {Object.keys(uploadProgress).length > 0 && (
        <div style={{ marginTop: 16 }}>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                上传中...
              </Text>
              <Progress percent={progress} size="small" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
