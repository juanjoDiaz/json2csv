
import { argv } from 'process';
import path from 'path';
import { writeFile, rename, unlink } from 'fs/promises';
import esbuild from 'esbuild';
import glob from 'tiny-glob';

const [, pathTothis, pkg] = argv;

const pkgFolder = path.resolve();
const distFolder = path.join(pkgFolder, 'dist/cjs/');
console.log(pkgFolder, distFolder)
const pkgJson = path.join(pkgFolder, 'package.json');
const tempPkgJson = path.join(pkgFolder, 'package.json.orig');
console.log(pkgFolder, distFolder)
await rename(pkgJson, tempPkgJson);
await writeFile(pkgJson, JSON.stringify({ type: "commonjs" }, null, '  '));
const entryPoints = await glob(`${pkgFolder}/src/*`);
await esbuild.build({
  entryPoints,
  bundle: false,
  platform: 'node',
  format: 'cjs',
  outdir: distFolder,
});
await unlink(pkgJson);
await rename(tempPkgJson, pkgJson);

await writeFile(path.join(distFolder, 'package.json'), JSON.stringify({ type: "commonjs" }, null, '  '));



