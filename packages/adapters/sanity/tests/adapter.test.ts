import {describe, expect, it} from '@yoot/test-kit';
import {getDimensionsFromUrl} from '../src/core/adapter';
import {IMAGE_URL, IMAGE_METADATA, IMAGE_URL_NO_DIMS} from './constants';

describe('Sanity Adapter - Implementation', () => {
  describe('getDimensionsFromUrl', async () => {
    it('should extract dimensions when present in URL', () => {
      const url = new URL(IMAGE_URL);
      expect(getDimensionsFromUrl(url)).toEqual(IMAGE_METADATA);
    });

    it('should extract dimensions with query parameters', () => {
      const url = new URL(`${IMAGE_URL}?fm=webp`);
      expect(getDimensionsFromUrl(url)).toEqual(IMAGE_METADATA);
    });

    it('should return undefined if dimensions are not in the expected format', () => {
      const url = new URL(IMAGE_URL_NO_DIMS);
      expect(getDimensionsFromUrl(url)).toBeUndefined();
    });

    it('should return undefined if the format is slightly off', () => {
      const url = new URL('https://cdn.sanity.io/images/proj/test/img-100x.jpg'); // Missing height
      expect(getDimensionsFromUrl(url)).toBeUndefined();
    });
  });
});
