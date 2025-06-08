import {defineWorkspace} from 'vitest/config';
import viteConfig from './vite.config.ts';

export default defineWorkspace(viteConfig.test?.projects ?? []);
