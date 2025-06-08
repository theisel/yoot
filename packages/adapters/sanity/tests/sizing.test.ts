import {createTemplate, describe, divide, multiply, expectParams} from '@yoot/test-kit';
import type {TestCase} from '@yoot/test-kit';
import {testEach} from './utils';
import {IMAGE_METADATA, IMAGE_URL, IMAGE_URL_NO_DIMS} from './constants';

const describeWith = createTemplate('should generate correct parameters for %s');

const sizingTestCases: TestCase[] = [
  {
    description: describeWith`width only`,
    input: {directives: {width: 100}},
    expected: expectParams({w: '100'}),
  },
  {
    description: describeWith`height only`,
    input: {directives: {height: 100}},
    expected: expectParams({h: '100'}),
  },
  {
    description: describeWith`width and height when both are given`,
    input: {directives: {width: 100, height: 200}},
    expected: expectParams({w: '100', h: '200'}),
  },
  {
    description: describeWith`width and height when aspectRatio and width are given`,
    input: {directives: {width: 100, aspectRatio: 2}},
    expected: expectParams({w: '100', h: `${divide(100, 2, Math.round)}`}), // Height is calculated based on width and aspectRatio
  },
  {
    description: describeWith`width and height when aspectRatio and height are given`,
    input: {directives: {height: 100, aspectRatio: 2}},
    expected: expectParams({w: `${multiply(100, 2, Math.round)}`, h: '100'}), // Width is calculated based on height and aspectRatio
  },
  {
    description: describeWith`width and height when aspectRatio and metadata are given`,
    input: {
      directives: {aspectRatio: 1.777},
      width: 1000,
      height: 1000,
    },
    expected: expectParams({
      w: '1000',
      h: `${divide(1000, 1.777, Math.round)}`,
    }),
  },
  {
    description: describeWith`width and height when aspectRatio and a well formatted URL are given`,
    input: {src: IMAGE_URL, directives: {aspectRatio: 1}},
    expected: expectParams({
      w: IMAGE_METADATA.width,
      h: IMAGE_METADATA.width, // IMAGE_METADATA.width / aspectRatio (1) = IMAGE_METADATA.width
    }),
  },
  {
    // This is an edge test case where the URL is not well formatted, this shouldn't happen in practice.
    // Refer to https://www.sanity.io/docs/image-urls#haosh95L
    description: 'should not set any params when aspectRatio and a badly formatted URL are given',
    input: {src: IMAGE_URL_NO_DIMS, directives: {aspectRatio: 1}},
    expected: expectParams({}),
  },
];

describe('Sanity Adapter - Sizing', () => testEach(sizingTestCases));
