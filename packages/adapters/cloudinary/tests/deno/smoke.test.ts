import {expect} from 'jsr:@std/expect';
import {describe, it} from 'jsr:@std/testing/bdd';
import adapter, {cloudinaryAdapter} from '../../src/index.ts';

describe('Cloudinary Adapter Deno Smoke Tests', () => {
  it('should initialize and have expected methods', () => {
    // Verify default and named exports exist
    expect(adapter).toBeDefined();
    expect(cloudinaryAdapter).toBeDefined();

    // Verify default export is the main named export
    expect(adapter).toBe(cloudinaryAdapter);

    // Verify core methods are present and are functions
    expect(typeof adapter.supports).toBe('function');
    expect(typeof adapter.generateUrl).toBe('function');
  });
});
