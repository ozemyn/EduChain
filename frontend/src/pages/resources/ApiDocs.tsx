/* ===================================
   API 文档页面 - API Documentation Page
   ===================================
   
   特性：
   - 使用全局样式系统
   - 完整的响应式设计
   - 交互式 API 测试
   - 详细的参数说明
   
   ================================== */

import React, { useState } from 'react';

// API 端点类型定义
interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  requestBody?: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
  };
  responses?: Array<{
    code: number;
    description: string;
  }>;
  requestExample?: string;
  responseExample?: string;
  statusCodes?: Array<{
    code: number;
    description: string;
  }>;
}
import {
  Card,
  Typography,
  Tabs,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Collapse,
  Alert,
} from 'antd';
import {
  ApiOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Resources.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;

const ApiDocs: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('');

  const apiCategories = [
    {
      key: 'auth',
      title: '认证 API',
      icon: <SafetyOutlined />,
      description: '用户认证、授权和会话管理相关接口',
    },
    {
      key: 'users',
      title: '用户 API',
      icon: <UserOutlined />,
      description: '用户信息管理、个人资料和偏好设置',
    },
    {
      key: 'content',
      title: '内容 API',
      icon: <DatabaseOutlined />,
      description: '内容发布、编辑、查询和管理功能',
    },
    {
      key: 'blockchain',
      title: '区块链 API',
      icon: <CodeOutlined />,
      description: '区块链存证、验证和查询服务',
    },
  ];

  const userEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/users/me',
      summary: '获取当前用户信息',
      description: '获取当前登录用户的详细信息',
      parameters: [
        {
          name: 'include_stats',
          type: 'boolean',
          required: false,
          description: '是否包含统计信息',
        },
        {
          name: 'include_preferences',
          type: 'boolean',
          required: false,
          description: '是否包含用户偏好设置',
        },
      ],
      requestExample: `GET /api/v1/users/me?include_stats=true&include_preferences=true`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 12345,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "full_name": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "资深AI研究员，专注深度学习领域",
    "location": "北京",
    "website": "https://zhangsan.com",
    "verified": true,
    "role": "premium_user",
    "level": 15,
    "experience_points": 8520,
    "stats": {
      "followers_count": 1520,
      "following_count": 89,
      "content_count": 156,
      "total_likes": 8920,
      "total_views": 125000,
      "certificates_count": 45
    },
    "preferences": {
      "theme": "dark",
      "language": "zh-CN",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      },
      "privacy": {
        "profile_visibility": "public",
        "show_email": false,
        "show_stats": true
      }
    },
    "subscription": {
      "plan": "premium",
      "expires_at": "2026-12-07T00:00:00Z",
      "auto_renew": true
    },
    "created_at": "2023-01-15T08:30:00Z",
    "last_login": "2025-12-07T10:00:00Z"
  }
}`,
      statusCodes: [
        { code: 200, description: '获取成功' },
        { code: 401, description: '未授权' },
      ],
    },
    {
      method: 'PUT',
      path: '/api/v1/users/me',
      summary: '更新用户资料',
      description: '更新当前用户的个人资料信息',
      parameters: [
        {
          name: 'full_name',
          type: 'string',
          required: false,
          description: '真实姓名或昵称',
        },
        {
          name: 'bio',
          type: 'string',
          required: false,
          description: '个人简介，最多500字符',
        },
        {
          name: 'location',
          type: 'string',
          required: false,
          description: '所在地区',
        },
        {
          name: 'website',
          type: 'string',
          required: false,
          description: '个人网站URL',
        },
        {
          name: 'avatar',
          type: 'string',
          required: false,
          description: '头像URL',
        },
        {
          name: 'social_links',
          type: 'object',
          required: false,
          description: '社交媒体链接',
        },
        {
          name: 'skills',
          type: 'array',
          required: false,
          description: '技能标签列表',
        },
        {
          name: 'interests',
          type: 'array',
          required: false,
          description: '兴趣领域列表',
        },
      ],
      requestExample: `{
  "full_name": "张三教授",
  "bio": "清华大学计算机系教授，AI领域专家，发表论文100+篇",
  "location": "北京",
  "website": "https://zhangsan-prof.com",
  "social_links": {
    "github": "https://github.com/zhangsan",
    "twitter": "https://twitter.com/zhangsan",
    "linkedin": "https://linkedin.com/in/zhangsan"
  },
  "skills": ["机器学习", "深度学习", "Python", "TensorFlow"],
  "interests": ["人工智能", "计算机视觉", "自然语言处理"]
}`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 12345,
    "full_name": "张三教授",
    "bio": "清华大学计算机系教授，AI领域专家，发表论文100+篇",
    "updated_at": "2025-12-07T15:30:00Z"
  },
  "message": "资料更新成功"
}`,
      statusCodes: [
        { code: 200, description: '更新成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '未授权' },
        { code: 422, description: '数据验证失败' },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/users/{id}',
      summary: '获取用户公开信息',
      description: '获取指定用户的公开资料信息',
      parameters: [
        { name: 'id', type: 'integer', required: true, description: '用户ID' },
        {
          name: 'include_content',
          type: 'boolean',
          required: false,
          description: '是否包含最新内容',
        },
      ],
      requestExample: `GET /api/v1/users/67890?include_content=true`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 67890,
    "username": "lisi",
    "full_name": "李四",
    "avatar": "https://example.com/avatar2.jpg",
    "bio": "前端开发工程师，Vue.js 贡献者",
    "location": "上海",
    "website": "https://lisi.dev",
    "verified": true,
    "level": 12,
    "stats": {
      "followers_count": 856,
      "following_count": 234,
      "content_count": 89,
      "total_likes": 4520
    },
    "skills": ["Vue.js", "React", "JavaScript", "TypeScript"],
    "recent_content": [
      {
        "id": 1003,
        "title": "Vue 3 组合式API最佳实践",
        "cover_image": "https://example.com/vue3-api.jpg",
        "created_at": "2025-12-06T14:00:00Z"
      }
    ],
    "joined_at": "2023-06-20T10:15:00Z"
  }
}`,
      statusCodes: [
        { code: 200, description: '获取成功' },
        { code: 404, description: '用户不存在' },
        { code: 403, description: '用户资料不公开' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/users/{id}/follow',
      summary: '关注用户',
      description: '关注指定用户，建立关注关系',
      parameters: [
        {
          name: 'id',
          type: 'integer',
          required: true,
          description: '要关注的用户ID',
        },
      ],
      requestExample: `POST /api/v1/users/67890/follow`,
      responseExample: `{
  "success": true,
  "data": {
    "user_id": 67890,
    "followed": true,
    "followed_at": "2025-12-07T16:00:00Z",
    "mutual_follow": false
  },
  "message": "关注成功"
}`,
      statusCodes: [
        { code: 200, description: '关注成功' },
        { code: 400, description: '不能关注自己' },
        { code: 401, description: '未授权' },
        { code: 404, description: '用户不存在' },
        { code: 409, description: '已经关注该用户' },
      ],
    },
    {
      method: 'DELETE',
      path: '/api/v1/users/{id}/follow',
      summary: '取消关注',
      description: '取消关注指定用户',
      parameters: [
        {
          name: 'id',
          type: 'integer',
          required: true,
          description: '要取消关注的用户ID',
        },
      ],
      requestExample: `DELETE /api/v1/users/67890/follow`,
      responseExample: `{
  "success": true,
  "data": {
    "user_id": 67890,
    "followed": false,
    "unfollowed_at": "2025-12-07T16:05:00Z"
  },
  "message": "取消关注成功"
}`,
      statusCodes: [
        { code: 200, description: '取消关注成功' },
        { code: 401, description: '未授权' },
        { code: 404, description: '用户不存在或未关注' },
      ],
    },
  ];

  const blockchainEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/blockchain/certify',
      summary: '内容存证',
      description: '将内容哈希存储到区块链上，生成不可篡改的存证记录',
      parameters: [
        {
          name: 'content_id',
          type: 'integer',
          required: true,
          description: '内容ID',
        },
        {
          name: 'content_hash',
          type: 'string',
          required: false,
          description: '内容哈希值（可选，系统自动计算）',
        },
        {
          name: 'metadata',
          type: 'object',
          required: false,
          description: '存证元数据',
        },
        {
          name: 'certificate_type',
          type: 'string',
          required: false,
          description: '证书类型：standard, premium, legal',
        },
        {
          name: 'auto_renew',
          type: 'boolean',
          required: false,
          description: '是否自动续期',
        },
      ],
      requestExample: `{
  "content_id": 12345,
  "metadata": {
    "title": "深度学习研究论文",
    "author": "张三教授",
    "institution": "清华大学",
    "category": "academic_paper",
    "keywords": ["深度学习", "神经网络", "AI"],
    "abstract": "本文提出了一种新的深度学习算法..."
  },
  "certificate_type": "premium",
  "auto_renew": true
}`,
      responseExample: `{
  "success": true,
  "data": {
    "certificate_id": "cert_abc123456",
    "content_id": 12345,
    "content_hash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef12",
    "block_number": 18234567,
    "network": "ethereum_mainnet",
    "gas_used": 21000,
    "gas_price": "20000000000",
    "certificate_url": "https://educhain.com/certificates/cert_abc123456",
    "qr_code": "https://educhain.com/qr/cert_abc123456.png",
    "status": "pending",
    "estimated_confirmation_time": 180,
    "created_at": "2025-12-07T10:00:00Z"
  },
  "message": "存证请求已提交，预计3分钟内完成确认"
}`,
      statusCodes: [
        { code: 201, description: '存证请求成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '未授权' },
        { code: 402, description: '余额不足' },
        { code: 404, description: '内容不存在' },
        { code: 409, description: '内容已存证' },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/blockchain/certificates/{id}',
      summary: '获取存证详情',
      description: '获取指定存证证书的详细信息',
      parameters: [
        { name: 'id', type: 'string', required: true, description: '证书ID' },
        {
          name: 'include_verification',
          type: 'boolean',
          required: false,
          description: '是否包含验证信息',
        },
      ],
      requestExample: `GET /api/v1/blockchain/certificates/cert_abc123456?include_verification=true`,
      responseExample: `{
  "success": true,
  "data": {
    "certificate_id": "cert_abc123456",
    "content_id": 12345,
    "content_hash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef12",
    "block_number": 18234567,
    "block_hash": "0x9876543210fedcba9876543210fedcba98765432",
    "network": "ethereum_mainnet",
    "confirmations": 156,
    "status": "confirmed",
    "metadata": {
      "title": "深度学习研究论文",
      "author": "张三教授",
      "institution": "清华大学",
      "timestamp": "2025-12-07T10:00:00Z"
    },
    "certificate_type": "premium",
    "certificate_url": "https://educhain.com/certificates/cert_abc123456",
    "pdf_certificate": "https://educhain.com/certificates/cert_abc123456.pdf",
    "qr_code": "https://educhain.com/qr/cert_abc123456.png",
    "verification": {
      "is_valid": true,
      "verified_at": "2025-12-07T16:30:00Z",
      "verification_method": "blockchain_query",
      "integrity_check": "passed"
    },
    "legal_info": {
      "jurisdiction": "China",
      "legal_framework": "Electronic Signature Law",
      "evidence_level": "high"
    },
    "created_at": "2025-12-07T10:00:00Z",
    "confirmed_at": "2025-12-07T10:03:15Z",
    "expires_at": "2030-12-07T10:00:00Z"
  }
}`,
      statusCodes: [
        { code: 200, description: '获取成功' },
        { code: 404, description: '证书不存在' },
        { code: 403, description: '无权访问此证书' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/blockchain/verify',
      summary: '验证存证',
      description: '验证文件或内容的区块链存证真实性',
      parameters: [
        {
          name: 'certificate_id',
          type: 'string',
          required: false,
          description: '证书ID（二选一）',
        },
        {
          name: 'file_hash',
          type: 'string',
          required: false,
          description: '文件哈希值（二选一）',
        },
        {
          name: 'file',
          type: 'file',
          required: false,
          description: '要验证的文件（可选）',
        },
      ],
      requestExample: `{
  "certificate_id": "cert_abc123456"
}

