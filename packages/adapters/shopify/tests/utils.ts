import {
  applyInputDefaults,
  runTestCase as yootRunTestCase,
  testEach as yootTestEach,
  type TestCase,
} from '@yoot/test-kit';
import {IMAGE_FILE_EXTENSION, IMAGE_URL, IMAGE_URL_TEMPLATE} from './constants';

export {createTemplate, defineCases, describe, divide, expect, expectString, it, multiply} from '@yoot/test-kit';

// -- Module Exports --
export {getImageUrl, runTestCase, testEach};

function getImageUrl(segment: string, extension: string = ''): string {
  return IMAGE_URL_TEMPLATE.replace('%s', segment.concat(IMAGE_FILE_EXTENSION).concat(extension));
}

function testEach(testCases: TestCase[]) {
  yootTestEach(testCases.map(applyInputDefaults({src: IMAGE_URL})));
}

function runTestCase(testCase: Omit<TestCase, 'description'>) {
  yootRunTestCase(applyInputDefaults({src: IMAGE_URL}, testCase));
}
