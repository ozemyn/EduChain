/**
 * 自定义国际化工具函数
 * 确保所有语言（包括默认语言）都显示前缀
 */

/**
 * 获取带语言前缀的 URL
 * 强制所有语言都显示前缀，包括默认语言
 * 
 * @param path - 路径（不带语言前缀）
 * @param locale - 语言代码
 * @returns 带语言前缀的完整路径
 * 
 * @example
 * getLocalizedUrl('/knowledge', 'zh-CN') // => '/zh-CN/knowledge'
 * getLocalizedUrl('/knowledge', 'en') // => '/en/knowledge'
 */
export function getLocalizedUrl(path: string, locale: string): string {
  // 移除路径开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 确保 locale 存在
  if (!locale) {
    console.warn('getLocalizedUrl: locale is undefined, using default');
    locale = 'zh-CN';
  }
  
  // 强制添加语言前缀
  return `/${locale}/${cleanPath}`;
}

/**
 * 从路径中移除语言前缀
 * 
 * @param path - 带语言前缀的路径
 * @returns 不带语言前缀的路径
 * 
 * @example
 * removeLocaleFromPath('/zh-CN/knowledge') // => '/knowledge'
 * removeLocaleFromPath('/en/knowledge') // => '/knowledge'
 */
export function removeLocaleFromPath(path: string): string {
  // 匹配 /zh-CN/ 或 /en/ 开头的路径
  const localePattern = /^\/(zh-CN|en)(\/|$)/;
  return path.replace(localePattern, '/');
}
