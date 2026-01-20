'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function RootPage() {
  // 服务端重定向到默认语言
  redirect('/zh-CN');
}
