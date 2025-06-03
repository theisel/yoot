import {expect, test} from 'bun:test';
import adapter, {cloudinaryAdapter} from '../../src/index.ts';

test('should initialize and have expected methods', () => {
  // Verify default and named exports exist
  expect(adapter).toBeDefined();
  expect(cloudinaryAdapter).toBeDefined();

  // Verify default export is the main named export
  expect(adapter).toBe(cloudinaryAdapter);

  // Verify core methods are present and are functions
  expect(typeof adapter.supports).toBe('function');
  expect(typeof adapter.generateUrl).toBe('function');
});
