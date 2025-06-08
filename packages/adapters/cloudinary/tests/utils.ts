import {
  applyInputDefaults,
  runTestCase as yootRunTestCase,
  testEach as yootTestEach,
  type TestCase,
} from '@yoot/test-kit';
import {IMAGE_URL, IMAGE_URL_TEMPLATE} from './constants';

// -- Module Exports --
export {getImageUrl, runTestCase, testEach};

function getImageUrl(segment: string = ''): string {
  segment &&= `/${segment}`;
  return IMAGE_URL_TEMPLATE.replace('%s', segment);
}

function testEach(testCases: TestCase[]) {
  yootTestEach(testCases.map(applyInputDefaults({src: IMAGE_URL})));
}

async function runTestCase(testCase: Omit<TestCase, 'description'>) {
  await yootRunTestCase(applyInputDefaults({src: IMAGE_URL}, testCase));
}
