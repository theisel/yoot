import {describe, expectParams, it, runTestCase} from './utils';

const testFits = it.each([
  {fit: 'cover', params: {fit: 'crop'}},
  {fit: 'contain', params: {fit: 'clip'}},
]);

describe('Sanity Adapter - Fit', () => {
  testFits('should generate correct parameter when fit is $fit', ({fit, params}) => {
    runTestCase({
      // @ts-expect-error Accept any fit value for test purposes
      input: {directives: {fit}},
      expected: expectParams(params),
    });
  });
});
