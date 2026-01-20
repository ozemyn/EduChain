'use client';

import { useState } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import './page.css';

export default function AdminLoginPage() {
  const content = useIntlayer('admin-login-page');
  const { locale } = useLocale();
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = loading || authLoading;

  // Mock 模式快速管理员登录
  const handleMockAdminLogin = async () => {
    setLoading(true);
    try {
      await login('admin', 'password', 'ADMIN');
      router.push(getLocalizedUrl('/admin', locale));
    } catch (error) {
      console.error('Mock admin login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = { usernameOrEmail: '', password: '' };
    let isValid = true;

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = content.usernameRequired.value;
      isValid = false;
    } else if (formData.usernameOrEmail.trim().length < 3) {
      newErrors.usernameOrEmail = content.usernameMinLength.value;
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = content.passwordRequired.value;
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = content.passwordMinLength.value;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.usernameOrEmail, formData.password, 'ADMIN');
      router.push(getLocalizedUrl('/admin', locale));
    } catch (error) {
      console.error('Admin login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* 左侧品牌展示区 */}
      <div className="admin-login-brand-section">
        <div className="admin-brand-background">
          <div className="admin-brand-blob admin-brand-blob-1"></div>
          <div className="admin-brand-blob admin-brand-blob-2"></div>
          <div className="admin-brand-blob admin-brand-blob-3"></div>
          <div className="admin-brand-grid"></div>
        </div>

        <div className="admin-brand-content motion-fade-in motion-delay-100">
          <div className="admin-brand-logo motion-scale-in">
            <div className="admin-logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="admin-logo-text">EduChain Admin</h1>
          </div>

          <h2 className="admin-brand-title motion-slide-in-up motion-delay-150">{content.brandTitle}</h2>
          <p className="admin-brand-description motion-slide-in-up motion-delay-200">{content.brandDescription}</p>

          <div className="admin-brand-features">
            <div className="admin-feature-item glass-light motion-slide-in-left motion-delay-250">
              <div className="admin-feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="admin-feature-text">
                <h4>{content.featureSecurity}</h4>
                <p>{content.featureSecurityDesc}</p>
              </div>
            </div>

            <div className="admin-feature-item glass-light motion-slide-in-left motion-delay-300">
              <div className="admin-feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="admin-feature-text">
                <h4>{content.featureMonitoring}</h4>
                <p>{content.featureMonitoringDesc}</p>
              </div>
            </div>

            <div className="admin-feature-item glass-light motion-slide-in-left motion-delay-350">
              <div className="admin-feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="admin-feature-text">
                <h4>{content.featureManagement}</h4>
                <p>{content.featureManagementDesc}</p>
              </div>
            </div>
          </div>

          <div className="admin-brand-footer motion-fade-in motion-delay-400">
            <p className="admin-footer-text">{content.brandFooter}</p>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="admin-login-form-section">
        <div className="admin-form-container">
          <div className="admin-form-card glass-card motion-scale-in motion-delay-200">
            <div className="admin-form-header">
              <h2 className="admin-form-title">{content.title}</h2>
              <p className="admin-form-subtitle">{content.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="admin-form-group">
                <div className={`admin-input-wrapper ${errors.usernameOrEmail ? 'error' : ''}`}>
                  <span className="admin-input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formData.usernameOrEmail}
                    onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                    placeholder={content.usernamePlaceholder.value}
                    className="admin-form-input"
                    autoComplete="username"
                  />
                </div>
                {errors.usernameOrEmail && <span className="admin-error-message">{errors.usernameOrEmail}</span>}
              </div>

              <div className="admin-form-group">
                <div className={`admin-input-wrapper ${errors.password ? 'error' : ''}`}>
                  <span className="admin-input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={content.passwordPlaceholder.value}
                    className="admin-form-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="admin-password-toggle"
                  >
                    {showPassword ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="admin-error-message">{errors.password}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="admin-submit-button motion-hover-lift"
              >
                {isLoading ? (
                  <>
                    <span className="admin-loading-spinner motion-spin"></span>
                    {content.loggingIn}
                  </>
                ) : (
                  content.loginButton.value
                )}
              </button>
            </form>

            {/* Mock 模式快速登录 */}
            {process.env.NEXT_PUBLIC_USE_MOCK === 'true' && (
              <div className="admin-mock-login-section">
                <div className="admin-mock-divider">
                  <span className="admin-mock-divider-text">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    {content.mockModeTitle}
                  </span>
                </div>

                <div className="admin-mock-login-card">
                  <p className="admin-mock-subtitle">{content.mockModeSubtitle}</p>
                  
                  <button
                    type="button"
                    onClick={handleMockAdminLogin}
                    disabled={isLoading}
                    className="admin-mock-btn admin-mock-btn-admin"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {content.mockAdminLogin}
                  </button>

                  <div className="admin-mock-switch-divider">
                    <span>{content.mockSwitchPage}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(getLocalizedUrl('/login', locale))}
                    className="admin-mock-link-btn"
                  >
                    {content.mockGoUserLogin}
                  </button>

                  <p className="admin-mock-note">{content.mockNote}</p>
                </div>
              </div>
            )}

            <div className="admin-form-divider">
              <span className="admin-divider-text">{content.needHelp}</span>
            </div>

            <div className="admin-form-footer">
              <Link href={getLocalizedUrl('/', locale)} className="admin-back-link motion-hover-scale">
                {content.backToHome}
              </Link>
            </div>
          </div>

          <div className="admin-form-bottom-text">
            <p className="admin-bottom-text">{content.bottomText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
