'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useIntlayer } from 'next-intlayer';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const content = useIntlayer('navbar');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'home', label: content.home.value, path: '/' },
    { key: 'knowledge', label: content.knowledge.value, path: '/knowledge' },
    { key: 'blockchain', label: content.blockchain.value, path: '/blockchain' },
    { key: 'search', label: content.search.value, path: '/search' },
    { key: 'recommendations', label: content.recommendations.value, path: '/recommendations' },
    { key: 'community', label: content.community.value, path: '/community' },
  ];

  const user = null;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container container">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-text text-gradient-pink">
              EduChain
            </span>
          </Link>

          <div className="navbar-nav desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.path}
                className="navbar-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {user && (
              <button className="navbar-action-btn desktop-only">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="navbar-badge">3</span>
              </button>
            )}

            <div className="desktop-only">
              <LocaleSwitcher />
            </div>

            {user ? (
              <>
                <button className="navbar-auth-btn navbar-publish-btn desktop-only">
                  {content.publish.value}
                </button>
                
                <button className="navbar-action-btn desktop-only">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button className="navbar-auth-btn navbar-login-btn desktop-only">
                  {content.login.value}
                </button>
                
                <button className="navbar-auth-btn navbar-register-btn">
                  {content.register.value}
                </button>
              </>
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
                <span className="text-gradient-pink text-2xl font-bold">EduChain</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="navbar-action-btn"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.path}
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
                  <LocaleSwitcher />
                </div>

                {!user && (
                  <>
                    <button className="mobile-action-btn navbar-login-btn">
                      {content.login.value}
                    </button>
                    <button className="mobile-action-btn navbar-register-btn">
                      {content.register.value}
                    </button>
                  </>
                )}

                {user && (
                  <button className="mobile-action-btn navbar-publish-btn">
                    {content.publish.value}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
