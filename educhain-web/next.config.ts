import type { NextConfig } from "next";
import { withIntlayer } from "next-intlayer/server";

const nextConfig: NextConfig = {
  // 启用静态导出
  output: 'export',
  
  // 禁用图片优化（静态导出不支持 next/image 优化）
  images: {
    unoptimized: true,
  },
  
  // 添加 trailing slash（Cloudflare Pages 推荐）
  trailingSlash: true,
  
  // 可选：如果需要部署到子目录，取消注释以下配置
  // basePath: '/demo',
  // assetPrefix: '/demo',
};

export default withIntlayer(nextConfig);
