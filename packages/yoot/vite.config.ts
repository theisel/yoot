import path from 'node:path';
import {mergeConfig} from 'vite';
import config from '../../vite.config';

export default mergeConfig(config, {
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, './src/index.ts'),
        html: path.resolve(__dirname, './src/html.ts'),
        jsx: path.resolve(__dirname, './src/jsx.ts'),
        internal: path.resolve(__dirname, './src/internal.ts'),
      },
    },
  },
});
