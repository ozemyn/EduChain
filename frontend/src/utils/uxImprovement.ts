import { message } from 'antd';

export interface UXIssue {
  id: string;
  category:
    | 'accessibility'
    | 'usability'
    | 'performance'
    | 'visual'
    | 'interaction';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  element?: HTMLElement;
  fix?: () => void;
  recommendation: string;
}

export interface UXMetrics {
  accessibility: {
    score: number;
    issues: UXIssue[];
  };
  usability: {
    score: number;
    issues: UXIssue[];
  };
  performance: {
    score: number;
    issues: UXIssue[];
  };
  visual: {
    score: number;
    issues: UXIssue[];
  };
}

class UXAnalyzer {
  private issues: UXIssue[] = [];

  // 运行完整的UX分析
  async runFullAnalysis(): Promise<UXMetrics> {
    this.issues = [];

    // 可访问性检查
    const accessibilityIssues = await this.checkAccessibility();

    // 可用性检查
    const usabilityIssues = await this.checkUsability();

    // 性能相关的UX检查
    const performanceIssues = await this.checkPerformanceUX();

    // 视觉设计检查
    const visualIssues = await this.checkVisualDesign();

    this.issues = [
      ...accessibilityIssues,
      ...usabilityIssues,
      ...performanceIssues,
      ...visualIssues,
    ];

    return {
      accessibility: {
        score: this.calculateScore(accessibilityIssues),
        issues: accessibilityIssues,
      },
      usability: {
        score: this.calculateScore(usabilityIssues),
        issues: usabilityIssues,
      },
      performance: {
        score: this.calculateScore(performanceIssues),
        issues: performanceIssues,
      },
      visual: {
        score: this.calculateScore(visualIssues),
        issues: visualIssues,
      },
    };
  }

