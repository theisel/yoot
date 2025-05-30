import {IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {defineCases, describe, expectParams, testEach} from './utils';

const testCases = defineCases([
  {
    description: 'should generate correct url with a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 100, height: 100}},
    expected: expectParams({w: '100', h: '100'}),
  },
]);

describe('Imgix Adapter - Extra', () => testEach(testCases));
