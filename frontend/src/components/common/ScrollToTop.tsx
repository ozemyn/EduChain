/* ===================================
   滚动到顶部组件 - ScrollToTop Component
   ===================================
   
   在路由变化时自动滚动到页面顶部
   
   ================================== */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 滚动到顶部组件
 * 监听路由变化，自动滚动到页面顶部
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 延迟滚动，确保页面内容已加载
    timeoutRef.current = window.setTimeout(() => {
      // 使用 requestAnimationFrame 确保 DOM 更新完成后再滚动
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    }, 50);

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
