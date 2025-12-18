/**
 * 文件上传 Mock 数据
 * 包含 30+ 条文件记录
 */

export interface FileUpload {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  fileHash: string;
  uploaderId: number;
  uploaderName: string;
  knowledgeId?: number;
  downloadCount: number;
  lastAccessedAt?: string;
  status: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockFileUploads: FileUpload[] = [
  {
    id: 1,
    originalName: 'react-hooks-diagram.png',
    storedName: 'uploads/2024/11/react-hooks-diagram-abc123.png',
    filePath: '/uploads/2024/11/react-hooks-diagram-abc123.png',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/react-hooks-diagram-abc123.png',
    fileSize: 245678,
    fileType: 'IMAGE',
    mimeType: 'image/png',
    fileHash: 'hash_abc123def456',
    uploaderId: 2,
    uploaderName: '张三',
    knowledgeId: 1,
    downloadCount: 156,
    lastAccessedAt: '2024-12-05T09:30:00Z',
    status: 1,
    description: 'React Hooks 生命周期图',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-12-05T09:30:00Z',
  },
  {
    id: 2,
    originalName: 'spring-boot-architecture.pdf',
    storedName: 'uploads/2024/11/spring-boot-architecture-def456.pdf',
    filePath: '/uploads/2024/11/spring-boot-architecture-def456.pdf',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/spring-boot-architecture-def456.pdf',
    fileSize: 1234567,
    fileType: 'DOCUMENT',
    mimeType: 'application/pdf',
    fileHash: 'hash_def456ghi789',
    uploaderId: 5,
    uploaderName: '赵六',
    knowledgeId: 2,
    downloadCount: 234,
    lastAccessedAt: '2024-12-05T08:45:00Z',
    status: 1,
    description: 'Spring Boot 微服务架构图',
    createdAt: '2024-11-02T09:30:00Z',
    updatedAt: '2024-12-05T08:45:00Z',
  },
  {
    id: 3,
    originalName: 'mysql-optimization-guide.pdf',
    storedName: 'uploads/2024/11/mysql-optimization-guide-ghi789.pdf',
    filePath: '/uploads/2024/11/mysql-optimization-guide-ghi789.pdf',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/mysql-optimization-guide-ghi789.pdf',
    fileSize: 987654,
    fileType: 'DOCUMENT',
    mimeType: 'application/pdf',
    fileHash: 'hash_ghi789jkl012',
    uploaderId: 3,
    uploaderName: '李四',
    knowledgeId: 3,
    downloadCount: 189,
    lastAccessedAt: '2024-12-05T08:00:00Z',
    status: 1,
    description: 'MySQL 性能优化完整指南',
    createdAt: '2024-11-03T11:00:00Z',
    updatedAt: '2024-12-05T08:00:00Z',
  },
  {
    id: 4,
    originalName: 'vue3-demo-video.mp4',
    storedName: 'uploads/2024/11/vue3-demo-video-jkl012.mp4',
    filePath: '/uploads/2024/11/vue3-demo-video-jkl012.mp4',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/vue3-demo-video-jkl012.mp4',
    fileSize: 15678900,
    fileType: 'VIDEO',
    mimeType: 'video/mp4',
    fileHash: 'hash_jkl012mno345',
    uploaderId: 4,
    uploaderName: '王五',
    knowledgeId: 4,
    downloadCount: 312,
    lastAccessedAt: '2024-12-05T07:30:00Z',
    status: 1,
    description: 'Vue 3 Composition API 演示视频',
    createdAt: '2024-11-04T13:20:00Z',
    updatedAt: '2024-12-05T07:30:00Z',
  },
  {
    id: 5,
    originalName: 'docker-compose-example.yml',
    storedName: 'uploads/2024/11/docker-compose-example-mno345.yml',
    filePath: '/uploads/2024/11/docker-compose-example-mno345.yml',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/docker-compose-example-mno345.yml',
    fileSize: 2345,
    fileType: 'DOCUMENT',
    mimeType: 'text/yaml',
    fileHash: 'hash_mno345pqr678',
    uploaderId: 10,
    uploaderName: '陈一',
    knowledgeId: 5,
    downloadCount: 267,
    lastAccessedAt: '2024-12-05T07:00:00Z',
    status: 1,
    description: 'Docker Compose 配置示例',
    createdAt: '2024-11-05T15:00:00Z',
    updatedAt: '2024-12-05T07:00:00Z',
  },
  {
    id: 6,
    originalName: 'python-ml-notebook.ipynb',
    storedName: 'uploads/2024/11/python-ml-notebook-pqr678.ipynb',
    filePath: '/uploads/2024/11/python-ml-notebook-pqr678.ipynb',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/python-ml-notebook-pqr678.ipynb',
    fileSize: 456789,
    fileType: 'DOCUMENT',
    mimeType: 'application/x-ipynb+json',
    fileHash: 'hash_pqr678stu901',
    uploaderId: 15,
    uploaderName: '高六',
    knowledgeId: 6,
    downloadCount: 198,
    lastAccessedAt: '2024-12-05T06:30:00Z',
    status: 1,
    description: 'Python 机器学习 Jupyter Notebook',
    createdAt: '2024-11-06T08:45:00Z',
    updatedAt: '2024-12-05T06:30:00Z',
  },
  {
    id: 7,
    originalName: 'flutter-app-screenshot.png',
    storedName: 'uploads/2024/11/flutter-app-screenshot-stu901.png',
    filePath: '/uploads/2024/11/flutter-app-screenshot-stu901.png',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/flutter-app-screenshot-stu901.png',
    fileSize: 345678,
    fileType: 'IMAGE',
    mimeType: 'image/png',
    fileHash: 'hash_stu901vwx234',
    uploaderId: 9,
    uploaderName: '郑十',
    knowledgeId: 7,
    downloadCount: 145,
    lastAccessedAt: '2024-12-05T06:00:00Z',
    status: 1,
    description: 'Flutter 应用截图',
    createdAt: '2024-11-07T10:15:00Z',
    updatedAt: '2024-12-05T06:00:00Z',
  },
  {
    id: 8,
    originalName: 'redis-config.conf',
    storedName: 'uploads/2024/11/redis-config-vwx234.conf',
    filePath: '/uploads/2024/11/redis-config-vwx234.conf',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/redis-config-vwx234.conf',
    fileSize: 3456,
    fileType: 'DOCUMENT',
    mimeType: 'text/plain',
    fileHash: 'hash_vwx234yza567',
    uploaderId: 23,
    uploaderName: '李四二',
    knowledgeId: 8,
    downloadCount: 178,
    lastAccessedAt: '2024-12-05T05:30:00Z',
    status: 1,
    description: 'Redis 配置文件示例',
    createdAt: '2024-11-08T12:30:00Z',
    updatedAt: '2024-12-05T05:30:00Z',
  },
  {
    id: 9,
    originalName: 'typescript-types.d.ts',
    storedName: 'uploads/2024/11/typescript-types-yza567.d.ts',
    filePath: '/uploads/2024/11/typescript-types-yza567.d.ts',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/typescript-types-yza567.d.ts',
    fileSize: 12345,
    fileType: 'DOCUMENT',
    mimeType: 'text/plain',
    fileHash: 'hash_yza567bcd890',
    uploaderId: 4,
    uploaderName: '王五',
    knowledgeId: 9,
    downloadCount: 156,
    lastAccessedAt: '2024-12-05T05:00:00Z',
    status: 1,
    description: 'TypeScript 类型定义文件',
    createdAt: '2024-11-09T14:00:00Z',
    updatedAt: '2024-12-05T05:00:00Z',
  },
  {
    id: 10,
    originalName: 'k8s-deployment.yaml',
    storedName: 'uploads/2024/11/k8s-deployment-bcd890.yaml',
    filePath: '/uploads/2024/11/k8s-deployment-bcd890.yaml',
    fileUrl:
      'https://cdn.educhain.cc/uploads/2024/11/k8s-deployment-bcd890.yaml',
    fileSize: 4567,
    fileType: 'DOCUMENT',
    mimeType: 'text/yaml',
    fileHash: 'hash_bcd890efg123',
    uploaderId: 10,
    uploaderName: '陈一',
    knowledgeId: 10,
    downloadCount: 223,
    lastAccessedAt: '2024-12-05T04:30:00Z',
    status: 1,
    description: 'Kubernetes Deployment 配置',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-12-05T04:30:00Z',
  },
];

// 获取用户上传的文件
export const getFilesByUploader = (uploaderId: number) => {
  return mockFileUploads.filter(f => f.uploaderId === uploaderId);
};

// 获取知识条目的文件
export const getFilesByKnowledge = (knowledgeId: number) => {
  return mockFileUploads.filter(f => f.knowledgeId === knowledgeId);
};

// 按文件类型获取
export const getFilesByType = (fileType: string) => {
  return mockFileUploads.filter(f => f.fileType === fileType);
};
