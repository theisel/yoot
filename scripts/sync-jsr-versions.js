import fs from 'node:fs/promises';
import path from 'node:path';
import {getPackages} from '@manypkg/get-packages';
import * as prettier from 'prettier';

async function syncJsrVersions() {
  const {packages} = await getPackages(process.cwd());

  const publicPackages = packages
    .filter((pkg) => pkg.packageJson.private !== true)
    .sort((a, b) => {
      if (a.packageJson.name === '@yoot/yoot') return -1;
      if (b.packageJson.name === '@yoot/yoot') return 1;
      return a.packageJson.name.localeCompare(b.packageJson.name);
    });

  const yootCoreVersion = publicPackages[0].packageJson.version;

  for (const pkg of publicPackages) {
    const jsrConfig = path.join(pkg.dir, 'deno.json');

    try {
      await fs.access(jsrConfig, fs.constants.W_OK);
    } catch {
      continue;
    }

    try {
      const newNpmVersion = pkg.packageJson.version;

      if (!newNpmVersion) {
        console.warn(`No version found in package.json for ${pkg.packageJson.name}, skipping.`);
        continue;
      }

      const jsrConfigContents = JSON.parse(await fs.readFile(jsrConfig, 'utf-8'));

      if (jsrConfigContents.version !== newNpmVersion) {
        console.log(
          `Updating JSR version for ${pkg.packageJson.name}: ${jsrConfigContents.version} -> ${newNpmVersion}`,
        );
        // Update JSR version
        jsrConfigContents.version = newNpmVersion;
        jsrConfigContents.imports ??= {};

        // Update `@yoot/yoot` import version for packages that use it
        if ('@yoot/yoot' in jsrConfigContents.imports) {
          console.log(
            `Updating @yoot/yoot import version for ${pkg.packageJson.name}: ${jsrConfigContents.imports['@yoot/yoot']} -> jsr:@yoot/yoot@${yootCoreVersion}`,
          );
          jsrConfigContents.imports['@yoot/yoot'] = `jsr:@yoot/yoot@${yootCoreVersion}`;
        }

        const source = JSON.stringify(jsrConfigContents, null, 2);
        // Format with Prettier
        const contents = await prettier.format(source, {parser: 'json'});
        // Write the updated contents back to the file
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
