import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {unstable_startWorker} from 'wrangler';
import {afterAll, beforeAll, describe, expect, it} from '@yoot/test-kit';

const dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Cloudinary Cloudflare Smoke Tests', () => {
  let worker: Awaited<ReturnType<typeof unstable_startWorker>>;

  beforeAll(async () => {
    worker = await unstable_startWorker({
      config: path.join(dirname, 'wrangler.toml'),
    });
  });

  afterAll(async () => {
    await worker.dispose();
  });

  it('should execute the fetch handler and internal assertion should pass', {timeout: 30_000}, async () => {
    const response = await worker.fetch('http://localhost');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('test success');
  });
});
