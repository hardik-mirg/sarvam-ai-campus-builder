/**
 * Lightweight, robust test harness for Sarvam Audit E2E tests.
 * Zero external dependencies. Uses Node.js built-in runtime.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

class TestRegistry {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
    };
    this.failures = [];
  }

  describe(suiteName, fn) {
    const parentSuite = this.currentSuite;
    const suite = {
      name: suiteName,
      tests: [],
      beforeAllHooks: [],
      afterAllHooks: [],
      beforeEachHooks: [],
      afterEachHooks: [],
      parent: parentSuite,
      suites: [],
    };

    if (parentSuite) {
      parentSuite.suites.push(suite);
    } else {
      this.suites.push(suite);
    }

    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  it(testName, fn, options = {}) {
    if (!this.currentSuite) {
      throw new Error(`Test "${testName}" must be defined inside a describe() block.`);
    }
    this.currentSuite.tests.push({
      name: testName,
      fn,
      skip: options.skip || false,
      timeout: options.timeout || 5000,
    });
  }

  beforeAll(fn) {
    if (this.currentSuite) this.currentSuite.beforeAllHooks.push(fn);
  }

  afterAll(fn) {
    if (this.currentSuite) this.currentSuite.afterAllHooks.push(fn);
  }

  beforeEach(fn) {
    if (this.currentSuite) this.currentSuite.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    if (this.currentSuite) this.currentSuite.afterEachHooks.push(fn);
  }

  async runSuite(suite, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`\n${indent}${ANSI.bold}${ANSI.cyan}● ${suite.name}${ANSI.reset}`);

    for (const hook of suite.beforeAllHooks) {
      await hook();
    }

    for (const test of suite.tests) {
      this.stats.total++;
      if (test.skip) {
        this.stats.skipped++;
        console.log(`${indent}  ${ANSI.yellow}○ [SKIP] ${test.name}${ANSI.reset}`);
        continue;
      }

      for (const hook of suite.beforeEachHooks) {
        await hook();
      }

      const start = performance.now();
      try {
        await Promise.race([
          test.fn(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Test timed out after ${test.timeout}ms`)), test.timeout)
          ),
        ]);
        const duration = (performance.now() - start).toFixed(1);
        this.stats.passed++;
        console.log(
          `${indent}  ${ANSI.green}✔${ANSI.reset} ${test.name} ${ANSI.gray}(${duration}ms)${ANSI.reset}`
        );
      } catch (err) {
        const duration = (performance.now() - start).toFixed(1);
        this.stats.failed++;
        const failureRecord = {
          suite: suite.name,
          test: test.name,
          error: err,
          duration,
        };
        this.failures.push(failureRecord);
        console.log(
          `${indent}  ${ANSI.red}✖${ANSI.reset} ${test.name} ${ANSI.gray}(${duration}ms)${ANSI.reset}`
        );
        console.log(`${indent}    ${ANSI.red}${err.message}${ANSI.reset}`);
        if (process.env.VERBOSE && err.stack) {
          console.log(`${indent}    ${ANSI.gray}${err.stack}${ANSI.reset}`);
        }
      }

      for (const hook of suite.afterEachHooks) {
        await hook();
      }
    }

    for (const childSuite of suite.suites) {
      await this.runSuite(childSuite, depth + 1);
    }

    for (const hook of suite.afterAllHooks) {
      await hook();
    }
  }

  async run() {
    const overallStart = performance.now();
    for (const suite of this.suites) {
      await this.runSuite(suite, 0);
    }
    this.stats.durationMs = performance.now() - overallStart;
    return this.getSummary();
  }

  getSummary() {
    return {
      ...this.stats,
      failures: this.failures,
      success: this.stats.failed === 0,
    };
  }

  reset() {
    this.suites = [];
    this.currentSuite = null;
    this.stats = { total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 };
    this.failures = [];
  }
}

// Global registry instance
const defaultRegistry = new TestRegistry();

function describe(name, fn) {
  defaultRegistry.describe(name, fn);
}

function it(name, fn, options) {
  defaultRegistry.it(name, fn, options);
}

function beforeAll(fn) {
  defaultRegistry.beforeAll(fn);
}

function afterAll(fn) {
  defaultRegistry.afterAll(fn);
}

function beforeEach(fn) {
  defaultRegistry.beforeEach(fn);
}

function afterEach(fn) {
  defaultRegistry.afterEach(fn);
}

/**
 * Fluent assertion helper
 */
