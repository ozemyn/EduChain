'use client';

/**
 * 应用全局状态 Context
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { Notification } from '@/types/api';

// ============ Types ============
interface AppState {
  loading: boolean;
  notifications: Notification[];
  unreadCount: number;
  sidebarCollapsed: boolean;
  searchHistory: string[];
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_READ'; payload: number }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ADD_SEARCH'; payload: string }
  | { type: 'CLEAR_SEARCH' };

interface AppContextValue extends AppState {
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

// ============ Reducer ============
const initialState: AppState = {
  loading: false,
  notifications: [],
  unreadCount: 0,
  sidebarCollapsed: false,
  searchHistory: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
      };

    case 'ADD_NOTIFICATION': {
      const notifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }

    case 'MARK_READ': {
      const notifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      return {
        ...state,
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [], unreadCount: 0 };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload };

    case 'ADD_SEARCH': {
      const keyword = action.payload.trim();
      if (!keyword) return state;
      const filtered = state.searchHistory.filter((k) => k !== keyword);
      return { ...state, searchHistory: [keyword, ...filtered].slice(0, 10) };
    }

    case 'CLEAR_SEARCH':
      return { ...state, searchHistory: [] };

    default:
      return state;
  }
}

// ============ Context ============
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setNotifications = useCallback((notifications: Notification[]) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    dispatch({ type: 'MARK_READ', payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR', payload: collapsed });
  }, []);

  const addSearchHistory = useCallback((keyword: string) => {
    dispatch({ type: 'ADD_SEARCH', payload: keyword });
  }, []);

  const clearSearchHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
