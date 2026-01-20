'use client';

import { useState } from 'react';
import { useIntlayer, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from '@/lib/i18n-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

interface FormData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const content = useIntlayer('register-page');
  const { locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = content.usernameRequired.value;
      isValid = false;
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = content.usernameLength.value;
      isValid = false;
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = content.emailRequired.value;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = content.emailInvalid.value;
      isValid = false;
    }

    // 姓名验证
    if (!formData.fullName.trim()) {
      newErrors.fullName = content.fullNameRequired.value;
      isValid = false;
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = content.passwordRequired.value;
      isValid = false;
    } else if (formData.password.length < 6 || formData.password.length > 20) {
      newErrors.password = content.passwordLength.value;
      isValid = false;
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = content.confirmPasswordRequired.value;
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = content.passwordMismatch.value;
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
      // TODO: 实际注册逻辑
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(getLocalizedUrl('/login', locale));
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="register-page">
      {/* 左侧品牌展示区 */}
      <div className="register-brand-section">
        <div className="brand-background">
          <div className="brand-blob brand-blob-1"></div>
          <div className="brand-blob brand-blob-2"></div>
          <div className="brand-blob brand-blob-3"></div>
          <div className="brand-grid"></div>
        </div>

        <div className="brand-content motion-fade-in motion-delay-100">
          <div className="brand-logo motion-scale-in">
            <div className="logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="logo-text">EduChain</h1>
          </div>

          <h2 className="brand-title motion-slide-in-up motion-delay-150">{content.brandTitle}</h2>
          <p className="brand-description motion-slide-in-up motion-delay-200">{content.brandDescription}</p>

          <div className="brand-features">
            <div className="feature-item glass-light motion-slide-in-left motion-delay-250">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="feature-text">
                <h4>{content.featureCommunity}</h4>
                <p>{content.featureCommunityDesc}</p>
              </div>
            </div>

            <div className="feature-item glass-light motion-slide-in-left motion-delay-300">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="feature-text">
                <h4>{content.featureContent}</h4>
                <p>{content.featureContentDesc}</p>
              </div>
            </div>

            <div className="feature-item glass-light motion-slide-in-left motion-delay-350">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="feature-text">
                <h4>{content.featureSmart}</h4>
                <p>{content.featureSmartDesc}</p>
              </div>
            </div>
          </div>

          <div className="brand-footer motion-fade-in motion-delay-400">
            <p className="footer-text">{content.brandFooter}</p>
          </div>
        </div>
      </div>

      {/* 右侧注册表单区 */}
      <div className="register-form-section">
        <div className="form-container">
          <div className="form-card glass-card motion-scale-in motion-delay-200">
            <div className="form-header">
              <h2 className="form-title">{content.title}</h2>
              <p className="form-subtitle">{content.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* 用户名 */}
              <div className="form-group">
                <label className="form-label">{content.usernameLabel}</label>
                <div className={`input-wrapper ${errors.username ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder={content.usernamePlaceholder.value}
                    className="form-input"
                    autoComplete="username"
                  />
                </div>
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              {/* 邮箱 */}
              <div className="form-group">
                <label className="form-label">{content.emailLabel}</label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={content.emailPlaceholder.value}
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* 真实姓名 */}
              <div className="form-group">
                <label className="form-label">{content.fullNameLabel}</label>
                <div className={`input-wrapper ${errors.fullName ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder={content.fullNamePlaceholder.value}
                    className="form-input"
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              {/* 密码 */}
              <div className="form-group">
                <label className="form-label">{content.passwordLabel}</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={content.passwordPlaceholder.value}
                    className="form-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
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
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* 确认密码 */}
              <div className="form-group">
                <label className="form-label">{content.confirmPasswordLabel}</label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={content.confirmPasswordPlaceholder.value}
                    className="form-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button motion-hover-lift"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner motion-spin"></span>
                    {content.registering}
                  </>
                ) : (
                  content.registerButton.value
                )}
              </button>
            </form>

            <div className="form-divider">
              <span className="divider-text">{content.hasAccount}</span>
            </div>

            <div className="form-footer">
              <Link href={getLocalizedUrl('/login', locale)} className="login-link motion-hover-scale">
                {content.loginNow} →
              </Link>
            </div>
          </div>

          <div className="form-bottom-text">
            <p className="bottom-text">
              {content.termsText}{' '}
              <Link href={getLocalizedUrl('/legal/terms', locale)} className="bottom-link">
                {content.termsLink}
              </Link>
              {' '}{content.andText}{' '}
              <Link href={getLocalizedUrl('/legal/privacy', locale)} className="bottom-link">
                {content.privacyLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