function expect(actual) {
  return {
    toBe(expected, msg) {
      if (actual !== expected) {
        throw new Error(
          msg || `Expected ${JSON.stringify(actual)} to strictly equal (===) ${JSON.stringify(expected)}`
        );
      }
    },
    toEqual(expected, msg) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(msg || `Expected deep equality:\nActual:   ${a}\nExpected: ${b}`);
      }
    },
    toBeGreaterThan(expected, msg) {
      if (!(actual > expected)) {
        throw new Error(msg || `Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected, msg) {
      if (!(actual >= expected)) {
        throw new Error(msg || `Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThan(expected, msg) {
      if (!(actual < expected)) {
        throw new Error(msg || `Expected ${actual} < ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected, msg) {
      if (!(actual <= expected)) {
        throw new Error(msg || `Expected ${actual} <= ${expected}`);
      }
    },
    toBeCloseTo(expected, delta = 0.001, msg) {
      if (Math.abs(actual - expected) > delta) {
        throw new Error(
          msg || `Expected ${actual} to be within ${delta} of ${expected} (diff: ${Math.abs(actual - expected)})`
        );
      }
    },
    toBeNull(msg) {
      if (actual !== null) {
        throw new Error(msg || `Expected null, received ${JSON.stringify(actual)}`);
      }
    },
    toBeDefined(msg) {
      if (actual === undefined) {
        throw new Error(msg || `Expected value to be defined, received undefined`);
      }
    },
    toBeTruthy(msg) {
      if (!actual) {
        throw new Error(msg || `Expected truthy value, received ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy(msg) {
      if (actual) {
        throw new Error(msg || `Expected falsy value, received ${JSON.stringify(actual)}`);
      }
    },
    toContain(expectedSubstrOrItem, msg) {
      if (typeof actual === 'string' || Array.isArray(actual)) {
        if (!actual.includes(expectedSubstrOrItem)) {
          throw new Error(
            msg || `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expectedSubstrOrItem)}`
          );
        }
      } else {
        throw new Error(msg || `toContain requires string or array, got ${typeof actual}`);
      }
    },
    toHaveLength(expectedLen, msg) {
      const len = actual?.length;
      if (len !== expectedLen) {
        throw new Error(msg || `Expected length ${expectedLen}, but received ${len}`);
      }
    },
    toThrow(expectedErrorPattern, msg) {
      if (typeof actual !== 'function') {
        throw new Error(`toThrow requires a function`);
      }
      let threw = false;
      let thrownError = null;
      try {
        actual();
      } catch (err) {
        threw = true;
        thrownError = err;
      }
      if (!threw) {
        throw new Error(msg || `Expected function to throw an error, but it returned normally`);
      }
      if (expectedErrorPattern) {
        const errorMsg = thrownError?.message || String(thrownError);
        if (expectedErrorPattern instanceof RegExp) {
          if (!expectedErrorPattern.test(errorMsg)) {
            throw new Error(
              msg || `Expected error matching ${expectedErrorPattern}, got "${errorMsg}"`
            );
          }
        } else if (!errorMsg.includes(expectedErrorPattern)) {
          throw new Error(
            msg || `Expected error containing "${expectedErrorPattern}", got "${errorMsg}"`
          );
        }
      }
    },
  };
}

module.exports = {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  expect,
  defaultRegistry,
  TestRegistry,
  ANSI,
};
