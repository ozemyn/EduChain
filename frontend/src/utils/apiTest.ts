import { authService } from '@/services/auth';
import { knowledgeService } from '@/services/knowledge';
import { categoryService } from '@/services/category';
import { userService } from '@/services/user';
import { searchService } from '@/services/search';
import { notificationService } from '@/services/notification';

export interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  responseTime?: number;
  error?: unknown;
}

export interface ApiTestSuite {
  name: string;
  results: ApiTestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
}

// API连接测试工具
export class ApiTester {
  private results: ApiTestResult[] = [];

  async testEndpoint(
    name: string,
    method: string,
    testFn: () => Promise<unknown>
  ): Promise<ApiTestResult> {
    const startTime = Date.now();

    try {
      await testFn();
      const responseTime = Date.now() - startTime;

      const result: ApiTestResult = {
        endpoint: name,
        method,
        status: 'success',
        message: '连接成功',
        responseTime,
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      const result: ApiTestResult = {
        endpoint: name,
        method,
        status: 'error',
        message: error instanceof Error ? error.message : '未知错误',
        responseTime,
        error,
      };

      this.results.push(result);
      return result;
    }
  }

  async runBasicConnectivityTests(): Promise<ApiTestSuite> {
    console.log('开始API连接测试...');
    this.results = [];

    // 测试基础连接
    await this.testEndpoint('活跃用户数', 'GET', () =>
      authService.getActiveUserCount()
    );

    // 测试分类接口
    await this.testEndpoint('分类树', 'GET', () =>
      categoryService.getCategoryTree()
    );

    // 测试知识内容接口
    await this.testEndpoint('知识列表', 'GET', () =>
      knowledgeService.getKnowledgeList({ page: 0, size: 10 })
    );

    // 测试热门内容
    await this.testEndpoint('热门内容', 'GET', () =>
      knowledgeService.getPopularKnowledge({ page: 0, size: 5 })
    );

    // 测试搜索接口
    await this.testEndpoint('搜索建议', 'GET', () =>
      searchService.getSuggestions('test')
    );

    // 测试热门关键词
    await this.testEndpoint('热门关键词', 'GET', () =>
      searchService.getHotKeywords(5)
    );

    return this.generateTestSuite('基础连接测试');
  }

  async runAuthenticatedTests(token: string): Promise<ApiTestSuite> {
    console.log('开始认证接口测试...');
    this.results = [];

    // 设置认证头
    const originalToken = localStorage.getItem('token');
    localStorage.setItem('token', token);

    try {
      // 测试用户信息接口
      await this.testEndpoint('当前用户信息', 'GET', () =>
        userService.getCurrentUser()
      );

      // 测试用户统计
      await this.testEndpoint('用户统计', 'GET', () =>
        userService.getCurrentUserStats()
      );

      // 测试通知接口
      await this.testEndpoint('通知列表', 'GET', () =>
        notificationService.getNotifications({ page: 0, size: 10 })
      );

      // 测试未读通知数量
      await this.testEndpoint('未读通知数', 'GET', () =>
        notificationService.getUnreadCount()
      );

      // 测试推荐内容
      await this.testEndpoint('推荐内容', 'GET', () =>
        knowledgeService.getRecommendedKnowledge({ page: 0, size: 5 })
      );

      // 测试用户草稿
      await this.testEndpoint('用户草稿', 'GET', () =>
        knowledgeService.getUserDrafts({ page: 0, size: 10 })
      );
    } finally {
      // 恢复原始token
      if (originalToken) {
        localStorage.setItem('token', originalToken);
      } else {
        localStorage.removeItem('token');
      }
    }

    return this.generateTestSuite('认证接口测试');
  }

  async runPerformanceTests(): Promise<ApiTestSuite> {
    console.log('开始性能测试...');
    this.results = [];

    // 并发请求测试
    const concurrentRequests = Array(5)
      .fill(null)
      .map((_, index) =>
        this.testEndpoint(`并发请求-${index + 1}`, 'GET', () =>
          knowledgeService.getKnowledgeList({ page: 0, size: 20 })
        )
      );

    await Promise.all(concurrentRequests);

    // 大数据量请求测试
    await this.testEndpoint('大数据量请求', 'GET', () =>
      knowledgeService.getKnowledgeList({ page: 0, size: 100 })
    );

    return this.generateTestSuite('性能测试');
  }

  private generateTestSuite(name: string): ApiTestSuite {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'success').length;
    const failedTests = this.results.filter(r => r.status === 'error').length;
    const warningTests = this.results.filter(
      r => r.status === 'warning'
    ).length;

    return {
      name,
      results: [...this.results],
      totalTests,
      passedTests,
      failedTests,
      warningTests,
    };
  }

  generateReport(testSuites: ApiTestSuite[]): string {
    let report = '# API集成测试报告\n\n';

    testSuites.forEach(suite => {
      report += `## ${suite.name}\n\n`;
      report += `- 总测试数: ${suite.totalTests}\n`;
      report += `- 通过: ${suite.passedTests}\n`;
      report += `- 失败: ${suite.failedTests}\n`;
      report += `- 警告: ${suite.warningTests}\n`;
      report += `- 成功率: ${((suite.passedTests / suite.totalTests) * 100).toFixed(2)}%\n\n`;

      report += '### 详细结果\n\n';
      suite.results.forEach(result => {
        const statusIcon =
          result.status === 'success'
            ? '✅'
            : result.status === 'warning'
              ? '⚠️'
              : '❌';
        report += `${statusIcon} **${result.endpoint}** (${result.method})\n`;
        report += `   - 状态: ${result.status}\n`;
        report += `   - 消息: ${result.message}\n`;
        if (result.responseTime) {
          report += `   - 响应时间: ${result.responseTime}ms\n`;
        }
        if (result.error) {
          report += `   - 错误详情: ${result.error}\n`;
        }
        report += '\n';
      });

      report += '\n';
    });

    return report;
  }
}

// 导出测试实例
export const apiTester = new ApiTester();

// 快速测试函数
export const runQuickApiTest = async (): Promise<void> => {
  console.log('开始快速API测试...');

  const basicTests = await apiTester.runBasicConnectivityTests();

  console.log('基础连接测试结果:', basicTests);

  if (basicTests.failedTests > 0) {
    console.error('发现API连接问题，请检查后端服务是否正常运行');
    console.error(
      '失败的接口:',
      basicTests.results.filter(r => r.status === 'error')
    );
  } else {
    console.log('✅ 所有基础API连接正常');
  }
};

// 全面测试函数
export const runFullApiTest = async (authToken?: string): Promise<string> => {
  const testSuites: ApiTestSuite[] = [];

  // 基础连接测试
  testSuites.push(await apiTester.runBasicConnectivityTests());

  // 如果提供了认证token，运行认证测试
  if (authToken) {
    testSuites.push(await apiTester.runAuthenticatedTests(authToken));
  }

  // 性能测试
  testSuites.push(await apiTester.runPerformanceTests());

  // 生成报告
  const report = apiTester.generateReport(testSuites);
  console.log(report);

  return report;
};
