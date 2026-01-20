'use client';

import { getHTMLTextDir } from 'intlayer';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Link from 'next/link';
import { useIntlayer, useLocale, useLocaleStorage } from 'next-intlayer';
import { type FC, useRef, useState, useEffect } from 'react';
import { useLocaleSearch } from './useLocaleSearch';
import './LocaleSwitcher.css';

// 自定义locale名称映射，确保服务端和客户端一致
const LOCALE_NAMES: Record<string, string> = {
  'zh-CN': '中文（简体）',
  'en': 'English',
  'zh': '中文',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
};

const getLocaleName = (locale: string): string => {
  return LOCALE_NAMES[locale] || locale;
};

export const LocaleSwitcher: FC = () => {
  const { searchInput, localeSwitcherLabel } = useIntlayer('locale-switcher');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { locale, pathWithoutLocale, availableLocales } = useLocale();
  const { setLocale } = useLocaleStorage();
  const { searchResults, handleSearch } = useLocaleSearch(
    availableLocales,
    locale
  );

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="locale-switcher"
      aria-label={localeSwitcherLabel.value}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="locale-switcher-button"
        aria-expanded={isOpen}
      >
        <span>{getLocaleName(locale)}</span>
        <svg className="locale-switcher-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="locale-dropdown">
          <div className="locale-search-wrapper">
            <input
              type="search"
              aria-label={searchInput.ariaLabel.value}
              placeholder={searchInput.placeholder.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
              ref={inputRef}
              className="locale-search-input"
            />
          </div>
          <ul className="locale-list">
            {searchResults.map(
              ({ locale: localeItem, currentLocaleName, ownLocaleName }) => (
                <li key={localeItem} className="locale-item">
                  <Link
                    href={getLocalizedUrl(pathWithoutLocale, localeItem)}
                    className={`locale-link ${locale === localeItem ? 'active' : ''}`}
                    onClick={() => {
                      setLocale(localeItem);
                      setIsOpen(false);
                    }}
                  >
                    <div className="locale-info">
                      <span 
                        className="locale-name"
                        dir={getHTMLTextDir(localeItem)} 
                        lang={localeItem}
                      >
                        {ownLocaleName}
                      </span>
                      <span className="locale-native-name">
                        {currentLocaleName}
                      </span>
                    </div>
                    <span className="locale-code">
                      {localeItem.toUpperCase()}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
