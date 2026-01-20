'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import { useRouter, usePathname } from 'next/navigation';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { useAuth } from '../../src/contexts/auth-context';
import { useDebounce } from '../../src/hooks';
import { searchService, type SearchSuggestion } from '../../src/services/search';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const content = useIntlayer('navbar');
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 检查链接是否激活
  const isLinkActive = useCallback((path: string) => {
    if (!pathname) return false;
    
    // 标准化路径，移除尾部斜杠
    const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
      ? pathname.slice(0, -1) 
      : pathname;
    
    if (path === '/') {
      // 首页匹配：精确匹配 / 或 /locale
      return normalizedPathname === `/${locale}` || normalizedPathname === '/';
    }
    
    // 其他页面：检查是否以该路径开头
    return normalizedPathname === `/${locale}${path}` || 
           normalizedPathname.startsWith(`/${locale}${path}/`);
  }, [pathname, locale]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 搜索建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const result = await searchService.getSuggestions(debouncedQuery);
        setSuggestions(result.data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // 点击外部关闭搜索
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // 搜索处理
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setSearchQuery('');
  }, [router, locale]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    router.push(`/${locale}/search?q=${encodeURIComponent(suggestion.keyword)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSelectedSuggestionIndex(-1);
  }, [router, locale]);

  // 高亮搜索关键词
  const highlightSearchTerm = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="suggestion-highlight">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      } else {
        handleSearch(searchQuery);
      }
      setSelectedSuggestionIndex(-1);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setSelectedSuggestionIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : -1);
    }
  }, [searchQuery, handleSearch, suggestions, selectedSuggestionIndex, handleSuggestionClick]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push(getLocalizedUrl('/', locale));
  };

  // 移除搜索链接，因为已经有搜索框了
  const navLinks = [
    { key: 'home', label: content.home.value, path: '/' },
    { key: 'knowledge', label: content.knowledge.value, path: '/knowledge' },
    { key: 'blockchain', label: content.blockchain.value, path: '/blockchain' },
    { key: 'recommendations', label: content.recommendations.value, path: '/recommendations' },
    { key: 'community', label: content.community.value, path: '/community' },
  ];

  return (
    <>
      <nav 
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label={String(content.mainNavigation?.value || 'Main navigation')}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="navbar-container">
          {/* 左侧区域：Logo + 搜索 */}
          <div className="navbar-left">
            <Link href={getLocalizedUrl('/', locale)} className="navbar-logo">
              <span className="navbar-logo-text">
                <span className="logo-edu">Edu</span>
                <span className="logo-chain">Chain</span>
              </span>
            </Link>

            {/* 导航栏搜索框 */}
            <div 
              className="navbar-search desktop-only" 
              ref={searchRef}
              role="search"
              aria-label={String(content.searchLabel?.value || 'Search')}
            >
              <div className={`navbar-search-wrapper ${searchOpen ? 'focused' : ''}`}>
                <svg 
                  className="navbar-search-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={String(content.searchPlaceholder?.value || '搜索...')}
                  className="navbar-search-input"
                  aria-label={String(content.searchPlaceholder?.value || '搜索')}
                  aria-expanded={searchOpen}
                  aria-controls="search-suggestions"
                  aria-autocomplete="list"
                />
                {isSearching && (
                  <div className="navbar-search-loading" aria-label="Loading">
                    <div className="navbar-search-spinner" role="status" aria-label="Searching..." />
                  </div>
                )}
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="navbar-search-clear"
                    aria-label={String(content.clearSearch?.value || 'Clear search')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 搜索建议下拉 */}
              {searchOpen && (searchQuery || suggestions.length > 0) && (
                <div 
                  id="search-suggestions"
                  className="navbar-search-dropdown"
                  role="listbox"
                  aria-label={String(content.searchSuggestions?.value || 'Search suggestions')}
                >
                  {suggestions.length > 0 ? (
                    suggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={`${suggestion.keyword}-${index}`}
                        type="button"
                        className={`navbar-search-suggestion ${selectedSuggestionIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        role="option"
                        aria-selected={selectedSuggestionIndex === index}
                      >
                        <span className="suggestion-icon" aria-hidden="true">🔍</span>
                        <span className="suggestion-text">
                          {highlightSearchTerm(suggestion.keyword, searchQuery)}
                        </span>
                        {suggestion.count > 0 && (
                          <span className="suggestion-count" aria-label={`${suggestion.count} results`}>
                            {suggestion.count}
                          </span>
                        )}
                      </button>
                    ))
                  ) : searchQuery && !isSearching ? (
                    <div className="navbar-search-empty">
                      {String(content.pressEnterToSearch?.value || `按 Enter 搜索 "${searchQuery}"`)}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* 中间导航链接 - 绝对居中 */}
          <div className="navbar-nav desktop-only" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={getLocalizedUrl(link.path, locale)}
                className={`navbar-link ${isLinkActive(link.path) ? 'active' : ''}`}
                role="menuitem"
                aria-current={isLinkActive(link.path) ? 'page' : undefined}
                itemProp="url"
              >
                <span itemProp="name">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {isAuthenticated && user && (
              <Link 
                href={getLocalizedUrl('/user/notifications', locale)}
                className="navbar-action-btn desktop-only"
                aria-label={String(content.notifications?.value || 'Notifications')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="navbar-badge navbar-badge-pulse" aria-label="3 unread notifications">3</span>
              </Link>
            )}

            <div className="desktop-only">
              <ThemeSwitcher />
            </div>

            <div className="desktop-only">
              <LocaleSwitcher />
            </div>

            {isAuthenticated && user ? (
              <div className="user-menu-container desktop-only">
                <button 
                  className="navbar-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label={String(content.userMenu?.value || 'User menu')}
                >
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="" 
                      className="user-avatar"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // 头像加载失败时显示占位符
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div 
                    className={`user-avatar-placeholder ${user.avatarUrl ? 'hidden' : ''}`}
                    aria-hidden="true"
                  >
                    {(user.fullName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.fullName || user.username}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="user-dropdown" role="menu" aria-label={String(content.userMenu?.value || 'User menu')}>
                    <Link 
                      href={getLocalizedUrl('/knowledge/create', locale)} 
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {content.publish.value}
                    </Link>
                    <Link 
                      href={getLocalizedUrl('/user/profile', locale)} 
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {content.profile.value}
                    </Link>
                    <Link 
                      href={getLocalizedUrl('/user/notifications', locale)} 
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {content.notifications?.value || '通知'}
                    </Link>
                    <Link 
                      href={getLocalizedUrl('/user/activity', locale)} 
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {content.activity?.value || '动态'}
                    </Link>
                    <Link 
                      href={getLocalizedUrl('/user/follow', locale)} 
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {content.follow?.value || '关注'}
                    </Link>
                    <div className="dropdown-divider" role="separator"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout} role="menuitem">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {content.logout.value}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={getLocalizedUrl('/login', locale)} className="navbar-auth-btn navbar-login-btn">
                {content.login.value}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="navbar-mobile-btn mobile-only"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen 
                ? String(content.closeMenu?.value || 'Close menu') 
                : String(content.openMenu?.value || 'Open menu')
              }
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* 移动端菜单 - 从顶部下拉 */}
          <div 
            id="mobile-menu"
            className="mobile-menu-container"
            role="dialog"
            aria-modal="true"
            aria-label={String(content.mobileMenu?.value || 'Mobile menu')}
          >
            <div className="mobile-menu-content">
              {/* 菜单头部 */}
              <div className="mobile-menu-header">
                <span className="mobile-menu-logo navbar-logo-text">
                  <span className="logo-edu">Edu</span>
                  <span className="logo-chain">Chain</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-menu-close"
                  aria-label={String(content.closeMenu?.value || 'Close menu')}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 用户信息卡片 */}
              {isAuthenticated && user && (
                <div className="mobile-user-card">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="" 
                      className="mobile-user-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mobile-user-avatar-placeholder" aria-hidden="true">
                      {(user.fullName || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="mobile-user-info">
                    <div className="mobile-user-name">{user.fullName || user.username}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
              )}

              {/* 导航链接 */}
              <nav className="mobile-nav-section" role="navigation" aria-label={String(content.mobileNavigation?.value || 'Mobile navigation')}>
                <div className="mobile-nav-list">
                  {navLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={getLocalizedUrl(link.path, locale)}
                      className={`mobile-nav-item ${isLinkActive(link.path) ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isLinkActive(link.path) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* 操作按钮区 */}
              <div className="mobile-actions-section">
                {isAuthenticated && user ? (
                  <div className="mobile-actions-grid">
                    <Link 
                      href={getLocalizedUrl('/knowledge/create', locale)}
                      className="mobile-action-item mobile-action-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {content.publish.value}
                    </Link>
                    <button 
                      className="mobile-action-item mobile-action-logout"
                      onClick={handleLogout}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {content.logout.value}
                    </button>
                  </div>
                ) : null}

                {/* 主题和语言切换 */}
                <div className="mobile-settings-row">
                  <span className="mobile-settings-label">{content.theme?.value || '主题'}</span>
                  <div className="mobile-settings-controls">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
