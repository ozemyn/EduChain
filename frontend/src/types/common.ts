// 通用类型定义
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface TableColumn<T = Record<string, unknown>> {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filters?: { text: string; value: unknown }[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'upload' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  rules?: unknown[];
}

// 路由相关类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  requireAuth?: boolean;
  roles?: string[];
  title?: string;
}

// 主题相关类型
export interface ThemeConfig {
  primaryColor: string;
  borderRadius: number;
  colorBgContainer: string;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}
