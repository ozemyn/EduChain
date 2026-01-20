/**
 * className 合并工具
 * 用于合并 Tailwind CSS 类名
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

function toVal(mix: ClassValue): string {
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (Array.isArray(mix)) {
    for (const item of mix) {
      const val = toVal(item);
      if (val) {
        str && (str += ' ');
        str += val;
      }
    }
  }

  return str;
}

/** 合并 className */
export function cn(...inputs: ClassValue[]): string {
  let str = '';
  for (const input of inputs) {
    const val = toVal(input);
    if (val) {
      str && (str += ' ');
      str += val;
    }
  }
  return str;
}
