import {expect, test} from 'bun:test';
import {yoot, createAdapter, registerAdapters} from '../../src/index.ts';
import * as html from '../../src/html.ts';
import * as jsx from '../../src/jsx.ts';

test('yoot factory should initialize and return a valid instance with core methods', () => {
  expect(yoot).toBeDefined();
  expect(typeof yoot).toBe('function');

  const ute = yoot('https://cdn.example.com/file.png');

  expect(typeof ute).toBe('function');
  expect(typeof ute.src).toBe('function');
  expect(typeof ute.alt).toBe('function');
  // Directive methods
  expect(typeof ute.aspectRatio).toBe('function');
  expect(typeof ute.crop).toBe('function');
  expect(typeof ute.fit).toBe('function');
  expect(typeof ute.format).toBe('function');
  expect(typeof ute.height).toBe('function');
  expect(typeof ute.h).toBe('function');
  expect(typeof ute.width).toBe('function');
  expect(typeof ute.w).toBe('function');
  // Output methods
  expect(typeof ute.toJSON).toBe('function');
  expect(typeof ute.toString).toBe('function');
});

test('should create and register an adapter', () => {
  expect(typeof createAdapter).toBe('function');
  expect(typeof registerAdapters).toBe('function');

  expect(() => registerAdapters()).not.toThrow();

  const adapter = createAdapter({
    supports: () => true,
    generateUrl: ({src}) => src,
  });

  expect(() => registerAdapters(adapter)).not.toThrow();
});

test('JSX utilities should have expected methods', () => {
  expect(typeof jsx.buildSrcSet).toBe('function');
  expect(typeof jsx.defineSrcSetBuilder).toBe('function');
  expect(typeof jsx.getImgAttrs).toBe('function');
  expect(typeof jsx.getSourceAttrs).toBe('function');
  expect(typeof jsx.withImgAttrs).toBe('function');
  expect(typeof jsx.withSourceAttrs).toBe('function');
});

test('HTML utilities should have expected methods', () => {
  expect(typeof html.buildSrcSet).toBe('function');
  expect(typeof html.defineSrcSetBuilder).toBe('function');
  expect(typeof html.getImgAttrs).toBe('function');
  expect(typeof html.getSourceAttrs).toBe('function');
  expect(typeof html.withImgAttrs).toBe('function');
  expect(typeof html.withSourceAttrs).toBe('function');
});
