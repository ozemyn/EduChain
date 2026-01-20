/**
 * 验证工具
 */

import { REGEX, FILE_UPLOAD } from '@/config';

/** 验证邮箱 */
export function isValidEmail(email: string): boolean {
  return REGEX.email.test(email);
}

/** 验证手机号 */
export function isValidPhone(phone: string): boolean {
  return REGEX.phone.test(phone);
}

/** 验证用户名 */
export function isValidUsername(username: string): boolean {
  return REGEX.username.test(username);
}

/** 验证密码强度 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) errors.push('密码长度至少8位');
  if (!/[a-z]/.test(password)) errors.push('需包含小写字母');
  if (!/[A-Z]/.test(password)) errors.push('需包含大写字母');
  if (!/\d/.test(password)) errors.push('需包含数字');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('需包含特殊字符');

  return { valid: errors.length === 0, errors };
}

/** 验证URL */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/** 验证文件类型 */
export function isValidFileType(file: File, allowedTypes: readonly string[]): boolean {
  return allowedTypes.includes(file.type);
}

/** 验证文件大小 */
export function isValidFileSize(file: File, maxSizeMB?: number): boolean {
  const maxBytes = (maxSizeMB ?? FILE_UPLOAD.maxSize / 1024 / 1024) * 1024 * 1024;
  return file.size <= maxBytes;
}

/** 验证图片文件 */
export function isValidImage(file: File): boolean {
  return isValidFileType(file, FILE_UPLOAD.allowedImageTypes) && isValidFileSize(file);
}

/** 验证视频文件 */
export function isValidVideo(file: File): boolean {
  return isValidFileType(file, FILE_UPLOAD.allowedVideoTypes) && isValidFileSize(file);
}
