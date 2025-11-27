import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Notification } from '@/types/api';

// 应用状态类型定义
interface AppState {
  loading: boolean;
  notifications: Notification[];
  unreadCount: number;
  sidebarCollapsed: boolean;
  searchHistory: string[];
}

// Action类型定义
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' };

// 初始状态
const initialState: AppState = {
  loading: false,
  notifications: [],
  unreadCount: 0,
  sidebarCollapsed: false,
  searchHistory: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
      };
    case 'ADD_NOTIFICATION': {
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.isRead).length,
      };
    }
    case 'MARK_NOTIFICATION_READ': {
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length,
      };
    }
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };
    case 'ADD_SEARCH_HISTORY': {
      const keyword = action.payload.trim();
      if (!keyword) return state;

      const filteredHistory = state.searchHistory.filter(
        item => item !== keyword
      );
      const newHistory = [keyword, ...filteredHistory].slice(0, 10); // 保留最近10条

      return {
        ...state,
        searchHistory: newHistory,
      };
    }
    case 'CLEAR_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [],
      };
    default:
      return state;
  }
};

// Context类型定义
interface AppContextType extends AppState {
  setLoading: (loading: boolean) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setNotifications = (notifications: Notification[]): void => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };

  const addNotification = (notification: Notification): void => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: number): void => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = (): void => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const toggleSidebar = (): void => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean): void => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const addSearchHistory = (keyword: string): void => {
    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: keyword });
  };

  const clearSearchHistory = (): void => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
  };

  const value: AppContextType = {
    ...state,
    setLoading,
    setNotifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
    toggleSidebar,
    setSidebarCollapsed,
    addSearchHistory,
    clearSearchHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


