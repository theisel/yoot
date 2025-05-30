import {defineCases, describe, expectParams, it, runTestCase, testEach} from './utils';

const testFormats = it.each([
  {format: 'jpg', expected: 'jpg'},
  {format: 'png', expected: 'png'},
  {format: 'webp', expected: 'webp'},
]);

const additionalTests = defineCases([
  {
    description: 'should generate correct parameter when format is auto',
    input: {directives: {format: 'auto'}},
    expected: expectParams({auto: 'format'}),
  },
]);

describe('Sanity Adapter - Format', () => {
  testFormats('should generate correct parameter when format is $format', ({format, expected}) => {
    runTestCase({
      // @ts-expect-error Accept any format value for test purposes
      input: {directives: {format}},
      expected: expectParams({fm: expected}),
    });
  });

  testEach(additionalTests);
});
