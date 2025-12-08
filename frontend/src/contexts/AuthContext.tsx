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
        token: action.payload.accessToken,
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
  login: (
    username: string,
    password: string,
    requiredRole?: 'ADMIN' | 'LEARNER'
  ) => Promise<User>;
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
      const token = Storage.getLocal<string>(STORAGE_KEYS.TOKEN);
      const refreshToken = Storage.getLocal<string>(STORAGE_KEYS.REFRESH_TOKEN);
      const userInfo = Storage.getLocal<User>(STORAGE_KEYS.USER_INFO);

      console.log('AuthContext初始化:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUserInfo: !!userInfo,
      });

      if (token && refreshToken) {
        try {
          // 首先检查token是否过期
          try {
            const tokenPayload = token.split('.')[1];
            const decodedToken = JSON.parse(atob(tokenPayload));
            const currentTime = Date.now() / 1000;

            console.log('Token信息:', {
              exp: decodedToken.exp,
              current: currentTime,
              expired: decodedToken.exp < currentTime,
              tokenLength: token.length,
              tokenParts: token.split('.').length,
            });

            if (decodedToken.exp < currentTime) {
              console.log('Token已过期，清除存储');
              Storage.removeLocal(STORAGE_KEYS.TOKEN);
              Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
              Storage.removeLocal(STORAGE_KEYS.USER_INFO);
              dispatch({ type: 'LOGOUT' });
              return;
            }
          } catch (tokenError) {
            console.error('Token解析失败:', tokenError);
            Storage.removeLocal(STORAGE_KEYS.TOKEN);
            Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
            Storage.removeLocal(STORAGE_KEYS.USER_INFO);
            dispatch({ type: 'LOGOUT' });
            return;
          }

          // 如果有缓存的用户信息，先使用缓存
          if (userInfo) {
            console.log('使用缓存的用户信息');
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: userInfo,
                accessToken: token as string,
                refreshToken: refreshToken as string,
                expiresIn: 0,
              },
            });
            return;
          }

          // 验证token有效性，获取用户信息
          console.log('验证token并获取用户信息');
          const response = await authService.getCurrentUser();
          console.log('获取用户信息成功:', response.data);

          // 更新缓存
          Storage.setLocal(STORAGE_KEYS.USER_INFO, response.data);

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              accessToken: token as string,
              refreshToken: refreshToken as string,
              expiresIn: 0,
            },
          });
        } catch (error) {
          console.error('Token验证失败:', error);
          // Token无效，清除存储
          Storage.removeLocal(STORAGE_KEYS.TOKEN);
          Storage.removeLocal(STORAGE_KEYS.REFRESH_TOKEN);
          Storage.removeLocal(STORAGE_KEYS.USER_INFO);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        console.log('没有token，设置为未登录状态');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = async (
    username: string,
    password: string,
    requiredRole?: 'ADMIN' | 'LEARNER'
  ): Promise<User> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login({
        usernameOrEmail: username,
        password,
      });

      const user = response.data.user;

      // 如果指定了角色要求，进行验证
      if (requiredRole && user.role !== requiredRole) {
        const roleNames = {
          ADMIN: '管理员',
          LEARNER: '普通用户',
        };
        throw new Error(`此账号不是${roleNames[requiredRole]}账号`);
      }

      // 存储到localStorage
      Storage.setLocal(STORAGE_KEYS.TOKEN, response.data.accessToken);
      Storage.setLocal(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      Storage.setLocal(STORAGE_KEYS.USER_INFO, response.data.user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        },
      });

      message.success('登录成功');
      return user;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      message.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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

      Storage.setLocal(STORAGE_KEYS.TOKEN, response.data.accessToken);
      Storage.setLocal(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

      dispatch({
        type: 'SET_TOKEN',
        payload: {
          token: response.data.accessToken,
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
