/**
 * 区块链相关 Mock Handlers
 */

import { http, HttpResponse } from 'msw';
import { API_BASE } from '../config';
import { delay } from '../utils/delay';
import { createSuccessResponse, createPageResponse } from '../utils/response';
import {
  mockBlocks,
  mockBlockchainOverview,
  mockCertificates,
  getCertificateByKnowledgeId,
  verifyCertificate,
  getTransactionById,
} from '../data/blockchain';
import { mockKnowledgeItems } from '../data/knowledge';

export const blockchainHandlers = [
  // 获取区块链概览
  http.get(`${API_BASE}/blockchain/overview`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse(mockBlockchainOverview));
  }),

  // 获取区块列表
  http.get(`${API_BASE}/blockchain/blocks`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const blocks = [...mockBlocks].reverse();
    const pageData = createPageResponse(blocks, page, size);

    return HttpResponse.json(
      createSuccessResponse({
        content: pageData.content,
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages,
        currentPage: page,
      })
    );
  }),

  // 获取区块详情
  http.get(`${API_BASE}/blockchain/blocks/:index`, async ({ params }) => {
    await delay();
    const { index } = params;
    const block = mockBlocks.find(b => b.index === Number(index));

    if (block) {
      return HttpResponse.json(createSuccessResponse(block));
    }

    return HttpResponse.json(
      { success: false, message: '区块不存在', data: null },
      { status: 404 }
    );
  }),

  // 获取交易详情
  http.get(`${API_BASE}/blockchain/transactions/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const result = getTransactionById(id as string);

    if (!result) {
      return HttpResponse.json(
        { success: false, message: '交易不存在', data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      createSuccessResponse({
        ...result.transaction,
        blockIndex: result.blockIndex,
        status: 'confirmed',
      })
    );
  }),

  // 根据知识ID获取证书信息
  http.get(`${API_BASE}/blockchain/certificates/knowledge/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const certificate = getCertificateByKnowledgeId(Number(id));
    return HttpResponse.json(createSuccessResponse(certificate));
  }),

  // 验证证书
  http.get(`${API_BASE}/blockchain/certificates/:id/verify`, async ({ params }) => {
    await delay();
    const { id } = params;
    const result = verifyCertificate(id as string);
    return HttpResponse.json(createSuccessResponse(result));
  }),

  // 创建证书
  http.post(`${API_BASE}/blockchain/certificates`, async ({ request }) => {
    await delay();
    const data = (await request.json()) as { knowledge_id: number };
    const newCert = {
      certificate_id: `cert_${mockCertificates.length + 1}`,
      knowledge_id: data.knowledge_id,
      block_index: mockBlocks.length,
      block_hash: mockBlocks[mockBlocks.length - 1].hash,
      content_hash: `hash_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      has_certificate: true,
      pdf_url: `/certificates/cert_${mockCertificates.length + 1}.pdf`,
      qr_code_url: `/qrcodes/cert_${mockCertificates.length + 1}.png`,
      verification_url: `https://educhain.cc/verify/cert_${mockCertificates.length + 1}`,
      created_at: new Date().toISOString(),
    };
    mockCertificates.push(newCert);
    return HttpResponse.json(createSuccessResponse(newCert), { status: 201 });
  }),

  // 下载证书
  http.get(`${API_BASE}/blockchain/certificates/:id/download`, async ({ params }) => {
    await delay();
    const { id } = params;
    const cert = mockCertificates.find(c => c.certificate_id === id);

    if (!cert) {
      return HttpResponse.json(
        { success: false, message: '证书不存在', data: null },
        { status: 404 }
      );
    }

    const knowledge = mockKnowledgeItems.find(k => k.id === cert.knowledge_id);
    const block = mockBlocks.find(b => b.index === cert.block_index);
    const transaction = block?.transactions.find(tx => tx.knowledgeId === cert.knowledge_id);

    const pdfContent = `
═══════════════════════════════════════════════════════════════
                    EduChain 区块链存证证书
═══════════════════════════════════════════════════════════════

证书编号: ${cert.certificate_id}
生成时间: ${cert.created_at ? new Date(cert.created_at).toLocaleString('zh-CN') : '未知'}

知识标题: ${knowledge?.title || '未知标题'}
知识ID: ${cert.knowledge_id}
上传者: ${knowledge?.uploaderName || '未知用户'}

存证时间: ${cert.timestamp ? new Date(cert.timestamp).toLocaleString('zh-CN') : '未知'}
区块索引: #${cert.block_index}
区块哈希: ${cert.block_hash}
内容哈希: ${cert.content_hash}

验证地址: ${cert.verification_url}

═══════════════════════════════════════════════════════════════
                    此证书具有法律效力
═══════════════════════════════════════════════════════════════
`;

    return new Response(pdfContent, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="EduChain_Certificate_${cert.certificate_id}.txt"`,
      },
    });
  }),

  // 区块链搜索
  http.get(`${API_BASE}/blockchain/search`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const searchType = url.searchParams.get('searchType') || 'block';
    const keyword = url.searchParams.get('keyword') || query;

    if (!keyword) {
      return HttpResponse.json(
        { success: false, message: '请输入搜索关键词', data: null },
        { status: 400 }
      );
    }

    if (searchType === 'block' || !isNaN(Number(keyword))) {
      const blockIndex = Number(keyword);
      const block = mockBlocks.find(b => b.index === blockIndex);

      if (block) {
        return HttpResponse.json(
          createSuccessResponse({ type: 'block', data: block })
        );
      }
    }

    if (searchType === 'transaction' || searchType === 'knowledge') {
      const result = getTransactionById(keyword);

      if (result) {
        return HttpResponse.json(
          createSuccessResponse({ type: 'transaction', data: result.transaction })
        );
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ type: 'none', data: null })
    );
  }),

  // 验证区块链
  http.get(`${API_BASE}/blockchain/validate`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ valid: true }));
  }),

  // 验证内容
  http.post(`${API_BASE}/blockchain/verify`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ is_valid: true, message: '验证成功' }));
  }),

  // 存证内容
  http.post(`${API_BASE}/blockchain/certify`, async () => {
    await delay();
    return HttpResponse.json(createSuccessResponse({ success: true, message: '存证成功' }));
  }),
];
