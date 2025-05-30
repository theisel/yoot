import {createTemplate, defineCases, describe, expectParams, testEach} from './utils';

const describeFit = createTemplate('should add `fit=%s` parameter to URL');

const testCases = defineCases([
  {
    description: describeFit`cover`,
    input: {directives: {fit: 'cover'}},
    expected: expectParams({fit: 'crop'}),
  },
  {
    description: describeFit`contain`,
    input: {directives: {fit: 'contain'}},
    expected: expectParams({fit: 'clip'}),
  },
]);

describe('Imgix Adapter - Fit', () => {
  testEach(testCases);
});
