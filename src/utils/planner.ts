/**
 * Test Planner - Manages test execution strategy and planning
 * Helps in organizing test execution, prioritization, and dependencies
 */

import { Logger } from './logger';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[];
  tags?: string[];
  estimatedDuration?: number; // in milliseconds
  retryCount?: number;
}

export interface TestPlan {
  name: string;
  testCases: TestCase[];
  executionStrategy: 'sequential' | 'parallel' | 'prioritized';
  maxParallelWorkers?: number;
}

export interface ExecutionResult {
  testId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

export class TestPlanner {
  private testPlans: Map<string, TestPlan> = new Map();
  private executionHistory: ExecutionResult[] = [];

  /**
   * Create a new test plan
   */
  createTestPlan(plan: TestPlan): void {
    Logger.info(`Creating test plan: ${plan.name}`);
    this.testPlans.set(plan.name, plan);
  }

  /**
   * Get a test plan by name
   */
  getTestPlan(name: string): TestPlan | undefined {
    return this.testPlans.get(name);
  }

  /**
   * Prioritize test cases based on priority and dependencies
   */
  prioritizeTests(testCases: TestCase[]): TestCase[] {
    Logger.info('Prioritizing test cases');
    
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    
    // Sort by priority first
    const sorted = [...testCases].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Handle dependencies
    const result: TestCase[] = [];
    const added = new Set<string>();
    
    const addTestWithDependencies = (testCase: TestCase) => {
      if (added.has(testCase.id)) return;
      
      // Add dependencies first
      if (testCase.dependencies) {
        testCase.dependencies.forEach(depId => {
          const depTest = sorted.find(t => t.id === depId);
          if (depTest && !added.has(depId)) {
            addTestWithDependencies(depTest);
          }
        });
      }
      
      result.push(testCase);
      added.add(testCase.id);
    };
    
    sorted.forEach(testCase => addTestWithDependencies(testCase));
    
    return result;
  }

  /**
   * Filter tests by tags
   */
  filterTestsByTags(testCases: TestCase[], tags: string[]): TestCase[] {
    Logger.info(`Filtering tests by tags: ${tags.join(', ')}`);
    return testCases.filter(tc => 
      tc.tags?.some(tag => tags.includes(tag))
    );
  }

  /**
   * Get test execution order based on strategy
   */
  getExecutionOrder(planName: string): TestCase[] {
    const plan = this.testPlans.get(planName);
    if (!plan) {
      Logger.error(`Test plan not found: ${planName}`);
      return [];
    }

    Logger.info(`Getting execution order for plan: ${planName} with strategy: ${plan.executionStrategy}`);

    switch (plan.executionStrategy) {
      case 'prioritized':
        return this.prioritizeTests(plan.testCases);
      case 'sequential':
      case 'parallel':
        return plan.testCases;
      default:
        return plan.testCases;
    }
  }

  /**
   * Record test execution result
   */
  recordExecution(result: ExecutionResult): void {
    this.executionHistory.push(result);
    Logger.info(`Recorded execution for test: ${result.testId} - ${result.status}`);
  }

  /**
   * Get flaky tests (tests that failed in the past but passed later)
   */
  getFlakyTests(): string[] {
    const testResults = new Map<string, ExecutionResult[]>();
    
    this.executionHistory.forEach(result => {
      if (!testResults.has(result.testId)) {
        testResults.set(result.testId, []);
      }
      testResults.get(result.testId)!.push(result);
    });

    const flakyTests: string[] = [];
    testResults.forEach((results, testId) => {
      const hasPassed = results.some(r => r.status === 'passed');
      const hasFailed = results.some(r => r.status === 'failed');
      if (hasPassed && hasFailed) {
        flakyTests.push(testId);
      }
    });

    return flakyTests;
  }

  /**
   * Get recommended retry count based on historical data
   */
  getRecommendedRetryCount(testId: string): number {
    const history = this.executionHistory.filter(r => r.testId === testId);
    const failureRate = history.filter(r => r.status === 'failed').length / history.length;
    
    if (failureRate > 0.5) return 3;
    if (failureRate > 0.2) return 2;
    return 1;
  }

  /**
   * Generate test execution summary
   */
  getExecutionSummary(): {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    averageDuration: number;
  } {
    const total = this.executionHistory.length;
    const passed = this.executionHistory.filter(r => r.status === 'passed').length;
    const failed = this.executionHistory.filter(r => r.status === 'failed').length;
    const skipped = this.executionHistory.filter(r => r.status === 'skipped').length;
    const avgDuration = total > 0 
      ? this.executionHistory.reduce((sum, r) => sum + r.duration, 0) / total 
      : 0;

    return {
      totalTests: total,
      passed,
      failed,
      skipped,
      averageDuration: avgDuration
    };
  }
}

// Singleton instance
export const planner = new TestPlanner();
