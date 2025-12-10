// 区块链服务API
import api from './api';
import type { ApiResponse } from '@/types/api';
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
} from '@/types/blockchain';

export const blockchainService = {
  // 获取区块链概览
  getOverview: async (): Promise<ApiResponse<BlockchainOverview>> => {
    const response = await api.get<ApiResponse<BlockchainOverview>>(
      '/blockchain/overview'
    );
    return response.data;
  },

  // 获取区块列表
  getBlocks: async (
    params: BlockListParams
  ): Promise<ApiResponse<BlockListResponse>> => {
    const response = await api.get<ApiResponse<BlockListResponse>>(
      '/blockchain/blocks',
      { params }
    );
    return response.data;
  },

  // 获取区块详情
  getBlock: async (index: number): Promise<ApiResponse<Block>> => {
    const response = await api.get<ApiResponse<Block>>(
      `/blockchain/blocks/${index}`
    );
    return response.data;
  },

  // 获取交易详情
  getTransaction: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get<ApiResponse<Transaction>>(
      `/blockchain/transactions/${id}`
    );
    return response.data;
  },

  // 搜索
  search: async (
    query: string,
    searchType?: string
  ): Promise<ApiResponse<unknown>> => {
    const response = await api.get<ApiResponse<unknown>>('/blockchain/search', {
      params: {
        q: query,
        searchType: searchType || 'block',
        keyword: query,
      },
    });
    return response.data;
  },

  // 验证区块链
  validateChain: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await api.get<ApiResponse<{ valid: boolean }>>(
      '/blockchain/validate'
    );
    return response.data;
  },

  // 根据知识ID获取证书信息
  getCertificateByKnowledge: async (
    knowledgeId: number
  ): Promise<ApiResponse<CertificateInfo | null>> => {
    const response = await api.get<ApiResponse<CertificateInfo | null>>(
      `/blockchain/certificates/knowledge/${knowledgeId}`
    );
    return response.data;
  },

  // 验证证书
  verifyCertificate: async (
    certificateId: string
  ): Promise<ApiResponse<CertificateVerifyResult>> => {
    const response = await api.get<ApiResponse<CertificateVerifyResult>>(
      `/blockchain/certificates/${certificateId}/verify`
    );
    return response.data;
  },

  // 创建证书
  createCertificate: async (data: {
    knowledge_id: number;
    knowledge_title: string;
    user_id: number;
    user_name: string;
  }): Promise<ApiResponse<CertificateInfo>> => {
    const response = await api.post<ApiResponse<CertificateInfo>>(
      '/blockchain/certificates',
      data
    );
    return response.data;
  },

  // 下载证书
  downloadCertificate: async (certificateId: string): Promise<void> => {
    try {
      const response = await api.get(
        `/blockchain/certificates/${certificateId}/download`,
        { responseType: 'blob' }
      );

      // 创建下载链接
      const blob = new Blob([response.data], { type: 'text/plain' });
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
  verifyContent: async (data: VerifyRequest): Promise<ApiResponse<unknown>> => {
    const response = await api.post<ApiResponse<unknown>>(
      '/blockchain/verify',
      data
    );
    return response.data;
  },

  // 存证内容
  certifyContent: async (
    data: CertifyRequest
  ): Promise<ApiResponse<unknown>> => {
    const response = await api.post<ApiResponse<unknown>>(
      '/blockchain/certify',
      data
    );
    return response.data;
  },
};

export default blockchainService;
