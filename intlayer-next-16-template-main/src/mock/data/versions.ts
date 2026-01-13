/**
 * 知识版本历史 Mock 数据
 * 包含 30+ 条版本记录
 */

export interface KnowledgeVersion {
  id: number;
  knowledgeId: number;
  versionNumber: number;
  title: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LINK' | 'MIXED';
  mediaUrls?: string[];
  linkUrl?: string;
  tags: string;
  editorId: number;
  editorName: string;
  changeSummary: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  createdAt: string;
}

export const mockKnowledgeVersions: KnowledgeVersion[] = [
  {
    id: 1,
    knowledgeId: 1,
    versionNumber: 1,
    title: 'React Hooks 入门',
    content: '# React Hooks 入门\n\n基础内容...',
    type: 'TEXT',
    tags: 'React,Hooks',
    editorId: 2,
    editorName: '张三',
    changeSummary: '初始版本',
    changeType: 'CREATE',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 2,
    knowledgeId: 1,
    versionNumber: 2,
    title: 'React Hooks 完全指南',
    content: '# React Hooks 完全指南\n\n添加了更多示例...',
    type: 'TEXT',
    tags: 'React,Hooks,前端开发',
    editorId: 2,
    editorName: '张三',
    changeSummary: '添加了 useEffect 和 useContext 示例',
    changeType: 'UPDATE',
    createdAt: '2025-12-05T14:20:00Z',
  },
  {
    id: 3,
    knowledgeId: 1,
    versionNumber: 3,
    title: 'React Hooks 完全指南 - 从入门到精通',
    content: '# React Hooks 完全指南 - 从入门到精通\n\n完整内容...',
    type: 'TEXT',
    tags: 'React,Hooks,前端开发,JavaScript',
    editorId: 2,
    editorName: '张三',
    changeSummary: '添加了自定义 Hooks 和最佳实践章节',
    changeType: 'UPDATE',
    createdAt: '2025-12-15T14:30:00Z',
  },
  {
    id: 4,
    knowledgeId: 2,
    versionNumber: 1,
    title: 'Spring Boot 微服务入门',
    content: '# Spring Boot 微服务入门\n\n基础架构...',
    type: 'TEXT',
    tags: 'Spring Boot,微服务',
    editorId: 5,
    editorName: '赵六',
    changeSummary: '初始版本',
    changeType: 'CREATE',
    createdAt: '2025-12-02T09:30:00Z',
  },
  {
    id: 5,
    knowledgeId: 2,
    versionNumber: 2,
    title: 'Spring Boot 微服务架构实践',
    content: '# Spring Boot 微服务架构实践\n\n详细内容...',
    type: 'TEXT',
    tags: 'Spring Boot,微服务,后端开发,Java',
    editorId: 5,
    editorName: '赵六',
    changeSummary: '添加了服务注册发现和配置中心内容',
    changeType: 'UPDATE',
    createdAt: '2025-12-20T16:00:00Z',
  },
  {
    id: 6,
    knowledgeId: 3,
    versionNumber: 1,
    title: 'MySQL 基础优化',
    content: '# MySQL 基础优化\n\n索引优化...',
    type: 'TEXT',
    tags: 'MySQL,数据库',
    editorId: 3,
    editorName: '李四',
    changeSummary: '初始版本',
    changeType: 'CREATE',
    createdAt: '2025-12-03T11:00:00Z',
  },
  {
    id: 7,
    knowledgeId: 3,
    versionNumber: 2,
    title: 'MySQL 性能优化技巧',
    content: '# MySQL 性能优化技巧\n\n完整优化方案...',
    type: 'TEXT',
    tags: 'MySQL,数据库,性能优化,SQL',
    editorId: 3,
    editorName: '李四',
    changeSummary: '添加了查询优化和配置优化章节',
    changeType: 'UPDATE',
    createdAt: '2025-12-18T10:20:00Z',
  },
  {
    id: 8,
    knowledgeId: 4,
    versionNumber: 1,
    title: 'Vue 3 新特性',
    content: '# Vue 3 新特性\n\nComposition API...',
    type: 'TEXT',
    tags: 'Vue,前端开发',
    editorId: 4,
    editorName: '王五',
    changeSummary: '初始版本',
    changeType: 'CREATE',
    createdAt: '2025-12-04T13:20:00Z',
  },
  {
    id: 9,
    knowledgeId: 4,
    versionNumber: 2,
    title: 'Vue 3 Composition API 深入理解',
    content: '# Vue 3 Composition API 深入理解\n\n详细解析...',
    type: 'TEXT',
    tags: 'Vue,Composition API,前端开发,JavaScript',
    editorId: 4,
    editorName: '王五',
    changeSummary: '添加了响应式 API 详解',
    changeType: 'UPDATE',
    createdAt: '2025-12-22T09:45:00Z',
  },
  {
    id: 10,
    knowledgeId: 5,
    versionNumber: 1,
    title: 'Docker 入门',
    content: '# Docker 入门\n\n基础概念...',
    type: 'TEXT',
    tags: 'Docker,容器化',
    editorId: 10,
    editorName: '陈一',
    changeSummary: '初始版本',
    changeType: 'CREATE',
    createdAt: '2025-12-05T15:00:00Z',
  },
];

// 获取知识条目的版本历史
export const getVersionsByKnowledgeId = (knowledgeId: number) => {
  return mockKnowledgeVersions
    .filter(v => v.knowledgeId === knowledgeId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
};

// 获取特定版本
export const getVersion = (knowledgeId: number, versionNumber: number) => {
  return mockKnowledgeVersions.find(
    v => v.knowledgeId === knowledgeId && v.versionNumber === versionNumber
  );
};
