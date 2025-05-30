import {beforeEach} from 'vitest';
import {inject} from '@yoot/test-kit';

beforeEach(() => {
  inject(async () => {
    const {yoot, registerAdapters} = await import('@yoot/yoot');
    const {adapter} = await import('../src/core/adapter');

    registerAdapters(adapter);

    return {yoot};
  });
});
