package com.example.educhain.util;

import com.example.educhain.entity.KnowledgeItem;
import com.example.educhain.entity.User;
import com.example.educhain.exception.BusinessException;
import com.example.educhain.repository.KnowledgeItemRepository;
import com.example.educhain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/** 权限检查工具类 */
@Component
public class PermissionChecker {

  @Autowired private UserRepository userRepository;

  @Autowired private KnowledgeItemRepository knowledgeItemRepository;

  /** 检查是否有管理员权限 */
  public boolean hasAdminPermission(Long userId) {
    if (userId == null) {
      return false;
    }
    return userRepository
        .findById(userId)
        .map(user -> user.getRole() == User.UserRole.ADMIN)
        .orElse(false);
  }

  /** 检查是否可以编辑知识内容 */
  public boolean canEditKnowledge(Long knowledgeId, Long userId) {
    if (userId == null || knowledgeId == null) {
      return false;
    }

    KnowledgeItem item =
        knowledgeItemRepository
            .findById(knowledgeId)
            .orElseThrow(() -> new BusinessException("KNOWLEDGE_NOT_FOUND", "知识内容不存在"));

    return item.getUploaderId().equals(userId) || hasAdminPermission(userId);
  }

  /** 检查是否可以删除知识内容 */
  public boolean canDeleteKnowledge(Long knowledgeId, Long userId) {
    return canEditKnowledge(knowledgeId, userId);
  }

  /** 检查是否可以管理用户 */
  public boolean canManageUser(Long operatorId, Long targetUserId) {
    if (operatorId == null || targetUserId == null) {
      return false;
    }

    // 管理员可以管理所有用户，但不能管理自己
    return hasAdminPermission(operatorId) && !operatorId.equals(targetUserId);
  }

  /** 检查是否可以访问管理功能 */
  public boolean canAccessAdminFeatures(Long userId) {
    return hasAdminPermission(userId);
  }

  /** 验证编辑权限并抛出异常 */
  public void validateEditPermission(Long knowledgeId, Long userId) {
    if (!canEditKnowledge(knowledgeId, userId)) {
      throw new BusinessException("ACCESS_DENIED", "无权限编辑此内容");
    }
  }

  /** 验证删除权限并抛出异常 */
  public void validateDeletePermission(Long knowledgeId, Long userId) {
    if (!canDeleteKnowledge(knowledgeId, userId)) {
      throw new BusinessException("ACCESS_DENIED", "无权限删除此内容");
    }
  }

  /** 验证管理员权限并抛出异常 */
  public void validateAdminPermission(Long userId) {
    if (!hasAdminPermission(userId)) {
      throw new BusinessException("ACCESS_DENIED", "需要管理员权限");
    }
  }
}
