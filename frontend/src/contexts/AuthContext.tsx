import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginResponse } from '@/types/api';

// 注册数据类型
interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  school?: string;
  confirmPassword?: string;
}
import { authService } from '@/services/auth';
import { Storage, STORAGE_KEYS } from '@/utils/storage';
import { message } from 'antd';

// 状态类型定义
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Action类型定义
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: { token: string; refreshToken: string } };

// 初始状态
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
};

// Context类型定义
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (user: User) => void;
  refreshAuthToken: () => Promise<void>;
}

// 创建Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      const token = Storage.getLocal(STORAGE_KEYS.TOKEN);
      const refreshToken = Storage.getLocal(STORAGE_KEYS.REFRESH_TOKEN);

      if (token && refreshToken) {
        try {
          // 验证token有效性，获取用户信息
          const response = await authService.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: token as string,
              refreshToken: refreshToken as string,
              expiresIn: 0, // 这里不需要使用
            },
          });
        } catch {
          // Token无效，清除存储
          Storage.removeLocal(STORAGE_KEYS.TOKEN);
          Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
          Storage.removeLocal(STORAGE_KEYS.USER_INFO);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = async (username: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login({ username, password });

      // 存储到localStorage
      Storage.setLocal(STORAGE_KEYS.TOKEN, response.data.token);
      Storage.setLocal(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      Storage.setLocal(STORAGE_KEYS.USER_INFO, response.data.user);

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      message.success('登录成功');
    } catch (error: unknown) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      message.error(errorMessage);
      throw error;
    }
  };

  // 注册
  const register = async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.register(data);
      message.success('注册成功，请登录');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '注册失败';
      message.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 登出
  const logout = (): void => {
    try {
      authService.logout(state.user?.id || 0).catch(() => {
        // 忽略登出接口错误
      });
    } finally {
      // 清除本地存储
      Storage.removeLocal(STORAGE_KEYS.TOKEN);
      Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
      Storage.removeLocal(STORAGE_KEYS.USER_INFO);

      dispatch({ type: 'LOGOUT' });
      message.success('已退出登录');
    }
  };

  // 更新用户信息
  const updateUser = (user: User): void => {
    Storage.setLocal(STORAGE_KEYS.USER_INFO, user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // 刷新token
  const refreshAuthToken = async (): Promise<void> => {
    try {
      if (!state.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(state.refreshToken);

      Storage.setLocal(STORAGE_KEYS.TOKEN, response.data.token);
      Storage.setLocal(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

      dispatch({
        type: 'SET_TOKEN',
        payload: {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        },
      });
    } catch (error) {
      // 刷新失败，退出登录
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
