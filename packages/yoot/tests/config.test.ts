import {describe, expect, it} from '@yoot/test-kit';
import {beforeEach} from 'vitest';

type ConfigModue = Awaited<typeof import('../src/core/config')>;

let defineConfig: ConfigModue['defineConfig'];
let mergeConfig: ConfigModue['mergeConfig'];
let getConfig: ConfigModue['_getConfig'];

beforeEach(async () => {
  const module = await import('../src/core/config');

  defineConfig = module.defineConfig;
  mergeConfig = module.mergeConfig;
  getConfig = module._getConfig;
});

describe('@yoot/yoot - Config', () => {
  it('should not allow mutations to affect internal config', () => {
    const config = {foo: 123};
    // @ts-expect-error custom field for test
    defineConfig(config);
    // Mutate the config object
    config.foo = 456;

    expect(getConfig()).toStrictEqual({foo: 123});
  });

  it('should fully replace the existing config with defineConfig', () => {
    // @ts-expect-error custom field for test
    defineConfig({foo: 123});
    defineConfig({});

    expect(getConfig()).toEqual({});
  });

  it('should perform a shallow merge (not deep)', () => {
    // @ts-expect-error nested for test
    defineConfig({foo: 123, bar: {a: 1}});
    // @ts-expect-error nested for test
    mergeConfig({bar: {b: 2}});

    expect(getConfig()).toEqual({
      foo: 123,
      bar: {b: 2},
    });
  });
});
