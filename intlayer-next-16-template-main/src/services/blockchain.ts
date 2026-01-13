/**
 * 区块链服务
 */

import { request } from './api';
import type { ApiResponse } from '../types/api';
import type {
  Block,
  BlockchainOverview,
  BlockListParams,
  BlockListResponse,
  Transaction,
  CertificateInfo,
  CertificateVerifyResult,
  CertifyRequest,
  VerifyRequest,
} from '../types/blockchain';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// 获取 Token
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const blockchainService = {
  // 获取区块链概览
  getOverview: () => request.get<BlockchainOverview>('/blockchain/overview'),

  // 获取区块列表
  getBlocks: (params: BlockListParams) =>
    request.get<BlockListResponse>('/blockchain/blocks', params),

  // 获取区块详情
  getBlock: (index: number) =>
    request.get<Block>(`/blockchain/blocks/${index}`),

  // 获取交易详情
  getTransaction: (id: string) =>
    request.get<Transaction>(`/blockchain/transactions/${id}`),

  // 搜索
  search: (query: string, searchType?: string) =>
    request.get<unknown>('/blockchain/search', {
      q: query,
      searchType: searchType || 'block',
      keyword: query,
    }),

  // 验证区块链
  validateChain: () =>
    request.get<{ valid: boolean }>('/blockchain/validate'),

  // 根据知识ID获取证书信息
  getCertificateByKnowledge: (knowledgeId: number) =>
    request.get<CertificateInfo | null>(
      `/blockchain/certificates/knowledge/${knowledgeId}`
    ),

  // 验证证书
  verifyCertificate: (certificateId: string) =>
    request.get<CertificateVerifyResult>(
      `/blockchain/certificates/${certificateId}/verify`
    ),

  // 创建证书
  createCertificate: (data: {
    knowledge_id: number;
    knowledge_title: string;
    user_id: number;
    user_name: string;
  }) => request.post<CertificateInfo>('/blockchain/certificates', data),

  // 下载证书
  downloadCertificate: async (certificateId: string): Promise<void> => {
    try {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/blockchain/certificates/${certificateId}/download`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('下载失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EduChain_Certificate_${certificateId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // 验证内容
  verifyContent: (data: VerifyRequest) =>
    request.post<unknown>('/blockchain/verify', data),

  // 存证内容
  certifyContent: (data: CertifyRequest) =>
    request.post<unknown>('/blockchain/certify', data),
};

export default blockchainService;