或者

{
  "file_hash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"
}`,
      responseExample: `{
  "success": true,
  "data": {
    "verification_id": "verify_xyz789",
    "is_valid": true,
    "certificate_id": "cert_abc123456",
    "content_hash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    "blockchain_record": {
      "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef12",
      "block_number": 18234567,
      "timestamp": "2025-12-07T10:03:15Z",
      "confirmations": 156
    },
    "verification_details": {
      "hash_match": true,
      "timestamp_valid": true,
      "blockchain_confirmed": true,
      "integrity_check": "passed"
    },
    "certificate_info": {
      "title": "深度学习研究论文",
      "author": "张三教授",
      "certified_at": "2025-12-07T10:00:00Z"
    },
    "verification_report_url": "https://educhain.com/verification/verify_xyz789.pdf",
    "verified_at": "2025-12-07T16:30:00Z"
  }
}`,
      statusCodes: [
        { code: 200, description: '验证完成' },
        { code: 400, description: '请求参数错误' },
        { code: 404, description: '未找到相关存证记录' },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/blockchain/transactions/{hash}',
      summary: '查询交易状态',
      description: '查询区块链交易的详细状态信息',
      parameters: [
        {
          name: 'hash',
          type: 'string',
          required: true,
          description: '交易哈希值',
        },
      ],
      requestExample: `GET /api/v1/blockchain/transactions/0xabcdef1234567890abcdef1234567890abcdef12`,
      responseExample: `{
  "success": true,
  "data": {
    "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef12",
    "status": "confirmed",
    "block_number": 18234567,
    "block_hash": "0x9876543210fedcba9876543210fedcba98765432",
    "transaction_index": 45,
    "from_address": "0x1234567890abcdef1234567890abcdef12345678",
    "to_address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "gas_used": 21000,
    "gas_price": "20000000000",
    "gas_limit": 25000,
    "transaction_fee": "0.00042",
    "confirmations": 156,
    "network": "ethereum_mainnet",
    "timestamp": "2025-12-07T10:03:15Z",
    "data": "0x存证数据...",
    "logs": [
      {
        "address": "0xcontract_address",
        "topics": ["0xtopic1", "0xtopic2"],
        "data": "0xevent_data"
      }
    ]
  }
}`,
      statusCodes: [
        { code: 200, description: '查询成功' },
        { code: 404, description: '交易不存在' },
        { code: 503, description: '区块链网络不可用' },
      ],
    },
  ];

  const authEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      summary: '用户登录',
      description: '使用邮箱和密码进行用户登录认证，支持多种登录方式',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: '用户邮箱地址',
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: '用户密码',
        },
        {
          name: 'remember_me',
          type: 'boolean',
          required: false,
          description: '是否记住登录状态，默认false',
        },
        {
          name: 'device_info',
          type: 'object',
          required: false,
          description: '设备信息，用于安全验证',
        },
        {
          name: 'captcha_token',
          type: 'string',
          required: false,
          description: '验证码令牌（多次失败后需要）',
        },
      ],
      requestExample: `{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true,
  "device_info": {
    "device_type": "web",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.100"
  }
}`,
      responseExample: `{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_expires_in": 2592000,
    "user": {
      "id": 12345,
      "email": "user@example.com",
      "username": "zhangsan",
      "name": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "verified": true,
      "role": "user",
      "permissions": ["read", "write", "comment"],
      "last_login": "2025-12-07T10:00:00Z"
    },
    "session": {
      "id": "sess_abc123",
      "device_type": "web",
      "expires_at": "2025-12-07T14:00:00Z"
    }
  }
}`,
      statusCodes: [
        { code: 200, description: '登录成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '邮箱或密码错误' },
        { code: 423, description: '账户被锁定' },
        { code: 429, description: '登录尝试次数过多' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/register',
      summary: '用户注册',
      description: '创建新的用户账户，支持邮箱验证和手机验证',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: '用户邮箱地址，必须唯一',
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: '用户密码（至少8位，包含字母和数字）',
        },
        {
          name: 'username',
          type: 'string',
          required: true,
          description: '用户名，3-20字符，字母数字下划线',
        },
        {
          name: 'name',
          type: 'string',
          required: true,
          description: '真实姓名或昵称',
        },
        {
          name: 'phone',
          type: 'string',
          required: false,
          description: '手机号码，用于安全验证',
        },
        {
          name: 'invitation_code',
          type: 'string',
          required: false,
          description: '邀请码（如有）',
        },
        {
          name: 'agree_terms',
          type: 'boolean',
          required: true,
          description: '是否同意服务条款',
        },
        {
          name: 'subscribe_newsletter',
          type: 'boolean',
          required: false,
          description: '是否订阅邮件通知',
        },
      ],
      requestExample: `{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "username": "newuser2025",
  "name": "李四",
  "phone": "13800138000",
  "invitation_code": "INV123456",
  "agree_terms": true,
  "subscribe_newsletter": true
}`,
      responseExample: `{
  "success": true,
  "data": {
    "user_id": 12346,
    "email": "newuser@example.com",
    "username": "newuser2025",
    "name": "李四",
    "status": "pending_verification",
    "verification_sent": true,
    "verification_expires_at": "2025-12-08T10:00:00Z",
    "created_at": "2025-12-07T10:00:00Z"
  },
  "message": "注册成功，请查收验证邮件"
}`,
      statusCodes: [
        { code: 201, description: '注册成功' },
        { code: 400, description: '请求参数错误' },
        { code: 409, description: '邮箱或用户名已存在' },
        { code: 422, description: '密码强度不够' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/refresh',
      summary: '刷新访问令牌',
      description: '使用刷新令牌获取新的访问令牌',
      parameters: [
        {
          name: 'refresh_token',
          type: 'string',
          required: true,
          description: '刷新令牌',
        },
      ],
      requestExample: `{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
      responseExample: `{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}`,
      statusCodes: [
        { code: 200, description: '刷新成功' },
        { code: 401, description: '刷新令牌无效或过期' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/logout',
      summary: '用户登出',
      description: '注销当前会话，使访问令牌失效',
      parameters: [
        {
          name: 'all_devices',
          type: 'boolean',
          required: false,
          description: '是否登出所有设备，默认false',
        },
      ],
      requestExample: `{
  "all_devices": false
}`,
      responseExample: `{
  "success": true,
  "message": "登出成功"
}`,
      statusCodes: [
        { code: 200, description: '登出成功' },
        { code: 401, description: '未授权' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/forgot-password',
      summary: '忘记密码',
      description: '发送密码重置邮件',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: '注册邮箱地址',
        },
      ],
      requestExample: `{
  "email": "user@example.com"
}`,
      responseExample: `{
  "success": true,
  "message": "密码重置邮件已发送，请查收邮箱"
}`,
      statusCodes: [
        { code: 200, description: '邮件发送成功' },
        { code: 404, description: '邮箱不存在' },
        { code: 429, description: '发送频率过高' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/reset-password',
      summary: '重置密码',
      description: '使用重置令牌设置新密码',
      parameters: [
        {
          name: 'token',
          type: 'string',
          required: true,
          description: '密码重置令牌',
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: '新密码',
        },
        {
          name: 'password_confirmation',
          type: 'string',
          required: true,
          description: '确认新密码',
        },
      ],
      requestExample: `{
  "token": "reset_token_abc123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}`,
      responseExample: `{
  "success": true,
  "message": "密码重置成功，请使用新密码登录"
}`,
      statusCodes: [
        { code: 200, description: '重置成功' },
        { code: 400, description: '令牌无效或过期' },
        { code: 422, description: '密码不符合要求' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/auth/verify-email',
      summary: '验证邮箱',
      description: '验证用户邮箱地址',
      parameters: [
        {
          name: 'token',
          type: 'string',
          required: true,
          description: '邮箱验证令牌',
        },
      ],
      requestExample: `{
  "token": "verify_token_xyz789"
}`,
      responseExample: `{
  "success": true,
  "data": {
    "user_id": 12346,
    "email_verified": true,
    "verified_at": "2025-12-07T11:00:00Z"
  },
  "message": "邮箱验证成功"
}`,
      statusCodes: [
        { code: 200, description: '验证成功' },
        { code: 400, description: '令牌无效或过期' },
        { code: 409, description: '邮箱已验证' },
      ],
    },
  ];

  const contentEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/content',
      summary: '获取内容列表',
      description: '分页获取平台上的内容列表，支持筛选和排序',
      parameters: [
        {
          name: 'page',
          type: 'integer',
          required: false,
          description: '页码，从0开始',
        },
        {
          name: 'size',
          type: 'integer',
          required: false,
          description: '每页数量，默认20，最大100',
        },
        {
          name: 'category',
          type: 'string',
          required: false,
          description: '内容分类',
        },
        {
          name: 'type',
          type: 'string',
          required: false,
          description: '内容类型：TEXT, IMAGE, VIDEO, PDF',
        },
        {
          name: 'sort',
          type: 'string',
          required: false,
          description:
            '排序方式：created_at, updated_at, view_count, like_count',
        },
        {
          name: 'order',
          type: 'string',
          required: false,
          description: '排序顺序：asc, desc',
        },
        {
          name: 'author_id',
          type: 'integer',
          required: false,
          description: '作者ID',
        },
        {
          name: 'tags',
          type: 'string',
          required: false,
          description: '标签，多个用逗号分隔',
        },
        {
          name: 'keyword',
          type: 'string',
          required: false,
          description: '关键词搜索',
        },
        {
          name: 'date_from',
          type: 'string',
          required: false,
          description: '开始日期 YYYY-MM-DD',
        },
        {
          name: 'date_to',
          type: 'string',
          required: false,
          description: '结束日期 YYYY-MM-DD',
        },
      ],
      requestExample: `GET /api/v1/content?page=0&size=10&category=technology&sort=created_at&order=desc&tags=React,JavaScript`,
      responseExample: `{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1001,
        "title": "React 最佳实践指南",
        "content": "本文介绍了 React 开发中的最佳实践...",
        "excerpt": "React 是一个用于构建用户界面的 JavaScript 库...",
        "type": "TEXT",
        "category": {
          "id": 5,
          "name": "technology",
          "display_name": "技术"
        },
        "tags": ["React", "前端", "JavaScript"],
        "author": {
          "id": 12345,
          "name": "张三",
          "username": "zhangsan",
          "avatar": "https://example.com/avatar.jpg",
          "verified": true
        },
        "stats": {
          "view_count": 1250,
          "like_count": 89,
          "comment_count": 23,
          "share_count": 15,
          "bookmark_count": 67
        },
        "cover_image": "https://example.com/cover.jpg",
        "reading_time": 8,
        "difficulty": "intermediate",
        "is_featured": false,
        "is_premium": false,
        "blockchain_certified": true,
        "certificate_id": "cert_abc123",
        "created_at": "2025-12-07T10:00:00Z",
        "updated_at": "2025-12-07T10:00:00Z",
        "published_at": "2025-12-07T10:05:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "total_elements": 156,
      "total_pages": 16,
      "has_next": true,
      "has_previous": false
    },
    "filters": {
      "categories": [
        {"id": 1, "name": "programming", "count": 45},
        {"id": 2, "name": "design", "count": 23}
      ],
      "tags": [
        {"name": "React", "count": 12},
        {"name": "Vue", "count": 8}
      ]
    }
  }
}`,
      statusCodes: [
        { code: 200, description: '获取成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '未授权访问' },
        { code: 429, description: '请求频率超限' },
      ],
    },
    {
      method: 'POST',
      path: '/api/v1/content',
      summary: '发布内容',
      description: '创建并发布新的内容，支持多种格式和媒体类型',
      parameters: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description: '内容标题，最长200字符',
        },
        {
          name: 'content',
          type: 'string',
          required: true,
          description: '内容正文，支持Markdown格式',
        },
        {
          name: 'excerpt',
          type: 'string',
          required: false,
          description: '内容摘要，最长500字符',
        },
        {
          name: 'type',
          type: 'string',
          required: true,
          description: '内容类型：TEXT, IMAGE, VIDEO, PDF, AUDIO',
        },
        {
          name: 'category_id',
          type: 'integer',
          required: true,
          description: '分类ID',
        },
        {
          name: 'tags',
          type: 'array',
          required: false,
          description: '标签列表，最多10个',
        },
        {
          name: 'is_public',
          type: 'boolean',
          required: false,
          description: '是否公开，默认true',
        },
        {
          name: 'allow_comments',
          type: 'boolean',
          required: false,
          description: '是否允许评论，默认true',
        },
        {
          name: 'cover_image',
          type: 'string',
          required: false,
          description: '封面图片URL',
        },
        {
          name: 'difficulty',
          type: 'string',
          required: false,
          description: '难度等级：beginner, intermediate, advanced',
        },
        {
          name: 'estimated_time',
          type: 'integer',
          required: false,
          description: '预计阅读时间（分钟）',
        },
        {
          name: 'is_premium',
          type: 'boolean',
          required: false,
          description: '是否为付费内容',
        },
        {
          name: 'price',
          type: 'number',
          required: false,
          description: '价格（元），付费内容必填',
        },
        {
          name: 'auto_certify',
          type: 'boolean',
          required: false,
          description: '是否自动区块链存证',
        },
        {
          name: 'publish_at',
          type: 'string',
          required: false,
          description: '定时发布时间 ISO8601格式',
        },
      ],
      requestExample: `{
  "title": "Vue.js 3.0 新特性详解",
  "content": "# Vue.js 3.0 新特性详解\\n\\nVue.js 3.0 带来了许多激动人心的新特性...",
  "excerpt": "本文详细介绍了Vue.js 3.0的主要新特性和改进",
  "type": "TEXT",
  "category_id": 5,
  "tags": ["Vue.js", "前端", "JavaScript", "框架"],
  "is_public": true,
  "allow_comments": true,
  "cover_image": "https://example.com/vue3-cover.jpg",
  "difficulty": "intermediate",
  "estimated_time": 15,
  "is_premium": false,
  "auto_certify": true
}`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 1002,
    "title": "Vue.js 3.0 新特性详解",
    "slug": "vuejs-3-new-features",
    "status": "published",
    "url": "https://educhain.com/content/1002",
    "cover_image": "https://example.com/vue3-cover.jpg",
    "reading_time": 15,
    "blockchain_certified": false,
    "certificate_pending": true,
    "created_at": "2025-12-07T10:30:00Z",
    "published_at": "2025-12-07T10:30:00Z"
  },
  "message": "内容发布成功，区块链存证正在处理中"
}`,
      statusCodes: [
        { code: 201, description: '发布成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '未授权' },
        { code: 403, description: '权限不足' },
        { code: 413, description: '内容过大' },
        { code: 422, description: '内容格式错误' },
      ],
    },
    {
      method: 'GET',
      path: '/api/v1/content/{id}',
      summary: '获取内容详情',
      description: '根据ID获取单个内容的详细信息',
      parameters: [
        { name: 'id', type: 'integer', required: true, description: '内容ID' },
        {
          name: 'include_stats',
          type: 'boolean',
          required: false,
          description: '是否包含统计信息',
        },
        {
          name: 'include_comments',
          type: 'boolean',
          required: false,
          description: '是否包含评论',
        },
      ],
      requestExample: `GET /api/v1/content/1002?include_stats=true&include_comments=true`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 1002,
    "title": "Vue.js 3.0 新特性详解",
    "content": "# Vue.js 3.0 新特性详解\\n\\n...",
    "excerpt": "本文详细介绍了Vue.js 3.0的主要新特性",
    "type": "TEXT",
    "category": {
      "id": 5,
      "name": "frontend",
      "display_name": "前端开发"
    },
    "tags": ["Vue.js", "前端", "JavaScript"],
    "author": {
      "id": 12345,
      "name": "李四",
      "username": "lisi",
      "avatar": "https://example.com/avatar2.jpg",
      "bio": "前端开发专家",
      "verified": true,
      "follower_count": 1520
    },
    "stats": {
      "view_count": 2340,
      "like_count": 156,
      "comment_count": 45,
      "share_count": 23,
      "bookmark_count": 89
    },
    "interactions": {
      "liked": false,
      "bookmarked": true,
      "followed_author": false
    },
    "cover_image": "https://example.com/vue3-cover.jpg",
    "reading_time": 15,
    "difficulty": "intermediate",
    "is_premium": false,
    "blockchain_certified": true,
    "certificate": {
      "id": "cert_vue3_123",
      "transaction_hash": "0xabc123...",
      "block_number": 18234567,
      "certified_at": "2025-12-07T10:35:00Z"
    },
    "related_content": [
      {
        "id": 1003,
        "title": "Vue.js 组件最佳实践",
        "cover_image": "https://example.com/vue-components.jpg"
      }
    ],
    "comments": [
      {
        "id": 501,
        "content": "非常详细的教程，学到了很多！",
        "author": {
          "id": 67890,
          "name": "王五",
          "avatar": "https://example.com/avatar3.jpg"
        },
        "like_count": 12,
        "created_at": "2025-12-07T11:00:00Z"
      }
    ],
    "created_at": "2025-12-07T10:30:00Z",
    "updated_at": "2025-12-07T10:30:00Z",
    "published_at": "2025-12-07T10:30:00Z"
  }
}`,
      statusCodes: [
        { code: 200, description: '获取成功' },
        { code: 404, description: '内容不存在' },
        { code: 403, description: '无权访问私有内容' },
        { code: 410, description: '内容已被删除' },
      ],
    },
    {
      method: 'PUT',
      path: '/api/v1/content/{id}',
      summary: '更新内容',
      description: '更新已发布的内容，支持部分更新',
      parameters: [
        { name: 'id', type: 'integer', required: true, description: '内容ID' },
        {
          name: 'title',
          type: 'string',
          required: false,
          description: '内容标题',
        },
        {
          name: 'content',
          type: 'string',
          required: false,
          description: '内容正文',
        },
        {
          name: 'excerpt',
          type: 'string',
          required: false,
          description: '内容摘要',
        },
        {
          name: 'tags',
          type: 'array',
          required: false,
          description: '标签列表',
        },
        {
          name: 'cover_image',
          type: 'string',
          required: false,
          description: '封面图片',
        },
        {
          name: 'difficulty',
          type: 'string',
          required: false,
          description: '难度等级',
        },
        {
          name: 'update_reason',
          type: 'string',
          required: false,
          description: '更新原因说明',
        },
      ],
      requestExample: `{
  "title": "Vue.js 3.0 完整特性详解（更新版）",
  "content": "# Vue.js 3.0 完整特性详解\\n\\n更新内容：添加了最新的API说明...",
  "tags": ["Vue.js", "前端", "JavaScript", "框架", "3.0"],
  "update_reason": "添加了最新的API文档和示例代码"
}`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 1002,
    "title": "Vue.js 3.0 完整特性详解（更新版）",
    "version": 2,
    "updated_at": "2025-12-07T15:30:00Z",
    "update_reason": "添加了最新的API文档和示例代码"
  },
  "message": "内容更新成功"
}`,
      statusCodes: [
        { code: 200, description: '更新成功' },
        { code: 400, description: '请求参数错误' },
        { code: 401, description: '未授权' },
        { code: 403, description: '无权编辑此内容' },
        { code: 404, description: '内容不存在' },
      ],
    },
    {
      method: 'DELETE',
      path: '/api/v1/content/{id}',
      summary: '删除内容',
      description: '删除指定的内容，支持软删除和硬删除',
      parameters: [
        { name: 'id', type: 'integer', required: true, description: '内容ID' },
        {
          name: 'hard_delete',
          type: 'boolean',
          required: false,
          description: '是否硬删除，默认false',
        },
        {
          name: 'delete_reason',
          type: 'string',
          required: false,
          description: '删除原因',
        },
      ],
      requestExample: `DELETE /api/v1/content/1002?hard_delete=false`,
      responseExample: `{
  "success": true,
  "data": {
    "id": 1002,
    "status": "deleted",
    "deleted_at": "2025-12-07T16:00:00Z",
    "recoverable_until": "2026-01-06T16:00:00Z"
  },
  "message": "内容已删除，30天内可恢复"
}`,
      statusCodes: [
        { code: 200, description: '删除成功' },
        { code: 401, description: '未授权' },
        { code: 403, description: '无权删除此内容' },
        { code: 404, description: '内容不存在' },
      ],
    },
  ];

  const renderEndpointDetails = (endpoint: ApiEndpoint) => (
    <div className="endpoint-details">
      <div className="endpoint-header">
        <Space>
          <Tag
            color={
              endpoint.method === 'GET'
                ? 'blue'
                : endpoint.method === 'POST'
                  ? 'green'
                  : 'orange'
            }
          >
            {endpoint.method}
          </Tag>
          <code className="endpoint-path">{endpoint.path}</code>
        </Space>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={() => setActiveEndpoint(endpoint.path)}
          className="glass-button glass-strong hover-lift active-scale"
        >
          测试 API
        </Button>
      </div>

      <Paragraph>{endpoint.description}</Paragraph>

      <Title level={5}>请求参数</Title>
      <Table
        dataSource={endpoint.parameters}
        columns={[
          {
            title: '参数名',
            dataIndex: 'name',
            key: 'name',
            render: text => <code>{text}</code>,
          },
          { title: '类型', dataIndex: 'type', key: 'type' },
          {
            title: '必需',
            dataIndex: 'required',
            key: 'required',
            render: required =>
              required ? <Tag color="red">必需</Tag> : <Tag>可选</Tag>,
          },
          { title: '说明', dataIndex: 'description', key: 'description' },
        ]}
        pagination={false}
        size="small"
      />

      <Title level={5}>请求示例</Title>
      <div className="code-block">
        <pre>{endpoint.requestExample || '暂无示例'}</pre>
      </div>

      <Title level={5}>响应示例</Title>
      <div className="code-block">
        <pre>{endpoint.responseExample || '暂无示例'}</pre>
      </div>

      <Title level={5}>状态码</Title>
      <Table
        dataSource={endpoint.statusCodes || endpoint.responses}
        columns={[
          {
            title: '状态码',
            dataIndex: 'code',
            key: 'code',
            render: code => (
              <Tag color={code === 200 || code === 201 ? 'green' : 'red'}>
                {code}
              </Tag>
            ),
          },
          { title: '说明', dataIndex: 'description', key: 'description' },
        ]}
        pagination={false}
        size="small"
      />
    </div>
  );

  return (
    <div className="resources-page animate-fade-in">
      <div className="resources-container container">
        {/* 页面头部 */}
        <header className="resources-header glass-light animate-fade-in-down">
          <div className="header-icon-wrapper">
            <div className="header-icon glass-badge animate-scale-in">
              <ApiOutlined />
            </div>
          </div>
          <Title level={1} className="gradient-text">
            API 文档
          </Title>
          <Text type="secondary">完整的 RESTful API 接口文档</Text>
        </header>

        {/* API 概览 */}
        <Card className="api-overview glass-card animate-fade-in-up delay-100">
          <Title level={3}>API 概览</Title>
          <Paragraph>
            EduChain API 是一套 RESTful 风格的 HTTP
            API，提供了完整的平台功能访问接口。 所有 API 都使用 JSON
            格式进行数据交换，支持 HTTPS 加密传输。
          </Paragraph>

          <Alert
            type="info"
            showIcon
            description={
              <div>
                <strong>API 基础信息</strong>
                <div style={{ marginTop: 8 }}>
                  <p>
                    <strong>Base URL:</strong> https://api.educhain.com/v1
                  </p>
                  <p>
                    <strong>认证方式:</strong> Bearer Token (JWT)
                  </p>
                  <p>
                    <strong>请求格式:</strong> application/json
                  </p>
                  <p>
                    <strong>响应格式:</strong> application/json
                  </p>
                  <p>
                    <strong>字符编码:</strong> UTF-8
                  </p>
                </div>
              </div>
            }
          />
        </Card>

        {/* API 分类 */}
        <Card className="api-categories glass-card animate-fade-in-up delay-200">
          <Title level={3}>API 分类</Title>
          <div className="category-grid">
            {apiCategories.map(category => (
              <Card key={category.key} className="category-card" hoverable>
                <div className="category-icon">{category.icon}</div>
                <Title level={4}>{category.title}</Title>
                <Paragraph type="secondary">{category.description}</Paragraph>
              </Card>
            ))}
          </div>
        </Card>

        {/* API 详细文档 */}
        <Card className="api-docs glass-card animate-fade-in-up delay-300">
          <Tabs defaultActiveKey="auth" type="card">
            <TabPane
              tab={
                <span>
                  <SafetyOutlined />
                  认证 API
                </span>
              }
              key="auth"
            >
              <Collapse ghost>
                {authEndpoints.map((endpoint, index) => (
                  <Panel
                    key={index}
                    header={
                      <div className="endpoint-summary">
                        <Space>
                          <Tag
                            color={endpoint.method === 'GET' ? 'blue' : 'green'}
                          >
                            {endpoint.method}
                          </Tag>
                          <Text strong>{endpoint.summary}</Text>
                          <code>{endpoint.path}</code>
                        </Space>
                      </div>
                    }
                  >
                    {renderEndpointDetails(endpoint)}
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DatabaseOutlined />
                  内容 API
                </span>
              }
              key="content"
            >
              <Collapse ghost>
                {contentEndpoints.map((endpoint, index) => (
                  <Panel
                    key={index}
                    header={
                      <div className="endpoint-summary">
                        <Space>
                          <Tag
                            color={endpoint.method === 'GET' ? 'blue' : 'green'}
                          >
                            {endpoint.method}
                          </Tag>
                          <Text strong>{endpoint.summary}</Text>
                          <code>{endpoint.path}</code>
                        </Space>
                      </div>
                    }
                  >
                    {renderEndpointDetails(endpoint)}
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  用户 API
                </span>
              }
              key="users"
            >
              <Collapse ghost>
                {userEndpoints.map((endpoint, index) => (
                  <Panel
                    key={index}
                    header={
                      <div className="endpoint-summary">
                        <Space>
                          <Tag
                            color={
                              endpoint.method === 'GET'
                                ? 'blue'
                                : endpoint.method === 'POST'
                                  ? 'green'
                                  : endpoint.method === 'PUT'
                                    ? 'orange'
                                    : 'red'
                            }
                          >
                            {endpoint.method}
                          </Tag>
                          <Text strong>{endpoint.summary}</Text>
                          <code>{endpoint.path}</code>
                        </Space>
                      </div>
                    }
                  >
                    {renderEndpointDetails(endpoint)}
                  </Panel>
                ))}
              </Collapse>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CodeOutlined />
                  区块链 API
                </span>
              }
              key="blockchain"
            >
              <Collapse ghost>
                {blockchainEndpoints.map((endpoint, index) => (
                  <Panel
                    key={index}
                    header={
                      <div className="endpoint-summary">
                        <Space>
                          <Tag
                            color={
                              endpoint.method === 'GET'
                                ? 'blue'
                                : endpoint.method === 'POST'
                                  ? 'green'
                                  : 'orange'
                            }
                          >
                            {endpoint.method}
                          </Tag>
                          <Text strong>{endpoint.summary}</Text>
                          <code>{endpoint.path}</code>
                        </Space>
                      </div>
                    }
                  >
                    {renderEndpointDetails(endpoint)}
                  </Panel>
                ))}
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>

        {/* API 测试工具 */}
        {activeEndpoint && (
          <Card className="api-tester glass-card animate-fade-in-up delay-400">
            <Title level={3}>
              <PlayCircleOutlined /> API 测试工具
            </Title>
            <Paragraph>
              测试接口：<code>{activeEndpoint}</code>
            </Paragraph>

            <Space
              size="large"
              style={{ width: '100%', flexDirection: 'column' }}
            >
              <div>
                <Text strong>请求头：</Text>
                <TextArea
                  rows={3}
                  placeholder="Authorization: Bearer your_token_here"
                  defaultValue="Content-Type: application/json"
                />
              </div>

              <div>
                <Text strong>请求体：</Text>
                <TextArea rows={6} placeholder="输入 JSON 格式的请求数据" />
              </div>

              <Space>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  className="glass-button glass-strong hover-lift active-scale"
                >
                  发送请求
                </Button>
                <Button
                  icon={<CopyOutlined />}
                  className="glass-button hover-lift active-scale"
                >
                  复制 cURL
                </Button>
              </Space>

              {/* 响应结果将在实际测试时显示 */}
            </Space>
          </Card>
        )}

        {/* 错误码说明 */}
        <Card className="error-codes glass-card animate-fade-in-up delay-500">
          <Title level={3}>
            <ExclamationCircleOutlined /> 通用错误码
          </Title>
          <Table
            dataSource={[
              {
                code: 400,
                message: 'Bad Request',
                description: '请求参数错误或格式不正确',
              },
              {
                code: 401,
                message: 'Unauthorized',
                description: '未提供认证信息或认证失败',
              },
              {
                code: 403,
                message: 'Forbidden',
                description: '权限不足，无法访问该资源',
              },
              {
                code: 404,
                message: 'Not Found',
                description: '请求的资源不存在',
              },
              {
                code: 429,
                message: 'Too Many Requests',
                description: '请求频率超过限制',
              },
              {
                code: 500,
                message: 'Internal Server Error',
                description: '服务器内部错误',
              },
            ]}
            columns={[
              {
                title: '状态码',
                dataIndex: 'code',
                key: 'code',
                render: code => <Tag color="red">{code}</Tag>,
              },
              { title: '错误信息', dataIndex: 'message', key: 'message' },
              { title: '说明', dataIndex: 'description', key: 'description' },
            ]}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
