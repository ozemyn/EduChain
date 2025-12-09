/**
 * Mock参数验证工具
 * 与后端验证规则保持一致
 */

import { createErrorResponse } from './errorCodes';

/**
 * 验证必填参数
 */
export const validateRequired = (
  params: Record<string, unknown>,
  requiredFields: string[]
) => {
  for (const field of requiredFields) {
    if (
      params[field] === undefined ||
      params[field] === null ||
      params[field] === ''
    ) {
      return createErrorResponse('MISSING_PARAMETER', `参数 ${field} 不能为空`);
    }
  }
  return null;
};

/**
 * 验证分页参数
 */
export const validatePagination = (page?: number, size?: number) => {
  if (page !== undefined && (page < 0 || !Number.isInteger(page))) {
    return createErrorResponse('PARAMETER_TYPE_ERROR', '页码必须是非负整数');
  }

  if (
    size !== undefined &&
    (size < 1 || size > 100 || !Number.isInteger(size))
  ) {
    return createErrorResponse(
      'PARAMETER_TYPE_ERROR',
      '每页大小必须是1-100之间的整数'
    );
  }

  return null;
};

/**
 * 验证ID参数
 */
export const validateId = (id: unknown, fieldName: string = 'ID') => {
  const numId = Number(id);
  if (isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
    return createErrorResponse(
      'PARAMETER_TYPE_ERROR',
      `${fieldName}必须是正整数`
    );
  }
  return null;
};

/**
 * 验证字符串长度
 */
export const validateStringLength = (
  value: string,
  fieldName: string,
  minLength: number = 0,
  maxLength: number = 255
) => {
  if (value.length < minLength) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      `${fieldName}长度不能少于${minLength}个字符`
    );
  }

  if (value.length > maxLength) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      `${fieldName}长度不能超过${maxLength}个字符`
    );
  }

  return null;
};

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return createErrorResponse('VALIDATION_ERROR', '邮箱格式不正确');
  }
  return null;
};

/**
 * 验证用户名格式
 */
export const validateUsername = (username: string) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      '用户名只能包含字母、数字和下划线，长度3-20个字符'
    );
  }
  return null;
};

/**
 * 验证搜索关键词
 */
export const validateSearchKeyword = (keyword: string) => {
  if (!keyword || keyword.trim().length === 0) {
    return createErrorResponse('VALIDATION_ERROR', '搜索关键词不能为空');
  }

  if (keyword.length > 100) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      '搜索关键词长度不能超过100个字符'
    );
  }

  return null;
};

/**
 * 验证枚举值
 */
export const validateEnum = (
  value: string,
  allowedValues: string[],
  fieldName: string
) => {
  if (!allowedValues.includes(value)) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      `${fieldName}必须是以下值之一: ${allowedValues.join(', ')}`
    );
  }
  return null;
};

/**
 * 验证日期格式
 */
export const validateDate = (dateString: string, fieldName: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return createErrorResponse(
      'VALIDATION_ERROR',
      `${fieldName}日期格式不正确`
    );
  }
  return null;
};

/**
 * 组合验证器
 */
export const validate = (...validators: ((() => unknown) | null)[]) => {
  for (const validator of validators) {
    if (validator) {
      const result = typeof validator === 'function' ? validator() : validator;
      if (result) {
        return result;
      }
    }
  }
  return null;
};
