import {defineCases, describe, expectParams, testEach} from './utils';

const testCases = defineCases([
  {
    description: "should generate correct 'dpr' parameter",
    input: {directives: {dpr: 2}},
    expected: expectParams({dpr: '2'}),
  },
]);

describe('Sanity Adapter - Dpr', () => testEach(testCases));
