/**
 * 区块链 Mock 数据
 * 包含区块、交易、证书等数据
 */

import type {
  Block,
  Transaction,
  CertificateInfo,
  BlockchainOverview,
} from '@/types/blockchain';

// 知识标题列表（用于生成更真实的元数据）
const knowledgeTitles = [
  'React Hooks 完全指南',
  'Spring Boot 微服务架构实战',
  'MySQL 性能优化技巧',
  'Vue 3 Composition API 深度解析',
  'Docker 容器化部署实践',
  'Python 机器学习入门',
  'Flutter 跨平台开发',
  'Redis 缓存设计模式',
  'TypeScript 高级类型系统',
  'Kubernetes 容器编排',
  'Node.js 异步编程',
  '深度学习基础教程',
  'MongoDB 数据建模',
  'React Native 移动开发',
  'Go 语言并发编程',
  'GraphQL API 设计',
  'Webpack 构建优化',
  'Nginx 反向代理配置',
  'ElasticSearch 全文搜索',
  '区块链智能合约开发',
];

const authors = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '钱七',
  '孙八',
  '周九',
  '吴十',
  '郑十一',
  '王十二',
];

const categories = [
  '前端开发',
  '后端开发',
  '数据库',
  '运维部署',
  '人工智能',
  '移动开发',
  '架构设计',
  '编程语言',
  '区块链',
  '云计算',
];

const tags = [
  ['React', 'JavaScript', 'Hooks'],
  ['Spring Boot', 'Java', '微服务'],
  ['MySQL', '数据库', '性能优化'],
  ['Vue', 'JavaScript', 'Composition API'],
  ['Docker', '容器', 'DevOps'],
  ['Python', '机器学习', 'AI'],
  ['Flutter', 'Dart', '移动开发'],
  ['Redis', '缓存', 'NoSQL'],
  ['TypeScript', 'JavaScript', '类型系统'],
  ['Kubernetes', 'K8s', '容器编排'],
];

// 生成交易ID的辅助函数
const generateTxId = (
  blockIndex: number,
  txIndex: number,
  knowledgeId: number
): string => {
  // 生成固定的、可预测的交易ID
  const base = `${blockIndex}_${txIndex}_${knowledgeId}`;
  return `tx_${base
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(36)}`;
};

// 生成区块数据
export const mockBlocks: Block[] = [];

// 使用固定的基准时间：2025-12-15
const baseTimestamp = new Date('2025-12-15T00:00:00Z').getTime();

