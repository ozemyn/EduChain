package com.example.educhain.service;

import com.example.educhain.entity.User;
import com.example.educhain.repository.UserRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 自定义用户详情服务 */
@Service
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByUsernameOrEmail(usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + usernameOrEmail));

    return new CustomUserPrincipal(user);
  }

  /** 根据用户ID加载用户 */
  public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + userId));

    return new CustomUserPrincipal(user);
  }

  /** 自定义用户主体类 */
  public static class CustomUserPrincipal implements UserDetails {
    private final User user;

    public CustomUserPrincipal(User user) {
      this.user = user;
    }

    public User getUser() {
      return user;
    }

    public Long getId() {
      return user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
      List<GrantedAuthority> authorities = new ArrayList<>();

      // 添加角色权限
      authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

      // 根据角色添加具体权限
      switch (user.getRole()) {
        case ADMIN:
          authorities.add(new SimpleGrantedAuthority("PERMISSION_ADMIN_READ"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_ADMIN_WRITE"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_USER_MANAGE"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_CONTENT_MANAGE"));
          // 管理员拥有所有权限，继续添加学习者权限
        case LEARNER:
          authorities.add(new SimpleGrantedAuthority("PERMISSION_CONTENT_READ"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_CONTENT_WRITE"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_COMMENT_WRITE"));
          authorities.add(new SimpleGrantedAuthority("PERMISSION_INTERACTION"));
          break;
      }

      return authorities;
    }

    @Override
    public String getPassword() {
      return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
      return user.getUsername();
    }

    public String getEmail() {
      return user.getEmail();
    }

    public String getFullName() {
      return user.getFullName();
    }

    public User.UserRole getRole() {
      return user.getRole();
    }

    @Override
    public boolean isAccountNonExpired() {
      return true; // 账户不会过期
    }

    @Override
    public boolean isAccountNonLocked() {
      return user.getStatus() == 1; // 状态为1表示账户未锁定
    }

    @Override
    public boolean isCredentialsNonExpired() {
      return true; // 凭证不会过期
    }

    @Override
    public boolean isEnabled() {
      return user.getStatus() == 1; // 状态为1表示账户启用
    }

    /** 检查是否有指定权限 */
    public boolean hasPermission(String permission) {
      return getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals(permission));
    }

    /** 检查是否有指定角色 */
    public boolean hasRole(String role) {
      return getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }

    /** 检查是否为管理员 */
    public boolean isAdmin() {
      return user.getRole() == User.UserRole.ADMIN;
    }

    /** 检查是否为学习者 */
    public boolean isLearner() {
      return user.getRole() == User.UserRole.LEARNER;
    }

    @Override
    public String toString() {
      return "CustomUserPrincipal{"
          + "id="
          + user.getId()
          + ", username='"
          + user.getUsername()
          + '\''
          + ", role="
          + user.getRole()
          + ", enabled="
          + isEnabled()
          + '}';
    }
  }
}
