'use client';

/**
 * 认证状态管理 Context
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@/types/api';
import { authService } from '@/services/auth';
import { storage, token } from '@/lib';
import { STORAGE_KEY } from '@/config';

// ============ Types ============
interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

interface AuthContextValue extends AuthState {
  login: (username: string, password: string, requiredRole?: 'ADMIN' | 'LEARNER') => Promise<User>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (user: User) => void;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  school?: string;
}

// ============ Reducer ============
const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// ============ Context ============
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = token.getAccessToken();
      const refreshToken = token.getRefreshToken();
      const cachedUser = storage.get<User>(STORAGE_KEY.USER);

      if (!accessToken || !refreshToken) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // 检查 token 是否过期
      if (token.isExpired(accessToken)) {
        token.clearAuth();
        dispatch({ type: 'LOGOUT' });
        return;
      }

      // 使用缓存的用户信息
      if (cachedUser) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: cachedUser, accessToken, refreshToken },
        });
        return;
      }

      // 获取用户信息
      try {
        const res = await authService.getCurrentUser();
        storage.set(STORAGE_KEY.USER, res.data);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: res.data, accessToken, refreshToken },
        });
      } catch {
        token.clearAuth();
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = useCallback(
    async (username: string, password: string, requiredRole?: 'ADMIN' | 'LEARNER'): Promise<User> => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const res = await authService.login({ usernameOrEmail: username, password });
        const { user, accessToken, refreshToken } = res.data;

        // 角色验证
        if (requiredRole && user.role !== requiredRole) {
          const roleNames = { ADMIN: '管理员', LEARNER: '普通用户' };
          throw new Error(`此账号不是${roleNames[requiredRole]}账号`);
        }

        // 保存认证信息
        token.setTokens(accessToken, refreshToken);
        storage.set(STORAGE_KEY.USER, user);

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken, refreshToken } });
        return user;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    []
  );

  // 注册
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.register(data);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    authService.logout(state.user?.id || 0).catch(() => {});
    token.clearAuth();
    dispatch({ type: 'LOGOUT' });
  }, [state.user?.id]);

  // 更新用户信息
  const updateUser = useCallback((user: User) => {
    storage.set(STORAGE_KEY.USER, user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
