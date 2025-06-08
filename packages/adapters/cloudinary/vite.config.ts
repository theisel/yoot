import path from 'node:path';
import {mergeConfig} from 'vite';
import rootConfig from '../../../vite.config';

export default mergeConfig(rootConfig, {
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        register: path.resolve(__dirname, 'src/register'),
      },
    },
  },
});
