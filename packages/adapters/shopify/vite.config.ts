import path from 'node:path';
import {mergeConfig} from 'vite';
import config from '../../../vite.config';

export default mergeConfig(config, {
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        register: path.resolve(__dirname, 'src/register'),
      },
    },
  },
  test: {
    setupFiles: [path.resolve(__dirname, 'tests/setup.ts')],
  },
});
