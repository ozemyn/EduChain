// 区块链相关类型定义

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  merkleRoot?: string;
  merkleTreeDepth?: number;
}

export interface Transaction {
  id: string;
  type: string;
  knowledgeId?: number;
  userId?: number;
  contentHash: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  signature?: string;
  publicKey?: string;
  blockIndex?: number;
  status?: 'pending' | 'confirmed';
}

export interface CertificateInfo {
  certificate_id: string;
  knowledge_id: number;
  block_index: number;
  block_hash: string;
  content_hash: string;
  timestamp: string;
  has_certificate: boolean;
  pdf_url?: string;
  qr_code_url?: string;
  verification_url?: string;
  created_at?: string;
}

export interface CertificateVerifyResult {
  valid: boolean;
  certificate_id: string;
  message: string;
  verification_time?: string;
}

export interface CertifyRequest {
  type: string;
  knowledge_id: number;
  user_id: number;
  content_hash: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyRequest {
  knowledge_id: number;
  content_hash: string;
}

export interface VerifyResponse {
  is_valid: boolean;
  message?: string;
}

export interface BlockchainOverview {
  totalBlocks: number;
  totalTransactions: number;
  latestBlock: {
    index: number;
    hash: string;
    timestamp: string;
    transactionsCount: number;
  };
  chainValid: boolean;
}

export interface BlockListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface BlockListResponse {
  content: Block[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
