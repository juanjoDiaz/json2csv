import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const pkgFolder = path.resolve();
const distFolder = path.join(pkgFolder, 'dist/cjs/');

await writeFile(
  path.join(distFolder, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, '  '),
);
