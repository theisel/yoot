import {defineCases, describe, expectParams, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should add `dpr` parameter to URL',
    input: {directives: {dpr: 2}},
    expected: expectParams({dpr: '2'}),
  },
]);

describe('Imgix Adapter - Dpr', () => testEach(testCases));