  // 可访问性检查
  private async checkAccessibility(): Promise<UXIssue[]> {
    const issues: UXIssue[] = [];

    // 检查图片alt属性
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    imagesWithoutAlt.forEach((img, index) => {
      issues.push({
        id: `img-alt-${index}`,
        category: 'accessibility',
        severity: 'high',
        title: '图片缺少alt属性',
        description: '图片没有提供替代文本，影响屏幕阅读器用户体验',
        element: img as HTMLElement,
        fix: () => {
          (img as HTMLImageElement).alt = '图片描述';
        },
        recommendation: '为所有图片添加描述性的alt属性',
      });
    });

    // 检查按钮标签
    const buttonsWithoutLabel = document.querySelectorAll(
      'button:not([aria-label]):not([title])'
    );
    buttonsWithoutLabel.forEach((button, index) => {
      if (!button.textContent?.trim()) {
        issues.push({
          id: `button-label-${index}`,
          category: 'accessibility',
          severity: 'medium',
          title: '按钮缺少标签',
          description: '按钮没有可访问的标签或文本内容',
          element: button as HTMLElement,
          fix: () => {
            (button as HTMLButtonElement).setAttribute('aria-label', '按钮');
          },
          recommendation: '为按钮添加aria-label或确保有文本内容',
        });
      }
    });

    // 检查表单标签
    const inputsWithoutLabel = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    inputsWithoutLabel.forEach((input, index) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel && (input as HTMLInputElement).type !== 'hidden') {
        issues.push({
          id: `input-label-${index}`,
          category: 'accessibility',
          severity: 'high',
          title: '输入框缺少标签',
          description: '输入框没有关联的标签，影响可访问性',
          element: input as HTMLElement,
          recommendation: '为输入框添加label或aria-label',
        });
      }
    });

    // 检查颜色对比度
    const textElements = document.querySelectorAll(
      'p, span, div, h1, h2, h3, h4, h5, h6, a, button'
    );
    let lowContrastCount = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // 简化的对比度检查（实际应该使用更精确的算法）
      if (this.isLowContrast(color, backgroundColor)) {
        lowContrastCount++;
      }
    });

    if (lowContrastCount > 0) {
      issues.push({
        id: 'low-contrast',
        category: 'accessibility',
        severity: 'medium',
        title: '颜色对比度不足',
        description: `发现 ${lowContrastCount} 个元素可能存在颜色对比度问题`,
        recommendation: '确保文本与背景的对比度至少为4.5:1',
      });
    }

    return issues;
  }

  // 可用性检查
  private async checkUsability(): Promise<UXIssue[]> {
    const issues: UXIssue[] = [];

    // 检查点击目标大小
    const smallClickTargets = document.querySelectorAll(
      'button, a, [role="button"]'
    );
    smallClickTargets.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push({
          id: `small-target-${index}`,
          category: 'usability',
          severity: 'medium',
          title: '点击目标过小',
          description: '点击目标小于44px，可能影响触摸操作',
          element: element as HTMLElement,
          recommendation: '确保点击目标至少为44x44px',
        });
      }
    });

    // 检查表单验证
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const requiredInputs = form.querySelectorAll(
        'input[required], select[required], textarea[required]'
      );
      const hasValidation = form.querySelector(
        '[class*="error"], [class*="invalid"], .ant-form-item-has-error'
      );

      if (requiredInputs.length > 0 && !hasValidation) {
        issues.push({
          id: `form-validation-${index}`,
          category: 'usability',
          severity: 'medium',
          title: '表单缺少验证提示',
          description: '表单有必填字段但缺少验证反馈',
          element: form as HTMLElement,
          recommendation: '为表单添加实时验证和错误提示',
        });
      }
    });

    // 检查加载状态
    const hasLoadingIndicators =
      document.querySelectorAll(
        '[class*="loading"], [class*="spin"], .ant-spin'
      ).length > 0;
    if (!hasLoadingIndicators) {
      issues.push({
        id: 'no-loading-indicators',
        category: 'usability',
        severity: 'low',
        title: '缺少加载指示器',
        description: '页面缺少加载状态指示，用户可能不知道操作是否在进行',
        recommendation: '在异步操作时显示加载指示器',
      });
    }

    // 检查空状态
    document.querySelectorAll('[class*="empty"], .ant-empty');
    const lists = document.querySelectorAll(
      'ul, ol, table, .ant-list, .ant-table'
    );

    lists.forEach((list, index) => {
      const hasContent = list.children.length > 0;
      const hasEmptyState = list.querySelector('[class*="empty"], .ant-empty');

      if (!hasContent && !hasEmptyState) {
        issues.push({
          id: `empty-state-${index}`,
          category: 'usability',
          severity: 'low',
          title: '缺少空状态提示',
          description: '列表或表格为空时缺少友好的提示信息',
          element: list as HTMLElement,
          recommendation: '为空列表添加友好的空状态提示',
        });
      }
    });

    return issues;
  }

  // 性能相关的UX检查
  private async checkPerformanceUX(): Promise<UXIssue[]> {
    const issues: UXIssue[] = [];

    // 检查图片懒加载
    const images = document.querySelectorAll('img');
    let imagesWithoutLazyLoading = 0;

    images.forEach(img => {
      if (!img.hasAttribute('loading') && !img.hasAttribute('data-src')) {
        imagesWithoutLazyLoading++;
      }
    });

    if (imagesWithoutLazyLoading > 5) {
      issues.push({
        id: 'no-lazy-loading',
        category: 'performance',
        severity: 'medium',
        title: '图片未启用懒加载',
        description: `${imagesWithoutLazyLoading} 个图片未启用懒加载，可能影响页面加载速度`,
        recommendation: '为非首屏图片启用懒加载',
      });
    }

    // 检查大型资源
    const largeImages = Array.from(images).filter(img => {
      return img.naturalWidth > 1920 || img.naturalHeight > 1080;
    });

    if (largeImages.length > 0) {
      issues.push({
        id: 'large-images',
        category: 'performance',
        severity: 'medium',
        title: '存在大尺寸图片',
        description: `发现 ${largeImages.length} 个大尺寸图片，可能影响加载性能`,
        recommendation: '压缩图片或使用响应式图片',
      });
    }

    // 检查动画性能
    const animatedElements = document.querySelectorAll(
      '[class*="animate"], [style*="transition"], [style*="animation"]'
    );
    if (animatedElements.length > 20) {
      issues.push({
        id: 'too-many-animations',
        category: 'performance',
        severity: 'low',
        title: '动画元素过多',
        description: '页面包含大量动画元素，可能影响性能',
        recommendation: '减少同时进行的动画数量',
      });
    }

    return issues;
  }

  // 视觉设计检查
  private async checkVisualDesign(): Promise<UXIssue[]> {
    const issues: UXIssue[] = [];

    // 检查字体大小
    const textElements = document.querySelectorAll('p, span, div, a');
    let smallTextCount = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseInt(styles.fontSize);

      if (fontSize < 14) {
        smallTextCount++;
      }
    });

    if (smallTextCount > 0) {
      issues.push({
        id: 'small-text',
        category: 'visual',
        severity: 'low',
        title: '字体过小',
        description: `发现 ${smallTextCount} 个元素字体小于14px，可能影响阅读体验`,
        recommendation: '确保正文字体至少为14px',
      });
    }

    // 检查响应式设计
    const viewport = window.innerWidth;
    const hasResponsiveElements =
      document.querySelectorAll(
        '[class*="responsive"], [class*="mobile"], [class*="tablet"]'
      ).length > 0;

    if (viewport < 768 && !hasResponsiveElements) {
      issues.push({
        id: 'no-responsive-design',
        category: 'visual',
        severity: 'high',
        title: '缺少响应式设计',
        description: '在移动设备上缺少响应式适配',
        recommendation: '添加响应式设计以适配不同屏幕尺寸',
      });
    }

    // 检查焦点指示器
    const focusableElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]'
    );
    let elementsWithoutFocusStyle = 0;

    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      if (!styles.outline || styles.outline === 'none') {
        elementsWithoutFocusStyle++;
      }
    });

    if (elementsWithoutFocusStyle > 0) {
      issues.push({
        id: 'no-focus-indicators',
        category: 'visual',
        severity: 'medium',
        title: '缺少焦点指示器',
        description: `${elementsWithoutFocusStyle} 个可聚焦元素缺少焦点样式`,
        recommendation: '为所有可聚焦元素添加清晰的焦点指示器',
      });
    }

    return issues;
  }

  // 计算分数
  private calculateScore(issues: UXIssue[]): number {
    const weights = {
      critical: 25,
      high: 15,
      medium: 10,
      low: 5,
    };

    const totalDeduction = issues.reduce((sum, issue) => {
      return sum + weights[issue.severity];
    }, 0);

    return Math.max(0, 100 - totalDeduction);
  }

  // 简化的颜色对比度检查
  private isLowContrast(color: string, backgroundColor: string): boolean {
    // 这是一个简化的实现，实际应该使用WCAG对比度算法
    if (
      backgroundColor === 'rgba(0, 0, 0, 0)' ||
      backgroundColor === 'transparent'
    ) {
      return false;
    }

    // 简单检查：如果颜色相似则认为对比度低
    return color === backgroundColor;
  }

  // 自动修复问题
  async autoFix(): Promise<{ fixed: number; total: number }> {
    let fixedCount = 0;

    this.issues.forEach(issue => {
      if (issue.fix) {
        try {
          issue.fix();
          fixedCount++;
        } catch (error) {
          console.warn(`Failed to fix issue ${issue.id}:`, error);
        }
      }
    });

    return {
      fixed: fixedCount,
      total: this.issues.length,
    };
  }

  // 生成UX报告
  generateReport(metrics: UXMetrics): string {
    let report = '# 用户体验分析报告\n\n';
    report += `生成时间: ${new Date().toLocaleString()}\n\n`;

    // 总体评分
    const overallScore = Math.round(
      (metrics.accessibility.score +
        metrics.usability.score +
        metrics.performance.score +
        metrics.visual.score) /
        4
    );

    report += `## 总体评分: ${overallScore}/100\n\n`;

    // 各项评分
    report += '## 详细评分\n\n';
    report += `- 🔍 可访问性: ${metrics.accessibility.score}/100 (${metrics.accessibility.issues.length} 个问题)\n`;
    report += `- 🎯 可用性: ${metrics.usability.score}/100 (${metrics.usability.issues.length} 个问题)\n`;
    report += `- ⚡ 性能体验: ${metrics.performance.score}/100 (${metrics.performance.issues.length} 个问题)\n`;
    report += `- 🎨 视觉设计: ${metrics.visual.score}/100 (${metrics.visual.issues.length} 个问题)\n\n`;

    // 问题详情
    const allIssues = [
      ...metrics.accessibility.issues,
      ...metrics.usability.issues,
      ...metrics.performance.issues,
      ...metrics.visual.issues,
    ].sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    if (allIssues.length > 0) {
      report += '## 发现的问题\n\n';

      allIssues.forEach((issue, index) => {
        const severityIcon =
          issue.severity === 'critical'
            ? '🔴'
            : issue.severity === 'high'
              ? '🟠'
              : issue.severity === 'medium'
                ? '🟡'
                : '🟢';

        report += `### ${index + 1}. ${issue.title} ${severityIcon}\n\n`;
        report += `**类别**: ${issue.category}\n`;
        report += `**严重程度**: ${issue.severity}\n`;
        report += `**描述**: ${issue.description}\n`;
        report += `**建议**: ${issue.recommendation}\n\n`;
      });
    } else {
      report += '## 🎉 恭喜！未发现明显的用户体验问题\n\n';
    }

    // 改进建议
    report += '## 改进建议\n\n';

    if (metrics.accessibility.score < 80) {
      report +=
        '- 🔍 **可访问性改进**: 添加alt属性、改善颜色对比度、完善键盘导航\n';
    }

    if (metrics.usability.score < 80) {
      report +=
        '- 🎯 **可用性改进**: 增加加载指示器、改善表单验证、优化点击目标大小\n';
    }

    if (metrics.performance.score < 80) {
      report += '- ⚡ **性能改进**: 启用图片懒加载、压缩资源、减少动画数量\n';
    }

    if (metrics.visual.score < 80) {
      report +=
        '- 🎨 **视觉改进**: 调整字体大小、添加焦点指示器、完善响应式设计\n';
    }

    return report;
  }

  // 获取所有问题
  getAllIssues(): UXIssue[] {
    return [...this.issues];
  }
}

