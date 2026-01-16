/**
 * 国际化时间格式化工具
 */

export interface RelativeTimeUnits {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  weeksAgo: string;
  monthsAgo: string;
  yearsAgo: string;
}

/**
 * 格式化相对时间（支持国际化）
 */
export function formatRelativeTimeI18n(
  date: string | Date,
  units: RelativeTimeUnits
): string {
  const now = Date.now();
  const target = new Date(date).getTime();
  const diff = now - target;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) return units.justNow;
  if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} ${units.minutesAgo}`;
  }
  if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return `${hrs} ${units.hoursAgo}`;
  }
  if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} ${units.daysAgo}`;
  }
  if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks} ${units.weeksAgo}`;
  }
  if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} ${units.monthsAgo}`;
  }
  const years = Math.floor(diff / year);
  return `${years} ${units.yearsAgo}`;
}

/**
 * 格式化日期（支持国际化）
 */
export function formatDateI18n(
  date: string | Date,
  locale: string = 'zh-CN'
): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
