import {
  applyInputDefaults,
  runTestCase as yootRunTestCase,
  testEach as yootTestEach,
  type TestCase,
} from '@yoot/test-kit';
import {IMAGE_FILE_EXTENSION, IMAGE_URL, IMAGE_URL_TEMPLATE} from './constants';

// -- Module Exports --
export {getImageUrl, runTestCase, testEach};
export type {TestCase};

function getImageUrl(segment: string, extension: string = ''): string {
  return IMAGE_URL_TEMPLATE.replace('%s', segment.concat(IMAGE_FILE_EXTENSION).concat(extension));
}

function testEach(testCases: TestCase[]) {
  yootTestEach(testCases.map(applyInputDefaults({src: IMAGE_URL})));
}

async function runTestCase(testCase: Omit<TestCase, 'description'>) {
  await yootRunTestCase(applyInputDefaults({src: IMAGE_URL}, testCase));
}
