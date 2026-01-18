'use client';

import { useIntlayer } from 'next-intlayer';
import './CertificationProgress.css';

export enum CertificationStep {
  UPLOADING = 0,
  HASHING = 1,
  CERTIFYING = 2,
  GENERATING = 3,
  COMPLETED = 4,
}

export enum CertificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface CertificationProgressProps {
  currentStep: CertificationStep;
  status: CertificationStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onDownloadCertificate?: () => void;
  onViewDetail?: () => void;
}

/**
 * 存证进度组件
 * 显示内容上传到存证完成的整个过程
 */
export const CertificationProgress: React.FC<CertificationProgressProps> = ({
  currentStep,
  status,
  errorMessage,
  onRetry,
  onDownloadCertificate,
  onViewDetail,
}) => {
  const content = useIntlayer('certification-progress');

  const steps = [
    {
      key: 'uploading',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      key: 'hashing',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'certifying',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      key: 'generating',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'completed',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (status === CertificationStatus.ERROR && stepIndex === currentStep) {
      return 'error';
    }
    if (stepIndex < currentStep) {
      return 'completed';
    }
    if (stepIndex === currentStep) {
      return status === CertificationStatus.SUCCESS ? 'completed' : 'active';
    }
    return 'pending';
  };

  return (
    <div className="certification-progress-card glass-card">
      {/* 头部 */}
      <div className="progress-header">
        <h3 className="progress-title">{content.title}</h3>
        {status === CertificationStatus.IN_PROGRESS && (
          <span className="progress-status processing">
            <div className="status-spinner"></div>
            {content.processing}
          </span>
        )}
        {status === CertificationStatus.SUCCESS && currentStep === CertificationStep.COMPLETED && (
          <span className="progress-status success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {content.success}
          </span>
        )}
        {status === CertificationStatus.ERROR && (
          <span className="progress-status error">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {content.error}
          </span>
        )}
      </div>

      {/* 步骤 */}
      <div className="progress-steps">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          return (
            <div key={step.key} className={`progress-step ${stepStatus}`}>
              <div className="step-indicator">
                <div className="step-icon">
                  {stepStatus === 'active' && status === CertificationStatus.IN_PROGRESS ? (
                    <div className="step-spinner"></div>
                  ) : stepStatus === 'error' ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : stepStatus === 'completed' ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && <div className="step-line"></div>}
              </div>
              <div className="step-content">
                <div className="step-title">{content.steps[step.key as keyof typeof content.steps].title}</div>
                {stepStatus === 'active' && status === CertificationStatus.IN_PROGRESS && (
                  <div className="step-desc">{content.steps[step.key as keyof typeof content.steps].desc}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 错误提示 */}
      {status === CertificationStatus.ERROR && errorMessage && (
        <div className="progress-alert error">
          <div className="alert-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="alert-content">
            <div className="alert-title">{content.errorTitle}</div>
            <div className="alert-message">{errorMessage}</div>
          </div>
          {onRetry && (
            <button onClick={onRetry} className="alert-action glass-button motion-hover-lift">
              {content.retry}
            </button>
          )}
        </div>
      )}

      {/* 成功提示 */}
      {status === CertificationStatus.SUCCESS && currentStep === CertificationStep.COMPLETED && (
        <div className="progress-success">
          <div className="progress-alert success">
            <div className="alert-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="alert-content">
              <div className="alert-title">{content.successTitle}</div>
              <div className="alert-message">{content.successMessage}</div>
            </div>
          </div>
          <div className="success-actions">
            {onDownloadCertificate && (
              <button onClick={onDownloadCertificate} className="success-btn glass-button motion-hover-lift">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {content.downloadCert}
              </button>
            )}
            {onViewDetail && (
              <button onClick={onViewDetail} className="success-btn glass-button motion-hover-lift secondary">
                {content.viewDetail}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="progress-info">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{content.infoText}</span>
      </div>
    </div>
  );
};
