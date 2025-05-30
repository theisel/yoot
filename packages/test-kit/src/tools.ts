import {expect, it} from 'vitest';
import type {YootFactory, YootState} from '@yoot/yoot';

// -- Module Exports --
export {defineCases, expectParams, expectString, applyInputDefaults, inject, runTestCase, testEach};
export type {Expected, ExpectParams, ExpectString, TestCase};

/** Helper to define an array of test cases with type inference. */
const defineCases = <T extends TestCase[]>(cases: T) => cases;

/** Shape of the inject handler that provides a fresh 'yoot' object. */
type InjectHandler = () => Promise<{yoot: YootFactory}>;

/** Stores the current handler that provides a fresh 'yoot' object for tests. */
let injectHandler: InjectHandler | undefined;

/**
 * Registers the async function that will be called to provide a fresh 'yoot' instance.
 *
 * @remarks
 * Should be called in a `beforeEach` or `beforeAll` hook in test files.
 *
 * @param handler - The async function performing dynamic imports and returning {yoot}.
 */
const inject = async (handler: InjectHandler) => {
  injectHandler = handler;
};

/** The shape for `applyInputDefaults` return type */
type ApplyInputDefaults<T extends Partial<TestCase>> = Omit<T, 'input'> & {
  input: TestCase['input'] & T['input'];
};

function applyInputDefaults<T extends Partial<TestCase>>(
  defaults: TestCase['input'],
): (testCase: T) => ApplyInputDefaults<T>;

function applyInputDefaults<T extends Partial<TestCase>>(
  defaults: TestCase['input'],
  testCase: T,
): ApplyInputDefaults<T>;

/**
 * Utility to merge default input values with a test case's specific input.
 *
 * @remarks
 * Can be used in a curried fashion or by providing both arguments.
 *
 * @param defaults - Default input values.
 * @param testCase - (Optional) The test case to apply defaults to.
 */
function applyInputDefaults<T extends Partial<TestCase>>(defaults: TestCase['input'], testCase?: T) {
  const apply = (tc: T) => ({
    ...tc,
    input: {
      ...defaults,
      ...tc.input,
    },
  });

  return testCase ? apply(testCase) : apply;
}

/** Helper to create an 'Expected' object for validating URLSearchParams. */
function expectParams(params: Record<string, string | number | undefined>): ExpectParams {
  return {type: 'params', value: params};
}
/** Helper to create an 'Expected' object for validating a URL string. */
function expectString(value: string): ExpectString {
  return {type: 'string', value};
}
/**
 * Runs a suite of test cases using Vitest's `it.each`.
 *
 * @remarks
 * Each test case description is used for the test name.
 *
 * @param testCases - Array of TestCase objects.
 */
function testEach(testCases: TestCase[]) {
  it.each(testCases)('$description', runTestCase);
}
/**
 * Executes a single test case.
 *
 * @remarks
 * It dynamically retrieves a fresh 'yoot' instance via the `injectHandler`
 * to ensure test isolation, generates a URL, and asserts against the expected outcome.
 *
 * @param input - Test case input (src, directives, etc.).
 * @param expected - Expected result ({type: 'string', value: ...} or {type: 'params', value: ...}).
 * @throws If 'injectHandler' is not initialized (via `inject` in `beforeEach` or `beforeAll`).
 */
async function runTestCase({input, expected}: Omit<TestCase, 'description'>) {
  if (!injectHandler) {
    throw new Error('Yoot is not injected. Please call inject() before running tests.');
  }

  const {yoot} = await injectHandler();
  const url = yoot(input).url;

  switch (expected.type) {
    case 'params':
      assertExpectedParams(new URL(url), expected.value);
      break;
    case 'string':
      assertString(url, expected.value);
      break;
    default:
      assertNever(expected);
  }
}

/** Asserts that the generated URL string matches the expected string. */
function assertString(url: string, expected: string) {
  expect(url).toBe(expected);
}
/** Asserts URLSearchParams match expected params and that no extra params exist. */
function assertExpectedParams(url: URL, expectedParams: Record<string, string | number | undefined>) {
  const actualParams = url.searchParams;
  const expectedKeys = Object.keys(expectedParams);

  // Assert that all expected parameters are present with the correct value
  for (const [key, expectedValue] of Object.entries(expectedParams)) {
    const actualValue = actualParams.get(key);
    expect(actualValue).not.toBeNull();
    expect(actualValue).toBe(String(expectedValue));
  }

  // Assert no extra parameters are present
  for (const key of actualParams.keys()) {
    expect(expectedKeys).toContain(key);
  }
}

/** Utility for exhaustiveness checking in switch statements. Throws if called. */
function assertNever(it: never): never {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  throw new Error(`Unexpected expected type: ${(it as any).type ?? JSON.stringify(it)}`);
}

/**
 * The shape of a single test case.
 */
type TestCase = {
  /** Test description for Vitest's `it` block. */
  description: string;
  /** Input object to pass to the `yoot` function  */
  input: Partial<YootState>;
  /** The expected outcome (string or params object). */
  expected: Expected;
};

/** Defines an expectation for URLSearchParams. */
type ExpectParams = {type: 'params'; value: Record<string, string | number | undefined>};
/** Defines an expectation for a URL string. */
type ExpectString = {type: 'string'; value: string};
/** Union of possible expectation types for a test case. */
type Expected = ExpectParams | ExpectString;
