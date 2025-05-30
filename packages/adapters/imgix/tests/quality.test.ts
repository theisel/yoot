import {defineCases, describe, expectParams, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should add `q` parameter to URL',
    input: {directives: {quality: 75}},
    expected: expectParams({q: '75'}),
  },
]);

describe('Imgix Adapter - Quality', () => testEach(testCases));
