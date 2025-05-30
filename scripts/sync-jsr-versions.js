import fs from 'node:fs/promises';
import path from 'node:path';
import {getPackages} from '@manypkg/get-packages';
import * as prettier from 'prettier';

async function syncJsrVersions() {
  const {packages} = await getPackages(process.cwd());
  const publicPackages = packages.filter((pkg) => pkg.packageJson.private !== true);

  for (const pkg of publicPackages) {
    const packageJsonPath = path.join(pkg.dir, 'package.json');
    const jsrConfig = path.join(pkg.dir, 'deno.json');

    try {
      await fs.access(jsrConfig, fs.constants.W_OK);
    } catch {
      continue;
    }

    try {
      const packageJsonContents = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const newNpmVersion = packageJsonContents.version;

      if (!newNpmVersion) {
        console.warn(`No version found in package.json for ${pkg.packageJson.name}, skipping.`);
        continue;
      }

      const jsrConfigContents = JSON.parse(await fs.readFile(jsrConfig, 'utf-8'));

      if (jsrConfigContents.version !== newNpmVersion) {
        console.log(
          `Updating JSR version for ${pkg.packageJson.name}: ${jsrConfigContents.version} -> ${newNpmVersion}`,
        );

        jsrConfigContents.version = newNpmVersion;

        const source = JSON.stringify(jsrConfigContents, null, 2);
        const contents = await prettier.format(source, {parser: 'json'});

        await fs.writeFile(jsrConfig, contents, 'utf-8');
      } else {
        console.log(`JSR version for ${pkg.packageJson.name} is up to date (${newNpmVersion}).`);
      }
    } catch (error) {
      console.error(`Error processing package ${pkg.packageJson.name}:`, error);
    }
  }
  console.log('JSR versioning has completed');
}

syncJsrVersions().catch((err) => {
  console.error('Failed to synchronize JSR versions:', err);
  process.exit(1);
});
