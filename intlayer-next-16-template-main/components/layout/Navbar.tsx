'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import { useRouter } from 'next/navigation';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { useAuth } from '../../src/contexts/auth-context';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const content = useIntlayer('navbar');
  const { locale } = useLocale();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { key: 'home', label: content.home.value, path: '/' },
    { key: 'knowledge', label: content.knowledge.value, path: '/knowledge' },
    { key: 'blockchain', label: content.blockchain.value, path: '/blockchain' },
    { key: 'search', label: content.search.value, path: '/search' },
    { key: 'recommendations', label: content.recommendations.value, path: '/recommendations' },
    { key: 'community', label: content.community.value, path: '/community' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container container">
          <Link href={getLocalizedUrl('/', locale)} className="navbar-logo">
            <span className="navbar-logo-text">
              <span className="logo-edu">Edu</span>
              <span className="logo-chain">Chain</span>
            </span>
          </Link>

          <div className="navbar-nav desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={getLocalizedUrl(link.path, locale)}
                className="navbar-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {isAuthenticated && user && (
              <button className="navbar-action-btn desktop-only">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="navbar-badge">3</span>
              </button>
            )}

            <div className="desktop-only">
              <ThemeSwitcher />
            </div>

            <div className="desktop-only">
              <LocaleSwitcher />
            </div>

            {isAuthenticated && user ? (
              <>
                <Link 
                  href={getLocalizedUrl('/knowledge/create', locale)} 
                  className="navbar-auth-btn navbar-publish-btn desktop-only"
                >
                  {content.publish.value}
                </Link>
                
                <div className="user-menu-container desktop-only">
                  <button 
                    className="navbar-user-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName || user.username} className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {(user.fullName || user.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="user-name">{user.fullName || user.username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <Link 
                        href={getLocalizedUrl('/profile', locale)} 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {content.profile.value}
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {content.logout.value}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href={getLocalizedUrl('/login', locale)} className="navbar-auth-btn navbar-login-btn">
                {content.login.value}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="navbar-mobile-btn mobile-only"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-modal-backdrop animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] glass-modal z-modal animate-slide-in-right">
            <div className="flex flex-col h-full p-6">
              <div className="mobile-drawer-header">
                <span className="navbar-logo-text text-2xl">
                  <span className="logo-edu">Edu</span>
                  <span className="logo-chain">Chain</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="navbar-action-btn"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 移动端用户信息 */}
              {isAuthenticated && user && (
                <div className="mobile-user-info">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName || user.username} className="mobile-user-avatar" />
                  ) : (
                    <div className="mobile-user-avatar-placeholder">
                      {(user.fullName || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">{user.fullName || user.username}</span>
                    <span className="mobile-user-email">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={getLocalizedUrl(link.path, locale)}
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mobile-actions">
                <div className="flex items-center justify-between mobile-action-btn" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <span className="font-medium">{content.theme.value}</span>
                  <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                  </div>
                </div>

                {isAuthenticated && user ? (
                  <>
                    <Link 
                      href={getLocalizedUrl('/knowledge/create', locale)}
                      className="mobile-action-btn navbar-publish-btn"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {content.publish.value}
                    </Link>
                    <button 
                      className="mobile-action-btn mobile-logout-btn"
                      onClick={handleLogout}
                    >
                      {content.logout.value}
                    </button>
                  </>
                ) : (
                  <Link 
                    href={getLocalizedUrl('/login', locale)} 
                    className="mobile-action-btn navbar-login-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {content.login.value}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
