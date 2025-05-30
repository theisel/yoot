import {defineCases, describe, expectParams, it, runTestCase, testEach} from './utils';

// File extensions to test
const testFormats = it.each(['gif', 'jpg', 'png', 'webp']);

const additionalTests = defineCases([
  {
    description: 'should append `auto=format` parameter to URL',
    input: {directives: {format: 'auto'}},
    expected: expectParams({auto: 'format'}),
  },
]);

describe('Imgix Adapter - Format', () => {
  testFormats('should add `fm=%s` parameter to URL', (format) => {
    runTestCase({
      // @ts-expect-error Accept any format value for test purposes
      input: {directives: {format}},
      expected: expectParams({fm: format}),
    });
  });

  testEach(additionalTests);
});
