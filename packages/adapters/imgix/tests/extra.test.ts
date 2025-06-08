import {describe, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {IMAGE_URL_WITH_DIRECTIVES} from './constants';
import {testEach} from './utils';

const testCases: TestCase[] = [
  {
    description: 'should generate correct url from a previously transformed URL',
    input: {src: IMAGE_URL_WITH_DIRECTIVES, directives: {width: 100, height: 100}},
    expected: expectParams({w: '100', h: '100'}),
  },
];

describe('Imgix Adapter - Extra', () => testEach(testCases));