for (let i = 0; i < 25; i++) {
  const transactions: Transaction[] = [];
  const txCount = Math.floor(Math.random() * 3) + 1; // 每个区块1-3个交易

  for (let j = 0; j < txCount; j++) {
    const knowledgeId = ((i * 3 + j) % 15) + 1; // 确保知识ID在1-15范围内
    const userId = (knowledgeId % 10) + 1;
    const titleIndex = knowledgeId % knowledgeTitles.length;
    const authorIndex = userId % authors.length;
    const categoryIndex = knowledgeId % categories.length;
    const tagSet = tags[knowledgeId % tags.length];

    const txTimestamp = new Date(
      baseTimestamp + i * 60 * 60 * 1000 + j * 10 * 60 * 1000
    ).toISOString();

    transactions.push({
      id: generateTxId(i, j, knowledgeId),
      type: 'KNOWLEDGE_CERTIFICATION',
      knowledgeId: knowledgeId,
      userId: userId,
      contentHash: `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      metadata: {
        title: knowledgeTitles[titleIndex],
        author: authors[authorIndex],
        authorId: userId,
        category: categories[categoryIndex],
        tags: tagSet,
        contentType: 'TEXT',
        contentLength: Math.floor(Math.random() * 5000) + 1000,
        version: '1.0',
        language: 'zh-CN',
        certificationTime: txTimestamp,
        certificationReason: '知识内容存证',
        ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
        fileSize: `${(Math.random() * 500 + 100).toFixed(2)} KB`,
        mimeType: 'text/markdown',
      },
      timestamp: txTimestamp,
      signature: `0x${Array.from({ length: 128 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      publicKey: `0x${Array.from({ length: 66 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      blockIndex: i,
      status: 'confirmed',
    });
  }

  mockBlocks.push({
    index: i,
    timestamp: new Date(baseTimestamp + i * 60 * 60 * 1000).toISOString(),
    transactions,
    previousHash:
      i === 0
        ? '0x0000000000000000000000000000000000000000000000000000000000000000'
        : `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join('')}`,
    hash: `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`,
    merkleRoot: `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`,
    merkleTreeDepth: Math.ceil(Math.log2(transactions.length)),
  });
}

// 区块链概览数据
export const mockBlockchainOverview: BlockchainOverview = {
  totalBlocks: mockBlocks.length,
  totalTransactions: mockBlocks.reduce(
    (sum, block) => sum + block.transactions.length,
    0
  ),
  latestBlock: {
    index: mockBlocks[mockBlocks.length - 1].index,
    hash: mockBlocks[mockBlocks.length - 1].hash,
    timestamp: mockBlocks[mockBlocks.length - 1].timestamp,
    transactionsCount: mockBlocks[mockBlocks.length - 1].transactions.length,
  },
  chainValid: true,
};

// 证书数据
export const mockCertificates: CertificateInfo[] = [
  {
    certificate_id: 'cert_001',
    knowledge_id: 1,
    block_index: 5,
    block_hash: mockBlocks[5].hash,
    content_hash: 'hash_react_hooks_guide',
    timestamp: '2025-12-01T10:30:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_001.pdf',
    qr_code_url: '/qrcodes/cert_001.png',
    verification_url: 'https://educhain.cc/verify/cert_001',
    created_at: '2025-12-01T10:30:00Z',
  },
  {
    certificate_id: 'cert_002',
    knowledge_id: 2,
    block_index: 6,
    block_hash: mockBlocks[6].hash,
    content_hash: 'hash_spring_boot_microservices',
    timestamp: '2025-12-02T09:45:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_002.pdf',
    qr_code_url: '/qrcodes/cert_002.png',
    verification_url: 'https://educhain.cc/verify/cert_002',
    created_at: '2025-12-02T09:45:00Z',
  },
  {
    certificate_id: 'cert_003',
    knowledge_id: 3,
    block_index: 7,
    block_hash: mockBlocks[7].hash,
    content_hash: 'hash_mysql_optimization',
    timestamp: '2025-12-03T11:15:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_003.pdf',
    qr_code_url: '/qrcodes/cert_003.png',
    verification_url: 'https://educhain.cc/verify/cert_003',
    created_at: '2025-12-03T11:15:00Z',
  },
  {
    certificate_id: 'cert_004',
    knowledge_id: 4,
    block_index: 8,
    block_hash: mockBlocks[8].hash,
    content_hash: 'hash_vue3_composition_api',
    timestamp: '2025-12-04T13:30:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_004.pdf',
    qr_code_url: '/qrcodes/cert_004.png',
    verification_url: 'https://educhain.cc/verify/cert_004',
    created_at: '2025-12-04T13:30:00Z',
  },
  {
    certificate_id: 'cert_005',
    knowledge_id: 5,
    block_index: 9,
    block_hash: mockBlocks[9].hash,
    content_hash: 'hash_docker_deployment',
    timestamp: '2025-12-05T15:10:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_005.pdf',
    qr_code_url: '/qrcodes/cert_005.png',
    verification_url: 'https://educhain.cc/verify/cert_005',
    created_at: '2025-12-05T15:10:00Z',
  },
  {
    certificate_id: 'cert_006',
    knowledge_id: 6,
    block_index: 10,
    block_hash: mockBlocks[10].hash,
    content_hash: 'hash_python_ml_intro',
    timestamp: '2025-12-06T09:00:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_006.pdf',
    qr_code_url: '/qrcodes/cert_006.png',
    verification_url: 'https://educhain.cc/verify/cert_006',
    created_at: '2025-12-06T09:00:00Z',
  },
  {
    certificate_id: 'cert_007',
    knowledge_id: 7,
    block_index: 11,
    block_hash: mockBlocks[11].hash,
    content_hash: 'hash_redis_cache_patterns',
    timestamp: '2025-12-07T10:30:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_007.pdf',
    qr_code_url: '/qrcodes/cert_007.png',
    verification_url: 'https://educhain.cc/verify/cert_007',
    created_at: '2025-12-07T10:30:00Z',
  },
  {
    certificate_id: 'cert_008',
    knowledge_id: 8,
    block_index: 12,
    block_hash: mockBlocks[12].hash,
    content_hash: 'hash_python_ml_intro',
    timestamp: '2025-12-08T12:45:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_008.pdf',
    qr_code_url: '/qrcodes/cert_008.png',
    verification_url: 'https://educhain.cc/verify/cert_008',
    created_at: '2025-12-08T12:45:00Z',
  },
  {
    certificate_id: 'cert_009',
    knowledge_id: 9,
    block_index: 13,
    block_hash: mockBlocks[13].hash,
    content_hash: 'hash_git_workflow_guide',
    timestamp: '2025-12-09T14:15:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_009.pdf',
    qr_code_url: '/qrcodes/cert_009.png',
    verification_url: 'https://educhain.cc/verify/cert_009',
    created_at: '2025-12-09T14:15:00Z',
  },
  {
    certificate_id: 'cert_010',
    knowledge_id: 10,
    block_index: 14,
    block_hash: mockBlocks[14].hash,
    content_hash: 'hash_algorithm_basics_guide',
    timestamp: '2025-12-10T09:15:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_010.pdf',
    qr_code_url: '/qrcodes/cert_010.png',
    verification_url: 'https://educhain.cc/verify/cert_010',
    created_at: '2025-12-10T09:15:00Z',
  },
  {
    certificate_id: 'cert_011',
    knowledge_id: 11,
    block_index: 15,
    block_hash: mockBlocks[15].hash,
    content_hash: 'hash_css_flexbox_guide',
    timestamp: '2025-12-11T10:45:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_011.pdf',
    qr_code_url: '/qrcodes/cert_011.png',
    verification_url: 'https://educhain.cc/verify/cert_011',
    created_at: '2025-12-11T10:45:00Z',
  },
  {
    certificate_id: 'cert_012',
    knowledge_id: 12,
    block_index: 16,
    block_hash: mockBlocks[16].hash,
    content_hash: 'hash_nodejs_async',
    timestamp: '2025-12-12T12:00:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_012.pdf',
    qr_code_url: '/qrcodes/cert_012.png',
    verification_url: 'https://educhain.cc/verify/cert_012',
    created_at: '2025-12-12T12:00:00Z',
  },
  {
    certificate_id: 'cert_013',
    knowledge_id: 13,
    block_index: 17,
    block_hash: mockBlocks[17].hash,
    content_hash: 'hash_webpack_config_guide',
    timestamp: '2025-12-13T13:15:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_013.pdf',
    qr_code_url: '/qrcodes/cert_013.png',
    verification_url: 'https://educhain.cc/verify/cert_013',
    created_at: '2025-12-13T13:15:00Z',
  },
  {
    certificate_id: 'cert_014',
    knowledge_id: 14,
    block_index: 18,
    block_hash: mockBlocks[18].hash,
    content_hash: 'hash_restful_api_design',
    timestamp: '2025-12-14T14:30:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_014.pdf',
    qr_code_url: '/qrcodes/cert_014.png',
    verification_url: 'https://educhain.cc/verify/cert_014',
    created_at: '2025-12-14T14:30:00Z',
  },
  {
    certificate_id: 'cert_015',
    knowledge_id: 15,
    block_index: 19,
    block_hash: mockBlocks[19].hash,
    content_hash: 'hash_mongodb_modeling',
    timestamp: '2025-12-15T15:45:00Z',
    has_certificate: true,
    pdf_url: '/certificates/cert_015.pdf',
    qr_code_url: '/qrcodes/cert_015.png',
    verification_url: 'https://educhain.cc/verify/cert_015',
    created_at: '2025-12-15T15:45:00Z',
  },
];

// 为了确保所有知识库条目都有证书，我们动态生成缺失的证书
const ensureAllCertificates = () => {
  const maxKnowledgeId = 15; // 假设有15个知识库条目
  const existingIds = new Set(mockCertificates.map(cert => cert.knowledge_id));

  for (let i = 1; i <= maxKnowledgeId; i++) {
    if (!existingIds.has(i)) {
      const certId = `cert_${String(mockCertificates.length + 1).padStart(3, '0')}`;
      const blockIndex = Math.min(i + 4, mockBlocks.length - 1); // 确保不超过区块数量

      mockCertificates.push({
        certificate_id: certId,
        knowledge_id: i,
        block_index: blockIndex,
        block_hash: mockBlocks[blockIndex].hash,
        content_hash: `hash_knowledge_${i}`,
        timestamp: new Date(
          Date.now() - (maxKnowledgeId - i) * 24 * 60 * 60 * 1000
        ).toISOString(),
        has_certificate: true,
        pdf_url: `/certificates/${certId}.pdf`,
        qr_code_url: `/qrcodes/${certId}.png`,
        verification_url: `https://educhain.cc/verify/${certId}`,
        created_at: new Date(
          Date.now() - (maxKnowledgeId - i) * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
  }
};

// 确保所有证书都存在
ensureAllCertificates();

// 根据知识ID获取证书
export const getCertificateByKnowledgeId = (knowledgeId: number) => {
  return mockCertificates.find(cert => cert.knowledge_id === knowledgeId);
};

// 验证证书
export const verifyCertificate = (certificateId: string) => {
  const cert = mockCertificates.find(c => c.certificate_id === certificateId);
  return {
    valid: !!cert,
    certificate_id: certificateId,
    message: cert ? '证书验证成功' : '证书不存在',
    verification_time: new Date().toISOString(),
  };
};

// 根据交易ID或知识ID查找交易
export const getTransactionById = (id: string) => {
  for (const block of mockBlocks) {
    // 先按交易ID精确匹配
    let tx = block.transactions.find(t => t.id === id);

    // 如果没找到且ID是数字，尝试按知识ID查找
    if (!tx && !isNaN(Number(id))) {
      tx = block.transactions.find(t => t.knowledgeId === Number(id));
    }

    if (tx) {
      return {
        transaction: tx,
        blockIndex: block.index,
      };
    }
  }

  return null;
};
