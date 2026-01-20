/**
 * 组件统一导出
 * 
 * 目录结构:
 * - common/      通用组件 (ErrorBoundary, MockIndicator 等)
 * - layout/      布局组件 (Navbar, Footer, Sidebar 等)
 * - providers/   Provider 组件 (MockProvider, ThemeProvider 等)
 * - ui/          UI 基础组件 (Button, Input, Modal 等) - 待创建
 * - knowledge/   知识相关组件 - 待创建
 * - search/      搜索相关组件 - 待创建
 * - blockchain/  区块链相关组件 - 待创建
 */

// 通用组件
export * from './common';

// 布局组件
export * from './layout';

// Provider 组件
export * from './providers';

// 功能组件
export { default as RecommendationList } from './RecommendationList/RecommendationList';
export { LocaleSwitcher } from './LocaleSwitcher/LocaleSwitcher';
export { ThemeSwitcher } from './ThemeSwitcher/ThemeSwitcher';
export { default as MarkdownRenderer } from './MarkdownRenderer/MarkdownRenderer';

// 知识库组件
export * from './knowledge';
