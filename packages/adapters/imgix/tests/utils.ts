import {
  applyInputDefaults,
  runTestCase as yootRunTestCase,
  testEach as yootTestEach,
  type TestCase,
} from '@yoot/test-kit';
import {IMAGE_URL} from './constants';

export {createTemplate, defineCases, describe, divide, expect, expectParams, it, multiply} from '@yoot/test-kit';

// -- Module Exports --
export {runTestCase, testEach};

function testEach(testCases: TestCase[]) {
  yootTestEach(testCases.map(applyInputDefaults({src: IMAGE_URL})));
}

function runTestCase(testCase: Omit<TestCase, 'description'>) {
  yootRunTestCase(applyInputDefaults({src: IMAGE_URL}, testCase));
}
