import { useState, useEffect, useRef, useCallback } from 'react';

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  paragraphs: number;
  sentences: number;
  readingTime: number; // 分钟
  lines: number;
}

// 原生防抖函数
function debounce<T extends (arg: string) => void>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: number | null = null;

  const debounced = ((arg: string) => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func(arg), wait);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

interface UseTextStatsOptions {
  debounceMs?: number;
  useWorker?: boolean;
  wordsPerMinute?: number; // 阅读速度，默认200字/分钟
}

// 文本统计工具函数
const calculateTextStats = (text: string, wordsPerMinute = 200): TextStats => {
  if (!text || typeof text !== 'string') {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      paragraphs: 0,
      sentences: 0,
      readingTime: 0,
      lines: 0,
    };
  }

  // 移除HTML标签，保留文本内容
  const plainText = text.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ');

  // 字符统计
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, '').length;

  // 单词统计 - 支持中英文
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .reduce((count, word) => {
      // 中文字符按字计算，英文按单词计算
      const chineseChars = (word.match(/[\u4e00-\u9fff]/g) || []).length;
      const englishWords = word.replace(/[\u4e00-\u9fff]/g, '').trim() ? 1 : 0;
      return count + chineseChars + englishWords;
    }, 0);

  // 段落统计
  const paragraphs = plainText
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0).length;

  // 句子统计
  const sentences = plainText
    .split(/[.!?。！？]+/)
    .filter(s => s.trim().length > 0).length;

  // 行数统计
  const lines = plainText.split(/\n/).length;

  // 阅读时间估算（分钟）
  const readingTime = Math.ceil(words / wordsPerMinute);

  return {
    characters,
    charactersNoSpaces,
    words,
    paragraphs,
    sentences,
    readingTime,
    lines,
  };
};

// Web Worker 代码字符串
const workerScript = `
self.onmessage = function(e) {
  const { text, wordsPerMinute } = e.data;
  
  const calculateTextStats = ${calculateTextStats.toString()};
  
  try {
    const stats = calculateTextStats(text, wordsPerMinute);
    self.postMessage({ success: true, stats });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
`;

export const useTextStats = (
  text: string,
  options: UseTextStatsOptions = {}
) => {
  const { debounceMs = 300, useWorker = true, wordsPerMinute = 200 } = options;

  const [stats, setStats] = useState<TextStats>(() =>
    calculateTextStats('', wordsPerMinute)
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 初始化 Web Worker
  useEffect(() => {
    if (useWorker && typeof Worker !== 'undefined') {
      try {
        const blob = new Blob([workerScript], {
          type: 'application/javascript',
        });
        const workerUrl = URL.createObjectURL(blob);
        workerRef.current = new Worker(workerUrl);

        workerRef.current.onmessage = e => {
          const { success, stats: workerStats, error } = e.data;
          if (success) {
            setStats(workerStats);
          } else {
            console.warn('Worker calculation failed:', error);
            // 降级到主线程计算
            setStats(calculateTextStats(text, wordsPerMinute));
          }
          setIsCalculating(false);
        };

        workerRef.current.onerror = error => {
          console.warn('Worker error:', error);
          // 降级到主线程计算
          setStats(calculateTextStats(text, wordsPerMinute));
          setIsCalculating(false);
        };

        return () => {
          if (workerRef.current) {
            workerRef.current.terminate();
            URL.revokeObjectURL(workerUrl);
          }
        };
      } catch (error) {
        console.warn('Failed to create worker:', error);
        workerRef.current = null;
      }
    }
  }, [useWorker, text, wordsPerMinute]);

  // 防抖的统计计算函数
  const debouncedCalculate = useCallback(() => {
    return debounce((textToAnalyze: string) => {
      // 取消之前的计算
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsCalculating(true);

      // 使用 Web Worker 或主线程计算
      if (workerRef.current && useWorker) {
        workerRef.current.postMessage({
          text: textToAnalyze,
          wordsPerMinute,
        });
      } else {
        // 使用 requestIdleCallback 或 setTimeout 来避免阻塞 UI
        const calculate = () => {
          if (abortControllerRef.current?.signal.aborted) {
            return;
          }

          try {
            const newStats = calculateTextStats(textToAnalyze, wordsPerMinute);
            setStats(newStats);
          } catch (error) {
            console.error('Text stats calculation error:', error);
          } finally {
            setIsCalculating(false);
          }
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(calculate, { timeout: 1000 });
        } else {
          setTimeout(calculate, 0);
        }
      }
    }, debounceMs);
  }, [debounceMs, useWorker, wordsPerMinute]);

  // 监听文本变化
  useEffect(() => {
    const debouncedFn = debouncedCalculate();
    debouncedFn(text || '');

    return () => {
      debouncedFn.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [text, debouncedCalculate]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Cleanup handled in useEffect
    };
  }, [debouncedCalculate]);

  return {
    stats,
    isCalculating,
  };
};

export default useTextStats;
