import {expect} from 'jsr:@std/expect';
import {describe, it} from 'jsr:@std/testing/bdd';
import adapter, {sanityAdapter} from '../../src/index.ts';

describe('Sanity Adapter Deno Smoke Tests', () => {
  it('should initialize and have expected methods', () => {
    // Verify default and named exports exist
    expect(adapter).toBeDefined();
    expect(sanityAdapter).toBeDefined();

    // Verify default export is the main named export
    expect(adapter).toBe(sanityAdapter);

    // Verify core methods are present and are functions
    expect(typeof adapter.supports).toBe('function');
    expect(typeof adapter.generateUrl).toBe('function');
  });
});
