import { message } from 'antd';
import { invalidateCache } from './cache';

// 数据同步事件类型
export type SyncEventType =
  | 'knowledge_created'
  | 'knowledge_updated'
  | 'knowledge_deleted'
  | 'comment_created'
  | 'comment_updated'
  | 'comment_deleted'
  | 'user_followed'
  | 'user_unfollowed'
  | 'notification_received'
  | 'like_added'
  | 'like_removed'
  | 'favorite_added'
  | 'favorite_removed';

export interface SyncEvent {
  type: SyncEventType;
  data: unknown;
  timestamp: number;
  userId?: number;
}

// 数据同步管理器
class DataSyncManager {
  private listeners = new Map<SyncEventType, Set<(data: unknown) => void>>();
  private isOnline = navigator.onLine;
  private syncQueue: SyncEvent[] = [];
  private maxQueueSize = 100;

  constructor() {
    this.setupOnlineStatusListener();
    this.setupPeriodicSync();
  }

  // 监听在线状态变化
  private setupOnlineStatusListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      message.success('网络连接已恢复');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      message.warning('网络连接已断开，数据将在恢复连接后同步');
    });
  }

  // 设置定期同步
  private setupPeriodicSync(): void {
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, 30000); // 每30秒尝试同步一次
  }

  // 添加事件监听器
  on(eventType: SyncEventType, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(callback);

    // 返回取消监听的函数
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  // 触发事件
  emit(eventType: SyncEventType, data: unknown, userId?: number): void {
    const event: SyncEvent = {
      type: eventType,
      data,
      timestamp: Date.now(),
      userId,
    };

    // 如果在线，立即处理
    if (this.isOnline) {
      this.processEvent(event);
    } else {
      // 离线时加入队列
      this.addToSyncQueue(event);
    }
  }

  // 处理事件
  private processEvent(event: SyncEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event.data);
        } catch (error) {
          console.error(
            `Error in sync event listener for ${event.type}:`,
            error
          );
        }
      });
    }

    // 根据事件类型清理相关缓存
    this.invalidateRelatedCache(event.type);
  }

  // 添加到同步队列
  private addToSyncQueue(event: SyncEvent): void {
    if (this.syncQueue.length >= this.maxQueueSize) {
      // 队列满时，移除最旧的事件
      this.syncQueue.shift();
    }

    this.syncQueue.push(event);
  }

  // 处理同步队列
  private processSyncQueue(): void {
    const events = [...this.syncQueue];
    this.syncQueue = [];

    events.forEach(event => {
      this.processEvent(event);
    });

    if (events.length > 0) {
      console.log(`已同步 ${events.length} 个离线事件`);
    }
  }

  // 根据事件类型清理相关缓存
  private invalidateRelatedCache(eventType: SyncEventType): void {
    switch (eventType) {
      case 'knowledge_created':
      case 'knowledge_updated':
      case 'knowledge_deleted':
        invalidateCache('/knowledge');
        invalidateCache('/search');
        break;

      case 'comment_created':
      case 'comment_updated':
      case 'comment_deleted':
        invalidateCache('/comments');
        break;

      case 'user_followed':
      case 'user_unfollowed':
        invalidateCache('/users/follow');
        break;

      case 'notification_received':
        invalidateCache('/notifications');
        break;

      case 'like_added':
      case 'like_removed':
      case 'favorite_added':
      case 'favorite_removed':
        invalidateCache('/interactions');
        break;
    }
  }

  // 获取同步状态
  getStatus(): {
    isOnline: boolean;
    queueSize: number;
    listenerCount: number;
  } {
    let totalListeners = 0;
    this.listeners.forEach(listeners => {
      totalListeners += listeners.size;
    });

    return {
      isOnline: this.isOnline,
      queueSize: this.syncQueue.length,
      listenerCount: totalListeners,
    };
  }

  // 清空同步队列
  clearQueue(): void {
    this.syncQueue = [];
  }

  // 手动触发同步
  forceSync(): void {
    if (this.isOnline) {
      this.processSyncQueue();
    } else {
      message.warning('当前离线，无法同步数据');
    }
  }
}

// 创建全局同步管理器实例
export const dataSyncManager = new DataSyncManager();

// 便捷的同步函数
export const syncKnowledgeCreated = (knowledge: unknown): void => {
  dataSyncManager.emit('knowledge_created', knowledge);
};

export const syncKnowledgeUpdated = (knowledge: unknown): void => {
  dataSyncManager.emit('knowledge_updated', knowledge);
};

export const syncKnowledgeDeleted = (knowledgeId: number): void => {
  dataSyncManager.emit('knowledge_deleted', { id: knowledgeId });
};

export const syncCommentCreated = (comment: unknown): void => {
  dataSyncManager.emit('comment_created', comment);
};

export const syncUserFollowed = (
  userId: number,
  targetUserId: number
): void => {
  dataSyncManager.emit('user_followed', { userId, targetUserId });
};

export const syncUserUnfollowed = (
  userId: number,
  targetUserId: number
): void => {
  dataSyncManager.emit('user_unfollowed', { userId, targetUserId });
};

export const syncNotificationReceived = (notification: unknown): void => {
  dataSyncManager.emit('notification_received', notification);
};

export const syncLikeAdded = (knowledgeId: number, userId: number): void => {
  dataSyncManager.emit('like_added', { knowledgeId, userId });
};

export const syncLikeRemoved = (knowledgeId: number, userId: number): void => {
  dataSyncManager.emit('like_removed', { knowledgeId, userId });
};

export const syncFavoriteAdded = (
  knowledgeId: number,
  userId: number
): void => {
  dataSyncManager.emit('favorite_added', { knowledgeId, userId });
};

export const syncFavoriteRemoved = (
  knowledgeId: number,
  userId: number
): void => {
  dataSyncManager.emit('favorite_removed', { knowledgeId, userId });
};

// React Hook for using sync events
export const useSyncEvent = (
  eventType: SyncEventType,
  callback: (data: unknown) => void
): void => {
  React.useEffect(() => {
    const unsubscribe = dataSyncManager.on(eventType, callback);
    return unsubscribe;
  }, [eventType, callback]);
};

// 导入React用于Hook
import React from 'react';
