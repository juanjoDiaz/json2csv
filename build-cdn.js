import path from 'node:path';
import esbuild from 'esbuild';
import glob from 'tiny-glob';
import pkg from './packages/plainjs/package.json' with { type: 'json' };

const replaceDependenciesByJsdelivr = {
  name: 'replace-dependencies-by-jsdelivr',
  setup(build) {
    build.onResolve(
      { namespace: 'file', filter: /^@json2csv\/.*$/ },
      async (args) => {
        if (args.kind !== 'import-statement') return;

        const [, relativePath] = args.path.match(/@json2csv\/(.*)/);
        return {
          path: path.join('..', relativePath, 'index.js'),
          external: true,
          namespace: 'dependency',
        };
      },
    );

    build.onResolve({ namespace: 'file', filter: /^\.\/.*$/ }, (args) => {
      if (args.kind !== 'import-statement') return;

      return {
        path: args.path,
        external: true,
        namespace: 'dependency',
      };
    });

    const dependencies = {
      '@streamparser/json': `https://cdn.jsdelivr.net/npm/@streamparser/json@${pkg.dependencies['@streamparser/json']}/dist/mjs/index.js`,
    };

    build.onResolve(
      {
        namespace: 'file',
        filter: new RegExp(`(?:${Object.keys(dependencies).join('|')})`),
      },
      (args) => {
        if (args.kind !== 'import-statement') return;

        if (dependencies[args.path]) {
          return {
            path: dependencies[args.path] || args.path,
            external: true,
          };
        }
      },
    );
  },
};

const pkgs = ['plainjs', 'whatwg', 'transforms', 'formatters'];

await Promise.all(
  pkgs.map(async (pkg) => {
    const entryPoints = await glob(`packages/${pkg}/src/*.ts`);
    await esbuild.build({
      entryPoints,
      bundle: true,
      target: 'es2019',
      format: 'esm',
      outdir: `dist/cdn/${pkg}`,
      plugins: [replaceDependenciesByJsdelivr],
    });
  }),
);
