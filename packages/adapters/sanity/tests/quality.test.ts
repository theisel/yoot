import {defineCases, describe, expectParams, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct parameter when quality is given',
    input: {directives: {quality: 75}},
    expected: expectParams({q: '75'}),
  },
]);

describe('Sanity Adapter - Quality', () => testEach(testCases));