// 导出UX分析器实例
export const uxAnalyzer = new UXAnalyzer();

// 快速UX检查函数
export const runQuickUXCheck = async (): Promise<void> => {
  try {
    message.loading('正在进行用户体验检查...', 0);

    const metrics = await uxAnalyzer.runFullAnalysis();

    message.destroy();

    const totalIssues = Object.values(metrics).reduce(
      (sum, category) => sum + category.issues.length,
      0
    );
    const overallScore = Math.round(
      (metrics.accessibility.score +
        metrics.usability.score +
        metrics.performance.score +
        metrics.visual.score) /
        4
    );

    if (overallScore >= 90) {
      message.success(`用户体验检查完成，评分: ${overallScore}/100 (优秀)`);
    } else if (overallScore >= 70) {
      message.warning(
        `用户体验检查完成，评分: ${overallScore}/100，发现 ${totalIssues} 个问题`
      );
    } else {
      message.error(`用户体验检查完成，评分: ${overallScore}/100，需要改进`);
    }

    console.log('用户体验分析结果:', metrics);
  } catch (error) {
    message.destroy();
    message.error('用户体验检查失败');
    console.error('UX检查错误:', error);
  }
};

// 自动修复UX问题函数
export const autoFixUXIssues = async (): Promise<void> => {
  try {
    message.loading('正在自动修复用户体验问题...', 0);

    const result = await uxAnalyzer.autoFix();

    message.destroy();

    if (result.fixed > 0) {
      message.success(
        `自动修复完成，修复了 ${result.fixed}/${result.total} 个问题`
      );
    } else {
      message.info('没有可以自动修复的问题');
    }

    console.log('自动修复结果:', result);
  } catch (error) {
    message.destroy();
    message.error('自动修复失败');
    console.error('自动修复错误:', error);
  }
};
